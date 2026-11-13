// ---------- cards drawn as pixel art, after collectible card games: a pale rim and dark frame, the cost in a tab
// and the name in a bar on top, a big painted window with the subject, a rarity seal and the collection number
// on its edges, fruit marks under it, then stat bars for trees or a short rule for the rest
const CARD_W=120,CARD_H=168,MINI_W=72,MINI_H=100,CK=3;// drawn at 3x so text and art stay sharp
const RAR={comum:{name:'Comum',c:'#d4d8e0',d:'#5a6070',sym:'●'},rara:{name:'Rara',c:'#5ab8ff',d:'#14407a',sym:'◆'},epica:{name:'Épica',c:'#c47aff',d:'#40146e',sym:'▲'},lendaria:{name:'Lendária',c:'#ffd040',d:'#7a4a06',sym:'★'}};
const RAR_ORDER=['comum','rara','epica','lendaria'];
const RARITY={videira:'comum',roma:'comum',oliveira:'comum',lirio:'comum',mana:'comum',profecia:'comum',joio:'comum',
  figueira:'rara',tamareira:'rara',mostarda:'rara',talentos:'rara',chuva:'rara',amendoeira:'epica',sarca:'epica',semeador:'epica',jerico:'lendaria',
  vento:'comum',uncao:'rara',nuvem:'epica',estrela:'lendaria',
  paz:'comum',pedra:'comum',luz:'rara',fermento:'rara',hissopo:'rara',fogo:'epica',cedro:'epica',ovelha:'lendaria'};
// the expansion's twenty cards: all of them can come out of packs
Object.assign(RARITY,{macieira:'comum',murta:'comum',salgueiro:'rara',acacia:'rara',sicomoro:'epica',nogueira:'epica',
  orvalho:'comum',jubileu:'comum',espada:'comum',sal:'rara',codornizes:'rara',escudo:'rara',harpa:'epica',linguas:'epica',arcoiris:'lendaria',
  tesouro:'comum',rede:'rara',virgens:'rara',prodigo:'epica',vinha:'lendaria'});
Object.assign(ICONS,{
  orvalho(){r(4,26,24,4,'#3a8a3a');r(4,26,24,1,'#6ac060');for(const[a,b]of[[8,6],[16,10],[24,4],[12,16],[22,15]]){r(a,b,2,3,'#bfe8ff');r(a,b,1,1,'#ffffff');r(a,b+3,2,1,'#7ac0f0')}disc(16,22,3,'#bfe8ff');r(15,20,1,1,'#ffffff')},
  sal(){for(let j=0;j<10;j++){const w=2+j*1.3;r(16-w,18+j,w*2,1,j%2?'#f4f4ff':'#d8d8e8')}r(14,10,4,6,'#c8c8d8');r(14,10,4,1,'#ffffff');for(let i=0;i<6;i++)r(6+i*4,6+(i%3)*2,1,1,'#ffffff')},
  escudo(){for(let j=0;j<22;j++){const w=j<12?11:11-(j-12)*1.1;r(16-w,5+j,w*2,1,'#c89a28')}for(let j=2;j<20;j++){const w=j<12?9:9-(j-12)*1.1;r(16-w,5+j,w*2,1,'#2a5bd7')}r(15,9,2,14,'#ffe08a');r(10,13,12,2,'#ffe08a')},
  espada(){for(let i=0;i<18;i++){r(8+i,22-i,2,2,'#d8d8e8');r(8+i,22-i,1,1,'#ffffff')}r(4,20,9,2,'#c89a28');r(7,17,2,9,'#c89a28');r(3,26,3,3,'#8a5a2a')},
  jubileu(){for(let i=0;i<16;i++)r(5+i,22-Math.sin(i/5)*8,3,2+(i/6|0),'#d9b07a');r(22,8,5,5,'#e8c890');for(let i=0;i<4;i++)r(8+i*5,27,3,2,i%2?'#9a9aa8':'#c8c8d0')},
  linguas(){for(let i=0;i<4;i++){const x0=4+i*7;disc(x0+2,26,3,'#e8b08a');r(x0+1,16,3,6,'#ff6a1a');r(x0+2,13,1,5,'#ffd34a');r(x0+2,19,1,2,'#fff6c0')}},
  arcoiris(){['#e0284a','#ff9a3c','#f7d050','#5fe08a','#5ab8ff','#9b5ae0'].forEach((c,i)=>{const R=14-i*1.6;for(let a=0;a<=30;a++){const an=Math.PI*(1-a/30);r(16+Math.cos(an)*R,26-Math.sin(an)*R,2,2,c)}});r(2,27,28,3,'#5fae4a')},
  codornizes(){for(const[a,b]of[[4,16],[16,9]]){blob(a+5,b+5,5,3,'#6a4a2a','#a07a4a','#d8b080',a);r(a+9,b+1,3,3,'#a07a4a');r(a+10,b+2,1,1,'#1a0c10');r(a+12,b+3,2,1,'#e0a040')}r(4,28,24,2,'#d9a050')},
  harpa(){r(8,4,3,24,'#c89a28');r(8,4,16,3,'#c89a28');for(let j=0;j<20;j++)r(24-j*.4,6+j,2,1,'#c89a28');for(let i=0;i<5;i++)r(12+i*2.4,7,1,18-i*3,'#fff6c0');r(6,27,8,2,'#8a5a2a')},
  tesouro(){r(6,14,20,12,'#8a5a2a');r(6,14,20,2,'#b07a40');r(5,10,22,5,'#a06a30');r(5,10,22,1,'#c89a50');r(15,15,3,4,'#f7c948');for(const[a,b]of[[9,8],[13,7],[19,8],[22,9]])disc(a,b,2,'#f7c948');r(4,26,24,4,'#6a4a2a')},
  rede(){for(let i=0;i<6;i++){r(4+i*5,6,1,22,'#c8b090');r(4,6+i*4,26,1,'#c8b090')}blob(16,18,5,3,'#4a7aa8','#7ab0e0','#c8e8ff',5);r(21,17,3,3,'#4a7aa8')},
  virgens(){r(6,20,18,6,'#c9a24a');r(6,20,18,1,'#ffe08a');r(23,18,5,3,'#c9a24a');r(4,24,4,2,'#c9a24a');r(25,12,3,6,'#ff9a3c');r(26,10,1,4,'#ffe36a');for(let i=0;i<5;i++)r(4+i*6,4+(i%2)*3,1,1,'#fff6c0')},
  prodigo(){for(let j=0;j<8;j++)r(12-j,8+j,j*2+1,1,'#a0603a');r(5,16,15,12,'#d8b080');r(10,20,4,8,'#5a3a2a');disc(24,14,2,'#e8b08a');r(23,16,3,7,'#c8a0d8');r(22,23,2,4,'#5a4030');r(25,23,2,4,'#5a4030');r(3,28,26,2,'#5fae4a')},
  vinha(){for(let i=0;i<4;i++){r(4+i*7,10,2,18,'#8a5236');blob(5+i*7,10,4,3,'#1a5c36','#2e9c48','#78dc5a',i);r(4+i*7,14,3,3,'#7b2fbf')}disc(25,25,3,'#f7c948');r(24,24,1,1,'#fff6c0');r(2,28,28,2,'#6a4a2a')}
});
// art for the cards found only in packs, on the 32x32 icon grid
Object.assign(ICONS,{
  vento(){for(let i=0;i<5;i++){const y0=6+i*5;for(let x0=2+i%2*3;x0<28;x0+=1)r(x0,y0+Math.sin(x0*.35+i)*1.5,1,1,i%2?'#e8f4ff':'#b8d8f0')}for(let i=0;i<4;i++)r(20+i*2,8+i*6,2,1,'#7ac050')},
  uncao(){r(10,10,12,16,'#c8a040');r(10,10,12,2,'#f0d070');r(12,6,8,5,'#a07a28');r(14,3,4,4,'#7a4a2a');r(12,13,4,10,'#e8c860');for(let i=0;i<4;i++)r(23+i,22+i*2,2,2,'#ffe08a');disc(26,29,2,'#ffe08a')},
  nuvem(){blob(16,9,12,6,'#c8d0e0','#e8eef8','#ffffff',4);for(let j=12;j<30;j++){const w2=10-(j-12)*.35;r(16-w2/2,j,w2,1,j%3?'#e8eef8':'#c8d0e0')}},
  luz(){r(14,22,4,8,'#8a5a2a');r(10,29,12,2,'#5a3a18');r(12,18,8,4,'#c89a28');r(12,18,8,1,'#ffe08a');r(15,12,2,6,'#fff6c0');r(15,10,2,2,'#ffd34a');
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;r(16+Math.cos(a)*9,13+Math.sin(a)*8,2,1,'#fff6c0')}},
  paz(){r(6,14,14,6,'#f4f4ff');r(18,12,5,5,'#f4f4ff');r(21,13,1,1,'#111');r(23,14,3,1,'#e0a040');r(4,10,9,4,'#d8d8f0');r(8,8,6,3,'#e8e8ff');
    r(24,15,6,1,'#5a8a3a');r(27,13,2,2,'#7ab050');r(29,16,2,2,'#7ab050')},
  fogo(){for(let i=0;i<7;i++){const x0=3+i*4,h=10+(i%3)*5;r(x0,30-h,4,h,'#e0402a');r(x0+1,30-h+3,2,h-3,'#ffa040');r(x0+1,30-4,2,4,'#ffe36a')}r(2,29,28,2,'#5a1a0a')},
  pedra(){r(7,12,18,16,'#6a6a78');r(7,12,18,3,'#a8a8b8');r(22,12,3,16,'#4a4a58');r(9,17,7,1,'#4a4a58');r(13,22,9,1,'#4a4a58');r(10,9,12,3,'#8a8a98');r(10,9,12,1,'#c8c8d8')},
  fermento(){r(6,20,20,8,'#b07a40');r(6,20,20,2,'#e0b070');r(4,19,24,2,'#7a4a24');blob(16,15,10,6,'#e8d0a0','#f8e8c8','#ffffff',7);for(let i=0;i<4;i++)r(10+i*4,12-(i%2)*2,1,1,'#d8b070')},
  ovelha(){blob(15,17,9,6,'#d8d8d0','#f4f4ec','#ffffff',3);r(22,13,6,6,'#2a2a2a');r(25,14,1,1,'#ffffff');r(21,13,2,2,'#2a2a2a');for(const lx of[9,13,17,20])r(lx,22,2,6,'#2a2a2a');r(4,8,2,22,'#8a5a2a');r(4,8,6,2,'#8a5a2a');r(9,8,2,4,'#8a5a2a')},
  estrela(){const c='#ffe9a0';r(15,2,2,28,c);r(2,15,28,2,c);for(let i=0;i<9;i++){r(16-i,16-i,1,1,'#fff6c0');r(15+i,16-i,1,1,'#fff6c0');r(16-i,15+i,1,1,'#fff6c0');r(15+i,15+i,1,1,'#fff6c0')}disc(16,16,4,'#ffd040');disc(15,15,2,'#ffffff')}});
