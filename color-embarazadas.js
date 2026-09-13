(()=>{
 const s=document.createElement('style');
 s.id='pregnantColorModuleStyle';
 s.textContent=`
 #beds .bed.actualPreg{background:#fff3cd!important;border-color:#e6b800!important}
 #beds .bed.actualPuer{background:#ffe0ec!important;border-color:#d94f8a!important}
 #beds .bed.actualGyn{background:#dceeff!important;border-color:#3986c6!important}
 #beds .bed.actualAvailable{background:#f0fbf4!important;border-color:#86d3a2!important}
 #beds .bed.actualBlocked{background:#eef0f3!important;border-color:#9299a3!important;box-shadow:none!important}
 `;
 document.head.appendChild(s);
 const BLOCK_MARK='__BED_BLOCKED__';
 function bedFor(card){
   const txt=(card.textContent||'').replace(/\s+/g,' ');
   return [...beds].sort((a,b)=>b.id.length-a.id.length).find(b=>txt.includes(b.id));
 }
 function apply(){
   const grid=document.getElementById('beds');
   if(!grid||!Array.isArray(beds))return;
   grid.querySelectorAll('.bed').forEach(card=>{
     const b=bedFor(card);if(!b)return;
     const occupied=!!b.name;
     const blocked=!occupied&&b.proc===BLOCK_MARK;
     const available=!occupied&&!blocked;
     card.classList.remove('pregActualOccupied','actualPreg','actualPuer','actualGyn','actualAvailable','actualBlocked');
     card.classList.toggle('actualPreg',occupied&&b.type==='preg');
     card.classList.toggle('actualPuer',occupied&&b.type==='puer');
     card.classList.toggle('actualGyn',occupied&&b.type==='gyn');
     card.classList.toggle('actualAvailable',available);
     card.classList.toggle('actualBlocked',blocked);
   });
 }
 let raf=0;
 const run=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)};
 const wait=setInterval(()=>{const grid=document.getElementById('beds');if(!grid)return;if(Array.isArray(beds)){clearInterval(wait);apply();new MutationObserver(run).observe(grid,{childList:true,subtree:true});}},100);
})();