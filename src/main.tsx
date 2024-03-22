import '@/shared/styles/index.scss';

import { render } from 'preact';

import { ErrorBoundary } from '@/app/providers';
import { addHasOwn } from '@/shared/lib/func';

import App from './app/App';

addHasOwn();

render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')!
);
