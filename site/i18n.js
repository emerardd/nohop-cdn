// 中英切换。页面 HTML 保持中文，切到英文时按“中文原文 → 英文”对照表逐个替换文本节点。
// 语言优先级：URL 参数 ?lang= → 上次的选择 → 浏览器语言。
(function () {
  var KEY = 'nohop-lang';
  var q = null;
  try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  var lang = null;
  if (q === 'en' || q === 'zh') {
    lang = q;
    try { localStorage.setItem(KEY, q); } catch (e) {}
  } else {
    try { lang = localStorage.getItem(KEY); } catch (e) {}
  }
  if (lang !== 'en' && lang !== 'zh') lang = /^zh/i.test(navigator.language || '') ? 'zh' : 'en';

  var root = document.documentElement;
  root.lang = lang === 'en' ? 'en' : 'zh-CN';
  if (lang === 'en') {
    // 替换完成前先隐藏页面，避免闪一下中文
    var st = document.createElement('style');
    st.textContent = 'html.i18n-pending body{visibility:hidden}';
    document.head.appendChild(st);
    root.classList.add('i18n-pending');
    setTimeout(function () { root.classList.remove('i18n-pending'); }, 1500);
  }

  var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };

  window.NOHOP_LANG = lang;
  window.L = function (zh, en) { return lang === 'en' ? en : zh; };

  window.i18nApply = function (text, html, title) {
    if (lang !== 'en') return;
    text = text || {};
    if (html) {
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        if (has(html, el.dataset.i18n)) el.innerHTML = html[el.dataset.i18n];
      });
    }
    var skip = { SCRIPT: 1, STYLE: 1 };
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n, missing = [];
    while ((n = w.nextNode())) {
      if (n.parentNode && skip[n.parentNode.nodeName]) continue;
      var raw = n.nodeValue, key = raw.trim();
      if (!key) continue;
      if (has(text, key)) n.nodeValue = raw.replace(key, text[key]);
      else if (/[一-鿿]/.test(key)) missing.push(key);
    }
    ['aria-label', 'placeholder', 'title'].forEach(function (attr) {
      document.querySelectorAll('[' + attr + ']').forEach(function (el) {
        var k = el.getAttribute(attr).trim();
        if (has(text, k)) el.setAttribute(attr, text[k]);
      });
    });
    if (title) document.title = title;
    if (missing.length) console.debug('[i18n] 未翻译：', missing);
    root.classList.remove('i18n-pending');
  };

  // 切换按钮：显示另一种语言的名字，点击后带上 ?lang= 重新加载
  window.i18nToggle = function (el) {
    var other = lang === 'en' ? 'zh' : 'en';
    el.textContent = lang === 'en' ? '中文' : 'EN';
    el.setAttribute('aria-label', lang === 'en' ? '切换到中文' : 'Switch to English');
    el.addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.setItem(KEY, other); } catch (err) {}
      var u = new URL(location.href);
      u.searchParams.set('lang', other);
      location.href = u.toString();
    });
  };
})();