const rarOf=c=>c.hyb?'epica':RARITY[c.k]||(CARDS[c.k]&&CARDS[c.k].own?'lendaria':'comum');
// the window's palette, dark to light: trees by their fruit, the rest by category
const THEME={Amor:['#3a0a1a','#7a1a2a','#c8402a','#f08a3a','#ffd08a'],Alegria:['#1a0a30','#3a1a6a','#6a3aa8','#b07ae0','#f0c8ff'],
  Paz:['#0e2418','#1e4a2a','#3a7a3a','#8ab860','#e0f0b0'],Paciência:['#0a2014','#16402a','#2a6a3a','#5aa04a','#c0e890'],
  Benignidade:['#2a1408','#6a3010','#b0601a','#f0a040','#ffe0a0'],Bondade:['#2a1028','#5a2050','#a04a80','#f08ab0','#ffe0f0'],
  Fé:['#20180a','#4a3a10','#8a7a20','#d8c040','#fff6b0'],Mansidão:['#0a1a3a','#1a3a6a','#3a6aa8','#7ab0e0','#e0f4ff'],
  Domínio:['#200808','#5a1408','#a8300a','#f0702a','#ffd060'],
  bencao:['#1e1438','#4a2a6a','#a0602a','#f0b040','#fff0b0'],parabola:['#0e2a34','#1e5a5a','#3a8a7a','#8ac0a0','#e8f0c8'],
  propria:['#2a1030','#5a2058','#a0407a','#e07a8a','#ffd0b0'],hissopo:['#14203a','#2a3a6a','#5a6ab0','#a0a8e8','#e8ecff'],cedro:['#0e1a14','#1e3a2a','#3a6a4a','#7aa070','#d8e8c0'],joio:['#14140a','#2a2a14','#4a4a22','#6a6a30','#9a9a50'],hibrida:['#1a2a40','#3a3a7a','#7a4aa0','#5ab08a','#d0f0b0']};
// tree bars: damage, range, rhythm, 1 to 5
const RATE={macieira:[3,3,3],sicomoro:[3,5,3],salgueiro:[1,3,1],acacia:[3,1,3],murta:[1,3,4],nogueira:[5,3,2],hissopo:[2,2,2],cedro:[4,5,2],videira:[2,4,4],roma:[5,1,1],oliveira:[1,4,3],sarca:[3,2,5],figueira:[4,5,1],tamareira:[1,3,3],amendoeira:[2,3,4],lirio:[1,3,1],mostarda:[3,5,2]};
const BARS=[['dmg','#f0b030'],['rng','#e85a50'],['cd','#3ab8b0']];
const cardNo=k=>String(Object.keys(CARDS).indexOf(k)+1).padStart(3,'0');
const themeOf=(c,I,cat)=>THEME[c.k]||THEME[c.hyb?'hibrida':I.kinds?I.fruits[0]:cat]||THEME.parabola;
const rateOf=c=>c.hyb?[0,1,2].map(i=>Math.max(1,Math.round((RATE[c.hyb[0]][i]+RATE[c.hyb[1]][i])/2))):RATE[c.k]||[1,1,1];
const CINK='#140e0c',COUT='#1e1614';

function wrapLines(g,text,maxW,maxLines){const words=text.split(' '),out=[];let line='';
  for(const w of words){const t=line?line+' '+w:w;if(g.measureText(t).width>maxW&&line){out.push(line);line=w;if(out.length===maxLines)break}else line=t}
  if(out.length<maxLines&&line)out.push(line);if(out.length===maxLines&&words.join(' ').length>out.join(' ').length)out[maxLines-1]=out[maxLines-1].replace(/.{2}$/,'…');return out}
