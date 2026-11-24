/* Interface experimental: os dados e o mecanismo de impressão continuam no guia v42. */
(()=>{
 'use strict';
 if(window.BPFMobileExperimental)return;window.BPFMobileExperimental=true;
 const start=()=>{
  if(!window.Guia||typeof BPF_PHRASES==='undefined'||!document.querySelector('#nav'))return;
  const nav=document.querySelector('#nav'),pages=document.querySelector('#pages'),toolbar=document.querySelector('.toolbar');
  if(!pages||!toolbar)return;
  const button=(label,action,cls='')=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.className=cls;b.addEventListener('click',action);return b;};
  const node=(tag,text,cls='')=>{const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  const style=document.createElement('style');style.textContent=`
  @media screen {
   :root{--lab-blue:#086782;--lab-ink:#17374b;--lab-bg:#f3f7fa}
   .lab-mode{min-height:44px;font-weight:bold;background:#e4f2f5;color:var(--lab-ink)}
   #lab-mobile{display:none;color:var(--lab-ink);margin:0 auto;padding:12px;max-width:720px;box-sizing:border-box;padding-bottom:30px;overflow-wrap:anywhere}
   body.lab-responsive.lab-process #lab-mobile{display:block}body.lab-responsive.lab-process #pages{display:none}
   #lab-mobile .lab-card{background:#fff;border:1px solid #d3e3ea;border-radius:12px;margin:12px 0;padding:14px;min-width:0;box-shadow:0 2px 8px #14374b0b}
   #lab-mobile h2{font-size:22px;line-height:1.2;margin:4px 0 8px}#lab-mobile h3{font-size:17px;margin:0 0 7px}#lab-mobile p{font-size:15px;line-height:1.5;margin:6px 0}
   #lab-mobile .lab-label{font-size:13px;font-weight:700;margin:8px 0 3px}#lab-mobile .lab-unit{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:9px 10px;border-radius:8px;background:#edf5f8;margin:4px 0;font-size:14px;min-height:38px}
   #lab-mobile .lab-unit[data-answer='0']{background:#fbe8e8;color:#8b2323}#lab-mobile .lab-unit[data-answer='1']{background:#e5f3e9;color:#205b38}
   #lab-mobile button{min-height:44px;width:100%;margin:8px 0 0;border-radius:8px}#lab-mobile .lab-main{background:var(--lab-blue);color:white;border-color:var(--lab-blue);font-weight:bold}
   #lab-mobile textarea,#lab-mobile select,#lab-mobile input:not([type=checkbox]):not([type=radio]){display:block;width:100%;min-height:44px;box-sizing:border-box;border:1px solid #adc6d1;border-radius:8px;padding:8px;font:inherit;background:white;color:var(--lab-ink);max-width:100%}
   #lab-mobile textarea{resize:vertical;min-height:64px}#lab-mobile summary{font-weight:bold;cursor:pointer;padding:10px 0;min-height:44px}#lab-mobile label{display:block;font-size:14px;margin:8px 0}
   #lab-desktop{display:none}#lab-desktop button{display:block;text-align:left;width:100%;margin:5px 0;min-height:44px}#lab-desktop button[aria-current=true]{background:var(--lab-blue);color:white}
   @media(min-width:1000px){body.lab-responsive #lab-desktop{display:block;position:fixed;top:170px;left:8px;bottom:12px;width:190px;overflow:auto;background:white;padding:12px;border:1px solid #cfdee5;border-radius:12px;z-index:15}body.lab-responsive .viewport{margin-left:210px}body.lab-responsive.lab-process #pages{display:block}body.lab-responsive.lab-process #lab-mobile{display:none}}
   @media(max-width:999px){body.lab-responsive.lab-process .viewport{overflow:visible;padding:0}body.lab-responsive.lab-process{overflow-x:hidden}body.lab-responsive .toolbar{max-width:100%;gap:6px}body.lab-responsive .toolbar button,body.lab-responsive .toolbar select{min-height:44px;max-width:100%;white-space:normal}body.lab-responsive #bpf-editor{box-sizing:border-box!important;width:100%!important;max-width:100%!important;left:0!important;right:0!important;margin:0!important;padding:12px!important;overflow-x:hidden!important}body.lab-responsive #bpf-editor fieldset,body.lab-responsive #bpf-editor section,body.lab-responsive #bpf-editor .bpf-unified-group,body.lab-responsive #bpf-editor .bpf-group{min-width:0!important;max-width:100%!important;overflow-wrap:anywhere}body.lab-responsive #bpf-editor textarea,body.lab-responsive #bpf-editor select,body.lab-responsive #bpf-editor input:not([type=radio]):not([type=checkbox]){max-width:100%!important;box-sizing:border-box}body.lab-responsive #bpf-editor button{min-height:44px;white-space:normal}body.lab-responsive #bpf-editor label{overflow-wrap:anywhere}body.lab-responsive #bpf-editor .bpf-editor-controls{position:sticky;bottom:0;background:white;padding:8px;z-index:30;display:flex;gap:8px}body.lab-responsive #bpf-editor .bpf-editor-controls button{flex:1;min-height:48px}}
  }
  @media print {#lab-mobile,#lab-desktop,.lab-mode{display:none!important}body.lab-responsive #pages{display:block!important}}
  `;document.head.append(style);
  const mobile=node('section',undefined);mobile.id='lab-mobile';pages.before(mobile);
  const side=node('nav',undefined);side.id='lab-desktop';side.setAttribute('aria-label','Processos do guia');document.body.append(side);
  const toggle=button('Guia original',()=>{responsive=!responsive;try{localStorage.setItem('bpf-lab-layout-v1',responsive?'responsive':'original')}catch{};refresh(true)},'lab-mode');toolbar.append(toggle);
  let responsive=true;try{responsive=localStorage.getItem('bpf-lab-layout-v1')!=='original'}catch{}
  let last='',lastNav='',activePage=-1;
  const answerLabel=v=>({'1':'SIM','0':'NÃO','2':'NA'})[v]||'Não preenchido';
  function updateField(original,proxy){original.value=proxy.value;original.dispatchEvent(new Event('input',{bubbles:true}));original.dispatchEvent(new Event('change',{bubbles:true}));}
  function fieldProxy(original,caption){
   const label=node('label',caption);const p=original.tagName==='SELECT'?document.createElement('select'):document.createElement('textarea');
   if(original.tagName==='SELECT')for(const opt of original.options)p.add(new Option(opt.textContent,opt.value));
   else p.rows=caption.includes('OBSERVA')?5:2;
   p.value=original.value;p.dataset.labField=original.dataset.field;p.addEventListener('change',()=>updateField(original,p));p.addEventListener('blur',()=>{if(original.value!==p.value)updateField(original,p)});label.append(p);return label;
  }
  function renderSide(){const signature=Array.from(nav.options).map(o=>o.value+'|'+o.textContent).join('\n')+'|'+nav.value;if(signature===lastNav)return;lastNav=signature;side.replaceChildren(node('h3','Processos'));for(const o of nav.options){const b=button(o.textContent,()=>{nav.value=o.value;nav.dispatchEvent(new Event('change',{bubbles:true}));refresh(true)});b.setAttribute('aria-current',String(o.value===nav.value));side.append(b);}}
  function refresh(force=false){
   document.body.classList.toggle('lab-responsive',responsive);toggle.textContent=responsive?'Guia original':'Modo adaptado';
   const selected=Number(nav.value),data=BPF_PHRASES.find(p=>p.page===selected),page=pages.querySelector('.page[data-page="'+selected+'"]');
   document.body.classList.toggle('lab-process',!!data&&!!page);if(!responsive){return;}renderSide();if(!data||!page)return;
   if(mobile.contains(document.activeElement)&&!force)return;
   const vals=window.Guia.values;const signature=JSON.stringify([selected,data.rows.map(r=>r.scopes.map(s=>vals[s.name])),Array.from(page.querySelectorAll('textarea[data-field],select[data-field]')).map(e=>e.value)]);if(!force&&signature===last)return;last=signature;
   if(activePage!==selected){activePage=selected;window.scrollTo(0,0);}
   const head=node('div',undefined,'lab-card');head.append(node('h2',nav.selectedOptions[0]?.textContent||'Processo'),node('p','Avaliação — modo experimental. Os resultados e o PDF usam o formulário original.'));
   mobile.replaceChildren(head);
   const fields=Array.from(page.querySelectorAll('textarea[data-field],select[data-field]')).filter(e=>!e.disabled&&!e.readOnly&&e.style.display!=='none');
   const seen=new Set(),mainFields=[],obs=[];
   for(const e of fields){const key=e.dataset.field;if(seen.has(key))continue;seen.add(key);const label=e.getAttribute('aria-label')||key;if(/OBSERVA/i.test(label+' '+key))obs.push([e,label]);else mainFields.push([e,label]);}
   if(mainFields.length){const card=node('details',undefined,'lab-card');card.append(node('summary','Identificação e dados do processo'));for(const [e,label] of mainFields)card.append(fieldProxy(e,label));mobile.append(card);}
   for(const row of data.rows){const original=page.querySelector('.bpf-f[data-code="'+row.code+'"]');if(!original)continue;
    const card=node('article',undefined,'lab-card');card.append(node('h3',row.code),node('p',row.description||''));
    for(const scope of row.scopes){const val=vals[scope.name],unit=node('div',undefined,'lab-unit');unit.dataset.answer=val||'';unit.append(node('span',bpfScopeLabel(data,scope)||'Unidade'),node('strong',answerLabel(val)));card.append(unit);}
    card.append(button('Abrir F — '+row.code,()=>original.click(),'lab-main'));mobile.append(card);
   }
   const info=node('section',undefined,'lab-card');info.append(node('h3','Observações gerais'));for(const [e,label] of obs)info.append(fieldProxy(e,label));if(!obs.length)info.append(node('p','Consulte as observações no guia original.'));mobile.append(info);
   const foot=node('div',undefined,'lab-card');foot.append(button('Processo anterior',()=>document.querySelector('#prev')?.click()),button('Próximo processo',()=>document.querySelector('#next')?.click(),'lab-main'));mobile.append(foot);
  }
  nav.addEventListener('change',()=>setTimeout(()=>refresh(true),0));
  document.addEventListener('click',()=>setTimeout(()=>refresh(),80));
  window.addEventListener('resize',()=>refresh());
  setInterval(()=>refresh(),600);refresh(true);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
