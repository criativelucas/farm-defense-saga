// ---------- sprites: enemies and bosses
function drawEnemy(e){
  if(S.mini==='escuro'&&!darkVisible(e))return;
  const d=EN[e.k];
  // a root moving underground: a mound of earth with cracks; a lie in disguise: only a faint shape
  if(e.dive>0&&d.ai==='burrow'){const X=Math.round(e.x),Y=Math.round(gy(e.x));r(X-5,Y-2,10,2,'#5a3a20');r(X-3,Y-3,6,1,'#7a5430');for(let i=0;i<3;i++)r(X+4+i*4,Y-1,2,1,'#3a2414');if(Math.random()<.3)S.parts.push({x:e.x+rnd(-4,4),y:Y-2,vx:rnd(-10,10),vy:rnd(-30,-10),g:200,life:.4,max:.4,c:'#7a5430',s:1});return}
  if(e.dive>0&&d.ai==='disguise'){x.globalAlpha=.22+.08*Math.sin(S.t*5);enemyBody(e);x.globalAlpha=1;return}
  if(e.dive>0){for(let i=0;i<4;i++)r(e.x-16+i*10+Math.sin(S.t*6+i)*2,e.y-3-((S.t*20+i*7)%6),2,1,'#bfe8ff');return}
  if(!d.fly){const sw=Math.min(d.w+2,30);x.fillStyle='rgba(20,8,20,.28)';x.fillRect(Math.round(e.x-sw/2),gy(e.x)-.5,sw,1.5)}
  // a furious boss: a pulsing red outline twice as thick, embers rising from it
  if(e.ph2){const p=.5+.5*Math.sin(S.t*8);x.globalAlpha=.35+.35*p;OV='#ff2a1a';for(const[ox,oy]of[[-2,0],[2,0],[0,-2],[0,2]]){x.translate(ox,oy);enemyBody(e);x.translate(-ox,-oy)}x.globalAlpha=1;
    if(Math.random()<.5)S.parts.push({x:e.x+rnd(-d.w/2,d.w/2),y:e.y-rnd(0,d.h),vx:rnd(-8,8),vy:rnd(-40,-20),g:-10,life:.8,max:.8,c:Math.random()<.5?'#ff6a1a':'#ffd040',s:1})}
  if(S.t-(e.born??-9)>.3){const o=1;OV=e.ph2&&Math.sin(S.t*8)>.3?'#6a0a08':INK;for(const[ox,oy]of[[-o,0],[o,0],[0,-o],[0,o]]){x.translate(ox,oy);enemyBody(e);x.translate(-ox,-oy)}}
  const age=S.t-(e.born??-9),sp=(age<.3?Math.max(.05,easeBack(age/.3)):1)*(e.ph2?1.06+.02*Math.sin(S.t*8):1),hq=e.flash>0?1:0;
  x.save();x.translate(e.x,e.y);x.scale(sp*(1+hq*.2),sp*(1-hq*.16));x.translate(-e.x,-e.y);
  OV=e.flash>0?'#ffffff':e.frz>0?'#a8ecff':null;enemyBody(e);OV=null;x.restore();
  if(e.frz>0){const w=d.w+6,h=d.h+6,top=(d.fly?e.y-d.h/2:e.y-d.h)-3,lx=e.x-w/2;x.globalAlpha=.5;r(lx,top,w,h,'#9fe8ff');x.globalAlpha=.9;r(lx,top,w,1,'#e8fbff');r(lx,top,1,h,'#e8fbff');r(lx+w-1,top,1,h,'#2a7ab0');r(lx,top+h-1,w,1,'#2a7ab0');
    r(lx+2,top+2,1,h*.4,'#ffffff');r(lx+w-4,top+h*.5,1,h*.3,'#ffffff');x.globalAlpha=1;if(Math.random()<.08)S.parts.push({x:lx+rnd(0,w),y:top+rnd(0,h),vx:0,vy:-8,g:0,life:.5,max:.5,c:'#e8fbff',s:1})}
  if(e.shield){x.globalAlpha=.35+Math.sin(S.t*6)*.1;ring(e.x,ecy(e),Math.max(d.w,d.h)/2+3,'#9ab0ff');x.globalAlpha=1}
  drawTelegraph(e);
  if(e.armorMax&&e.armor>0){const w=Math.min(24,d.w+2),top=(d.fly?e.y-d.h/2:e.y-d.h)-9;r(e.x-w/2,top,w,2,'#2a2a2a');r(e.x-w/2,top,w*e.armor/e.armorMax,2,'#d8d8e0')}
  if(e.hp<e.max&&!d.boss){const w=Math.min(24,d.w+2),top=(d.fly?e.y-d.h/2:e.y-d.h)-6;r(e.x-w/2,top,w,2,'#2a0c14');r(e.x-w/2,top,Math.max(0,w*e.hp/e.max),2,d.elite?'#f7c948':'#ff4f7b')}
}
// every work of the flesh, the elite and the bosses live in sprites.js (SPR)
function enemyBody(e){SPR[e.k]&&SPR[e.k](e)}

