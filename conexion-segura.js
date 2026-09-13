(()=>{
let offline=!navigator.onLine, checking=false;
const style=document.createElement('style');style.textContent=`
#offlineBanner{position:sticky;top:0;z-index:1000;display:none;padding:10px 14px;text-align:center;font-size:13px;font-weight:900;box-shadow:0 2px 8px #0002}
#offlineBanner.off{display:block;background:#fff1f2;color:#991b1b;border-bottom:1px solid #fecaca}
#offlineBanner.back{display:block;background:#ecfdf5;color:#166534;border-bottom:1px solid #bbf7d0}
.offlineLocked{opacity:.55!important;cursor:not-allowed!important}
`;document.head.appendChild(style);
const banner=document.createElement('div');banner.id='offlineBanner';document.body.prepend(banner);

const modifyingWords=['guardar','liberar cama','cambiar de cama','bloquear','desbloquear','suspender','tratamiento culminado','eliminar','alta'];
const isModifyButton=(el)=>{
 const b=el.closest&&el.closest('button');if(!b)return false;
 const t=(b.textContent||'').trim().toLowerCase();
 return modifyingWords.some(w=>t.includes(w));
};
const warn=()=>{banner.className='off';banner.textContent='⚠️ SIN CONEXIÓN — Modo consulta. Los cambios están bloqueados hasta recuperar la conexión.';};
const apply=()=>{
 if(offline){warn();document.body.classList.add('appOffline');}
 else document.body.classList.remove('appOffline');
 document.querySelectorAll('button').forEach(b=>{if(isModifyButton(b))b.classList.toggle('offlineLocked',offline)});
};
const setOffline=(v)=>{const changed=offline!==v;offline=v;apply();if(changed&&!offline){banner.className='back';banner.textContent='🟢 Conexión restablecida — Actualizando censo…';try{loadCloud(false)}catch(e){}setTimeout(()=>{if(!offline){banner.className='';banner.style.display='none'}},3000)}};

window.addEventListener('offline',()=>setOffline(true));
window.addEventListener('online',()=>{setOffline(false);checkCloud()});

document.addEventListener('submit',e=>{if(!offline)return;const f=e.target;if(f&&f.id==='form'){e.preventDefault();e.stopImmediatePropagation();warn();alert('Sin conexión. No se puede guardar hasta recuperar internet.')}},true);
document.addEventListener('click',e=>{if(!offline||!isModifyButton(e.target))return;e.preventDefault();e.stopImmediatePropagation();warn();alert('Sin conexión. Esta acción está bloqueada para evitar cambios que no se guarden.')},true);

const oldSave=typeof save==='function'?save:null;
if(oldSave)save=function(){if(offline){warn();return Promise.resolve()}return oldSave.apply(this,arguments)};

async function checkCloud(){
 if(checking||!navigator.onLine||typeof sb==='undefined'||!sb)return setOffline(!navigator.onLine);
 checking=true;
 try{
  const {error}=await sb.from('beds').select('id').limit(1);
  setOffline(!!error);
 }catch(e){setOffline(true)}finally{checking=false}
}
apply();
setTimeout(checkCloud,1500);
setInterval(checkCloud,20000);
})();