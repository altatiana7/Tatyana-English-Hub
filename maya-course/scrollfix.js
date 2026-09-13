'use strict';
(function(){
  const seen=new WeakSet();
  function fixFrame(frame){
    if(seen.has(frame)) return;
    seen.add(frame);
    const apply=()=>{
      try{
        const d=frame.contentDocument;
        if(!d||!d.head)return;
        let st=d.getElementById('maya-scroll-fix');
        if(!st){st=d.createElement('style');st.id='maya-scroll-fix';d.head.appendChild(st)}
        st.textContent=`html,body{height:100%!important;min-height:0!important;overflow:hidden!important}.app{height:100vh!important;min-height:0!important;max-height:100vh!important;align-items:stretch!important;overflow:hidden!important}.side{height:100vh!important;max-height:100vh!important;overflow-y:auto!important;overflow-x:hidden!important;position:relative!important;top:auto!important}.stage{height:100vh!important;min-height:0!important;max-height:100vh!important;overflow:hidden!important;padding:8px!important}.panel{height:calc(100vh - 16px)!important;min-height:0!important;max-height:calc(100vh - 16px)!important;overflow:hidden!important;display:none!important;flex-direction:column!important}.panel.active{display:flex!important}.head{flex:0 0 auto!important}.content{flex:1 1 auto!important;min-height:0!important;height:auto!important;max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important;scrollbar-gutter:stable!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;padding:0 10px 70px 0!important}.content>*:last-child{margin-bottom:28px!important}@media(max-width:950px){html,body{height:100%!important;overflow:hidden!important}.app{display:grid!important;grid-template-columns:1fr!important;height:100vh!important;max-height:100vh!important}.side{height:auto!important;max-height:34vh!important;position:relative!important;overflow-y:auto!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}.brand{grid-column:1/-1!important}.stage{height:auto!important;min-height:0!important;max-height:none!important;overflow:hidden!important}.panel{height:66vh!important;max-height:66vh!important;min-height:0!important}.content{overflow-y:auto!important;padding-bottom:70px!important}}`;
      }catch(e){console.warn('scroll fix',e)}
    };
    frame.addEventListener('load',()=>setTimeout(apply,350));
    setTimeout(apply,450);setTimeout(apply,1200);
  }
  function scan(){document.querySelectorAll('iframe').forEach(f=>{if((f.getAttribute('src')||'').includes('1c-remakes-today.html'))fixFrame(f)})}
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
})();
