import { invoke } from '@tauri-apps/api/tauri';
// When using the Tauri global script (if not using the npm package)
// Be sure to set `build.withGlobalTauri` in `tauri.conf.json` to true
// const { invoke } = window.__TAURI__;

class DownloadCenter {
  downloadFile(file: string) {
    invoke('download_file');
  }
}

export const downloadCenter = new DownloadCenter();

