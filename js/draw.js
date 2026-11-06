// ---------- sprites: the gardener
function drawGardener(p){
  const f=p.face,X=p.x,Y=p.y,moving=Math.abs(p.vx)>8&&p.on,fr=moving?(p.anim|0)%4:0,air=!p.on;
  const pal=CHARS[RUN?RUN.char:'lavrador'].pal;
  if(p.faint>0){C.fillStyle='#0004';r(X-7,Y-1,14,1,'#0004');r(X-6,Y-4,10,4,pal.tunic);r(X+4,Y-5,4,4,'#d9a07a');r(X-8,Y-3,3,2,'#5a3a2a');for(let i=0;i<3;i++){const a=S.t*5+i*2.1;r(X+6+Math.cos(a)*5,Y-9+Math.sin(a)*2,1,1,'#ffe36a')}return}
  if(p.inv>0&&(S.t*20|0)%2)return;
  C.save();C.translate(X,Y);C.scale(1/p.sq**.5,p.sq);C.translate(-X,-Y);
  const R=(dx,dy,w,h,c)=>r(f>0?X+dx:X-dx-w,Y+dy,w,h,c);
  const by=(fr===1||fr===3?-1:0)+(air?-1:0);
  if(air){R(-2,-5,2,3,'#5a3a2a');R(1,-4,2,3,'#5a3a2a');R(-2,-3,2,1,'#3a2418');R(1,-2,2,1,'#3a2418')}
  else{const L=[[-2,0],[-3,1],[-2,0],[-1,0]][fr],G=[[1,0],[2,0],[1,0],[0,1]][fr];
    R(L[0],-4,2,4-L[1],'#5a3a2a');R(L[0],-1-L[1],2,1,'#3a2418');R(G[0],-4,2,4-G[1],'#5a3a2a');R(G[0],-1-G[1],2,1,'#3a2418')}
  R(-3,-11+by,7,7,pal.tunic);if(pal.coat){R(-3,-10+by,7,1,'#f7c948');R(-3,-8+by,7,1,'#2a5bd7');R(-3,-6+by,7,1,'#5fe08a')}R(-3,-11+by,1,7,'#0003');R(-3,-7+by,7,1,'#8a5236');
  R(-1,-15+by,5,4,'#d9a07a');R(2,-14+by,1,1,'#2a1810');
  if(pal.beard)R(0,-12+by,4,3,pal.beard);else R(-1,-12+by,5,1,'#5a3a2a');
  const hy=by+(p.vy<-60?-2:p.vy<0?-1:0)+(moving&&fr===2?-1:0);
  if(pal.hat){R(-4,-16+hy,9,1,'#d9b45a');R(-2,-18+hy,5,2,pal.hat);R(-2,-17+hy,5,1,pal.band);if(moving||air)R(-5,-16+hy+(fr%2),1,1,'#d9b45a')}
  else{R(-1,-16+hy,5,2,pal.hair);R(-2,-15+hy,1,3,pal.hair);if(pal.scarf){R(-2,-16+hy,6,2,pal.scarf);R(-3,-15+hy,1,5,pal.scarf)}}
  if(p.slam){R(0,-26+by,1,12,'#8a5236');R(-1,-27+by,3,1,'#9aa0b0');R(-1,-26+by,1,2,'#9aa0b0');R(-2,-15+by,2,3,'#d9a07a');R(1,-15+by,2,3,'#d9a07a')}
  else{const sw=moving?[0,1,0,-1][fr]:0,sv=p.swing>0?1-p.swing/.22:-1,wk=(typeof META!=='undefined'&&META.weapon)||'enxada';
    if(sv>=0&&wk!=='arado'){const a=-1.7+sv*2.8;for(let j=0;j<12;j++)R(2+Math.cos(a)*j,-10+by+Math.sin(a)*j,1,1,'#8a5236');R(1+Math.cos(a)*12,-11+by+Math.sin(a)*12,3,3,'#d0d0d8')}
    else TOOLS[wk](R,sw,by);R(2,-9+by,2,2,'#d9a07a')}
  C.restore();
  if(p.stun>0)for(let i=0;i<3;i++){const a=S.t*6+i*2.1;r(X+Math.cos(a)*6,Y-22+Math.sin(a)*2,1,1,'#ffe36a')}
}

// ---------- sprites: enemies and bosses
function drawEnemy(e){
  const d=EN[e.k];
  if(e.dive>0){for(let i=0;i<4;i++)r(e.x-16+i*10+Math.sin(S.t*6+i)*2,e.y-3-((S.t*20+i*7)%6),2,1,'#bfe8ff');return}
  OV=d.glow;for(const[ox,oy]of[[-1,0],[1,0],[0,-1],[0,1]]){x.translate(ox,oy);enemyBody(e);x.translate(-ox,-oy)}
  OV=e.flash>0?'#ffffff':e.frz>0?'#a8ecff':null;enemyBody(e);OV=null;
  if(e.shield){x.globalAlpha=.35+Math.sin(S.t*6)*.1;ring(e.x,ecy(e),Math.max(d.w,d.h)/2+3,'#9ab0ff');x.globalAlpha=1}
  if(e.hp<e.max&&!d.boss){const w=Math.min(24,d.w+2),top=(d.fly?e.y-d.h/2:e.y-d.h)-6;r(e.x-w/2,top,w,2,'#2a0c14');r(e.x-w/2,top,Math.max(0,w*e.hp/e.max),2,d.elite?'#f7c948':'#ff4f7b')}
}
function frog(X,Y,t,c1,c2){const hop=Math.max(0,Math.sin(t*5))*4,yy=Y-hop;
  r(X-5,yy-6,10,5,c1);r(X-4,yy-2,8,1,c2);r(X-5,yy-8,3,3,c1);r(X-1,yy-8,3,3,c1);r(X-4,yy-7,1,1,'#111');r(X,yy-7,1,1,'#111');r(X+3,yy-2,3,2,c2)}
