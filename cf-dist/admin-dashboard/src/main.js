import { router } from './router.js';

function init() {
  const app = document.getElementById('dashboard-app');
  if (!app) return;
  router(app, window.location.hash || '#/overview');
  window.addEventListener('hashchange', () => {
    router(app, window.location.hash);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
