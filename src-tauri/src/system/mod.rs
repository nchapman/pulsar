use serde::{Serialize, Serializer};
use sysinfo::System;
use tauri::{
    command,
    plugin::{Builder as PluginBuilder, TauriPlugin},
    Runtime,
};

#[derive(Debug, thiserror::Error)]
pub enum SystemError {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

impl Serialize for SystemError {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct SystemInfo {
    total_memory: u64,
    available_memory: u64,
}

#[command]
fn get_system_info() -> SystemInfo {
    let s = System::new_all();
    SystemInfo {
        total_memory: s.total_memory(),
        available_memory: s.available_memory(),
    }
}

pub fn init_plugin<R: Runtime>() -> TauriPlugin<R> {
    PluginBuilder::new("system")
        .invoke_handler(tauri::generate_handler![get_system_info])
        .build()
}
