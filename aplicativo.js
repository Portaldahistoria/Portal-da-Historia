(()=>{
  let prompt=null;
  const button=document.getElementById('install'),status=document.getElementById('status');
  function notice(message){status.hidden=false;status.textContent=message;}
  function installed(){button.textContent='Aplicativo instalado';button.disabled=true;notice('O Portal da História está disponível na tela inicial.');}
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)installed();
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;});
  window.addEventListener('appinstalled',()=>{prompt=null;installed();});
  button.addEventListener('click',async()=>{
    if(!prompt){notice('Use o menu do navegador e selecione Instalar aplicativo ou Adicionar à tela inicial.');status.scrollIntoView({behavior:'smooth',block:'nearest'});return;}
    try{await prompt.prompt();const result=await prompt.userChoice;if(result.outcome==='accepted')notice('Instalação iniciada.');else notice('Instalação cancelada. Você pode tentar novamente pelo menu do navegador.');}
    catch{notice('Abra o menu do navegador para instalar.');}
    finally{prompt=null;}
  });
  if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