function pxText(g,t,x,y,font,col,shadow,align='center'){g.font=font;g.textAlign=align;g.textBaseline='alphabetic';if(shadow){g.fillStyle=shadow;g.fillText(t,x+1,y+1)}g.fillStyle=col;g.fillText(t,x,y)}
// the biggest font up to size that fits the width
function fitFont(g,t,maxW,size){let s=size;for(;s>4;s-=.5){g.font=`700 ${s}px "Pixelify Sans", monospace`;if(g.measureText(t).width<=maxW)break}return g.font}
const SMALL_ICON={dmg:[[0,6],[1,5],[2,4],[3,3],[4,2],[5,1],[6,0],[1,6],[0,5]],rng:[[1,0],[2,0],[3,0],[0,1],[4,1],[0,2],[2,2],[4,2],[0,3],[4,3],[1,4],[2,4],[3,4]],cd:[[1,0],[2,0],[3,0],[0,1],[4,1],[0,2],[2,2],[3,2],[4,2],[0,3],[4,3],[1,4],[2,4],[3,4],[2,1]]};
function iconPx(g,k,x0,y0,c){g.fillStyle=c;SMALL_ICON[k].forEach(([a,b])=>g.fillRect(x0+a,y0+b,1,1))}
// a rectangle with stepped pixel corners
function rrect(x0,y0,w,h,rad,c){for(let i=0;i<rad;i++){const k=rad-i;r(x0+k,y0+i,w-2*k,1,c);r(x0+k,y0+h-1-i,w-2*k,1,c)}r(x0,y0+rad,w,h-2*rad,c)}
// pale worn rim, dark outline, the card's panel inside
function frameDraw(W,H,mini,gold,panel){const R=mini?[3,2,1]:[4,3,2],b=mini?3:4,L=gold?'#ffe08a':'#dccfb8',D=gold?'#c8902a':'#a8987e';
  rrect(0,0,W,H,R[0],COUT);rrect(1,1,W-2,H-2,R[1],D);rrect(1,1,W-3,H-3,R[1],L);
  for(let i=0;i<(mini?10:22);i++)r(2+hs(i,31)*(W-5),hs(i,37)<.5?1+hs(i,41)*2:H-3-hs(i,41)*1,1,1,gold?'#f0c050':'#c4b49a');
  rrect(b,b,W-2*b,H-2*b,R[2],COUT);rrect(b+1,b+1,W-2*b-2,H-2*b-2,R[2],panel)}
// the window: a dithered painting lit from behind the subject, big leafy shapes toward the edges, a floor at the bottom
function paintWindow(cv,w,h,P,seed){const B=layerBuf(cv,'#000000',0,1,0),{d,k}=B,R=P.map(u32);
  for(let Y=0;Y<B.h;Y++)for(let X=0;X<B.w;X++){const u=(X+.5)/k,v=(Y+.5)/k,nx=u/w-.5,ny=v/h-.45,
      glow=Math.max(0,1-Math.hypot(nx*1.25,ny*1.6)*1.7),n=fbm(u*.08,v*.08,seed),m=fbm(u*.2+9,v*.2,seed+5);
    let s=.2+glow*.6+(n-.5)*.3;
    if(n+(1-glow)*.3>.74)s-=.3;else if(m>.7&&glow<.6)s+=.14;
    const fl=h*.82+Math.sin(u*.21+seed)*1.4;
    if(v>fl)s=v<fl+1.2?.66:.34-(v-fl)/h*1.4+(m-.5)*.16;
    d[Y*B.w+X]=rp(R,s,X,Y,2.4)}
  putBuf(B)}
// the card's subject on a clear 48x48 buffer, standing at the bottom middle
function subjectBuf(c,I,cat){const b=mkHD(48,48,2),keep=C;C=b.getContext('2d');
  try{if(c.hyb){drawTower(c.hyb[0],16,46,1);drawTower(c.hyb[1],32,46,1)}
    else if(I.kinds)drawTower(c.k,24,46,1);
    else if(cat==='propria'){const kr=RUN;RUN={char:CARDS[c.k].own};try{drawGardener({face:-1,x:28,y:46,vx:0,vy:0,on:true,sq:1,anim:0,slam:false,stun:0,inv:0,faint:0,swing:0})}finally{RUN=kr}
      C.save();C.translate(1,19);C.scale(.62,.62);ICONS[c.k]&&ICONS[c.k]();C.restore()}
    else if(cat==='joio'){C.save();C.translate(24,46);C.scale(1.6,1.6);C.translate(-16,-30);drawJoio(16,30,0);C.restore()}
    else{C.save();C.translate(8,12);ICONS[c.k]?ICONS[c.k]():0;C.restore()}}
  finally{C=keep}return b}
// draw a sprite with a dark outline o units wide
function inked(g,src,x0,y0,w,h,ink,o){const s=mkCanvas(src.width,src.height),q=s.getContext('2d');q.drawImage(src,0,0);q.globalCompositeOperation='source-in';q.fillStyle=ink;q.fillRect(0,0,s.width,s.height);
  g.imageSmoothingEnabled=false;for(const[a,b]of[[-o,0],[o,0],[0,-o],[0,o]])g.drawImage(s,x0+a,y0+b,w,h);g.drawImage(src,x0,y0,w,h)}
// rarity seal: a dark ring around a colored gem with a glint; the legendary one wears a little crown
// rarity seal: a shape per rarity so it reads without color too (circle, diamond, triangle, star), dark rim, colored gem, a glint
function sealDraw(x0,y0,s,rk){const R=RAR[rk],u=s/8,cx=x0+4*u,cy=y0+4*u,
    half=(j,rad)=>{const a=Math.abs(j);if(rk==='comum')return Math.sqrt(Math.max(0,rad*rad-j*j));if(rk==='rara')return rad-a;if(rk==='epica')return Math.max(0,(j+rad)*.58);
      return Math.max(a<rad*.2?rad:0,rad*.62-a,a<rad?rad*.18:0)},
    shape=(rad,col,dy=0)=>{for(let j=-rad;j<rad;j+=u*.5){const w=half(j+u*.25,rad);if(w>0)r(cx-w,cy+dy+j,w*2,u*.5,col)}};
  shape(4.4*u,CINK);shape(3.5*u,R.d);shape(2.6*u,R.c,-.3*u);r(cx-1.2*u,cy-1.6*u,u,u,'#ffffff');
  if(rk==='lendaria'){r(cx-2.5*u,y0-2.4*u,5*u,1.6*u,CINK);r(cx-2*u,y0-2*u,4*u,u,R.c);for(const dx of[-2,0,1.6])r(cx+dx*u,y0-3.4*u,.8*u,1.4*u,R.c)}}
// the window with its painting, subject and seal, shared by both sizes
function windowDraw(g,c,I,cat,P,ax,ay,aw,ah,sc){
  const win=mkHD(aw,ah,1);paintWindow(win,aw,ah,P,(c.k||'x').length*7+(c.hyb?3:0));
  r(ax-1,ay-1,aw+2,ah+2,CINK);g.imageSmoothingEnabled=false;g.drawImage(win,ax,ay,aw,ah);
  g.save();g.beginPath();g.rect(ax,ay,aw,ah);g.clip();
  const fl=ay+ah*.82,cx=ax+aw/2;
  g.globalAlpha=.45;for(let i=0;i<3;i++)r(cx-aw*(.24-i*.05),fl+i,aw*(.48-i*.1),1,P[0]);g.globalAlpha=1;
  const sub=subjectBuf(c,I,cat),sw=48*sc;inked(g,sub,cx-sw/2,fl+2*sc-sw,sw,sw,COUT,Math.max(1,sc*.6));
  if(c.rare){for(let i=0;i<12;i++){const sx=ax+hs(i,7)*aw,sy=ay+hs(i,8)*ah*.8;r(sx,sy,1,1,'#fff6c0');r(sx-1,sy,3,1,'#f7c94877');r(sx,sy-1,1,3,'#f7c94877')}}
  g.restore();g.fillStyle='#ffffff1a';g.fillRect(ax,ay,aw,1)}
function fruitsDraw(I,cx,cy,s){const g=C,n=I.fruits.length,gap=s+4;I.fruits.forEach((f,i)=>{const fx=cx-(n-1)*gap/2+i*gap;disc(fx,cy,s/2+2,CINK);disc(fx,cy,s/2+1,'#2c2420');
  const e=mkHD(12,12,CK);embTo(e,f);C=g;g.drawImage(e,fx-s/2,cy-s/2,s,s)})}

