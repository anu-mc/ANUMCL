use serde::Deserialize;
use serde::de::Deserializer;
use serde_json::Value;

const LEGACY_SJMC_DISCOVER_ENDPOINT: &str = "https://mc.sjtu.cn/api-sjmcl/article";
const AHNUMC_DISCOVER_ENDPOINT: &str = "https://api.ahnumc.org/v1/articles";

// Deserializing discover sources from old and new formats.
// Migrated from Vec<String> to Vec<(String, bool)> with default enabled=true
pub fn deserialize_discover_sources<'de, D>(
  deserializer: D,
) -> Result<Vec<(String, bool)>, D::Error>
where
  D: Deserializer<'de>,
{
  let value = match Value::deserialize(deserializer) {
    Ok(value) => value,
    Err(_) => return Ok(Vec::default()),
  };

  let items = match value.as_array() {
    Some(items) => items,
    None => return Ok(Vec::default()),
  };

  Ok(
    items
      .iter()
      .filter_map(|item| match item {
        Value::String(url) => Some((url.to_string(), true)),
        Value::Array(tuple) if tuple.len() == 2 => {
          let url = tuple.first()?.as_str()?;
          let enabled = tuple.get(1)?.as_bool()?;
          Some((url.to_string(), enabled))
        }
        _ => None,
      })
      .map(|(url, enabled)| {
        if url == LEGACY_SJMC_DISCOVER_ENDPOINT {
          (AHNUMC_DISCOVER_ENDPOINT.to_string(), enabled)
        } else {
          (url, enabled)
        }
      })
      .collect(),
  )
}
