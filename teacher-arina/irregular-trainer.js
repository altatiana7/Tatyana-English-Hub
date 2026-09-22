(() => {
const verbs=[
["be","was / were","been","быть"],["become","became","become","становиться"],["begin","began","begun","начинать"],["break","broke","broken","ломать"],["bring","brought","brought","приносить"],
["buy","bought","bought","покупать"],["come","came","come","приходить"],["do","did","done","делать"],["drink","drank","drunk","пить"],["eat","ate","eaten","есть"],
["find","found","found","находить"],["get","got","got / gotten","получать"],["give","gave","given","давать"],["go","went","gone","идти / ехать"],["have","had","had","иметь"],
["know","knew","known","знать"],["make","made","made","делать / создавать"],["read","read","read","читать"],["run","ran","run","бежать"],["say","said","said","говорить / сказать"],
["see","saw","seen","видеть"],["speak","spoke","spoken","говорить"],["take","took","taken","брать"],["think","thought","thought","думать"],["write","wrote","written","писать"]
].map(x=>({v1:x[0],v2:x[1],v3:x[2],ru:x[3]}));
let queue=[],idx=0,correct=0,firstTryCorrect=0,mistakes=[],checked=false,seen=new Set();

const css=document.createElement("style");
css.textContent=`
.trainerWrap{max-width:760px;margin:0 auto}.trainerHead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px}.trainerHead h1{margin:4px 0 6px}.trainerStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}.trainerStat{border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff}.trainerStat span{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#718c98;font-weight:900}.trainerStat b{font-size:20px;color:var(--teal2)}.verbCard{border:1px solid var(--line);border-radius:18px;background:#fff;padding:24px;text-align:center}.verbMain{font-size:38px;font-weight:900;margin:4px 0}.verbRu{font-size:14px;color:#718c98;margin-bottom:18px}.trainerInputs{display:grid;grid-template-columns:1fr 1fr;gap:9px;text-align:left}.trainerInputs label{font-size:11px;font-weight:900;color:#718c98;text-transform:uppercase;letter-spacing:.05em}.trainerInputs input{width:100%;margin-top:5px;border:1px solid var(--line);border-radius:10px;padding:11px 12px;font-size:17px;outline:none}.trainerInputs input:focus{border-color:var(--teal)}.trainerActions{display:flex;justify-content:center;gap:7px;flex-wrap:wrap;margin-top:14px}.trainerPrimary{border:0;border-radius:10px;background:var(--teal);color:#fff;font-weight:900;padding:10px 15px;cursor:pointer}.trainerFeedback{min-height:46px;margin-top:14px;border-radius:11px;padding:10px 12px;background:var(--paper);font-size:14px;line-height:1.35}.trainerFeedback.ok{background:#edf8f1;color:#21673a}.trainerFeedback.bad{background:#fff3ee;color:#9a4c31}.trainerDone{display:none;border:1px solid #b9dfe2;background:#effafb;border-radius:14px;padding:16px;margin-top:12px}.trainerDone.show{display:block}@media(max-width:620px){.trainerInputs{grid-template-columns:1fr}.trainerHead{display:block}}
`;
document.head.appendChild(css);

const section=document.createElement("section");
section.id="verbTrainer";
section.className="view";
section.innerHTML=`
<div class="trainerWrap">
  <div class="trainerHead">
    <div><div class="tag">Week 1 • Training</div><h1>Irregular Verbs Trainer</h1><p class="note">Write V2 and V3. Verbs with mistakes return again at the end.</p></div>
    <button class="subbtn" type="button" id="verbBack">← Week 1</button>
  </div>
  <div class="trainerStats">
    <div class="trainerStat"><span>Progress</span><b id="verbProgress">1 / 20</b></div>
    <div class="trainerStat"><span>Correct</span><b id="verbCorrect">0</b></div>
    <div class="trainerStat"><span>To repeat</span><b id="verbMistakes">0</b></div>
  </div>
  <div class="verbCard" id="verbCard">
    <div class="tag">V1 • infinitive</div><div class="verbMain" id="verbV1">go</div><div class="verbRu" id="verbRu">идти / ехать</div>
    <div class="trainerInputs">
      <label>V2 • Past Simple<input id="verbV2" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type V2"></label>
      <label>V3 • Past Participle<input id="verbV3" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type V3"></label>
    </div>
    <div class="trainerActions">
      <button class="subbtn" type="button" id="verbListen">Listen</button>
      <button class="subbtn" type="button" id="verbHint">Hint</button>
      <button class="trainerPrimary" type="button" id="verbCheck">Check</button>
      <button class="subbtn" type="button" id="verbNext" style="display:none">Next →</button>
    </div>
    <div class="trainerFeedback" id="verbFeedback">Type both forms and press Check.</div>
  </div>
  <div class="trainerDone" id="verbDone"><div class="tag">Training complete</div><h2>Done</h2><p id="verbDoneText"></p><button class="trainerPrimary" type="button" id="verbAgain">Train again</button></div>
</div>`;
document.querySelector("main.main").appendChild(section);

const $=id=>document.getElementById(id);
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const norm=s=>String(s||"").trim().toLowerCase().replace(/\s+/g," ");
function match(input,answer){
 const x=norm(input);
 if(answer==="was / were")return["was","were","was / were","were / was"].includes(x);
 if(answer==="got / gotten")return["got","gotten","got / gotten","gotten / got"].includes(x);
 return answer.split("/").map(norm).includes(x);
}
function render(){
 const v=queue[idx]; if(!v)return finish();
 $("verbV1").textContent=v.v1;$("verbRu").textContent=v.ru;$("verbV2").value="";$("verbV3").value="";
 $("verbProgress").textContent=(idx+1)+" / "+queue.length;$("verbCorrect").textContent=correct;$("verbMistakes").textContent=mistakes.length;
 $("verbFeedback").className="trainerFeedback";$("verbFeedback").textContent="Type both forms and press Check.";
 $("verbCheck").style.display="inline-block";$("verbNext").style.display="none";checked=false;setTimeout(()=>$("verbV2").focus(),0);
}
function start(){
 queue=shuffle(verbs).slice(0,20);idx=0;correct=0;firstTryCorrect=0;mistakes=[];checked=false;seen=new Set();$("verbCard").style.display="block";$("verbDone").classList.remove("show");render();
}
function check(){
 if(checked)return;const v=queue[idx],a=$("verbV2").value,b=$("verbV3").value,fb=$("verbFeedback");
 if(!a.trim()||!b.trim()){fb.className="trainerFeedback bad";fb.textContent="Enter both V2 and V3.";return}
 const ok=match(a,v.v2)&&match(b,v.v3);checked=true;
 if(ok){correct++;if(!seen.has(v.v1))firstTryCorrect++;fb.className="trainerFeedback ok";fb.textContent="Correct: "+v.v1+" — "+v.v2+" — "+v.v3}
 else{if(!mistakes.some(x=>x.v1===v.v1))mistakes.push(v);fb.className="trainerFeedback bad";fb.textContent="Correct forms: "+v.v1+" — "+v.v2+" — "+v.v3}seen.add(v.v1);
 $("verbCorrect").textContent=correct;$("verbMistakes").textContent=mistakes.length;$("verbCheck").style.display="none";$("verbNext").style.display="inline-block";
}
function next(){
 if(!checked)return;idx++;
 if(idx>=queue.length&&mistakes.length){const repeat=shuffle(mistakes);mistakes=[];queue=queue.concat(repeat)}
 render();
}
function finish(){$("verbCard").style.display="none";$("verbDone").classList.add("show");const pct=Math.round(firstTryCorrect/20*100);$("verbDoneText").textContent="First attempt: "+firstTryCorrect+" / 20 ("+pct+"%). All mistakes were repeated until correct."}
function hint(){const v=queue[idx];if(!v)return;$("verbFeedback").className="trainerFeedback";$("verbFeedback").textContent="Hint: V2 starts with “"+v.v2[0].toUpperCase()+"”, V3 starts with “"+v.v3[0].toUpperCase()+"”."}
function listen(){const v=queue[idx];if(!v||!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(v.v1);u.lang="en-GB";u.rate=.82;speechSynthesis.speak(u)}
window.openVerbTrainer=()=>{start();show("verbTrainer")};
$("verbBack").addEventListener("click",()=>show("weeks"));$("verbListen").addEventListener("click",listen);$("verbHint").addEventListener("click",hint);$("verbCheck").addEventListener("click",check);$("verbNext").addEventListener("click",next);$("verbAgain").addEventListener("click",start);
$("verbV2").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();$("verbV3").focus()}});
$("verbV3").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();checked?next():check()}});
})();