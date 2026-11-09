/* Natural voice for the EGE trainers.
   Replaces the browser's robotic speech synthesis with recordings made by the
   "Card audio" workflow (natural British neural voice, card-audio/<key>.mp3).
   The trainers keep calling speechSynthesis.speak(...) as before; this file
   plays the matching recording instead. If a recording is missing, nothing
   robotic plays: the utterance simply reports an error to the trainer. */
(function(){
  'use strict';
  var me = document.currentScript;
  var BASE = 'https://altatiana7.github.io/EGE-train-for-teacher/voice/';
  var VER = (me && /[?&]v=([^&]+)/.exec(me.src) || [])[1] || '1';

  function clean(s){ return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function norm(s){ return clean(s).toLowerCase().replace(/[‘’ʼ]/g, "'").replace(/[^a-z0-9']+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function cyrb53(str){
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0, ch; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  function key(s){ return cyrb53(norm(s)).toString(36); }
  window.NaturalVoiceKey = key;

  var VOICE = { name: 'British English (natural)', lang: 'en-GB', default: true, localService: true, voiceURI: 'natural-en-GB' };

  function Utterance(text){
    this.text = text == null ? '' : String(text);
    this.lang = 'en-GB'; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null;
    this.onstart = this.onend = this.onerror = this.onpause = this.onresume = this.onboundary = this.onmark = null;
    this._l = {};
  }
  Utterance.prototype.addEventListener = function(t, f){ (this._l[t] = this._l[t] || []).push(f); };
  Utterance.prototype.removeEventListener = function(t, f){ this._l[t] = (this._l[t] || []).filter(function(g){ return g !== f; }); };
  function fire(u, type){
    var ev = { type: type, utterance: u, target: u, elapsedTime: 0, charIndex: 0, error: type === 'error' ? 'audio-unavailable' : undefined };
    try { if (typeof u['on' + type] === 'function') u['on' + type](ev); } catch(e) { setTimeout(function(){ throw e; }); }
    (u._l[type] || []).forEach(function(f){ try { f(ev); } catch(e) {} });
  }

  var au = new Audio(); au.preload = 'auto';
  var cur = null;
  function finish(type){ var u = cur; cur = null; synth.speaking = false; synth.paused = false; if (u) fire(u, type); }
  au.addEventListener('ended', function(){ finish('end'); });
  au.addEventListener('error', function(){ if (cur) finish('error'); });

  var synth = {
    speaking: false, pending: false, paused: false, onvoiceschanged: null,
    getVoices: function(){ return [VOICE]; },
    speak: function(u){
      synth.cancel();
      var text = clean(u && u.text);
      if (!text || !/[a-z]/i.test(text) || (u.volume === 0)) { setTimeout(function(){ fire(u, 'end'); }, 0); return; }
      cur = u; synth.speaking = true;
      au.src = BASE + key(text) + '.mp3?v=' + VER;
      au.playbackRate = 1;
      var p = au.play();
      if (p && p.then) p.then(function(){ if (cur === u) fire(u, 'start'); }).catch(function(e){ if (cur === u && e && e.name !== 'AbortError') finish('error'); });
      else fire(u, 'start');
    },
    cancel: function(){ cur = null; synth.speaking = false; synth.paused = false; try { au.pause(); } catch(e){} },
    pause: function(){ try { au.pause(); } catch(e){} synth.paused = true; },
    resume: function(){ if (cur && synth.paused) { synth.paused = false; au.play().catch(function(){}); } },
    addEventListener: function(){}, removeEventListener: function(){}
  };

  try { Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true, writable: true }); } catch(e) { window.speechSynthesis = synth; }
  try { Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance, configurable: true, writable: true }); } catch(e) { window.SpeechSynthesisUtterance = Utterance; }
})();
