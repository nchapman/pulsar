import { invoke } from '@tauri-apps/api';

type SystemInfo = {
  totalMemory: number;
  availableMemory: number;
};

/**
 * Retrieves the system information.
 * @returns A promise that resolves to the system information. totalMemory and availableMemory are in bytes.
 */
export async function getSystemInfo(): Promise<SystemInfo> {
  return invoke<SystemInfo>('plugin:system|get_system_info');
}