// ---------- sprites: trees. sz is the size factor: each species has its own build and grows as it is watered.
// Shapes scale with sz but fruit and leaf pixels stay 1:1, so a grown tree reads as bigger, not blurrier.
const TREE={videira:{b:1.35,h:24},roma:{b:1.55,h:27},oliveira:{b:1.75,h:25},sarca:{b:1.25,h:14},figueira:{b:1.85,h:26},tamareira:{b:2.05,h:30},amendoeira:{b:1.65,h:26},lirio:{b:1.1,h:12},mostarda:{b:1,h:20},hissopo:{b:1.3,h:14},cedro:{b:1.5,h:32}};
function extraFruit(X,Y,sz,n,cx,cy,rx,ry,c1,c2,seed){for(let i=0;i<n;i++){const a=hs(i,seed)*Math.PI*2,d=Math.sqrt(hs(i,seed+1)),fx=X+Math.round(Math.cos(a)*rx*d*.8),fy=Y-cy+Math.round(Math.sin(a)*ry*d*.8);r(fx-1,fy-1,3,3,c1);r(fx-1,fy-1,1,1,c2)}}
function drawTower(k,X,Y,t,tr,sz=1){
  const q=v=>Math.round(v*sz),tw=sz>1.6?4:3,more=Math.max(0,Math.round((sz-1)*7));
  switch(k){
    case 'videira':{const hh=q(22),hw=q(7);
      r(X-hw,Y-hh,2,hh,'#6b3b2a');r(X+hw-2,Y-hh,2,hh,'#6b3b2a');r(X-hw-1,Y-hh,hw*2+2,2,'#8a5236');r(X-hw+1,Y-q(14),hw*2-2,1,'#8a5236');if(sz>1.2)r(X-hw+1,Y-q(7),hw*2-2,1,'#8a5236');
      blob(X-q(3),Y-q(19),q(6),q(4),'#1a5c36','#2e9c48','#78dc5a',3);blob(X+q(3),Y-q(16),q(5),q(4),'#1a5c36','#2e9c48','#78dc5a',7);blob(X-1,Y-q(9),q(4),q(3),'#1a5c36','#2e9c48','#78dc5a',8);
      const g=[[-5,-13],[3,-11],[0,-17],[-2,-7],[5,-18],[-6,-20]].slice(0,3+Math.min(3,more));
      g.forEach(([dx,dy])=>{const gx=X+q(dx),gy=Y+q(dy);r(gx-1,gy,3,2,'#7b2fbf');r(gx,gy+2,2,2,'#6a24a8');r(gx,gy+4,1,1,'#6a24a8');r(gx-1,gy,1,1,'#c58cff')});break}
    case 'roma':{const th=q(12);
      r(X-1,Y-th,tw,th,'#7a3e2e');r(X-q(3),Y-1,q(7),1,'#5a2a20');r(X+1,Y-q(9),q(3),1,'#7a3e2e');if(sz>1.3)r(X-q(4),Y-q(11),q(3),1,'#7a3e2e');
      blob(X,Y-q(20),q(9),q(7),'#18522e','#2c9244','#6cd456',11);if(sz>1.3){blob(X-q(7),Y-q(16),q(5),q(4),'#18522e','#2c9244','#6cd456',12);blob(X+q(7),Y-q(17),q(5),q(4),'#18522e','#2c9244','#6cd456',13)}
      [[-5,-18],[4,-23],[3,-15],[-2,-25],[-6,-13]].forEach(([dx,dy])=>{const fx=X+q(dx),fy=Y+q(dy);r(fx-1,fy-1,3,3,'#e0284a');r(fx-1,fy-1,1,1,'#ff9aa8');r(fx,fy-2,1,1,'#f7c948')});
      extraFruit(X,Y,sz,more,0,q(20),q(9),q(7),'#e0284a','#ff9aa8',90);break}
    case 'oliveira':{
      r(X-1,Y-q(10),tw+1,q(10),'#7d6a5a');r(X,Y-q(10),1,q(10),'#9a8a78');r(X-q(3),Y-q(7),2,q(3),'#7d6a5a');r(X+1,Y-q(14),2,q(5),'#7d6a5a');r(X-q(4),Y-1,q(9),1,'#5a4a3a');if(sz>1.4){r(X-q(6),Y-q(12),q(5),2,'#7d6a5a');r(X+q(3),Y-q(13),q(5),2,'#7d6a5a')}
      blob(X,Y-q(19),q(10),q(6),'#3e6a4a','#6e9a68','#b4d496',23);if(sz>1.3){blob(X-q(9),Y-q(15),q(6),q(4),'#3e6a4a','#6e9a68','#b4d496',24);blob(X+q(9),Y-q(16),q(6),q(4),'#3e6a4a','#6e9a68','#b4d496',25)}
      [[-6,-18],[5,-20],[1,-15],[-2,-23],[7,-16]].forEach(([dx,dy])=>{r(X+q(dx),Y+q(dy),2,2,'#2a2a3a');r(X+q(dx),Y+q(dy),1,1,'#6a6a8a')});
      extraFruit(X,Y,sz,more,0,q(19),q(12),q(6),'#2a2a3a','#6a6a8a',91);break}
    case 'sarca':{blob(X,Y-q(5),q(8),q(5),'#1c4a2a','#2f7a3a','#4faa50',31);const n=4+q(2);
      for(let i=0;i<n;i++){const fx=X-q(6)+Math.round(i*q(12)/(n-1)),h=q(4)+((Math.sin(t*12+i*1.7)+1)*q(3)|0);r(fx,Y-q(6)-h,2,h,'#ff6a1a');r(fx,Y-q(5)-h,1,Math.max(1,h-2),'#ffd34a')}break}
    case 'figueira':{const th=q(12);
      r(X-1,Y-th,tw,th,'#6a4a3a');r(X-q(4),Y-q(10),q(3),2,'#6a4a3a');r(X+q(2),Y-q(13),q(4),2,'#6a4a3a');r(X-q(3),Y-1,q(7),1,'#4a3020');
      blob(X,Y-q(18),q(11),q(7),'#205a28','#3a9038','#86cc4a',51);if(sz>1.3){blob(X-q(10),Y-q(14),q(6),q(4),'#205a28','#3a9038','#86cc4a',52);blob(X+q(10),Y-q(15),q(6),q(4),'#205a28','#3a9038','#86cc4a',53)}
      [[-6,-15],[4,-19],[0,-13],[-3,-22],[7,-14]].forEach(([dx,dy])=>{r(X+q(dx),Y+q(dy),2,3,'#6a2a5a');r(X+q(dx),Y+q(dy),1,1,'#a04a8a')});
      extraFruit(X,Y,sz,more,0,q(18),q(13),q(7),'#6a2a5a','#a04a8a',92);
      if(tr&&tr.charge>1){const n=Math.min(6,tr.charge|0);for(let i=0;i<n;i++)r(X-8+i*3,Y-q(28)-((t*10+i*3)%5),1,1,'#c8f080')}break}
    case 'tamareira':{const th=q(26),fl=q(11);
      for(let i=0;i<th;i++)r(X-1+Math.sin(i/sz*.12)*1.5*sz,Y-i,tw,1,i%3?'#8a6a3a':'#6a4a2a');
      for(let a=0;a<7;a++){const an=-Math.PI*.97+a*Math.PI*.33;for(let j=0;j<fl;j++)r(X+Math.cos(an)*j,Y-th+Math.sin(an)*j+j*j*.07/sz,2,1,a%2?'#3f8a3a':'#5faa4a')}
      const dn=2+Math.min(3,more>>1);for(let i=0;i<dn;i++){const dx=-3+i*(6/(dn-1||1))|0;r(X+dx-1,Y-th+2,2,4,'#d9802a');r(X+dx-1,Y-th+3,1,2,'#ffa64a')}break}
    case 'amendoeira':{const th=q(13);
      r(X-1,Y-th,tw,th,'#4a3028');r(X-q(4),Y-q(11),q(3),1,'#4a3028');r(X+2,Y-q(14),q(3),1,'#4a3028');r(X-q(3),Y-1,q(7),1,'#3a2018');
      blob(X,Y-q(19),q(10),q(6),'#d8b0c8','#f0d0e0','#ffffff',61);if(sz>1.3){blob(X-q(8),Y-q(15),q(6),q(4),'#d8b0c8','#f0d0e0','#ffffff',62);blob(X+q(8),Y-q(16),q(6),q(4),'#d8b0c8','#f0d0e0','#ffffff',63)}
      for(let i=0;i<7+more*2;i++)r(X-q(8)+hs(i,61)*q(16),Y-q(24)+hs(i,62)*q(10),1,1,'#ff8ac0');r(X-q(3),Y-q(15),2,1,'#c8a070');r(X+q(4),Y-q(17),2,1,'#c8a070');break}
    case 'lirio':{const n=5+(sz>1.05?2:0);
      for(let i=0;i<n;i++){const lx=X-q(6)+Math.round(i*q(12)/(n-1)),h=q(6+(i%2)*4)+Math.round(Math.sin(t*2+i)*.6);r(lx,Y-h,1,h,'#3f8a3a');r(lx-1,Y-3-(i%3),1,2,'#5faa4a');
        r(lx-1,Y-h-2,3,2,'#ffffff');r(lx,Y-h-3,1,1,'#ffffff');r(lx,Y-h-1,1,1,'#ffd34a')}break}
    case 'mostarda':drawMostarda(X,Y,2);break;
    case 'hissopo':{const n=6+more;// a low bushy clump with spikes of small violet flowers (Sl 51:7)
      blob(X,Y-q(5),q(8),q(5),'#2a5a3a','#4a8a4a','#8ac070',71);
      for(let i=0;i<n;i++){const lx=X-q(6)+Math.round(i*q(12)/(n-1)),h=q(8+(i%3)*3)+Math.round(Math.sin(t*2+i)*.6);r(lx,Y-h,1,h-q(3),'#3a6a3a');for(let j=0;j<3;j++)r(lx-(j%2),Y-h+j*2,2,1,j?'#8a7ae0':'#c8b8ff')}break}
    case 'cedro':{const th=q(30),w0=q(13);// the cedar of Lebanon: a straight trunk with flat dark tiers (Sl 92:12)
      r(X-1,Y-th,tw,th,'#5a3a24');r(X,Y-th,1,th,'#7a5434');r(X-q(3),Y-1,q(7),1,'#3a2414');
      for(let k=0;k<4;k++){const yy=Y-q(9)-k*q(6),ww=w0-k*q(3),sw=Math.round(Math.sin(t*1.5+k)*.6);r(X-ww+sw,yy,ww*2,q(3),'#1e4a32');r(X-ww+1+sw,yy,ww*2-2,1,'#3a7a4a');r(X-ww+sw,yy+q(3)-1,ww*2,1,'#123a24')}
      r(X-1,Y-th-q(2),2,q(3),'#2a5a3a');break}
  }
}
function drawMostarda(X,Y,age){
  if(age<=0){r(X,Y-5,1,5,'#5fe08a');r(X-1,Y-6,1,1,'#5fe08a');r(X+1,Y-7,1,1,'#5fe08a');r(X,Y-8,1,1,'#ffe36a');return}
  if(age===1){r(X,Y-12,1,12,'#8a5a3a');blob(X,Y-14,5,3,'#5a6a22','#8a9a32','#d8d060',44);return}
  r(X-2,Y-36,5,36,'#8a5a3a');r(X-1,Y-36,1,36,'#a8744a');r(X-6,Y-24,4,2,'#8a5a3a');r(X+3,Y-28,4,2,'#8a5a3a');
  blob(X,Y-42,18,11,'#5a6a22','#8a9a32','#d8d060',41);blob(X-12,Y-30,8,5,'#5a6a22','#8a9a32','#d8d060',42);blob(X+12,Y-32,8,5,'#5a6a22','#8a9a32','#d8d060',43);
  for(let i=0;i<10;i++)r(X-15+hs(i,9)*30,Y-50+hs(i,8)*18,1,1,'#ffe36a');
  r(X-6,Y-53,3,2,'#2a2030');r(X+7,Y-50,3,2,'#2a2030');r(X-5,Y-54,1,1,'#2a2030');
}
function drawJoio(X,Y,t){for(let i=0;i<6;i++){const lx=X-6+i*2.4,h=8+(i%3)*4,sw=Math.sin(t*2+i)*.8;r(lx,Y-h,1,h,'#6a6a2a');r(lx+sw-1,Y-h-3,3,3,'#8a8a3a');r(lx+sw,Y-h-4,1,1,'#2a2a10')}}
function drawSoil(s){
  const X=s.x,Y=s.y;
  if(s.soil==='boa'){r(X-6,Y-2,12,2,'#2a1410');r(X-4,Y-3,8,1,'#4a2a1a')}
  if(s.soil==='pedra'){r(X-6,Y-3,4,3,'#7a7a8a');r(X-1,Y-2,3,2,'#9a9aa8');r(X+3,Y-3,3,3,'#6a6a78');r(X-5,Y-3,1,1,'#b0b0c0')}
  if(s.soil==='espinho'){for(let i=0;i<5;i++){r(X-6+i*3,Y-4+(i%2),1,4-(i%2),'#6a3a2a');r(X-7+i*3,Y-4+(i%2),1,1,'#a05a3a')}}
}

