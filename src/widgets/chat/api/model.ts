import { invoke } from '@tauri-apps/api';

import { loge } from '@/shared/lib/Logger';

import { NebulaContext } from './context';

export class NebulaModel {
  public model: string;

  constructor(model: string) {
    this.model = model;
  }

  public static async initModel(model: string, mmproj?: string): Promise<NebulaModel> {
    try {
      if (typeof mmproj !== 'undefined') {
        await invoke<string>('plugin:nebula|init_model_with_mmproj', {
          modelPath: model,
          modelMmproj: mmproj,
          modelOptions: {},
        });
        return new NebulaModel(model);
      }

      await invoke<string>('plugin:nebula|init_model', {
        modelPath: model,
        modelOptions: {},
      });
    } catch (e) {
      loge('chatApi', `Failed to load model, rust error: ${e}`);
    }

    return new NebulaModel(model);
  }

  public async drop() {
    await invoke('plugin:nebula|drop_model', {
      model: this.model,
    });
  }

  public async createContext(
    cctx: { message: string; is_user: boolean }[] = []
  ): Promise<NebulaContext> {
    const ctx = await NebulaContext.initContext(this, cctx);
    return ctx;
  }
}

