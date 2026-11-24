(()=>{
  const make=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
  const get=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))??fallback;}catch{return fallback;}};
  const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}};
  const library=[
    ...[6,7,8,9].flatMap(y=>(window.PORTAL_GRADES?.[y]||[]).map(c=>({key:'acervo-'+y+'-'+c.id,title:c.title,year:y+'º ano'}))),
    ...(window.CHAPTERS||[]).map(c=>({key:'capitulo-'+c.id,title:c.title,year:'1º ano EM'}))
  ];
  let active=null,cacheReady=false;
  const header=document.querySelector('header.top');
  const toolbar=header.querySelector('nav');
  const install=make('button','Baixar aplicativo','pwa-install');install.type='button';
  const studies=make('button','Meus estudos','pwa-studies');studies.type='button';
  const state=make('span','Preparando estudo offline…','pwa-state');state.setAttribute('role','status');
  const androidWebView=/Android/i.test(navigator.userAgent)&&(/;\s*wv\b/i.test(navigator.userAgent)||/Version\/4\.0.*Chrome\//i.test(navigator.userAgent));
  const appMode=androidWebView||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  if(!appMode)toolbar.append(install);toolbar.append(studies,state);
  const measureHeader=()=>document.documentElement.style.setProperty('--portal-header-height',Math.ceil(header.getBoundingClientRect().height)+'px');
  new ResizeObserver(measureHeader).observe(header);measureHeader();
  const modal=make('dialog',null,'pwa-dialog');modal.setAttribute('aria-label','Meus estudos e instalação');document.body.append(modal);
  function show(title,body){
    modal.replaceChildren();const head=make('div',null,'pwa-dialog-head'),close=make('button','Fechar');close.type='button';close.onclick=()=>modal.close();
    head.append(make('h2',title),close);modal.append(head,body);if(!modal.open)modal.showModal();
  }
  install.onclick=()=>{location.hash='#aplicativo';};
  let deferredInstall=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e});window.addEventListener('appinstalled',()=>{deferredInstall=null});window.portalRequestInstall=async()=>{if(!deferredInstall)return 'unavailable';const event=deferredInstall;deferredInstall=null;try{await event.prompt();return (await event.userChoice).outcome}catch{return 'unavailable'}};
  const actions=make('div',null,'pwa-chapter-actions');actions.hidden=true;actions.setAttribute('aria-label','Ações deste capítulo');
  const pill=(label,path)=>{const b=make('button');b.type='button';b.setAttribute('aria-pressed','false');b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';b.append(make('span',label));return b};
  const favorite=pill('Favoritar capítulo','<path d="M20.8 8.7c0 4.2-8.8 10-8.8 10S3.2 12.9 3.2 8.7a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z"/>');
  const complete=pill('Marcar como estudado','<circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6 5.4-5.4"/>');
  actions.append(favorite,complete);const menu=document.querySelector('.chapter-menu');if(menu)menu.insertBefore(actions,menu.querySelector('.chapter-back-link'));
  function selected(k){return library.find(c=>c.key===k);}
  function renderActions(){
    active=selected(location.hash.slice(1));actions.hidden=!active;
    if(!active)return;
    const fav=get('ph-favorites',[]),done=get('ph-completed',[]);
    const isFavorite=fav.includes(active.key),isComplete=done.includes(active.key);
    favorite.querySelector('span').textContent=isFavorite?'Favoritado':'Favoritar capítulo';
    favorite.setAttribute('aria-pressed',String(isFavorite));favorite.setAttribute('aria-label',isFavorite?'Remover dos favoritos':'Favoritar capítulo');
    complete.querySelector('span').textContent=isComplete?'Estudado':'Marcar como estudado';
    complete.setAttribute('aria-pressed',String(isComplete));complete.setAttribute('aria-label',isComplete?'Desmarcar capítulo estudado':'Marcar como estudado');
    const visited=get('ph-history',[]).filter(x=>x!==active.key);put('ph-history',[active.key,...visited].slice(0,38));
  }
  function toggle(key){if(!active)return;const values=get(key,[]);const next=values.includes(active.key)?values.filter(x=>x!==active.key):[...values,active.key];if(!put(key,next)){state.textContent='Armazenamento local indisponível';return;}renderActions();}
  favorite.onclick=()=>toggle('ph-favorites');complete.onclick=()=>toggle('ph-completed');
  studies.onclick=()=>{
    const body=make('div'),done=get('ph-completed',[]),fav=get('ph-favorites',[]),history=get('ph-history',[]);
    body.append(make('p',done.length+' de '+library.length+' capítulos marcados como estudados.'));
    const progress=make('progress');progress.max=library.length;progress.value=done.length;body.append(progress,make('p','Seu progresso é salvo somente neste dispositivo.'));
    for(const [label,keys] of [['Favoritos',fav],['Últimos capítulos acessados',history.slice(0,12)],['Capítulos estudados',done]]){
      body.append(make('h3',label));const list=make('ul');for(const key of keys){const c=selected(key);if(!c)continue;const a=make('a',c.title+' · '+c.year);a.href='#'+key;a.onclick=()=>modal.close();const li=make('li');li.append(a);list.append(li);}body.append(list.childElementCount?list:make('p','Nenhum capítulo ainda.'));
    }show('Meus estudos',body);
  };
  function status(){state.textContent=!navigator.onLine?(cacheReady?'Modo offline · acervo disponível':'Sem conexão'):cacheReady?'Acervo disponível offline':'Preparando estudo offline…';}
  window.addEventListener('online',status);window.addEventListener('offline',status);window.addEventListener('hashchange',renderActions);renderActions();
  if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{cacheReady=true;status();}).catch(()=>{state.textContent='Offline ainda indisponível';});}else state.textContent='Modo offline não suportado';
})();
