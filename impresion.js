(()=>{
function selectedScope(){
 const active=document.querySelector('#doctorBar .docActive');
 const name=(active?.textContent||'Residentes').trim();
 if(name==='Residentes') return {name,list:beds};
 const ids=new Set([...document.querySelectorAll('#beds .bed .id')].map(x=>(x.textContent||'').replace(/^Cama\s+/,'').trim()));
 return {name,list:beds.filter(b=>ids.has(b.id))};
}
function pEvent(b){
 if(b.type==='puer'){
  const kind=b.birthType==='cesarea'?'CESÁREA':b.birthType==='parto'?'PARTO':'';
  return [kind,b.eventDate?fmtDate(b.eventDate):'',b.eventTime||''].filter(Boolean).map(esc).join('<br>')||'—';
 }
 if(b.type==='gyn'&&b.eventDate)return '<b>PROC.</b><br>'+esc(fmtDate(b.eventDate))+(b.proc?'<br>'+esc(b.proc):'');
 return b.proc?esc(b.proc):'—';
}
function pDx(b){const a=dxItems(b.dx);return a.length?a.map((x,i)=>'<div>'+(i+1)+'. '+esc(x)+'</div>').join(''):'—'}
function pMeds(b){const a=activeMeds(b);return a.length?a.map(m=>'<div>• '+esc(m.text)+' <b>D'+medDay(m)+'</b></div>').join(''):'—'}
function pLabs(b){
 const e=(b.labEntries||[]).slice(-1)[0]; if(!e)return '—';
 const a=parseLabItems(e.raw||'').slice(0,9),head=[e.date?fmtDate(e.date):'',e.time||''].filter(Boolean).join(' ');
 return (head?'<b>'+esc(head)+'</b><br>':'')+(a.length?a.map(x=>esc(x.name)+': '+esc(x.value)).join(' · '):'Registrado');
}
function pTasks(b){
 const a=(b.tasks||[]).filter(t=>taskStatus(t)!=='done').sort((x,y)=>taskStatus(x)==='overdue'?-1:taskStatus(y)==='overdue'?1:0);
 return a.length?a.map(t=>'<div class="'+(taskStatus(t)==='overdue'?'printOver':'')+'">'+(taskStatus(t)==='overdue'?'<b>VENCIDO · </b>':'• ')+esc(t.text)+(t.date?' · '+esc(fmtDate(t.date)):'')+(t.time?' '+esc(t.time):'')+'</div>').join(''):'—';
}
function flags(b){const a=[];if(b.special?.postICU||b.postIcu||b.post_icu)a.push('POST-UCI');if(b.special?.isolation||b.isolation)a.push('AISLAMIENTO');if(b.special?.closeWatch||b.closeWatch||b.close_watch)a.push('VIGILANCIA');return a.length?'<div class="printFlags">'+a.map(esc).join(' · ')+'</div>':''}
function patientRow(b){return '<tr class="patientRow"><td class="bedCell"><b>'+esc(b.id)+'</b></td><td><b>'+esc(b.name||'SIN NOMBRE')+'</b>'+(b.hc?'<br>HC: '+esc(b.hc):'')+flags(b)+'</td><td>'+pDx(b)+'</td><td>'+pEvent(b)+'</td><td>'+pLabs(b)+'</td><td>'+pMeds(b)+'</td><td>'+pTasks(b)+'</td></tr>'}
function hospitalPrint(){
 const scope=selectedScope(),occ=scope.list.filter(b=>b.type),free=scope.list.filter(b=>!b.type).map(b=>b.id);
 const groups=[['preg','EMBARAZADAS'],['puer','PUÉRPERAS'],['gyn','GINECOLÓGICAS']];let body='';
 groups.forEach(([type,title])=>{const rows=occ.filter(b=>b.type===type);if(!rows.length)return;body+='<tr class="sectionRow"><td colspan="7">'+title+' · '+rows.length+'</td></tr>'+rows.map(patientRow).join('')});
 if(!body)body='<tr><td colspan="7" class="printEmpty">Sin pacientes ocupando camas en esta vista.</td></tr>';
 const now=new Date();return '<div class="hospitalPrintHead"><b>ENTREGA DE GUARDIA · GINECO-OBSTETRICIA</b><span>'+esc(scope.name)+' · '+now.toLocaleDateString('es-EC')+' '+now.toLocaleTimeString('es-EC',{hour:'2-digit',minute:'2-digit'})+' · '+occ.length+' pacientes</span></div><table class="hospitalPrint"><thead><tr><th class="wBed">Cama</th><th class="wPatient">Paciente / HC</th><th class="wDx">Diagnóstico</th><th class="wEvent">Nac. / Proc.</th><th class="wLabs">Laboratorios</th><th class="wMeds">Medicación</th><th class="wTasks">Pendientes / indicaciones</th></tr></thead><tbody>'+body+'</tbody></table>'+(free.length?'<div class="freeBeds"><b>Camas libres:</b> '+free.map(esc).join(' · ')+'</div>':'');
}
function addPrintStyle(){if(document.getElementById('hospitalPrintStyle'))return;const s=document.createElement('style');s.id='hospitalPrintStyle';s.textContent=`
.pdfSheet.hospitalSheet{width:297mm!important;min-height:210mm!important;padding:6mm!important;background:#fff}.hospitalPrintHead{display:flex;justify-content:space-between;gap:10px;align-items:flex-end;border-bottom:1.2px solid #111;padding-bottom:3px;margin-bottom:4px;font-size:7.5pt}.hospitalPrintHead>b{font-size:10pt}.hospitalPrint{width:100%;border-collapse:collapse;table-layout:fixed;font-size:6.8pt;line-height:1.15;color:#111}.hospitalPrint th,.hospitalPrint td{border:.6px solid #555;padding:2.2px 3px;vertical-align:top;overflow-wrap:anywhere}.hospitalPrint th{font-size:6.6pt;text-transform:uppercase;text-align:center;background:#f1f1f1}.hospitalPrint thead{display:table-header-group}.hospitalPrint tr{break-inside:avoid;page-break-inside:avoid}.hospitalPrint .sectionRow td{font-weight:900;font-size:7.2pt;padding:2px 4px;background:#e8e8e8}.hospitalPrint .bedCell{text-align:center;font-size:7.4pt}.hospitalPrint .wBed{width:5%}.hospitalPrint .wPatient{width:14%}.hospitalPrint .wDx{width:18%}.hospitalPrint .wEvent{width:10%}.hospitalPrint .wLabs{width:17%}.hospitalPrint .wMeds{width:20%}.hospitalPrint .wTasks{width:16%}.printFlags{font-weight:800;margin-top:2px;font-size:6.2pt}.printOver{font-weight:700}.freeBeds{border:1px solid #777;border-top:0;padding:3px 5px;font-size:6.5pt;line-height:1.25}.printEmpty{text-align:center;padding:12px!important}
@media print{@page{size:A4 landscape;margin:0}body>*{display:none!important}.pdfModal{display:block!important;position:static!important;background:#fff!important;overflow:visible!important}.pdfToolbar{display:none!important}.pdfStage{padding:0!important;overflow:visible!important}.pdfSheet.hospitalSheet{display:block!important;width:297mm!important;min-height:210mm!important;margin:0!important;box-shadow:none!important;padding:6mm!important}.hospitalPrint{font-size:6.8pt!important}.hospitalPrintHead{font-size:7.5pt!important}}
`;document.head.appendChild(s)}
function hospitalPreview(){const sheet=$('pdfSheet');sheet.className='pdfSheet hospitalSheet';sheet.innerHTML=hospitalPrint();$('pdfModal').style.display='block'}
function install(){
 if(!document.getElementById('pdfSheet')||!document.getElementById('printHandoff'))return false;
 addPrintStyle();
 showPdfPreview=hospitalPreview;
 $('printHandoff').onclick=hospitalPreview;
 return true;
}
let tries=0,t=setInterval(()=>{tries++;if(install()||tries>40)clearInterval(t)},100);
})();