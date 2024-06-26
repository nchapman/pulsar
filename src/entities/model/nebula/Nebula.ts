import { invoke } from '@tauri-apps/api';

export class Nebula {
  public static async getLoadedModels() {
    return invoke<string>('plugin:nebula|get_loaded_models');
  }

  public static async dropAll() {
    return invoke('plugin:nebula|drop_all');
  }
}

