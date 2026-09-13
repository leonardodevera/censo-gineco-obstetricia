(()=>{
const tabs=document.querySelector('.tabs');
const bedGrid=$('beds');
if(!tabs||!bedGrid||document.getElementById('guardTab'))return;

const style=document.createElement('style');
style.textContent=`
.guardPanel{display:none;margin-top:12px;background:#fff;border:1px solid #dbe3ee;border-radius:14px;padding:14px}
.guardHead{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.guardHead strong{font-size:16px}.guardHint{font-size:12px;color:#64748b;margin:5px 0 12px;line-height:1.4}
.guardSetup{display:flex;gap:8px;align-items:end;flex-wrap:wrap}.guardSetup label{font-size:11px;font-weight:800;color:#475569}.guardSetup select,.guardSetup input{display:block;margin-top:4px;border:1px solid #cbd5e1;border-radius:9px;padding:9px;font-size:14px;background:#fff}
.guardNames{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.guardNames input{min-width:150px;flex:1;border:1px solid #cbd5e1;border-radius:9px;padding:9px}
.guardDraw{margin-top:10px;background:#1f5fbf;color:#fff;border-color:#1f5fbf;font-weight:800}.guardResults{display:grid;gap:9px;margin-top:14px}
.guardCard{border:1px solid #dbe3ee;border-left:5px solid #1f5fbf;border-radius:11px;padding:11px;background:#f8fafc}.guardCardTop{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap}.guardDoctor{font-weight:900}.guardRange{font-size:12px;font-weight:900;background:#e8eefb;border-radius:999px;padding:5px 8px}.guardCount{font-size:11px;color:#64748b;margin-top:5px}.guardPatients{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.guardPatient{font-size:11px;background:#fff;border:1px solid #dbe3ee;border-radius:8px;padding:5px 7px}.guardEmpty{padding:16px;text-align:center;color:#64748b}
@media(min-width:700px){.guardResults{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
document.head.appendChild(style);

const btn=document.createElement('button');
btn.id='guardTab';
btn.type='button';
btn.textContent='⚕️ Guardia';
tabs.appendChild(btn);

const panel=document.createElement('div');
panel.id='guardPanel';
panel.className='guardPanel';
panel.innerHTML=`
  <div class="guardHead"><strong>⚕️ Distribución de guardia</strong></div>
  <div class="guardHint">Reparte únicamente las pacientes <b>Embarazadas + Ginecológicas</b>. Los bloques de camas siempre son consecutivos; lo aleatorio es qué médico recibe cada bloque.</div>
  <div class="guardSetup"><label>Número de médicos<select id="guardCount"><option value="2">2 médicos</option><option value="3">3 médicos</option><option value="4">4 médicos</option></select></label></div>
  <div id="guardNames" class="guardNames"></div>
  <button id="guardDraw" class="guardDraw" type="button">🎲 Sortear distribución</button>
  <div id="guardResults" class="guardResults"></div>`;
bedGrid.parentNode.insertBefore(panel,bedGrid);

const countEl=document.getElementById('guardCount');
const namesEl=document.getElementById('guardNames');
const resultsEl=document.getElementById('guardResults');

function buildNames(){
 const n=Number(countEl.value);
 const old=[...namesEl.querySelectorAll('input')].map(x=>x.value);
 namesEl.innerHTML='';
 for(let i=0;i<n;i++){
   const x=document.createElement('input');
   x.type='text';x.placeholder=`Nombre médico ${i+1}`;x.value=old[i]||`Dr. ${i+1}`;
   namesEl.appendChild(x);
 }
 resultsEl.innerHTML='';
}
function showGuard(){
 panel.style.display='block';bedGrid.style.display='none';
 btn.classList.add('active');
 [...tabs.querySelectorAll('button')].filter(x=>x!==btn).forEach(x=>x.classList.remove('active'));
}
function leaveGuard(){panel.style.display='none';bedGrid.style.display='grid';btn.classList.remove('active')}

function shuffle(a){
 const r=[...a];
 for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}
 return r;
}
function draw(){
 const doctors=[...namesEl.querySelectorAll('input')].map((x,i)=>x.value.trim()||`Dr. ${i+1}`);
 const n=doctors.length;
 const ordered=BED_IDS.map(id=>beds.find(b=>b.id===id)).filter(Boolean);
 const eligiblePositions=[];
 ordered.forEach((b,i)=>{if(b.type==='preg'||b.type==='gyn')eligiblePositions.push(i)});
 const total=eligiblePositions.length;
 if(!total){resultsEl.innerHTML='<div class="guardEmpty">No hay pacientes Embarazadas o Ginecológicas registradas actualmente.</div>';return}
 if(total<n){resultsEl.innerHTML=`<div class="guardEmpty">Hay ${total} paciente${total===1?'':'s'} para ${n} médicos. Reduce el número de médicos para formar bloques con pacientes.</div>`;return}

 const base=Math.floor(total/n), extra=total%n;
 const sizes=Array.from({length:n},(_,i)=>base+(i<extra?1:0));
 const blocks=[];
 let eligibleCursor=0, startPhysical=0;
 for(let i=0;i<n;i++){
   const take=sizes[i];
   const lastEligiblePos=eligiblePositions[eligibleCursor+take-1];
   const endPhysical=(i===n-1)?ordered.length-1:lastEligiblePos;
   const pts=ordered.slice(startPhysical,endPhysical+1).filter(b=>b.type==='preg'||b.type==='gyn');
   blocks.push({start:ordered[startPhysical].id,end:ordered[endPhysical].id,patients:pts});
   startPhysical=endPhysical+1;
   eligibleCursor+=take;
 }
 const assigned=shuffle(doctors);
 resultsEl.innerHTML=blocks.map((b,i)=>`<div class="guardCard"><div class="guardCardTop"><span class="guardDoctor">${escapeHtml(assigned[i])}</span><span class="guardRange">${escapeHtml(b.start)} → ${escapeHtml(b.end)}</span></div><div class="guardCount">${b.patients.length} paciente${b.patients.length===1?'':'s'} a cargo</div><div class="guardPatients">${b.patients.map(p=>`<span class="guardPatient"><b>${escapeHtml(p.id)}</b>${p.name?' · '+escapeHtml(p.name):''}</span>`).join('')}</div></div>`).join('');
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

btn.onclick=showGuard;
countEl.onchange=buildNames;
document.getElementById('guardDraw').onclick=draw;
buildNames();

// Cualquier otra pestaña/filtro devuelve a la vista normal.
[...tabs.querySelectorAll('button')].filter(x=>x!==btn).forEach(x=>x.addEventListener('click',leaveGuard));
['all','occ','free','pend'].forEach(id=>{const el=$(id);if(el)el.addEventListener('click',leaveGuard)});
})();