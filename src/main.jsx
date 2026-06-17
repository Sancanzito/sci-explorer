import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './ThemeProvider';
import { registerSW } from 'virtual:pwa-register';

// Local Font Imports
import '@fontsource/orbitron';
import '@fontsource/ibm-plex-mono';
import '@fontsource/space-grotesk';

// Register the service worker for offline functionality
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App is ready to work offline!');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
);