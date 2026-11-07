// ---------- characters drawn on a half-unit grid (twice the detail of the world pixels), shaded from the top left.
// Coordinates below are in half units from the feet (or, for flyers, from the body center).
const SK='#e8b08a',SKD='#c4805c',INK='#1a0c10';

// shaded ellipse: dark base, mid body shifted up-left, a small highlight
function ball(P,cx,cy,rx,ry,dark,mid,lite){
  const row=(y0,ry2,rx2,c,ox=0)=>{for(let dy=-ry2;dy<=ry2;dy++){const w=Math.round(rx2*Math.sqrt(Math.max(0,1-dy*dy/(ry2*ry2+.01))));if(w>0)P(cx+ox-w,y0+dy,w*2,1,c)}};
  row(cy,ry,rx,dark);row(cy-1,ry-1,rx-1,mid,-1);row(cy-Math.round(ry*.45),Math.max(1,Math.round(ry*.3)),Math.max(1,Math.round(rx*.35)),lite,-Math.round(rx*.35))}

// ---------- the gardener
function gardenerBody(p){
  const f=p.face,X=p.x,Y=p.y,moving=Math.abs(p.vx)>8&&p.on,fr=moving?(p.anim|0)%4:0,air=!p.on;
  const pal=CHARS[RUN?RUN.char:'lavrador'].pal,tun=pal.tunic,tD=shade(tun,-.28),tL=shade(tun,.22);
  const G=(dx,dy,w,h,c)=>{dx/=2;dy/=2;w/=2;h/=2;r(f>0?X+dx:X-dx-w,Y+dy,w,h,c)};
  const R=(dx,dy,w,h,c)=>r(f>0?X+dx:X-dx-w,Y+dy,w,h,c);
  const idle=!moving&&!air&&Math.sin(S.t*2.6)>.5?1:0,B=((fr===1||fr===3)?-1:0)+(air?-2:0)+idle;
  // legs and boots
  if(air){G(-4,-9,3,5,'#4a3428');G(1,-8,3,5,'#4a3428');G(-5,-5,4,2,'#2a1810');G(1,-4,4,2,'#2a1810')}
  else{const L=[[-4,0],[-6,1],[-4,0],[-2,0]][fr],F=[[1,0],[3,0],[1,0],[-1,1]][fr];
    for(const[lx,lift]of[L,F]){G(lx,-9,3,8-lift,'#4a3428');G(lx,-9,1,8-lift,'#3a2820');G(lx-1,-2-lift,5,2,'#2a1810');G(lx+2,-2-lift,2,1,'#4a2e1e')}}
  // back arm, tunic, belt
  G(-8,-22+B,3,9,tD);G(-8,-14+B,3,2,SKD);
  G(-6,-23+B,12,14,tun);G(-6,-23+B,2,14,tD);G(4,-22+B,1,11,tL);G(-7,-11+B,14,2,tD);
  if(pal.coat){['#f7c948','#2a5bd7','#5fe08a','#e0284a'].forEach((c,i)=>G(-6,-21+B+i*3,12,1,c))}
  G(-6,-15+B,12,2,'#5a3420');G(1,-15+B,2,2,'#e0b050');
  // head
  G(-4,-33+B,9,10,SK);G(-4,-24+B,9,1,SKD);G(-4,-33+B,1,9,SKD);G(-2,-29+B,2,3,SKD);
  G(3,-29+B,1,2,'#1a0e0a');G(2,-31+B,3,1,shade(pal.hair||'#5a3a2a',-.2));G(5,-28+B,1,2,SKD);G(2,-27+B,1,1,'#f09a80');
  if(pal.beard){G(-1,-27+B,7,4,pal.beard);G(0,-23+B,5,1,pal.beard);G(2,-26+B,2,1,'#8a4a3a')}else G(2,-25+B,2,1,'#8a4a3a');
  const hy=B+(p.vy<-60?-3:p.vy<0?-1:0)+(moving&&fr===2?-1:0);
  if(pal.hat){G(-5,-32+B,2,5,pal.hair||'#5a3a2a');G(-9,-34+hy,18,2,'#d9b45a');G(-9,-34+hy,18,1,'#f0d488');G(-4,-38+hy,9,4,pal.hat);G(-4,-35+hy,9,1,pal.band);G(-3,-38+hy,3,1,shade(pal.hat,.25));
    if(moving||air)G(-10,-33+hy+(fr%2),1,2,'#d9b45a')}
  else{G(-5,-35+hy,10,3,pal.hair);G(-5,-33+hy,3,7,pal.hair);G(3,-33+hy,3,1,pal.hair);G(-3,-35+hy,3,1,shade(pal.hair,.25));
    if(pal.scarf){G(-5,-36+hy,11,4,pal.scarf);G(-7,-33+hy,3,9+(moving?fr%2:0),pal.scarf);G(-4,-36+hy,3,1,shade(pal.scarf,.3))}}
  // front arm and tool (tools are drawn on the world grid, which reads well at this size)
  if(p.slam){R(0,-26+B/2,1,12,'#8a5236');R(-1,-27+B/2,3,1,'#9aa0b0');R(-1,-26+B/2,1,2,'#9aa0b0');G(-4,-31+B,3,5,SK);G(2,-31+B,3,5,SK)}
  else{const sw=moving?[0,1,0,-1][fr]:0,sv=p.swing>0?1-p.swing/.22:-1,wk=(typeof META!=='undefined'&&META.weapon)||'enxada',by=B/2;
    if(sv>=0&&wk!=='arado'){const a=-1.7+sv*2.8;for(let j=0;j<12;j++)R(2+Math.cos(a)*j,-10+by+Math.sin(a)*j,1,1,'#8a5236');R(1+Math.cos(a)*12,-11+by+Math.sin(a)*12,3,3,'#d0d0d8')}
    else TOOLS[wk](R,sw,by);
    G(1,-21+B,3,6,tun);G(1,-21+B,3,1,tL);G(2,-16+B,3,3,SK);G(2,-14+B,3,1,SKD)}
}
function drawGardener(p){
  const X=p.x,Y=p.y;
  if(p.faint>0){r(X-7,Y-1,14,1,'#0004');r(X-6,Y-4,10,4,CHARS[RUN?RUN.char:'lavrador'].pal.tunic);r(X+4,Y-5,4,4,SK);r(X-8,Y-3,3,2,'#4a3428');for(let i=0;i<3;i++){const a=S.t*5+i*2.1;r(X+6+Math.cos(a)*5,Y-9+Math.sin(a)*2,1,1,'#ffe36a')}return}
  if(p.inv>0&&(S.t*20|0)%2)return;
  C.save();C.translate(X,Y);C.scale(1/p.sq**.5,p.sq);C.translate(-X,-Y);
  OV=INK;for(const[ox,oy]of[[-.5,0],[.5,0],[0,-.5],[0,.5]]){C.translate(ox,oy);gardenerBody(p);C.translate(-ox,-oy)}OV=null;
  gardenerBody(p);C.restore();
  if(p.stun>0)for(let i=0;i<3;i++){const a=S.t*6+i*2.1;r(X+Math.cos(a)*6,Y-22+Math.sin(a)*2,1,1,'#ffe36a')}
}

