import { AIModelName } from '@/constants.ts';
import { ChatMsg } from '@/db/chat';
import { getModelPath, getMultiModalPath } from '@/entities/model/lib/getModelPath.ts';
import { loge, logi } from '@/shared/lib/Logger.ts';

import { NebulaModel } from './model.ts';
import { cat } from './sampleImage.ts';

let model: NebulaModel | null = null;

function dataURLtoFile(dataurl: string, filename: string): File {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export async function loadModel(modelName: AIModelName) {
  try {
    const modelPath = await getModelPath(modelName);
    // TODO @dmytro - implement getMultiModalPath with the downloaded/selected multimodal model
    const multiModalPath = await getMultiModalPath();
    model = await NebulaModel.initModel(modelPath, multiModalPath);
  } catch (e: any) {
    loge('chatApi', `Failed to load model, rust error: ${e}`);
    throw e;
  }
}

export async function dropModel() {
  try {
    model?.drop();
    model = null;
  } catch (e: any) {
    loge('chatApi', `Failed to unload model ${e}`);
    throw e;
  }
}

export async function stream(
  config: {
    messages: ChatMsg[];
    onStreamStart: () => void;
    onTextChunkReceived: (chunk: string) => void;
    onStreamEnd: () => void;
    onTitleUpdate: (title: string) => void;
  },
  maxPredictLen: number = 100
) {
  if (!model) {
    loge('chatApi', 'Model not loaded, cannot stream');
    return;
  }

  let { messages, onStreamStart, onTextChunkReceived, onTitleUpdate, onStreamEnd } = config;

  messages = messages.slice(0, -1);

  try {
    const context = await model.createContext(
      messages.slice(0, -1).map((msg) => ({ message: msg.text, is_user: !!msg.isUser }))
    );

    context.onToken = (p) => {
      if (p.token != null) {
        onTextChunkReceived(p.token);
      }
    };
    context.onComplete = (_p) => {
      onStreamEnd();
    };

    // test reading a file and sending it to the model
    const file = dataURLtoFile(cat, 'cat.png');

    await context.evaluateImage(file, messages[messages.length - 1].text);
    // await context.evaluateString(messages[messages.length - 1].text, true);

    onStreamStart();

    await context.predict(maxPredictLen);
  } catch (e) {
    loge('chatApi', `Failed to stream: ${e}`);
  } finally {
    onStreamEnd();
    onTitleUpdate(messages[messages.length - 2].text);
  }
}