const CARD_CACHE=new Map();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>CARD_CACHE.clear());
function cardCanvas(c,mini=false){
  const I=info(c),cat=catOf(c),lv=I.kinds?cardLv(I.key):0,key=[c.k,c.hyb&&c.hyb.join('+'),c.rare?1:0,c.plus?1:0,mini?1:0,lv].join('|');
  let src=CARD_CACHE.get(key);if(!src){const keep=C;try{src=mini?drawCardMini(c,I,cat):drawCardFull(c,I,cat,lv)}finally{C=keep}CARD_CACHE.set(key,src)}
  const out=mkHD(mini?MINI_W:CARD_W,mini?MINI_H:CARD_H,CK),g=out.getContext('2d');g.save();g.setTransform(1,0,0,1,0,0);g.drawImage(src,0,0);g.restore();return out}
function drawCardFull(c,I,cat,lv){
  const W=CARD_W,H=CARD_H,cv=mkHD(W,H,CK),g=cv.getContext('2d'),P=themeOf(c,I,cat),rk=rarOf(c),panel=mixHex('#26201c',P[1],.32);C=g;
  frameDraw(W,H,false,!!c.rare,panel);
  // cost tab and name bar
  rrect(6,6,17,15,2,CINK);pxText(g,String(I.cost),14.5,18,'700 13px "Pixelify Sans", monospace','#ffffff','#5a3a8a');
  rrect(24,7,90,13,1,'#2c2420');r(25,7,88,1,'#4a3e36');const name=I.name.replace(' ★','').toUpperCase();
  g.font=fitFont(g,name,84,9);pxText(g,name,69,17,g.font,c.rare?'#ffe08a':'#efe4d0','#000000');
  const ax=10,ay=23,aw=100,ah=72;windowDraw(g,c,I,cat,P,ax,ay,aw,ah,2);C=g;
  sealDraw(ax+aw-13,ay+3,10,rk);
  // collection number on a tab over the right edge; level dots over the left edge for trees
  if(!c.hyb&&CARDS[c.k]){rrect(107,ay+20,9,28,2,CINK);cardNo(c.k).split('').forEach((ch,i)=>pxText(g,ch,111.5,ay+28+i*8,'700 8px "Pixelify Sans", monospace','#c8bca8'))}
  if(I.kinds){rrect(4,ay+20,9,30,2,CINK);for(let i=0;i<4;i++){disc(8.5,ay+25+i*7,2,i<=lv?'#5ae0d0':'#2a3a3a');if(i<=lv)r(7.5,ay+24+i*7,1,1,'#d0fff8')}}
  if(c.plus){rrect(ax+2,ay+2,11,11,1,CINK);r(ax+3,ay+3,9,9,'#2a6ad8');pxText(g,'+',ax+7.5,ay+11.5,'700 11px "Pixelify Sans", monospace','#ffffff')}
  fruitsDraw(I,W/2,ay+ah,12);C=g;
  const ink='#efe4d0',dim='#b8a890';
  if(I.kinds){const rt=rateOf(c);
    BARS.forEach(([k,col],i)=>{const y=ay+ah+14+i*11;iconPx(g,k,9,y-5,col);pxText(g,String(rt[i]),22,y+2.5,'700 11px "Pixelify Sans", monospace',ink,'#000000');
      rrect(28,y-5,83,9,1,CINK);for(let s=0;s<5;s++){const sx=29.5+s*16.2,on=s<rt[i];r(sx,y-3.5,14.6,6,on?col:'#2c2420');if(on){r(sx,y-3.5,14.6,1,shade(col,.4));r(sx,y+1.5,14.6,1,shade(col,-.35))}}});
    g.font='8px "Pixelify Sans", monospace';wrapLines(g,I.short,W-22,2).forEach((ln,i)=>pxText(g,ln,W/2,ay+ah+51+i*9,'8px "Pixelify Sans", monospace',dim))}
  else{const own=CARDS[c.k]&&CARDS[c.k].own,ty=ay+ah+14;
    pxText(g,((own?'Carta de '+CHARS[own].name:CAT_LABEL[cat])).toUpperCase(),W/2,ty,'700 7px "Pixelify Sans", monospace',P[4],'#000000');
    rrect(9,ty+4,W-18,H-ty-13,2,shade(panel,-.35));g.font='9px "Pixelify Sans", monospace';
    wrapLines(g,I.short,W-26,4).forEach((ln,i)=>pxText(g,ln,W/2,ty+15+i*10,'9px "Pixelify Sans", monospace',ink,'#00000088'))}
  if(c.rare)pxText(g,'★',W-10,18,'10px "Pixelify Sans", monospace','#ffe08a','#000000');
  C=x;return cv}
function drawCardMini(c,I,cat){
  const W=MINI_W,H=MINI_H,cv=mkHD(W,H,CK),g=cv.getContext('2d'),P=themeOf(c,I,cat),rk=rarOf(c),panel=mixHex('#26201c',P[1],.32);C=g;
  frameDraw(W,H,true,!!c.rare,panel);
  rrect(4,4,13,12,2,CINK);pxText(g,String(I.cost),10.5,13.5,'700 10px "Pixelify Sans", monospace','#ffffff','#5a3a8a');
  rrect(18,5,50,10,1,'#2c2420');const name=I.name.replace(' ★','').toUpperCase();g.font=fitFont(g,name,46,7);pxText(g,name,43,12.5,g.font,c.rare?'#ffe08a':'#efe4d0','#000000');
  const ax=6,ay=18,aw=60,ah=46;windowDraw(g,c,I,cat,P,ax,ay,aw,ah,4/3);C=g;
  sealDraw(ax+aw-9,ay+2,7,rk);
  if(c.plus){r(ax+1,ay+1,8,8,CINK);r(ax+2,ay+2,6,6,'#2a6ad8');pxText(g,'+',ax+5,ay+8,'700 8px "Pixelify Sans", monospace','#ffffff')}
  fruitsDraw(I,W/2,ay+ah,9);C=g;
  if(I.kinds){const rt=rateOf(c);BARS.forEach(([k,col],i)=>{const y=ay+ah+10+i*7;rrect(8,y,56,6,1,CINK);for(let s=0;s<5;s++){const sx=9+s*10.8,on=s<rt[i];r(sx,y+1,9.8,4,on?col:'#2c2420');if(on)r(sx,y+1,9.8,1,shade(col,.4))}});
    const lv=cardLv(I.key);if(lv)pxText(g,'Nv'+(lv+1),W-6,H-5,'700 6px "Pixelify Sans", monospace','#5ae0d0','#000000','right')}
  else{const lab=(CAT_LABEL[cat]==='Carta de personagem'?'Personagem':CAT_LABEL[cat]||'').toUpperCase();rrect(8,ay+ah+11,56,13,2,shade(panel,-.4));
    g.font=fitFont(g,lab,50,8);pxText(g,lab,W/2,ay+ah+20.5,g.font,P[4],'#000000')}
  C=x;return cv}

// ---------- card markup for menus and the hand
function cardHTML(c,cls=''){const I=info(c),cat=catOf(c);
  return `<button type="button" class="card2 c-${cat}${c.rare?' rare':''}${c.plus?' plus':''} ${cls}" data-uid="${c.uid}" title="${c.locked?'Carta por descobrir':(I.name+': '+I.desc+(I.ref?' ('+I.ref+')':'')).replace(/"/g,'&quot;')}"><canvas width="${CARD_W*CK}" height="${CARD_H*CK}" data-card="${c.uid}"></canvas></button>`}
