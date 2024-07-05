use serde::{ser::Serializer, Serialize};
use sha2::{Digest, Sha256};
use std::{fs, io};

use tauri::{
    command,
    plugin::{Builder as PluginBuilder, TauriPlugin},
    Runtime,
};

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

type Result<T> = std::result::Result<T, Error>;

#[command]
fn get_byte_size(path: &str) -> Result<u64> {
    let metadata = fs::metadata(path)?;
    Ok(metadata.len())
}

#[command]
pub async fn get_file_sha_256(path: &str) -> Result<String> {
    let mut hasher = Sha256::new();
    let mut file = fs::File::open(path)?;

    io::copy(&mut file, &mut hasher)?;
    let hash_bytes = hasher.finalize();
    Ok(format!("{:x}", hash_bytes))
}

pub fn init_plugin<R: Runtime>() -> TauriPlugin<R> {
    PluginBuilder::new("fs")
        .invoke_handler(tauri::generate_handler![get_byte_size, get_file_sha_256])
        .build()
}

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::Path;
    use tauri::test::{mock_context, noop_assets, MockRuntime};

    fn before_each() -> tauri::App<MockRuntime> {
        let app = tauri::test::mock_builder()
            .plugin(super::init_plugin())
            .build(mock_context(noop_assets()))
            .unwrap();

        let source_path = Path::new("tests/smallFile.txt");
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();

        let dest_path = app_data_dir.join("smallFile.txt");

        if !dest_path.exists() {
            fs::copy(source_path, dest_path).unwrap();
        }

        app
    }

    #[test]
    fn test_get_byte_size() {
        let app = before_each();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_path = app_data_dir
            .join("smallFile.txt")
            .to_string_lossy()
            .to_string();
        let result = super::get_byte_size(&model_path).unwrap();
        assert_eq!(result, 50);
    }

    #[test]
    fn test_get_byte_size_invalid_path() {
        let model_path = "invalid_path".to_string();
        let result = super::get_byte_size(&model_path);
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_sample_model_sha_256() {
        let app = before_each();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_path = app_data_dir
            .join("smallFile.txt")
            .to_string_lossy()
            .to_string();
        let result = super::get_file_sha_256(&model_path).await.unwrap();
        assert_eq!(
            result,
            "7c4df6533de1d94d4d862f3472255e92e2292180b027819e60ebb51fcdc50c4e"
        );
    }

    #[tokio::test]
    async fn test_sample_model_sha_256_invalid_path() {
        let model_path = "invalid_path".to_string();
        let result = super::get_file_sha_256(&model_path).await;
        assert!(result.is_err());
    }
}
