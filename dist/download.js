javascript:(()=>{var n={everyTimeCount:100,downloadInterval:5,downloadType:"png",iconColor:"",iconSize:400,logShowTime:10},u={png:"png",ai:"eps",svg:"svg"},t=o=>document.querySelector(o),g=o=>document.querySelectorAll(o),a=()=>t(".car-header .btn-clean-all")?.click(),m=o=>o.forEach(e=>e.click()),w=()=>Array.from(g(".collection-detail .icon-gouwuche1")),h=o=>t('input[mx-keydown="changeColor()"]').value=o,_=o=>t("#J_size_pick_wrap>input").value=o,f=o=>t(`.car-manage-bottom>span[mx-click="downIcon('${o}')"]`).click();function v(){n.iconColor||h(n.iconColor),n.iconSize||_(n.iconSize),f(u[n.downloadType.toLocaleLowerCase()])}function T(){let o="__tag_script_iconfont_print__",e=t(`#${o}`);return e==null&&(e=document.createElement("div"),e.id=o,document.body.appendChild(e),e.style.position="fixed",e.style.top="1rem",e.style.right="1rem",e.style.zIndex=9999999,e.style.backgroundColor="#000000",e.style.padding="0.25rem 1rem",e.style.fontSize="20px",e.style.fontWeight="900",e.style.color="#F56C6C",e.style.borderRadius="8px",e.style.visibility="hidden"),e}var c=T(),i=o=>c.innerText=o,d=null;async function y(o,e,l){let r=`[\u5DF2\u4E0B\u8F7D:${e}|\u603B\u6570:${Math.ceil(l/n.everyTimeCount)}|\u603B\u56FE\u6807\u6570:${l}|\u5355\u6B21\u6570:${n.everyTimeCount}|\u95F4\u9694:${n.downloadInterval}\u79D2]`;i(`${r}\u6B63\u5219\u4E0B\u8F7D\u4E2D!!!`);let p=o.splice(0,n.everyTimeCount);m(p),v(),a(),o.length!=0?(i(`${r}\u7B49\u5F85\u4E0B\u8F7D\u4E2D!!!`),setTimeout(()=>y(o,++e,l),n.downloadInterval*1e3)):(window[s]=!1,i("\u5168\u90E8\u56FE\u6807\u4E0B\u8F7D\u5B8C\u6210!!!"),d=setTimeout(()=>c.style.visibility="hidden",n.logShowTime*1e3))}var s="__tag_script_iconfont__",S=window[s];if(S===!0)alert("\u5DF2\u7ECF\u5728\u4E0B\u8F7D\u4E2D!!!");else{c.style.visibility="visible",clearTimeout(d),window[s]=!0,i("\u5F00\u59CB\u4E0B\u8F7D!!!"),a();let o=w();y(o,1,o.length)}})();void(0);