import { invoke } from '@tauri-apps/api/tauri';

export async function getFileSizeBytes(path: string): Promise<number> {
  return invoke('plugin:fs|get_byte_size', { path });
}

