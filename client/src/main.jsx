import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AttributionProvider } from './context/AttributionContext';
import { ToastProvider } from './context/ToastContext';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AttributionProvider><ToastProvider><App /></ToastProvider></AttributionProvider>
    </BrowserRouter>
  </StrictMode>,
);
