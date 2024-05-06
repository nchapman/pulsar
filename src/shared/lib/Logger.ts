import { error, info } from 'tauri-plugin-log';

export function logi(tag: string, msg: string | string[] | null | undefined) {
  info(`[${tag}] ${msg}`);
}

export function loge(tag: string, msg: string | string[] | null | undefined) {
  error(`[${tag}] ${msg}`);
}
