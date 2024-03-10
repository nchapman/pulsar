import '@/shared/styles/index.scss';

import { render } from 'preact';

import { ErrorBoundary, ThemeProvider } from '@/app/providers';
import { AIModel } from '@/entities/model';
import { getModelPath } from '@/entities/model/lib/getModelPath.ts';
import { isDev } from '@/shared/lib/func';

import App from './app/App';
import Llamafile from './llamafile';

async function startLlamafile() {
  const model: AIModel = 'llava-v1.6-mistral';
  const modelPath = isDev() ? `models/${model}` : await getModelPath(model);
  new Llamafile(modelPath).spawn();
}

startLlamafile();

render(
  <ErrorBoundary>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root')!
);