function enemyBody(e){
  const X=e.x,Y=e.y,t=e.t;
  switch(e.k){
    case 'odio':{const b=Math.abs(Math.sin(t*5))*3,Yb=Y-b;
      r(X-4,Yb-7,9,7,'#8a1428');r(X-4,Yb-7,9,1,'#c0283f');r(X-5,Yb-4,1,3,'#8a1428');r(X+5,Yb-4,1,3,'#8a1428');
      r(X-4,Yb-9,1,2,'#2a0008');r(X+4,Yb-9,1,2,'#2a0008');
      r(X-3,Yb-5,2,1,'#ffd34a');r(X+1,Yb-5,2,1,'#ffd34a');r(X-3,Yb-6,2,1,'#2a0008');r(X+1,Yb-6,2,1,'#2a0008');r(X-2,Yb-2,4,1,'#2a0008');break}
    case 'inveja':{const f=(t*20|0)%2;
      r(X-7,Y-3+f*2,4,2,'#2f5a22');r(X+4,Y-3+f*2,4,2,'#2f5a22');r(X-8,Y-2+f*2,1,2,'#2f5a22');r(X+8,Y-2+f*2,1,2,'#2f5a22');
      r(X-3,Y-3,7,6,'#7fd04a');r(X-2,Y-2,5,4,'#e8ffe0');r(X-2+Math.round(Math.sin(t*2)),Y-1,2,2,'#1a3a10');r(X-3,Y-3,7,1,'#4f9a2a');break}
    case 'discordia':case 'contendinha':{const f=(t*16|0)%2,c=e.k==='discordia'?'#ff8a3c':'#d06a2a';
      r(X-3,Y-6,5,5,c);r(X-3,Y-7,1,1,c);r(X+1,Y-7,1,1,c);r(X-2,Y-5,1,1,'#111');r(X,Y-5,1,1,'#111');
      r(X+2,Y-4,2,1,'#c0501a');r(X+4,Y-5,1,1,'#c0501a');r(X-2,Y-1,1,1+f,'#c0501a');r(X,Y-1,1,2-f,'#c0501a');break}
    case 'contenda':{const f=(t*10|0)%2;
      r(X-6,Y-9,5,8,'#d06a2a');r(X+1,Y-9,5,8,'#b05a20');r(X-1,Y-8,2,1,'#ffb060');
      r(X-5,Y-7,1,1,'#111');r(X-3,Y-7,1,1,'#111');r(X+2,Y-7,1,1,'#111');r(X+4,Y-7,1,1,'#111');r(X-4,Y-4,2,1,'#2a0a00');r(X+3,Y-4,2,1,'#2a0a00');
      r(X-5,Y-1,1,1+f,'#7a3a10');r(X-2,Y-1,1,2-f,'#7a3a10');r(X+2,Y-1,1,1+f,'#7a3a10');r(X+5,Y-1,1,2-f,'#7a3a10');break}
    case 'gula':{const m=(Math.sin(t*6)+1)*1.5|0,w=(t*5|0)%2;
      r(X-9,Y-13,18,12,'#6a3f96');r(X-8,Y-14,16,1,'#8e5bc0');r(X-7,Y-12,6,2,'#8e5bc0');r(X-6,Y-1,4,1+w,'#4a2a6a');r(X+3,Y-1,4,2-w,'#4a2a6a');
      r(X-9,Y-8,8,2+m,'#2a0a2a');r(X-8,Y-8,1,1,'#fff');r(X-5,Y-8,1,1,'#fff');r(X-7,Y-11,2,2,'#ffd34a');r(X-3,Y-11,2,2,'#ffd34a');r(X-12,Y-7+m,2,2,'#e0284a');break}
    case 'feitico':{const f=(t*10|0)%2;
      r(X-4,Y-4,8,7,'#2a8a9a');r(X-3,Y-5,6,1,'#5ad6e0');r(X-3,Y-2,2,2,'#e0ffff');r(X+1,Y-2,2,2,'#e0ffff');r(X-1,Y+1,2,1,'#0a3a44');
      r(X+4,Y-2+f,3,3,'#5ad6e0');r(X+7,Y-1-f,2,2,'#2a8a9a');r(X+9,Y,1,1,'#5ad6e0');break}
    case 'ambicao':{const b=Math.abs(Math.sin(t*4))*2,Yb=Y-b;
      r(X-8,Yb-15,16,15,'#7a2a3a');r(X-7,Yb-16,14,1,'#a43a50');r(X-6,Yb-11,3,2,'#ffd34a');r(X+1,Yb-11,3,2,'#ffd34a');r(X-4,Yb-6,7,1,'#2a0a14');
      r(X-7,Yb-19,14,3,'#f7c948');r(X-7,Yb-21,2,2,'#f7c948');r(X-1,Yb-22,2,3,'#f7c948');r(X+5,Yb-21,2,2,'#f7c948');r(X-1,Yb-18,2,1,'#e0284a');
      r(X+7,Yb-6,4,4,'#c9921a');r(X+8,Yb-7,2,1,'#f7c948');break}
    case 'embriaguez':{const tl=Math.round(Math.sin(t*3)*2);
      r(X-4+tl,Y-10,8,9,'#8a2050');r(X-3+tl,Y-11,6,1,'#b0306a');r(X-3+tl,Y-8,2,2,'#ffd0e0');r(X+1+tl,Y-7,2,2,'#ffd0e0');r(X-2+tl,Y-8,1,1,'#2a0010');r(X+2+tl,Y-6,1,1,'#2a0010');
      r(X-1+tl,Y-4,3,1,'#2a0010');r(X+4+tl,Y-8,3,5,'#6a4a2a');r(X+5+tl,Y-10,1,2,'#6a4a2a');r(X-3,Y-1,2,1,'#5a1030');r(X+1,Y-1,2,1,'#5a1030');
      if((t*2|0)%3===0)r(X+tl,Y-14-((t*8)%4),1,1,'#ffd0e0');break}
    case 'impureza':{const w=Math.sin(t*4)*1;
      r(X-6,Y-8+w,12,7,'#4a4a1a');r(X-5,Y-9+w,10,1,'#6a6a2a');r(X-4,Y-7+w,2,2,'#d8d860');r(X+1,Y-7+w,2,2,'#d8d860');r(X-3,Y-4+w,6,1,'#1a1a08');
      for(let i=0;i<4;i++)r(X-6+i*4,Y-1,2,1+((t*6+i)|0)%2,'#3a3a10');r(X+6,Y-5+w,2,1,'#6a6a2a');r(X-8,Y-4+w,2,1,'#6a6a2a');break}
    case 'faccoes':{const b=Math.abs(Math.sin(t*6))*1;
      r(X-3,Y-9-b,7,8,'#4a5aa0');r(X-3,Y-9-b,7,1,'#7a9aff');r(X-2,Y-7-b,1,1,'#fff');r(X+1,Y-7-b,1,1,'#fff');r(X-5,Y-7-b,2,5,'#2a3a7a');r(X-6,Y-6-b,1,3,'#7a9aff');
      r(X-2,Y-1,1,1,'#1a2050');r(X+2,Y-1,1,1,'#1a2050');break}
    case 'bezerro':{const w=(t*4|0)%2;
      [-10,-6,3,7].forEach((lx,i)=>r(X+lx,Y-9,3,9-((i+w)%2)*2,'#c9921a'));
      r(X-12,Y-19,22,11,'#f7c948');r(X-12,Y-19,22,2,'#fff0a0');r(X-11,Y-10,20,2,'#c9921a');
      r(X-19,Y-24,8,9,'#f7c948');r(X-19,Y-24,8,1,'#fff0a0');r(X-21,Y-19,3,4,'#e0b030');r(X-21,Y-17,1,1,'#7a5010');
      r(X-19,Y-27,1,3,'#fff0a0');r(X-13,Y-27,1,3,'#fff0a0');r(X-20,Y-28,1,1,'#fff0a0');r(X-12,Y-28,1,1,'#fff0a0');
      r(X-16,Y-21,2,1,'#ff3d3d');r(X+10,Y-18,1,7,'#c9921a');r(X+10,Y-11,2,2,'#c9921a');break}
    case 'golias':{const w=(t*3|0)%2,rage=e.ph2;
      r(X-6,Y-12,4,12-w,'#8a6a3a');r(X+2,Y-12,4,11+w,'#8a6a3a');r(X-6,Y-6,4,3,'#c9a24a');r(X+2,Y-6,4,3,'#c9a24a');
      r(X-8,Y-26,16,15,'#8a7a5a');for(let j=0;j<14;j+=3)r(X-8,Y-25+j,16,1,'#a8986a');r(X-8,Y-14,16,2,'#5a3a20');
      r(X-5,Y-34,10,8,'#d9a07a');r(X-6,Y-36,12,4,'#c9a24a');r(X-1,Y-38,2,2,'#e0284a');r(X-4,Y-31,2,1,rage?'#ff2020':'#2a1810');r(X+1,Y-31,2,1,rage?'#ff2020':'#2a1810');r(X-4,Y-28,8,2,'#5a3a20');
      r(X-12,Y-24,4,12,'#a07a3a');r(X-12,Y-24,4,1,'#c9a24a');r(X+8,Y-40,1,32,'#6a4a2a');r(X+7,Y-44,3,5,'#c9c9d0');
      r(X-11,Y-30+Math.sin(t*4)*1,3,3,'#8a8a8a');break}
    case 'farao':{
      frog(X-28,Y,t,'#4cc46e','#2d8a4a');frog(X-19,Y,t+.6,'#4cc46e','#2d8a4a');r(X-22,Y-7,10,1,'#7a4b2a');
      r(X-12,Y-17,24,10,'#d9a521');r(X-12,Y-17,24,2,'#ffe08a');r(X-12,Y-12,24,1,'#2a5bd7');r(X-12,Y-9,24,1,'#2a5bd7');
      const cx=X+3,cy=Y-6;for(let i=0;i<24;i++){const a=i/24*Math.PI*2;r(cx+Math.cos(a)*6,cy+Math.sin(a)*6,1,1,'#ffe08a')}
      for(let k=0;k<4;k++){const a=-t*4+k*Math.PI/4;for(let j=1;j<6;j++){r(cx+Math.cos(a)*j,cy+Math.sin(a)*j,1,1,'#b07a1a');r(cx-Math.cos(a)*j,cy-Math.sin(a)*j,1,1,'#b07a1a')}}
      r(X-6,Y-26,7,9,'#c78b5a');r(X-8,Y-29,11,4,'#f7c948');r(X-8,Y-28,11,1,'#2a5bd7');r(X-8,Y-26,2,7,'#f7c948');r(X+1,Y-26,2,7,'#f7c948');
      r(X-8,Y-24,2,1,'#2a5bd7');r(X+1,Y-24,2,1,'#2a5bd7');r(X-5,Y-24,1,1,e.ph2?'#ff2020':'#111');r(X-5,Y-19,2,4,'#2a5bd7');r(X-3,Y-31,2,2,'#ff4f7b');
      r(X-12,Y-24,1,7,'#7a4b2a');r(X-16+Math.sin(t*6)*2,Y-25,4,1,'#7a4b2a');break}
    case 'leviata':{
      for(let i=9;i>=0;i--){const cx=X+4+i*5,cy=Y-8-Math.sin(t*3+i*.8)*5,rad=Math.max(2,6-i*.4)|0;disc(cx,cy,rad,i%2?'#2a6a7a':'#1e5260');r(cx-1,cy+rad-1,3,1,'#7ac0b0')}
      r(X-14,Y-18,16,10,'#2a6a7a');r(X-14,Y-18,16,2,'#3a8a9a');r(X-18,Y-13,6,5,'#2a6a7a');
      for(let i=0;i<4;i++)r(X-17+i*2,Y-9,1,2,'#ffffff');r(X-10,Y-16,2,2,e.ph2?'#ff2020':'#ffd34a');
      for(let i=0;i<4;i++)r(X-8+i*4,Y-21-(i%2),2,3,'#5af0c0');break}
  }
}