// ---------- icons for cards, relics and journey nodes
const ICONS={
  chuva(){blob(16,10,11,5,'#4a5a7a','#7a8ab0','#c8d4e8',3);for(let i=0;i<6;i++)r(6+i*4,18+(i%2)*4,1,4,'#7fc8ff')},
  mana(){r(8,24,16,6,'#b07a1a');r(9,23,14,1,'#f7c948');for(let i=0;i<7;i++){const fx=6+hs(i,1)*20,fy=3+hs(i,2)*16;r(fx,fy,2,2,'#f7c948');r(fx,fy,1,1,'#fffbe0')}},
  jerico(){r(2,26,28,6,'#a8683a');r(2,28,28,1,'#7a4a2a');r(10,26,1,6,'#2a1410');r(20,27,1,5,'#2a1410');
    for(let i=0;i<14;i++)r(5+i*1.5,21-i*.8-(i>9?(i-9)*1.6:0),2,1+(i/5|0),'#d9b07a');r(25,5,4,6,'#e8c890');r(7,20,2,3,'#a8783a')},
  talentos(){r(8,14,14,15,'#8a5236');r(8,14,14,2,'#a86a40');r(12,10,6,4,'#6a3a24');r(11,10,8,1,'#c9a24a');r(18,20,8,8,'#f7c948');r(19,21,6,6,'#ffe08a');r(21,22,2,4,'#b07a1a');r(4,25,6,5,'#f7c948');r(5,26,4,1,'#fffbe0')},
  semeador(){r(4,14,11,14,'#c9a99a');r(4,14,11,2,'#e8dcc0');r(6,11,7,3,'#a88a7a');for(let i=0;i<6;i++)r(16+i*2.5,16-Math.sin(i/5*Math.PI)*9+i,2,2,'#e8c86a')},
  mostarda(){r(15,18,2,12,'#8a5a3a');blob(16,13,10,7,'#5a6a22','#8a9a32','#d8d060',41);r(12,9,1,1,'#ffe36a');r(19,12,1,1,'#ffe36a');r(6,28,2,2,'#e8c86a')},
  profecia(){r(6,8,20,18,'#e8dcc0');r(4,6,24,3,'#c9a24a');r(4,25,24,3,'#c9a24a');for(let i=0;i<5;i++)r(9,12+i*3,14-(i%2)*4,1,'#5a3a2a');r(22,4,4,4,'#c58cff')},
  joio(){drawJoio(16,30,0)},
  regar(){r(6,14,14,11,'#7a8a9a');r(6,14,14,2,'#a0b0c0');r(20,16,8,2,'#7a8a9a');r(26,14,3,2,'#7a8a9a');r(9,10,8,2,'#5a6a7a');r(8,10,1,5,'#5a6a7a');r(17,10,1,5,'#5a6a7a');
    for(let i=0;i<4;i++)r(27+(i%2),18+i*3,1,2,'#7fc8ff');r(4,27,24,3,'#5fe08a')},
  arca(){r(3,18,26,8,'#8a5a2a');r(5,26,22,2,'#6a4220');r(3,18,26,1,'#b07a40');r(9,11,14,7,'#a06a30');r(7,10,18,2,'#6a4220');r(14,13,4,4,'#3a2010');for(let i=0;i<32;i+=4)r(i,29,3,1,'#7ac0f0')},
  respigar(){for(let i=0;i<7;i++){r(9+i*2,8,1,20,'#c9a24a');r(8+i*2,5+(i%2)*2,3,5,'#f7c948')}r(8,18,16,2,'#8a5a2a');r(5,28,22,2,'#8a6a3a')},
  pedras(){[[6,22],[12,25],[18,22],[24,25],[15,18]].forEach(([a,b])=>{disc(a,b,2,'#9a9aa8');r(a-1,b-2,1,1,'#d0d0d8')});r(10,6,1,10,'#8a5a3a');r(21,6,1,10,'#8a5a3a');r(11,15,10,2,'#8a5a3a')},
  fogoceu(){r(14,2,4,18,'#ffd34a');r(15,2,2,18,'#fffbe0');r(8,22,16,6,'#9a9aa8');r(6,20,20,2,'#b0b0c0');for(let i=0;i<5;i++)r(9+i*3,15-(i%2)*3,2,6,i%2?'#ff6a1a':'#ffd34a')},
  celeiro(){for(let yy=-10;yy<=0;yy++){const w=Math.sqrt(100-yy*yy);r(16-w,16+yy,w*2,1,'#c9a24a')}r(6,16,20,12,'#b08a3a');r(13,20,6,8,'#3a2410');for(let i=0;i<6;i++)r(7+i*3,29,2,2,'#f7c948')},
  palmeira(){palm(16,30,'#5fae4a');r(14,26,4,4,'#d9802a');r(4,29,24,2,'#c9a060')},
  maraberto(){for(let j=6;j<30;j++){r(2+Math.sin(j*.4)*1,j,8,1,'#2a6aa8');r(22+Math.sin(j*.4)*1,j,8,1,'#2a6aa8')}r(15,4,2,24,'#8a5a3a');r(12,3,6,2,'#8a5a3a');r(10,28,12,2,'#d9a050')}
};
function iconTo(cvs,c){
  const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;
  if(c.hyb){drawTower(c.hyb[0],10,30,0);drawTower(c.hyb[1],22,30,0)}
  else if(CARDS[c.k].type==='semente')drawTower(c.k,16,30,0);
  else ICONS[c.k]();
  if(c.rare){r(3,3,1,1,'#fff6c0');r(27,5,1,1,'#fff6c0');r(26,24,1,1,'#f7c948');r(4,20,1,1,'#f7c948')}
  C=x;
}
const RICONS={
  vara(){r(15,4,2,26,'#8a5a3a');blob(16,8,6,4,'#d8b0c8','#f0d0e0','#ffffff',61);r(13,12,2,1,'#c8a070')},
  funda(){r(6,6,2,20,'#8a5a3a');r(24,6,2,20,'#8a5a3a');r(8,24,16,2,'#8a5a3a');disc(16,24,3,'#9a9aa8')},
  pomba(){r(8,14,14,6,'#f4f4ff');r(20,12,5,5,'#f4f4ff');r(23,14,1,1,'#111');r(25,15,2,1,'#e0a040');r(6,10,8,4,'#d8d8f0');blob(26,22,3,2,'#3e6a4a','#6e9a68','#b4d496',23)},
  arca(){r(4,12,24,12,'#d9a521');r(4,12,24,2,'#ffe08a');r(2,24,28,2,'#8a5a2a');r(8,6,6,6,'#ffe08a');r(18,6,6,6,'#ffe08a')},
  cajado(){r(15,6,2,24,'#8a5a3a');r(12,4,6,2,'#8a5a3a');r(11,6,2,3,'#8a5a3a');for(let i=0;i<5;i++)r(4+i*5,26-(i%2),3,1,'#7ac0f0')},
  manto(){for(let i=0;i<7;i++)r(8+i*2,6,2,22,['#e0284a','#f7c948','#2a5bd7','#5fe08a','#c58cff','#ff9a3c','#ffffff'][i]);r(6,6,20,2,'#5a3a2a')},
  jarro(){r(10,10,12,16,'#b0703a');r(12,6,8,4,'#b0703a');r(11,26,10,2,'#8a5028');r(13,4,6,2,'#f7c948');r(12,12,2,8,'#d09050')},
  paes(){disc(10,20,5,'#d9a050');disc(18,22,5,'#c98a40');disc(24,18,4,'#d9a050');r(4,10,12,4,'#7ac0f0');r(18,8,10,4,'#7ac0f0')},
  trombeta(){for(let i=0;i<14;i++)r(4+i*1.6,22-i*.9,2,1+(i/5|0),'#d9b07a');r(26,6,4,6,'#e8c890');r(4,26,6,4,'#f7c948')},
  lampada(){r(8,18,16,6,'#c9a24a');r(22,16,5,3,'#c9a24a');r(12,10,4,8,'#ff9a3c');r(13,8,2,4,'#ffe36a')}
};
function relicIconTo(cvs,k){const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;RICONS[k]();C=x}
const NICONS={
  batalha(){enemyBody({k:'odio',x:16,y:26,t:0})},
  elite(){enemyBody({k:'bezerro',x:22,y:30,t:0})},
  evento(){ICONS.profecia()},
  mercado(){ICONS.talentos()},
  descanso(){for(let j=0;j<14;j++)r(16-j,10+j,2*j+1,1,'#c9a99a');r(14,18,5,6,'#2a1a10');r(4,24,24,2,'#5a3a2a');r(16,6,1,4,'#8a5a3a')},
  altar(){r(8,20,16,8,'#9a9aa8');r(6,18,20,3,'#b0b0c0');for(let i=0;i<4;i++)r(11+i*3,12-(i%2)*2,2,6,i%2?'#ff6a1a':'#ffd34a')},
  chefe(){disc(16,16,10,'#5a2a2a');r(10,13,4,3,'#ff3d3d');r(18,13,4,3,'#ff3d3d');r(11,20,10,2,'#111');r(8,4,16,4,'#f7c948');r(8,2,2,2,'#f7c948');r(15,1,2,3,'#f7c948');r(22,2,2,2,'#f7c948')}
};
function nodeIconTo(cvs,k){const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;NICONS[k]();C=x}
function enemyIconTo(cvs,k,t=1){const g=hdCtx(cvs,48,48);C=g;const d=EN[k];g.save();const sc=d.boss||d.elite?.9:Math.min(2.4,34/Math.max(d.w,d.h+4)),o=1,e={k,x:0,y:d.fly?-d.h/2-2:0,t};g.translate(24,44);g.scale(sc,sc);
  OV=INK;for(const[ox,oy]of[[-o,0],[o,0],[0,-o],[0,o]]){g.translate(ox,oy);enemyBody(e);g.translate(-ox,-oy)}OV=null;enemyBody(e);g.restore();C=x}

// ---------- frame
const dc=mkHD(W+1,H),dx=dc.getContext('2d');
const LC={hissopo:'#b8c0ff',cedro:'#a8e0a0',videira:'#a05ae8',roma:'#ff4f7b',oliveira:'#d8f0a8',sarca:'#ff8a2a',mostarda:'#f7d050',figueira:'#9ae060',tamareira:'#ffa64a',amendoeira:'#ffc8e4',lirio:'#f4f4ff'};
let LIGHTS=[];
const easeBack=g=>1+2.70158*Math.pow(g-1,3)+1.70158*Math.pow(g-1,2);
const HOMEY={tree:118,tabernacle:158,pillar:120,rahab:146,altar:150,rock:150,tomb:150};
// the world is drawn VY units higher than the screen, so the hand of cards at the bottom covers dirt, not the ground you play on
const VY=-26;
function view(ctx){ctx.translate(S.sx,S.sy+VY);if(S.zoom>1.005){const fx=S.zoomTo.x-S.cam,fy=S.zoomTo.y;ctx.translate(fx,fy);ctx.scale(S.zoom,S.zoom);ctx.translate(-fx,-fy)}}
// ---------- the pests come out of two small portals at the far end: one on the ground, one up in the air for the high fliers.
// They swirl, open wide while a wave is on and flare each time something steps out
const portalSpots=()=>[[MAP.ww-14,gy(MAP.ww-14)-12],[MAP.ww-22,106]];
function drawPortals(){if(!S.pPulse||!live())return;const open=S.state==='wave'?1:.55;
  portalSpots().forEach(([px,py],i)=>{if(px<S.cam-30||px>S.cam+W+30)return;const p=S.pPulse[i],rx=(5+p*2.5)*open+1.5,ry=(10+p*4)*open+2.5;
    const oval=(k,c)=>{const a=rx*k,b=ry*k;for(let dy=-b;dy<=b;dy+=.5){const w=a*Math.sqrt(Math.max(0,1-(dy/b)**2));r(px-w,py+dy,w*2,.5,c)}};
    oval(1.18,'#1a0412');oval(1,'#e0285a');oval(.82,'#8a1446');oval(.6,'#3a0624');oval(.36,'#12020c');
    for(let j=0;j<10;j++){const a=S.t*(3+i)+j*.628,q=.55+.4*((j*7)%5)/5;r(px+Math.cos(a)*rx*q,py+Math.sin(a)*ry*q,.5+(j%3===0)*.5,.5+(j%3===0)*.5,j%2?'#ff9ac0':'#ffd0e0')}
    if(Math.random()<.25*open){const a=rnd(0,6.28),d=rx*2.2;S.parts.push({x:px+Math.cos(a)*d,y:py+Math.sin(a)*d*1.6,vx:-Math.cos(a)*d*2,vy:-Math.sin(a)*d*3,g:0,life:.4,max:.4,c:'#ff6a9a',s:1})}})}
