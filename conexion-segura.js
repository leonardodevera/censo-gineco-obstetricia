(()=>{
const css=document.createElement('style');
css.textContent=`#offlineBanner{display:none;position:sticky;top:0;z-index:9999;padding:10px 14px;text-align:center;font-size:13px;font-weight:900;background:#b42318;color:#fff;box-shadow:0 2px 8px #0002}body.offlineMode #offlineBanner{display:block}body.offlineMode [data-block],body.offlineMode [data-unblock]{pointer-events:none!important;opacity:.45!important}#reconnectBanner{display:none;position:sticky;top:0;z-index:9999;padding:9px 14px;text-align:center;font-size:13px;font-weight:900;background:#166534;color:#fff}`;
document.head.appendChild(css);
const offlineBanner=document.createElement('div');offlineBanner.id='offlineBanner';offlineBanner.textContent='⚠️ SIN CONEXIÓN — Modo solo lectura. Los cambios están bloqueados hasta recuperar conexión.';document.body.prepend(offlineBanner);
const reconnectBanner=document.createElement('div');reconnectBanner.id='reconnectBanner';reconnectBanner.textContent='🟢 Conexión restablecida — Actualizando censo…';document.body.prepend(reconnectBanner);
let offline=false,checking=false;
const authed=()=>document.body.classList.contains('authed');
function lockForm(){document.querySelectorAll('#form input,#form select,#form textarea,#form button').forEach(el=>{if(!el.hasAttribute('data-offline-prev'))el.setAttribute('data-offline-prev',el.disabled?'1':'0');el.disabled=true})}
function unlockForm(){document.querySelectorAll('[data-offline-prev]').forEach(el=>{el.disabled=el.getAttribute('data-offline-prev')==='1';el.removeAttribute('data-offline-prev')})}
function setOffline(value){if(offline===value)return;offline=value;document.body.classList.toggle('offlineMode',offline);if(offline){lockForm();const c=document.getElementById('cloudState');if(c){c.textContent='⚠️ Sin conexión';c.classList.add('err')}}else{unlockForm();reconnectBanner.style.display='block';setTimeout(()=>reconnectBanner.style.display='none',3500);try{loadCloud(true)}catch(e){}}}
async function checkConnection(){if(checking||!authed())return;checking=true;try{if(!navigator.onLine){setOffline(true);return}const r=await sb.from('beds').select('id').limit(1);setOffline(!!r.error)}catch(e){setOffline(true)}finally{checking=false}}
window.addEventListener('offline',()=>setOffline(true));
window.addEventListener('online',()=>checkConnection());
new MutationObserver(()=>{if(offline)lockForm()}).observe(document.body,{childList:true,subtree:true});
setInterval(checkConnection,20000);
setTimeout(checkConnection,2500);
})();