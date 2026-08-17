use serde::{Deserialize, Serialize};
use sjmcl_types::error::SJMCLResult;
use std::fs;
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest;

use crate::launcher_config::commands::retrieve_launcher_config;
use crate::resource::helpers::misc::get_download_api;
use crate::resource::helpers::misc::set_auto_source_preference;
use crate::resource::models::{GameClientResourceInfo, ResourceError, ResourceType, SourceType};

#[derive(Serialize, Deserialize, Default)]
struct VersionManifest {
  pub latest: LatestVersion,
  pub versions: Vec<GameResource>,
}

#[derive(Debug, PartialEq, Eq, Clone, Deserialize, Serialize, Default)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct GameResource {
  pub id: String,
  #[serde(rename = "type")]
  pub game_type: String,
  pub release_time: String,
  pub time: String,
  pub url: String,
}

#[derive(Serialize, Deserialize, Default)]
struct LatestVersion {
  pub release: String,
  pub snapshot: String,
}

pub async fn get_game_version_manifest(
  app: &AppHandle,
  priority_list: &[SourceType],
) -> SJMCLResult<Vec<GameClientResourceInfo>> {
  let client = app.state::<reqwest::Client>();
  let auto_select = retrieve_launcher_config(app.clone())
    .is_ok_and(|config| config.download.source.strategy == "auto");
  let sources = if priority_list.is_empty() {
    vec![SourceType::BMCLAPIMirror, SourceType::Official]
  } else {
    priority_list.to_vec()
  };

  for source_type in sources {
    // v2 is the current Mojang manifest; keep v1 as a compatibility fallback for mirrors.
    for resource_type in [
      ResourceType::VersionManifestV2,
      ResourceType::VersionManifest,
    ] {
      let Ok(url) = get_download_api(source_type, resource_type) else {
        continue;
      };
      let response = match tokio::time::timeout(
        std::time::Duration::from_secs(15),
        client.get(url).send(),
      )
      .await
      {
        Ok(Ok(resp)) if resp.status().is_success() => resp,
        _ => continue,
      };

      let manifest = match response.json::<VersionManifest>().await {
        Ok(m) => m,
        Err(_) => continue,
      };

      save_version_list_to_cache(app, &manifest.versions);
      if auto_select {
        set_auto_source_preference(source_type == SourceType::Official);
      }
      return Ok(to_game_version_list(manifest.versions));
    }
  }

  load_version_list_from_cache(app).ok_or_else(|| ResourceError::NetworkError.into())
}

fn to_game_version_list(versions: Vec<GameResource>) -> Vec<GameClientResourceInfo> {
  versions
    .into_iter()
    .map(|info| {
      let april_fool =
        info.release_time.contains("04-01") && semver::Version::parse(&info.id).is_err();
      GameClientResourceInfo {
        id: info.id,
        game_type: if april_fool {
          "april_fools".to_string()
        } else {
          info.game_type
        },
        release_time: info.release_time,
        url: info.url,
      }
    })
    .collect()
}

fn save_version_list_to_cache(app: &AppHandle, versions: &[GameResource]) {
  let cache_dir = match app.path().app_cache_dir().ok() {
    Some(dir) => dir,
    None => return,
  };

  if !cache_dir.exists() && fs::create_dir_all(&cache_dir).is_err() {
    return;
  }

  let file_path = cache_dir.join("game_versions.json");
  let _ = fs::write(&file_path, serde_json::to_vec(versions).unwrap_or_default());

  let file_path = cache_dir.join("game_versions.txt");
  let mut ids: Vec<String> = versions.iter().map(|v| v.id.clone()).collect();
  ids.reverse(); // reverse order

  let content = ids.join("\n");
  let _ = fs::write(file_path, content);
}

fn load_version_list_from_cache(app: &AppHandle) -> Option<Vec<GameClientResourceInfo>> {
  let cache_dir = app.path().app_cache_dir().ok()?;
  let data = fs::read(cache_dir.join("game_versions.json")).ok()?;
  let versions = serde_json::from_slice::<Vec<GameResource>>(&data).ok()?;
  if versions.is_empty() {
    None
  } else {
    Some(to_game_version_list(versions))
  }
}
