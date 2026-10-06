/* Общие функции тренажёра */
const $=(s,r)=>(r||document).querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(label,fn,cls)=>{const b=el('button','btn'+(cls?' '+cls:''),label);b.type='button';b.onclick=fn;return b;};
const mmss=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
/* как в бланке ЕГЭ: без пробелов и знаков, don't = do not */
const norm=x=>String(x).toLowerCase().replace(/[’‘`]/g,"'").replace(/won't/g,'will not').replace(/can't/g,'cannot').replace(/n't/g,' not').replace(/[^a-z]/g,'');
const words=s=>(String(s).trim().match(/\S+/g)||[]).length;
let actx=null;
function beep(f,ms){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f||660;g.gain.value=.08;o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+(ms||250)/1000);}catch(e){}}

/* Таймер раздела в верхней панели */
const Clock={left:0,total:0,run:false,t:null,
  mount(){this.b=$('#clk');this.s=$('#clkBtn');this.s.onclick=()=>this.toggle();},
  set(sec){this.stop();this.left=this.total=sec;this.paint();this.s.textContent='Старт';this.s.hidden=!sec;this.b.hidden=!sec;},
  paint(){this.b.textContent=mmss(this.left);this.b.classList.toggle('low',this.total>0&&this.left<=60);},
  toggle(){if(this.run){this.stop();this.s.textContent='Продолжить';return;}
    if(this.left<=0)this.left=this.total;this.run=true;this.s.textContent='Пауза';const end=Date.now()+this.left*1000;
    this.t=setInterval(()=>{this.left=(end-Date.now())/1000;if(this.left<=0){this.left=0;this.stop();this.s.textContent='Сначала';beep(520,500);}this.paint();},250);},
  stop(){clearInterval(this.t);this.run=false;}
};

/* Запись ответа с микрофона (по желанию) */
const Rec={on:false,mr:null,chunks:[],stream:null,
  async enable(){if(this.stream)return true;try{this.stream=await navigator.mediaDevices.getUserMedia({audio:true});return true;}catch(e){return false;}},
  start(){if(!this.on||!this.stream||this.mr)return;try{this.chunks=[];this.mr=new MediaRecorder(this.stream);this.mr.ondataavailable=e=>{if(e.data.size)this.chunks.push(e.data);};this.mr.start();}catch(e){this.mr=null;}},
  stop(box,name){const mr=this.mr;if(!mr)return;this.mr=null;mr.onstop=()=>{if(!this.chunks.length||!box||!box.isConnected)return;const blob=new Blob(this.chunks,{type:mr.mimeType||'audio/webm'}),u=URL.createObjectURL(blob);
      box.innerHTML='Запись ответа: <a download="'+name+'.webm" href="'+u+'">сохранить файл</a><audio controls src="'+u+'"></audio>';};try{mr.stop();}catch(e){}},
  cancel(){const mr=this.mr;this.mr=null;if(mr){mr.onstop=null;try{mr.stop();}catch(e){}}}
};
function recToggle(){const b=btn('Запись ответа: выкл',async()=>{if(!Rec.on){const ok=await Rec.enable();if(!ok){b.textContent='Микрофон недоступен';return;}Rec.on=true;}else Rec.on=false;b.textContent='Запись ответа: '+(Rec.on?'вкл':'выкл');b.classList.toggle('main',Rec.on);},'sm wide');
  if(Rec.on){b.textContent='Запись ответа: вкл';b.classList.add('main');}return b;}

/* Круговой таймер с фазами (подготовка / ответ) */
function phaseRunner(o){ /* o: ring, label, phases[{label,kind,sec}], onPhase(i), onDone(), recBox, recName */
  let i=-1,end=0,left=0,t=null,paused=false;
  const b=o.ring.querySelector('b'),sp=o.ring.querySelector('span');
  const paint=()=>{const p=o.phases[i];b.textContent=mmss(left);o.ring.classList.toggle('ans',p.kind==='answer');o.ring.classList.remove('end');
    o.ring.style.background='conic-gradient('+(p.kind==='answer'?'var(--acc)':'var(--blue)')+' '+(left/p.sec*360)+'deg,#e3e9f5 0)';};
  const tick=()=>{left=(end-Date.now())/1000;if(left<=0){next();return;}paint();};
  function enter(){const p=o.phases[i];left=p.sec;end=Date.now()+left*1000;sp.textContent=p.kind==='answer'?'ответ':'подготовка';o.label.textContent=p.label;paint();
    beep(p.kind==='answer'?880:660,220);if(p.kind==='answer')Rec.start();o.onPhase&&o.onPhase(i);clearInterval(t);t=setInterval(tick,200);}
  function next(){clearInterval(t);if(i>=0&&o.phases[i].kind==='answer'&&(i+1>=o.phases.length||o.phases[i+1].kind!=='answer'))Rec.stop(o.recBox,o.recName);
    i++;if(i>=o.phases.length){i=o.phases.length;b.textContent='0:00';sp.textContent='время вышло';o.label.textContent='Задание завершено';o.ring.classList.add('end');o.ring.style.background='';beep(520,500);o.onPhase&&o.onPhase(-1);o.onDone&&o.onDone();return;}
    paused=false;enter();}
  return {start(){clearInterval(t);Rec.cancel();if(o.recBox)o.recBox.innerHTML='';i=-1;next();},
    skip(){if(i>=0&&i<o.phases.length)next();},
    pause(){if(i<0||i>=o.phases.length)return false;if(!paused){paused=true;clearInterval(t);left=(end-Date.now())/1000;}else{paused=false;end=Date.now()+left*1000;t=setInterval(tick,200);}return paused;},
    stop(){clearInterval(t);Rec.cancel();},
    get active(){return i>=0&&i<o.phases.length;}};
}
function ringEl(sec){return el('div','ring','<b>'+mmss(sec)+'</b><span>готово</span>');}

/* Примерный ответ: панель справа, закрывается кнопкой или щелчком мимо */
function showSample(title,html,note){document.querySelectorAll('.overlay.smp').forEach(x=>x.remove());const ov=el('div','overlay smp'+(html.length>900?' wide':'')),t=el('div','teach'),bd=el('div','smpb',html);t.append(el('h4',null,title),bd);if(note)t.append(el('p','note',note));t.append(btn('Закрыть',()=>ov.remove(),'sm'));ov.append(t);ov.onclick=e=>{if(e.target===ov)ov.remove();};document.body.append(ov);}
const sampleParas=txt=>esc(txt).split('\n\n').map(p=>'<p>'+p.replace(/\n/g,'<br>')+'</p>').join('');
