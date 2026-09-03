/* Maya 1C REMAKES — custom opening sequence: Style & Hair review + Present Continuous vs Present Simple */
(function(){
  const css=document.createElement('style');
  css.textContent=`
    .remakePics{display:grid;grid-template-columns:1.05fr 1fr;gap:12px;align-items:stretch}
    .remakePic{position:relative;border-radius:18px;overflow:hidden;border:1px solid #ddd;background:#f6f2fa;min-height:300px}
    .remakePic img{width:100%;height:300px;display:block;object-fit:cover;object-position:center}
    .remakeLabel{position:absolute;left:10px;top:10px;background:rgba(34,28,67,.82);color:#fff;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:950;letter-spacing:.06em}
    .clothesBank{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
    .clothesBank .tag{font-size:11px;padding:5px 8px}
    .photoTask{font-size:16px;font-weight:900;margin:8px 0 4px}
    .grammarFormula{font-size:26px;font-weight:950;color:#5e39aa;margin:5px 0}
    .timeSignal{display:inline-block;border-radius:999px;padding:5px 9px;background:#fff;border:1px solid #ddd;font-weight:850;margin:3px;font-size:12px}
    .contrastPair{display:grid;grid-template-columns:1fr 46px 1fr;gap:8px;align-items:center;margin:8px 0}
    .contrastPair .arrow{text-align:center;font-size:22px;font-weight:950;color:#6f59d0}
    .habit{background:#edf8fb}.now{background:#f4eeff}
    .verbHi{font-weight:950;color:#5e39aa}
    .tinyRule{font-size:12px;color:#6a6575;line-height:1.35}
    @media(max-width:900px){.remakePics{grid-template-columns:1fr 1fr}.remakePic,.remakePic img{min-height:240px;height:240px}.contrastPair{grid-template-columns:1fr 34px 1fr}}
  `;
  document.head.appendChild(css);

  menu[0][2]='Clothes → Remakes → Grammar';

  const imgA='https://commons.wikimedia.org/wiki/Special:Redirect/file/American%20Gothic%20Dress-Up.jpg';
  const imgB='https://commons.wikimedia.org/wiki/Special:Redirect/file/Girl_with_a_Pearl_Earring_(Full_Renovation).jpg';

  sectionData.warm={
    k:'Warm-up · bring back Style & Hair',
    t:'Fashion first. Grammar second.',
    l:'Use the clothes Maya already knows to describe two remakes — then notice the tense you are using.',
    steps:[
      ()=>`<div class="remakePics">
        <div class="card"><div class="remakePic"><span class="remakeLabel">REMAKE A</span><img src="${imgA}" alt="American Gothic recreation" onerror="this.parentElement.innerHTML='<div class=visualText>REMAKE A · TWO PEOPLE POSING</div>'"></div><p class="photoTask">What are they wearing? What are they doing?</p><p class="mini">Try 3 clothes words + 2 action sentences. Do not worry about the grammar rule yet.</p></div>
        <div class="card"><div class="remakePic"><span class="remakeLabel">REMAKE B</span><img src="${imgB}" alt="Girl with a Pearl Earring recreation" onerror="this.parentElement.innerHTML='<div class=visualText>REMAKE B · MODERN PORTRAIT</div>'"></div><p class="photoTask">What is she wearing? What is she doing?</p><p class="mini">Then guess the famous artwork each photo is remaking.</p></div>
      </div>
      <div class="card soft"><b>STYLE & HAIR COMEBACK</b><div class="clothesBank"><span class="tag">oversized blazer</span><span class="tag">trench coat</span><span class="tag">leather jacket</span><span class="tag">cardigan</span><span class="tag">satin blouse</span><span class="tag">wide-leg trousers</span><span class="tag">straight-leg jeans</span><span class="tag">pleated skirt</span><span class="tag">white trainers</span><span class="tag">black ankle boots</span><span class="tag">high heels</span><span class="tag">small handbag</span><span class="tag">canvas tote bag</span></div><p class="mini">Which words can you actually use for the photos? Which ones definitely do NOT fit?</p></div>`,

      ()=>`<div class="grid2">
        <div class="card lav"><div class="kicker">LOOK AT THE PHOTOS AGAIN</div><h2>What is happening NOW?</h2><p>They <span class="verbHi">are standing</span> side by side.</p><p>The man <span class="verbHi">is holding</span> a pitchfork.</p><p>They <span class="verbHi">are wearing</span> old-fashioned clothes.</p><p>The woman <span class="verbHi">is looking</span> at the camera.</p></div>
        <div class="card mint"><div class="kicker">NOTICE THE PATTERN</div><div class="grammarFormula">am / is / are + verb-ing</div><p class="bigquote">Present Continuous = happening <b>now</b> / around now.</p><div><span class="timeSignal">now</span><span class="timeSignal">right now</span><span class="timeSignal">at the moment</span><span class="timeSignal">today</span><span class="timeSignal">Look!</span></div></div>
      </div>
      <div class="card soft"><p class="prompt">Say 4 new sentences about the two photos. Start with: <b>She is… / He is… / They are…</b></p></div>`,

      ()=>`<div class="card"><div class="kicker">THE CONTRAST MAYA NEEDS</div><h2>Usually vs right now</h2><div class="contrastPair"><div class="card habit"><b>USUALLY / HABIT</b><p>She <span class="verbHi">usually wears</span> white trainers.</p></div><div class="arrow">→</div><div class="card now"><b>TODAY / NOW</b><p>Today she <span class="verbHi">is wearing</span> high heels.</p></div></div><div class="contrastPair"><div class="card habit"><p>He <span class="verbHi">often wears</span> a hoodie.</p></div><div class="arrow">→</div><div class="card now"><p>Look! He <span class="verbHi">is wearing</span> an oversized blazer.</p></div></div><div class="contrastPair"><div class="card habit"><p>I <span class="verbHi">usually carry</span> a canvas tote bag.</p></div><div class="arrow">→</div><div class="card now"><p>Today I <span class="verbHi">am carrying</span> a small handbag.</p></div></div></div>
      <div class="grid2"><div class="card blue"><h2>Present Simple</h2><p class="tinyRule"><b>habits · routines · facts</b></p><div><span class="timeSignal">usually</span><span class="timeSignal">often</span><span class="timeSignal">every day</span><span class="timeSignal">never</span></div></div><div class="card lav"><h2>Present Continuous</h2><p class="tinyRule"><b>now · temporary situations</b></p><div><span class="timeSignal">now</span><span class="timeSignal">today</span><span class="timeSignal">at the moment</span><span class="timeSignal">Look!</span></div></div></div>`,

      ()=>`<div class="grid2">
        ${mcq('pspc1','Maya usually ___ white trainers.',['wears','is wearing','wearing','wear'],0)}
        ${mcq('pspc2','Look! She ___ a satin blouse today.',['wears','is wearing','wear','does wear'],1)}
        ${mcq('pspc3','I ___ a canvas tote bag to work most days.',['am carrying','carry','carries','carrying'],1)}
        ${mcq('pspc4','At the moment they ___ for the remake photo.',['pose','poses','are posing','posing'],2)}
      </div><div class="card soft"><p class="prompt">Final challenge: make your own pair with one clothes word.</p><p class="bigquote">I usually wear / carry… BUT today I’m wearing / carrying…</p></div>`
    ]
  };

  buildMenus();
  if(typeof current!=='undefined' && current==='warm') render();
})();
