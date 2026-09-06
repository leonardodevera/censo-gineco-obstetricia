(()=>{
function applyProcedure(){
  const type=document.getElementById('type');
  const proc=document.getElementById('proc');
  if(!type||!proc)return;
  const label=proc.closest('label');
  if(!label)return;
  const v=type.value;
  if(v==='puer'){
    label.style.display='none';
  }else{
    label.style.display='';
    let text=v==='preg'?'Procedimiento / intervención (opcional)':v==='gyn'?'Procedimiento (opcional)':'Procedimiento';
    for(const node of label.childNodes){if(node.nodeType===Node.TEXT_NODE){node.textContent=text;break}}
  }
}
function install(){
  const type=document.getElementById('type');
  if(!type)return false;
  type.addEventListener('change',applyProcedure);
  document.getElementById('beds')?.addEventListener('click',()=>setTimeout(applyProcedure,20));
  new MutationObserver(()=>{const m=document.getElementById('modal');if(m&&getComputedStyle(m).display!=='none')setTimeout(applyProcedure,0)}).observe(document.getElementById('modal'),{attributes:true,attributeFilter:['style']});
  applyProcedure();return true;
}
let n=0,t=setInterval(()=>{if(install()||++n>30)clearInterval(t)},100);
})();