export function isDev() {
  // @ts-ignore
  return !window.__TAURI_IPC__;
}