function paintCards(root,cards){root.querySelectorAll('canvas[data-card]').forEach(cv2=>{const card=cards.find(k=>String(k.uid)===cv2.dataset.card);if(card){const g=cv2.getContext('2d');g.clearRect(0,0,cv2.width,cv2.height);g.drawImage(card.locked?cardBack(false,true):cardCanvas(card),0,0)}})}
// the back: pale rim, a deep panel woven with small diamonds, the tree of life in a gold medallion; q swaps the tree for a question mark
function cardBack(mini,q){const W=mini?MINI_W:CARD_W,H=mini?MINI_H:CARD_H,c=mkHD(W,H,CK),g=c.getContext('2d'),keep=C;C=g;
  frameDraw(W,H,!!mini,false,'#2a1c3a');const b=mini?5:6,u=mini?.6:1,cx=W/2,cy=H/2;
  for(let y=b;y<H-b-2;y+=6)for(let xx=b+((y/6|0)%2)*3;xx<W-b-2;xx+=6){r(xx+1,y,1,1,'#3e2c5a');r(xx,y+1,3,1,'#3e2c5a');r(xx+1,y+2,1,1,'#3e2c5a')}
  for(let i=0;i<4;i++){const s=(mini?4:7)+i;r(b+1,b+1+i*2,s,1,'#c9a24a');r(W-b-1-s,b+1+i*2,s,1,'#c9a24a');r(b+1,H-b-2-i*2,s,1,'#c9a24a');r(W-b-1-s,H-b-2-i*2,s,1,'#c9a24a')}
  disc(cx,cy,26*u,CINK);disc(cx,cy,25*u,'#c9a24a');disc(cx,cy,23*u,'#8a5a1a');disc(cx,cy,21*u,'#1e1430');
  if(q){pxText(g,'?',cx,cy+12*u,`700 ${34*u}px "Pixelify Sans", monospace`,'#f7c948','#000000');if(!mini)pxText(g,'por descobrir',cx,H-12,'8px "Pixelify Sans", monospace','#c9a99a')}
  else{r(cx-2*u,cy-2*u,4*u,15*u,'#7a4a2e');r(cx-6*u,cy+11*u,12*u,2*u,'#7a4a2e');blob(cx,cy-6*u,15*u,11*u,'#2a7a3a','#5fc060','#b0f090',7);
    [[-8,-8],[6,-10],[-2,-14],[9,-3],[-10,-1],[2,-4]].forEach(([a,b2],i)=>r(cx+a*u,cy+b2*u,2*u,2*u,['#ff4f7b','#c58cff','#f7c948','#5af0ff','#ffa64a','#ff9ad0'][i]))}
  C=keep;return c}
function renderHand(){
  cardTip(null);
  const el=$('cards');el.innerHTML='';const n=S.hand.length,conf=S.babelOn>0;
  for(let j=0;j<n;j++){
    const i=conf&&S.perm[j]!=null?S.perm[j]:j,c=S.hand[i],b=document.createElement('button');b.type='button';
    b.style.setProperty('--rot',((j-(n-1)/2)*5)+'deg');b.style.setProperty('--lift',(Math.abs(j-(n-1)/2)*4)+'px');
    if(!c){b.className='hc2 empty';b.disabled=true;el.append(b);continue}
    const I=info(c);b.className='hc2 c-'+catOf(c)+(S.sel===i?' sel':'')+(conf?' garbled':'');
    b.innerHTML=`<canvas width="${MINI_W*CK}" height="${MINI_H*CK}"></canvas><span class="key">${j+1}</span>`;b.title=conf?'':I.name+': '+I.desc;
    const g=b.querySelector('canvas').getContext('2d');
    if(conf){g.scale(CK,CK);g.fillStyle='#3a1e4a';g.fillRect(0,0,MINI_W,MINI_H);pxText(g,garble('????'),MINI_W/2,MINI_H/2,'16px serif','#e0c0ff')}else g.drawImage(cardCanvas(c,true),0,0);
    b.addEventListener('pointerdown',e=>{cardTip(null);startDrag(e,i,b)});b.onmouseenter=()=>{if(!conf&&!drag)cardTip(c,b)};b.onmouseleave=()=>cardTip(null);
    b.addEventListener('click',e=>{e.currentTarget.blur();if(e.detail===0)onCardClick(i)});
    if(i===S.newIdx)b.classList.add('enter');el.append(b)}
  $('pilecount').textContent=S.draw.length;renderItems();
  const pv=$('nextc');pv.innerHTML='';const nx=S.draw[0];if(nx&&!conf){const m=cardCanvas(nx,true);pv.append(m);pv.title='Próxima: '+info(nx).name}
}

// hovering a card in hand shows it full size above the hand, where its rules are readable
function cardTip(c,btn){const el=$('cardtip');if(!c){el.hidden=true;return}el.innerHTML='';const cv2=cardCanvas(c);el.append(cv2);
  const st=$('stage').getBoundingClientRect(),b=btn.getBoundingClientRect();el.style.left=(b.left+b.width/2-st.left)/st.width*100+'%';el.style.bottom=(st.bottom-b.top+8)/st.height*100+'%';el.hidden=false}

// ---------- card packs from the market: buy one, tear it open, flip the cards one by one; rarer cards make a bigger show
const PACKS={
  semeador:{name:'Pacote do Semeador',short:'SEMEADOR',price:120,n:4,odds:[72,22,5,1],seeds:1,col:['#1e5a2a','#4faa4a','#b8f07a'],desc:'4 cartas, quase todas sementes.'},
  bencao:{name:'Pacote da Bênção',short:'BÊNÇÃO',price:300,n:5,odds:[55,30,12,3],min:1,col:['#7a3a08','#e8a020','#fff0a0'],desc:'5 cartas. Uma rara ou melhor garantida.'},
  arca:{name:'Pacote da Arca',short:'ARCA',price:700,n:5,odds:[30,38,24,8],min:2,col:['#2e1460','#8a4ad8','#e8c8ff'],desc:'5 cartas. Uma épica ou melhor garantida.'}};
const PACK_POOL=Object.keys(RARITY).filter(k=>k!=='joio');
Object.assign(SND,{rip:[260,2400,.2,'sawtooth',.05],flip:[760,380,.11,'triangle',.05],shine:[900,2600,.35,'sine',.05],legend:[196,1568,.9,'square',.045]});
const COPY_NEED=[2,3,4];// extra copies a tree card needs to reach level 2, 3 and 4
const DUP_COINS={comum:10,rara:25,epica:60,lendaria:150};
const anyOf=a=>a[Math.random()*a.length|0];
function rollPack(id){const P=PACKS[id],out=[];
  for(let i=0;i<P.n;i++){let ri=0,t=0;const roll=Math.random()*100;for(;ri<3;ri++){t+=P.odds[ri];if(roll<t)break}
    if(i===P.n-1&&P.min)ri=Math.max(ri,P.min);
    let pool=PACK_POOL.filter(k=>RARITY[k]===RAR_ORDER[ri]);
    if(P.seeds&&Math.random()<.75){const s=pool.filter(k=>CARDS[k].type==='semente');if(s.length)pool=s}
    out.push({k:anyOf(pool),rk:RAR_ORDER[ri],foil:Math.random()<(ri>=2?.15:.05)})}
  return out.sort((a,b)=>RAR_ORDER.indexOf(a.rk)-RAR_ORDER.indexOf(b.rk))}// the best card comes last
// a new card joins the collection; a copy of a tree counts toward its next level; other copies turn into coins; a foil copy consecrates the card
function grantCard(o){const k=o.k,tree=CARDS[k].type==='semente'||!!CARDS[k].plant;META.copies=META.copies||{};META.foil=META.foil||{};META.cardLv=META.cardLv||{};
  if(!META.unlocked.includes(k)){META.unlocked.push(k);META.seen.c[k]=1;o.st='nova'}
  else if(tree&&cardLv(k)<3){const need=COPY_NEED[cardLv(k)];META.copies[k]=(META.copies[k]||0)+1;
    if(META.copies[k]>=need){META.copies[k]-=need;META.cardLv[k]=cardLv(k)+1;o.st='nivel';o.lv=cardLv(k)}else{o.st='copia';o.have=META.copies[k];o.need=need}}
  else{o.st='moedas';o.coins=DUP_COINS[o.rk];META.coins+=o.coins}
  if(o.foil&&!META.foil[k])META.foil[k]=1;else o.foil=false;
  if(o.rk==='lendaria')unlockAch('perola');if(PACK_POOL.every(q=>META.unlocked.includes(q)))unlockAch('tesouros');return o}
