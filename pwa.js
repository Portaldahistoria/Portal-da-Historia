(()=>{
  const make=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
  const get=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))??fallback;}catch{return fallback;}};
  const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}};
  const library=[
    ...[6,7,8,9].flatMap(y=>(window.PORTAL_GRADES?.[y]||[]).map(c=>({key:'acervo-'+y+'-'+c.id,title:c.title,year:y+'º ano'}))),
    ...(window.CHAPTERS||[]).map(c=>({key:'capitulo-'+c.id,title:c.title,year:'1º ano EM'}))
  ];
  let active=null,cacheReady=false;
  const toolbar=make('section',null,'pwa-toolbar');
  toolbar.setAttribute('aria-label','Aplicativo Portal da História');
  const install=make('button','Baixar aplicativo','pwa-install');install.type='button';
  const studies=make('button','Meus estudos','pwa-studies');studies.type='button';
  const state=make('span','Preparando estudo offline…','pwa-state');state.setAttribute('role','status');
  const androidWebView=/Android/i.test(navigator.userAgent)&&(/;\s*wv\b/i.test(navigator.userAgent)||/Version\/4\.0.*Chrome\//i.test(navigator.userAgent));
  const appMode=androidWebView||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  if(!appMode)toolbar.append(install);toolbar.append(studies,state);
  const header=document.querySelector('header.top');header.after(toolbar);
  const modal=make('dialog',null,'pwa-dialog');modal.setAttribute('aria-label','Meus estudos e instalação');document.body.append(modal);
  function show(title,body){
    modal.replaceChildren();const head=make('div',null,'pwa-dialog-head'),close=make('button','Fechar');close.type='button';close.onclick=()=>modal.close();
    head.append(make('h2',title),close);modal.append(head,body);if(!modal.open)modal.showModal();
  }
  install.onclick=()=>{location.href='aplicativo.html';};
  const actions=make('div',null,'pwa-chapter-actions');actions.hidden=true;
  const favorite=make('button','Favoritar capítulo');favorite.type='button';const complete=make('button','Marcar como estudado');complete.type='button';
  actions.append(favorite,complete);toolbar.after(actions);
  function selected(k){return library.find(c=>c.key===k);}
  function renderActions(){
    active=selected(location.hash.slice(1));actions.hidden=!active;
    if(!active)return;
    const fav=get('ph-favorites',[]),done=get('ph-completed',[]);
    favorite.textContent=fav.includes(active.key)?'Remover dos favoritos':'Favoritar capítulo';
    complete.textContent=done.includes(active.key)?'Estudado ✓ (desmarcar)':'Marcar como estudado';
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
