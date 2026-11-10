/* 실험 기록(Blog) — posts/index.json에 적힌 Markdown 파일을 가져와 렌더링합니다.
   외부 라이브러리 없이 frontmatter와 마크다운 부분집합을 HTML로 바꿉니다. */
(() => {
  'use strict';

  const INDEX = 'posts/index.json';
  const BUNDLE = 'posts/posts.js';
  const DIR = 'posts/';

  /* 블로그 필터 카테고리. 여기에 값을 넣으면 단추가 생기고, 포스트 frontmatter의
     tags와 연결되어 해당 태그만 목록에 남깁니다. (예: const CATEGORIES = ['llm', 'gpu'];) */
  const CATEGORIES = [];
  const grid = document.getElementById('blog-view');
  const status = document.getElementById('blog-status');
  const tagControl = document.querySelector('.tag-control');
  const postShell = document.getElementById('post-view');
  const postTitle = document.getElementById('post-title');
  const postMeta = document.getElementById('post-meta');
  const postTags = document.getElementById('post-tags');
  const postBody = document.getElementById('post-body');
  const postSource = document.getElementById('post-source');
  const postNav = document.getElementById('post-nav');
  const titlebar = document.getElementById('post-titlebar');
  const titlebarDate = document.getElementById('post-titlebar-date');
  const titlebarTitle = document.getElementById('post-titlebar-title');
  const postHeader = postShell.querySelector('.post-header');
  const tabsBar = document.querySelector('.tabs');
  const body = document.body;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const TAG_COLORS = {
    llm: ['#e6e0fa', '#5a32d1'],
    inference: ['#d7edec', '#2f7d7a'],
    gpu: ['#f9ddd1', '#be5435'],
    benchmark: ['#dae5ff', '#3f5fa8'],
    web: ['#dfebcd', '#4f7a3f'],
    agent: ['#e4eee6', '#287757'],
    hardware: ['#e5ddd4', '#80756c'],
    devlog: ['#fad9e6', '#b74878']
  };
  const FALLBACK_COLORS = [['#dcdffa', '#666dc3'], ['#fae7bc', '#ac771d'], ['#d9e9d6', '#467955']];
  const FLASK = '<path d="M9 3h6M10 3v7l-6 9a1.3 1.3 0 0 0 1 2h14a1.3 1.3 0 0 0 1-2l-6-9V3M7 15h10"/>';

  let posts = null;
  let tag = readPreference('tag') || 'all';
  if (!CATEGORIES.includes(tag)) tag = 'all';
  let openedByClick = false;
  let loadFailed = false;

  function readPreference(key) {
    try { return localStorage.getItem('projects-portal-' + key); } catch { return null; }
  }
  function writePreference(key, value) {
    try { localStorage.setItem('projects-portal-' + key, value); } catch {}
  }
  const portal = () => window.portal || { section: 'projects', sort: 'newest' };

  /* ---- Markdown ------------------------------------------------------- */

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
  const escapeHtml = text => String(text).replace(/[&<>]/g, ch => ESCAPES[ch]);

  function safeUrl(url) {
    const value = String(url).trim().replace(/"/g, '&quot;');
    return /^(?:https?:|mailto:|#|\/|\.)/i.test(value) || !value.includes(':') ? value : '#';
  }
  const isExternal = url => /^(?:https?:|mailto:)/i.test(url);

  function inline(text) {
    const codeSpans = [];
    let out = escapeHtml(text);
    // 코드 스팬은 다른 인라인 규칙으로부터 보호합니다.
    out = out.replace(/`([^`\n]+)`/g, (_m, code) => {
      codeSpans.push(code);
      return '\u0000' + (codeSpans.length - 1) + '\u0000';
    });
    out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, src) =>
      `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy">`);
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) =>
      `<a href="${safeUrl(href)}"${isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`);
    out = out
      .replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/(^|[^\w_])__([^_\n]+)__(?!\w)/g, '$1<strong>$2</strong>')
      .replace(/(^|[^\w_])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>')
      .replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
    // 표 안에서 쓴 <br>와마크다운 하드 개행(두 칸 + 줄바꿈)만 통과시킵니다.
    out = out.replace(/&lt;br\s*\/?&gt;/gi, '<br>').replace(/ {2,}\n/g, '<br>\n');
    return out.replace(/\u0000(\d+)\u0000/g, (_m, index) => `<code>${codeSpans[+index]}</code>`);
  }

  const isBlank = line => !line.trim();
  const FENCE = /^ {0,3}(```|~~~)(.*)$/;
  const HEADING = /^ {0,3}(#{1,6})\s+(.*)$/;
  const RULE = /^ {0,3}(?:[-*_]\s*){3,}$/;
  const QUOTE = /^ {0,3}>/;
  const ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
  const TABLE_SEP = /^ {0,3}\|?[ :\-|]*-[ :\-|]*\|[ :\-|]*$/;

  function startsBlock(line) {
    return FENCE.test(line) || HEADING.test(line) || RULE.test(line) ||
      QUOTE.test(line) || ITEM.test(line);
  }

  function startsTable(lines, index) {
    return lines[index].includes('|') && index + 1 < lines.length && TABLE_SEP.test(lines[index + 1]);
  }

  function splitRow(row) {
    const source = row.trim().replace(/^\|/, '').replace(/\|$/, '');
    const cells = [];
    let cell = '';
    for (let i = 0; i < source.length; i += 1) {
      const ch = source[i];
      if (ch === '\\' && source[i + 1] === '|') { cell += '|'; i += 1; continue; }
      if (ch === '|') { cells.push(cell); cell = ''; continue; }
      cell += ch;
    }
    cells.push(cell);
    return cells;
  }

  function renderTable(lines, start) {
    const header = splitRow(lines[start]);
    const align = splitRow(lines[start + 1]).map(cell => {
      const value = cell.trim();
      const left = value.startsWith(':');
      const right = value.endsWith(':');
      return left && right ? 'center' : right ? 'right' : left ? 'left' : '';
    });
    const cellAttr = index => align[index] ? ` class="align-${align[index]}"` : '';
    const pad = cells => {
      const row = cells.slice(0, header.length);
      while (row.length < header.length) row.push('');
      return row;
    };
    let i = start + 2;
    const rows = [];
    while (i < lines.length && lines[i].includes('|') && !isBlank(lines[i])) { rows.push(pad(splitRow(lines[i]))); i += 1; }
    const head = `<thead><tr>${pad(header).map((cell, c) => `<th${cellAttr(c)}>${inline(cell.trim())}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map(cells => `<tr>${cells.map((cell, c) => `<td${cellAttr(c)}>${inline(cell.trim())}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return { html: `<div class="table-scroll"><table>${head}${tbody}</table></div>`, next: i };
  }

  function collectList(items, pos, indent) {
    const type = items[pos].type;
    const nodes = [];
    while (pos < items.length) {
      const item = items[pos];
      if (item.indent < indent) break;
      if (item.indent > indent) {
        const nested = collectList(items, pos, item.indent);
        if (nodes.length) nodes[nodes.length - 1].children.push(nested.html);
        else nodes.push({ text: '', children: [nested.html] });
        pos = nested.next;
        continue;
      }
      if (item.type !== type) break;
      nodes.push({ text: item.text, children: [] });
      pos += 1;
    }
    const html = `<${type}>${nodes.map(node =>
      `<li>${inline(node.text)}${node.children.join('')}</li>`).join('')}</${type}>`;
    return { html, next: pos };
  }

  function renderListBlock(lines, start) {
    const items = [];
    let i = start;
    while (i < lines.length) {
      const match = ITEM.exec(lines[i]);
      if (!match) {
        // 들여쓴 후속 줄은 직전 항목의 내용으로 이어붙입니다.
        if (items.length && !isBlank(lines[i]) && /^\s+\S/.test(lines[i]) && !startsBlock(lines[i])) {
          items[items.length - 1].text += ' ' + lines[i].trim();
          i += 1;
          continue;
        }
        break;
      }
      items.push({
        indent: match[1].replace(/\t/g, '  ').length,
        type: /^[-*+]$/.test(match[2]) ? 'ul' : 'ol',
        text: match[3]
      });
      i += 1;
    }
    let html = '';
    let pos = 0;
    while (pos < items.length) {
      const block = collectList(items, pos, items[pos].indent);
      html += block.html;
      pos = block.next > pos ? block.next : pos + 1;
    }
    return { html, next: i };
  }

  function renderMarkdown(source) {
    const lines = String(source).replace(/\r\n?/g, '\n').split('\n');
    const html = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (isBlank(line)) { i += 1; continue; }

      const fence = FENCE.exec(line);
      if (fence) {
        const lang = (fence[2] || '').trim().split(/\s+/)[0] || '';
        const buffer = [];
        i += 1;
        while (i < lines.length && !/^ {0,3}(?:```|~~~)\s*$/.test(lines[i])) { buffer.push(lines[i]); i += 1; }
        i += 1; // 닫는 펜스
        const label = lang ? ` data-lang="${escapeHtml(lang)}"` : '';
        html.push(`<pre class="code-block"${label}><code>${escapeHtml(buffer.join('\n'))}</code></pre>`);
        continue;
      }

      const heading = HEADING.exec(line);
      if (heading) {
        const level = heading[1].length;
        html.push(`<h${level}>${inline(heading[2].replace(/\s+#+$/, '').trim())}</h${level}>`);
        i += 1;
        continue;
      }

      if (RULE.test(line)) { html.push('<hr>'); i += 1; continue; }

      if (QUOTE.test(line)) {
        const buffer = [];
        while (i < lines.length && QUOTE.test(lines[i])) { buffer.push(lines[i].replace(/^ {0,3}>\s?/, '')); i += 1; }
        html.push(`<blockquote>${renderMarkdown(buffer.join('\n'))}</blockquote>`);
        continue;
      }

      if (startsTable(lines, i)) {
        const table = renderTable(lines, i);
        html.push(table.html);
        i = table.next;
        continue;
      }

      if (ITEM.test(line)) {
        const list = renderListBlock(lines, i);
        html.push(list.html);
        i = list.next;
        continue;
      }

      const paragraph = [line];
      i += 1;
      while (i < lines.length && !isBlank(lines[i]) && !startsBlock(lines[i]) && !startsTable(lines, i)) {
        paragraph.push(lines[i]);
        i += 1;
      }
      html.push(`<p>${inline(paragraph.join('\n'))}</p>`);
    }
    return html.join('\n');
  }

  function parseFrontMatter(text) {
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
    if (!match) return { meta: {}, body: text };
    const meta = {};
    match[1].split(/\r?\n/).forEach(line => {
      const entry = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim());
      if (!entry) return;
      let value = entry[2].trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',')
          .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
      } else {
        value = value.replace(/^['"]|['"]$/g, '');
      }
      meta[entry[1].toLowerCase()] = value;
    });
    return { meta, body: text.slice(match[0].length) };
  }

  /* ---- Posts ---------------------------------------------------------- */

  async function loadPost(file) {
    const response = await fetch(DIR + file, { cache: 'no-store' });
    if (!response.ok) throw new Error(file + ' → ' + response.status);
    return buildPost(file, await response.text());
  }

  function buildPost(file, raw) {
    const { meta, body: text } = parseFrontMatter(raw);
    const slug = file.replace(/\.md$/i, '');
    const firstHeading = /^ {0,3}#\s+(.+)$/m.exec(text);
    const title = meta.title || (firstHeading && firstHeading[1].trim()) || slug;
    let content = text.trim();
    // frontmatter에 제목이 있으면 본문 첫 H1은 헤더에서 이미 그립니다.
    if (meta.title) content = content.replace(/^ {0,3}#\s+.+\r?\n?/, '');
    const tags = Array.isArray(meta.tags) ? meta.tags : (meta.tags ? String(meta.tags).split(/[,\s]+/).filter(Boolean) : []);
    const date = meta.date || meta.updated || '';
    return {
      file,
      slug,
      title,
      date,
      tags,
      summary: meta.summary || '',
      content
    };
  }

  const byDate = (order) => (a, b) =>
    order === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(src + ' 로드 실패'));
      document.head.appendChild(script);
    });
  }

  async function loadPosts() {
    // file:// 로 여는 미리보기에서는 fetch가 차단되므로 생성된 사본(posts/posts.js)을 씁니다.
    if (location.protocol === 'file:') {
      await loadScript(BUNDLE);
      return (window.portalPosts || []).map(entry => buildPost(entry.file, entry.content));
    }
    const files = await (await fetch(INDEX, { cache: 'no-store' })).json();
    const loaded = await Promise.all(files.map(file => loadPost(file).catch(error => {
      console.warn('포스트를 읽을 수 없습니다:', error);
      return null;
    })));
    return loaded.filter(Boolean);
  }

  const colorsFor = post => {
    for (const tag of post.tags) if (TAG_COLORS[tag]) return TAG_COLORS[tag];
    let hash = 0;
    for (const ch of post.slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
  };

  const formatDate = value => value ? value.replace(/-/g, '.') : '날짜 미정';

  function visiblePosts() {
    const list = (posts || []).filter(post => tag === 'all' || post.tags.includes(tag));
    return list.sort(byDate(portal().sort || 'newest'));
  }

  function showStatus(message) {
    // Blog 목록이 아닐 때는 상태 메시지를 감추어 다른 탭에 남지 않게 합니다.
    const visible = !!message && portal().section === 'blog' && body.dataset.view !== 'post';
    status.textContent = message || '';
    status.hidden = !visible;
  }

  function renderCard(post) {
    const [background, accent] = colorsFor(post);
    const card = document.createElement('a');
    card.className = 'card post-card';
    card.href = '#/blog/' + post.slug;
    card.dataset.date = post.date;

    const art = document.createElement('div');
    art.className = 'project-art post-art';
    art.setAttribute('aria-hidden', 'true');
    art.style.setProperty('--art-bg', background);
    art.style.setProperty('--art-color', accent);
    art.innerHTML = `<svg class="post-art-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${FLASK}</svg>`;

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    meta.setAttribute('aria-hidden', 'true');
    meta.innerHTML = `<span class="project-category post-category">${escapeHtml(post.tags.join(' · ') || 'note')}</span>` +
      `<span class="post-date">${formatDate(post.date)}</span>`;

    const title = document.createElement('h2');
    title.textContent = post.title;

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = post.summary;

    const links = document.createElement('div');
    links.className = 'links';
    links.innerHTML = '<span class="post-read">기록 읽기<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></span>';

    card.append(art, meta, title, desc, links);
    return card;
  }

  function renderList() {
    grid.textContent = '';
    const list = visiblePosts();
    const fragment = document.createDocumentFragment();
    list.forEach(post => fragment.appendChild(renderCard(post)));
    grid.appendChild(fragment);
    if (!posts) showStatus('실험 기록을 불러오는 중…');
    else if (loadFailed) showStatus('실험 기록을 불러오지 못했습니다. 게시 목록(posts/index.json)과 Markdown 파일을 확인하세요.');
    else if (!list.length) showStatus(posts.length ? '이 태그의 기록이 없습니다.' : '아직 게시된 기록이 없습니다.');
    else showStatus('');
  }

  function renderTagButtons() {
    const values = ['all', ...CATEGORIES];
    if (!values.includes(tag)) tag = 'all';
    tagControl.querySelectorAll('.tab-btn').forEach(button => button.remove());
    values.forEach(value => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tab-btn' + (value === tag ? ' active' : '');
      button.dataset.tag = value;
      button.setAttribute('aria-pressed', String(value === tag));
      button.textContent = value === 'all' ? 'All' : value;
      tagControl.appendChild(button);
    });
  }

  function renderPost(post) {
    const [background, accent] = colorsFor(post);
    postShell.style.setProperty('--art-bg', background);
    postShell.style.setProperty('--art-color', accent);
    // 제목 고정 바는 탭 바 안쪽에 있으므로 포스트 색을 따로 물려받습니다.
    titlebar.style.setProperty('--art-color', accent);
    postTitle.textContent = post.title;
    postMeta.textContent = formatDate(post.date);
    titlebarTitle.textContent = post.title;
    titlebarDate.textContent = formatDate(post.date);
    postSource.href = DIR + post.file;
    postTags.textContent = '';
    post.tags.forEach(value => {
      const item = document.createElement('li');
      // 카테고리로 등록되지 않은 태그는 필터로 동작하지 않으므로 plain 텍스트로 둡니다.
      if (CATEGORIES.includes(value)) {
        item.innerHTML = `<a href="#/blog?tag=${encodeURIComponent(value)}">${escapeHtml(value)}</a>`;
      } else {
        const plain = document.createElement('span');
        plain.className = 'post-tag-plain';
        plain.textContent = value;
        item.appendChild(plain);
      }
      postTags.appendChild(item);
    });
    postBody.innerHTML = renderMarkdown(post.content);
    renderPostNav(post);
    document.title = post.title + ' · Blog';
  }

  function renderPostNav(post) {
    const list = visiblePosts();
    const index = list.findIndex(item => item.slug === post.slug);
    postNav.textContent = '';
    if (index === -1) return;
    [['prev', list[index + 1], '이전 기록'], ['next', list[index - 1], '다음 기록']].forEach(([direction, target, label]) => {
      if (!target) return;
      const link = document.createElement('a');
      link.className = 'post-nav-link ' + direction;
      link.href = '#/blog/' + target.slug;
      link.innerHTML = `<span class="post-nav-label">${label}</span><span class="post-nav-title">${escapeHtml(target.title)}</span>`;
      postNav.appendChild(link);
    });
  }

  /* ---- 고정 제목 바 --------------------------------------------------
     본문 머릿글이 화면 밖으로 나가면 제목을 탭 바 한가운데에 얹습니다.
     얹을 폭은 좌우 단추 가장자리에서 재고, 탭 바가 줄어들거나 창 폭이 좁으면
     단추 아래로 내립니다. */
  let titlebarFrame = 0;
  let titlebarTimer = 0;
  function syncTitlebar() {
    titlebarFrame = 0;
    if (!tabsBar) return;
    const bar = tabsBar.getBoundingClientRect();
    const leftGroup = document.querySelector('.section-control');
    const rightGroup = document.querySelector('.post-control:not([hidden])') || document.querySelector('.sort-control:not([hidden])');
    const left = leftGroup ? Math.round(leftGroup.getBoundingClientRect().right - bar.left + 18) : 18;
    const right = rightGroup ? Math.round(bar.right - rightGroup.getBoundingClientRect().left + 18) : 18;
    const room = Math.round(bar.width - left - right);
    if (room < 200) {
      titlebar.classList.add('is-below');
      tabsBar.style.setProperty('--titlebar-left', '0px');
      tabsBar.style.setProperty('--titlebar-right', '0px');
    } else {
      titlebar.classList.remove('is-below');
      tabsBar.style.setProperty('--titlebar-left', left + 'px');
      tabsBar.style.setProperty('--titlebar-right', right + 'px');
    }
    if (body.dataset.view !== 'post') { titlebar.classList.remove('is-shown'); return; }
    titlebar.classList.toggle('is-shown', postHeader.getBoundingClientRect().bottom <= bar.bottom);
  }
  // 탭 바가 줄어드는 애니메이션이 끝난 뒤에 한 번 더 재야 정확히 붙습니다.
  function requestTitlebar() {
    if (!titlebarFrame) titlebarFrame = requestAnimationFrame(syncTitlebar);
    clearTimeout(titlebarTimer);
    titlebarTimer = setTimeout(syncTitlebar, 420);
  }

  function setView(view) {
    body.dataset.view = view;
    if (view === 'list' && portal().section === 'blog') document.title = 'Blog · My Projects';
    requestTitlebar();
  }

  function openPost(slug) {
    const setSection = name => { try { window.portal.setSection(name); } catch {} };
    const post = (posts || []).find(item => item.slug === slug);
    if (!post) {
      try { history.replaceState(null, '', '#/blog'); } catch {}
      setView('list');
      setSection('blog');
      renderList();
      showStatus('요청한 기록을 찾을 수 없습니다: ' + slug);
      return;
    }
    setView('post');
    renderList();
    setSection('blog');
    renderPost(post);
    const smooth = !reducedMotion.matches && body.dataset.liquidMotion !== 'reduced';
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }

  function applyTagFromHash() {
    const hash = location.hash || '';
    const match = /[?&]tag=([^&]+)/.exec(hash);
    if (!match) return;
    const wanted = decodeURIComponent(match[1]);
    if (CATEGORIES.includes(wanted)) {
      tag = wanted;
      writePreference('tag', tag);
    } else {
      tag = 'all';
    }
    const cleaned = hash.replace(/[?&]tag=[^&]*/, '').replace(/\?+$/, '');
    try { history.replaceState(null, '', cleaned || '#/blog'); } catch {}
    renderTagButtons();
  }

  let syncing = false;
  function sync() {
    if (syncing) return;
    syncing = true;
    try {
      applyTagFromHash();
      const route = /^#\/blog(?:\/([^/?#]+))?$/.exec(location.hash || '');
      if (!route) {
        if (portal().section !== 'blog') return;
        setView('list');
        renderTagButtons();
        renderList();
        return;
      }
      const slug = route[1] ? decodeURIComponent(route[1]) : '';
      if (!posts) { setView('list'); showStatus('실험 기록을 불러오는 중…'); return; }
      if (slug) openPost(slug);
      else {
        setView('list');
        renderTagButtons();
        renderList();
        try { window.portal.setSection('blog'); } catch {}
      }
    } finally {
      syncing = false;
    }
  }

  /* ---- Wiring --------------------------------------------------------- */

  tagControl.addEventListener('click', event => {
    const button = event.target.closest('.tab-btn');
    if (!button) return;
    tag = button.dataset.tag;
    writePreference('tag', tag);
    tagControl.querySelectorAll('.tab-btn').forEach(other => {
      const on = other === button;
      other.classList.toggle('active', on);
      other.setAttribute('aria-pressed', String(on));
    });
    if (body.dataset.view === 'post') {
      setView('list');
      portal().setSection('blog');
    }
    renderList();
  });

  document.addEventListener('portal:section', event => {
    if (event.detail.section !== 'blog') { setView('list'); return; }
    sync();
  });
  document.addEventListener('portal:sort', () => {
    if (posts) posts.sort(byDate(portal().sort || 'newest'));
    if (portal().section === 'blog' && body.dataset.view !== 'post') renderList();
  });

  window.addEventListener('hashchange', () => sync());
  window.addEventListener('scroll', requestTitlebar, { passive: true });
  window.addEventListener('resize', requestTitlebar);

  function backToList() {
    const stepBack = openedByClick && history.length > 1;
    openedByClick = false;
    setView('list');
    try { window.portal.setSection('blog'); } catch {}
    // 해시를 바꾸는 순간 hashchange가 목록을 다시 그립니다.
    if (stepBack) history.back();
    else if (location.hash !== '#/blog') location.hash = '#/blog';
    else sync();
  }

  document.getElementById('post-back').addEventListener('click', backToList);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && body.dataset.view === 'post') backToList();
  });

  const markOpen = event => {
    if (event.target.closest('.post-card, .post-nav-link')) openedByClick = true;
  };
  grid.addEventListener('click', markOpen, true);
  postNav.addEventListener('click', markOpen, true);

  (async function init() {
    setView('list');
    try {
      posts = await loadPosts();
    } catch (error) {
      console.warn('실험 기록을 불러오지 못했습니다:', error);
      posts = [];
      loadFailed = true;
    }
    posts.sort(byDate(portal().sort || 'newest'));
    renderTagButtons();
    if (portal().section === 'blog' || /^#\/blog/.test(location.hash || '')) {
      // setSection이 portal:section을 뿌리므로 sync가 한 번 더 실행되지 않게 합니다.
      let handedOff = false;
      try { window.portal.setSection('blog'); handedOff = true; } catch {}
      if (!handedOff) sync();
    } else {
      renderList();
      showStatus('');
    }
  })();
})();
