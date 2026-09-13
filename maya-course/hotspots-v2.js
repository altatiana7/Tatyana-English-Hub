(()=>{
  const links=document.getElementById('links');
  if(!links) return;
  links.innerHTML='';
  const mk=(label,l,t,w,h,fn,code)=>{
    const b=document.createElement('button');
    b.className='hot';
    b.style.left=l+'%'; b.style.top=t+'%'; b.style.width=w+'%'; b.style.height=h+'%';
    b.setAttribute('aria-label',label); b.title=label;
    if(code) b.dataset.code=code;
    b.onclick=fn;
    links.appendChild(b);
  };
  // MODULES header
  mk('Modules',0.35,1.9,21.25,7.2,()=>window.allModules?.());
  // Module rows based on the actual artwork proportions.
  const rowTop=[10.15,18.75,27.35,35.95,44.55,53.15,61.75,70.35,78.95,87.55];
  for(let n=1;n<=10;n++){
    const t=rowTop[n-1];
    // number badge + module title, excluding lesson-code line
    mk(`Module ${n}`,0.55,t,4.25,6.15,()=>window.moduleView?.(n));
    mk(`Module ${n} title`,5.55,t,15.85,3.95,()=>window.moduleView?.(n));
    const xs=[5.82,8.55,11.28,14.02];
    for(let j=0;j<4;j++){
      const code=n+'ABCD'[j];
      mk(`Lesson ${code}`,xs[j],t+4.05,2.05,2.65,()=>window.lesson?.(code),code);
    }
  }
  // Main cards
  const main=[
    ['Learn',24.82,51.2,7.95,18.6,()=>window.category?.('Learn')],
    ['Practice',33.58,51.2,7.95,18.6,()=>window.category?.('Practice')],
    ['Listen',42.34,51.2,7.95,18.6,()=>window.category?.('Listen')],
    ['Progress',51.10,51.2,7.95,18.6,()=>window.category?.('Progress')]
  ];
  main.forEach(x=>mk(...x));
  // Restore completion styling.
  try{ window.update?.(); }catch(e){}
})();