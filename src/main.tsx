import '@/shared/styles/index.scss';

import { render } from 'preact';

import { ErrorBoundary, ThemeProvider } from '@/app/providers';

import App from './app/App';

// @ts-ignore
// eslint-disable-next-line func-names
Object.hasOwn = function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

render(
  <ErrorBoundary>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root')!
);
