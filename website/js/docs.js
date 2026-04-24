/* docs.vehium.com — minimal client-side enhancements */
(function () {
  'use strict';

  // ---- Theme toggle (persist in localStorage) ----
  const html = document.documentElement;
  const stored = (() => { try { return localStorage.getItem('vehium-docs-theme'); } catch (e) { return null; } })();
  if (stored === 'light' || stored === 'dark') html.setAttribute('data-theme', stored);
  else {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    html.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="toggle-theme"]');
    if (!btn) return;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('vehium-docs-theme', next); } catch (e) { /* ignore */ }
  });

  // ---- Mobile sidebar drawer ----
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="toggle-sidebar"]')) {
      document.body.classList.toggle('sidebar-open');
      return;
    }
    if (document.body.classList.contains('sidebar-open')) {
      // Close when tapping outside the sidebar
      if (!e.target.closest('.sidebar') && !e.target.closest('[data-action="toggle-sidebar"]')) {
        document.body.classList.remove('sidebar-open');
      }
    }
  });

  // ---- Mark the active sidebar link from current URL ----
  const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '/') || '/';
  document.querySelectorAll('.sidebar a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const normalized = href.replace(/\/index\.html$/, '/').replace(/\/+$/, '/');
    if (normalized === path) a.classList.add('active');
  });

  // ---- Build right-column TOC from h2/h3 in .content ----
  const tocContainer = document.querySelector('.toc');
  if (tocContainer) {
    const headings = document.querySelectorAll('.content h2[id], .content h3[id]');
    if (headings.length) {
      const ul = document.createElement('ul');
      let currentH2 = null;
      headings.forEach((h) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        if (h.tagName === 'H2') {
          currentH2 = document.createElement('ul');
          li.appendChild(currentH2);
          ul.appendChild(li);
        } else if (currentH2) {
          currentH2.appendChild(li);
        } else {
          ul.appendChild(li);
        }
      });
      tocContainer.appendChild(ul);

      // Scrollspy — highlight active section
      const links = tocContainer.querySelectorAll('a');
      const map = new Map();
      links.forEach((link) => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) map.set(target, link);
      });
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const link = map.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      map.forEach((_, target) => observer.observe(target));
    } else {
      tocContainer.style.display = 'none';
    }
  }

  // ---- Auto-add ids to h2/h3 in content if missing ----
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  document.querySelectorAll('.content h2, .content h3').forEach((h) => {
    if (!h.id) h.id = slugify(h.textContent || '');
  });

  // ---- Client-side search (fetch /search-index.json once, filter on type) ----
  const searchInput = document.querySelector('[data-role="search"] input');
  const searchResults = document.querySelector('[data-role="search"] .search-results');
  let index = null;
  if (searchInput && searchResults) {
    const loadIndex = async () => {
      if (index) return index;
      try {
        const res = await fetch('/search-index.json', { cache: 'default' });
        if (!res.ok) throw new Error('search index unavailable');
        index = await res.json();
      } catch (e) {
        index = [];
      }
      return index;
    };
    const render = (hits) => {
      if (!hits.length) { searchResults.innerHTML = ''; return; }
      searchResults.innerHTML = hits.slice(0, 10).map((h) =>
        `<a href="${h.url}"><strong>${h.title}</strong><span class="hit-path">${h.path || h.url}</span></a>`
      ).join('');
    };
    const runSearch = async () => {
      const q = searchInput.value.trim().toLowerCase();
      if (q.length < 2) { searchResults.innerHTML = ''; return; }
      const data = await loadIndex();
      const hits = data.filter((d) =>
        (d.title || '').toLowerCase().includes(q) ||
        (d.keywords || '').toLowerCase().includes(q)
      );
      render(hits);
    };
    searchInput.addEventListener('input', runSearch);
    searchInput.addEventListener('focus', runSearch);
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-role="search"]')) searchResults.innerHTML = '';
    });
  }
})();
