(()=>{
const tabs=document.querySelector('.tabs');if(!tabs||document.getElementById('familyInfoTab'))return;
const btn=document.createElement('button');btn.id='familyInfoTab';btn.type='button';btn.textContent='👨‍👩‍👧 Información al familiar';tabs.appendChild(btn);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const occupied=b=>!!(b&&b.type);
function row(b){return `<tr><td>${esc(b.id)}</td><td>OBSTETRICIA</td><td><b>${esc(b.name)}</b><br>C: ${esc(b.cedula||'')}<br>H.C.: ${esc(b.hc||'')}</td><td>${esc(b.dx).replace(/\n/g,'<br>')}</td><td></td><td></td></tr>`}
function section(title,list){return `<section><h2>${title}</h2><table><thead><tr><th>CAMA</th><th>SERVICIO</th><th>DATOS DE LA PACIENTE</th><th>DIAGNÓSTICOS</th><th>MÉDICO QUE INFORMA</th><th>FAMILIAR INFORMADO / FIRMA</th></tr></thead><tbody>${list.map(row).join('')}</tbody></table></section>`}
function printFamily(){
 const a=beds.slice(0,32).filter(occupied),b=beds.slice(32).filter(occupied);
 const w=window.open('','_blank');if(!w)return alert('Permite ventanas emergentes para imprimir.');
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Información al familiar</title><style>@page{size:A4 landscape;margin:8mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#111;margin:0}h1{text-align:center;font-size:17px;margin:0 0 3px}p{text-align:center;font-size:10px;margin:0 0 8px}h2{font-size:12px;margin:5px 0}table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:9px}th,td{border:1px solid #222;padding:4px;vertical-align:top;word-wrap:break-word}th{text-align:center;font-size:8px}th:nth-child(1){width:6%}th:nth-child(2){width:10%}th:nth-child(3){width:21%}th:nth-child(4){width:28%}th:nth-child(5){width:16%}th:nth-child(6){width:19%}td{height:42px}section+section{page-break-before:always}</style></head><body><h1>INFORMACIÓN AL FAMILIAR</h1><p>GINECO-OBSTETRICIA</p>${section('PARTE 1 · CAMAS 601 A 6011-B',a)}${section('PARTE 2 · CAMAS 612 EN ADELANTE',b)}<script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`);w.document.close();
}
btn.onclick=printFamily;
})();