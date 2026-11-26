const test = require('node:test');
const assert = require('node:assert/strict');
const NileBoss = require('../nile-boss.js');
const plans = hp => [0, 1, 2].map(turn => NileBoss.plan(turn, hp, 12));

test('the three attacks have distinct mechanics and warning text', () => {
  const [tide, lunge, slam] = plans(12);
  assert.deepEqual([tide.key,lunge.key,slam.key], ['tide','lunge','slam']);
  assert.equal(new Set([tide.hint,lunge.hint,slam.hint]).size,3);
  assert.deepEqual(tide.events.map(e=>e.kind),['nileWave','nileWave']);
  assert.equal(lunge.events.length,0);
  assert.deepEqual(slam.events.map(e=>e.kind),['nileGeyser','nileShock','nileGeyser']);
});

test('second phase adds waves, lunges, geysers and shorter anticipation', () => {
  plans(6).forEach((p,i)=>assert.ok(p.warning<plans(12)[i].warning));
  const [tide,lunge,slam]=plans(6);
  assert.equal(tide.events.length,3);
  assert.equal(lunge.strikes.length,2);
  assert.equal(slam.events.filter(e=>e.kind==='nileGeyser').length,3);
});

test('the boss uses all six poses and never hits during recovery', () => {
  const frames=new Set();
  for(const p of [...plans(12),...plans(6)]){
    for(let i=0;i<p.warning;i++)frames.add(NileBoss.pose(p,'warning',0,p.warning-i,i).frame);
    for(let i=1;i<=p.duration;i++)frames.add(NileBoss.pose(p,'attack',i,p.duration-i,i).frame);
    const recover=NileBoss.pose(p,'open',0,p.recovery,0);
    assert.equal(recover.frame,5);assert.equal(recover.strike,false);frames.add(recover.frame);
  }
  assert.deepEqual([...frames].sort(),[0,1,2,3,4,5]);
});

test('lunge actually crosses the arena and retracts before recovery',()=>{
  for(const p of [plans(12)[1],plans(6)[1]]){
    for(const at of p.strikes){
      assert.equal(NileBoss.pose(p,'attack',at-1,0,0).offset,0);
      const strike=NileBoss.pose(p,'attack',at+12,0,0);
      assert.equal(strike.offset,-118);assert.equal(strike.strike,true);assert.equal(strike.frame,3);
      assert.equal(NileBoss.pose(p,'attack',at+40,0,0).offset,0);
    }
  }
});

test('waves can cross the arena before recovery; geysers lock a warned position',()=>{
  for(const p of [plans(12)[0],plans(6)[0]])for(const event of p.events){
    const h=NileBoss.makeHazard(event,p,{x:375,floor:226,playerX:55});
    assert.ok(h.vx<0);assert.ok(event.at+(h.x-12)/-h.vx<=p.duration);
  }
  const p=plans(12)[2],h=NileBoss.makeHazard(p.events[0],p,{x:375,floor:226,playerX:105});
  assert.equal(h.warn,34);assert.equal(h.x,93);assert.equal(h.vx,0);assert.ok(h.life>h.warn);assert.equal(h.h,80);
});

test('all scheduled events fire exactly once inside their active attack',()=>{
  for(const p of [...plans(12),...plans(6)]){
    const emitted=[];for(let cycle=1;cycle<=p.duration;cycle++)emitted.push(...NileBoss.eventsAt(p,cycle));
    assert.deepEqual(emitted,p.events);
  }
});

test('water effects have animated sprite frames and collision follows visible height',()=>{
  const w=NileBoss.makeHazard(plans(12)[0].events[0],plans(12)[0],{x:375,floor:226,playerX:55});
  const heights=[];for(const age of [0,8,16,24]){w.age=age;heights.push(NileBoss.hazardHeight(w));assert.ok(NileBoss.hazardFrame(w)>=0&&NileBoss.hazardFrame(w)<3)}
  assert.ok(heights[0]>heights[1]&&heights[1]>heights[2]&&heights[3]===heights[1]);
  const geyser=NileBoss.makeHazard(plans(12)[2].events[0],plans(12)[2],{x:375,floor:226,playerX:55});
  assert.equal(NileBoss.hazardHeight(geyser),0);
  geyser.warn=0;geyser.age=35;const small=NileBoss.hazardHeight(geyser);geyser.age=45;assert.ok(small<geyser.h);assert.equal(NileBoss.hazardHeight(geyser),geyser.h);
});
