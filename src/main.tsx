import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { render } from 'preact';
import App from './app/App';
import '@/shared/styles/index.scss';
import Llamafile from './llamafile';
import { ThemeProvider, ErrorBoundary } from '@/app/providers';
import { database } from '../db.tsx';
import { downloadCenter } from './DownloadCenter.ts';
// Start the llamafile server
new Llamafile().spawn();
downloadCenter.downloadFile('llama.txt');

render(
  <ErrorBoundary>
    <ThemeProvider>
      <DatabaseProvider database={database}>
        <App />
      </DatabaseProvider>
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root')!
);