function buildLights(){
  const L=[],P=S.p;
  MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(!t||t.grow<=.35||t.joio)return;const big=t.kinds[0]==='mostarda'&&t.age>=2,th=Math.max(...t.kinds.map(k=>TREE[k].h*TREE[k].b*(t.szv||.55)));
    t.kinds.forEach(k=>L.push({x:s.x,y:s.y-(big?40:th*.6),r:(k==='sarca'?42+Math.sin(S.t*23+i)*5+rnd(-2,2):big?64:30)*(1+t.pulse*.6+(t.lvl||0)*.1)*Math.min(1,t.grow)*(relic('lampada')?1.25:1),c:LC[k],a:(k==='sarca'?.65:.5)*(MAP.day?.55+S.night:1)}))});
  for(const f of S.fx){if(f.k==='beam')L.push({x:f.x,y:110,r:120,c:'#ff4f7b',a:.9*(1-f.t/f.max)});if(f.k==='ring')L.push({x:f.x,y:f.y,r:f.r+12,c:f.c,a:.35*(1-f.t/.45)})}
  for(const e of S.en){const d=EN[e.k];if(d.boss||d.elite)L.push({x:e.x,y:e.y-14,r:56,c:d.glow,a:.5*(MAP.day?.55+S.night:1)});else if(e.k==='feitico')L.push({x:e.x,y:e.y,r:16,c:'#5af0ff',a:.5})}
  if(S.state!=='title')L.push({x:P.x,y:P.y-8,r:30,c:'#ffd8a0',a:.22});
  propLights(L);
  if(S.pPulse&&live())portalSpots().forEach(([px,py],i)=>L.push({x:px,y:py,r:30+S.pPulse[i]*26,c:'#ff3a7a',a:.6+S.pPulse[i]*.4}));
  for(const f of MAP.gfalls||[])L.push({x:f.x+f.w/2,y:f.y1-4,r:22,c:'#7ad8ff',a:.4});
  L.push({x:18,y:HOMEY[MAP.home],r:MAP.home==='pillar'?60:44,c:MAP.home==='pillar'?'#ff8a2a':'#ffe36a',a:.35+Math.sin(S.t*2)*.08});
  if(S.forbid)L.push({x:S.forbid.x,y:S.forbid.y-30,r:S.forbid.on?50:28,c:'#c070ff',a:S.forbid.on?.6:.35});
  if(S.idol&&S.idol.hp>0)L.push({x:S.idol.x,y:S.idol.y-16,r:46,c:'#f7c948',a:.45});
  if(MAPID==='tumulo')L.push({x:518,y:86,r:110,c:'#fff0b0',a:.6+Math.sin(S.t*1.5)*.1});
  for(const f of S.fruitDrops)L.push({x:f.x,y:f.y,r:10,c:LC[f.k]||'#ffd34a',a:.5});
  LIGHTS=L;
}
// at night the moss itself glows: a thin bright line along every grassy edge and down the hanging vines (bloom layer)
function drawRimGlow(){const a=(S.night-.15)*.7;if(a<=0||!MAP.mossTop)return;gx.globalAlpha=Math.min(.6,a);const c=MAP.mossTop,c0=Math.floor(S.cam)-2,c1=c0+W+4;
  for(let u=c0;u<c1;u++){if(inWater(u))continue;r(u,gy(u)-1,1,1.5,c)}
  for(const pl of MAP.plats){if(pl.wall||pl.x+pl.w<c0||pl.x>c1)continue;r(pl.x-1,pl.y-1,pl.w+2,1.5,c)}
  for(const v of MAP.vines){if(v.x<c0||v.x>c1)continue;r(v.x,v.y,1,v.len,'#5fe0a0')}gx.globalAlpha=1}
function glowBlob(ctx,L,mul=1){if(L.r<=1)return;const g=ctx.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r);g.addColorStop(0,L.c);g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.globalAlpha=Math.min(1,L.a*mul);ctx.fillStyle=g;ctx.fillRect(L.x-L.r,L.y-L.r,L.r*2,L.r*2);ctx.globalAlpha=1}
// shafts of light in every garden: soft leaning bands of sun by day, of moonlight at night (Sinai keeps its storm light)
function drawRays(){
  const moon=S.night>.5,k=moon?.6*(S.night-.4):1-S.night;if(k<.03||(MAP.rays==='none'&&!moon))return;
  const col=moon?'170,195,255':MAP.mood==='dusk'?'255,170,110':MAP.mood==='dawn'?'255,205,165':'255,228,165';
  x.save();x.globalCompositeOperation='lighter';
  if(MAP.rays==='sinai'&&!moon){for(let i=0;i<6;i++){const a=(.03+.02*Math.sin(S.t*.9+i*1.7))*k*(S.bolt>0?3:1),bx=150+i*42+Math.sin(S.t*.3+i)*6;
    x.fillStyle=`rgba(190,180,255,${a})`;x.beginPath();x.moveTo(284+i*2,42);x.lineTo(288+i*2,42);x.lineTo(bx+22,216);x.lineTo(bx,216);x.fill()}}
  else{x.transform(1,0,.34,1,0,0);for(let i=0;i<5;i++){const span=W+300,bx=((i*118+hs(i,5)*40-S.cam*.3)%span+span)%span-150,a=(.13+.06*Math.sin(S.t*.6+i*2))*k,w=24+i*8;
    const g=x.createLinearGradient(bx,0,bx+w,0);g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.5,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(bx,-10,w,230)}}
  x.restore();
}
function fog(y,a,spd){const fc=MAP.mood==='day'?'214,236,246':MAP.fog;for(let k=0;k<3;k++){const span=W+260,bx=((k*200-S.cam*spd+S.t*5)%span+span)%span-130;
  x.save();x.translate(bx,y);x.scale(1,.18);const g=x.createRadialGradient(0,0,0,0,0,130);g.addColorStop(0,`rgba(${fc},${a})`);g.addColorStop(1,`rgba(${fc},0)`);
  x.fillStyle=g;x.fillRect(-130,-130,260,260);x.restore()}}
function drawWater(){
  if(!MAP.water)return;const[a,b]=MAP.water,y=gy(a),sx=Math.round(a-S.cam),w=b-a;if(sx>W||sx+w<0)return;
  x.save();x.setTransform(RS,0,0,RS,0,0);x.translate(0,VY);
  for(let j=0;j<16;j++){const off=Math.round(Math.sin(S.t*3+j*.9)*(1+j*.08));x.globalAlpha=.6-j*.03;x.drawImage(cv,sx*RS,(((y-1-j*1.2)|0)+VY)*RS,w*RS,RS,sx+off,y+1+j,w,1)}
  x.globalAlpha=1;x.fillStyle='rgba(40,110,180,.28)';x.fillRect(sx,y+1,w,16);
  for(let i=0;i<4;i++)r(sx+((hs(i,91)*w+S.t*(8+i*3))%w),y+2+i*3,3,1,'#bfe8ff');
  r(sx,y,w,1,'#7ac0f0');x.restore();
}
function drawSea(){
  if(!MAP.sea)return;const[a,b,sy]=MAP.sea,bed=gy(a+1);
  if(S.seaOpen){// the waters stood as a wall on their right hand and on their left (Ex 14:22)
    for(const[x0,dir]of[[a,1],[b-14,-1]]){for(let j=50;j<bed;j++){const wv=Math.round(Math.sin(S.t*3+j*.2)*1.5);x.fillStyle=j%9<2?'#4a9ad8':'#2a6aa8';x.fillRect(x0+wv,j,14,1)}
      for(let j=50;j<bed;j+=3)r(x0+(dir>0?13:0)+Math.sin(S.t*4+j)*1,j,1,2,'#d8f0ff')}
  }else{x.globalAlpha=.72;for(let j=sy;j<bed;j++){x.fillStyle=j<sy+2?'#7ac0f0':'#2a6aa8';x.fillRect(a,j+Math.round(Math.sin(S.t*2+j)*.6),b-a,1)}x.globalAlpha=1;
    for(let i=a;i<b;i+=6)r(i+((S.t*12)%6),sy-1+Math.round(Math.sin(S.t*3+i*.2)),3,1,'#d8f0ff')}
}
function drawHomeDyn(){
  const h=MAP.home,hit=S.lifeHit>0;
  if(h==='tree')for(let i=0;i<7;i++){const fx=4+hs(i,77)*26,fy=102+hs(i,78)*22,on=(Math.sin(S.t*2+i)+1)/2;r(fx,fy,2,2,hit?'#ff4f7b':on>.5?'#fff3a0':'#f7c948')}
  else if(h==='tabernacle'){x.globalAlpha=.5+Math.sin(S.t*2)*.3;r(16,157,8,12,hit?'#ff4f7b':'#ffe36a');x.globalAlpha=1}
  else if(h==='pillar'){// a column of fire: orange licks outside, yellow inside, a white core, sparks rising
    for(let j=0;j<62;j++){const w=7+Math.sin(S.t*8+j*.45)*2+(j>52?(j-52)*.8:0),ox=Math.sin(S.t*5+j*.3)*2,X0=18+ox;
      r(X0-w/2,150-j,w,1,hit?'#ff4f7b':'#e8501a');r(X0-w*.32,150-j,w*.64,1,'#ffa030');if(j<50)r(X0-w*.13,150-j,w*.26,1,'#fff3b0')}
    for(let i=0;i<4;i++){const ph=(S.t*.6+i/4)%1;r(18+Math.sin(ph*9+i)*6,150-ph*70,1,1,'#ffe36a')}}
  else if(h==='rahab'){x.globalAlpha=.6+Math.sin(S.t*2)*.3;r(12,144,8,8,hit?'#ff4f7b':'#ffd070');x.globalAlpha=1}
  else if(h==='altar'){for(let i=0;i<5;i++){const fh=4+((Math.sin(S.t*10+i*1.3)+1)*3|0);r(10+i*3,148-fh,2,fh,i%2?'#ff6a1a':'#ffd34a')}}
  else if(h==='tomb'){for(let i=0;i<12;i++){const a=i/12*Math.PI*2,fx=518+Math.cos(a)*24+Math.sin(S.t+i)*1,fy=88+Math.sin(a)*14;r(fx,fy,2,2,['#ff4f7b','#c58cff','#b8cf9a','#7ac050','#ffa64a','#ffc8e4','#e8e070','#ffffff','#ff9a3c','#ff4f7b','#5af0ff','#f7c948'][i])}}
  else if(h==='rock'){x.globalAlpha=.6+Math.sin(S.t*2)*.3;r(15,148,6,6,hit?'#ff4f7b':'#ffe36a');x.globalAlpha=1}
}
function drawPuddles(){if(S.wet<.05)return;x.globalAlpha=S.wet*.85;
  for(const p of MAP.puddles){r(p.x,p.y-1,p.w,2,'#3a6aa0');r(p.x+1,p.y-1,p.w-3,1,'#9ad0ff');if(Math.sin(S.t*4+p.x)>.6)r(p.x+((S.t*10)%p.w),p.y-1,1,1,'#ffffff')}x.globalAlpha=1}
