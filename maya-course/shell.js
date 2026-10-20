'use strict';
/* Maya course · inner screens in the same warm style as the cover */
(function(){
  const COVER=['People','Lifestyle','Food','Work','Free time','The world around us','Travel','Shopping','Health and well-being','Life'];
  names.splice(0,names.length,...COVER);

  const css=document.createElement('style');
  css.textContent=`
  #screen{background:#f6ece1;font-family:Lora,Georgia,"Times New Roman",serif;color:#1d2648}
  #screen::before{content:"";position:absolute;inset:-40px;background:url(cover-maya-clean.jpg) center/cover;filter:blur(28px) saturate(1.1);opacity:.55;z-index:0}
  #screen::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,rgba(252,244,235,.92),rgba(252,244,235,.72));z-index:0}
  #screen>*{position:relative;z-index:1}
  #screen header{min-height:46px;padding:6px 16px;background:rgba(255,250,244,.78);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid rgba(201,86,109,.18);color:#1d2648;gap:14px}
  #screen header h1{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:19px;letter-spacing:.01em}
  #screen header button{border:1px solid rgba(201,86,109,.45);background:rgba(255,255,255,.7);color:#b8455c;padding:6px 14px;border-radius:999px;font-family:Lora,Georgia,serif;font-weight:600;font-size:14px;transition:.2s}
  #screen header button:hover{background:#c9566d;color:#fff;border-color:#c9566d}
  #screen header .brandMini{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-weight:600;font-size:20px;color:#1d2648}
  #screen header .brandMini i{color:#c9566d;font-style:normal;font-size:.65em;vertical-align:top}
  #body{padding:0}
  #body.embedded{background:#fff}
  .mv{display:grid;grid-template-columns:250px 1fr;height:100%;min-height:0}
  .mvSide{padding:18px 14px;overflow:auto;display:flex;flex-direction:column;gap:7px;border-right:1px solid rgba(201,86,109,.14)}
  .mvMod{display:flex;align-items:center;gap:10px;width:100%;padding:7px 12px 7px 8px;border:1px solid rgba(255,255,255,.8);border-radius:13px;background:rgba(255,250,243,.6);color:#1d2648;font-family:Lora,Georgia,serif;font-weight:600;font-size:14.5px;text-align:left;line-height:1.15;transition:.2s}
  .mvMod .n{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;border:1.5px solid #c9566d;color:#b8455c;font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:14px;background:rgba(255,255,255,.6)}
  .mvMod:hover{background:rgba(255,252,247,.95);transform:translateX(3px)}
  .mvMod.on{background:#fffaf5;border-color:rgba(201,86,109,.5);box-shadow:0 4px 14px rgba(120,72,40,.14)}
  .mvMod.on .n{background:linear-gradient(135deg,#e07a7f,#c9566d);color:#fff;border-color:transparent}
  .mvMain{padding:26px 34px;overflow:auto;min-height:0}
  .mvKick{font-size:13px;letter-spacing:.3em;color:#b8455c;font-weight:600;text-transform:uppercase}
  .mvTitle{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:40px;margin:4px 0 4px;line-height:1.1}
  .mvLine{width:70px;height:2px;background:linear-gradient(90deg,#c9566d,transparent);margin:6px 0 22px}
  .mvGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;max-width:1120px}
  .lc{position:relative;border:1px solid rgba(255,255,255,.85);border-radius:18px;background:rgba(255,251,246,.78);box-shadow:0 6px 20px rgba(120,72,40,.10);padding:18px 18px 16px;display:flex;flex-direction:column;gap:10px;min-height:150px}
  .lcHead{display:flex;align-items:center;gap:12px}
  .lcCode{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:30px;color:#1d2648;line-height:1}
  .lcTag{margin-left:auto;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;padding:4px 10px;border-radius:999px;background:rgba(201,86,109,.12);color:#b8455c}
  .lcTag.today{background:linear-gradient(135deg,#e07a7f,#c9566d);color:#fff}
  .lcTag.done{background:#e7f2e8;color:#3f7a4a}
  .lcName{font-family:"Playfair Display",Georgia,serif;font-size:19px;font-weight:700;line-height:1.25}
  .lcOpen{display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;border:1px solid rgba(201,86,109,.3);border-radius:12px;background:#fff;color:#1d2648;font-family:Lora,Georgia,serif;font-weight:600;font-size:15px;text-align:left;transition:.2s}
  .lcOpen span{flex:1}.lcOpen b{color:#c9566d;font-size:18px}
  .lcOpen:hover{background:#c9566d;color:#fff;border-color:#c9566d}.lcOpen:hover b{color:#fff}
  .lc.soon{background:rgba(255,251,246,.45);box-shadow:none;border-style:dashed;border-color:rgba(29,38,72,.18)}
  .lc.soon .lcCode{color:rgba(29,38,72,.45)}
  .lc.soon .lcSoon{color:rgba(29,38,72,.5);font-style:italic;font-size:15px;margin-top:auto}
  .lc.soon .lcLocal{align-self:flex-start;border:0;background:none;padding:0;color:rgba(184,69,92,.75);font-family:Lora,Georgia,serif;font-size:13px;text-decoration:underline;text-underline-offset:3px}
  .mvEmpty{max-width:520px;margin:12vh auto;text-align:center;background:rgba(255,251,246,.8);border-radius:20px;padding:30px;box-shadow:0 6px 20px rgba(120,72,40,.1)}
  .mvEmpty h2{font-family:"Playfair Display",Georgia,serif;font-size:30px;margin:0 0 10px}
  .mvEmpty .local{display:inline-block;margin-top:10px;background:#fff;border:1px solid rgba(201,86,109,.3);border-radius:12px;padding:10px 14px}
  @media(max-width:820px){.mv{grid-template-columns:1fr}.mvSide{flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid rgba(201,86,109,.14);padding:10px}.mvMod{width:auto;flex:none}.mvMod .t{white-space:nowrap}.mvMain{padding:18px}.mvTitle{font-size:30px}}
  `;
  document.head.appendChild(css);

  // header: brand on the left of the title
  const hdr=document.querySelector('#screen header');
  const bm=document.createElement('span');bm.className='brandMini';bm.innerHTML='Maya<i>♥</i>';
  hdr.insertBefore(bm,document.getElementById('title'));

  let curModule=null, inLesson=false;
  const backBtn=document.getElementById('back');
  backBtn.onclick=()=>{
    if(inLesson&&curModule){moduleView(curModule);return}
    close();curModule=null;
  };
  const baseOpen=open;
  function setHeader(title,code,isLesson){
    baseOpen(title,code);
    inLesson=!!isLesson;
    backBtn.textContent=isLesson&&curModule?'← Module '+curModule:'← Course';
  }

  const extras={1:[{code:'1REV',tag:'today',tagText:'Today',name:'A trip to a hotel',sub:'Revision File 1 + Hotel Problems'},{code:'1PE',tag:'',tagText:'Practical English',name:'Hotel Problems',sub:'Calling Reception'}]};

  function openMaterial(m,code){frame(m,code);inLesson=true;backBtn.textContent=curModule?'← Module '+curModule:'← Course'}

  function lessonCard(code,label,tag,tagText){
    const mats=materials[code]||[];
    const c=document.createElement('div');c.className='lc'+(mats.length?'':' soon');
    const head=document.createElement('div');head.className='lcHead';
    const cd=document.createElement('div');cd.className='lcCode';cd.textContent=label||code;head.append(cd);
    const done=completed.includes(code);
    if(done||tagText){const t=document.createElement('span');t.className='lcTag'+(done?' done':tag?' '+tag:'');t.textContent=done?'✓ Done':tagText;head.append(t)}
    c.append(head);
    return {c,mats};
  }

  function render(n){
    const wrap=document.createElement('div');wrap.className='mv';
    const side=document.createElement('nav');side.className='mvSide';side.setAttribute('aria-label','Modules');
    names.forEach((t,i)=>{const b=document.createElement('button');b.className='mvMod'+(i+1===n?' on':'');b.innerHTML=`<span class="n">${i+1}</span><span class="t"></span>`;b.querySelector('.t').textContent=t;b.onclick=()=>moduleView(i+1);side.append(b)});
    const main=document.createElement('section');main.className='mvMain';
    main.innerHTML=`<div class="mvKick">Module ${n}</div><h2 class="mvTitle"></h2><div class="mvLine"></div><div class="mvGrid"></div>`;
    main.querySelector('.mvTitle').textContent=names[n-1];
    const g=main.querySelector('.mvGrid');
    (extras[n]||[]).forEach(x=>{
      const {c,mats}=lessonCard(x.code,x.name,x.tag,x.tagText);
      c.querySelector('.lcCode').style.fontSize='24px';
      const s=document.createElement('div');s.className='lcName';s.style.fontSize='16px';s.style.fontWeight='600';s.style.fontFamily='Lora,Georgia,serif';s.textContent=x.sub;c.append(s);
      mats.forEach(m=>{const b=document.createElement('button');b.className='lcOpen';b.innerHTML='<span>Open lesson</span><b>›</b>';b.onclick=()=>openMaterial(m,x.code);c.append(b)});
      g.append(c);
    });
    [...'ABCD'].forEach(L=>{
      const code=n+L;const {c,mats}=lessonCard(code,code,'','');
      if(mats.length){
        mats.forEach(m=>{const b=document.createElement('button');b.className='lcOpen';const s=document.createElement('span');s.textContent=m.title;b.append(s);b.insertAdjacentHTML('beforeend','<b>›</b>');b.onclick=()=>openMaterial(m,code);c.append(b)});
      }else{
        const s=document.createElement('div');s.className='lcSoon';s.textContent='Coming soon';c.append(s);
        const l=document.createElement('button');l.className='lcLocal';l.textContent='Open an HTML file';l.onclick=()=>emptyLesson(code);c.append(l);
      }
      g.append(c);
    });
    wrap.append(side,main);return wrap;
  }

  function emptyLesson(code){
    setHeader(`Lesson ${code} · ${names[parseInt(code)-1]}`,code,true);
    body.innerHTML='<div class="mvEmpty"><h2>Lesson '+code+'</h2><p>Материалы этого урока ещё не добавлены.</p><label class="local">Открыть HTML-урок с компьютера <input id="localFile" type="file" accept=".html,.htm"></label><p><small>Файл откроется только на этом устройстве.</small></p></div>';
    document.getElementById('localFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const u=URL.createObjectURL(file);body.replaceChildren();body.className='embedded';const f=document.createElement('iframe');f.title='Local lesson';f.sandbox='allow-scripts allow-forms allow-modals';f.src=u;f.onload=()=>URL.revokeObjectURL(u);body.append(f)};
  }

  window.moduleView=function(n){
    curModule=n;setHeader(`Module ${n} · ${names[n-1]}`,null,false);
    body.className='';body.replaceChildren(render(n));
  };
  window.lesson=function(code){
    const n=parseInt(code);if(n)curModule=n;
    const mats=materials[code];
    if(mats&&mats.length===1){openMaterial(mats[0],code);return}
    moduleView(curModule||1);
  };
  window.allModules=function(){moduleView(curModule||1)};
})();
