/* Общий каркас урока: главный экран урока (плитки) + задание на всю ширину с кнопками «К уроку» и «Далее» */
(function(){
const main=document.getElementById('main');
window.Hub=function(cfg){
  const flat=[];let n=0;
  cfg.groups.forEach(g=>g.items.forEach(i=>{i.color=g.color;i.n=++n;flat.push(i);}));
  const seen={};let cur=null;
  const bar=document.querySelector('.bar');
  function head(){
    const old=bar.querySelector('.hubbar');if(old)old.remove();
    const w=document.createElement('div');w.className='hubbar';
    const a=document.createElement('a');a.className='hhome';a.href='index.html';a.textContent='← Главная';w.append(a);
    const t=document.createElement('span');t.className='htitle';t.textContent=cfg.title;w.append(t);
    const r=document.createElement('div');r.className='hr';
    (cfg.links||[]).forEach(l=>{const x=document.createElement('a');x.className='hlink';x.href=l[1];x.textContent=l[0];r.append(x);});
    if(cfg.right)cfg.right().forEach(x=>r.append(x));
    w.append(r);bar.prepend(w);}
  function render(){
    if(cfg.clean)cfg.clean();
    main.innerHTML='';window.scrollTo(0,0);head();
    cur===null?hub():stage();}
  function open(id){const it=flat.find(x=>x.id===id);if(it&&it.lock&&it.lock())return;cur=id;seen[id]=true;if(it&&it.onOpen)it.onOpen();render();}
  function hub(){
    const h=document.createElement('div');h.className='hub';
    const s=document.createElement('div');s.className='hubhead';s.innerHTML='<h1>'+cfg.title+'</h1><p>'+(cfg.sub||'')+'</p>';h.append(s);
    const gw=document.createElement('div');gw.className='hgroups'+(cfg.cols?' two':'');h.append(gw);
    cfg.groups.forEach(g=>{const sec=document.createElement('section');sec.innerHTML='<h2 style="--c:'+g.color+'">'+g.name+'</h2>';
      const row=document.createElement('div');row.className='tiles';
      g.items.forEach(i=>{const b=document.createElement('button');b.type='button';const lk=i.lock&&i.lock();b.className='tile'+(seen[i.id]?' seen':'')+(lk?' locked':'');if(lk)b.disabled=true;b.style.setProperty('--c',i.color);
        b.innerHTML='<span class="tn">'+(seen[i.id]?'&#10003;':i.n)+'</span><b>'+i.t+'</b><i>'+(lk?(i.lockNote?i.lockNote():'Не в домашнем задании'):(i.sub||''))+'</i>';b.onclick=()=>open(i.id);row.append(b);});
      sec.append(row);gw.append(sec);});
    main.append(h);}
  function stage(){
    const k=flat.findIndex(x=>x.id===cur),it=flat[k],nx=flat[k+1];
    const w=document.createElement('div');w.className='stg';
    const top=document.createElement('div');top.className='stgtop';
    const bk=document.createElement('button');bk.type='button';bk.className='sbtn';bk.textContent='← К уроку';bk.onclick=()=>{cur=null;render();};
    const ti=document.createElement('div');ti.className='stgt';ti.style.setProperty('--c',it.color);ti.innerHTML='<span>'+it.n+' / '+flat.length+'</span> '+it.t;
    const fw=document.createElement('button');fw.type='button';fw.className='sbtn go';
    if(nx){fw.textContent='Далее: '+nx.t+' →';fw.onclick=()=>open(nx.id);}else{fw.textContent='Завершить урок';fw.onclick=()=>{cur=null;render();};}
    top.append(bk,ti,fw);
    const pane=document.createElement('section');pane.className='wpane stgp';const body=document.createElement('div');body.className='pbody';if(it.cls)body.className+=' '+it.cls;pane.append(body);
    w.append(top,pane);main.append(w);
    it.run(body);}
  return {render,open,home:()=>{cur=null;render();}};
};
})();
