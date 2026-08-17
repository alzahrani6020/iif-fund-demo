/**
 * Optional third-party live chat + FAB visibility from window.IIF_CONFIG (set in index.html).
 */
(function () {
  function initFabLiveChat() {
    try {
      var cfg = window.IIF_CONFIG || {};
      if (cfg.liveChatScriptUrl && typeof cfg.liveChatScriptUrl === 'string' && /^https?:\/\//i.test(cfg.liveChatScriptUrl)) {
        var s = document.createElement('script');
        s.async = true;
        s.src = cfg.liveChatScriptUrl;
        document.head.appendChild(s);
      }
      var fab = document.getElementById('iif-fab-contact');
      if (fab && cfg.showQuickContactFab === false) fab.setAttribute('hidden', '');
    } catch (e) { }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFabLiveChat);
  else initFabLiveChat();
})();
