(()=>{
 const s=document.createElement('style');
 s.textContent=`.taskDelete{margin-left:auto;padding:4px 7px!important;min-width:30px;border-color:#fecaca!important;background:#fff!important;color:#b42318!important;font-weight:900}.taskDelete:hover{background:#fff1f2!important}`;
 document.head.appendChild(s);
 const baseRenderTasks=renderTasks;
 renderTasks=function(){
  baseRenderTasks();
  if(selected===null)return;
  const b=beds[selected],rows=[...document.querySelectorAll('#taskList .taskitem')];
  rows.forEach((row,i)=>{
   if(row.querySelector('.taskDelete'))return;
   const bt=document.createElement('button');
   bt.type='button';bt.className='taskDelete';bt.textContent='✕';bt.title='Eliminar pendiente';bt.setAttribute('aria-label','Eliminar pendiente');
   bt.onclick=()=>{
    const t=b.tasks[i];if(!t)return;
    if(!confirm('¿Eliminar este pendiente? Úsalo si fue ingresado por error.'))return;
    b.tasks.splice(i,1);save();renderTasks();render();
   };
   row.appendChild(bt);
  });
 };
 if(selected!==null)renderTasks();
})();