const DATA = window.DATA_PARTS || [];
const state = {
  cat:"ALL", mode:"cards", current:null, revealed:false,
  attempts:0, correct:0, streak:0, cardIndex:0, cardOrder:[],
  match:null, mix:null
};

const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const cats = ["ALL", ...new Set(DATA.map(x=>x.cat))];
const panel = $("#panel");

function esc(s){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }
function shuffle(a){ const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }
function sample(a,n=1){ return shuffle(a).slice(0,n); }
function filtered(){ return state.cat==="ALL" ? DATA : DATA.filter(x=>x.cat===state.cat); }
function normalize(s){ return String(s).toLowerCase().trim().replace(/[’']/g,"'").replace(/\s+/g," ").replace(/[.!?,;:]+$/g,""); }
function same(a,b){
  a=normalize(a); b=normalize(b);
  if(a===b) return true;
  const alts=b.split(/\s*\/\s*/).map(normalize);
  return alts.includes(a);
}
function pick(){
  const pool=filtered();
  state.current=pool[Math.floor(Math.random()*pool.length)];
  return state.current;
}
function record(ok){
  state.attempts++;
  if(ok){state.correct++;state.streak++;} else {state.streak=0;}
  updateStats();
}
function updateStats(){
  $("#correctStat").textContent=state.correct;
  $("#attemptStat").textContent=state.attempts;
  $("#streakStat").textContent=state.streak;
}
function speak(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-GB"; u.rate=.88;
  const voices=speechSynthesis.getVoices();
  const gb=voices.find(v=>/en-GB/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang));
  if(gb) u.voice=gb;
  speechSynthesis.speak(u);
}
function catCounts(cat){ return cat==="ALL" ? DATA.length : DATA.filter(x=>x.cat===cat).length; }

function buildCats(){
  const list=$("#catList"), sel=$("#catSelect");
  list.innerHTML=cats.map(c=>`<button class="cat-btn ${c==="ALL"?"active":""}" data-cat="${esc(c)}"><span>${c==="ALL"?"ALL SETS":esc(c)}</span><small>${catCounts(c)}</small></button>`).join("");
  sel.innerHTML=cats.map(c=>`<option value="${esc(c)}">${c==="ALL"?"ALL SETS":esc(c)} · ${catCounts(c)}</option>`).join("");
  list.addEventListener("click",e=>{
    const b=e.target.closest("[data-cat]"); if(!b)return;
    setCat(b.dataset.cat);
  });
  sel.addEventListener("change",()=>setCat(sel.value));
}
function setCat(cat){
  state.cat=cat; state.cardIndex=0; state.cardOrder=[]; state.match=null; state.mix=null;
  $$(".cat-btn").forEach(b=>b.classList.toggle("active",b.dataset.cat===cat));
  $("#catSelect").value=cat;
  $("#title").textContent=cat==="ALL" ? "Collocations Trainer" : `${cat} Collocations`;
  render();
}
function setMode(mode){
  state.mode=mode; state.cardIndex=0; state.cardOrder=[]; state.match=null; state.mix=null;
  $$(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
  render();
}
$("#modebar").addEventListener("click",e=>{
  const b=e.target.closest("[data-mode]"); if(b)setMode(b.dataset.mode);
});

function head(label,extra=""){
 return `<div class="task-head"><span class="badge">${label}</span><span class="progress">${extra}</span></div>`;
}
function cardOrder(){
  if(!state.cardOrder.length) state.cardOrder=shuffle(filtered());
  return state.cardOrder;
}
function renderCards(){
  const order=cardOrder();
  if(state.cardIndex>=order.length){state.cardIndex=0;state.cardOrder=shuffle(filtered());}
  const it=state.cardOrder[state.cardIndex];
  state.current=it; state.revealed=false;
  panel.innerHTML=head("FLASHCARD",`${state.cardIndex+1} / ${state.cardOrder.length}`)+`
    <div class="flash-stack">
      <div id="flashcard" class="flashcard">
        <div class="cat-chip">${esc(it.cat)}</div>
        <div class="bigword">${esc(it.en)}</div>
        <div id="cardBack" class="hidden">
          <div class="translation">${esc(it.ru)}</div>
          <div class="example">${esc(it.ex)}</div>
        </div>
        <div class="actions">
          <button id="speakBtn" class="btn ghost" type="button">🔊 Listen</button>
          <button id="flipBtn" class="btn primary" type="button">Show meaning</button>
        </div>
      </div>
    </div>
    <div class="actions">
      <button id="againBtn" class="btn bad hidden" type="button">↺ Repeat</button>
      <button id="knowBtn" class="btn good hidden" type="button">✓ I know it</button>
      <button id="nextCard" class="btn secondary" type="button">Next →</button>
    </div>`;
  $("#speakBtn").addEventListener("click",()=>speak(it.en));
  $("#flipBtn").addEventListener("click",()=>{
    state.revealed=!state.revealed;
    $("#cardBack").classList.toggle("hidden",!state.revealed);
    $("#againBtn").classList.toggle("hidden",!state.revealed);
    $("#knowBtn").classList.toggle("hidden",!state.revealed);
    $("#flipBtn").textContent=state.revealed?"Hide meaning":"Show meaning";
  });
  $("#nextCard").addEventListener("click",()=>{state.cardIndex++;renderCards();});
  $("#againBtn").addEventListener("click",()=>{
    const cur=state.cardOrder.splice(state.cardIndex,1)[0];
    state.cardOrder.splice(Math.min(state.cardIndex+3,state.cardOrder.length),0,cur);
    renderCards();
  });
  $("#knowBtn").addEventListener("click",()=>{state.cardIndex++;renderCards();});
}
function clozeFor(it){
  const ex=it.ex, p=it.en;
  const idx=ex.toLowerCase().indexOf(p.toLowerCase());
  if(idx>=0) return ex.slice(0,idx)+"__________"+ex.slice(idx+p.length);
  return null;
}
function distractors(it,n=3){
  const sameCat=DATA.filter(x=>x.cat===it.cat && x.en!==it.en);
  const broader=DATA.filter(x=>x.en!==it.en);
  return sample(sameCat.length>=n?sameCat:broader,n);
}
function renderChoice(){
  const it=pick(), cloze=clozeFor(it);
  const opts=shuffle([it,...distractors(it,3)]);
  panel.innerHTML=head("CONTEXT CHOICE",state.cat==="ALL"?"Mixed sets":state.cat)+`
    <div class="prompt">${cloze?"Choose the collocation that completes the sentence.":"Choose the English collocation for the meaning."}</div>
    ${cloze?`<div class="cloze">${esc(cloze)}</div>`:`<div class="cloze"><b>${esc(it.ru)}</b></div>`}
    <div class="options">${opts.map(o=>`<button class="option" data-en="${esc(o.en)}" type="button">${esc(o.en)}</button>`).join("")}</div>
    <div id="feedback" class="feedback"></div>
    <div class="actions"><button id="nextChoice" class="btn primary hidden" type="button">Next →</button></div>`;
  $$(".option",panel).forEach(b=>b.addEventListener("click",()=>{
    if(b.disabled)return;
    const ok=b.dataset.en===it.en; record(ok);
    $$(".option",panel).forEach(x=>{x.disabled=true;if(x.dataset.en===it.en)x.classList.add("correct");});
    if(!ok)b.classList.add("wrong");
    const f=$("#feedback");
    f.className="feedback "+(ok?"ok":"no");
    f.textContent=ok?"Correct!":`Correct answer: ${it.en} — ${it.ru}`;
    $("#nextChoice").classList.remove("hidden");
  }));
  $("#nextChoice").addEventListener("click",renderChoice);
}
function renderType(){
  const it=pick();
  panel.innerHTML=head("TYPE IT",state.cat==="ALL"?it.cat:state.cat)+`
    <div class="prompt">Translate the collocation into English.</div>
    <div class="cloze"><b>${esc(it.ru)}</b></div>
    <form id="typeForm" class="answerbox">
      <input id="typeInput" autocomplete="off" spellcheck="false" placeholder="Type the collocation…" aria-label="Your answer">
      <button class="btn primary" type="submit">Check</button>
    </form>
    <div class="hint">First word: <b>${esc(it.en.split(" ")[0])}</b> · ${it.en.split(" ").length} word(s)</div>
    <div id="feedback" class="feedback"></div>
    <div class="actions"><button id="typeReveal" class="btn ghost" type="button">Show answer</button><button id="typeNext" class="btn secondary hidden" type="button">Next →</button></div>`;
  const form=$("#typeForm"), input=$("#typeInput"), f=$("#feedback");
  input.focus();
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const ok=same(input.value,it.en); record(ok);
    f.className="feedback "+(ok?"ok":"no");
    f.textContent=ok?`Correct — ${it.en}`:`Not quite. Correct: ${it.en}`;
    input.disabled=true; form.querySelector("button").disabled=true;
    $("#typeNext").classList.remove("hidden");
  });
  $("#typeReveal").addEventListener("click",()=>{
    f.className="feedback";
    f.textContent=`${it.en} — ${it.ru}`;
  });
  $("#typeNext").addEventListener("click",renderType);
}
function newMatch(){
  const set=sample(filtered(),6).map(x=>({...x}));
  state.match={set,left:shuffle(set),right:shuffle(set),a:null,b:null,done:0};
}
function renderMatch(){
  if(!state.match || state.match.done===6) newMatch();
  const m=state.match;
  panel.innerHTML=head("MATCH UP",`${m.done} / 6 matched`)+`
    <div class="prompt">Match the English collocation with its Russian meaning.</div>
    <div class="match-grid">
      <div class="match-col">${m.left.map((x,i)=>`<button class="match-item ${x._done?"matched":""}" data-side="a" data-i="${i}" type="button" ${x._done?"disabled":""}>${esc(x.en)}</button>`).join("")}</div>
      <div class="match-col">${m.right.map((x,i)=>`<button class="match-item ${x._doneR?"matched":""}" data-side="b" data-i="${i}" type="button" ${x._doneR?"disabled":""}>${esc(x.ru)}</button>`).join("")}</div>
    </div>
    <div id="feedback" class="feedback"></div>
    <div class="actions"><button id="newMatch" class="btn ghost" type="button">New 6</button></div>`;
  function refreshSel(){
    $$(".match-item",panel).forEach(b=>b.classList.toggle("selected",(b.dataset.side==="a"&&+b.dataset.i===m.a)||(b.dataset.side==="b"&&+b.dataset.i===m.b)));
  }
  $$(".match-item",panel).forEach(b=>b.addEventListener("click",()=>{
    if(b.disabled)return;
    if(b.dataset.side==="a")m.a=+b.dataset.i; else m.b=+b.dataset.i;
    refreshSel();
    if(m.a!==null&&m.b!==null){
      const A=m.left[m.a],B=m.right[m.b], ok=A.en===B.en;
      record(ok);
      if(ok){
        A._done=true;B._doneR=true;m.done++;
        $("#feedback").className="feedback ok";$("#feedback").textContent="Match!";
        if(m.done===6){setTimeout(()=>{state.match=null;renderMatch();},550);}
        else setTimeout(renderMatch,330);
      }else{
        const selected=$$(".match-item.selected",panel);selected.forEach(x=>x.classList.add("badflash"));
        $("#feedback").className="feedback no";$("#feedback").textContent="Try another pair.";
        m.a=null;m.b=null;setTimeout(refreshSel,260);
      }
    }
  }));
  $("#newMatch").addEventListener("click",()=>{state.match=null;renderMatch();});
}
function renderBuild(){
  const it=pick();
  const tokens=it.en.split(/\s+/);
  const pool=filtered().filter(x=>x.en!==it.en);
  const decoys=sample(pool.flatMap(x=>x.en.split(/\s+/)).filter(w=>!tokens.includes(w)),Math.min(3,Math.max(1,tokens.length)));
  const tiles=shuffle(tokens.concat(decoys)).map((w,i)=>({w,id:i,used:false}));
  let answer=[];
  const cloze=clozeFor(it);
  panel.innerHTML=head("BUILD THE PHRASE",state.cat==="ALL"?it.cat:state.cat)+`
    <div class="prompt">Build the collocation from the word tiles.</div>
    <div class="build-cue">
      <div class="build-ru">${esc(it.ru)}</div>
      ${cloze?`<div class="build-context">${esc(cloze)}</div>`:""}
    </div>
    <div id="buildAnswer" class="build-answer"><span class="build-placeholder">Tap the words below…</span></div>
    <div id="tileBank" class="tile-bank">
      ${tiles.map(t=>`<button class="word-tile" data-id="${t.id}" type="button">${esc(t.w)}</button>`).join("")}
    </div>
    <div id="feedback" class="feedback"></div>
    <div class="actions">
      <button id="buildReset" class="btn ghost" type="button">Reset</button>
      <button id="buildCheck" class="btn primary" type="button">Check</button>
      <button id="buildNext" class="btn secondary hidden" type="button">Next →</button>
    </div>`;
  function draw(){
    const zone=$("#buildAnswer");
    if(!answer.length){
      zone.innerHTML='<span class="build-placeholder">Tap the words below…</span>';
    }else{
      zone.innerHTML=answer.map((t,i)=>`<button class="answer-tile" data-ai="${i}" type="button">${esc(t.w)}</button>`).join("");
    }
    $$(".word-tile",panel).forEach(b=>{
      const t=tiles.find(x=>x.id===+b.dataset.id);
      b.disabled=!!t.used;
      b.classList.toggle("used",!!t.used);
    });
    $$(".answer-tile",panel).forEach(b=>b.addEventListener("click",()=>{
      const idx=+b.dataset.ai;
      const t=answer.splice(idx,1)[0];
      t.used=false;
      draw();
    }));
  }
  $$(".word-tile",panel).forEach(b=>b.addEventListener("click",()=>{
    const t=tiles.find(x=>x.id===+b.dataset.id);
    if(t.used)return;
    t.used=true; answer.push(t); draw();
  }));
  $("#buildReset").addEventListener("click",()=>{
    tiles.forEach(t=>t.used=false); answer=[]; $("#feedback").textContent=""; draw();
  });
  $("#buildCheck").addEventListener("click",()=>{
    const formed=answer.map(t=>t.w).join(" ");
    const ok=same(formed,it.en); record(ok);
    const f=$("#feedback"); f.className="feedback "+(ok?"ok":"no");
    f.textContent=ok?`Perfect — ${it.en}`:`Try again. Target: ${it.en}`;
    if(ok){
      $$(".word-tile",panel).forEach(b=>b.disabled=true);
      $$(".answer-tile",panel).forEach(b=>b.disabled=true);
      $("#buildCheck").disabled=true; $("#buildReset").disabled=true;
      $("#buildNext").classList.remove("hidden");
    }
  });
  $("#buildNext").addEventListener("click",renderBuild);
}
function renderListen(){
  const it=pick();
  panel.innerHTML=head("LISTEN & TYPE",state.cat==="ALL"?it.cat:state.cat)+`
    <div class="listen-card">
      <button id="speaker" class="speaker" type="button" aria-label="Play collocation">🔊</button>
      <div class="prompt">Listen and type what you hear.</div>
      <form id="listenForm" class="answerbox">
        <input id="listenInput" autocomplete="off" spellcheck="false" placeholder="Type what you hear…" aria-label="Your answer">
        <button class="btn primary" type="submit">Check</button>
      </form>
      <div id="feedback" class="feedback"></div>
      <div class="actions"><button id="listenAgain" class="btn ghost" type="button">Play again</button><button id="listenNext" class="btn secondary hidden" type="button">Next →</button></div>
    </div>`;
  const play=()=>speak(it.en);
  $("#speaker").addEventListener("click",play);$("#listenAgain").addEventListener("click",play);
  setTimeout(play,200);
  $("#listenForm").addEventListener("submit",e=>{
    e.preventDefault();
    const input=$("#listenInput"), ok=same(input.value,it.en);record(ok);
    const f=$("#feedback");f.className="feedback "+(ok?"ok":"no");f.textContent=ok?`Correct — ${it.en}`:`Correct: ${it.en} — ${it.ru}`;
    input.disabled=true;e.target.querySelector("button").disabled=true;$("#listenNext").classList.remove("hidden");
  });
  $("#listenNext").addEventListener("click",renderListen);
}
function newMix(){
  state.mix={q:shuffle(filtered()).slice(0,Math.min(15,filtered().length)),i:0,score:0,answered:false};
}
function renderMix(){
  if(!state.mix)newMix();
  const m=state.mix;
  if(m.i>=m.q.length){
    const pct=Math.round(m.score/m.q.length*100);
    panel.innerHTML=head("MIXED CHALLENGE","Complete")+
      `<div class="result"><div class="score">${pct}%</div><h2>${m.score} / ${m.q.length}</h2>
      <p>${pct>=85?"Excellent retrieval. These collocations are becoming automatic.":pct>=65?"Good work. Run the challenge again to strengthen the weaker items.":"One more round will help. Try a single set first, then return to mixed practice."}</p>
      <button id="mixAgain" class="btn primary" type="button">Start another challenge</button></div>`;
    $("#mixAgain").addEventListener("click",()=>{state.mix=null;renderMix();});
    return;
  }
  const it=m.q[m.i], type=m.i%3;
  const progress=Math.round((m.i/m.q.length)*100);
  if(type===0){
    const opts=shuffle([it,...distractors(it,3)]);
    panel.innerHTML=head("MIXED CHALLENGE",`${m.i+1} / ${m.q.length}`)+`<div class="mix-meter"><span style="width:${progress}%"></span></div>
      <div class="prompt">Choose the English collocation.</div><div class="cloze"><b>${esc(it.ru)}</b></div>
      <div class="options">${opts.map(o=>`<button class="option" data-en="${esc(o.en)}" type="button">${esc(o.en)}</button>`).join("")}</div>
      <div id="feedback" class="feedback"></div><div class="actions"><button id="mixNext" class="btn primary hidden" type="button">Next →</button></div>`;
    $$(".option",panel).forEach(b=>b.addEventListener("click",()=>{
      if(m.answered)return;m.answered=true;const ok=b.dataset.en===it.en;record(ok);if(ok)m.score++;
      $$(".option",panel).forEach(x=>{x.disabled=true;if(x.dataset.en===it.en)x.classList.add("correct");});if(!ok)b.classList.add("wrong");
      $("#feedback").className="feedback "+(ok?"ok":"no");$("#feedback").textContent=ok?"Correct!":`Correct: ${it.en}`;
      $("#mixNext").classList.remove("hidden");
    }));
  }else if(type===1){
    const cloze=clozeFor(it);
    const opts=shuffle([it,...distractors(it,3)]);
    panel.innerHTML=head("MIXED CHALLENGE",`${m.i+1} / ${m.q.length}`)+`<div class="mix-meter"><span style="width:${progress}%"></span></div>
      <div class="prompt">${cloze?"Complete the context.":"Choose the best match."}</div>
      <div class="cloze">${esc(cloze||it.ru)}</div>
      <div class="options">${opts.map(o=>`<button class="option" data-en="${esc(o.en)}" type="button">${esc(o.en)}</button>`).join("")}</div>
      <div id="feedback" class="feedback"></div><div class="actions"><button id="mixNext" class="btn primary hidden" type="button">Next →</button></div>`;
    $$(".option",panel).forEach(b=>b.addEventListener("click",()=>{
      if(m.answered)return;m.answered=true;const ok=b.dataset.en===it.en;record(ok);if(ok)m.score++;
      $$(".option",panel).forEach(x=>{x.disabled=true;if(x.dataset.en===it.en)x.classList.add("correct");});if(!ok)b.classList.add("wrong");
      $("#feedback").className="feedback "+(ok?"ok":"no");$("#feedback").textContent=ok?"Correct!":`Correct: ${it.en}`;
      $("#mixNext").classList.remove("hidden");
    }));
  }else{
    panel.innerHTML=head("MIXED CHALLENGE",`${m.i+1} / ${m.q.length}`)+`<div class="mix-meter"><span style="width:${progress}%"></span></div>
      <div class="prompt">Type the English collocation.</div><div class="cloze"><b>${esc(it.ru)}</b></div>
      <form id="mixForm" class="answerbox"><input id="mixInput" autocomplete="off" spellcheck="false" placeholder="Type the collocation…"><button class="btn primary" type="submit">Check</button></form>
      <div id="feedback" class="feedback"></div><div class="actions"><button id="mixNext" class="btn primary hidden" type="button">Next →</button></div>`;
    $("#mixInput").focus();
    $("#mixForm").addEventListener("submit",e=>{
      e.preventDefault();if(m.answered)return;m.answered=true;const ok=same($("#mixInput").value,it.en);record(ok);if(ok)m.score++;
      $("#feedback").className="feedback "+(ok?"ok":"no");$("#feedback").textContent=ok?`Correct — ${it.en}`:`Correct: ${it.en}`;
      $("#mixInput").disabled=true;e.target.querySelector("button").disabled=true;$("#mixNext").classList.remove("hidden");
    });
  }
  const next=$("#mixNext");if(next)next.addEventListener("click",()=>{m.i++;m.answered=false;renderMix();});
}
function render(){
  if("speechSynthesis" in window) speechSynthesis.cancel();
  if(state.mode==="cards")renderCards();
  if(state.mode==="choice")renderChoice();
  if(state.mode==="type")renderType();
  if(state.mode==="match")renderMatch();
  if(state.mode==="build")renderBuild();
  if(state.mode==="listen")renderListen();
  if(state.mode==="mix")renderMix();
}
buildCats();updateStats();render();