import '@/shared/styles/index.scss';

import { render } from 'preact';

import { ErrorBoundary, ThemeProvider } from '@/app/providers';

import App from './app/App';
import Llamafile from './llamafile';

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
