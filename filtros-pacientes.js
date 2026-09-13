(()=>{
/* Las pestañas clínicas filtran por tipo REAL de paciente, no por sector físico.
   La vista "Todas" conserva la distribución visual física existente. */
const tabs=document.querySelectorAll('[data-sector]');
if(tabs.length<3)return;
const names={preg:'🤰 Embarazadas',puer:'👶 Puérperas',gyn:'♀ Ginecológicas'};
const typeFor={preg:'preg',puer:'puer',gyn:'gyn'};
const oldFiltered=filteredBeds;
let patientFilter='';

// La tercera pestaña deja de llamarse Ginecológicas / Puérperas.
tabs.forEach((btn,i)=>{
 const key=i===0?'preg':i===1?'puer':'gyn';
 btn.dataset.patientType=key;
 btn.textContent=names[key];
 btn.removeAttribute('data-sector');
 btn.onclick=()=>{
   patientFilter=key;
   filter='patientType';
   $('search').value='';
   render();
 };
});

filteredBeds=function(){
 const q=norm($('search').value.trim());
 if(q)return oldFiltered();
 if(filter==='patientType'&&patientFilter)return beds.filter(b=>b.type===typeFor[patientFilter]);
 return oldFiltered();
};

// Al entrar a otros filtros se abandona el filtro clínico.
['all','occ','free','pend'].forEach(id=>{
 const el=$(id);if(!el)return;
 const old=el.onclick;
 el.onclick=(e)=>{patientFilter='';return old&&old.call(el,e)};
});
})();