/* Culture Shock · B1 — логика урока.
   Один статический файл: без сборки и без бэкенда.
   Озвучка: если рядом с уроком лежит audio/<id>-<n>.mp3 — играем файл,
   иначе читаем браузерным синтезом речи (голос en-GB, если он есть). */
(function () {
  "use strict";

  var D = window.CULTURE_SHOCK;
  if (!D) return;

  var ROOT = "audio/";
  var MANIFEST = window.CULTURE_SHOCK_AUDIO || {};   // {"ca": true, "kr": true, ...}

  /* ─────────────── хранилище ответов ─────────────── */
  var KEY = "culture-shock-b1-v1";
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { store = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function get(k, dflt) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : dflt; }
  function set(k, v) { store[k] = v; save(); }

  /* ─────────────── речь ─────────────── */
  var Speech = (function () {
    var supported = "speechSynthesis" in window;
    var voices = [];
    var btn = null;
    var queue = [];
    var playing = false;
    var rate = Number(get("ttsRate", 0.92)) || 0.92;
    var audio = null;

    function loadVoices() {
      if (!supported) return;
      voices = window.speechSynthesis.getVoices() || [];
    }
    if (supported) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    function pickVoice() {
      if (!voices.length) loadVoices();
      var en = voices.filter(function (v) { return /^en(-|_)?/i.test(v.lang || ""); });
      var prefer = [
        /Sonia/i, /Libby/i, /Google UK English Female/i, /Google UK English Male/i,
        /Daniel/i, /Microsoft (Sonia|Libby|Ryan|Hazel)/i, /en-GB/i, /^en[-_]US/i, /^en/i
      ];
      for (var p = 0; p < prefer.length; p++) {
        for (var i = 0; i < en.length; i++) {
          if (prefer[p].test(en[i].name || "") || prefer[p].test(en[i].lang || "")) return en[i];
        }
      }
      return en[0] || null;
    }
    function mark(on) {
      if (btn) btn.classList.toggle("on", !!on);
    }
    function stop() {
      queue = [];
      playing = false;
      if (supported) window.speechSynthesis.cancel();
      if (audio) { try { audio.pause(); } catch (e) {} audio = null; }
      mark(false);
      if (typeof stop.onEnd === "function") { var f = stop.onEnd; stop.onEnd = null; f(); }
    }
    function speakOne(text, onstart, onend) {
      if (MANIFEST.hasOwnProperty(text.key)) {
        audio = new Audio(ROOT + text.key + ".mp3");
        audio.onended = function () { if (onend) onend(); };
        audio.onerror = function () { tts(text, onstart, onend); };
        audio.play().catch(function () { tts(text, onstart, onend); });
        return;
      }
      tts(text, onstart, onend);
    }
    function tts(item, onstart, onend) {
      if (!supported) { if (onend) onend(); return; }
      var u = new SpeechSynthesisUtterance(item.text);
      var v = pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-GB"; }
      u.rate = rate;
      u.pitch = 1;
      u.onstart = function () { if (onstart) onstart(); };
      u.onend = function () { if (onend) onend(); };
      u.onerror = function () { if (onend) onend(); };
      window.speechSynthesis.speak(u);
    }
    function play(list, opts) {
      opts = opts || {};
      stop();
      queue = (list || []).filter(function (x) { return x && x.text; });
      if (!queue.length) return;
      btn = opts.btn || null;
      mark(true);
      playing = true;
      next();
    }
    function next() {
      if (!queue.length) { playing = false; mark(false); if (typeof stop.onEnd === "function") { var f = stop.onEnd; stop.onEnd = null; f(); } return; }
      var item = queue.shift();
      if (typeof item.onStart === "function") item.onStart();
      speakOne(item, null, function () {
        if (typeof item.onEnd === "function") item.onEnd();
        next();
      });
    }
    function say(text, b) { play([{ text: text }], { btn: b }); }

    /* Проигрывание записанного файла истории.
       opts: {btn, rate, onTime(seconds, duration), onEnd, onError} */
    function playFile(url, opts) {
      stop();
      opts = opts || {};
      btn = opts.btn || null;
      mark(true);
      var a = new Audio(url);
      audio = a;
      a.playbackRate = opts.rate || 1;
      a.addEventListener("timeupdate", function () {
        if (opts.onTime) opts.onTime(a.currentTime, a.duration || 0);
      });
      a.addEventListener("ended", function () {
        playing = false; mark(false); audio = null;
        if (opts.onEnd) opts.onEnd();
      });
      a.addEventListener("error", function () {
        playing = false; mark(false); audio = null;
        if (opts.onError) opts.onError();
      });
      a.play().catch(function () { if (opts.onError) opts.onError(); });
    }
    function setRate(r) { rate = r; set("ttsRate", r); }
    return {
      play: play, stop: stop, say: say, setRate: setRate, playFile: playFile,
      get rate() { return rate; },
      supported: supported
    };
  })();

  /* ─────────────── утилиты ─────────────── */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function norm(s) {
    return String(s || "").toLowerCase().replace(/[’‘`]/g, "'").replace(/[.!?,;:]/g, "")
      .replace(/\s+/g, " ").trim();
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ─────────────── шаги урока ─────────────── */
  var STEPS = [
    { id: "lead", name: "Lead-in", render: renderLead },
    { id: "vocab", name: "Vocabulary", render: renderVocab },
    { id: "defs", name: "Definitions", render: renderDefs },
    { id: "v1", name: "Video 1 · Canada", render: function (n) { return renderVideo(0, n); } },
    { id: "v2", name: "Video 2 · Korea", render: function (n) { return renderVideo(1, n); } },
    { id: "v3", name: "Video 3 · Germany", render: function (n) { return renderVideo(2, n); } },
    { id: "mix", name: "True / False", render: renderMix },
    { id: "dlg", name: "Dialogues", render: renderDialogues },
    { id: "coll", name: "Collocations", render: renderCollocations },
    { id: "speak", name: "Discussion & scenarios", render: renderDiscussion },
    { id: "wrap", name: "Wrap up", render: renderWrap }
  ];

  var cur = Number(get("cur", 0)) || 0;
  if (cur < 0 || cur >= STEPS.length) cur = 0;

  /* ─────────────── 1. LEAD-IN ─────────────── */
  function renderLead() {
    var html = '<section class="card">' +
      head(1, "Lead-in", "Five minutes of speaking before the new vocabulary") +
      '<p class="lead">' + esc(D.leadIn.intro) + "</p>" +
      '<h3>Discuss in pairs</h3><div class="ql">';
    D.leadIn.questions.forEach(function (q, i) {
      html += '<div class="q"><b>' + (i + 1) + ". " + esc(q.q) + "</b>" +
        '<div class="hint">' + (q.hints || []).map(function (h) { return "<span>" + esc(h) + "</span>"; }).join("") + "</div></div>";
    });
    html += "</div>" +
      '<div class="actions">' +
      '<button class="btn soft" type="button" id="leadSay">🔊 Read the questions</button>' +
      "</div></section>";
    var node = el(html);
    $("#leadSay", node).addEventListener("click", function () {
      var list = D.leadIn.questions.map(function (q) { return { text: q.q }; });
      Speech.play(list, { btn: this });
    });
    return node;
  }

  function head(n, title, sub, extra) {
    return '<div class="step-head"><div class="num">' + n + "</div>" +
      '<div class="grow"><h2>' + esc(title) + "</h2>" +
      (sub ? '<p class="sub">' + esc(sub) + "</p>" : "") + "</div>" + (extra || "") + "</div>";
  }

  /* ─────────────── 2. VOCABULARY ─────────────── */
  function renderVocab() {
    var showRu = get("showRu", false);
    var html = '<section class="card">' +
      head(2, "Vocabulary preview", "Ten words that come up in all three stories") +
      '<div class="actions" style="margin:0 0 14px">' +
      '<button class="btn soft" type="button" id="ruToggle">' + (showRu ? "Hide Russian" : "Show Russian") + "</button>" +
      '<button class="btn" type="button" id="sayAll">🔊 Listen to all words</button>' +
      '<button class="btn" type="button" id="flashBtn">🗂 Flashcards</button>' +
      "</div><div class=\"word-grid\" id=\"wg\">";
    D.vocabulary.forEach(function (w, i) {
      html += '<div class="word">' +
        '<span class="ico" aria-hidden="true">' + (w.icon || "•") + "</span>" +
        '<button class="say" type="button" data-say="' + esc(w.word) + '" title="Listen">🔊</button>' +
        '<div class="w">' + esc(w.word) + '<span class="ipa">' + esc(w.ipa) + "</span></div>" +
        '<div class="pos">' + esc(w.pos) + "</div>" +
        '<div class="m">' + esc(w.meaning) + "</div>" +
        '<div class="ru"' + (showRu ? "" : ' style="display:none"') + ">🇷🇺 " + esc(w.ru) + "</div>" +
        '<div class="ex">' + esc(w.example) + "</div>" +
        "</div>";
    });
    html += "</div>" +
      '<div id="flashWrap" class="hidden" style="margin-top:22px">' + flashHtml() + "</div>" +
      "</section>";
    var node = el(html);

    $("#ruToggle", node).addEventListener("click", function () {
      var on = get("showRu", false);
      set("showRu", !on);
      $$(".ru", node).forEach(function (x) { x.style.display = !on ? "block" : "none"; });
      this.textContent = !on ? "Hide Russian" : "Show Russian";
    });
    $$("[data-say]", node).forEach(function (b) {
      b.addEventListener("click", function () { Speech.say(b.getAttribute("data-say"), b); });
    });
    $("#sayAll", node).addEventListener("click", function () {
      Speech.play(D.vocabulary.map(function (w) { return { text: w.word }; }), { btn: this });
    });
    $("#flashBtn", node).addEventListener("click", function () {
      var w = $("#flashWrap", node);
      w.classList.toggle("hidden");
      if (!w.classList.contains("hidden")) w.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    wireFlash(node);
    return node;
  }

  function flashHtml() {
    return '<div class="flash" id="flash">' +
      '<div class="fc-row" id="fcRow">' +
      D.vocabulary.map(function (w, i) {
        return '<div class="fc" tabindex="0" role="button" data-i="' + i + '" aria-label="Flip the card">' +
          '<span class="corner">' + esc(w.ipa) + '</span>' +
          '<div class="front"><span class="fc-ico">' + (w.icon || "•") + "</span><span>" + esc(w.word) + "</span></div>" +
          '<div class="back"><div class="m">' + esc(w.meaning) + "</div>" +
          '<div class="ex">“' + esc(w.example) + '”</div>' +
          '<div class="m ru-line">🇷🇺 ' + esc(w.ru) + "</div></div>" +
          "</div>";
      }).join("") +
      "</div>" +
      '<div class="actions" style="margin:14px 0 0">' +
      '<button class="btn" type="button" id="fcFlipAll">Flip all</button>' +
      '<button class="btn" type="button" id="fcShuffle">Shuffle</button>' +
      '<button class="btn soft" type="button" id="fcSay">🔊 All words</button>' +
      "</div></div>";
  }

  function wireFlash(node) {
    var row = $("#fcRow", node);
    if (!row) return;
    $$(".fc", row).forEach(function (card) {
      function flip() { card.classList.toggle("flipped"); }
      card.addEventListener("click", flip);
      card.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      });
    });
    $("#fcFlipAll", node).addEventListener("click", function () {
      var anyOpen = $$(".fc.flipped", row).length < $$(".fc", row).length;
      $$(".fc", row).forEach(function (c) { c.classList.toggle("flipped", anyOpen); });
      this.textContent = anyOpen ? "Hide all" : "Flip all";
    });
    $("#fcShuffle", node).addEventListener("click", function () {
      var cards = $$(".fc", row);
      shuffle(cards.map(function (c, i) { return i; })).forEach(function (i) { row.appendChild(cards[i]); });
      $$(".fc", row).forEach(function (c) { c.classList.remove("flipped"); });
    });
    $("#fcSay", node).addEventListener("click", function () {
      Speech.play(D.vocabulary.map(function (w) { return { text: w.word }; }), { btn: this });
    });
  }

  /* ─────────────── 3. DEFINITIONS ─────────────── */
  function renderDefs() {
    var opts = D.definitions.map(function (d) { return d.answer; });
    var html = '<section class="card">' +
      head(3, "Definitions", "Match each definition with a word") +
      '<div class="def-list" id="defs">';
    D.definitions.forEach(function (d, i) {
      html += '<div class="def" data-i="' + i + '"><div><p>' + (i + 1) + ". " + esc(d.definition) + "</p>" +
        '<div class="mark"></div></div>' +
        '<select aria-label="Answer for definition ' + (i + 1) + '"><option value="">— choose a word —</option>' +
        shuffle(opts).map(function (o) { return '<option>' + esc(o) + "</option>"; }).join("") +
        "</select></div>";
    });
    html += '</div><div class="answer"><b>Key:</b> ' + D.definitions.map(function (d, i) {
      return (i + 1) + " — " + esc(d.answer);
    }).join(" · ") + "</div>" +
      '<div class="actions"><button class="btn primary" type="button" id="defCheck">Check</button>' +
      '<button class="btn" type="button" id="defReset">Reset</button>' +
      '<span class="muted" id="defScore" style="font-weight:800"></span></div></section>';

    var node = el(html);
    var saved = get("defs", {});
    $$(".def", node).forEach(function (row, i) {
      var sel = $("select", row);
      if (saved[i]) sel.value = saved[i];
    });
    $$("select", node).forEach(function (s) {
      s.addEventListener("change", function () {
        var m = {};
        $$(".def select", node).forEach(function (x, i) { if (x.value) m[i] = x.value; });
        set("defs", m);
      });
    });
    $("#defCheck", node).addEventListener("click", function () {
      var ok = 0, seen = {};
      $$(".def", node).forEach(function (row, i) {
        var sel = $("select", row);
        var mark = $(".mark", row);
        row.classList.remove("ok", "no");
        if (!sel.value) { mark.textContent = ""; return; }
        if (norm(sel.value) === norm(D.definitions[i].answer)) {
          row.classList.add("ok"); mark.textContent = "✓ correct"; ok++;
        } else {
          row.classList.add("no"); mark.textContent = "✗ try again";
        }
        seen[i] = sel.value;
      });
      set("defs", seen);
      set("defsDone", ok === D.definitions.length);
      $("#defScore", node).textContent = ok + " / " + D.definitions.length;
      if (ok === D.definitions.length) spokenCongrats(node);
    });
    $("#defReset", node).addEventListener("click", function () {
      $$(".def", node).forEach(function (row) {
        row.classList.remove("ok", "no");
        $("select", row).value = "";
        $(".mark", row).textContent = "";
      });
      $("#defScore", node).textContent = "";
      set("defs", {});
    });
    return node;
  }

  function spokenCongrats(node) {
    var s = $("#defScore", node);
    if (s) s.textContent += " — perfect!";
  }

  /* ─────────────── 4–6. VIDEO ─────────────── */
  function renderVideo(idx, stepNum) {
    var v = D.videos[idx];
    var playAll = false;
    var html = '<section class="card">' +
      head(stepNum, "Video " + (idx + 1) + " · " + v.country + " " + v.flag,
        "Listen to the story, then answer the questions") +
      videoTabs(idx) +
      '<div class="player">' +
      '<div class="player-top"><span class="flag">' + v.flag + "</span>" +
      '<div><div class="who">' + esc(v.speaker) + '</div><div class="loc">' + esc(v.city) + " · " + esc(v.accent) + "</div></div>" +
      '<span class="time">' + esc(v.duration) + "</span></div>" +
      '<div class="screen" id="screen"' + (v.image ? ' style="background-image:url(\'' + v.image + '\')"' : '') + '>' +
      '<div class="screen-scrim"></div>' +
      '<div class="inner"><div class="kicker">Video ' + (idx + 1) + " · " + esc(v.country) + "</div>" +
      "<h4>" + esc(v.headline) + "</h4>" +
      '<div class="cap">' + esc(v.speaker) + "</div></div>" +
      "</div>" +
      '<div class="subwrap"><div class="subtitle" id="sub"></div></div>' +
      '<div class="player-ctrl">' +
      '<button class="btn primary" type="button" id="playBtn">▶ Listen to the story</button>' +
      '<button class="btn" type="button" id="stopBtn">■ Stop</button>' +
      '<button class="btn soft" type="button" id="trBtn">📄 Transcript</button>' +
      '<button class="btn sm" type="button" id="rateBtn" title="Speech speed">' + rateIcon(Speech.rate) + "</button>" +
      "</div>" +
      '<div class="transcript" id="tr"><div class="t-inner" id="trInner"></div></div>' +
      "</div>" +
      '<h3>Questions</h3><div class="qblock" id="qs"></div>' +
      '<div class="answer"><b>Key:</b> ' + v.questions.map(function (q, i) {
        return (i + 1) + " — " + "ABC"[q.answer];
      }).join(" · ") + "</div>" +
      '<div class="actions"><button class="btn" type="button" id="qCheck">Check answers</button>' +
      '<span class="muted" id="qScore" style="font-weight:800"></span></div>' +
      "</section>";

    var node = el(html);

    // transcript
    var trInner = $("#trInner", node);
    v.transcript.forEach(function (line, i) {
      var row = el('<div class="line" data-i="' + i + '"><div class="who">' + esc(line.who) + "</div>" +
        '<div class="tx">' + esc(line.text) + "</div>" +
        '<button class="say" type="button" title="Listen to this line">▶</button></div>');
      $(".say", row).addEventListener("click", function () {
        Speech.play([{ text: line.text, onStart: function () { row.classList.add("on"); }, onEnd: function () { row.classList.remove("on"); } }], { btn: this });
      });
      trInner.appendChild(row);
    });

    $("#trBtn", node).addEventListener("click", function () {
      var tr = $("#tr", node);
      var open = tr.classList.toggle("open");
      this.textContent = open ? "📄 Hide transcript" : "📄 Transcript";
    });

    var screen = $("#screen", node);
    var sub = $("#sub", node);
    screen.insertAdjacentHTML("afterbegin", '<button class="big-play" type="button" id="bigPlay" aria-label="Play">▶</button>');
    var screenInner = $(".inner", node);

    function resetLines() { $$(".line", node).forEach(function (l) { l.classList.remove("on"); }); }
    function rateIcon(r) { return r < 0.9 ? "🐢" : r < 0.99 ? "🚶" : "🐇"; }
    if (isTeacher && v.transcript.length) {
      sub.textContent = v.transcript[0].text;
      screenInner.style.opacity = "0.5";
    }
    /* Записанный голос: подсветка строк по времени, оценённому по длине текста. */
    function storyFromFile(btn) {
      var lens = v.transcript.map(function (l) { return Math.max(12, l.text.length); });
      var total = lens.reduce(function (a, b) { return a + b; }, 0);
      var acc = 0;
      var marks = lens.map(function (L) { var st = acc / total; acc += L; return { start: st, end: acc / total }; });
      var last = -1;
      function at(sec, dur) {
        if (!dur) return;
        var f = sec / dur;
        var i = 0;
        for (; i < marks.length; i++) { if (f < marks[i].end) break; }
        if (i === last) return;
        last = i;
        resetLines();
        var row = $('.line[data-i="' + i + '"]', node);
        if (row) row.classList.add("on");
        sub.textContent = v.transcript[i] ? v.transcript[i].text : "";
        screenInner.style.opacity = "0.35";
      }
      Speech.playFile(ROOT + v.id + ".mp3", {
        btn: btn,
        rate: Speech.rate < 0.9 ? 0.85 : 1,
        onTime: at,
        onEnd: function () {
          sub.textContent = ""; screenInner.style.opacity = "1"; resetLines();
        },
        onError: function () { MANIFEST[v.id] = false; sayStory(btn); }
      });
    }

    function sayStory(btn) {
      resetLines();
      if (MANIFEST[v.id]) { return storyFromFile(btn); }
      var list = v.transcript.map(function (line, i) {
        return {
          text: line.text,
          onStart: function () {
            var row = $('.line[data-i="' + i + '"]', node);
            resetLines();
            if (row) row.classList.add("on");
            sub.textContent = line.text;
            screenInner.style.opacity = "0.35";
          }
        };
      });
      list[list.length - 1].onEnd = function () {
        sub.textContent = "";
        screenInner.style.opacity = "1";
        resetLines();
      };
      Speech.play(list, { btn: btn });
    }
    $("#playBtn", node).addEventListener("click", function () { sayStory(this); });
    $("#bigPlay", node).addEventListener("click", function () { sayStory($("#playBtn", node)); });
    $("#stopBtn", node).addEventListener("click", function () {
      Speech.stop(); sub.textContent = ""; screenInner.style.opacity = "1"; resetLines();
    });
    $("#rateBtn", node).addEventListener("click", function () {
      var seq = [0.92, 0.75, 1.0];
      var at = seq.indexOf(Speech.rate);
      var nx = seq[(at === -1 ? 0 : at + 1) % seq.length];
      Speech.setRate(nx);
      this.textContent = rateIcon(nx);
      this.title = "Speed: " + nx;
      this.classList.add("on");
      var me = this;
      setTimeout(function () { me.classList.remove("on"); }, 500);
    });

    // questions
    var qs = $("#qs", node);
    var savedQ = get("q_" + v.id, {});
    v.questions.forEach(function (q, qi) {
      var card = el('<div class="qcard" data-q="' + qi + '"><p class="qq">' + (qi + 1) + ". " + esc(q.q) + "</p>" +
        '<div class="opts"></div></div>');
      var opts = $(".opts", card);
      q.options.forEach(function (o, oi) {
        var b = el('<button class="opt" type="button"><span class="b">' + "ABC"[oi] + "</span><span>" + esc(o) + "</span></button>");
        b.dataset.o = oi;
        if (savedQ[qi] === oi) b.classList.add("correct");
        b.addEventListener("click", function () {
          if (card.dataset.locked === "1") return;
          $$(".opt", card).forEach(function (x) { x.disabled = true; });
          card.dataset.locked = "1";
          if (oi === Number(q.answer)) { b.classList.add("correct"); }
          else {
            b.classList.add("wrong");
            var right = $('.opt[data-o="' + q.answer + '"]', card);
            if (right) right.classList.add("correct");
          }
          var res = get("q_" + v.id, {});
          res[qi] = oi;
          set("q_" + v.id, res);
        });
        if (savedQ[qi] !== undefined) b.disabled = true;
        opts.appendChild(b);
      });
      if (savedQ[qi] !== undefined) card.dataset.locked = "1";
      qs.appendChild(card);
    });

    $("#qCheck", node).addEventListener("click", function () {
      var ok = 0, answered = 0;
      var res = get("q_" + v.id, {});
      D.videos[idx].questions.forEach(function (q, qi) {
        if (res[qi] === undefined) return;
        answered++;
        if (res[qi] === Number(q.answer)) ok++;
      });
      $("#qScore", node).textContent = answered
        ? ok + " / " + D.videos[idx].questions.length + " correct"
        : "Answer the questions first";
    });

    return node;
  }

  function videoTabs(active) {
    return '<div class="video-tabs">' + D.videos.map(function (v, i) {
      var done = get("q_" + v.id, {});
      var all = Object.keys(done).length;
      return '<button class="vt' + (i === active ? " on" : "") + '" type="button" data-go="' + (3 + i) + '">' +
        v.flag + " " + esc(v.country) + (all ? ' <span class="done">✓' + all + "</span>" : "") + "</button>";
    }).join("") + "</div>";
  }

  /* ─────────────── 7. TRUE / FALSE + таблица ─────────────── */
  function renderMix() {
    var html = '<section class="card">' +
      head(7, "Put it together", "True or false — all three stories") +
      '<div class="tf" id="tf">';
    D.trueFalse.forEach(function (t, i) {
      html += '<div class="tf-row" data-i="' + i + '"><div class="s">' + (i + 1) + ". " + esc(t.s) + "</div>" +
        '<div class="tf-btns"><button type="button" data-v="1">TRUE</button><button type="button" data-v="0">FALSE</button></div>' +
        '<div class="why"></div></div>';
    });
    html += '</div><div class="answer"><b>Key:</b> ' + D.trueFalse.map(function (t, i) {
      return (i + 1) + " — " + (t.answer ? "T" : "F");
    }).join(" · ") + "<br>" + D.trueFalse.map(function (t, i) {
      return (i + 1) + ") " + esc(t.why);
    }).join("<br>") + "</div>" +
      '<div class="actions"><button class="btn primary" type="button" id="tfCheck">Check</button>' +
      '<button class="btn" type="button" id="tfReset">Reset</button>' +
      '<span class="muted" id="tfScore" style="font-weight:800"></span></div>' +
      '<h3>What surprised each speaker — and why it matters</h3><div class="table-wrap"><table><thead><tr>' +
      D.comparison.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
      "</tr></thead><tbody>" +
      D.comparison.rows.map(function (r) {
        return "<tr><td><b>" + esc(r.speaker) + "</b></td><td>" + esc(r.what) + "</td><td>" + esc(r.why) + "</td></tr>";
      }).join("") +
      "</tbody></table></div>" +
      '<div class="actions"><button class="btn" type="button" id="tableSay">🔊 Read the table</button></div>' +
      "</section>";

    var node = el(html);
    var saved = get("tf", {});

    $$(".tf-row", node).forEach(function (row, i) {
      var yes = $('[data-v="1"]', row), no = $('[data-v="0"]', row);
      function paint(v) {
        yes.classList.toggle("on-t", v === true);
        no.classList.toggle("on-f", v === false);
        row.classList.add("answered");
      }
      if (saved[i] !== undefined) paint(saved[i] === 1);
      [yes, no].forEach(function (b) {
        b.addEventListener("click", function () {
          var v = b.getAttribute("data-v") === "1";
          var s = get("tf", {});
          s[i] = v ? 1 : 0;
          set("tf", s);
          paint(v);
          row.classList.remove("ok", "no");
          row.classList.add(v === D.trueFalse[i].answer ? "ok" : "no");
          $(".why", row).textContent = (v === D.trueFalse[i].answer ? "✓ " : "✗ ") +
            (D.trueFalse[i].answer ? "TRUE. " : "FALSE. ") + D.trueFalse[i].why;
        });
      });
    });

    $("#tfCheck", node).addEventListener("click", function () {
      var ok = 0;
      $$(".tf-row", node).forEach(function (row, i) {
        var v = $(".on-t", row) ? true : $(".on-f", row) ? false : null;
        if (v === null) return;
        var good = v === D.trueFalse[i].answer;
        row.classList.remove("ok", "no");
        row.classList.add(good ? "ok" : "no");
        $(".why", row).textContent = (good ? "✓ " : "✗ ") + (D.trueFalse[i].answer ? "TRUE. " : "FALSE. ") + D.trueFalse[i].why;
        if (good) ok++;
      });
      $("#tfScore", node).textContent = ok + " / " + D.trueFalse.length;
    });
    $("#tfReset", node).addEventListener("click", function () {
      $$(".tf-row", node).forEach(function (row) {
        row.classList.remove("ok", "no", "answered");
        $$("button", row).forEach(function (b) { b.classList.remove("on-t", "on-f"); });
        $(".why", row).textContent = "";
      });
      $("#tfScore", node).textContent = "";
      set("tf", {});
    });
    $("#tableSay", node).addEventListener("click", function () {
      var list = [];
      D.comparison.rows.forEach(function (r) {
        list.push({ text: r.speaker + ". " + r.what + "." });
        list.push({ text: r.why + "." });
      });
      Speech.play(list, { btn: this });
    });
    return node;
  }

  /* ─────────────── 8. DIALOGUES ─────────────── */
  function renderDialogues() {
    var html = '<section class="card">' +
      head(8, "Dialogues", "Complete the gaps — some words fit more than once") +
      '<div id="dlgs"></div>' +
      '<div class="answer"><b>Key:</b> Dialogue 1 — ' + D.dialogues[0].gaps.join(", ") +
      "; Dialogue 2 — " + D.dialogues[1].gaps.join(", ") + "</div>" +
      '<div class="actions"><button class="btn primary" type="button" id="dlgCheck">Check</button>' +
      '<button class="btn" type="button" id="dlgReset">Reset</button>' +
      '<span class="muted" id="dlgScore" style="font-weight:800"></span></div></section>';
    var node = el(html);
    var host = $("#dlgs", node);
    var saved = get("dlg", {});

    D.dialogues.forEach(function (d, di) {
      var box = el('<div class="dlg" style="margin-bottom:14px"><h3>' + esc(d.title) + "</h3>" +
        '<div class="bank">' + d.bank.map(function (b) { return "<span>" + esc(b) + "</span>"; }).join("") + "</div></div>");
      d.lines.forEach(function (line, li) {
        var text = line.text.replace(/\[(\d)\]/g, function (m, n) {
          var key = di + "_" + li + "_" + n;
          var val = saved[key] ? ' value="' + esc(saved[key]) + '"' : "";
          return ' <input class="gap-input" data-key="' + key + '" data-n="' + (Number(n) - 1) + '"' + val +
            ' aria-label="gap ' + n + '" autocomplete="off"> ';
        });
        var row = el('<div class="dline"><div class="who">' + esc(line.who) + '</div><div class="tx">' + text + "</div></div>");
        box.appendChild(row);
      });
      // подсказка: список пропусков в порядке
      box.appendChild(el('<div class="actions" style="margin:10px 0 0"><button class="btn sm" type="button" data-play="' + di + '">🔊 Listen to the dialogue</button></div>'));
      host.appendChild(box);
    });

    $$(".gap-input", node).forEach(function (inp) {
      inp.addEventListener("input", function () {
        var s = get("dlg", {});
        s[inp.dataset.key] = inp.value;
        set("dlg", s);
      });
    });

    $$("[data-play]", node).forEach(function (b) {
      b.addEventListener("click", function () {
        var d = D.dialogues[Number(b.getAttribute("data-play"))];
        Speech.play(d.lines.map(function (l) { return { text: l.text.replace(/\[\d\]/g, "blank") }; }), { btn: b });
      });
    });

    $("#dlgCheck", node).addEventListener("click", function () {
      var ok = 0, total = 0;
      D.dialogues.forEach(function (d, di) {
        d.lines.forEach(function (line, li) {
          var n = 0;
          line.text.replace(/\[(\d)\]/g, function (m, num) { n = Number(num); });
          if (!n) return;
          var inp = $('.gap-input[data-key="' + di + "_" + li + "_" + n + '"]', node);
          if (!inp) return;
          total++;
          var right = (d.gapsByLine && d.gapsByLine[li] && d.gapsByLine[li][Number(n) - 1]) || d.gaps[Number(n) - 1];
          inp.classList.remove("correct", "wrong");
          if (norm(inp.value) === norm(right)) { inp.classList.add("correct"); ok++; }
          else inp.classList.add("wrong");
        });
      });
      $("#dlgScore", node).textContent = ok + " / " + total;
    });
    $("#dlgReset", node).addEventListener("click", function () {
      $$(".gap-input", node).forEach(function (i) { i.value = ""; i.classList.remove("correct", "wrong"); });
      $("#dlgScore", node).textContent = "";
      set("dlg", {});
    });
    return node;
  }

  /* ─────────────── 9. COLLOCATIONS ─────────────── */
  function renderCollocations() {
    var html = '<section class="card">' +
      head(9, "Collocations", "Match the halves, then complete the sentences") +
      '<div class="cols"><div><div class="col-h">First half</div><div id="left"></div></div>' +
      '<div><div class="col-h">Second half</div><div id="right"></div></div></div>' +
      '<div class="pairlist" id="pairs"></div>' +
      '<div class="actions"><button class="btn" type="button" id="colReset">Reset pairs</button>' +
      '<span class="muted" id="colScore" style="font-weight:800"></span></div>' +
      '<h3>Use them in sentences</h3><div class="gapsent" id="gs"></div>' +
      '<div class="answer"><b>Key:</b> ' + D.collocations.sentences.map(function (x, i) {
        return (i + 1) + " — " + esc(x.answer[0]);
      }).join(" · ") + "</div>" +
      '<div class="actions"><button class="btn primary" type="button" id="gsCheck">Check</button>' +
      '<span class="muted" id="gsScore" style="font-weight:800"></span></div></section>';

    var node = el(html);
    var pairs = D.collocations.pairs;
    var leftOrder = shuffle(pairs.map(function (p, i) { return i; }));
    var rightOrder = shuffle(pairs.map(function (p, i) { return i; }));
    var picked = null, solved = 0;

    var L = $("#left", node), R = $("#right", node);
    leftOrder.forEach(function (i) {
      var b = el('<button class="colbtn" type="button" data-side="l" data-i="' + i + '">' + esc(pairs[i].left) + "</button>");
      L.appendChild(b);
    });
    rightOrder.forEach(function (i) {
      var b = el('<button class="colbtn" type="button" data-side="r" data-i="' + i + '">' + esc(pairs[i].right) + "</button>");
      R.appendChild(b);
    });
    function pairDone(i) {
      $$('.colbtn[data-i="' + i + '"]', node).forEach(function (b) { b.classList.add("paired"); b.disabled = true; });
      var p = pairs[i];
      $("#pairs", node).appendChild(el('<div class="p"><b>' + esc(p.left + " " + p.right) + "</b> — <span>" + esc(p.example) + "</span></div>"));
      solved++;
      $("#colScore", node).textContent = solved + " / " + pairs.length;
    }
    node.addEventListener("click", function (e) {
      var b = e.target.closest(".colbtn");
      if (!b || b.disabled) return;
      if (b.dataset.side === "l") {
        $$('.colbtn[data-side="l"]', node).forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel");
        picked = b;
        return;
      }
      if (!picked) { b.classList.add("shake"); setTimeout(function () { b.classList.remove("shake"); }, 340); return; }
      if (picked.dataset.i === b.dataset.i) {
        pairDone(Number(b.dataset.i));
        picked = null;
      } else {
        b.classList.add("shake");
        picked.classList.add("shake");
        var p = picked;
        setTimeout(function () {
          b.classList.remove("shake"); p.classList.remove("shake");
        }, 340);
      }
    });

    $("#colReset", node).addEventListener("click", function () {
      $$(".colbtn", node).forEach(function (b) { b.classList.remove("paired", "sel"); b.disabled = false; });
      $("#pairs", node).innerHTML = "";
      $("#colScore", node).textContent = "";
      solved = 0; picked = null;
    });

    var gs = $("#gs", node);
    D.collocations.sentences.forEach(function (s, i) {
      var parts = s.text.split("____");
      var row = el('<div class="gs"><span class="txt">' + (i + 1) + ". " + esc(parts[0]) +
        '<input data-i="' + i + '" autocomplete="off" aria-label="gap ' + (i + 1) + '">' +
        esc(parts[1] || "") + '</span><span class="mark"></span></div>');
      row.appendChild(el('<span class="hint">' + esc(s.hint) + "</span>"));
      gs.appendChild(row);
    });
    $("#gsCheck", node).addEventListener("click", function () {
      var ok = 0;
      $$(".gs", node).forEach(function (row, i) {
        var inp = $("input", row);
        var good = D.collocations.sentences[i].answer.some(function (a) { return norm(inp.value) === norm(a); });
        row.classList.remove("ok", "no");
        row.classList.add(good ? "ok" : "no");
        $(".mark", row).textContent = good ? "✓" : "✗ " + D.collocations.sentences[i].answer[0];
        if (good) ok++;
      });
      $("#gsScore", node).textContent = ok + " / " + D.collocations.sentences.length;
    });
    return node;
  }

  /* ─────────────── 10. DISCUSSION + SCENARIOS ─────────────── */
  function renderDiscussion() {
    var html = '<section class="card">' +
      head(10, "Discussion", "Questions and awkward cross-cultural situations") +
      '<div class="ql">' + D.discussion.map(function (q, i) {
        return '<div class="q"><b>' + (i + 1) + ". " + esc(q) + "</b></div>";
      }).join("") + "</div>" +
      '<div class="actions"><button class="btn soft" type="button" id="discSay">🔊 Read the questions</button></div>' +
      '<h3>Scenarios · role-play</h3>' +
      D.scenarios.map(function (s, i) {
        return '<div class="scen" data-i="' + i + '"><div class="scen-head" role="button" tabindex="0"><span>' + "🎭" + "</span>" +
          '<span class="t">' + esc(s.title) + '</span><span class="chev">▾</span></div>' +
          '<div class="scen-body"><p class="sit">' + esc(s.situation) + "</p>" +
          '<div class="useful">' + s.useful.map(function (u) { return "<span>" + esc(u) + "</span>"; }).join("") + "</div>" +
          '<p class="tip">💡 ' + esc(s.tips) + "</p>" +
          '<div class="actions" style="margin:0"><button class="btn sm" type="button" data-say-scen="' + i + '">🔊 Read the situation</button></div>' +
          "</div></div>";
      }).join("") + "</section>";

    var node = el(html);
    $$(".scen", node).forEach(function (sc) {
      var h = $(".scen-head", sc);
      function toggle() { sc.classList.toggle("open"); }
      h.addEventListener("click", toggle);
      h.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    });
    $$("[data-say-scen]", node).forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var s = D.scenarios[Number(b.getAttribute("data-say-scen"))];
        Speech.play([{ text: s.situation }], { btn: b });
      });
    });
    $("#discSay", node).addEventListener("click", function () {
      Speech.play(D.discussion.map(function (q) { return { text: q }; }), { btn: this });
    });
    return node;
  }

  /* ─────────────── 11. WRAP UP ─────────────── */
  function renderWrap() {
    var html = '<section class="card">' +
      head(11, "Wrap up", "Check yourself, then note the homework") +
      '<div class="check" id="check">' +
      D.wrapUp.checklist.map(function (c, i) {
        var on = get("check_" + i, false);
        return '<label class="' + (on ? "on" : "") + '"><input type="checkbox" data-i="' + i + '"' + (on ? " checked" : "") + "><span>" + esc(c) + "</span></label>";
      }).join("") + "</div>" +
      '<h3>Homework</h3><div class="hw"><ol>' +
      D.wrapUp.homework.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ol></div>" +
      '<div class="actions"><button class="btn primary" type="button" id="printBtn2">🖨 Print the worksheet</button>' +
      '<button class="btn" type="button" id="restart">↺ Start the lesson again</button></div>' +
      "</section>";

    var node = el(html);
    $$("input[type=checkbox]", node).forEach(function (cb) {
      cb.addEventListener("change", function () {
        set("check_" + cb.dataset.i, cb.checked);
        cb.closest("label").classList.toggle("on", cb.checked);
      });
    });
    $("#printBtn2", node).addEventListener("click", function () { window.print(); });
    $("#restart", node).addEventListener("click", function () {
      if (!confirm("Clear all answers and start the lesson again?")) return;
      try { localStorage.removeItem(KEY); } catch (e) {}
      store = {};
      cur = 0;
      render();
    });
    return node;
  }

  /* ─────────────── навигация ─────────────── */
  var host = document.getElementById("steps");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var stepName = document.getElementById("stepName");
  var progBar = document.getElementById("progBar");

  function render() {
    Speech.stop();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    var step = STEPS[cur];
    host.innerHTML = "";
    host.appendChild(step.render(cur + 1));
    stepName.textContent = step.name;
    prevBtn.disabled = cur === 0;
    nextBtn.textContent = cur === STEPS.length - 1 ? "Done ✓" : "Next →";
    nextBtn.disabled = cur === STEPS.length - 1;
    var visited = get("visited", {});
    visited[cur] = 1;
    set("visited", visited);
    set("cur", cur);
    var done = Object.keys(visited).length;
    var pct = Math.round(Math.min(done, STEPS.length) / STEPS.length * 100);
    if (progBar) progBar.style.width = pct + "%";
    // переключатели видео-табов
    $$("[data-go]", host).forEach(function (b) {
      b.addEventListener("click", function () { go(Number(b.getAttribute("data-go"))); });
    });
    applyTeacher();
    // панель учителя: прокручиваем к верху
    if (location.hash && location.hash.length > 1) {
      try { history.replaceState(null, "", location.pathname); } catch (e) {}
    }
  }

  function go(n) {
    if (n < 0 || n >= STEPS.length) return;
    cur = n;
    render();
  }
  prevBtn.addEventListener("click", function () { go(cur - 1); });
  nextBtn.addEventListener("click", function () { go(cur + 1); });
  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, select, textarea")) return;
    if (e.key === "ArrowRight") go(cur + 1);
    if (e.key === "ArrowLeft") go(cur - 1);
  });

  /* ─────────────── тема ─────────────── */
  var themeBtn = document.getElementById("themeBtn");
  function applyTheme(t) {
    if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  }
  var savedTheme = get("theme", "");
  if (!savedTheme) {
    try { savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { savedTheme = "light"; }
  }
  applyTheme(savedTheme);
  themeBtn.addEventListener("click", function () {
    var now = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    var nx = now === "dark" ? "light" : "dark";
    set("theme", nx);
    applyTheme(nx);
  });

  /* ─────────────── режим учителя ─────────────── */
  var teacherBar = document.getElementById("teacherBar");
  var isTeacher = /(\?|&)teacher(=|&|$)/.test(location.search) || get("teacher", false);
  function applyTeacher() {
    document.body.classList.toggle("teacher-mode", isTeacher);
    teacherBar.classList.toggle("hidden", !isTeacher);
    $$(".answer").forEach(function (a) {
      a.classList.toggle("hidden", !isTeacher);
      a.style.display = isTeacher ? "block" : "none";   // не зависим от каскада CSS
    });
  }
  applyTeacher();
  var revealAll = document.getElementById("revealAll");
  if (revealAll) revealAll.addEventListener("click", function () {
    // открываем все тексты и подсказки на текущем шаге
    $$(".transcript").forEach(function (t) { t.classList.add("open"); });
    $$(".scen").forEach(function (s) { s.classList.add("open"); });
  });
  Array.prototype.forEach.call(document.querySelectorAll("#printBtn"), function (b) {
    b.addEventListener("click", function () { window.print(); });
  });

  // Ctrl+Shift+T — включить/выключить режим учителя
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key === "T" || e.key === "t")) {
      isTeacher = !isTeacher;
      set("teacher", isTeacher);
      applyTeacher();
    }
  });

  render();
})();
