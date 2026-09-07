(()=>{
function install(){
 const grid=document.getElementById('beds');if(!grid||typeof render!=='function')return false;
 const st=document.createElement('style');st.textContent=`.allSectorTitle{grid-column:1/-1;margin:12px 0 2px;padding:8px 10px;border-radius:9px;background:#eef3f9;color:#334155;font-size:12px;font-weight:900;letter-spacing:.35px}.allSectorTitle:first-child{margin-top:2px}`;document.head.appendChild(st);
 function groupAll(){
  if(typeof filter==='undefined'||filter!=='all'||(document.getElementById('search')?.value||'').trim())return;
  const cards=[...grid.querySelectorAll(':scope > .bed')];if(!cards.length)return;
  grid.querySelectorAll(':scope > .allSectorTitle').forEach(x=>x.remove());
  const starts=[[0,'🤰 EMBARAZADAS'],[20,'👶 PUÉRPERAS'],[40,'♀ GINECOLÓGICAS / PUÉRPERAS']];
  starts.forEach(([i,label])=>{const card=cards[i];if(!card)return;const h=document.createElement('div');h.className='allSectorTitle';h.textContent=label;grid.insertBefore(h,card)});
 }
 const oldRender=render;render=function(){oldRender();requestAnimationFrame(groupAll)};
 requestAnimationFrame(groupAll);return true;
}
let n=0,t=setInterval(()=>{if(install()||++n>30)clearInterval(t)},100);
})();