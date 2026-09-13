(()=>{
if(window.__altaHistoricoInstalled)return;window.__altaHistoricoInstalled=true;
const PREFIX='ALTA_JSON:';
const fechaLocal=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())};
function camaActual(){let t=($('title')?.textContent||'').trim(),id=t.replace(/^Cama\s*/i,'').trim();return beds.find(b=>b.id===id)}
function datosAlta(b){try{const r=String(b?.plan||'');return r.startsWith(PREFIX)?JSON.parse(r.slice(PREFIX.length)):null}catch(e){return null}}
async function guardarHistorico(){const b=camaActual();if(!b||b.type!=='puer'||!b.hc)return;const v=datosAlta(b);if(!v?.alta)return;const now=new Date().toISOString(),date=fechaLocal();const payload={bed_id:b.id,hc:b.hc||'',patient_name:b.name||'',phone:v.phone||'',email:v.email||'',discharge_date:date,discharge_at:now,created_by:currentUser?.id||null,updated_at:now};const {error}=await sb.from('puerperal_discharges').upsert(payload,{onConflict:'hc,discharge_date'});if(error){console.error('alta historico',error);alert('El alta se guardó en la cama, pero no pudo registrarse en Altas puerperios.')}}
async function borrarSiDesmarca(){const b=camaActual();if(!b||b.type!=='puer'||!b.hc)return;const {error}=await sb.from('puerperal_discharges').delete().eq('hc',b.hc).eq('discharge_date',fechaLocal());if(error)console.error('borrar alta historico',error)}
document.addEventListener('click',e=>{if(e.target?.id==='altaSave')setTimeout(guardarHistorico,500)});
document.addEventListener('change',e=>{if(e.target?.id==='altaCheck'&&!e.target.checked)setTimeout(borrarSiDesmarca,500)});
})();