let CAMF=0;const lay=k=>Math.round((-S.cam*k+CAMF)*RS)/RS;
function drawFG(){const F=MAP.fgSpr;if(!F)return;
  for(const f of MAP.fgItems){const fx=f.x+lay(FGK);if(fx<-60||fx>W+60)continue;
    if(f.t==='vine'){if(MAP.day&&f.s%2)continue;const sw=Math.round(Math.sin(S.t*1.1+f.s)*3)/2;dl(x,F.vine,fx-13+sw,f.len<20?-24:-6)}
    else if(f.t==='fern')dl(x,F.fern,fx-22,H-30);else if(f.t==='rock')dl(x,F.rock,fx-20,H-22);else if(f.t==='frond')dl(x,F.frond,fx-26,-8)}
}
function drawTree(t,s,i){
  if(t.grow<.35){const h=1+t.grow*12|0;r(s.x,s.y-2-h,1,h,'#5fe08a');r(s.x-1,s.y-3-h,1,1,'#9ff7b8');r(s.x+1,s.y-2-h,1,1,'#5fe08a');return}
  if(t.joio){drawJoio(s.x,s.y,S.t);return}
  const e=easeBack(Math.min(1,(t.grow-.35)/.65)),lv=t.branch?1.12:1;t.szv=(t.szv??.55)+((.55+.45*Math.min(3,t.water||0)/3)-(t.szv??.55))*.05;
  x.save();x.translate(s.x,s.y);const sway=Math.sin(S.t*1.6+i*1.3)*.035+t.pulse*.1*Math.sin(S.t*30)+t.pulse*.14;x.transform(1,0,-sway,1,0,0);
  x.scale((.55+.45*e)*(1-t.pulse*.05)*lv,(.35+.65*e)*(1+t.pulse*.1)*lv);x.translate(-s.x,-s.y);
  const z=k=>TREE[k].b*t.szv,body=()=>{
    if(t.kinds.length>1){drawTower(t.kinds[0],s.x-Math.round(4*z(t.kinds[0])),s.y,t.t,t,z(t.kinds[0])*.85);drawTower(t.kinds[1],s.x+Math.round(4*z(t.kinds[1])),s.y,t.t,t,z(t.kinds[1])*.85)}
    else if(t.kinds[0]==='mostarda')drawMostarda(s.x,s.y,t.age);
    else drawTower(t.kinds[0],s.x,s.y,t.t,t,z(t.kinds[0]))};
  // a dark outline first, like the monsters, so every tree reads as one solid shape
  OV='#14241a';for(const[ox,oy]of[[-.5,0],[.5,0],[0,-.5]]){x.translate(ox,oy);body();x.translate(-ox,-oy)}
  OV=t.stun>0?'#6a7a9a':t.seduced?'#d9a521':t.sleep?'#4a5070':null;body();
  OV=null;x.restore();
  if(t.sleep)for(let i=0;i<3;i++){const zx=s.x+6+i*3,zy=s.y-30-i*5-((S.t*6)%4);r(zx,zy,3,1,'#c0d0ff');r(zx+1,zy+1,1,1,'#c0d0ff');r(zx,zy+2,3,1,'#c0d0ff')}
  if(t.branch){const bx=s.x+7,by=s.y+3;if(t.branch==='a'){r(bx,by-1,1,3,'#f7c948');r(bx-1,by,3,1,'#f7c948');r(bx,by,1,1,'#fff6c0')}else{r(bx-1,by,3,1,'#5ab0ff');r(bx,by-1,2,1,'#9ad8ff')}}
  if(t.ark>0){x.globalAlpha=.4+Math.sin(S.t*5)*.2;ring(s.x,s.y-14,16,'#f7c948');x.globalAlpha=1}
  // grown and not yet evolved: a bobbing gold arrow says "touch me"
  if((t.lvl||0)>=3&&!t.branch&&t.grow>=1){const ax=s.x+11,ay=s.y-22+Math.round(Math.sin(S.t*5)*2),c=S.mana>=BRANCH_COST?'#ffd23a':'#8a8a9a';r(ax-1,ay,3,4,c);r(ax-3,ay,7,1,c);r(ax-2,ay-1,5,1,c);r(ax-1,ay-2,3,1,c);r(ax,ay-3,1,1,c)}
}
// enemies leave a quick squash-and-fade instead of vanishing
function drawCorpses(){for(const f of S.fx){if(f.k!=='corpse')continue;const k=f.t/f.max,e=f.e;x.globalAlpha=1-k;x.save();x.translate(e.x,e.y);x.scale(1+k*.8,Math.max(.05,1-k*.9));x.translate(-e.x,-e.y);
  OV=k<.4?'#ffffff':null;enemyBody(e);OV=null;x.restore();x.globalAlpha=1}}
// the canvas is one pixel wider than the view and slides by the camera's fraction, so scrolling is smooth instead of stepping a whole pixel
// camera zoom from the settings: the canvases scale around the farmer; clicks go through screenToWorld so they still land right
const VIEW={z:1,ox:.5,oy:.5};let SUBPX=0,VIEWK='';
function subpixel(f){SUBPX=Math.round(f*8)/8;const live=S&&(S.state==='prep'||S.state==='wave'),z=live?(CFG.zoom||1):1;
  VIEW.z=z;VIEW.ox=z===1?.5:clamp((S.p.x-S.cam)/W,0,1);VIEW.oy=z===1?.5:clamp((S.p.y-VY)/H,0,1);
  const k=SUBPX+'|'+z+'|'+VIEW.ox.toFixed(3)+'|'+VIEW.oy.toFixed(3);if(k===VIEWK)return;VIEWK=k;
  const t=`translateX(${(-SUBPX*100/(W+1)).toFixed(3)}%)`+(z!==1?` scale(${z})`:''),o=(VIEW.ox*100).toFixed(2)+'% '+(VIEW.oy*100).toFixed(2)+'%';
  cv.style.transformOrigin=gl.style.transformOrigin=o;cv.style.transform=t;gl.style.transform=t}
function screenToWorld(cx,cy){const rc=$('stage').getBoundingClientRect(),fx=VIEW.ox+((cx-rc.left)/rc.width-VIEW.ox)/VIEW.z,fy=VIEW.oy+((cy-rc.top)/rc.height-VIEW.oy)/VIEW.z;return[fx*W+S.cam,fy*H-VY]}
const partA=p=>Math.min(1,p.life/p.max*1.5,(p.max-p.life)*3)*(p.a??1);
function drawParts(){for(const p of S.parts){if(p.blink&&Math.sin(p.life*p.blink)<0)continue;x.globalAlpha=partA(p);r(p.x,p.y,p.s,p.s,p.c)}x.globalAlpha=1}
const PCOL={grape:['#7b2fbf','#c58cff'],oil:['#d9c24a','#fff3a0'],seed:['#e8e070','#fff'],mustard:['#c9c040','#fff8a0'],sow:['#e8c86a','#fff'],fig:['#6a2a5a','#c070b0'],date:['#d9802a','#ffc080'],almond:['#e8d0b0','#fff'],pstone:['#9a9aa8','#e0e0e8']};
// fruit shots: a short fading trail, a dark rim so they read on any background, a bright core
function drawProj(){for(const p of S.proj){const c=PCOL[p.kind],s=p.kind==='mustard'||p.kind==='fig'?4:3;
    if(C===x){const n=p.big?9:3;for(let k=n;k>=1;k--){x.globalAlpha=.6*(1-k/(n+1));r(p.x-1-p.vx*k*.016,p.y-1-p.vy*k*.016,s-1,s-1,c[1])}}x.globalAlpha=1;
    if(C===x)r(p.x-1.5,p.y-1.5,s+1,s+1,'#1a0806');r(p.x-1,p.y-1,s,s,c[0]);r(p.x-1,p.y-1,1,1,c[1])}
  for(const s of S.eproj){r(s.x-2,s.y-2,4,4,'#7a7a80');r(s.x-2,s.y-2,2,1,'#c9c9d0')}}
function drawBeams(){for(const f of S.fx){
  if(f.k==='beam'){const a=1-f.t/f.max,w=f.w*a,h=gy(f.x),g=x.createLinearGradient(f.x-w*1.7,0,f.x+w*1.7,0);
    g.addColorStop(0,'rgba(255,79,123,0)');g.addColorStop(.3,'rgba(255,79,123,.85)');g.addColorStop(.5,'#fff4f8');g.addColorStop(.7,'rgba(255,79,123,.85)');g.addColorStop(1,'rgba(255,79,123,0)');
    x.globalAlpha=a;x.fillStyle=g;x.fillRect(f.x-w*1.7,0,w*3.4,h);for(let i=0;i<3;i++)r(f.x-w+rnd(0,w*2),rnd(0,h),1,rnd(4,12),'#ffffff');x.globalAlpha=1;
    if(Math.random()<.8)S.parts.push({x:f.x+rnd(-w*1.5,w*1.5),y:h-2,vx:rnd(-40,40),vy:rnd(-120,-40),g:200,life:.5,max:.5,c:pick(['#ff9aa8','#ffffff']),s:1})}
  else if(f.k==='ring'){x.globalAlpha=1-f.t/.45;ring(f.x,f.y,f.r,f.c);ring(f.x,f.y,f.r*.8,f.c);x.globalAlpha=1}
  else if(f.k==='bird'){const w=(S.t*12|0)%2;r(f.x-2,f.y-w,2,1,'#2a2030');r(f.x,f.y,1,1,'#2a2030');r(f.x+1,f.y-w,2,1,'#2a2030')}
  else if(f.k==='swing'){const a=1-f.t/f.max;x.globalAlpha=a;const n=f.wide?14:9;for(let i=0;i<=n;i++){const an=(-1.2+i/n*2.2)*(f.wide?1.2:1);r(f.x+f.f*Math.cos(an)*f.r,f.y+Math.sin(an)*f.r*(f.wide?1:.6),2,1,'#ffffff')}x.globalAlpha=1}
  else if(f.k==='zap'){const n=20;for(let i=0;i<=n;i++){const u=i/n;r(f.x1+(f.x2-f.x1)*u+rnd(-2,2),f.y1+(f.y2-f.y1)*u+rnd(-2,2),2,1,i%2?'#c070ff':'#ffffff')}}
  else if(f.k==='heart'&&f.t>0){const k=Math.min(1,f.t/f.max),hx=f.x+(18-f.x)*k,hy=f.y+(130-f.y)*k-Math.sin(k*Math.PI)*30;r(hx-1,hy,1,1,'#ff8a8a');r(hx+1,hy,1,1,'#ff8a8a');r(hx-1,hy+1,3,1,'#ff6a6a');r(hx,hy+2,1,1,'#ff6a6a')}}}
