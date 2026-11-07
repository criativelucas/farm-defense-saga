// ---------- gamepad: buttons become the same keys the keyboard uses
// A pula · B golpe · X pisão · Y habilidade · LB/RB/LT/RT cartas 1-4 · Select chama a onda · Start pausa · direcional/analógico anda
const PADMAP={0:'ArrowUp',1:'KeyX',2:'ArrowDown',3:'KeyC',4:'Digit1',5:'Digit2',6:'Digit3',7:'Digit4',8:'Enter',9:'Escape',12:'ArrowUp',13:'ArrowDown',14:'ArrowLeft',15:'ArrowRight'};
let padPrev={},padOff=false;
// some embeds forbid gamepad access and throw; then we simply stop asking
function pollPad(){if(padOff)return;let gp=null;try{gp=navigator.getGamepads&&[...navigator.getGamepads()].find(Boolean)}catch(e){padOff=true;return}if(!gp){if(Object.keys(padPrev).length){for(const k in padPrev)keys.delete(k);padPrev={}}return}
  const down={};gp.buttons.forEach((b,i)=>{if(b.pressed&&PADMAP[i])down[PADMAP[i]]=1});const ax=gp.axes[0]||0;if(ax<-.4)down.ArrowLeft=1;if(ax>.4)down.ArrowRight=1;
  for(const k of new Set([...Object.keys(down),...Object.keys(padPrev)])){if(down[k]&&!padPrev[k]){keys.add(k);hit.add(k);initAudio()}if(!down[k]&&padPrev[k])keys.delete(k)}
  padPrev=down}
addEventListener('gamepadconnected',()=>toast('Controle conectado','A pula · B golpe · X pisão · Y habilidade · gatilhos jogam cartas'));

// ---------- save file: export and import progress as a small JSON file
const SAVE_KEYS=['fds-meta','jardim-do-fruto-celeiro','fds-cfg'];
function exportSave(){const data={game:'farm-defense-saga',v:1,at:new Date().toISOString()};SAVE_KEYS.forEach(k=>data[k]=store.get(k,null));
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));a.download='farm-defense-saga-progresso.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function importSave(file){const fr=new FileReader();fr.onload=()=>{try{const d=JSON.parse(fr.result);if(d.game!=='farm-defense-saga')throw 0;SAVE_KEYS.forEach(k=>{if(d[k]!=null)store.set(k,d[k])});location.reload()}
  catch(e){toast('Arquivo inválido','Escolha um progresso salvo pelo jogo')}};fr.readAsText(file)}

// ---------- the gardener walks between islands on the world map
const walker={x:null,y:null,anim:0,face:1};
function drawWalker(g){if(selWorld==null)return;const w=WORLDS[selWorld],tx=w.x,ty=w.y-8;if(walker.x==null){walker.x=tx;walker.y=ty}
  const dx=tx-walker.x,dy=ty-walker.y,d=Math.hypot(dx,dy),moving=d>1;if(moving){const st=Math.min(d,3.2);walker.x+=dx/d*st;walker.y+=dy/d*st;walker.anim+=.5;walker.face=dx<0?-1:1}
  const sp=drawWalker.c||(drawWalker.c=mkHD(24,30,2)),sg=sp.getContext('2d');sg.clearRect(0,0,24,30);const keep=C,kr=RUN;C=sg;RUN={char:META.char};
  drawGardener({face:walker.face,x:12,y:28-(moving?Math.abs(Math.sin(walker.anim*.8))*1.5:0),vx:moving?40:0,vy:0,on:true,sq:1,anim:walker.anim,slam:false,stun:0,inv:0,faint:0,swing:0});
  C=keep;RUN=kr;g.globalAlpha=.35;g.fillStyle='#000';g.fillRect(Math.round(walker.x-5),Math.round(walker.y),10,2);g.globalAlpha=1;g.imageSmoothingEnabled=false;g.drawImage(sp,Math.round(walker.x-12),Math.round(walker.y-28),24,30)}

// ---------- installable app (works offline once loaded)
if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.hostname))navigator.serviceWorker.register('sw.js').catch(()=>{});