// free packs: one Semeador a day, and a Bênção pack for the first win over each boss
const freePackToday=()=>META.freeDay!==todayKey();
const packGifts=()=>(freePackToday()?1:0)+(META.gifts||0);
// the pack itself, 48x64: a foil pouch with crimped ends, a tear line, a medallion and a ribbon with its name
function packDraw(id,label,back){const P=PACKS[id],[c0,c1,c2]=P.col;
  rrect(3,2,42,60,3,COUT);for(let y=3;y<61;y++){const t=(y-3)/58;r(4,y,40,1,t<.5?mixHex(c2,c1,t*2):mixHex(c1,c0,(t-.5)*2))}
  for(let y=3;y<61;y++){const sx=4+((y*.55+6)%40);r(sx,y,3,1,'#ffffff30');r(sx+5,y,1,1,'#ffffff22')}
  r(4,3,2,58,'#ffffff38');r(42,3,2,58,'#00000038');
  for(const y0 of[3,55]){r(4,y0,40,6,shade(c0,-.15));for(let i=4;i<44;i+=2)r(i,y0,1,6,shade(c0,-.4));r(4,y0+(y0<9?5:0),40,1,shade(c1,.3))}
  for(let i=4;i<44;i+=2)r(i,2,1,1,c0),r(i+1,61,1,1,c0);
  for(let i=6;i<42;i+=3)r(i,10.5,2,.5,'#ffffffaa');
  if(back){rrect(8,14,32,28,2,COUT);r(9,15,30,26,'#f4e6c4');r(9,15,30,2,'#fffbe8');for(let j=0;j<4;j++)r(12,20+j*4,(j%2?16:22),1,'#a88a5a');RAR_ORDER.forEach((rk,i)=>{disc(14+i*6.5,37,2,COUT);disc(14+i*6.5,37,1.4,RAR[rk].c)});
    rrect(6,45,36,9,2,COUT);r(7,46,34,7,shade(c0,-.3));for(let i=0;i<14;i++)r(9+i*2.2,47,(i%3?1:.5),5,'#fff3c0');return}
  disc(24,30,13,COUT);disc(24,30,12,c0);disc(24,30,10.5,shade(c2,.2));disc(24,29,9,c2);
  if(id==='semeador'){r(23,27,2,10,'#6a3a1a');blob(19,27,6,3,'#1e6a2a','#4faa4a','#a8f07a',3);blob(29,24,6,3,'#1e6a2a','#4faa4a','#a8f07a',5);for(let i=0;i<5;i++)r(16+i*4,37+(i%2),2,2,'#c88a3a')}
  if(id==='bencao'){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;r(24+Math.cos(a)*8-1,29+Math.sin(a)*8-1,2,2,'#fff6c0')}disc(24,29,5,'#ffd040');disc(23,28,3,'#fff6c0')}
  if(id==='arca'){r(15,31,18,4,'#7a4a2a');r(16,35,16,2,'#5a3018');r(19,26,10,5,'#a06a3a');r(18,25,12,1,'#5a3018');r(22,28,2,2,'#2a1408');r(29,19,4,2,'#ffffff');r(31,18,2,1,'#ffffff');r(27,20,2,1,'#ffffff');for(let i=0;i<4;i++)r(14+i*6,38,4,1,'#5ab8ff')}
  rrect(6,45,36,9,2,COUT);r(7,46,34,7,shade(c0,-.3));r(7,46,34,1,c1);
  if(label)pxText(C,P.short,24,52,'700 6px "Pixelify Sans", monospace','#fff3c0','#000000');
  [[8,14],[38,40],[12,42],[36,13]].forEach(([a,b])=>{r(a,b,1,1,'#ffffff');r(a-1,b,3,1,'#ffffff66');r(a,b-1,1,3,'#ffffff66')})}
function packTag(o){const f=o.foil?'<b class="t-foil">★ Consagrada</b>':'';
  if(o.st==='nova')return'<b class="t-new">NOVA!</b>'+f;
  if(o.st==='nivel')return`<b class="t-lv">NÍVEL ${o.lv+1}!</b>`+f;
  if(o.st==='copia')return`<span class="t-cp">+1 cópia</span><i class="cbar"><u style="width:${Math.round(o.have/o.need*100)}%"></u></i><small>${o.have}/${o.need} para o nível ${cardLv(o.k)+2}</small>`+f;
  return`<span class="t-coin">+${o.coins} moedas</span>`+f}
