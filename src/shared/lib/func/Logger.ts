import { error, info } from 'tauri-plugin-log';

export function logi(tag: string, msg: string) {
  info(`[${tag}] ${msg}`);
}

export function loge(tag: string, msg: string) {
  error(`[${tag}] ${msg}`);
}
