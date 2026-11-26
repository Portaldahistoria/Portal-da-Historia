(()=>{
  const button=document.getElementById('app-install'),status=document.getElementById('offline-status'),help=document.getElementById('install-help');
  let installPrompt=null;
  if(new URL(location.href).searchParams.get('native')==='1'&&location.hostname==='appassets.androidplatform.net'){button.hidden=true;status.textContent='Jogo disponível offline';return;}
  const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  if(standalone())button.hidden=true;
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
  window.addEventListener('appinstalled',()=>{button.hidden=true;help.hidden=true;installPrompt=null;});
  button.onclick=async()=>{
    if(installPrompt){try{await installPrompt.prompt();const result=await installPrompt.userChoice;help.textContent=result.outcome==='accepted'?'Instalação iniciada.':'Instalação cancelada.';}catch{help.textContent='Abra o menu do navegador e escolha Instalar aplicativo.';}installPrompt=null;}
    else help.textContent=/iPhone|iPad|iPod/i.test(navigator.userAgent)?'No Safari, toque em Compartilhar → Adicionar à Tela de Início.':'No menu do navegador, escolha Instalar aplicativo ou Adicionar à tela inicial.';
    help.hidden=false;
  };
  if(!('serviceWorker' in navigator)){status.textContent='Jogo online';return;}
  navigator.serviceWorker.register('cronicas/sw.js',{scope:'cronicas/'}).then(async registration=>{
    const show=()=>{status.textContent='Jogo pronto para usar offline';};
    const worker=registration.installing||registration.waiting||registration.active;
    if(worker?.state==='activated')show();
    else worker?.addEventListener('statechange',()=>{if(worker.state==='activated')show();if(worker.state==='redundant')status.textContent='Download incompleto. Reabra com internet.';});
  }).catch(()=>{status.textContent='Jogo online · offline indisponível';});
})();
