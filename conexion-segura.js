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

(()=>{
const form=$('form');if(!form||$('cedula'))return;
const hc=$('hc');const label=hc&&hc.closest('label');if(!label)return;
const ced=document.createElement('label');ced.innerHTML='Cédula<input id="cedula" inputmode="numeric" autocomplete="off" placeholder="Número de cédula">';label.insertAdjacentElement('afterend',ced);
const prevMap=mapBedRow;mapBedRow=function(r,i){const b=prevMap(r,i);b.cedula=r.cedula||'';b.admission_at=r.admission_at||null;return b};
const prevPayload=bedPayload;bedPayload=function(b){return {...prevPayload(b),cedula:b.cedula||null,admission_at:b.admission_at||null}};
async function hydrate(){try{const {data,error}=await sb.from('beds').select('id,cedula,admission_at');if(error||!Array.isArray(data))return;const m=new Map(data.map(r=>[String(r.id),r]));beds.forEach(b=>{const r=m.get(String(b.id));if(r){b.cedula=r.cedula||'';b.admission_at=r.admission_at||null}});fill()}catch(e){console.error(e)}}
function fill(){if(selected===null||!beds[selected])return;$('cedula').value=beds[selected].cedula||''}
form.addEventListener('submit',()=>{if(selected===null||!beds[selected])return;const b=beds[selected],t=$('type').value;b.cedula=$('cedula').value.trim();if(!b.type&&t&&!b.admission_at)b.admission_at=new Date().toISOString()},true);
let ls=-2,lo=false;setInterval(()=>{const o=$('modal')&&$('modal').style.display!=='none';if(o&&(!lo||ls!==selected))fill();lo=o;ls=selected},120);
setTimeout(hydrate,800);
})();