// ---------- works of the flesh (all face left, toward the garden's home tree)
const SPR={
  odio(e){const t=e.t,hop=Math.abs(Math.sin(t*5)),P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2-hop*3,w/2,h/2,c);
    ball(P,0,-8,8,8,'#7a1020','#c0283f','#ff7a7a');
    P(-6,-17,2,3,'#2a0008');P(-7,-19,1,2,'#2a0008');P(4,-17,2,3,'#2a0008');P(5,-19,1,2,'#2a0008');
    P(-6,-12,4,1,'#2a0008');P(-5,-13,2,1,'#2a0008');P(0,-12,4,1,'#2a0008');
    P(-6,-11,3,2,'#ffd34a');P(-6,-11,1,2,'#2a0008');P(0,-11,3,2,'#ffd34a');P(0,-11,1,2,'#2a0008');
    P(-5,-6,7,2,'#2a0008');P(-4,-6,1,1,'#ffffff');P(0,-6,1,1,'#ffffff');
    r(e.x-3,e.y-.5,2,.5,'#5a0818');r(e.x+1,e.y-.5,2,.5,'#5a0818')},
  inveja(e){const t=e.t,f=(t*20|0)%2,P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2,w/2,h/2,c),look=Math.round(Math.sin(t*2));
    // bat wings: three scalloped ribs that flap together
    for(const s of[-1,1]){const wy=f?-5:1,W2=(dx,dy,w,h,c)=>P(s<0?-dx-w:dx,dy,w,h,c);
      W2(6,-3+wy*.4,5,3,'#2f5a22');W2(10,-5+wy*.7,5,3,'#2f5a22');W2(14,-7+wy,4,3,'#2f5a22');W2(6,-3+wy*.4,9,1,'#5a9a3a');
      W2(10,-2+wy*.7,1,2,'#1f4018');W2(14,-4+wy,1,2,'#1f4018');W2(17,-4+wy,1,2,'#1f4018')}
    ball(P,0,0,7,6,'#3a7a1a','#7fd04a','#c8f890');
    P(-5,-3,9,6,'#e8ffe0');P(-4,-4,7,1,'#e8ffe0');P(-4,3,7,1,'#c8e0c0');
    P(-3+look,-2,4,4,'#3a8a1a');P(-2+look,-1,2,2,'#0a1a08');P(-3+look,-2,1,1,'#ffffff');
    P(-6,-5,11,1,'#3a7a1a');P(-6,-4,3,1,'#3a7a1a');P(5,1,3,1,'#3a7a1a');P(7,2,2,1,'#2f5a22')},
  discordia(e){spark(e,'#a04a10','#ff8a3c','#ffc080',1)},
  contendinha(e){spark(e,'#7a3008','#d06a2a','#f09a5a',.8)},
  contenda(e){const t=e.t,f=(t*10|0)%2,P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2,w/2,h/2,c),push=Math.round(Math.sin(t*6));
    ball(P,-5-push,-9,7,8,'#7a3008','#d06a2a','#ffb070');ball(P,6+push,-9,6,8,'#6a2808','#b05a20','#e09050');
    for(let j=-16;j<-2;j+=2)P(0+(j%4?1:0),j,1,2,'#3a1404');
    P(-9-push,-12,2,2,'#111');P(-6-push,-12,2,2,'#111');P(-10-push,-14,4,1,'#3a1404');P(-8-push,-7,4,1,'#2a0a00');
    P(4+push,-12,2,2,'#111');P(8+push,-12,2,2,'#111');P(4+push,-14,5,1,'#3a1404');P(5+push,-7,4,1,'#2a0a00');
    for(const[lx,o]of[[-9,f],[-4,1-f],[3,f],[8,1-f]])P(lx,-2,2,2+o,'#5a2408')},
  gula(e){const t=e.t,m=(Math.sin(t*6)+1)*1.5|0,w=(t*5|0)%2,P=(dx,dy,w2,h,c)=>r(e.x+dx/2,e.y+dy/2,w2/2,h/2,c);
    P(-12,-3,7,3+w,'#3a1a5a');P(5,-3,7,3+(1-w),'#3a1a5a');
    ball(P,0,-14,19,13,'#4a2a6a','#6a3f96','#a07ad8');P(-6,-8,16,6,'#8e5bc0');P(-4,-7,10,3,'#a888d8');
    P(-19,-17,15,5+m*2,'#1a0618');for(let i=0;i<5;i++){P(-18+i*3,-17,2,2,'#ffffff');P(-18+i*3,-14+m*2,2,2,'#ffffff')}P(-22,-14+m*2,5,3,'#e0284a');P(-23,-12+m*2,2,2,'#ff6a8a');
    P(-12,-25,4,4,'#ffd34a');P(-12,-25,2,4,'#2a0a2a');P(-5,-25,4,4,'#ffd34a');P(-5,-25,2,4,'#2a0a2a');P(-13,-27,6,1,'#2a0a2a');P(-6,-27,5,1,'#2a0a2a');
    if((t*2|0)%3===0)P(-20,-6+((t*20)%8),2,2,'#c8f0ff')},
  feitico(e){const t=e.t,P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2,w/2,h/2,c);
    for(let i=0;i<7;i++){const yy=Math.round(Math.sin(t*5-i*.7)*2);P(6+i*2,yy,3-(i>3?1:0),3-(i>4?1:0),i%2?'#2a8a9a':'#5ad6e0')}
    ball(P,0,0,8,8,'#1a5a6a','#2a8a9a','#7af0f8');P(-6,-3,9,7,'#0a2a34');P(-5,-1,2,2,'#e0ffff');P(-1,-1,2,2,'#e0ffff');
    P(-7,-9,4,2,'#5ad6e0');P(-4,-11,3,2,'#5ad6e0');
    const o=Math.sin(t*4);P(-14,-2+o*2,4,4,'#a0ffff');P(-13,-1+o*2,2,2,'#ffffff');if((t*8|0)%2)P(-16,-5+o*2,1,1,'#ffffff')},
  ambicao(e){const t=e.t,b=Math.abs(Math.sin(t*4))*2,P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2-b,w/2,h/2,c);
    ball(P,0,-15,16,15,'#4a1420','#7a2a3a','#c05a70');
    P(-13,-36,26,5,'#c9921a');P(-13,-36,26,1,'#fff0a0');for(const[cx,h]of[[-13,4],[-3,6],[8,4]])P(cx,-36-h,5,h,'#f7c948');P(-2,-35,3,3,'#e0284a');P(-11,-34,2,2,'#5ad6e0');P(9,-34,2,2,'#5ad6e0');
    P(-12,-24,6,4,'#ffd34a');P(-12,-23,2,2,'#2a0a14');P(-3,-24,6,4,'#ffd34a');P(-3,-23,2,2,'#2a0a14');P(-13,-26,7,1,'#2a0a14');P(-4,-26,7,1,'#2a0a14');
    P(-10,-14,14,3,'#2a0a14');P(-9,-14,12,1,'#ffffff');P(-3,-14,2,1,'#f7c948');
    P(13,-17,9,9,'#c9921a');P(14,-18,7,2,'#f7c948');P(16,-20,3,2,'#8a5a10');P(15,-14,2,2,'#fff0a0')},
  embriaguez(e){const t=e.t,tl=Math.round(Math.sin(t*3)*3),P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2,w/2,h/2,c);
    P(-5,-2,3,2,'#5a1030');P(2,-2,3,2,'#5a1030');
    ball((dx,dy,w,h,c)=>P(dx+tl,dy,w,h,c),0,-10,8,9,'#5a1030','#8a2050','#d05a90');
    P(-6+tl,-13,4,1,'#2a0010');P(-1+tl,-12,4,1,'#2a0010');P(-6+tl,-12,3,1,'#ffd0e0');P(-1+tl,-11,3,1,'#ffd0e0');
    P(-7+tl,-9,3,2,'#ff7aa8');P(1+tl,-9,3,2,'#ff7aa8');P(-4+tl,-6,5,1,'#2a0010');
    P(7+tl,-16,4,9,'#2a5a22');P(8+tl,-19,2,3,'#2a5a22');P(8+tl,-20,2,1,'#c8a070');P(8+tl,-14,1,5,'#5a9a4a');
    if((t*2|0)%3===0){const by=-24-((t*16)%8);P(tl,by,2,2,'#ffd0e0');P(tl+3,by-3,1,1,'#ffd0e0')}},
  impureza(e){const t=e.t,w=Math.round(Math.sin(t*4)),P=(dx,dy,w2,h,c)=>r(e.x+dx/2,e.y+dy/2,w2/2,h/2,c);
    for(let i=0;i<5;i++)P(-10+i*5,-2,3,2+((t*6+i)|0)%3,'#3a3a10');
    ball(P,0,-8+w,12,8,'#2a2a0a','#4a4a1a','#8a8a3a');P(-9,-4+w,18,2,'#3a3a10');
    P(-8,-12+w,4,3,'#d8d860');P(-8,-11+w,2,2,'#1a1a08');P(-1,-12+w,4,3,'#d8d860');P(-1,-11+w,2,2,'#1a1a08');P(-6,-6+w,8,1,'#1a1a08');
    for(let k=0;k<2;k++){const a=t*6+k*3;P(Math.cos(a)*14,-18+Math.sin(a)*4,1,1,'#1a1a08')}},
  faccoes(e){const t=e.t,b=Math.round(Math.abs(Math.sin(t*6))*2),P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2-b/2,w/2,h/2,c);
    P(-4,-2,2,2,'#1a2050');P(2,-2,2,2,'#1a2050');
    ball(P,0,-9,6,8,'#2a3a7a','#4a5aa0','#8aaaff');P(-4,-13,2,2,'#ffffff');P(0,-13,2,2,'#ffffff');P(-4,-12,1,1,'#1a2050');P(0,-12,1,1,'#1a2050');P(-3,-8,4,1,'#1a2050');
    P(-12,-14,5,9,'#7a9aff');P(-12,-14,5,1,'#c0d0ff');P(-11,-11,3,3,'#2a3a7a');
    P(5,-22,1,20,'#6a4a2a');P(4,-24,3,3,'#c9c9d0');P(6,-21,4,3,'#e0284a')}
};
// ---------- the golden calf and the three bosses
const H2=e=>(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2,w/2,h/2,c);
function frogH(P,cx,t,c1,c2){const hop=Math.round(Math.max(0,Math.sin(t*5))*8),y=-hop;
  P(cx+3,y-4,7,4,c2);P(cx-9,y-3,5,3,c2);ball(P,cx,y-9,9,6,c2,c1,shade(c1,.35));
  for(const ex of[-8,-1]){P(cx+ex,y-18,6,5,c1);P(cx+ex+1,y-17,4,3,'#ffffff');P(cx+ex+1,y-16,2,2,'#111')}
  P(cx-9,y-8,9,1,shade(c2,-.4));P(cx-6,y-5,8,2,shade(c1,.45))}
