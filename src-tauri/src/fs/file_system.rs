use serde::{ser::Serializer, Serialize};
use std::fs;

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
fn get_byte_size(path: String) -> Result<u64> {
    let metadata = fs::metadata(path)?;
    Ok(metadata.len())
}

pub fn init_plugin<R: Runtime>() -> TauriPlugin<R> {
    PluginBuilder::new("fs")
        .invoke_handler(tauri::generate_handler![get_byte_size])
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

        let source_path = Path::new("tests/evolvedseeker_1_3.Q2_K.gguf");
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_dir = app_data_dir.join("models");
        if !model_dir.exists() {
            fs::create_dir_all(model_dir.clone()).unwrap();
        }

        let model_path = model_dir.join("evolvedseeker_1_3.Q2_K.gguf");

        if !model_path.exists() {
            fs::copy(source_path, model_path).unwrap();
        }

        app
    }

    #[test]
    fn test_get_byte_size() {
        let app = before_each();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_path = app_data_dir
            .join("models/evolvedseeker_1_3.Q2_K.gguf")
            .to_string_lossy()
            .to_string();
        let result = super::get_byte_size(model_path).unwrap();
        assert_eq!(result, 631706592);
    }

    #[test]
    fn test_get_byte_size_invalid_path() {
        let model_path = "invalid_path".to_string();
        let result = super::get_byte_size(model_path);
        assert!(result.is_err());
    }
}
