const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const origin='https://example.test/Portal-da-Historia/';
function worker(){
  const handlers={},entries=new Map(),cache={addAll:async requests=>{for(const r of requests)entries.set(r.url,{url:r.url})},match:async k=>entries.get(k)};
  const context={URL,Request,Response,Set,fetch:async()=>{throw Error('offline')},caches:{open:async()=>cache,keys:async()=>[],delete:async()=>true},self:{location:{href:origin+'cronicas/sw.js'},addEventListener:(n,f)=>handlers[n]=f,skipWaiting:async()=>{},clients:{claim:async()=>{}}}};
  vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'cronicas/sw.js'),'utf8'),context);
  return {handlers,entries};
}
test('game app is a separate standalone install with scoped manifest',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'cronicas/manifest.webmanifest'),'utf8'));
  const portal=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
  assert.equal(manifest.display,'standalone');assert.equal(new URL(manifest.id,origin+'cronicas/manifest.webmanifest').href,origin+'cronicas/');assert.notEqual(new URL(portal.id,origin).href,new URL(manifest.id,origin+'cronicas/manifest.webmanifest').href);
  for(const icon of manifest.icons)assert.ok(fs.existsSync(path.join(root,'cronicas',icon.src)));
});
test('every offline asset exists; offline install and cache lookup work',async()=>{
  const {handlers,entries}=worker();let pending;handlers.install({waitUntil:p=>pending=p});await pending;
  for(const url of entries.keys()){
    const relative=new URL(url).pathname.replace('/Portal-da-Historia/','');
    assert.ok(fs.existsSync(path.join(root,relative)),relative);
  }
  assert.ok(entries.size>=35);
  for(const url of [origin+'cronicas/',origin+'jogos.js?v=82',origin+'img/nilo-panorama-v81.png']){
    handlers.fetch({request:{url,method:'GET',mode:'same-origin'},respondWith:p=>pending=p});assert.ok(await pending);
  }
  let intercepted=false;handlers.fetch({request:{url:origin+'index.html',method:'GET',mode:'navigate'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
});
