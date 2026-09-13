(() => {
  const links = document.getElementById('links');
  if (!links) return;
  links.innerHTML = '';
  const make = (label,x,y,w,h,action,code) => {
    const b=document.createElement('button');
    b.className='hot';
    b.style.cssText=`left:${x/1672*100}%;top:${y/941*100}%;width:${w/1672*100}%;height:${h/941*100}%`;
    b.setAttribute('aria-label',label);
    b.title=label;
    if(code)b.dataset.code=code;
    b.onclick=action;
    links.appendChild(b);
  };

  // Main MODULES button
  make('Modules',4,18,358,68,()=>allModules());

  // Module rows + exact A/B/C/D labels on the left panel
  for(let n=1;n<=10;n++){
    const y=91+(n-1)*81;
    make(`Module ${n}: ${names[n-1]}`,4,y,358,39,()=>moduleView(n));
    const xs=n===10?[94,145,197,249]:[96,144,192,234];
    const ws=n===10?[45,45,45,45]:[38,38,38,38];
    for(let j=0;j<4;j++){
      const code=n+'ABCD'[j];
      make(`Lesson ${code}`,xs[j],y+39,ws[j],29,()=>lesson(code),code);
    }
  }

  // Four large buttons visible on the cover
  [
    ['Learn',416,482,132,194],
    ['Practice',559,482,134,194],
    ['Listen',704,482,134,194],
    ['Progress',849,482,138,194]
  ].forEach(([name,x,y,w,h])=>make(name,x,y,w,h,()=>category(name)));

  if (typeof update === 'function') update();
})();
