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
fn get_byte_size(path: &str) -> Result<u64> {
    let metadata = fs::metadata(path)?;
    Ok(metadata.len())
}

pub fn init_plugin<R: Runtime>() -> TauriPlugin<R> {
    PluginBuilder::new("fs")
        .invoke_handler(tauri::generate_handler![get_byte_size])
        .build()
}
