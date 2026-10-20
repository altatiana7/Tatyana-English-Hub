/* Card audio — natural recorded voice for Quizlet-style cards.
   Adds a small "Listen" button to every word card on the page and plays
   card-audio/<key>.mp3 (made by the "Card audio" GitHub workflow with a neural voice).
   No browser speech synthesis: if a recording is missing, the button just says so. */
(function(){
  'use strict';
  if (window.CardAudio) return;
  var me = document.currentScript;
  var BASE = new URL('card-audio/', me ? me.src : location.href).href;
  var VER = (me && /[?&]v=([^&]+)/.exec(me.src) || [])[1] || '1';

  function clean(s){
    s = String(s == null ? '' : s);
    if (/[<&]/.test(s)) { var d = document.createElement('div'); d.innerHTML = s.replace(/<br\s*\/?>/gi, ' '); s = d.textContent; }
    return s.replace(/\s+/g, ' ').trim();
  }
  function norm(s){ return clean(s).toLowerCase().replace(/[‘’ʼ]/g, "'").replace(/[^a-z0-9']+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function cyrb53(str){
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0, ch; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  function key(s){ return cyrb53(norm(s)).toString(36); }
  function isEn(s){ s = clean(s); return !!s && s.length <= 220 && !/[Ѐ-ӿæðɐ-˿]/.test(s) && /[a-z]/i.test(s); }
  function spoken(s){
    return clean(s)
      .replace(/\b(smb|sb)\b/gi, 'somebody').replace(/\b(smth|sth)\b/gi, 'something')
      .replace(/_{2,}/g, ' ').replace(/\s*\/\s*/g, ', ').replace(/[()\[\]]/g, '')
      .replace(/^[\s•·\-–—→]+/, '').replace(/\s+/g, ' ').trim();
  }

  /* ---------- player ---------- */
  var au = new Audio(); au.preload = 'auto';
  var queue = [], cur = null, onDone = null;
  function stop(){ queue = []; try { au.pause(); } catch(e){} setState(null); }
  function setState(btn, cls){
    document.querySelectorAll('.ca-btn.ca-on,.ca-btn.ca-err').forEach(function(b){ b.classList.remove('ca-on','ca-err'); });
    if (btn && cls) btn.classList.add(cls);
  }
  function next(){
    if (!queue.length) { setState(null); if (onDone) { var f = onDone; onDone = null; f(); } return; }
    var t = queue.shift();
    au.src = BASE + key(t) + '.mp3?v=' + VER;
    au.play().catch(function(){});
  }
  au.onended = next;
  au.onerror = function(){
    var b = cur; queue = [];
    if (b) { setState(b, 'ca-err'); b.title = 'The recording for this card is not ready yet'; setTimeout(function(){ b.classList.remove('ca-err'); b.title = 'Listen'; }, 1600); }
  };
  function sayList(list, btn, done){
    stop(); cur = btn || null; onDone = done || null;
    queue = (list || []).filter(isEn);
    if (!queue.length) return;
    if (btn) setState(btn, 'ca-on');
    next();
  }
  function say(t, btn, done){ sayList([t], btn, done); }

  /* ---------- styles ---------- */
  var css = '.ca-btn{position:absolute;top:8px;right:8px;z-index:6;width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;'
    + 'background:#fff;color:#1f3b57;border:1px solid rgba(31,59,87,.22);box-shadow:0 2px 6px rgba(20,40,60,.12);cursor:pointer;padding:0;line-height:0;'
    + 'transition:transform .15s,background .15s;-webkit-tap-highlight-color:transparent}'
    + '.ca-btn:hover{transform:scale(1.07);background:#f3f7fb}.ca-btn:focus-visible{outline:2px solid #2d6fa3;outline-offset:2px}'
    + '.ca-btn svg{width:18px;height:18px}.ca-btn.ca-on{background:#1f3b57;color:#fff;border-color:#1f3b57}'
    + '.ca-btn.ca-on svg .ca-w{animation:caw 1s ease-in-out infinite}@keyframes caw{50%{opacity:.25}}'
    + '.ca-btn.ca-err{animation:cax .35s;background:#fbecec;color:#a33}@keyframes cax{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}'
    + '.ca-btn[hidden]{display:none}';
  var st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>'
    + '<path class="ca-w" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

  /* ---------- card types on the sites ----------
     root: the card; host: the element that does NOT rotate (button sits there);
     flipped(root); front/backTerm/backEx: selectors inside root. */
  function cls(c){ return function(r){ return r.classList.contains(c); }; }
  var TYPES = [
    { root: '#generationFlashcard', host: function(r){ return r.parentElement; }, flipped: cls('flipped'), front: '#generationFront', backEx: '#generationExample' },
    { root: '.fc', flipped: cls('flipped'), front: '.fc-front strong', backEx: '.fc-back #ex, .fc-back #fcEx, .fc-back .ex' },
    { root: '.flip-in#card', host: function(r){ return r.parentElement; }, flipped: cls('back'), front: '.face.f .term', backTerm: '.face.b .term', backEx: '.face.b .ex' },
    { root: '.flip#flip', flipped: cls('on'), front: '.flip-in > .face:not(.back) .mid', backTerm: '.face.back .big', backEx: '.face.back .mid' },
    { root: '.flashcard#flashcard', flipped: cls('flipped'), front: '#frontWord', backTerm: '#backWord', backEx: '#definition' },
    { root: '.quizlet-card#flashcard', single: '#flash-text' },
    { root: '.qz-card', flipped: cls('fl'), front: '.front .big, .front .mid', backTerm: '.back .mid b, .back .mid', backEx: '.back .ex' },
    { root: '.ql#ql', flipped: cls('f'), front: '#qf', backEx: '#qb' }
  ];
  function txt(r, sel){ if (!sel) return ''; var e = r.querySelector(sel); return e ? clean(e.textContent) : ''; }

  function textsFor(T, r){
    if (T.single) {
      var s = txt(r, T.single);
      if (isEn(s)) { r._caEn = s; return [s]; }
      return r._caEn ? [r._caEn] : [];
    }
    var f = txt(r, T.front), bt = txt(r, T.backTerm), be = txt(r, T.backEx);
    var term = isEn(f) ? f : (isEn(bt) ? bt : '');
    if (T.flipped && T.flipped(r)) {
      var out = [];
      if (isEn(bt) && norm(bt) !== norm(f)) out.push(bt);
      if (isEn(be) && norm(be) !== norm(term)) out.push(be);
      return out.length ? out : (term ? [term] : []);
    }
    return term ? [term] : [];
  }

  function bind(T, r){
    r.setAttribute('data-ca', '1');
    var host = T.host ? T.host(r) : r;
    if (!host) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var b = document.createElement('span');
    b.className = 'ca-btn'; b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0');
    b.setAttribute('aria-label', 'Listen'); b.title = 'Listen'; b.innerHTML = ICON;
    function go(e){ e.preventDefault(); e.stopPropagation(); if (b.classList.contains('ca-on')) { stop(); return; } sayList(textsFor(T, r), b); }
    b.addEventListener('click', go);
    b.addEventListener('pointerdown', function(e){ e.stopPropagation(); });
    b.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') go(e); });
    host.appendChild(b);
    r._caBtn = b;
    refresh(T, r);
  }
  function refresh(T, r){ if (r._caBtn) r._caBtn.hidden = !textsFor(T, r).length; }

  var pending = false;
  function scan(){
    pending = false;
    TYPES.forEach(function(T){
      document.querySelectorAll(T.root).forEach(function(r){
        if (!r.hasAttribute('data-ca')) bind(T, r); else refresh(T, r);
      });
    });
    document.querySelectorAll('.ca-btn').forEach(function(b){ if (!b.isConnected) stop(); });
  }
  function later(){ if (!pending) { pending = true; requestAnimationFrame(scan); } }
  function start(){
    scan();
    new MutationObserver(function(ms){
      for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (t.closest && t.closest('.ca-btn')) continue; later(); return; }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.CardAudio = { say: say, sayList: sayList, stop: stop, key: key, norm: norm, spoken: spoken, isEn: isEn, clean: clean, base: BASE };
})();
