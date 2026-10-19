/* Gabi hubs: every lesson / homework opens full screen.
   The task is loaded into a full-viewport frame and the browser is switched
   to full screen on the same click, so there are no browser bars or hub bars.
   Going back to the hub (any "Hub/Home" link inside the task) or the small
   x button closes the frame and returns to the hub start screen. */
(function(){
  var css = '' +
    '#gfsLayer{position:fixed;inset:0;z-index:99999;background:#fff;display:none}' +
    '#gfsLayer.on{display:block}' +
    '#gfsLayer iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}' +
    '#gfsClose,#gfsFull{position:absolute;bottom:4px;z-index:2;width:30px;height:30px;border:0;border-radius:50%;' +
      'background:rgba(30,40,30,.55);color:#fff;font:600 15px/30px Georgia,serif;cursor:pointer;opacity:0;transition:opacity .2s;padding:0}' +
    '#gfsClose{right:4px;width:22px;height:22px;font-size:12px;line-height:22px}#gfsFull{right:30px;width:22px;height:22px;font-size:12px;line-height:22px;display:none}' +
    '#gfsClose:hover,#gfsFull:hover{opacity:1}' +
    'html.gfsOpen,html.gfsOpen body{overflow:hidden}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var layer, frame, full;
  function build(){
    if (layer) return;
    layer = document.createElement('div'); layer.id = 'gfsLayer';
    frame = document.createElement('iframe');
    frame.setAttribute('allow', 'fullscreen; autoplay; microphone; clipboard-write');
    frame.setAttribute('allowfullscreen', '');
    frame.title = 'Lesson';
    var x = document.createElement('button'); x.id = 'gfsClose'; x.type = 'button';
    x.title = 'Back to hub'; x.setAttribute('aria-label', 'Back to hub'); x.textContent = '✕';
    x.onclick = close;
    full = document.createElement('button'); full.id = 'gfsFull'; full.type = 'button';
    full.title = 'Full screen'; full.setAttribute('aria-label', 'Full screen'); full.textContent = '⤢';
    full.onclick = goFull;
    layer.appendChild(frame); layer.appendChild(x); layer.appendChild(full);
    document.body.appendChild(layer);
    frame.addEventListener('load', watchFrame);
    document.addEventListener('fullscreenchange', syncFull);
    document.addEventListener('webkitfullscreenchange', syncFull);
  }
  function isFull(){ return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function goFull(){
    var el = document.documentElement;
    try {
      var p = el.requestFullscreen ? el.requestFullscreen({navigationUI:'hide'}) :
              el.webkitRequestFullscreen ? el.webkitRequestFullscreen() : null;
      if (p && p.catch) p.catch(function(){});
    } catch(e) {}
  }
  function syncFull(){ if (full) full.style.display = (layer.classList.contains('on') && !isFull()) ? 'block' : 'none'; }
  function hubPath(){ return location.pathname.replace(/index\.html$/, ''); }
  function watchFrame(){
    try {
      var w = frame.contentWindow, p = w.location.pathname;
      if (frame.dataset.src && (p === hubPath() || p === hubPath() + 'index.html')) { close(); return; }
      /* tasks open from their own start, never from where they stopped */
      try { w.scrollTo(0, 0); } catch(e) {}
      /* if the browser refused full screen on the first click, switch it on
         at the first tap inside the task */
      var d = w.document;
      if (!d.__gfsHooked) {
        d.__gfsHooked = true;
        var again = function(){ if (layer.classList.contains('on') && !isFull()) goFull(); };
        d.addEventListener('pointerdown', again, true);
        d.addEventListener('keydown', function(e){ if (e.key !== 'Escape') again(); }, true);
      }
    } catch(e) {}
  }
  function open(url){
    build();
    frame.dataset.src = url;
    frame.src = url;
    layer.classList.add('on');
    document.documentElement.classList.add('gfsOpen');
    goFull();
    syncFull();
  }
  function close(){
    if (!layer) return;
    layer.classList.remove('on');
    document.documentElement.classList.remove('gfsOpen');
    frame.dataset.src = '';
    frame.src = 'about:blank';
    if (isFull()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch(e) {} }
    syncFull();
    window.scrollTo(0, 0);
  }
  function isTask(href){
    if (!href) return false;
    var u; try { u = new URL(href, location.href); } catch(e) { return false; }
    if (u.origin !== location.origin) return false;
    if (!/\.html$/i.test(u.pathname)) return false;
    if (/\/index\.html$/i.test(u.pathname)) return false;
    return true;
  }

  /* links (tiles, "Open ->" cards) */
  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    if (!isTask(a.getAttribute('href'))) return;
    e.preventDefault();
    open(a.href);
  }, true);

  /* menus that navigate by script (location.href = 'lessonN.html') */
  window.gabiOpenTask = function(url){ if (isTask(url)) open(new URL(url, location.href).href); else location.href = url; };

  window.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && layer && layer.classList.contains('on') && !isFull()) close();
  });
})();