function drawDrops(){for(const d of S.drops){if(d.t>10&&(S.t*10|0)%2)continue;const b=Math.sin(d.t*6);if(d.coin){const w=Math.abs(Math.cos(d.t*5))*2+1|0;r(d.x-w/2,d.y-2+b,w,4,'#f7c948');r(d.x-w/2,d.y-2+b,1,1,'#fff6c0');continue}r(d.x-1,d.y-1+b,3,3,'#c58cff');r(d.x-1,d.y-1+b,1,1,'#fff')}}
function draw(){
  if(!S)return;
  const sh=S.shake;S.sx=Math.round(rnd(-sh,sh));S.sy=Math.round(rnd(-sh,sh));
  x.setTransform(RS,0,0,RS,0,0);gx.setTransform(RS,0,0,RS,0,0);
  const cam=Math.round(S.cam*RS)/RS,P=S.p,live=S.state==='prep'||S.state==='wave';
  buildLights();
  x.save();view(x);
  dl(x,SKY,0,0);
  if(MAP.storm&&S.bolt>0){x.fillStyle=`rgba(220,220,255,${S.bolt*.6})`;x.fillRect(0,0,W,H);let lx=290,ly=26;
    for(let i=0;i<8;i++){const nx=lx+rnd(-6,6);x.fillStyle='#fffbe0';x.fillRect(Math.round(Math.min(lx,nx)),ly,Math.abs(nx-lx)+1,1);x.fillRect(Math.round(nx),ly,1,5);lx=nx;ly+=5}}
  drawRays();drawSkyLife();
  // the camera sits on the device pixel grid: sliding the pixelated canvas by CSS made dithered layers shimmer
  CAMF=0;dl(x,FAR,lay(PAR[0]),0);drawFarLife();if(!CFG.lite)fog(128,.16,.3);
  dl(x,MID,lay(PAR[1]),0);drawMidLife();if(!CFG.lite)fog(150,.12,.6);
  dl(x,NEAR,lay(PAR[2]),0);
  for(let i=0;i<(MAP.day?10:18);i++){const fx=(hs(i,5)*W+S.t*(6+hs(i,6)*8))%W,fy=60+hs(i,7)*90+Math.sin(S.t*1.5+i)*6;if(Math.sin(S.t*3+i*2)>-.2)r(fx,fy,1,1,'#fff4a0')}
  x.save();x.translate(-cam,0);
  dl(x,GROUND,0,0);r(cam-2,H,W+6,-VY+2,shade(MAP.pal.fill,-.78));drawGFalls();
  const gc=S.wet>.3?'#8affb0':MAP.mossTop||MAP.pal.top1;
  for(const t of MAP.tufts){if(t.x<cam-4||t.x>cam+W+4)continue;const l=Math.sin(S.t*2.2+t.x*.07)>.25?1:0;r(t.x,t.y-t.h,1,t.h,gc);r(t.x+l,t.y-t.h-1,1,1,gc)}
  for(const v of MAP.vines)for(let i=0;i<v.len;i++){const px=v.x+Math.sin(S.t*1.3+v.x+i*.3)*i*.08;r(px,v.y+i,1,1,'#2f9a5a');if(i%3===1)r(px+1,v.y+i,1,1,gc)}
  drawProps();drawPuddles();drawHomeDyn();drawLinks();drawStoryWorld();drawGoal();drawMini();drawBarriers();
  MAP.slots.forEach((s,i)=>{const t=S.tw[i];drawSoil(s);
    if(!t){r(s.x,s.y-6,1,3,'#5fe08a');r(s.x-1,s.y-6,1,1,'#5fe08a');r(s.x+1,s.y-5,1,1,'#5fe08a');if(S.sel>=0&&live&&(S.t*4|0)%2)ring(s.x,s.y-6,6,'#f7c948')}
    if(live&&Math.abs(s.x-P.x)<12&&Math.abs(s.y-P.y)<3){const b=(S.t*4|0)%2;r(s.x-8,s.y-4-b,2,1,'#f7c948');r(s.x+6,s.y-4-b,2,1,'#f7c948');
      x.font='7px "Pixelify Sans", monospace';x.textAlign='center';const lbl={boa:'boa terra',pedra:'pedregoso',espinho:'espinhos'}[s.soil];
      x.fillStyle='#000';x.fillText(lbl,s.x+1,s.y+9);x.fillStyle=SOIL_MSG[s.soil][1];x.fillText(lbl,s.x,s.y+8)}
    if(!t||t.grow<=0)return;
    drawTree(t,s,i);
    if(t.grow<1)return;
    if(t.rare&&Math.sin(S.t*5+i)>.6)r(s.x+rnd(-8,8),s.y-rnd(6,28),1,1,'#fff6c0');
    for(let l=0;l<(t.lvl||0);l++)r(s.x-4+l*3,s.y+4,2,1,'#f7c948');
    const top=s.y-(t.kinds[0]==='mostarda'&&t.age>=2?60:Math.max(...t.kinds.map(k=>TREE[k].h*TREE[k].b*(t.szv||.55)))+8|0);
    if((t.water||0)<3&&live&&Math.abs(s.x-P.x)<40){const f=(t.water||0)%1;r(s.x-6,s.y+4,12,2,'#0a1a30');r(s.x-6,s.y+4,Math.round(12*f),2,'#5ab0ff');for(let k=0;k<3;k++)r(s.x-6+k*5,s.y+7,3,1,k<(t.water|0)?'#5ab0ff':'#2a3a50')}
    if(t.joio){if((S.t*3|0)%2)r(s.x-1,top+6,3,3,'#d8d860');return}
    // the stomp power: a striped bar under the tree fills up; when full it shines and an arrow over the tree says "stomp here"
    const ch=Math.max(0,Math.min(1,1-t.dcd/6)),bx=s.x-7,by=s.y+1;r(bx-.5,by-.5,15,3,'#1a0c10');r(bx,by,14,2,'#3a2418');
    for(let q=0;q<14*ch;q+=.5)r(bx+q,by,.5,2,(((q*2|0)+(S.t*8|0))%4<2)?'#f7c948':'#c8901a');
    if(t.dcd<=0){const ay=top-3+Math.round(Math.sin(S.t*6)*1.5);x.globalAlpha=.5+.4*Math.sin(S.t*8);r(bx,by,14,2,'#fff3a0');x.globalAlpha=1;
      r(s.x-3,ay,7,2,'#1a0c10');r(s.x-2,ay+2,5,1,'#1a0c10');r(s.x-1,ay+3,3,1,'#1a0c10');r(s.x-1,ay-4,3,4,'#1a0c10');
      r(s.x-.5,ay-3.5,2,4,'#f7c948');r(s.x-2.5,ay,6,1,'#f7c948');r(s.x-1.5,ay+1,4,1,'#f7c948');r(s.x-.5,ay+2,2,1,'#f7c948');r(s.x-.5,ay-3.5,1,3,'#fff3a0');
      if(live&&Math.abs(s.x-P.x)<34&&P.y>s.y-60&&P.y<s.y+12){x.font='700 6px "Pixelify Sans", monospace';x.textAlign='center';x.lineJoin='round';x.lineWidth=2;x.strokeStyle='#1a0806';x.strokeText('pisão ↓',s.x,ay-6);x.fillStyle='#ffe36a';x.fillText('pisão ↓',s.x,ay-6)}}
  });
  drawPortals();drawRanges();drawCorpses();for(const e of S.en)drawEnemy(e);
  drawSea();drawDragPreview();
  if(S.state!=='title')drawGardener(P);
  drawTutWorld();
  drawProj();drawBeams();drawDrops();drawFruitDrops();drawParts();drawVfx();
  for(const e of S.en)if(!(e.dive>0)&&!(S.mini==='escuro'&&!darkVisible(e)))drawIntent(e);
  x.textAlign='center';
  for(const p of S.pops){const k=p.size>8?1+Math.max(0,.14-p.t)*5:1;x.globalAlpha=Math.min(1,(1-p.t/.9)*2);x.save();x.translate(p.x,p.y-p.t*22);x.scale(k,k);
    // floating numbers and words get a solid dark outline so they read over any background
    x.font=`700 ${p.size}px "Pixelify Sans", monospace`;x.lineJoin='round';x.lineWidth=2.6;x.strokeStyle='#1a0806';x.strokeText(p.txt,0,0);x.fillStyle=p.c;x.fillText(p.txt,0,0);x.restore()}
  x.globalAlpha=1;
  x.restore();
  if(S.wx==='mist'&&!CFG.lite){fog(166,.24,1.05);fog(180,.2,1.25)}
  drawWater();
  if(S.night>.01){dx.globalCompositeOperation='source-over';dx.clearRect(0,0,W+1,H);dx.fillStyle=`rgba(${MAP.night},${S.night})`;dx.fillRect(0,0,W+1,H);
    dx.globalCompositeOperation='destination-out';for(const L of LIGHTS)glowBlob(dx,{x:L.x-cam,y:L.y+VY,r:L.r*1.3,c:'#000',a:L.a},1.8);
    dx.globalCompositeOperation='source-over';dl(x,dc,0,-VY)}
  for(const f of S.fx)if(f.k==='shock'&&!CFG.lite){const cx=f.x-cam,cy=f.y,R=f.r;x.save();x.beginPath();x.arc(cx,cy,R+7,0,Math.PI*2);x.arc(cx,cy,Math.max(0,R-7),0,Math.PI*2,true);x.clip();
    x.translate(cx,cy);x.scale(1.07,1.07);x.translate(-cx,-cy);x.drawImage(cv,0,-VY,W+1,H);x.restore();x.globalAlpha=.45*(1-f.t/.5);ring(cx,cy,R,'#ffffff');x.globalAlpha=1}
  if(S.sand>.01){x.fillStyle=`rgba(190,130,70,${S.sand*.42})`;x.fillRect(0,-VY,W+1,H)}
  drawOverlays();
  x.translate(0,-VY);drawFG();drawWeather();
  x.restore();
  if(S.comboShow>0){const a=Math.min(1,S.comboShow*2),sc=1+Math.max(0,S.comboShow-.75)*2;x.globalAlpha=a;x.save();x.translate(W/2,92);x.scale(sc,sc);
    x.font='700 26px "Pixelify Sans", monospace';x.lineJoin='round';x.lineWidth=4;x.strokeStyle='#1a0806';x.strokeText('x'+S.comboN,0,3);x.fillStyle='#a8401a';x.fillText('x'+S.comboN,0,3);x.strokeText('x'+S.comboN,0,0);x.fillStyle='#ffcb3a';x.fillText('x'+S.comboN,0,0);
    x.font='700 8px "Pixelify Sans", monospace';x.lineWidth=2.5;x.strokeText('ALELUIA +'+Math.min(S.comboN,25)*2+'% de dano',0,11);x.fillStyle='#fff3c0';x.fillText('ALELUIA +'+Math.min(S.comboN,25)*2+'% de dano',0,11);x.restore();x.globalAlpha=1}
  if(live){const mw=120,mx=(W-mw)/2,my=5,k=mw/MAP.ww;
    x.fillStyle='rgba(10,6,18,.7)';x.fillRect(mx-1,my-1,mw+2,8);
    x.fillStyle='rgba(255,255,255,.18)';x.fillRect(Math.round(mx+S.cam*k),my,Math.round(W*k),6);
    x.fillStyle='#f7c948';x.fillRect(mx,my+1,2,4);
    MAP.slots.forEach((s,i)=>{if(S.tw[i]){x.fillStyle=S.tw[i].joio?'#d8d860':'#5fe08a';x.fillRect(Math.round(mx+s.x*k),my+4,1,2)}});
    for(const e of S.en){const d=EN[e.k];x.fillStyle=d.boss||d.elite?'#f7c948':'#ff4f7b';x.fillRect(Math.round(mx+Math.min(e.x,MAP.ww)*k),my+(d.fly?1:3),d.boss?2:1,2)}
    x.fillStyle='#fff';x.fillRect(Math.round(mx+P.x*k),my+2,1,3)}
  if(S.lifeHit>0){x.fillStyle=`rgba(255,40,80,${S.lifeHit*.3})`;x.fillRect(0,0,W+1,H)}
  if(S.flash.a>0){x.save();x.globalCompositeOperation='lighter';x.fillStyle=`rgba(${S.flash.c},${S.flash.a})`;x.fillRect(0,0,W+1,H);x.restore()}
  if(MAP.day)x.globalAlpha=.45;x.drawImage(VIG,0,0,W+1,H);x.globalAlpha=1;subpixel(0);
  gx.clearRect(0,0,W+1,H);if(CFG.lite)return;gx.save();view(gx);gx.globalCompositeOperation='lighter';
  for(const L of LIGHTS)glowBlob(gx,{...L,x:L.x-cam});
  gx.translate(-cam,0);C=gx;
  for(const e of S.en){if(e.dive>0||S.mini==='escuro'&&!darkVisible(e))continue;gx.globalAlpha=e.flash>0?.75:e.frz>0?.4:.16;OV=e.flash>0?'#ffffff':e.frz>0?'#9fe8ff':EN[e.k].glow;enemyBody(e)}OV=null;gx.globalAlpha=1;
  drawProj();drawDrops();
  for(const p of S.parts){if(p.blink&&Math.sin(p.life*p.blink)<0)continue;gx.globalAlpha=partA(p);r(p.x,p.y,p.s,p.s,p.c)}gx.globalAlpha=1;drawRimGlow();
  for(const f of S.fx){if(f.k==='beam'){const a=1-f.t/f.max,w=f.w*a;gx.globalAlpha=a;r(f.x-w,0,w*2,gy(f.x),'#ff4f7b');gx.globalAlpha=1}
    else if(f.k==='ring'){gx.globalAlpha=1-f.t/.45;ring(f.x,f.y,f.r,f.c);gx.globalAlpha=1}}
  C=x;gx.restore();
}

