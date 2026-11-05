import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { canonicalPath, normalize } from '@/lib/paths';
import './index.css';

const { pathname, search, hash } = window.location;
const path = canonicalPath(pathname);
if (path !== normalize(pathname)) window.history.replaceState(window.history.state, '', `${path}${search}${hash}`);

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.hasChildNodes() && root.dataset.path === path) {
  hydrateRoot(root, app);
} else {
  root.replaceChildren();
  createRoot(root).render(app);
}
