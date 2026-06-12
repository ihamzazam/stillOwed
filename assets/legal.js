(function () {
  'use strict';

  var DOCS = ['terms', 'privacy', 'guardrails', 'compliance'];
  var HEADER_OFFSET = 88;

  function setDoc(id, opts) {
    opts = opts || {};
    if (DOCS.indexOf(id) === -1) return;

    document.querySelectorAll('.doc').forEach(function (panel) {
      panel.hidden = panel.id !== 'doc-' + id;
    });

    document.querySelectorAll('.tab').forEach(function (tab) {
      var active = tab.dataset.doc === id;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    document.querySelectorAll('.toc-list').forEach(function (list) {
      list.hidden = list.dataset.doc !== id;
    });

    if (opts.updateHash !== false) {
      try { history.replaceState(null, '', '#' + id); } catch (e) { /* no-op */ }
    }
    if (opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      setDoc(tab.dataset.doc);
    });
  });

  document.querySelectorAll('.toc-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var el = document.getElementById(link.dataset.target);
      if (el) {
        var y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('hashchange', function () {
    var v = (location.hash || '').replace('#', '');
    setDoc(v, { updateHash: false, scroll: false });
  });

  var initial = (location.hash || '').replace('#', '');
  if (DOCS.indexOf(initial) !== -1) {
    setDoc(initial, { updateHash: false, scroll: false });
  }
})();
