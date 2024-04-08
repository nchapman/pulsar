import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';

import { NebulaModel } from './model';

type NebulaPredictPayload = {
  model: string;
  context: string;
  token: string | null;
  finished: boolean;
};

export class NebulaContext {
  private model: NebulaModel;

  private ctx: string;

  public onToken?: (p: { token: string | null; finished: boolean }) => void;

  public onComplete?: (p: { finished: boolean }) => void;

  constructor(model: NebulaModel, ctx: string) {
    this.model = model;
    this.ctx = ctx;
  }

  public static async init_context(model: NebulaModel): Promise<NebulaContext> {
    const ctx = await invoke<string>('plugin:nebula|model_init_context', {
      model: model.model,
      contextOptions: {},
    });

    return new NebulaContext(model, ctx);
  }

  public async drop() {
    await invoke('plugin:nebula|model_drop_context', {
      model: this.model.model,
      context: this.ctx,
    });
  }

  public async eval_string(data: string, useBos: boolean = false) {
    await invoke('plugin:nebula|model_context_eval_string', {
      model: this.model.model,
      context: this.ctx,
      data,
      useBos,
    });
  }

  public async predict(maxLength: number) {
    const unlisten = await listen<NebulaPredictPayload>('nebula-predict', (event) => {
      if (event.payload.model === this.model.model && event.payload.context === this.ctx) {
        if (!event.payload.finished) {
          this.onToken?.({ token: event.payload.token, finished: event.payload.finished });
        } else {
          this.onComplete?.({ finished: event.payload.finished });
        }
      }
    });

    await invoke('plugin:nebula|model_context_predict', {
      model: this.model.model,
      context: this.ctx,
      maxLen: maxLength,
    });

    unlisten();
  }
}

