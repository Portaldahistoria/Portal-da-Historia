// Painted in integer pixels. Reuse the landscape tiles as the camera scrolls.
const campaignLandscape = (() => {
  const palettes = [
    ['#30396e','#ed8c70','#ffe097','#aa6974','#d89c69','#af7959','#386959','#699955'],
    ['#4b5385','#e3a378','#ffe2a1','#9b7580','#c59a74','#ac785d','#416d69','#85a16a'],
    ['#26559a','#64b7d4','#ffdfad','#7289a6','#84abad','#447b92','#35665e','#719672'],
    ['#575294','#e88e91','#ffddab','#a27b94','#b99691','#886d7a','#43665a','#86935c'],
    ['#474878','#bb8fb0','#f9cfb1','#8f809e','#a399ad','#736a85','#445868','#829980'],
    ['#343d64','#ad8790','#eec29a','#857b92','#9892a0','#746777','#43525b','#7c8977']
  ];
  const cache = new Map();
  function paint(world,phase,front) {
    const tile=document.createElement('canvas');
    tile.width=768;tile.height=270;
    const c=tile.getContext('2d'),p=palettes[world];
    let seed=2017+world*139+phase*17;
    const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return Math.floor(seed/4294967296*n)};
    function rect(x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.floor(x),Math.floor(y),w,h)}
    function disk(x,y,rx,ry,color){
      for(let j=-ry;j<=ry;j+=2){const half=Math.round(rx*Math.sqrt(1-j*j/(ry*ry)));rect(x-half,y+j,half*2,2,color)}
    }
    if(!front){
      const sky=c.createLinearGradient(0,0,0,188);
      sky.addColorStop(0,p[0]);sky.addColorStop(.62,p[1]);sky.addColorStop(1,p[2]);rect(0,0,768,270,sky);
      disk(295+phase*39,47+phase*3,19,19,p[2]);
      for(let i=0;i<20;i++){
        const x=random(748),y=23+random(61);
        rect(x,y,22+random(47),2,p[2]);disk(x+16,y-3,16,4,p[2]);
      }
      for(let layer=0;layer<2;layer++)for(let x=0;x<768;x+=3){
        const angle=x/768*2*Math.PI;
        const y=126+layer*25+17*Math.sin(angle*3+phase+layer)+8*Math.cos(angle*8+world)+5*Math.sin(angle*13);
        rect(x,y,3,270-y,p[3+layer]);
      }
      return tile;
    }
    // Small waterside scenes leave the route and the collectibles unobstructed.
    rect(0,204,768,24,p[5]);
    for(let i=0;i<160;i++)rect(random(768),205+random(20),2+random(14),1,p[4]);
    for(let i=0;i<6;i++){
      const x=i*128+14+random(19),y=210+random(7);
      if(world<=1){
        for(let j=0;j<13;j++){rect(x+j/4,y-j*4,5,4,'#865e56');rect(x+1+j/4,y-j*4,2,2,'#d59f71')}
        for(let k=-2;k<=2;k++)for(let j=0;j<9;j++){
          const dx=k*j*1.6,dy=j*j*.23-j*(2.7-Math.abs(k)*.4);
          rect(x+4+dx,y-50+dy,6,3,p[6]);rect(x+4+dx,y-51+dy,4,2,p[7]);
        }
        for(let j=0;j<8;j++){const h=6+random(12);rect(x+32+j*2,y-h,2,h,p[7])}
      }else if(world<=3){
        if(i%2===0){
          rect(x,y-4,49,4,'#664758');rect(x+5,y,39,3,'#493c50');rect(x+23,y-38,2,34,'#695449');
          for(let j=0;j<11;j++)rect(x+26,y-36+j*2,2+j*2,2,j%4===0?'#ddb895':'#ffe5bb');
        }else{
          rect(x+5,y-34,4,34,'#6f5351');disk(x+7,y-39,9,27,p[6]);disk(x+4,y-43,5,18,p[7]);
          rect(x+31,y-16,5,16,'#735850');disk(x+33,y-26,16,13,p[6]);disk(x+27,y-30,10,7,p[7]);
        }
      }else if(world===4){
        rect(x,y-34,3,34,'#574b60');rect(x+40,y-34,3,34,'#574b60');
        for(let j=0;j<7;j++){rect(x-3+j*7,y-34,7,9,j%2?'#ba5962':'#f5ca9c');rect(x-3+j*7,y-25,6,3,j%2?'#95495d':'#cd976e')}
        rect(x-2,y-10,46,4,'#705153');for(let j=0;j<6;j++)rect(x+2+j*6,y-14,5,4,p[7]);
      }else{
        rect(x,y-3,96,3,'#423f52');for(let j=0;j<6;j++){rect(x+j*16,y-22,3,20,'#514959');for(let k=0;k<8;k++)rect(x+j*16+k*2,y-6-k*2,3,3,'#615465')}
        rect(x,y-24,84,3,'#615465');
      }
    }
    return tile;
  }
  return function(c,width,height,world,phase,camera,front){
    const key=world+'-'+phase+'-'+front;
    if(!cache.has(key)){if(cache.size>=36)cache.delete(cache.keys().next().value);cache.set(key,paint(world,phase,front))}
    const tile=cache.get(key),scale=height/270;
    const offset=Math.floor(camera*(front?.67:.13))%tile.width;
    c.save();c.imageSmoothingEnabled=false;c.scale(scale,scale);
    for(let x=-offset;x<width/scale;x+=tile.width)c.drawImage(tile,x,0);
    c.restore();
  };
})();
