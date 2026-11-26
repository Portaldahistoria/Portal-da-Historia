/* Guardião do Nilo — choreography in 60 Hz logical game ticks. */
const NileBoss = (() => {
  const patterns = ['tide', 'lunge', 'slam'];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function plan(turn, hp, maxHp) {
    const enraged = hp <= maxHp / 2;
    const key = patterns[turn % patterns.length];
    if (key === 'tide') return {
      key, enraged, warning: enraged ? 50 : 68, duration: enraged ? 168 : 160, recovery: enraged ? 144 : 178,
      hint: 'O Guardião inspira. Salte sobre as ondas!',
      attack: 'Maré do Nilo! Salte sobre a crista de cada onda.',
      events: (enraged ? [14, 48, 85] : [18, 65]).map((at, i) => ({at, kind: 'nileWave', variant: i}))
    };
    if (key === 'lunge') return {
      key, enraged, warning: enraged ? 48 : 62, duration: enraged ? 135 : 95, recovery: enraged ? 146 : 174,
      hint: 'O Guardião se inclina. Saia da área dourada ou esquive!',
      attack: enraged ? 'Duas investidas! Espere a segunda antes de avançar.' : 'Investida do crocodilo! Esquive da mandíbula.',
      strikes: enraged ? [16, 77] : [20], events: []
    };
    return {
      key, enraged, warning: enraged ? 50 : 70, duration: enraged ? 138 : 120, recovery: enraged ? 150 : 182,
      hint: 'O Guardião ergue as garras. Cuidado com o chão marcado!',
      attack: 'Impacto no templo! Saia das colunas de água marcadas e pule a onda.',
      events: [{at: 12, kind:'nileGeyser'}, {at: 32, kind:'nileShock'}, {at: 55, kind:'nileGeyser'}, ...(enraged ? [{at: 87, kind:'nileGeyser'}] : [])]
    };
  }
  function pose(p, mode, cycle, modeLeft, t) {
    if (mode === 'defeat') return {frame:5, offset:0, strike:false};
    if (mode === 'open') return {frame:5, offset:0, strike:false};
    if (mode === 'warning') {
      const progress = 1 - modeLeft / p.warning;
      return {frame: progress < .24 ? 0 : 1, offset:0, strike:false};
    }
    if (p.key === 'tide') {
      // Each exhalation is a visible jaw-opening animation, not a body wobble.
      const nearWave = p.events.some(e => cycle >= e.at - 8 && cycle <= e.at + 14);
      return {frame: nearWave ? 2 : (cycle % 32 < 13 ? 1 : 0), offset:0, strike:false};
    }
    if (p.key === 'lunge') {
      for (const at of p.strikes) {
        const since = cycle - at;
        if (since >= -10 && since < 0) return {frame:1, offset:0, strike:false};
        if (since >= 0 && since < 40) {
          const offset = since < 12 ? -118 * (since / 12) : since < 24 ? -118 : -118 * (1 - (since - 24) / 16);
          return {frame: since < 26 ? 3 : 4, offset: Math.round(offset), strike: since >= 3 && since < 29};
        }
      }
      return {frame:0, offset:0, strike:false};
    }
    if (cycle < 26) return {frame:1, offset:0, strike:false};
    if (cycle < 55) return {frame:4, offset:0, strike:true};
    return {frame:5, offset:0, strike:false};
  }
  const eventsAt = (p, cycle) => p.events.filter(e => e.at === cycle);
  function makeHazard(event, p, {x, floor, playerX}) {
    if (event.kind === 'nileWave') {
      const speed = (p.enraged ? 3.8 : 3) + event.variant * .25;
      return {kind:event.kind,x:x-86,y:floor-25,w:48,h:25,vx:-speed,vy:0,life:210,age:0};
    }
    if (event.kind === 'nileShock') return {kind:event.kind,x:x-90,y:floor-13,w:56,h:13,vx:p.enraged?-5:-4.2,vy:0,life:150,age:0};
    if (event.kind === 'nileGeyser') return {kind:event.kind,x:clamp(playerX-12,10,310),y:floor-80,w:35,h:80,vx:0,vy:0,life:74,warn:34,age:0};
    return null;
  }
  return {plan, pose, eventsAt, makeHazard};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = NileBoss;
