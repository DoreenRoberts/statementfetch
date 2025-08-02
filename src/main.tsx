console.log('=== MAIN.TSX START ===');

import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';

// Suppress Chrome extension errors that interfere with React
window.addEventListener('error', (e) => {
  if (e.message.includes('runtime.lastError') || e.message.includes('message channel closed')) {
    console.warn('Suppressed extension error:', e.message);
    e.preventDefault();
    return false;
  }
});

const root = document.getElementById('root');
if (root) {
  console.log('Creating root...');
  try {
    createRoot(root).render(React.createElement(App));
    console.log('Render complete');
  } catch (error) {
    console.error('React render error:', error);
    root.innerHTML = '<div>React failed to load. Try disabling browser extensions.</div>';
  }
} else {
  console.error('Root element not found');
}