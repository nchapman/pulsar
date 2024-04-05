import { invoke } from '@tauri-apps/api';
import { NebulaContext } from './context';

export class NebulaModel {
  private model: string;

  constructor(model: string) {
    this.model = model
  }

  public static async init_model(model: string, mmproj?: string): NebulaModel {
    if (typeof mmproj !== 'undefined') {
      let mmodel = await invoke('plugin:nebula|init_model_with_mmproj', {
        modelPath: model,
        modelMmproj: mmproj,
        modelOptions: {},
      });
      return new NebulaModel(mmodel)
    } else {
      let mmodel = await invoke('plugin:nebula|init_model', {
        modelPath: model,
        modelOptions: {},
      });
      return new NebulaModel(mmodel)
    }
  };

  public async drop() {
    await invoke('plugin:nebula|drop_model', {
      model: this.model
    });
  };


  public async create_context(): NebulaContext {
    const ctx = await NebulaContext.init_context(this);
    return ctx;
  };
}
