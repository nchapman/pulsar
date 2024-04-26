import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';

import { fileToBase64 } from '@/shared/lib/func';

import { NebulaModel } from './NebulaModel.ts';

type NebulaPredictPayload = {
  model: string;
  context: string;
  token: string;
  finished: boolean;
};

export class NebulaContext {
  private model: NebulaModel;

  private contextId: string;

  public onToken?: (p: { token: string; finished: boolean }) => void;

  public onComplete?: (p: { finished: boolean }) => void;

  constructor(model: NebulaModel, ctx: string) {
    this.model = model;
    this.contextId = ctx;
  }

  public static async initContext(
    model: NebulaModel,
    cctx: { message: string; is_user: boolean }[] = []
  ): Promise<NebulaContext> {
    const ctx = await invoke<string>('plugin:nebula|model_init_context', {
      modelPath: model.model,
      contextOptions: { ctx: cctx, n_ctx: 20000 },
    });

    return new NebulaContext(model, ctx);
  }

  public async drop() {
    await invoke('plugin:nebula|model_drop_context', {
      modelPath: this.model.model,
      contextId: this.contextId,
    });
  }

  public async evaluateString(data: string, useBos: boolean = false) {
    await invoke('plugin:nebula|model_context_eval_string', {
      modelPath: this.model.model,
      contextId: this.contextId,
      data,
      useBos,
    });
  }

  public async evaluateImage(file: File, prompt: string) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const base64 = await fileToBase64(file);

    await invoke('plugin:nebula|model_context_eval_image', {
      modelPath: this.model.model,
      contextId: this.contextId,
      base64EncodedImage: base64,
      prompt,
    });
  }

  public async predict(maxLength: number) {
    const unlisten = await listen<NebulaPredictPayload>('nebula-predict', (event) => {
      if (event.payload.model === this.model.model && event.payload.context === this.contextId) {
        if (!event.payload.finished) {
          this.onToken?.({ token: event.payload.token, finished: event.payload.finished });
        } else {
          this.onComplete?.({ finished: event.payload.finished });
        }
      }
    });

    await invoke('plugin:nebula|model_context_predict', {
      modelPath: this.model.model,
      contextId: this.contextId,
      maxLen: maxLength,
    });

    unlisten();
  }
}