// ---------- fruit emblems: the nine fruits as suits
const FEMB={
  Amor(){[[3,2,2],[7,2,2],[2,3,8],[2,4,8],[3,5,6],[4,6,4],[5,7,2]].forEach(([a,b,w])=>r(a,b,w,1,'#ff4f7b'));r(3,3,1,1,'#ffb0c8');r(5,1,2,1,'#f7c948')},
  Alegria(){[[5,2],[3,4],[6,4],[4,6],[7,6],[5,8]].forEach(([a,b])=>{r(a,b,2,2,'#9b4be0');r(a,b,1,1,'#d8a8ff')});r(6,0,1,2,'#5fe08a')},
  Paz(){for(let i=0;i<8;i++)r(2+i,8-i,1,1,'#7a6a4a');[[3,5],[5,3],[7,1],[4,8],[6,6]].forEach(([a,b])=>r(a,b,2,1,'#b8cf9a'))},
  Paciência(){r(4,3,4,6,'#6a2a5a');r(3,5,6,3,'#6a2a5a');r(4,4,1,2,'#a04a8a');r(5,1,2,2,'#5fae4a')},
  Benignidade(){for(let i=0;i<5;i++)r(3+i,2+i%2,1,7,i%2?'#d9802a':'#ffa64a');r(5,0,2,2,'#5fae4a')},
  Bondade(){[[5,1],[2,4],[8,4],[3,8],[7,8]].forEach(([a,b])=>r(a,b,2,2,'#ffc8e4'));r(5,5,2,2,'#ffd34a')},
  Fé(){r(5,6,2,2,'#e8e070');r(5,6,1,1,'#fff8b0');r(6,2,1,4,'#5fe08a');r(4,3,2,1,'#5fe08a')},
  Mansidão(){r(5,6,1,4,'#5fae4a');r(3,2,1,4,'#f4f4ff');r(7,2,1,4,'#f4f4ff');r(4,1,3,5,'#ffffff');r(5,4,1,1,'#ffd34a')},
  Domínio(){r(4,4,4,6,'#ff6a1a');r(5,2,2,3,'#ff6a1a');r(5,6,2,3,'#ffd34a');r(6,1,1,1,'#ffd34a')}
};
function embTo(cvs,f){const g=cvs.getContext('2d');g.clearRect(0,0,cvs.width,cvs.height);C=g;(FEMB[f]||(()=>{}))();C=x}
// card art: a little scene per type, the tree or symbol drawn large
const ART_BG={Amor:'#7a1e3a',Alegria:'#4a2370',Paz:'#3a5a3a',Paciência:'#2a4a2a',Benignidade:'#7a4a1a',Bondade:'#7a4a6a',Fé:'#6a6a1a',Mansidão:'#4a5a7a',Domínio:'#7a2a10'};
function cardArtTo(cvs,c){
  const g=cvs.getContext('2d'),I=info(c);g.clearRect(0,0,64,44);C=g;
  const T=I.type,f=I.fruits[0];
  if(I.kinds){// a little painted landscape like the battles: dithered sky warmed by the fruit's color, a cloud, a grassy hill, the tree outlined
    const B=layerBuf(cvs,'#000000',0,1,0),{d,w,h,k}=B,seed=(c.k||'x').length,hz=ART_BG[f]||'#3a2a4a';
    const SK=['#1b5a92','#2c88bf','#5cb8dc','#9ad6e6',mixHex('#d8f0e8',hz,.35)].map(u32),GR=['#1e5a44','#2c7a46','#4a9a3e','#7cbc46','#b0dc62'].map(u32),EA=['#3a2018','#5a3424','#7c4a34','#9a6444'].map(u32);
    for(let Y=0;Y<h;Y++)for(let X=0;X<w;X++){const u=(X+.5)/k,v=(Y+.5)/k,top=35+Math.sin(u*.11+seed)*2.2+Math.sin(u*.31)*.8;
      d[Y*w+X]=v<top?rp(SK,v/38,X,Y,1.5):v<top+2.4?rp(GR,.9-(v-top)/2.4*.5,X,Y,2):rp(EA,.65-(v-top)/12,X,Y,2)}
    pCloud(B,14+seed%30,9,22,8,seed,CLOUDS.day);putBuf(B);
    const off=mkHD(64,44,CK),og=off.getContext('2d');C=og;og.translate(32,40);og.scale(1.45,1.45);og.translate(-16,-30);
    if(c.hyb){drawTower(c.hyb[0],10,30,1);drawTower(c.hyb[1],22,30,1)}else drawTower(c.k,16,30,1);
    const sil=mkHD(64,44,CK),sg=sil.getContext('2d');sg.setTransform(1,0,0,1,0,0);sg.drawImage(off,0,0);sg.globalCompositeOperation='source-in';sg.fillStyle='#14241a';sg.fillRect(0,0,sil.width,sil.height);
    C=g;for(const[a,b]of[[-.5,0],[.5,0],[0,-.5],[0,.5]])g.drawImage(sil,a,b,64,44);g.drawImage(off,0,0,64,44)}
  else if(T==='bencao'){const gr=g.createRadialGradient(32,20,2,32,20,40);gr.addColorStop(0,'#fff0b0');gr.addColorStop(.4,'#d9a521');gr.addColorStop(1,'#3a2408');g.fillStyle=gr;g.fillRect(0,0,64,44);
    g.globalAlpha=.25;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.fillStyle='#fffbe0';g.beginPath();g.moveTo(32,20);g.lineTo(32+Math.cos(a)*60,20+Math.sin(a)*60);g.lineTo(32+Math.cos(a+.12)*60,20+Math.sin(a+.12)*60);g.fill()}g.globalAlpha=1;
    g.save();g.translate(32,22);g.scale(1.25,1.25);g.translate(-16,-16);ICONS[c.k]?ICONS[c.k]():0;g.restore()}
  else if(T==='parabola'){g.fillStyle='#e8d8b0';g.fillRect(0,0,64,44);for(let i=0;i<64;i+=2)for(let j=0;j<44;j+=2)if(hs(i,j)>.85)r(i,j,1,1,'#c8b088');
    r(0,0,64,2,'#a88a5a');r(0,42,64,2,'#a88a5a');for(let j=8;j<40;j+=6)r(4,j,10,1,'#c8b08888');for(let j=8;j<40;j+=6)r(50,j,10,1,'#c8b08888');
    g.save();g.translate(32,22);g.scale(1.25,1.25);g.translate(-16,-16);ICONS[c.k]?ICONS[c.k]():drawMostarda(16,30,2);g.restore()}
  else{g.fillStyle='#1e1e10';g.fillRect(0,0,64,44);for(let i=0;i<40;i++)r(hs(i,3)*64,hs(i,4)*44,2,1,'#3a3a1a');g.save();g.translate(32,40);g.scale(1.4,1.4);g.translate(-16,-30);drawJoio(16,30,0);g.restore()}
  if(c.rare){for(let i=0;i<6;i++)r(hs(i,9)*60+2,hs(i,8)*40+2,1,1,'#fff6c0')}
  C=x;
}

