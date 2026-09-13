(()=>{
 const s=document.createElement('style');
 s.id='pregnantColorModuleStyle';
 s.textContent=`
 /* Embarazadas ocupadas: azul claro. Las camas disponibles conservan su verde actual. */
 .bed.preg:not(.free):not(.available):not(.blocked){background:#e5f1ff!important;border-color:#75a7df!important}
 .bed.preg:not(.free):not(.available):not(.blocked):hover{background:#dcecff!important}
 `;
 document.head.appendChild(s);
})();