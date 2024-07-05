import { invoke } from '@tauri-apps/api/tauri';

export async function getFileSizeBytes(path: string): Promise<number> {
  return invoke('plugin:fs|get_byte_size', { path });
}

export async function getFileSha256(path: string): Promise<string> {
  return invoke('plugin:fs|get_file_sha_256', { path });
}

