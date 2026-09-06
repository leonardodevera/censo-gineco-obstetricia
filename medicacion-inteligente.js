(()=>{
function tags(text,day){const s=String(text||''),a=[];const add=x=>{if(x&&!a.includes(x))a.push(x)};
 let m=s.match(/\b(?:D(?:[íi]a)?\s*)?(\d{1,2})\s*\/\s*(\d{1,2})\b/i);if(m)add('D'+m[1]+'/'+m[2]);
 if(/\b(?:IV|intravenos[oa])\b/i.test(s))add('IV');else if(/\b(?:VO|oral)\b/i.test(s))add('VO');else if(/\bIM\b|intramuscular/i.test(s))add('IM');else if(/\bSC\b|subcut[aá]ne[oa]/i.test(s))add('SC');
 let f=s.match(/\b(QD|BID|TID|QID|STAT)\b/i);if(f)add(f[1].toUpperCase());
 let h=s.match(/\b(?:c(?:ada)?\s*|q)(6|8|12|24)\s*h(?:oras?)?\b/i);if(h)add('c'+h[1]+'h');
 if(!m&&day)add('D'+day);
 return{list:a,course:m?{cur:+m[1],total:+m[2]}:null}}
function enhance(){const box=document.getElementById('medList');if(!box)return;box.querySelectorAll('.meditem').forEach(row=>{if(row.dataset.smart==='1')return;row.dataset.smart='1';let text=row.querySelector('.medtext')?.textContent||row.textContent||'',dm=text.match(/D[ií]a\s+(\d+)/i),day=dm?+dm[1]:null,r=tags(text,day);if(!r.list.length)return;let x=document.createElement('div');x.className='smartMedTags';x.innerHTML=r.list.map(v=>'<span>'+v+'</span>').join('')+(r.course&&r.course.cur===r.course.total?'<b>ÚLTIMO DÍA</b>':r.course&&r.course.cur>r.course.total?'<b>ESQUEMA CUMPLIDO</b>':'');row.appendChild(x)})}
function install(){if(typeof renderMeds!=='function')return false;let style=document.createElement('style');style.textContent='.meditem{padding-top:7px!important;padding-bottom:7px!important}.smartMedTags{display:flex;gap:4px;flex-wrap:wrap;margin-top:3px;line-height:1}.smartMedTags span,.smartMedTags b{font-size:10px;padding:3px 5px;border-radius:5px;background:#eef4ff;color:#315b9a}.smartMedTags b{background:#fff4ce;color:#805b00}.medtext{line-height:1.25}';document.head.appendChild(style);let original=renderMeds;renderMeds=function(){original();enhance()};if(selected!==null)renderMeds();return true}
let n=0,t=setInterval(()=>{if(install()||++n>30)clearInterval(t)},100);
})();