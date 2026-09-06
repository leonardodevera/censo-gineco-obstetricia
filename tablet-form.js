(()=>{
function install(){const form=document.getElementById('form');if(!form)return false;
 const style=document.createElement('style');style.id='tabletFormStyles';style.textContent=`
 #dx,#proc,#medPaste{min-height:92px;line-height:1.35;font-size:15px;padding:10px 11px;resize:vertical}
 #labs{min-height:78px;line-height:1.35;font-size:14px;padding:9px 10px}
 #taskText{min-height:44px;font-size:15px;padding:9px 10px}
 @media (min-width:700px){#dx,#proc,#medPaste{min-height:105px}.form{row-gap:10px}.medbox,.labbox{padding-top:8px;padding-bottom:8px}}
 `;document.head.appendChild(style);
 const task=document.getElementById('taskText');if(task){task.setAttribute('enterkeyhint','next')}
 return true}
let n=0,t=setInterval(()=>{if(install()||++n>30)clearInterval(t)},100);
})();