Object.assign(SPR,{
  bezerro(e){const t=e.t,w=(t*4|0)%2,P=H2(e),gl=Math.sin(t*3);
    [[-20,0],[-12,1],[6,0],[14,1]].forEach(([lx,o])=>{const lift=(o+w)%2*3;P(lx,-20,5,18-lift,'#b07a14');P(lx,-20,2,18-lift,'#8a5a10');P(lx-1,-3-lift,7,3,'#5a3a08')});
    ball(P,0,-28,24,11,'#a06a10','#f0b838','#fff4b0');P(-20,-22,40,2,'#c9921a');for(let i=-16;i<18;i+=8)P(i,-34,3,1,'#c9921a');
    P(23,-34,3,14,'#c9921a');P(22,-21,5,5,'#a06a10');
    ball(P,-28,-40,10,9,'#a06a10','#f7c948','#fff4b0');P(-40,-38,9,8,'#e0b030');P(-40,-35,2,2,'#7a5010');P(-37,-35,2,2,'#7a5010');P(-40,-31,9,1,'#a06a10');
    P(-33,-55,3,8,'#fff0a0');P(-36,-57,4,3,'#fff0a0');P(-24,-55,3,8,'#fff0a0');P(-22,-57,4,3,'#fff0a0');
    P(-33,-44,4,3,'#ff3d3d');P(-33,-44,1,1,'#ffd0d0');P(-22,-48,6,4,'#c9921a');
    if(gl>.6){P(-10+Math.round(gl*20),-38,2,2,'#ffffff');P(-11+Math.round(gl*20),-37,4,1,'#fff6c0')}},
  golias(e){const t=e.t,w=(t*3|0)%2,rage=e.ph2,P=H2(e),br=Math.round(Math.sin(t*2));
    for(const[lx,o]of[[-12,w],[4,1-w]]){P(lx,-26,8,26-o*2,'#6a5030');P(lx,-16,8,10,'#c9a24a');P(lx,-16,8,2,'#f0d080');P(lx+1,-13,2,6,'#a8843a');P(lx-2,-2-o*2,11,2,'#4a3018')}
    P(-17,-32,34,9,'#7a5a3a');for(let i=-15;i<17;i+=4)P(i,-31,1,8,'#5a4028');
    P(-16,-58+br,32,27,'#7a6a4a');for(let j=0,row=0;j<24;j+=3,row++)for(let i=0;i<32;i+=4){P(-16+i+(row%2)*2,-57+br+j,3,2,'#a8986a');P(-16+i+(row%2)*2,-55+br+j,3,1,'#5a4a30')}
    P(-16,-33,32,3,'#5a3a20');P(-2,-33,4,3,'#f7c948');P(-21,-60+br,9,7,'#c9a24a');P(12,-60+br,9,7,'#c9a24a');P(-21,-60+br,9,2,'#f0d080');P(12,-60+br,9,2,'#f0d080');
    P(-9,-72+br,18,14,'#d9a07a');P(-9,-72+br,2,14,'#b07a5a');P(-9,-63+br,18,7,'#3a2414');P(-5,-61+br,9,2,'#1a0a04');P(-4,-60+br,2,1,'#ffffff');
    P(-7,-67+br,4,2,rage?'#ff2020':'#1a0e0a');P(1,-67+br,4,2,rage?'#ff2020':'#1a0e0a');P(-8,-69+br,6,1,'#2a1810');P(0,-69+br,6,1,'#2a1810');
    P(-11,-79+br,22,9,'#c9a24a');P(-11,-79+br,22,2,'#f0d080');P(-11,-71+br,3,9,'#a8843a');P(8,-71+br,3,9,'#a8843a');P(-1,-71+br,2,5,'#a8843a');
    P(-3,-88+br,7,10,'#e0284a');P(-2,-88+br,2,9,'#ff6a7a');P(4,-86+br,3,6,'#a01a2a');
    P(18,-92,2,88,'#6a4a2a');P(16,-100,6,9,'#d0d0d8');P(17,-102,4,2,'#ffffff');P(15,-52+br,6,5,'#d9a07a');
    ball(P,-24,-44+br,11,13,'#7a5018','#c9a24a','#f8e0a0');P(-26,-46+br,4,4,'#fff0a0');for(let k=0;k<6;k++){const a=k/6*Math.PI*2;P(-24+Math.round(Math.cos(a)*8),-44+br+Math.round(Math.sin(a)*10),2,2,'#7a5018')}
    if(rage&&(t*6|0)%2){P(-14,-82,2,3,'#ffffff');P(12,-84,2,3,'#ffffff')}},
  farao(e){const t=e.t,rage=e.ph2,P=H2(e),wave=Math.sin(t*6);
    frogH(P,-58,t,'#4cc46e','#2d8a4a');frogH(P,-38,t+.6,'#4cc46e','#2d8a4a');
    for(let i=0;i<30;i++)P(-50+i,-20+Math.round(Math.sin(i*.2+t*3)*1),1,1,'#7a4b2a');
    P(-22,-36,48,20,'#a07010');P(-22,-36,48,18,'#d9a521');P(-22,-36,48,3,'#ffe08a');P(-22,-28,48,2,'#2a5bd7');P(-22,-22,48,2,'#2a5bd7');for(let i=-18;i<24;i+=8)P(i,-33,2,2,'#e0284a');
    const cx=8,cy=-14;for(let i=0;i<48;i++){const a=i/48*Math.PI*2;P(cx+Math.round(Math.cos(a)*13),cy+Math.round(Math.sin(a)*13),2,2,'#7a5010')}
    for(let k=0;k<4;k++){const a=-t*4+k*Math.PI/4;for(let j=2;j<12;j++){P(cx+Math.round(Math.cos(a)*j),cy+Math.round(Math.sin(a)*j),1,1,'#c9921a');P(cx-Math.round(Math.cos(a)*j),cy-Math.round(Math.sin(a)*j),1,1,'#c9921a')}}
    P(cx-2,cy-2,4,4,'#ffe08a');
    P(-12,-54,16,18,'#c78b5a');P(-12,-54,3,18,'#a06a40');P(-14,-54,20,5,'#f7c948');P(-14,-52,20,1,'#2a5bd7');P(-14,-50,20,1,'#e0284a');
    P(-10,-66,13,12,'#c78b5a');P(-14,-70,21,7,'#f7c948');for(let i=0;i<21;i+=3)P(-14+i,-70,1,7,'#2a5bd7');P(-14,-64,5,14,'#f7c948');P(3,-64,5,14,'#f7c948');P(-14,-60,5,1,'#2a5bd7');P(3,-60,5,1,'#2a5bd7');P(-14,-56,5,1,'#2a5bd7');
    P(-8,-61,4,2,'#ffffff');P(-8,-61,2,2,rage?'#ff2020':'#111');P(-10,-62,6,1,'#111');P(-6,-55,3,6,'#2a5bd7');P(-5,-74,3,4,'#ff4f7b');P(-6,-76,2,2,'#ff4f7b');
    P(-16,-50,4,4,'#c78b5a');for(let i=0;i<10;i++)P(-18-i,-52-i+Math.round(wave*i*.3),1,1,'#7a4b2a');P(-29,-62+Math.round(wave*3),3,3,'#f7c948')},
  leviata(e){const t=e.t,rage=e.ph2,P=H2(e);
    for(let i=9;i>=0;i--){const cx=10+i*10,cy=-16-Math.round(Math.sin(t*3+i*.8)*10),rad=Math.max(4,Math.round(12-i*.8));
      ball(P,cx,cy,rad,rad,'#1a4250','#2a6a7a','#5ab0b0');P(cx-rad+2,cy+rad-3,rad*2-4,2,'#7ac0b0');P(cx-1,cy-rad-3,3,4,'#5af0c0');P(cx,cy-rad-5,1,2,'#bffff0')}
    ball(P,-14,-30,16,13,'#1a4250','#2a6a7a','#6ac0c0');
    P(-38,-34,26,9,'#2a6a7a');P(-38,-34,26,2,'#4a9aa0');P(-36,-24,22,6,'#1e5260');P(-36,-20,20,2,'#7ac0b0');
    for(let i=0;i<6;i++){P(-37+i*4,-26,2,3,'#ffffff');P(-35+i*4,-24,2,2,'#e0f0f0')}
    P(-22,-38,6,5,rage?'#ff2020':'#ffd34a');P(-20,-38,2,5,'#111');P(-24,-40,9,1,'#0e3a44');
    for(let i=0;i<4;i++)P(-10+i*6,-46-(i%2)*3,4,6+(i%2)*3,'#5af0c0');P(-40,-30,2,1,'#0e3a44');
    for(let i=0;i<5;i++)P(-38-i*2,-22+Math.round(Math.sin(t*4+i)*2),1,1,'#7ac0b0')},
  ira(e){const t=e.t,rg=e.rage?1:0,b=Math.round(Math.abs(Math.sin(t*(rg?9:5)))*2),P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2-b/2,w/2,h/2,c);
    P(-6,-2,4,2,'#5a1404');P(2,-2,4,2,'#5a1404');
    ball(P,0,-10,9,9,'#8a2a08',rg?'#ff3a1a':'#ff5a1a','#ffc080');
    for(let i=0;i<5;i++){const h=3+((Math.sin(t*14+i*1.9)+1)*(rg?3:2)|0);P(-7+i*3,-19-h,2,h,i%2?'#ffd34a':'#ff8a2a');P(-7+i*3,-19-h,1,1,'#fff6c0')}
    P(-7,-14,4,1,'#2a0800');P(-1,-13,4,1,'#2a0800');P(-7,-13,3,2,'#ffffff');P(-1,-12,3,2,'#ffffff');P(-7,-12,2,1,'#c00000');P(-1,-11,2,1,'#c00000');
    P(-6,-7,8,2,'#2a0800');for(let i=0;i<4;i++)P(-6+i*2,-7,1,1,'#ffffff');
    P(-11,-10,3,3,'#c0401a');P(8,-9,3,3,'#c0401a');
    if(rg&&(t*8|0)%2){P(-10,-22,2,2,'#c0c0c0');P(8,-23,2,2,'#c0c0c0')}},
  ciume(e){const t=e.t,P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2,w/2,h/2,c),side=Math.sin(t*1.5)>0?-1:1;
    for(let i=0;i<5;i++){const yy=Math.round(Math.sin(t*6-i*.9)*2);P(6+i*2,yy+i,3,3-(i>2?1:0),i%2?'#2a8a6a':'#3aa88a')}P(16,4+Math.round(Math.sin(t*6)*2),2,2,'#8af0c8');
    ball(P,0,0,8,7,'#1a5a4a','#3aa88a','#9af8d0');P(-6,-9,2,3,'#1a5a4a');P(3,-9,2,3,'#1a5a4a');
    for(const ex of[-6,0]){P(ex,-3,5,4,'#f0fff0');P(ex+1+side,-2,2,3,'#6a2a8a');P(ex+1+side,-2,1,1,'#ffffff');P(ex,-3,5,1,'#1a5a4a')}
    P(-4,3,6,1,'#0a2a20');P(1,4,1,1,'#0a2a20')},
  heresia(e){const t=e.t,sw=Math.round(Math.sin(t*3)),P=(dx,dy,w,h,c)=>r(e.x+dx/2,e.y+dy/2,w/2,h/2,c),pulse=(Math.sin(t*5)+1)/2;
    P(-8,-18,16,18,'#4a2a6a');P(-9,-6,18,6,'#3a1a5a');P(-8,-18,3,18,'#3a1a5a');P(4,-17,2,14,'#6a4a8a');P(-9,-1,18,1,'#2a1040');
    ball(P,0,-23,7,7,'#2a1040','#5a3a7a','#9a7ac0');P(-5,-25,8,7,'#1a0a28');P(-4,-23,2,1,'#e0c0ff');P(0,-23,2,1,'#e0c0ff');
    P(-12,-14+sw,5,4,'#e8d8b0');P(-12,-14+sw,5,1,'#c8a878');P(-11,-12+sw,3,1,'#6a4a8a');
    P(8,-34,2,34,'#6a4a2a');P(7,-36,4,2,'#6a4a2a');P(6,-40,6,5,pulse>.5?'#d0a8ff':'#b08aff');P(7,-39,2,2,'#ffffff')}
});
function spark(e,dark,mid,lite,sc){const t=e.t,f=(t*16|0)%2,P=(dx,dy,w,h,c)=>r(e.x+dx*sc/2,e.y+dy*sc/2,Math.max(.5,w*sc/2),Math.max(.5,h*sc/2),c);
  P(-3,-2,2,2+f,shade(dark,-.3));P(1,-2,2,3-f,shade(dark,-.3));
  ball(P,0,-6,5,5,dark,mid,lite);P(-4,-12,1,2,dark);P(-1,-13,2,3,dark);P(2,-12,1,2,dark);
  P(-4,-8,2,2,'#111');P(-1,-8,2,2,'#111');P(-4,-8,1,1,'#ffffff');P(-4,-4,5,1,'#3a1000');P(5,-6,3,1,dark);P(7,-7,1,1,dark)}
