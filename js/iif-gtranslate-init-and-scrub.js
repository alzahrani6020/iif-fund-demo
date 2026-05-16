/**
 * Google Translate widget bootstrap + scrubber for injected diagnostic English strings.
 * Loaded before translate_a/element.js (callback: googleTranslateElementInit).
 */
window.googleTranslateElementInit = function googleTranslateElementInit() {
  try {
    if (!window.google || !google.translate || !google.translate.TranslateElement) return;
    new google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages:
          'ar,am,az,bg,bn,ca,cs,da,de,el,en,es,eu,fi,fr,gl,gu,hi,hr,hu,hy,id,it,iw,ja,ka,kk,km,kn,ko,lo,mk,ml,mn,mr,ms,my,ne,nl,no,pa,pl,pt,ro,ru,si,sk,sl,sq,sr,sv,sw,ta,te,th,tr,uk,ur,uz,vi,zh-CN',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      },
      'google_translate_element'
    );
  } catch (eGt) { }
};

(function () {
  var RX = /languages\s+supported\b[\s\S]*?no\s+content/i;
  function scrub(node) {
    try {
      if (!node) return;
      if (node.nodeType === Node.TEXT_NODE) {
        var t = String(node.nodeValue || '');
        if (RX.test(t)) node.nodeValue = '';
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      var el = node;
      if (el.textContent && RX.test(el.textContent)) {
        el.remove();
        return;
      }
      var kids = el.childNodes;
      if (!kids || !kids.length) return;
      for (var i = kids.length - 1; i >= 0; i--) scrub(kids[i]);
    } catch (e) { }
  }
  function run() {
    try { scrub(document.body); } catch (e) { }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  try {
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.addedNodes) m.addedNodes.forEach(scrub);
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e2) { }
})();
