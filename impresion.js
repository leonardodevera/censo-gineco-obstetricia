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
function tableFor(list){
 const groups=[['preg','EMBARAZADAS'],['puer','PUÉRPERAS'],['gyn','GINECOLÓGICAS']];let body='';
 groups.forEach(([type,title])=>{const rows=list.filter(b=>b.type===type);if(!rows.length)return;body+='<tr class="sectionRow"><td colspan="7">'+title+' · '+rows.length+'</td></tr>'+rows.map(patientRow).join('')});
 if(!body)body='<tr><td colspan="7" class="printEmpty">Sin pacientes ocupando camas en este bloque.</td></tr>';
 return '<table class="hospitalPrint"><thead><tr><th class="wBed">Cama</th><th class="wPatient">Paciente / HC</th><th class="wDx">Diagnóstico</th><th class="wEvent">Nac. / Proc.</th><th class="wLabs">Laboratorios</th><th class="wMeds">Medicación</th><th class="wTasks">Pendientes / indicaciones</th></tr></thead><tbody>'+body+'</tbody></table>';
}
function section(scope,list,label,breakBefore){
 const now=new Date();
 return '<div class="handoffPage'+(breakBefore?' handoffPageSecond':'')+'"><div class="hospitalPrintHead"><b>ENTREGA DE GUARDIA · GINECO-OBSTETRICIA</b><span>'+esc(scope.name)+' · '+esc(label)+' · '+now.toLocaleDateString('es-EC')+' '+now.toLocaleTimeString('es-EC',{hour:'2-digit',minute:'2-digit'})+' · '+list.length+' pacientes</span></div>'+tableFor(list)+'</div>';
}
function hospitalPrint(){
 const scope=selectedScope(),occ=scope.list.filter(b=>b.type);
 const cut=BED_IDS.indexOf('6011-B');
 const firstIds=new Set(BED_IDS.slice(0,cut+1));
 const first=occ.filter(b=>firstIds.has(b.id));
 const second=occ.filter(b=>!firstIds.has(b.id));
 return section(scope,first,'CAMAS 601–611-B',false)+section(scope,second,'CAMAS 612–622-D',true);
}
function addPrintStyle(){if(document.getElementById('hospitalPrintStyle'))return;const s=document.createElement('style');s.id='hospitalPrintStyle';s.textContent=`
.pdfSheet.hospitalSheet{width:297mm!important;min-height:210mm!important;padding:6mm!important;background:#fff!important;box-shadow:none!important;box-sizing:border-box!important}.handoffPage{box-sizing:border-box;width:100%;background:#fff;margin:0 auto 8mm}.handoffPageSecond{border-top:2px dashed #bbb;padding-top:6mm}.hospitalPrintHead{display:flex;justify-content:space-between;gap:10px;align-items:flex-end;border-bottom:1.2px solid #111;padding-bottom:3px;margin-bottom:4px;font-size:8pt}.hospitalPrintHead>b{font-size:10pt}.hospitalPrint{width:100%;max-width:100%;border-collapse:collapse;table-layout:fixed;font-size:7.4pt;line-height:1.22;color:#111}.hospitalPrint th,.hospitalPrint td{box-sizing:border-box;border:.6px solid #555;padding:3px 3.5px;vertical-align:top;overflow-wrap:anywhere;word-break:normal}.hospitalPrint .patientRow td{border-top:1.4px solid #222}.hospitalPrint th{font-size:7pt;text-transform:uppercase;text-align:center;background:#f1f1f1}.hospitalPrint thead{display:table-header-group}.hospitalPrint tr{break-inside:avoid;page-break-inside:avoid}.hospitalPrint .patientRow{break-inside:avoid;page-break-inside:avoid}.hospitalPrint .sectionRow{break-after:avoid;page-break-after:avoid}.hospitalPrint .sectionRow td{font-weight:900;font-size:7.4pt;padding:2.5px 4px;background:#e8e8e8}.hospitalPrint .bedCell{text-align:center;font-size:7.6pt}.hospitalPrint .wBed{width:5%}.hospitalPrint .wPatient{width:14%}.hospitalPrint .wDx{width:18%}.hospitalPrint .wEvent{width:10%}.hospitalPrint .wLabs{width:16%}.hospitalPrint .wMeds{width:19%}.hospitalPrint .wTasks{width:18%}.printFlags{font-weight:800;margin-top:2px;font-size:6.5pt}.printOver{font-weight:700}.printEmpty{text-align:center;padding:12px!important}
@media print{@page{size:A4 landscape;margin:6mm}html,body{width:auto!important;height:auto!important;overflow:visible!important}body>*{display:none!important}.pdfModal{display:block!important;position:static!important;background:#fff!important;overflow:visible!important;width:auto!important;height:auto!important}.pdfToolbar{display:none!important}.pdfStage{padding:0!important;overflow:visible!important;width:auto!important}.pdfSheet.hospitalSheet{display:block!important;width:auto!important;min-height:0!important;margin:0!important;padding:0!important;background:#fff!important;box-shadow:none!important}.handoffPage{display:block!important;width:auto!important;margin:0!important;padding:0!important;background:#fff!important;break-after:auto!important;page-break-after:auto!important}.handoffPageSecond{border-top:0!important;padding-top:0!important;break-before:page!important;page-break-before:always!important}.hospitalPrint{width:100%!important;max-width:100%!important;font-size:7.4pt!important}.hospitalPrintHead{font-size:8pt!important}.hospitalPrint th,.hospitalPrint td{padding:3px 3.5px!important}.hospitalPrint .patientRow td{border-top:1.4px solid #222!important}.hospitalPrint tr,.hospitalPrint .patientRow{break-inside:avoid!important;page-break-inside:avoid!important}}
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