// ---------- sprites: trees
function drawTower(k,X,Y,t,tr){
  switch(k){
    case 'videira':
      r(X-7,Y-22,2,22,'#6b3b2a');r(X+5,Y-22,2,22,'#6b3b2a');r(X-8,Y-22,16,2,'#8a5236');r(X-6,Y-14,12,1,'#8a5236');
      blob(X-3,Y-19,6,4,'#1f6b3a','#2f9a5a','#5fe08a',3);blob(X+3,Y-16,5,4,'#1f6b3a','#2f9a5a','#5fe08a',7);blob(X-1,Y-9,4,3,'#1f6b3a','#2f9a5a','#5fe08a',8);
      [[-5,-13],[3,-11],[0,-17]].forEach(([dx,dy])=>{r(X+dx-1,Y+dy,3,2,'#7b2fbf');r(X+dx,Y+dy+2,2,2,'#6a24a8');r(X+dx,Y+dy+4,1,1,'#6a24a8');r(X+dx-1,Y+dy,1,1,'#c58cff')});break;
    case 'roma':
      r(X-1,Y-12,3,12,'#7a3e2e');r(X-3,Y-1,7,1,'#5a2a20');r(X+1,Y-9,3,1,'#7a3e2e');blob(X,Y-20,9,7,'#1c5a33','#2f9a5a','#6fe09a',11);
      [[-5,-18],[4,-23],[3,-15],[-2,-25],[-6,-13]].forEach(([dx,dy])=>{r(X+dx-1,Y+dy-1,3,3,'#e0284a');r(X+dx-1,Y+dy-1,1,1,'#ff9aa8');r(X+dx,Y+dy-2,1,1,'#f7c948')});break;
    case 'oliveira':
      r(X-1,Y-10,3,10,'#7d6a5a');r(X-3,Y-7,2,3,'#7d6a5a');r(X+1,Y-14,2,5,'#7d6a5a');blob(X,Y-19,10,6,'#4f6b48','#7f9a6e','#b8cf9a',23);
      [[-6,-18],[5,-20],[1,-15],[-2,-23],[7,-16]].forEach(([dx,dy])=>{r(X+dx,Y+dy,2,2,'#2a2a3a');r(X+dx,Y+dy,1,1,'#6a6a8a')});break;
    case 'sarca':
      blob(X,Y-5,8,5,'#1c4a2a','#2f7a3a','#4faa50',31);
      for(let i=0;i<6;i++){const fx=X-6+i*2.4,h=4+((Math.sin(t*12+i*1.7)+1)*3|0);r(fx,Y-6-h,2,h,'#ff6a1a');r(fx,Y-5-h,1,h-2,'#ffd34a')}break;
    case 'figueira':
      r(X-1,Y-12,3,12,'#6a4a3a');r(X-4,Y-10,3,2,'#6a4a3a');blob(X,Y-18,11,7,'#2a5a2a','#3f8a3a','#7ac050',51);
      [[-6,-15],[4,-19],[0,-13],[-3,-22],[7,-14]].forEach(([dx,dy])=>{r(X+dx,Y+dy,2,3,'#6a2a5a');r(X+dx,Y+dy,1,1,'#a04a8a')});
      if(tr&&tr.charge>1){const n=Math.min(6,tr.charge|0);for(let i=0;i<n;i++)r(X-8+i*3,Y-28-((t*10+i*3)%5),1,1,'#c8f080')}break;
    case 'tamareira':
      for(let i=0;i<26;i++)r(X-1+Math.sin(i*.12)*1.5,Y-i,3,1,i%3?'#8a6a3a':'#6a4a2a');
      for(let a=0;a<6;a++){const an=-Math.PI*.95+a*Math.PI*.38;for(let j=0;j<11;j++)r(X+Math.cos(an)*j,Y-26+Math.sin(an)*j+j*j*.07,2,1,a%2?'#3f8a3a':'#5faa4a')}
      r(X-3,Y-24,2,4,'#d9802a');r(X+2,Y-24,2,4,'#d9802a');r(X-1,Y-23,2,3,'#ffa64a');break;
    case 'amendoeira':
      r(X-1,Y-13,3,13,'#4a3028');r(X-4,Y-11,3,1,'#4a3028');r(X+2,Y-14,3,1,'#4a3028');blob(X,Y-19,10,6,'#d8b0c8','#f0d0e0','#ffffff',61);
      for(let i=0;i<7;i++)r(X-8+hs(i,61)*16,Y-24+hs(i,62)*10,1,1,'#ff8ac0');r(X-3,Y-15,2,1,'#c8a070');r(X+4,Y-17,2,1,'#c8a070');break;
    case 'lirio':
      for(let i=0;i<5;i++){const lx=X-6+i*3,h=6+(i%2)*4+Math.round(Math.sin(t*2+i)*.6);r(lx,Y-h,1,h,'#3f8a3a');r(lx-1,Y-3-(i%3),1,2,'#5faa4a');
        r(lx-1,Y-h-2,3,2,'#ffffff');r(lx,Y-h-3,1,1,'#ffffff');r(lx,Y-h-1,1,1,'#ffd34a')}break;
    case 'mostarda':drawMostarda(X,Y,2);break;
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
  pomba(){r(8,14,14,6,'#f4f4ff');r(20,12,5,5,'#f4f4ff');r(23,14,1,1,'#111');r(25,15,2,1,'#e0a040');r(6,10,8,4,'#d8d8f0');blob(26,22,3,2,'#4f6b48','#7f9a6e','#b8cf9a',23)},
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
function enemyIconTo(cvs,k){const g=cvs.getContext('2d');g.clearRect(0,0,48,48);C=g;const d=EN[k];g.save();const sc=d.boss||d.elite?.9:1.6;g.translate(24,44);g.scale(sc,sc);
  enemyBody({k,x:0,y:d.fly?-d.h/2-2:0,t:1});g.restore();C=x}

// ---------- frame
const dc=mkCanvas(W,H),dx=dc.getContext('2d');
const LC={videira:'#a05ae8',roma:'#ff4f7b',oliveira:'#d8f0a8',sarca:'#ff8a2a',mostarda:'#f7d050',figueira:'#9ae060',tamareira:'#ffa64a',amendoeira:'#ffc8e4',lirio:'#f4f4ff'};
let LIGHTS=[];
const easeBack=g=>1+2.70158*Math.pow(g-1,3)+1.70158*Math.pow(g-1,2);
const HOMEY={tree:118,tabernacle:158,pillar:120,rahab:146,altar:150,rock:150,tomb:150};
function view(ctx){ctx.translate(S.sx,S.sy);if(S.zoom>1.005){const fx=S.zoomTo.x-S.cam,fy=S.zoomTo.y;ctx.translate(fx,fy);ctx.scale(S.zoom,S.zoom);ctx.translate(-fx,-fy)}}
function buildLights(){
  const L=[],P=S.p;
  MAP.slots.forEach((s,i)=>{const t=S.tw[i];if(!t||t.grow<=.35||t.joio)return;const big=t.kinds[0]==='mostarda'&&t.age>=2;
    t.kinds.forEach(k=>L.push({x:s.x,y:s.y-(big?40:14),r:(k==='sarca'?42+Math.sin(S.t*23+i)*5+rnd(-2,2):big?64:30)*(1+t.pulse*.6+(t.lvl||0)*.1)*Math.min(1,t.grow)*(relic('lampada')?1.25:1),c:LC[k],a:k==='sarca'?.65:.5}))});
  for(const f of S.fx){if(f.k==='beam')L.push({x:f.x,y:110,r:120,c:'#ff4f7b',a:.9*(1-f.t/f.max)});if(f.k==='ring')L.push({x:f.x,y:f.y,r:f.r+12,c:f.c,a:.35*(1-f.t/.45)})}
  for(const e of S.en){const d=EN[e.k];if(d.boss||d.elite)L.push({x:e.x,y:e.y-14,r:56,c:d.glow,a:.5});else if(e.k==='feitico')L.push({x:e.x,y:e.y,r:16,c:'#5af0ff',a:.5})}
  if(S.state!=='title')L.push({x:P.x,y:P.y-8,r:30,c:'#ffd8a0',a:.22});
  L.push({x:18,y:HOMEY[MAP.home],r:MAP.home==='pillar'?60:44,c:MAP.home==='pillar'?'#ff8a2a':'#ffe36a',a:.35+Math.sin(S.t*2)*.08});
  if(S.forbid)L.push({x:S.forbid.x,y:S.forbid.y-30,r:S.forbid.on?50:28,c:'#c070ff',a:S.forbid.on?.6:.35});
  if(S.idol&&S.idol.hp>0)L.push({x:S.idol.x,y:S.idol.y-16,r:46,c:'#f7c948',a:.45});
  if(MAPID==='tumulo')L.push({x:518,y:86,r:110,c:'#fff0b0',a:.6+Math.sin(S.t*1.5)*.1});
  for(const f of S.fruitDrops)L.push({x:f.x,y:f.y,r:10,c:LC[f.k]||'#ffd34a',a:.5});
  LIGHTS=L;
}
function glowBlob(ctx,L,mul=1){if(L.r<=1)return;const g=ctx.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r);g.addColorStop(0,L.c);g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.globalAlpha=Math.min(1,L.a*mul);ctx.fillStyle=g;ctx.fillRect(L.x-L.r,L.y-L.r,L.r*2,L.r*2);ctx.globalAlpha=1}
function drawRays(){
  const nk=1-S.night;if(nk<.05||MAP.rays==='none')return;
  x.save();x.globalCompositeOperation='lighter';
  if(MAP.rays==='eden'){for(let i=0;i<5;i++){const span=W+220,bx=((i*120-S.cam*.3)%span+span)%span-110,a=(.045+.025*Math.sin(S.t*.7+i*2))*nk;
    x.fillStyle=`rgba(255,205,150,${a})`;x.beginPath();x.moveTo(bx,0);x.lineTo(bx+16,0);x.lineTo(bx+86,178);x.lineTo(bx+52,178);x.fill()}}
  else{for(let i=0;i<6;i++){const a=(.03+.02*Math.sin(S.t*.9+i*1.7))*nk*(S.bolt>0?3:1),bx=150+i*42+Math.sin(S.t*.3+i)*6;
    x.fillStyle=`rgba(190,180,255,${a})`;x.beginPath();x.moveTo(284+i*2,42);x.lineTo(288+i*2,42);x.lineTo(bx+22,216);x.lineTo(bx,216);x.fill()}}
  x.restore();
}
function fog(y,a,spd){for(let k=0;k<3;k++){const span=W+260,bx=((k*200-S.cam*spd+S.t*5)%span+span)%span-130;
  x.save();x.translate(bx,y);x.scale(1,.18);const g=x.createRadialGradient(0,0,0,0,0,130);g.addColorStop(0,`rgba(${MAP.fog},${a})`);g.addColorStop(1,`rgba(${MAP.fog},0)`);
  x.fillStyle=g;x.fillRect(-130,-130,260,260);x.restore()}}
function drawWater(){
  if(!MAP.water)return;const[a,b]=MAP.water,y=gy(a),sx=Math.round(a-S.cam),w=b-a;if(sx>W||sx+w<0)return;
  x.save();x.setTransform(1,0,0,1,0,0);
  for(let j=0;j<16;j++){const off=Math.round(Math.sin(S.t*3+j*.9)*(1+j*.08));x.globalAlpha=.6-j*.03;x.drawImage(cv,sx,(y-1-j*1.2)|0,w,1,sx+off,y+1+j,w,1)}
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
  else if(h==='pillar'){for(let j=0;j<60;j++){const w=6+Math.sin(S.t*8+j*.4)*2+(j>50?(j-50):0);r(18-w/2+Math.sin(S.t*5+j*.3)*2,150-j,w,1,j%5<2?'#ffd34a':hit?'#ff4f7b':'#ff6a1a')}}
  else if(h==='rahab'){x.globalAlpha=.6+Math.sin(S.t*2)*.3;r(12,144,8,8,hit?'#ff4f7b':'#ffd070');x.globalAlpha=1}
  else if(h==='altar'){for(let i=0;i<5;i++){const fh=4+((Math.sin(S.t*10+i*1.3)+1)*3|0);r(10+i*3,148-fh,2,fh,i%2?'#ff6a1a':'#ffd34a')}}
  else if(h==='tomb'){for(let i=0;i<12;i++){const a=i/12*Math.PI*2,fx=518+Math.cos(a)*24+Math.sin(S.t+i)*1,fy=88+Math.sin(a)*14;r(fx,fy,2,2,['#ff4f7b','#c58cff','#b8cf9a','#7ac050','#ffa64a','#ffc8e4','#e8e070','#ffffff','#ff9a3c','#ff4f7b','#5af0ff','#f7c948'][i])}}
  else if(h==='rock'){x.globalAlpha=.6+Math.sin(S.t*2)*.3;r(15,148,6,6,hit?'#ff4f7b':'#ffe36a');x.globalAlpha=1}
}
function drawPuddles(){if(S.wet<.05)return;x.globalAlpha=S.wet*.85;
  for(const p of MAP.puddles){r(p.x,p.y-1,p.w,2,'#3a6aa0');r(p.x+1,p.y-1,p.w-3,1,'#9ad0ff');if(Math.sin(S.t*4+p.x)>.6)r(p.x+((S.t*10)%p.w),p.y-1,1,1,'#ffffff')}x.globalAlpha=1}
function drawFG(){const c='#0a0410';
  for(const f of MAP.fgItems){const fx=Math.round(f.x-S.cam*FGK);if(fx<-50||fx>W+50)continue;
    if(f.t==='vine'){for(let i=0;i<f.len;i++){const px=fx+Math.sin(S.t*1.1+f.s+i*.15)*i*.06;r(px,i,2,1,c);if(i%4===2){r(px-3,i,3,2,c);r(px+2,i+1,3,1,c)}}blob(fx,0,12,7,c,c,'#16081e',f.s+90)}
    else if(f.t==='fern'){for(let b=0;b<6;b++){const an=Math.PI*(.25+b*.08)+Math.sin(S.t*1.4+f.s+b)*.05,dir=b%2?1:-1;for(let j=0;j<22;j++)r(fx+Math.cos(an)*j*dir,H-Math.sin(an)*j+j*j*.02,2,1,c)}}
    else if(f.t==='rock')blob(fx,H,18,12,c,c,'#16081e',f.s+95);
    else if(f.t==='frond'){for(let b=0;b<4;b++){const an=.3+b*.25,dir=b%2?1:-1;for(let j=0;j<26;j++)r(fx+j*Math.cos(an)*dir,j*Math.sin(an)+j*j*.03+Math.sin(S.t+b)*j*.03,2,1,c)}}}
}
function drawTree(t,s,i){
  if(t.grow<.35){const h=1+t.grow*12|0;r(s.x,s.y-2-h,1,h,'#5fe08a');r(s.x-1,s.y-3-h,1,1,'#9ff7b8');r(s.x+1,s.y-2-h,1,1,'#5fe08a');return}
  if(t.joio){drawJoio(s.x,s.y,S.t);return}
  const e=easeBack(Math.min(1,(t.grow-.35)/.65)),lv=1+(t.lvl||0)*.08;
  x.save();x.translate(s.x,s.y);const sway=Math.sin(S.t*1.6+i*1.3)*.035+t.pulse*.1*Math.sin(S.t*30);x.transform(1,0,-sway,1,0,0);
  x.scale((.55+.45*e)*(1-t.pulse*.05)*lv,(.35+.65*e)*(1+t.pulse*.1)*lv);x.translate(-s.x,-s.y);
  if(t.stun>0)OV='#6a7a9a';else if(t.seduced)OV='#d9a521';else if(t.sleep)OV='#4a5070';
  if(t.kinds.length>1){drawTower(t.kinds[0],s.x-4,s.y,t.t,t);drawTower(t.kinds[1],s.x+4,s.y,t.t,t)}
  else if(t.kinds[0]==='mostarda')drawMostarda(s.x,s.y,t.age);
  else drawTower(t.kinds[0],s.x,s.y,t.t,t);
  OV=null;x.restore();
  if(t.sleep)for(let i=0;i<3;i++){const zx=s.x+6+i*3,zy=s.y-30-i*5-((S.t*6)%4);r(zx,zy,3,1,'#c0d0ff');r(zx+1,zy+1,1,1,'#c0d0ff');r(zx,zy+2,3,1,'#c0d0ff')}
  if(t.ark>0){x.globalAlpha=.4+Math.sin(S.t*5)*.2;ring(s.x,s.y-14,16,'#f7c948');x.globalAlpha=1}
}
function drawParts(){for(const p of S.parts){x.globalAlpha=Math.min(1,p.life/p.max*1.5)*(p.a??1);r(p.x,p.y,p.s,p.s,p.c)}x.globalAlpha=1}
const PCOL={grape:['#7b2fbf','#c58cff'],oil:['#d9c24a','#fff3a0'],seed:['#e8e070','#fff'],mustard:['#c9c040','#fff8a0'],sow:['#e8c86a','#fff'],fig:['#6a2a5a','#c070b0'],date:['#d9802a','#ffc080'],almond:['#e8d0b0','#fff'],pstone:['#9a9aa8','#e0e0e8']};
function drawProj(){for(const p of S.proj){const c=PCOL[p.kind],s=p.kind==='mustard'||p.kind==='fig'?4:3;r(p.x-1,p.y-1,s,s,c[0]);r(p.x-1,p.y-1,1,1,c[1])}
  for(const s of S.eproj){r(s.x-2,s.y-2,4,4,'#7a7a80');r(s.x-2,s.y-2,2,1,'#c9c9d0')}}
function drawBeams(){for(const f of S.fx){
  if(f.k==='beam'){const a=1-f.t/f.max,w=f.w*a;x.globalAlpha=a;r(f.x-w,0,w*2,gy(f.x),'#ff4f7b');r(f.x-w/3,0,w*2/3,gy(f.x),'#fff0f4');x.globalAlpha=1;
    if(Math.random()<.5)S.parts.push({x:f.x+rnd(-f.w,f.w),y:rnd(20,gy(f.x)),vx:0,vy:-20,g:0,life:.3,max:.3,c:'#ff9aa8',s:1})}
  else if(f.k==='ring'){x.globalAlpha=1-f.t/.45;ring(f.x,f.y,f.r,f.c);ring(f.x,f.y,f.r*.8,f.c);x.globalAlpha=1}
  else if(f.k==='bird'){const w=(S.t*12|0)%2;r(f.x-2,f.y-w,2,1,'#2a2030');r(f.x,f.y,1,1,'#2a2030');r(f.x+1,f.y-w,2,1,'#2a2030')}
  else if(f.k==='swing'){const a=1-f.t/f.max;x.globalAlpha=a;const n=f.wide?14:9;for(let i=0;i<=n;i++){const an=(-1.2+i/n*2.2)*(f.wide?1.2:1);r(f.x+f.f*Math.cos(an)*f.r,f.y+Math.sin(an)*f.r*(f.wide?1:.6),2,1,'#ffffff')}x.globalAlpha=1}
  else if(f.k==='zap'){const n=20;for(let i=0;i<=n;i++){const u=i/n;r(f.x1+(f.x2-f.x1)*u+rnd(-2,2),f.y1+(f.y2-f.y1)*u+rnd(-2,2),2,1,i%2?'#c070ff':'#ffffff')}}
  else if(f.k==='heart'&&f.t>0){const k=Math.min(1,f.t/f.max),hx=f.x+(18-f.x)*k,hy=f.y+(130-f.y)*k-Math.sin(k*Math.PI)*30;r(hx-1,hy,1,1,'#ff8a8a');r(hx+1,hy,1,1,'#ff8a8a');r(hx-1,hy+1,3,1,'#ff6a6a');r(hx,hy+2,1,1,'#ff6a6a')}}}
function drawDrops(){for(const d of S.drops){if(d.t>10&&(S.t*10|0)%2)continue;const b=Math.sin(d.t*6);if(d.coin){const w=Math.abs(Math.cos(d.t*5))*2+1|0;r(d.x-w/2,d.y-2+b,w,4,'#f7c948');r(d.x-w/2,d.y-2+b,1,1,'#fff6c0');continue}r(d.x-1,d.y-1+b,3,3,'#c58cff');r(d.x-1,d.y-1+b,1,1,'#fff')}}
function draw(){
  if(!S)return;
  const sh=S.shake;S.sx=Math.round(rnd(-sh,sh));S.sy=Math.round(rnd(-sh,sh));
  const cam=Math.round(S.cam),P=S.p,live=S.state==='prep'||S.state==='wave';
  buildLights();
  x.save();view(x);
  x.drawImage(SKY,0,0);
  if(MAP.storm&&S.bolt>0){x.fillStyle=`rgba(220,220,255,${S.bolt*.6})`;x.fillRect(0,0,W,H);let lx=290,ly=26;
    for(let i=0;i<8;i++){const nx=lx+rnd(-6,6);x.fillStyle='#fffbe0';x.fillRect(Math.round(Math.min(lx,nx)),ly,Math.abs(nx-lx)+1,1);x.fillRect(Math.round(nx),ly,1,5);lx=nx;ly+=5}}
  drawRays();
  x.drawImage(FAR,-Math.round(S.cam*PAR[0]),0);if(!CFG.lite)fog(128,.16,.3);
  x.drawImage(MID,-Math.round(S.cam*PAR[1]),0);if(!CFG.lite)fog(150,.12,.6);
  x.drawImage(NEAR,-Math.round(S.cam*PAR[2]),0);
  for(let i=0;i<18;i++){const fx=(hs(i,5)*W+S.t*(6+hs(i,6)*8))%W,fy=60+hs(i,7)*90+Math.sin(S.t*1.5+i)*6;if(Math.sin(S.t*3+i*2)>-.2)r(fx,fy,1,1,'#fff4a0')}
  x.save();x.translate(-cam,0);
  x.drawImage(GROUND,0,0);
  const gc=S.wet>.3?'#8affb0':MAP.pal.top1;
  for(const t of MAP.tufts){if(t.x<cam-4||t.x>cam+W+4)continue;const l=Math.sin(S.t*2.2+t.x*.07)>.25?1:0;r(t.x,t.y-t.h,1,t.h,gc);r(t.x+l,t.y-t.h-1,1,1,gc)}
  for(const v of MAP.vines)for(let i=0;i<v.len;i++){const px=v.x+Math.sin(S.t*1.3+v.x+i*.3)*i*.08;r(px,v.y+i,1,1,'#2f9a5a');if(i%3===1)r(px+1,v.y+i,1,1,gc)}
  drawPuddles();drawHomeDyn();drawLinks();drawStoryWorld();drawBarriers();
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
    const top=s.y-(t.kinds[0]==='mostarda'&&t.age>=2?60:t.kinds.includes('tamareira')?42:36);
    if(t.joio){if((S.t*3|0)%2)r(s.x-1,top+6,3,3,'#d8d860');return}
    if(t.dcd<=0){const b=Math.sin(S.t*6)>0?1:0;r(s.x-1,top-b,3,1,'#f7c948');r(s.x,top+1-b,1,2,'#f7c948')}
    else{r(s.x-6,s.y+2,12,1,'#2a0c14');r(s.x-6,s.y+2,12*(1-t.dcd/6),1,'#f7c948')}
  });
  for(const e of S.en)drawEnemy(e);
  drawSea();drawDragPreview();
  if(S.state!=='title')drawGardener(P);
  drawProj();drawBeams();drawDrops();drawFruitDrops();drawParts();
  for(const e of S.en)if(!(e.dive>0))drawIntent(e);
  x.textAlign='center';
  for(const p of S.pops){const k=p.size>8?1+Math.max(0,.14-p.t)*5:1;x.globalAlpha=Math.min(1,(1-p.t/.9)*2);x.save();x.translate(p.x,p.y-p.t*22);x.scale(k,k);
    x.font=`700 ${p.size}px "Pixelify Sans", monospace`;x.fillStyle='#000';x.fillText(p.txt,1,1);x.fillStyle=p.c;x.fillText(p.txt,0,0);x.restore()}
  x.globalAlpha=1;
  x.restore();
  drawWater();
  if(S.night>.01){dx.globalCompositeOperation='source-over';dx.clearRect(0,0,W,H);dx.fillStyle=`rgba(${MAP.night},${S.night})`;dx.fillRect(0,0,W,H);
    dx.globalCompositeOperation='destination-out';for(const L of LIGHTS)glowBlob(dx,{x:L.x-cam,y:L.y,r:L.r*1.3,c:'#000',a:L.a},1.8);
    dx.globalCompositeOperation='source-over';x.drawImage(dc,0,0)}
  for(const f of S.fx)if(f.k==='shock'&&!CFG.lite){const cx=f.x-cam,cy=f.y,R=f.r;x.save();x.beginPath();x.arc(cx,cy,R+7,0,Math.PI*2);x.arc(cx,cy,Math.max(0,R-7),0,Math.PI*2,true);x.clip();
    x.translate(cx,cy);x.scale(1.07,1.07);x.translate(-cx,-cy);x.drawImage(cv,0,0);x.restore();x.globalAlpha=.45*(1-f.t/.5);ring(cx,cy,R,'#ffffff');x.globalAlpha=1}
  if(S.sand>.01){x.fillStyle=`rgba(190,130,70,${S.sand*.42})`;x.fillRect(0,0,W,H)}
  drawOverlays();
  drawFG();
  x.restore();
  if(S.comboShow>0){const a=Math.min(1,S.comboShow*2),sc=1+Math.max(0,S.comboShow-.75)*2;x.globalAlpha=a;x.save();x.translate(W/2,92);x.scale(sc,sc);
    x.font='700 26px "Pixelify Sans", monospace';x.fillStyle='#6a2a1a';x.fillText('x'+S.comboN,0,3);x.fillStyle='#f7c948';x.fillText('x'+S.comboN,0,0);
    x.font='8px "Pixelify Sans", monospace';x.fillStyle='#fff3c0';x.fillText('ALELUIA +'+Math.min(S.comboN,25)*2+'% de dano',0,11);x.restore();x.globalAlpha=1}
  if(live){const mw=120,mx=(W-mw)/2,my=5,k=mw/MAP.ww;
    x.fillStyle='rgba(10,6,18,.7)';x.fillRect(mx-1,my-1,mw+2,8);
    x.fillStyle='rgba(255,255,255,.18)';x.fillRect(Math.round(mx+S.cam*k),my,Math.round(W*k),6);
    x.fillStyle='#f7c948';x.fillRect(mx,my+1,2,4);
    MAP.slots.forEach((s,i)=>{if(S.tw[i]){x.fillStyle=S.tw[i].joio?'#d8d860':'#5fe08a';x.fillRect(Math.round(mx+s.x*k),my+4,1,2)}});
    for(const e of S.en){const d=EN[e.k];x.fillStyle=d.boss||d.elite?'#f7c948':'#ff4f7b';x.fillRect(Math.round(mx+Math.min(e.x,MAP.ww)*k),my+(d.fly?1:3),d.boss?2:1,2)}
    x.fillStyle='#fff';x.fillRect(Math.round(mx+P.x*k),my+2,1,3)}
  if(S.lifeHit>0){x.fillStyle=`rgba(255,40,80,${S.lifeHit*.3})`;x.fillRect(0,0,W,H)}
  if(S.flash.a>0){x.save();x.globalCompositeOperation='lighter';x.fillStyle=`rgba(${S.flash.c},${S.flash.a})`;x.fillRect(0,0,W,H);x.restore()}
  x.drawImage(VIG,0,0);
  gx.clearRect(0,0,W,H);if(CFG.lite)return;gx.save();view(gx);gx.globalCompositeOperation='lighter';
  for(const L of LIGHTS)glowBlob(gx,{...L,x:L.x-cam});
  gx.translate(-cam,0);C=gx;
  gx.globalAlpha=.32;for(const e of S.en){if(e.dive>0)continue;OV=EN[e.k].glow;enemyBody(e)}OV=null;gx.globalAlpha=1;
  drawProj();drawDrops();
  for(const p of S.parts){gx.globalAlpha=Math.min(1,p.life/p.max*1.5)*(p.a??1);r(p.x,p.y,p.s,p.s,p.c)}gx.globalAlpha=1;
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
function embTo(cvs,f){const g=cvs.getContext('2d');g.clearRect(0,0,12,12);C=g;(FEMB[f]||(()=>{}))();C=x}
// card art: a little scene per type, the tree or symbol drawn large
const ART_BG={Amor:'#7a1e3a',Alegria:'#4a2370',Paz:'#3a5a3a',Paciência:'#2a4a2a',Benignidade:'#7a4a1a',Bondade:'#7a4a6a',Fé:'#6a6a1a',Mansidão:'#4a5a7a',Domínio:'#7a2a10'};
function cardArtTo(cvs,c){
  const g=cvs.getContext('2d'),I=info(c);g.clearRect(0,0,64,44);C=g;
  const T=I.type,f=I.fruits[0];
  if(I.kinds){const gr=g.createLinearGradient(0,0,0,44);gr.addColorStop(0,'#120c22');gr.addColorStop(.75,ART_BG[f]||'#3a2a4a');gr.addColorStop(1,'#f0a050');g.fillStyle=gr;g.fillRect(0,0,64,44);
    for(let i=0;i<10;i++)r(hs(i,c.k?c.k.length:3)*64,hs(i,7)*16,1,1,'#ffffff88');
    disc(48,30,6,'#ffd8a066');for(let i=0;i<64;i++)r(i,36+Math.sin(i*.15+(c.uid||1))*2,1,10,'#1a0e1a');r(0,40,64,4,'#2a1418');r(0,39,64,1,'#5fe08a');
    g.save();g.translate(32,40);g.scale(1.45,1.45);g.translate(-16,-30);
    if(c.hyb){drawTower(c.hyb[0],10,30,1);drawTower(c.hyb[1],22,30,1)}else drawTower(c.k,16,30,1);g.restore()}
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
  if(S.babelOn>0){x.fillStyle='rgba(120,60,140,.14)';x.fillRect(0,0,W,H);x.font='8px "Pixelify Sans", monospace';x.fillStyle='#e0c0ff88';
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
function toolIconTo(cvs,k){const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;g.save();g.translate(16,30);g.scale(2,2);g.translate(-8,-1);const R=(dx,dy,w,h,c)=>r(4+dx,dy,w,h,c);TOOLS[k](R,0,0);g.restore();C=x}
function drawBarriers(){
  for(const m of S.muds){x.globalAlpha=Math.min(1,m.t);r(m.x-15,m.y-1,30,2,'#5a3a20');r(m.x-12,m.y-2,24,1,'#6a4428');if(Math.sin(S.t*3+m.x)>.7)r(m.x+rnd(-10,10),m.y-3,2,1,'#8a6a4a');x.globalAlpha=1}
  for(const f of S.fences){const X=f.x,Y=f.y,dmg=1-f.hp/f.max;r(X-5,Y-14,2,14,'#8a5a2a');r(X+3,Y-14,2,14,'#8a5a2a');r(X-6,Y-12,12,2,'#b07a40');r(X-6,Y-6,12,2,'#b07a40');r(X-5,Y-15,2,1,'#c9a060');r(X+3,Y-15,2,1,'#c9a060');
    if(dmg>.4)r(X-1,Y-12,1,2,'#3a2010');if(dmg>.7)r(X+1,Y-6,1,2,'#3a2010')}
  for(const s of S.scares){const X=s.x,Y=s.y,sw=Math.sin(S.t*3)*1;if(s.t<3&&(S.t*8|0)%2)continue;r(X,Y-24,1,24,'#8a5a2a');r(X-7+sw,Y-19,15,1,'#8a5a2a');r(X-3,Y-20,7,8,'#c23b4f');r(X-2,Y-26,5,5,'#e8c86a');r(X-4,Y-27,9,1,'#d9b45a');r(X-2,Y-29,5,2,'#d9b45a');
    r(X-1,Y-24,1,1,'#111');r(X+1,Y-24,1,1,'#111');r(X-8+sw,Y-18,2,2,'#e8c86a');r(X+7+sw,Y-18,2,2,'#e8c86a');if(Math.sin(S.t*2)>.5)r(X-10,Y-30,1,1,'#2a2030')}
}
function barrierIconTo(cvs,k){const g=cvs.getContext('2d');g.clearRect(0,0,32,32);C=g;const keep=S;S={t:1,muds:[],fences:[],scares:[]};
  if(k==='cerca')S.fences=[{x:16,y:28,hp:30,max:30}];if(k==='espantalho')S.scares=[{x:16,y:30,t:10}];if(k==='lama')S.muds=[{x:16,y:24,t:10}];
  g.save();if(k==='lama'){g.translate(16,24);g.scale(1,2);g.translate(-16,-24)}drawBarriers();g.restore();S=keep;C=x}
