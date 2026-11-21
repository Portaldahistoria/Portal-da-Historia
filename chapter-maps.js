(() => {
const context=window.PORTAL_MAP_CONTEXT||{}, map=document.getElementById('mapa');if(!map)return;
const pdfModels=['Original','Atlas de conceitos','Árvore de ideias','Mapa ilustrado'];
const branches=(context.branches||[]).map(b=>({title:String(b.name||b.n||b.title||'Tema').replace(/^[^\p{L}\p{N}]+/u,''),subtitle:b.sub||b.summary||b.s||b.subtitle||'',branches:(b.items||b.branches||[]).map(i=>[String(i[0]||''),String(i[1]||'')]),icon:'book'})).filter(b=>b.branches.length);if(!branches.length)return;
function drawRomanIllustration(doc,kind,x,y,w,h){
 const C={ink:[62,51,49],sand:[229,187,127],cream:[255,239,204],red:[175,57,48],gold:[231,169,48],blue:[72,145,176],sky:[204,233,240],green:[93,145,103],dark:[73,103,88],purple:[122,91,147],stone:[193,182,169],white:[255,255,255]};
 const X=n=>x+w*n/100,Y=n=>y+h*n/100;
 const box=(a,b,c,d,color,r=0)=>{doc.setFillColor(...color);if(r)doc.roundedRect(X(a),Y(b),w*c/100,h*d/100,w*r/100,h*r/100,'F');else doc.rect(X(a),Y(b),w*c/100,h*d/100,'F')};
 const el=(a,b,c,d,color)=>{doc.setFillColor(...color);doc.ellipse(X(a),Y(b),w*c/100,h*d/100,'F')};
 const tri=(a,b,c,d,e,f,color)=>{doc.setFillColor(...color);doc.triangle(X(a),Y(b),X(c),Y(d),X(e),Y(f),'F')};
 const ln=(a,b,c,d,color=C.ink,weight=1)=>{doc.setDrawColor(...color);doc.setLineWidth(Math.max(.25,w*weight/100));doc.line(X(a),Y(b),X(c),Y(d))};
 box(0,0,100,100,C.sky,7);el(76,17,10,12,C.gold);box(0,75,100,25,C.sand,4);tri(0,76,21,45,47,76,C.green);tri(45,76,74,42,100,76,C.dark);
 if(kind==='temple'||kind==='scales'||kind==='book'){
  box(13,76,74,11,C.stone);box(9,86,82,5,C.ink);tri(10,32,50,9,90,32,C.red);tri(22,30,50,15,78,30,C.cream);box(13,32,74,9,C.cream);for(let i=0;i<4;i++){box(20+i*19,40,9,36,C.cream);box(20+i*19,41,2,34,C.stone)}
 }else if(kind==='crown'||kind==='leader'){
  el(50,42,22,26,C.sand);el(50,29,21,16,C.ink);box(28,43,44,9,C.sand);tri(20,90,34,60,50,74,C.red);tri(80,90,66,60,50,74,C.red);box(20,76,60,16,C.red,5);tri(29,24,26,9,43,19,C.gold);tri(41,19,50,4,59,19,C.gold);tri(57,19,74,9,71,24,C.gold);box(29,21,42,7,C.gold,2);el(50,24,3,4,C.red);
 }else if(kind==='road'){
  tri(12,96,49,38,51,38,C.stone);tri(88,96,51,38,49,38,C.stone);for(let i=0;i<4;i++)ln(50,50+i*11,50,55+i*11,C.cream,1.4);box(9,37,18,32,C.cream);tri(4,37,18,23,32,37,C.red);box(15,52,6,17,C.ink);box(75,39,16,30,C.cream);tri(70,39,83,27,96,39,C.red);
 }else if(kind==='vase'||kind==='society'){
  el(50,61,25,28,C.red);box(36,23,28,15,C.red,2);box(33,19,34,7,C.gold,2);box(32,82,36,7,C.ink,2);el(50,59,18,17,C.sand);el(50,59,12,12,C.red);ln(29,48,15,44,C.ink,3);ln(15,44,12,62,C.ink,3);ln(12,62,30,69,C.ink,3);ln(71,48,85,44,C.ink,3);ln(85,44,88,62,C.ink,3);ln(88,62,70,69,C.ink,3);
 }else if(kind==='grain'||kind==='farm'){
  box(0,68,100,32,C.green);for(let j=0;j<5;j++)ln(5+j*20,98,47+j*2,68,C.dark,2);box(11,38,32,33,C.cream);tri(6,39,27,19,48,39,C.red);box(24,53,10,18,C.ink);for(let j=0;j<4;j++){let a=59+j*9;ln(a,83,a,40,C.dark,1.6);for(let k=0;k<3;k++){el(a-3,43+k*9,4,5,C.gold);el(a+3,47+k*9,4,5,C.gold)}}
 }else if(kind==='dove'||kind==='church'){
  box(20,43,60,45,C.cream);tri(14,43,50,19,86,43,C.red);box(44,62,13,26,C.ink,2);box(44,7,12,29,C.stone);box(34,15,32,7,C.stone);el(29,56,6,7,C.blue);el(71,56,6,7,C.blue);
 }else if(kind==='globe'||kind==='map'){
  el(50,48,36,38,C.blue);tri(23,27,45,16,52,38,C.green);tri(45,38,28,50,23,27,C.green);tri(55,21,75,30,68,50,C.green);tri(68,50,86,58,63,77,C.green);tri(39,59,61,61,44,82,C.green);ln(14,48,86,48,C.white,.75);ln(50,11,50,86,C.white,.75);el(50,92,33,3,C.stone);
 }else if(kind==='shield'){
  tri(17,24,50,12,83,24,C.gold);box(17,24,66,38,C.red,3);tri(17,62,50,93,83,62,C.red);box(47,23,6,48,C.gold);box(30,46,40,6,C.gold);el(50,49,9,10,C.gold);
 }else{
  box(17,25,66,59,C.cream,5);box(11,20,78,10,C.sand,3);box(11,79,78,10,C.sand,3);for(let j=0;j<5;j++)ln(26,39+j*8,74-(j%2)*10,39+j*8,C.ink,1);el(73,72,8,10,C.red);
 }
}
function illustrationForConcept(text,fallback){const t=text.toLowerCase();if(/césar|augusto|imperador|otávio|justiniano|teodósio|diocleciano|constantino|lider|poder/.test(t))return 'leader';if(/estrada|porto|comércio|circulação/.test(t))return 'road';if(/agric|terra|rural|colonato|trabalho|econôm/.test(t))return 'farm';if(/crist|relig|igreja|fé|culto/.test(t))return 'church';if(/exército|guerra|conflito|fronteira|invasões/.test(t))return 'shield';if(/territóri|província|oriente|ocidente|divisão|migra/.test(t))return 'map';if(/lei|direito|édito|cidadania/.test(t))return 'scroll';if(/sociedade|mulher|cultura|língua|cotidiano/.test(t))return 'society';return fallback||'temple'}
/* Four independently composed, print-ready maps. Text is fitted without truncation. */
function drawPortalMapPDF(doc,a,style){
 const context=window.PORTAL_MAP_CONTEXT||{}; const W=420,H=297,red=[165,30,38],dark=[116,23,32],ink=[41,35,37],muted=[95,80,83],paper=[249,248,248],pink=[248,230,233],line=[213,191,195],white=[255,255,255];
 const fill=c=>doc.setFillColor(...c),stroke=c=>doc.setDrawColor(...c);
 const rect=(x,y,w,h,c,b=null,r=4)=>{fill(c);if(b){stroke(b);doc.setLineWidth(.55)}doc.roundedRect(x,y,w,h,r,r,b?'FD':'F')};
 const rule=(x,y,x2,y2,c=line,width=.65)=>{stroke(c);doc.setLineWidth(width);doc.line(x,y,x2,y2)};
 function textBox(value,x,y,w,h,{size=14,bold=false,color=ink,align='left'}={}){let font=size,lines;doc.setFont('helvetica',bold?'bold':'normal');do{doc.setFontSize(font);lines=doc.splitTextToSize(String(value),w);if(lines.length*font*.43<=h||font<=8)break;font-=.4}while(true);doc.setTextColor(...color);doc.text(lines,align==='center'?x+w/2:x,y+font*.353,{align,lineHeightFactor:1.18});return lines.length*font*.43}
 function card(br,i,x,y,w,h){rect(x,y,w,h,white,line,4);fill(red);doc.rect(x,y+5,2.5,h-10,'F');textBox(br[0],x+9,y+8,w-18,17,{size:15,bold:true,color:dark});textBox(br[1],x+9,y+29,w-18,h-33,{size:12.7,color:ink})}
 function root(x,y,w,h){rect(x,y,w,h,red,null,7);textBox('TEMA CENTRAL',x+5,y+8,w-10,9,{size:9,bold:true,color:white,align:'center'});textBox(a.title,x+8,y+21,w-16,h-25,{size:19,bold:true,color:white,align:'center'})}
 fill(paper);doc.rect(0,0,W,H,'F');fill(dark);doc.rect(0,0,W,5,'F');
 textBox('PORTAL DA HISTÓRIA  /  '+(context.year||'')+'º ANO',15,13,220,10,{size:11,bold:true,color:red});textBox((context.title||'História').toUpperCase(),15,26,300,16,{size:26,bold:true,color:ink});textBox(a.subtitle,15,45,325,10,{size:12,color:muted});
 rect(342,16,63,16,pink,null,3);textBox(pdfModels[style],344,20,59,11,{size:11,bold:true,color:dark,align:'center'});rule(15,59,405,59,line);
 const n=a.branches.length;
 if(style===0){
  // Original: a central concept, with individual branches distributed on both sides.
  const left=Math.ceil(n/2),right=n-left,cardW=127,cardH=65,gap=6,top=66,center=[160,133,100,53];
  const locations=a.branches.map((_,i)=>{const side=i<left?0:1,j=side?i-left:i,total=side?right:left;return [side?278:15,top+(3-total)*(cardH+gap)/2+j*(cardH+gap)]});
  locations.forEach(([x,y])=>{const end=x<200?x+cardW:x;rule(210,159,end,y+cardH/2,[181,81,88],1.1)});root(...center);locations.forEach(([x,y],i)=>card(a.branches[i],i,x,y,cardW,cardH));
 }else if(style===1){
  // Atlas: editorial grid, with a wide banner and numbered thematic entries.
  rect(15,68,390,27,red,null,4);textBox(a.title,24,75,372,16,{size:19,bold:true,color:white,align:'center'});
  const columns=3,rows=Math.ceil(n/columns),gap=7,cw=(390-2*gap)/3,ch=(169-(rows-1)*gap)/rows;
  a.branches.forEach((br,i)=>{const col=i%columns,row=Math.floor(i/columns),x=15+col*(cw+gap),y=103+row*(ch+gap);rect(x,y,cw,ch,white,line,4);fill(pink);doc.roundedRect(x+7,y+7,18,15,3,3,'F');textBox(String(i+1).padStart(2,'0'),x+7,y+10,18,10,{size:12,bold:true,color:dark,align:'center'});textBox(br[0],x+30,y+8,cw-38,18,{size:14,bold:true,color:dark});rule(x+8,y+28,x+cw-8,y+28,line);textBox(br[1],x+9,y+35,cw-18,ch-40,{size:12.5})});
 }else if(style===2){
  // Tree: horizontal hierarchy, a single trunk leading to aligned concept rows.
  const start=67,end=272,gap=5,rowH=(end-start-(n-1)*gap)/n,rx=15,rw=87,trunk=116,cardX=132,cardW=273;root(rx,145,rw,55);rule(rx+rw,172.5,trunk,172.5,red,1.6);rule(trunk,start+rowH/2,trunk,end-rowH/2,red,1.6);
  a.branches.forEach((br,i)=>{const y=start+i*(rowH+gap);rule(trunk,y+rowH/2,cardX,y+rowH/2,red,1.2);rect(cardX,y,cardW,rowH,white,line,3);rect(cardX+3,y+3,88,rowH-6,pink,null,3);textBox(br[0],cardX+10,y+7,74,rowH-12,{size:13.3,bold:true,color:dark});textBox(br[1],cardX+101,y+6,cardW-109,rowH-10,{size:12.5})});
 }else{
  // A colourful illustrated expedition: hand-drawn historical motifs and natural-looking coloured branches.
  const palette=[{dark:[167,59,43],light:[255,231,211]},{dark:[38,111,122],light:[218,243,241]},{dark:[112,75,151],light:[239,226,252]},{dark:[171,116,29],light:[255,240,195]},{dark:[67,123,72],light:[225,244,217]},{dark:[54,103,168],light:[224,236,255]}];
  const left=Math.ceil(n/2),right=n-left,w=127,h=66,gap=6,top=65;
  const loc=a.branches.map((_,i)=>{const side=i<left?0:1,j=side?i-left:i,total=side?right:left;return [side?278:15,top+(3-total)*(h+gap)/2+j*(h+gap)]});
  loc.forEach(([x,y],i)=>{const p=palette[i%6],end=x<200?x+w:x,mid=x<200?153:267;rule(210,167,mid,y+h/2,p.dark,2.5);rule(mid,y+h/2,end,y+h/2,p.dark,2.5)});
  rect(157,111,106,116,[255,249,230],[203,140,57],9);drawRomanIllustration(doc,a.icon,165,120,90,65);textBox(a.title,163,190,94,31,{size:20,bold:true,color:dark,align:'center'});
  loc.forEach(([x,y],i)=>{const br=a.branches[i],p=palette[i%6];rect(x,y,w,h,p.light,p.dark,7);rect(x+4,y+4,w-8,17,p.dark,null,4);textBox(br[0],x+9,y+7,w-18,12,{size:14,bold:true,color:white});drawRomanIllustration(doc,illustrationForConcept(br[0],a.icon),x+7,y+26,29,30);textBox(br[1],x+41,y+25,w-48,h-29,{size:12,color:ink})});
 }
 rule(15,283,405,283,line);textBox('PROFESSOR GABRIEL GOMES  ·  MATERIAL DE ESTUDO',15,286,315,8,{size:9,color:muted});textBox('CAPÍTULO '+(context.chapter||''),351,286,54,8,{size:9,bold:true,color:red,align:'center'});
}
const old=map.querySelectorAll('.mind-models,#mind-pdf,.roman-pdf-styles,.map-export-controls,.roman-pdf-preview,button[onclick*="printMind"]');old.forEach(el=>el.style.setProperty('display','none','important'));
const romanLayout=map.querySelector('.rome-mind-left');const controls=document.createElement('div');controls.className=romanLayout?'roman-pdf-styles':'portal-export';const label=document.createElement('strong');label.textContent='Modelo do mapa:';const select=document.createElement('select');select.setAttribute('aria-label','Ramo para exportar');branches.forEach((b,i)=>{const o=document.createElement('option');o.value=i;o.textContent=b.title;select.append(o)});if(!romanLayout)controls.append(select);controls.append(label);if(romanLayout)select.value=String(window.portalMapSelection||0);let style=0,url=null,loading=null;const buttons=pdfModels.map((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('aria-pressed',String(i===0));b.onclick=()=>{style=i;buttons.forEach((x,j)=>x.setAttribute('aria-pressed',String(i===j)));render(true)};controls.append(b);return b});const save=document.createElement('button');save.className='save';save.textContent='Salvar ramo em PDF';save.onclick=()=>render(false);if(!romanLayout)controls.append(save);const close=document.createElement('button');close.textContent='Fechar prévia';close.hidden=true;controls.append(close);const preview=document.createElement('iframe');preview.className='portal-preview';preview.title='Prévia do mapa mental';preview.hidden=true;if(romanLayout){const exportBox=document.createElement('div');exportBox.className='map-export-controls';const hint=document.createElement('small');hint.textContent='Escolha um estilo e visualize antes de salvar. O conteúdo histórico permanece o mesmo.';exportBox.append(save,hint);const previewBox=document.createElement('div');previewBox.className='roman-pdf-preview';previewBox.append(preview);previewBox.hidden=true;romanLayout.append(exportBox,controls,previewBox);new MutationObserver(()=>previewBox.hidden=preview.hidden).observe(preview,{attributes:true,attributeFilter:['hidden']})}else map.append(controls,preview);close.onclick=()=>{preview.hidden=true;close.hidden=true;preview.removeAttribute('src');if(url)URL.revokeObjectURL(url);url=null};
function loadPDF(){if(window.jspdf)return Promise.resolve();return loading||(loading=new Promise((ok,fail)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=ok;s.onerror=()=>{loading=null;fail(Error('PDF indisponível'))};document.head.append(s)}))}
async function render(see){save.disabled=true;try{await loadPDF();const doc=new window.jspdf.jsPDF({orientation:'landscape',unit:'mm',format:'a3'});const a=branches[Number(select.value)||0];a.icon=illustrationForConcept(a.title,'book');for(let i=0;i<a.branches.length;i+=6){if(i)doc.addPage();drawPortalMapPDF(doc,{...a,branches:a.branches.slice(i,i+6)},style)}if(see){const next=URL.createObjectURL(doc.output('blob'));preview.hidden=false;close.hidden=false;preview.src=next;if(url)URL.revokeObjectURL(url);url=next}else doc.save('mapa-'+context.year+'-'+context.chapter+'-'+(Number(select.value)+1)+'-modelo-'+style+'.pdf')}catch(err){alert('Não foi possível gerar o PDF. Verifique sua conexão e tente novamente.')}finally{save.disabled=false}}
window.addEventListener('portal-map-selection',()=>{select.value=String(window.portalMapSelection||0);if(!preview.hidden)render(true)});select.onchange=()=>{if(!preview.hidden)render(true)};map.addEventListener('click',e=>{const button=e.target.closest('.mind-node,.branch,.mind-branch,[data-branch]');if(button){const group=button.parentElement;const i=[...group.children].indexOf(button);if(i>=0&&i<branches.length){select.value=String(i);if(!preview.hidden)render(true)}}});
})();
