import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { themes } from './themes';
import { applyTheme } from './themes/themeManager';
import type { ThemeMode } from './themes/types';

const storedMode = localStorage.getItem('budget_mode')
const storedThemeId = localStorage.getItem('budget_theme')
const initialMode: ThemeMode = storedMode === 'light' || storedMode === 'dark'
  ? storedMode
  : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const initialTheme = themes.find(t => t.id === storedThemeId) || themes[0]
applyTheme(initialTheme, initialMode)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'activated' &&
              navigator.serviceWorker.controller
            ) {
              window.location.reload();
            }
          });
        });
      });
  });
}