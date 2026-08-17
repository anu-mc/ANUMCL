use serde::{Deserialize, Serialize};
use sjmcl_types::error::SJMCLResult;
use std::io::Read;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::Duration;
use tauri::path::BaseDirectory;
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest;
use url::Url;

use crate::account::helpers::authlib_injector::constants::AUTHLIB_INJECTOR_JAR_NAME;
use crate::account::models::AccountError;
use crate::launcher_config::models::LauncherConfig;
use crate::resource::helpers::misc::{
  convert_url_to_target_source, get_download_api, get_source_priority_list,
};
use crate::resource::models::{ResourceType, SourceType};

#[derive(Debug, PartialEq, Eq, Clone, Deserialize, Serialize)]
pub struct AuthlibInjectorMeta {
  pub version: String,
  pub download_url: String,
}

pub fn get_jar_path(app: &AppHandle) -> SJMCLResult<PathBuf> {
  Ok(
    app
      .path()
      .resolve::<PathBuf>(AUTHLIB_INJECTOR_JAR_NAME.into(), BaseDirectory::AppData)?,
  )
}

async fn get_latest_meta(
  app: &AppHandle,
  priority_list: &[SourceType],
) -> SJMCLResult<(AuthlibInjectorMeta, SourceType)> {
  let client = app.state::<reqwest::Client>();

  for source in priority_list.iter() {
    let url = get_download_api(*source, ResourceType::AuthlibInjector)?;
    let Ok(Ok(response)) = tokio::time::timeout(
      Duration::from_secs(15),
      client.get(url.join("artifact/latest.json")?).send(),
    )
    .await
    else {
      continue;
    };

    if response.status().is_success()
      && let Ok(meta) = response.json::<AuthlibInjectorMeta>().await
    {
      return Ok((meta, *source));
    }
  }

  Err(AccountError::NoDownloadApi.into())
}

fn get_local_version(app: &AppHandle) -> SJMCLResult<String> {
  let jar_path = get_jar_path(app)?;
  if !jar_path.exists() {
    return Err(AccountError::NotFound.into());
  }

  let file = std::fs::File::open(jar_path)?;

  let mut archive = zip::ZipArchive::new(file)?;
  let mut file = archive.by_name("META-INF/MANIFEST.MF")?;
  let mut content = String::new();

  file.read_to_string(&mut content)?;

  let version_line = content
    .lines()
    .find(|line| line.starts_with("Implementation-Version:"))
    .ok_or(AccountError::ParseError)?;

  let version = version_line
    .split(':')
    .nth(1)
    .ok_or(AccountError::ParseError)?
    .trim()
    .to_string();

  Ok(version)
}

async fn download(app: &AppHandle, url: Url, priority_list: &[SourceType]) -> SJMCLResult<()> {
  let client = app.state::<reqwest::Client>();
  let jar_path = get_jar_path(app)?;
  let mut candidates = Vec::with_capacity(priority_list.len() + 1);

  for source in priority_list {
    if let Ok(candidate) =
      convert_url_to_target_source(&url, &[ResourceType::AuthlibInjector], source)
      && !candidates.contains(&candidate)
    {
      candidates.push(candidate);
    }
  }
  if !candidates.contains(&url) {
    candidates.push(url);
  }

  for candidate in candidates {
    let Ok(Ok(bytes)) = tokio::time::timeout(Duration::from_secs(45), async {
      client
        .get(candidate)
        .send()
        .await?
        .error_for_status()?
        .bytes()
        .await
    })
    .await
    else {
      continue;
    };

    std::fs::write(&jar_path, bytes).map_err(|_| AccountError::SaveError)?;
    return Ok(());
  }

  Err(AccountError::NetworkError.into())
}

pub async fn check_authlib_jar(app: &AppHandle) -> SJMCLResult<()> {
  let (latest_meta, meta_source) = {
    let config_state = app.state::<Mutex<LauncherConfig>>();
    let launcher_config = config_state.lock()?.clone();
    get_latest_meta(app, &get_source_priority_list(&launcher_config)).await?
  };

  if let Ok(local_version) = get_local_version(app)
    && local_version == latest_meta.version
  {
    println!("Authlib-Injector up to date: {}", local_version);
    return Ok(());
  }

  println!(
    "Authlib-Injector new version downloading: {}",
    latest_meta.version
  );
  let priority_list = {
    let config_state = app.state::<Mutex<LauncherConfig>>();
    let launcher_config = config_state.lock()?.clone();
    let mut priority_list = get_source_priority_list(&launcher_config);
    priority_list.retain(|source| *source != meta_source);
    priority_list.insert(0, meta_source);
    priority_list
  };
  download(app, Url::parse(&latest_meta.download_url)?, &priority_list).await?;

  Ok(())
}
