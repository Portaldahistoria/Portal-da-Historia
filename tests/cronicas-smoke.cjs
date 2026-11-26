const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});
  const errors=[];
  const base=process.env.TEST_URL||'http://127.0.0.1:8765';
  fs.mkdirSync('test-artifacts',{recursive:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/#jogos');
    const f=page.frameLocator('#service-frame');
    await f.getByRole('button',{name:/Crônicas de Capivara Explore/}).click();
    await f.getByRole('button',{name:'Sala de artefatos'}).click();
    assert.equal(await f.locator('.exhibit').count(),36);
    assert.match(await f.locator('.exhibit i').first().evaluate(el=>getComputedStyle(el).backgroundImage),/acervo-36-v77\.png/);
    await f.locator('.exhibit').first().click();
    assert.match(await f.locator('.museum-detail').innerText(),/cerâmica/i);
    await page.screenshot({path:'test-artifacts/acervo-desktop.png',fullPage:true});
    await f.locator('#museum-back').click();
    await f.locator('#new-game').click();
    await f.locator('#player-name').fill('Teste automatizado');
    await f.locator('[data-name="Gabi"]').click();
    await f.locator('#hero-confirm').click();
    assert.equal(await f.locator('.travel-pin').count(),6);
    const names=['Guardião do Nilo','Sentinela do Zigurate','Colosso de Bronze','Guardião da Arena','Autômato da Bastilha','Titã a Vapor'];
    for(let w=0;w<6;w++){
      await f.locator('.destination-action').nth(w).click();
      await f.locator('.boss-pin').waitFor({state:'visible',timeout:15000});
      assert.equal(await f.locator('.travel-pin').count(),7);
      assert.equal(await f.locator('.destination-action').count(),7);
      assert.equal(await f.locator('.travel-pin:disabled').count(),0);
      await f.locator('.travel-pin').first().click();
      await f.locator('#gabe-canvas').waitFor({state:'visible',timeout:15000});
      assert.deepEqual(await f.locator('#gabe-canvas').evaluate(el=>[el.width,el.height]),[960,540]);
      assert.equal(await f.locator('.game-help').count(),0);
      if(w===0){assert.equal(await f.locator('#artifact-toast').isVisible(),false);assert.equal(await f.locator('.play-console').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px')}
      await f.locator('#gabe-canvas').focus();
      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(350);
      await page.keyboard.up('ArrowRight');
      await f.locator('#phase-back').click();
      await f.locator('.boss-pin').waitFor({state:'visible'});
      if(w===0){
        await f.locator('.destination-action').nth(1).click();
        await f.locator('#gabe-canvas').waitFor({state:'visible',timeout:15000});
        await f.locator('#gabe-canvas').focus();
        await page.keyboard.down('ArrowDown');
        await page.waitForTimeout(350);
        await f.locator('#gabe-canvas').screenshot({path:'test-artifacts/egito-escribas-agachado.png'});
        await page.keyboard.up('ArrowDown');
        await page.waitForTimeout(350);
        await f.locator('#gabe-canvas').screenshot({path:'test-artifacts/egito-escribas-em-pe.png'});
        await f.locator('#phase-back').click();
        await f.locator('.boss-pin').waitFor({state:'visible'});
      }
      await f.locator('.boss-pin').click();
      await f.locator('#boss-canvas').waitFor({state:'visible',timeout:15000});
      assert.equal(await f.locator('.boss-stage h3').innerText(),names[w]);
      assert.equal(await f.locator('#boss-hearts .pixel-heart').count(),3);
      assert.deepEqual(await f.locator('#boss-canvas').evaluate(el=>[el.width,el.height]),[960,540]);
      await f.locator('#boss-canvas').focus();
      await page.keyboard.down('ArrowRight');
      await page.waitForTimeout(300);
      await page.keyboard.up('ArrowRight');
      for(const key of ['Space','x','c']){await page.keyboard.down(key);await page.waitForTimeout(100);await page.keyboard.up(key)}
      assert.equal(await f.locator('#boss-dash-status').innerText(),'Recarregando');
      await page.screenshot({path:'test-artifacts/chefe-'+(w+1)+'.png',fullPage:true});
      if(w===0){
        const notice=f.locator('#boss-notice');
        await notice.filter({hasText:'Maré do Nilo!'}).waitFor({state:'visible',timeout:15000});
        await page.waitForTimeout(550);
        await f.locator('#boss-canvas').screenshot({path:'test-artifacts/nilo-mare.png'});
        await notice.filter({hasText:'está exausto'}).waitFor({state:'visible',timeout:15000});
        await f.locator('#boss-canvas').screenshot({path:'test-artifacts/nilo-vulneravel.png'});
        await notice.filter({hasText:'Investida do crocodilo!'}).waitFor({state:'visible',timeout:15000});
        await page.waitForTimeout(530);
        await f.locator('#boss-canvas').screenshot({path:'test-artifacts/nilo-investida.png'});
        await notice.filter({hasText:'Impacto no templo!'}).waitFor({state:'visible',timeout:15000});
        await page.waitForTimeout(850);
        await f.locator('#boss-canvas').screenshot({path:'test-artifacts/nilo-impacto.png'});
      }
      await f.locator('#boss-map').click();
      await f.locator('.boss-pin').waitFor({state:'visible'});
      await f.locator('#map-return').click();
    }
    await f.locator('#map-return').click();
    await f.locator('#continue-game').click();
    assert.match(await f.locator('#saved-profiles').innerText(),/Teste automatizado/);
    await page.reload();
    await f.getByRole('button',{name:/Crônicas de Capivara Explore/}).click();
    assert.equal(await f.locator('#continue-game').isVisible(),true);
    await page.close();
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    mobile.on('pageerror',error=>errors.push(error.message));
    await mobile.goto(base+'/#jogos');
    const m=mobile.frameLocator('#service-frame');
    await m.getByRole('button',{name:/Crônicas de Capivara Explore/}).click();
    await m.locator('#new-game').click();
    await m.locator('#player-name').fill('Teste mobile');
    await m.locator('[data-name="Gio"]').click();
    await m.locator('#hero-confirm').click();
    await m.locator('.destination-action').first().click();
    await m.locator('.boss-pin').waitFor({state:'visible',timeout:15000});
    await m.locator('.boss-pin').click();
    await m.locator('#boss-canvas').waitFor({state:'visible',timeout:15000});
    const canvas=await m.locator('.boss-canvas').boundingBox(),controls=await m.locator('.boss-controls').boundingBox();
    assert.ok(canvas&&controls&&controls.y>=canvas.y+canvas.height-2,'Controles devem permanecer fora do cenário no celular');
    await mobile.screenshot({path:'test-artifacts/chefe-mobile.png',fullPage:true});
    assert.deepEqual(errors,[]);
    console.log('OK: acervo, 42 destinos desbloqueados, seis chefes, comandos, perfil persistido e layout móvel.');
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