// the opening: the pack drops in and bobs; a tap shakes it and tears the top off; the cards deal out face down,
// the rarer ones glowing; each tap flips one, with sparks, a flash and rays that grow with its rarity
function openPack(id,onClose){
  const P=PACKS[id],got=rollPack(id).map(grantCard);saveMeta();
  const ov=document.createElement('div');ov.id='packov';ov.className='packov';
  ov.innerHTML=`<div class="prays"></div><canvas class="pfx"></canvas><div class="ptitle">${P.name}</div>
    <div class="ppack">${pack3dHTML(id)}</div><div class="prow"></div>
    <div class="phint">Toque no pacote para abrir</div>
    <div class="pbtns"><button type="button" class="btn ghost" id="pall" hidden>Virar todas</button><button type="button" class="btn" id="pagain" hidden></button><button type="button" class="btn ghost" id="pclose">Fechar</button></div>`;
  $('stage').append(ov);
  paintPack3d(ov);
  // chunky sparks on a canvas over everything
  const fx=ov.querySelector('.pfx'),fg=fx.getContext('2d'),parts=[];let alive=true,last=performance.now();
  const fit=()=>{fx.width=ov.clientWidth;fx.height=ov.clientHeight};fit();
  const at=el=>{const a=el.getBoundingClientRect(),b=ov.getBoundingClientRect();return[a.left+a.width/2-b.left,a.top+a.height/2-b.top]};
  const burst=(x0,y0,n,cols,sp)=>{const u=fx.width/400;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(60+Math.random()*220)*sp*u;
    parts.push({x:x0,y:y0,vx:Math.cos(a)*v,vy:Math.sin(a)*v-90*sp*u,g:420*u,life:.6+Math.random()*.9,t:0,c:cols[i%cols.length],s:Math.max(2,(2+Math.random()*4)*u|0)})}};
  const loop=now=>{if(!alive)return;const dt=Math.min(.05,(now-last)/1000);last=now;fg.clearRect(0,0,fx.width,fx.height);
    for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt;if(p.t>p.life){parts.splice(i,1);continue}p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.985;
      fg.globalAlpha=Math.min(1,(p.life-p.t)*3);fg.fillStyle=p.c;fg.fillRect(p.x|0,p.y|0,p.s,p.s)}
    fg.globalAlpha=1;requestAnimationFrame(loop)};requestAnimationFrame(loop);
  const flash=cls=>{ov.classList.remove('flash','fl-epica','fl-lendaria');void ov.offsetWidth;ov.classList.add('flash');if(cls)ov.classList.add(cls)};
  const row=ov.querySelector('.prow'),flipped=new Set();let opened=false;
  got.forEach((o,i)=>{const el=document.createElement('div');el.className='pcard r-'+o.rk+(o.foil?' foil':'');el.style.setProperty('--i',i);
    el.innerHTML=`<div class="pin"><div class="pf pback"></div><div class="pf pfront"></div></div><div class="prar">${RAR[o.rk].sym} ${RAR[o.rk].name}!</div><div class="ptag">${packTag(o)}</div>`;
    el.querySelector('.pback').append(cardBack());el.querySelector('.pfront').append(cardCanvas(mk(o.k,o.foil?{rare:true}:{})));
    el.onclick=()=>flip(i);row.append(el)});
  const done=()=>{if(!alive)return;$('pall').hidden=true;ov.querySelector('.phint').textContent=got.some(o=>o.st==='nova')?'Cartas novas entram na sua coleção':'Cópias sobem o nível das árvores';
    const again=$('pagain');again.hidden=META.coins<P.price;again.textContent='Abrir outro · '+P.price+' moedas';again.focus({preventScroll:true})};
  const flip=i=>{if(!alive||!opened||flipped.has(i))return;flipped.add(i);const el=row.children[i],o=got[i],ri=RAR_ORDER.indexOf(o.rk);
    const go=()=>{if(!alive)return;el.classList.remove('charge');el.classList.add('turned');
      setTimeout(()=>{if(!alive)return;const[cx,cy]=at(el),col=RAR[o.rk].c;el.classList.add('lit');burst(cx,cy,[12,26,46,80][ri],[col,'#ffffff',shade(col,.45),shade(col,-.2)],[.6,.85,1.15,1.5][ri]);
        if(ri>=2)flash('fl-'+o.rk);if(ri>=3){ov.classList.remove('quake');void ov.offsetWidth;ov.classList.add('quake');sfx('legend')}
        sfx('flip');sfx(['card','coin','shine','ach'][ri]);if(ri>=2)setTimeout(()=>sfx('shine'),120);if(o.foil)setTimeout(()=>sfx('beam'),150);
        el.classList.add('shown');if(o.st==='nova')setTimeout(()=>{if(alive)showcaseCard(mk(o.k,o.foil?{rare:true}:{}))},550);if(flipped.size===got.length)setTimeout(done,700)},480)};
    if(ri>=1){el.classList.add('charge');sfx('hit');setTimeout(go,[0,450,800,1150][ri])}else go()};
  const pk=ov.querySelector('.ppack');
  const open=()=>{if(opened||pk.classList.contains('shake'))return;pk.classList.add('shake');sfx('hit');
    setTimeout(()=>{if(!alive)return;pk.classList.add('torn');sfx('rip');const[cx,cy]=at(pk);burst(cx,cy-pk.clientHeight*.38,46,[...P.col,'#ffffff','#fff3b0'],1.1);flash();
      setTimeout(()=>{if(!alive)return;opened=true;ov.classList.add('opened');ov.querySelector('.phint').textContent='Toque nas cartas para virar';$('pall').hidden=false;sfx('card')},360)},650)};
  pk.onclick=open;
  $('pall').onclick=()=>{$('pall').hidden=true;[...got.keys()].filter(i=>!flipped.has(i)).forEach((i,j)=>setTimeout(()=>flip(i),j*650))};
  const close=()=>{if(!alive)return;alive=false;removeEventListener('keydown',key,true);ov.remove();onClose&&onClose()};
  $('pclose').onclick=close;
  $('pagain').onclick=()=>{if(META.coins<P.price)return;close();if(buyItem('p:'+id))openPack(id,onClose)};
  const key=e=>{if(e.code==='Escape'){e.stopPropagation();close()}else if(e.code==='Space'||e.code==='Enter'){if(document.activeElement&&document.activeElement.closest&&document.activeElement.closest('.pbtns')&&opened)return;e.preventDefault();e.stopPropagation();
    if(!opened)open();else{const n=[...got.keys()].find(i=>!flipped.has(i));if(n!=null)flip(n)}}};
  addEventListener('keydown',key,true);
  sfx('card');return got}
// a pack as a 3D object: front, back and two thin sides; the top strip sits on the front so it can tear off
function pack3dHTML(id){const c=PACKS[id].col[0];return`<div class="p3d" data-pk="${id}" style="--pc:${c}"><canvas class="pbk"></canvas><i class="pedge pl"></i><i class="pedge pr"></i><canvas class="pfr"></canvas><canvas class="ptop"></canvas></div>`}
function paintPack3d(root){root.querySelectorAll('.p3d').forEach(el=>{const id=el.dataset.pk,keep=C,src=mkHD(48,64,4),bk=mkHD(48,64,4);
  try{C=src.getContext('2d');packDraw(id,true);C=bk.getContext('2d');packDraw(id,true,true)}finally{C=keep}
  const fr=el.querySelector('.pfr'),top=el.querySelector('.ptop'),b=el.querySelector('.pbk');
  for(const c of[fr,b,top]){c.width=src.width;c.height=src.height}top.height=48;
  fr.getContext('2d').drawImage(src,0,0);fr.getContext('2d').clearRect(0,0,src.width,48);top.getContext('2d').drawImage(src,0,0);b.getContext('2d').drawImage(bk,0,0)})}

// ---------- the card tent: Boaz keeps the packs on a velvet table; buy one and open it right there
const TENDA=['Pacotes fresquinhos, direto do celeiro!','A Arca sempre traz uma épica ou melhor.','Cópias repetidas sobem o nível das suas árvores.','Passe o mouse num pacote para ver o que vem dentro.','Uma carta consagrada brilha e dá +50% de dano nas fases.'];
function showPacks(){
  const own=PACK_POOL.filter(k=>META.unlocked.includes(k)).length,n=PACK_POOL.length;
  menu(`<div class="tenda"><canvas id="tbg" width="960" height="540"></canvas><i class="tlamp" style="--x:31%;--d:0s"></i><i class="tlamp" style="--x:63%;--d:-1.3s"></i><i class="tlamp" style="--x:93%;--d:-.6s"></i>
    <div class="qsign">Tenda das Cartas</div>
    <div class="qboaz"><canvas id="qboazc" width="256" height="384"></canvas><div class="qbubble" id="qbub">${pick(TENDA)}</div></div>
    ${packGifts()?`<div class="tgifts">${freePackToday()?'<button type="button" class="btn tgift" data-free="semeador">🎁 Pacote grátis do dia</button>':''}${META.gifts?`<button type="button" class="btn tgift" data-free="bencao">🎁 Presente dos chefes · ${META.gifts}</button>`:''}</div>`:''}
    <div class="tpacks">${Object.entries(PACKS).map(([k,p],i)=>`<div class="tpk" data-pk="${k}" style="--pc:${p.col[1]};--n:${i}">
      <div class="tstage">${pack3dHTML(k)}</div><b>${p.name}</b><small>${p.desc}</small>
      <div class="todds">${p.odds.map((o,j)=>`<span style="--rc:${RAR[RAR_ORDER[j]].c};flex:${Math.max(o,5)}" title="${RAR[RAR_ORDER[j]].name}: ${o}%"></span>`).join('')}</div>
      <button type="button" class="btn" data-buypk="${k}" ${META.coins<p.price?'disabled':''}><canvas width="12" height="12" class="coin"></canvas>${p.price}</button></div>`).join('')}</div>
    <div class="tcol"><span>Coleção <b>${own}/${n}</b></span><span class="tbar"><i style="width:${own/n*100}%"></i></span><button type="button" class="btn ghost" data-go="codex">Ver cartas</button></div>
    <div class="qfoot"><button class="btn ghost" data-go="hub">‹ Menu</button><span class="qpage">${RAR_ORDER.map(r=>`<i style="color:${RAR[r].c}">${RAR[r].sym}</i> ${RAR[r].name}`).join(' &nbsp; ')}</span>${coinsTag()}</div></div>`);
  paintCoins();tendaArt();paintPack3d($('menu'));
  const bub=$('qbub');
  $('menu').querySelectorAll('.tpk').forEach(el=>{const p=PACKS[el.dataset.pk];
    el.onmouseenter=()=>{bub.innerHTML=`<b>${p.name}</b><br>${p.desc} Chances: ${p.odds.map((o,j)=>RAR[RAR_ORDER[j]].name.toLowerCase()+' '+o+'%').join(', ')}.`;sfx('hit')};
    el.onmouseleave=()=>{bub.textContent=pick(TENDA)}});
  $('menu').querySelectorAll('[data-free]').forEach(b=>b.onclick=()=>{const k=b.dataset.free;if(k==='semeador'){if(!freePackToday())return;META.freeDay=todayKey()}else{if(!META.gifts)return;META.gifts--}saveMeta();openPack(k,()=>showPacks())});
  $('menu').querySelectorAll('[data-buypk]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.buypk;
    if(buyItem('p:'+k))openPack(k,()=>showPacks());else{sfx('no');bub.innerHTML='Faltam moedas para o '+PACKS[k].name+'. Vença umas fases e volte!'}})}
