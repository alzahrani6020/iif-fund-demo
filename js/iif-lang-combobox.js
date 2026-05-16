/**
 * Language picker: hidden <select> + visible button (no text field in header = no Chrome password autofill).
 * Optional filter field inside the dropdown panel. Expects IIF_I18N from i18n.js.
 * Call IIF_initLangPickerUI() after DOM + i18n are ready.
 */
(function () {
  function fillSelect(sel) {
    if (!sel || !window.IIF_I18N) return;
    var codes = IIF_I18N.codes || [];
    var L = IIF_I18N.langs || {};
    sel.innerHTML = '';
    for (var i = 0; i < codes.length; i++) {
      var c = codes[i];
      var opt = document.createElement('option');
      opt.value = c;
      var inf = L[c];
      opt.textContent = inf && inf.name ? inf.name : c;
      sel.appendChild(opt);
    }
  }

  function syncDisplayFromSelect(sel, display) {
    if (!sel || !display) return;
    var o = sel.options[sel.selectedIndex];
    display.textContent = o ? o.textContent + ' · ' + o.value : '';
  }

  function initCombobox(cfg) {
    var wrap = document.getElementById(cfg.wrapId);
    if (wrap && wrap.getAttribute('data-iif-combobox-init') === '1') return;
    var sel = document.getElementById(cfg.selectId);
    var display = document.getElementById(cfg.displayId);
    var panel = document.getElementById(cfg.panelId);
    var list = document.getElementById(cfg.listId);
    var filter = cfg.filterId ? document.getElementById(cfg.filterId) : null;
    var toggle = cfg.toggleId ? document.getElementById(cfg.toggleId) : null;
    if (!sel || !display || !panel || !list) return;
    if (wrap) wrap.setAttribute('data-iif-combobox-init', '1');

    fillSelect(sel);

    if (filter) {
      try {
        filter.setAttribute('autocomplete', 'off');
        filter.setAttribute('data-lpignore', 'true');
        filter.setAttribute('data-1p-ignore', 'true');
        filter.setAttribute('data-bwignore', 'true');
      } catch (eF) { }
    }

    var items = [];
    function rebuildList() {
      list.innerHTML = '';
      items = [];
      for (var i = 0; i < sel.options.length; i++) {
        var o = sel.options[i];
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', o.value);
        li.id = cfg.listId + '-opt-' + o.value;
        li.textContent = o.textContent + ' · ' + o.value;
        list.appendChild(li);
        items.push(li);
      }
    }
    rebuildList();

    var activeIdx = -1;

    function isOpen() {
      return !panel.hidden;
    }

    function visibleItems() {
      var out = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].style.display !== 'none') out.push(items[i]);
      }
      return out;
    }

    function setActive(li) {
      for (var i = 0; i < items.length; i++) {
        items[i].setAttribute('aria-selected', items[i] === li ? 'true' : 'false');
        items[i].classList.toggle('iif-lang-combobox__opt--active', items[i] === li);
      }
    }

    function filterQuery() {
      return filter ? String(filter.value || '') : '';
    }

    function filterItems(q) {
      q = (q || '').trim().toLowerCase();
      for (var i = 0; i < items.length; i++) {
        var li = items[i];
        var t = li.textContent.toLowerCase();
        li.style.display = !q || t.indexOf(q) >= 0 ? '' : 'none';
      }
      var vis = visibleItems();
      list.hidden = vis.length === 0;
      activeIdx = vis.length ? 0 : -1;
      setActive(activeIdx >= 0 ? vis[activeIdx] : null);
    }

    function setExpanded(on) {
      var v = on ? 'true' : 'false';
      display.setAttribute('aria-expanded', v);
      if (toggle) toggle.setAttribute('aria-expanded', v);
    }

    function openPanel() {
      panel.hidden = false;
      panel.style.display = 'flex';
      if (wrap) wrap.classList.add('iif-lang-combobox--open');
      setExpanded(true);
      if (filter) filter.value = '';
      filterItems('');
    }

    function closePanel() {
      panel.hidden = true;
      panel.style.display = 'none';
      if (wrap) wrap.classList.remove('iif-lang-combobox--open');
      setExpanded(false);
      activeIdx = -1;
      setActive(null);
      if (filter) filter.value = '';
      for (var j = 0; j < items.length; j++) {
        items[j].style.display = '';
      }
      list.hidden = false;
    }

    function togglePanel() {
      if (isOpen()) closePanel();
      else openPanel();
    }

    function chooseValue(code) {
      if (sel.querySelector('option[value="' + code + '"]')) {
        sel.value = code;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      closePanel();
      syncDisplayFromSelect(sel, display);
    }

    function onNavKeydown(e) {
      if (e.key === 'Escape') {
        if (isOpen()) {
          closePanel();
          e.preventDefault();
        }
        return;
      }
      if (!isOpen()) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          openPanel();
          e.preventDefault();
        }
        return;
      }
      var vis = visibleItems();
      if (e.key === 'ArrowDown') {
        vis = visibleItems();
        if (!vis.length) return;
        activeIdx = Math.min(activeIdx + 1, vis.length - 1);
        if (activeIdx < 0) activeIdx = 0;
        setActive(vis[activeIdx]);
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowUp') {
        vis = visibleItems();
        if (!vis.length) return;
        activeIdx = Math.max(activeIdx - 1, 0);
        setActive(vis[activeIdx]);
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter') {
        vis = visibleItems();
        if (activeIdx >= 0 && vis[activeIdx]) {
          chooseValue(vis[activeIdx].getAttribute('data-value'));
          e.preventDefault();
        }
      }
    }

    display.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      togglePanel();
    });
    display.addEventListener('keydown', onNavKeydown);

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        togglePanel();
      });
    }

    if (filter) {
      filter.addEventListener('input', function () {
        if (!isOpen()) openPanel();
        filterItems(filterQuery());
      });
      filter.addEventListener('keydown', onNavKeydown);
    }

    list.addEventListener('mousedown', function (e) {
      e.preventDefault();
    });

    list.addEventListener('click', function (e) {
      var li = e.target.closest('li[role="option"]');
      if (!li || li.style.display === 'none') return;
      chooseValue(li.getAttribute('data-value'));
    });

    var wrapEl = document.getElementById(cfg.wrapId);
    document.addEventListener('click', function (e) {
      if (wrapEl && !wrapEl.contains(e.target)) closePanel();
    });

    window.addEventListener('iif-lang-change', function () {
      syncDisplayFromSelect(sel, display);
    });

    syncDisplayFromSelect(sel, display);
    setExpanded(false);
    closePanel();
  }

  window.IIF_fillLangSelectFromI18n = fillSelect;

  window.IIF_initLangPickerUI = function () {
    if (!window.IIF_I18N) return;
    var dash = document.getElementById('iif-lang-picker-dashboard');
    if (dash) fillSelect(dash);

    if (document.getElementById('iif-lang-combobox-wrap')) {
      initCombobox({
        wrapId: 'iif-lang-combobox-wrap',
        selectId: 'iif-lang-picker',
        displayId: 'iif-lang-picker-display',
        filterId: 'iif-lang-picker-filter',
        panelId: 'iif-lang-picker-panel',
        listId: 'iif-lang-picker-list',
        toggleId: 'iif-lang-picker-toggle'
      });
    }

    if (document.getElementById('iif-lang-combobox-wrap-dashboard')) {
      initCombobox({
        wrapId: 'iif-lang-combobox-wrap-dashboard',
        selectId: 'iif-lang-picker-dashboard',
        displayId: 'iif-lang-picker-dashboard-display',
        filterId: 'iif-lang-picker-dashboard-filter',
        panelId: 'iif-lang-picker-dashboard-panel',
        listId: 'iif-lang-picker-dashboard-list',
        toggleId: 'iif-lang-picker-dashboard-toggle'
      });
    }
  };
})();
