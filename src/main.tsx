import '@/shared/styles/index.scss';
import 'react-toastify/dist/ReactToastify.min.css';

import { appWindow } from '@tauri-apps/api/window';
import { render } from 'preact';
import { ToastContainer } from 'react-toastify';

import { ErrorBoundary } from '@/app/providers';
import { addHasOwn } from '@/shared/lib/func';
import { ConfirmModal } from '@/shared/ui';

import App from './app/App';

addHasOwn();
document.getElementById('titlebar-minimize').addEventListener('click', () => appWindow.minimize());
document
  .getElementById('titlebar-maximize')
  .addEventListener('click', () => appWindow.toggleMaximize());
document.getElementById('titlebar-close').addEventListener('click', () => appWindow.close());

render(
  <ErrorBoundary>
    <App />
    <ToastContainer />
    <ConfirmModal />
  </ErrorBoundary>,
  document.getElementById('root')!
);

//        "fullscreen": false,
//        "resizable": true,
//        "title": "Pulsar",
//        "width": 1100,
//        "height": 830,
//        "titleBarStyle": "Overlay"
