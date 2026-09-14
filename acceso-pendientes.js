(()=>{
function pendingCount(){
 try{
  if(typeof selected==='undefined'||selected===null||!beds[selected])return 0;
  return (beds[selected].tasks||[]).filter(t=>taskStatus(t)!=='done').length;
 }catch(e){return 0}
}
function updateButton(){
 const b=document.getElementById('quickPendingBtn');if(!b)return;
 const n=pendingCount();
 b.textContent='📌 Pendientes'+(n?' ('+n+')':'');
 b.classList.toggle('hasPending',n>0);
}
function goPending(){
 const target=document.getElementById('taskText');if(!target)return;
 const box=target.closest('.full')||target.parentElement||target;
 box.scrollIntoView({behavior:'smooth',block:'start'});
 setTimeout(()=>target.focus({preventScroll:true}),350);
}
function install(){
 const panel=document.querySelector('#modal .panel'),head=document.querySelector('#modal .head'),form=document.getElementById('form'),task=document.getElementById('taskText');
 if(!panel||!head||!form||!task)return false;
 if(!document.getElementById('quickPendingStyle')){
  const s=document.createElement('style');s.id='quickPendingStyle';s.textContent=`
  .quickPatientNav{padding:8px 14px 0;background:#fff;position:sticky;top:0;z-index:2}
  .quickPatientNav button{padding:8px 12px;font-size:12px;font-weight:800;border-radius:999px;border:1px solid #cbd5e1;background:#f8fafc;color:#334155}
  .quickPatientNav button.hasPending{background:#fff7d6;border-color:#e5b700;color:#7a5200}
  `;document.head.appendChild(s);
 }
 if(!document.getElementById('quickPendingBtn')){
  const nav=document.createElement('div');nav.className='quickPatientNav';
  const b=document.createElement('button');b.type='button';b.id='quickPendingBtn';b.onclick=goPending;
  nav.appendChild(b);head.insertAdjacentElement('afterend',nav);
 }
 updateButton();
 const mo=new MutationObserver(()=>{if(document.getElementById('modal').style.display==='block')updateButton()});
 mo.observe(document.getElementById('modal'),{attributes:true,attributeFilter:['style'],subtree:false});
 document.getElementById('form').addEventListener('change',()=>setTimeout(updateButton,80));
 document.getElementById('form').addEventListener('click',()=>setTimeout(updateButton,80));
 return true;
}
let n=0,t=setInterval(()=>{if(install()||++n>40)clearInterval(t)},100);
})();