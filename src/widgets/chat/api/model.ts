import { invoke } from '@tauri-apps/api';

import { NebulaContext } from './context';

export class NebulaModel {
  public model: string;

  constructor(model: string) {
    this.model = model;
  }

  public static async initModel(model: string, mmproj?: string): Promise<NebulaModel> {
    if (typeof mmproj !== 'undefined') {
      const mmodel = await invoke<string>('plugin:nebula|init_model_with_mmproj', {
        modelPath: model,
        modelMmproj: mmproj,
        modelOptions: {},
      });
      return new NebulaModel(mmodel);
    }
    const mmodel = await invoke<string>('plugin:nebula|init_model', {
      modelPath: model,
      modelOptions: {},
    });
    return new NebulaModel(mmodel);
  }

  public async drop() {
    await invoke('plugin:nebula|drop_model', {
      model: this.model,
    });
  }

  public async create_context(
    cctx: { message: string; is_user: boolean }[] = []
  ): Promise<NebulaContext> {
    const ctx = await NebulaContext.init_context(this, cctx);
    return ctx;
  }
}
