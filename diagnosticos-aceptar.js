(()=>{
const dx=$('dx');if(!dx)return;
const label=dx.closest('label');if(!label)return;
const btn=document.createElement('button');
btn.type='button';btn.textContent='✓ Aceptar';btn.className='dxAccept';
btn.style.cssText='margin-top:6px;padding:7px 12px;font-size:12px;font-weight:800;border-color:#93c5fd;background:#eff6ff;color:#1d4ed8';
label.appendChild(btn);
const organize=()=>{
 const raw=dx.value.trim();if(!raw)return;
 // Solo organiza lo escrito: no corrige, completa ni inventa diagnósticos.
 let parts=raw.split(/\s*(?:\+|;|\n+)\s*/).map(x=>x.trim()).filter(Boolean);
 // Si ya viene numerado por líneas, limpia únicamente la numeración para volver a ordenarlo.
 parts=parts.map(x=>x.replace(/^\s*\d+[.)-]\s*/,'').trim()).filter(Boolean);
 if(parts.length<2)return;
 dx.value=parts.map((x,i)=>`${i+1}. ${x}`).join('\n');
 dx.dispatchEvent(new Event('input',{bubbles:true}));
};
btn.onclick=organize;
})();