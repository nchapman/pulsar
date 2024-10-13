import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';

import { loge } from '@/shared/lib/func';

import { NebulaContext } from './NebulaContext.ts';

type ModelLoadProgress = {
  model: string;
  progress: number;
};

export class NebulaModel {
  public model: string;

  constructor(model: string) {
    this.model = model;
  }

  public static async initModel(
    model: string,
    mmproj?: string,
    loadProgressCallback?: (progress: number) => void
  ): Promise<NebulaModel> {
    appWindow.listen<ModelLoadProgress>('nebula://load-progress', ({ payload }) => {
      if (payload.model === model && loadProgressCallback) {
        loadProgressCallback(payload.progress);
      }
    });
    try {
      if (typeof mmproj !== 'undefined') {
        await invoke<string>('plugin:nebula|init_model_with_mmproj', {
          modelPath: model,
          mmprojPath: mmproj,
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

  public async drop(modelPath: string): Promise<void> {
    await invoke('plugin:nebula|drop_model', {
      model: this.model,
      modelPath,
    });
  }

  public async createContext(
    cctx: { message: string; is_user: boolean }[] = []
  ): Promise<NebulaContext> {
    const ctx = await NebulaContext.initContext({ model: this, cctx });
    return ctx;
  }
}