// the tent inside: striped canvas walls, a scalloped valance, shelves with card stacks, a velvet table, plank floor
function tendaArt(){const g=hdCtx($('tbg'),480,270,2);C=g;
  for(let i=0;i<480;i+=24){r(i,0,12,200,'#4a1e5a');r(i+12,0,12,200,'#3a1648');r(i+11,0,1,200,'#2a0e36')}
  let gr=g.createLinearGradient(0,0,0,200);gr.addColorStop(0,'#000a');gr.addColorStop(.35,'#0000');gr.addColorStop(1,'#0006');g.fillStyle=gr;g.fillRect(0,0,480,200);
  for(let i=0;i<480;i+=20){r(i,0,20,10,i%40?'#e8a020':'#c8302a');disc(i+10,10,9.5,i%40?'#e8a020':'#c8302a');r(i+9,17,2,4,'#f7c948')}r(0,0,480,3,'#7a1a18');
  for(const[sx,sy]of[[150,62],[330,56]]){r(sx,sy,90,4,'#7a4a24');r(sx,sy,90,1,'#b07a40');r(sx,sy+4,90,2,'#3a1a08');
    for(let i=0;i<6;i++){const cx=sx+8+i*14,h=8+hs(i,sx)*6,cc=['#c8403a','#2a6ad8','#9b5ae0','#e8a020','#4faa4a','#2aa8a0'][i];for(let j=0;j<h;j+=2){r(cx,sy-2-j,10,2,j%4?cc:shade(cc,-.3));r(cx,sy-2-j,10,1,'#fff3')}}}
  for(const lx of[148,302,446]){r(lx,0,1,36,'#2a1608');const gl=g.createRadialGradient(lx,46,2,lx,46,60);gl.addColorStop(0,'#ffd27a66');gl.addColorStop(1,'#ffd27a00');g.fillStyle=gl;g.fillRect(lx-60,0,120,110);
    r(lx-5,36,11,3,'#3a1a08');r(lx-4,39,9,12,'#f7c948');r(lx-3,40,7,10,'#fff0a0');r(lx-5,51,11,3,'#3a1a08')}
  r(0,200,480,70,'#5a3420');for(let j=204;j<270;j+=8)r(0,j,480,1,'#3a1e10');for(let i=0;i<480;i+=36)r(i+(i%72?0:18),200,1,70,'#3a1e10');
  r(140,176,340,8,'#3a1408');gr=g.createLinearGradient(0,184,0,238);gr.addColorStop(0,'#a8203a');gr.addColorStop(1,'#5a0e20');g.fillStyle=gr;g.fillRect(140,184,340,54);
  r(140,184,340,3,'#f7c948');for(let i=146;i<480;i+=12){disc(i,240,4,'#7a1028');r(i-1,238,2,6,'#f7c948')}r(140,176,340,2,'#c84a5a');
  for(let i=0;i<40;i++)r(hs(i,3)*480,20+hs(i,4)*150,1,1,'#fff6c0aa');
  C=x;boazArt()}
// two neighbour trees side by side under a shared light, joined by a golden branch with a heart in the middle
function pairArtTo(cvs,p){const g=hdCtx(cvs,96,48,3),keep=C;C=g;
  try{const th=k=>THEME[FRUIT[k]]||THEME[k]||THEME.parabola,A=th(p.a),B=th(p.b),gr=g.createLinearGradient(0,0,96,0);gr.addColorStop(0,A[2]);gr.addColorStop(1,B[2]);g.fillStyle=gr;g.fillRect(0,0,96,48);
    const rg=g.createRadialGradient(48,20,2,48,20,44);rg.addColorStop(0,'#fff6c099');rg.addColorStop(1,'#fff6c000');g.fillStyle=rg;g.fillRect(0,0,96,48);
    for(let i=0;i<18;i++)r(hs(i,p.a.length)*96,hs(i,9)*34,1,1,'#ffffff88');
    r(0,41,96,7,'#1e3a22');r(0,41,96,1,'#6ab04a');for(let i=0;i<96;i+=3)r(i,40,1,1,'#4a8a3a');
    for(const[k,x0]of[[p.a,22],[p.b,74]]){const b=mkHD(48,48,2);C=b.getContext('2d');drawTower(k,24,46,1);C=g;inked(g,b,x0-24,-5,48,48,COUT,.6)}
    for(let t=0;t<=1;t+=.03){const x0=31+34*t,y0=21-Math.sin(Math.PI*t)*9;r(x0,y0,1.5,1.5,COUT);r(x0,y0-.5,1,1,'#f7c948')}
    [[0,1,1,0,1,1,0],[1,1,1,1,1,1,1],[0,1,1,1,1,1,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0]].forEach((row,j)=>row.forEach((v,i)=>v&&r(44.5+i,9+j,1,1,j===0&&i===1?'#ffd0dc':'#ff4f7b')))}
  finally{C=keep}}
// a relic icon redrawn sharper, with the same dark outline as the cards
function relicCardArt(cvs,k){const t=mkHD(32,32,4),keep=C;C=t.getContext('2d');try{RICONS[k]&&RICONS[k]()}finally{C=keep}const g=hdCtx(cvs,32,32,4);inked(g,t,0,0,32,32,COUT,.7)}

// ---------- a newly discovered card gets its moment: the screen dims, the card spins in close with light turning behind it,
// sparks in the rarity's colour, then its name, rule and verse. Several new cards wait in line.
const SHOWQ=[];
function showcaseCard(c){SHOWQ.push(c);if(SHOWQ.length===1)showNextCard()}
function showNextCard(){const c=SHOWQ[0];if(!c)return;const I=info(c),rk=rarOf(c),R=RAR[rk],ri=RAR_ORDER.indexOf(rk);
  const ov=document.createElement('div');ov.className='showcase r-'+rk;ov.style.setProperty('--rc',R.c);
  const sparks=Array.from({length:10+ri*8},()=>{const a=Math.random()*6.28,d=8+Math.random()*16;
    return`<i class="scsp" style="--dx:${(Math.cos(a)*d).toFixed(1)}em;--dy:${(Math.sin(a)*d).toFixed(1)}em;animation-delay:${(.9+Math.random()*1.6).toFixed(2)}s"></i>`}).join('');
  ov.innerHTML=`<div class="scrays"></div>${sparks}<small class="sctop">Nova carta descoberta!</small><div class="sccard"></div>
    <div class="scinfo"><b style="color:${R.c}">${R.sym} ${R.name} · ${TYPE_LABEL[I.type]||''}</b><h3>${I.name}</h3><p>${I.desc}</p><i>${I.ref||''}</i></div>
    <button type="button" class="btn">Guardar na coleção</button>`;
  ov.querySelector('.sccard').append(cardCanvas(c));$('stage').append(ov);
  sfx('super');setTimeout(()=>sfx('shine'),500);if(ri>=3)setTimeout(()=>sfx('legend'),300);
  const t0=performance.now(),close=()=>{if(performance.now()-t0<600)return;removeEventListener('keydown',key,true);ov.remove();SHOWQ.shift();showNextCard()};
  const key=ev=>{if(['Escape','Enter','Space'].includes(ev.code)){ev.preventDefault();ev.stopPropagation();close()}};
  ov.onclick=close;addEventListener('keydown',key,true)}