// ---------- world extras: branches, fallen fruit, story objects, intents
function drawLinks(){
  for(const l of S.links){const a=MAP.slots[l.i],b=MAP.slots[l.j];if(!l.pair&&!l.vine&&!l.cut&&(S.t*2|0)%2)continue;
    const n=Math.max(4,Math.hypot(b.x-a.x,b.y-a.y)/3|0),col=l.cut?'#ff6a3a':l.pair?'#f7c948':l.vine?'#5fe08a':'#ffffff44';
    if(l.cut&&(S.t*8|0)%2)continue;
    for(let k=0;k<=n;k++){const u=k/n;if(l.cut&&Math.abs(u-.5)<.14)continue;const px=a.x+(b.x-a.x)*u,py=a.y-12+(b.y-a.y)*u+Math.sin(u*Math.PI)*6;
      r(px,py,1,1,col);if(l.vine&&!l.cut&&k%4===2){r(px,py-1,1,1,'#9ff7b8');r(px+1,py-1,1,1,'#2f9a5a')}if(l.pair&&k%5===2&&Math.sin(S.t*4+k)>0)r(px,py-1,1,1,'#fff6c0')}}
}
function drawFruitDrops(){for(const f of S.fruitDrops){if(f.life-f.t<2&&(S.t*10|0)%2)continue;const c=LC[f.k]||'#ffd34a';disc(f.x,f.y,2,c);r(f.x-1,f.y-2,1,1,'#ffffff');r(f.x,f.y-3,1,1,'#5fae4a')}}
function drawStoryWorld(){
  if(S.forbid){const f=S.forbid,X=f.x,Y=f.y;r(X-2,Y-26,4,26,'#3a2418');r(X-6,Y-18,4,2,'#3a2418');
    blob(X,Y-32,14,9,'#2a1030','#4a1a4a',f.on?'#a040c0':'#6a2a6a',91);[[-7,-34],[5,-36],[0,-28],[8,-30],[-4,-38]].forEach(([a,b])=>{r(X+a,Y+b,3,3,'#c01830');r(X+a,Y+b,1,1,'#ff8a9a')});
    for(let i=0;i<22;i++){const sx=X+Math.sin(i*.6+S.t*1.5)*4,sy=Y-2-i;r(sx,sy,2,1,i%3?'#3a8a3a':'#5fb05a')}r(X+Math.sin(S.t*1.5+13)*4-3,Y-25,4,3,'#3a8a3a');r(X+Math.sin(S.t*1.5+13)*4-3,Y-24,1,1,'#ffd34a');
    if((S.t*3|0)%2)r(X+Math.sin(S.t*1.5+13)*4-5,Y-23,2,1,'#e0284a')}
  if(S.idol&&S.idol.hp>0){const X=S.idol.x,Y=S.idol.y;r(X-14,Y-6,28,6,'#8a7a6a');r(X-16,Y-8,32,2,'#a89a8a');
    x.save();x.translate(X+4,Y-6);x.scale(.7,.7);enemyBody({k:'bezerro',x:0,y:0,t:S.t*.2});x.restore();
    for(let i=0;i<3-S.idol.hp;i++)r(X-8+i*7,Y-20+i*3,1,6,'#3a2408');if(S.idol.t<2&&(S.t*6|0)%2)ring(X,Y-18,22,'#f7c948')}
  if(S.folk&&!S.folk.saved){const f=S.folk;for(let i=0;i<5;i++){const px=f.x-10+i*5,py=gy(px)-(MAP.sea&&px>=MAP.sea[0]&&px<MAP.sea[1]?0:0),b=(S.t*6+i)%2<1?1:0;
    r(px-1,py-7-b,3,6,['#c9a99a','#8aa0c8','#c8a0d8','#d8b080','#a0c090'][i]);r(px-1,py-10-b,3,3,'#d9a07a');r(px-1,py-11-b,3,1,'#5a3a2a');r(px-1,py-1,1,1,'#3a2418');r(px+1,py-1,1,1,'#3a2418')}}
}
const INTENT={pedra(X,Y){disc(X,Y,2,'#9a9aa8')},pragas(X,Y){r(X-2,Y-1,5,3,'#4cc46e');r(X-2,Y-2,1,1,'#4cc46e');r(X+2,Y-2,1,1,'#4cc46e')},
  mergulho(X,Y){for(let i=-3;i<=3;i++)r(X+i,Y+Math.round(Math.sin(i+S.t*6)),1,1,'#7ac0f0')},joio(X,Y){r(X,Y-3,1,6,'#d8d860');r(X-2,Y-2,2,1,'#d8d860');r(X+1,Y,2,1,'#d8d860')},
  divide(X,Y){r(X-3,Y-1,2,2,'#ffb060');r(X+2,Y-1,2,2,'#ffb060');r(X,Y,1,1,'#fff')},escudo(X,Y){r(X-2,Y-3,5,4,'#7a9aff');r(X-1,Y+1,3,1,'#7a9aff');r(X,Y+2,1,1,'#7a9aff')}};
function intentOf(e){
  if(e.k==='golias'&&e.st<1)return'pedra';if(e.k==='farao'&&e.st<1.2)return'pragas';if(e.k==='leviata'&&!(e.dive>0)&&e.st<1.4)return'mergulho';
  if(e.k==='impureza'&&!e.corrupted&&MAP.slots.some((s,i)=>S.tw[i]&&!S.tw[i].joio&&s.x<e.x&&e.x-s.x<40&&Math.abs(s.y-e.y)<5))return'joio';
  if(e.k==='contenda')return'divide';if(e.k==='faccoes')return'escudo';return null}
function drawIntent(e){const it=intentOf(e);if(!it)return;const d=EN[e.k],X=e.x,Y=(d.fly?e.y-d.h/2:e.y-d.h)-12-Math.abs(Math.sin(S.t*4))*2;
  r(X-5,Y-5,11,10,'#0009');r(X-5,Y-5,11,1,'#ffffff33');INTENT[it](X,Y);if(it==='pedra'||it==='mergulho'||it==='pragas'){if((S.t*8|0)%2)r(X+5,Y-6,1,3,'#ff4f4f')}}
function drawOverlays(){
  if(S.flood>0){const lv=Math.min(1,(6-S.flood)*2,S.flood*2),top=H-10-lv*70;x.globalAlpha=.5;x.fillStyle='#2a6aa8';x.fillRect(0,top,W,H-top);x.globalAlpha=1;
    for(let i=0;i<W;i+=4)r(i,top+Math.sin(S.t*3+i*.1)*1.5,3,1,'#bfe8ff')}
  if(S.babelOn>0){x.fillStyle='rgba(120,60,140,.14)';x.fillRect(0,-VY,W,H);x.font='8px "Pixelify Sans", monospace';x.fillStyle='#e0c0ff88';
    for(let i=0;i<10;i++)x.fillText('ʘΔλΣЖᚠᚦ'[(i+(S.t*3|0))%7],(hs(i,5)*W+S.t*10)%W,40+hs(i,6)*120)}
  if(MAPID==='getsemani'&&S.state==='wave'){}
}
function drawDragPreview(){if(S.dragSlot==null||S.dragSlot<0||!S.dragKinds)return;const s=MAP.slots[S.dragSlot];x.globalAlpha=.45+Math.sin(S.t*8)*.15;
  if(S.dragKinds.length>1){drawTower(S.dragKinds[0],s.x-4,s.y,S.t);drawTower(S.dragKinds[1],s.x+4,s.y,S.t)}else if(S.dragKinds[0]==='mostarda')drawMostarda(s.x,s.y,0);else drawTower(S.dragKinds[0],s.x,s.y,S.t);
  x.globalAlpha=1;ring(s.x,s.y-10,10,'#f7c948');x.font='7px "Pixelify Sans", monospace';x.textAlign='center';x.fillStyle=SOIL_MSG[s.soil][1];x.fillText(SOIL_MSG[s.soil][0],s.x,s.y+9)}

// ---------- farm tools in the gardener's hand (R mirrors with facing)
const TOOLS={
  enxada(R,sw,by){R(4+sw,-14+by,1,11,'#8a5236');R(4+sw,-15+by,3,1,'#9aa0b0');R(6+sw,-15+by,1,2,'#9aa0b0')},
  foice(R,sw,by){R(4+sw,-14+by,1,11,'#8a5236');R(5+sw,-16+by,3,1,'#c9c9d0');R(8+sw,-15+by,1,2,'#c9c9d0');R(7+sw,-13+by,1,1,'#c9c9d0')},
  forcado(R,sw,by){R(4+sw,-17+by,1,14,'#8a5236');R(3+sw,-18+by,3,1,'#9aa0b0');R(3+sw,-21+by,1,3,'#9aa0b0');R(4+sw,-21+by,1,3,'#9aa0b0');R(5+sw,-21+by,1,3,'#9aa0b0')},
  arado(R,sw,by){R(4,-10+by,6,1,'#8a5236');R(9,-9+by,1,5,'#8a5236');R(8,-4+by,4,2,'#9aa0b0');R(11,-5+by,1,1,'#d0d0d8')}
};
function drawBarriers(){
  for(const m of S.muds){x.globalAlpha=Math.min(1,m.t);r(m.x-15,m.y-1,30,2,'#5a3a20');r(m.x-12,m.y-2,24,1,'#6a4428');if(Math.sin(S.t*3+m.x)>.7)r(m.x+rnd(-10,10),m.y-3,2,1,'#8a6a4a');x.globalAlpha=1}
  if(S.fire){const X=S.fire.x;for(let i=0;i<5;i++){const h=8+((Math.sin(S.t*12+i*1.7)+1)*6|0),fx=X-6+i*3,fy=gy(fx);r(fx,fy-h,3,h,'#e0402a');r(fx+1,fy-h+3,1,h-3,'#ffa040');r(fx+1,fy-3,1,3,'#ffe36a')}if(Math.random()<.5)S.parts.push({x:X+rnd(-6,6),y:gy(X)-10,vx:rnd(-6,6),vy:rnd(-40,-20),g:-20,life:.5,max:.5,c:Math.random()<.5?'#ff6a1a':'#ffd34a',s:1})}
  for(const f of S.fences){const X=f.x,Y=f.y,dmg=1-f.hp/f.max;if(f.stone){r(X-7,Y-13,14,13,'#1a1a22');r(X-6,Y-12,12,12,'#7a7a88');r(X-6,Y-12,12,2,'#b8b8c8');r(X+4,Y-12,2,12,'#5a5a68');r(X-4,Y-7,6,1,'#5a5a68');if(dmg>.5)r(X-1,Y-12,1,6,'#2a2a32');continue}r(X-5,Y-14,2,14,'#8a5a2a');r(X+3,Y-14,2,14,'#8a5a2a');r(X-6,Y-12,12,2,'#b07a40');r(X-6,Y-6,12,2,'#b07a40');r(X-5,Y-15,2,1,'#c9a060');r(X+3,Y-15,2,1,'#c9a060');
    if(dmg>.4)r(X-1,Y-12,1,2,'#3a2010');if(dmg>.7)r(X+1,Y-6,1,2,'#3a2010')}
  for(const s of S.scares){const X=s.x,Y=s.y,sw=Math.sin(S.t*3)*1;if(s.t<3&&(S.t*8|0)%2)continue;r(X,Y-24,1,24,'#8a5a2a');r(X-7+sw,Y-19,15,1,'#8a5a2a');r(X-3,Y-20,7,8,'#c23b4f');r(X-2,Y-26,5,5,'#e8c86a');r(X-4,Y-27,9,1,'#d9b45a');r(X-2,Y-29,5,2,'#d9b45a');
    r(X-1,Y-24,1,1,'#111');r(X+1,Y-24,1,1,'#111');r(X-8+sw,Y-18,2,2,'#e8c86a');r(X+7+sw,Y-18,2,2,'#e8c86a');if(Math.sin(S.t*2)>.5)r(X-10,Y-30,1,1,'#2a2030')}
}
