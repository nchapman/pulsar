import { render } from 'preact';
import App from './app/App';
import '@/shared/styles/index.scss';
import Llamafile from './llamafile';
import { ThemeProvider, ErrorBoundary } from '@/app/providers';
import { database } from '../db.tsx';

// Start the llamafile server
new Llamafile().spawn();

render(
  <ErrorBoundary>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root')!
);
