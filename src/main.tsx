import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initConsoleCapture } from './utils/consoleCapture';
import { initIframeMessageHandler } from './utils/iframeMessageHandler';

// Initialize debugging, log capture and iframe postMessage integration for LlamaBot / Leonardo
initConsoleCapture();
initIframeMessageHandler();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

