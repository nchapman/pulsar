import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';

import { ChatMsg } from '@/db/chat';
import { NebulaModel } from './NebulaModel.ts';
import { urlToBase64 } from '@/widgets/chat/lib/utils/urlToBase64.ts';

type NebulaPredictPayload = {
  model: string;
  context: string;
  token: string;
  finished: boolean;
};

type ContextOptions = {
  seed?: number;
  n_ctx?: number;
  n_threads?: number;
  user_format?: string;
  assistant_format?: string;
  prompt_format?: string;
  prompt_format_with_image?: string;
  stop_tokens?: string[];
  ctx?: {
    message: string;
    is_user: boolean;
  }[];
};

const DEFAULT_TEMP = 0.5;

export class NebulaContext {
  private model: NebulaModel;

  private contextId: string;

  public onToken?: (p: { token: string; finished: boolean }) => void;

  public onComplete?: (p: { finished: boolean }) => void;

  constructor(model: NebulaModel, ctx: string) {
    this.model = model;
    this.contextId = ctx;
  }

  public static async initContext({
    model,
    cctx = [],
  }: {
    model: NebulaModel;
    cctx: { message: string; is_user: boolean }[];
  }): Promise<NebulaContext> {
    const contextOptions: ContextOptions = { n_ctx: 20000 };
    const ctx = await invoke<string>('plugin:nebula|model_init_context', {
      modelPath: model.model,
      contextOptions,
    });

    const ccc = new NebulaContext(model, ctx);
    if (cctx.length > 0) {
      const dialog = cctx.map((val) => ({
        content: val.message,
        role: val.is_user ? 'user' : 'assistant',
      }));
      await invoke('plugin:nebula|model_context_eval', {
        modelPath: ccc.model.model,
        contextId: ccc.contextId,
        dialog,
      });
    }
    return ccc;
  }

  public async drop() {
    await invoke('plugin:nebula|model_drop_context', {
      modelPath: this.model.model,
      contextId: this.contextId,
    });
  }

  public async evaluate(data: ChatMsg[]) {
    const dialog = await Promise.all(
      data.map(async (val) => {
        if (val.file?.type === 'image') {
          const b64im = await urlToBase64(val.file.src);
          return {
            content: val.text,
            role: val.isUser ? 'user' : 'assistant',
            images: [b64im],
          };
        } else {
          return {
            content: val.text,
            role: val.isUser ? 'user' : 'assistant',
          };
        }
      })
    );
    await invoke('plugin:nebula|model_context_eval', {
      modelPath: this.model.model,
      contextId: this.contextId,
      dialog,
    });
  }

  public async predict({
    maxLength,
    temp = DEFAULT_TEMP,
    topP,
  }: {
    maxLength: number;
    temp?: number;
    topP?: number;
  }) {
    const unsubscribe = await listen<NebulaPredictPayload>('nebula-predict', (event) => {
      if (event.payload.model === this.model.model && event.payload.context === this.contextId) {
        if (!event.payload.finished) {
          this.onToken?.({ token: event.payload.token, finished: event.payload.finished });
        } else {
          this.onComplete?.({ finished: event.payload.finished });
        }
      }
    });

    const PredictOptions: {
      max_len: number;
      temp: number;
      top_p?: number;
    } = {
      max_len: maxLength,
      temp,
    };
    if (topP) {
      PredictOptions.top_p = topP;
    }

    await invoke('plugin:nebula|model_context_predict', {
      modelPath: this.model.model,
      contextId: this.contextId,
      predictOptions: PredictOptions,
    });

    unsubscribe();
  }
}
