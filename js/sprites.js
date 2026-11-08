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
// ---------- the works of the flesh: chunky blocks on the world grid (bigger pixels than the characters), a lit top,
// a shaded base and right side, big eyes. MP paints in whole units from the feet (or the center, for flyers).
const MP=(e,bob=0)=>{const X=Math.round(e.x),Y=Math.round(e.y-bob);return(dx,dy,w,h,c)=>r(X+dx,Y+dy,w,h,c)};
function box(P,x0,y0,w,h,[d,m,l]){P(x0+1,y0,w-2,h,m);P(x0,y0+1,w,h-2,m);P(x0+1,y0+h-2,w-2,2,d);P(x0+w-1,y0+1,1,h-2,d);P(x0+1,y0+1,w-3,1,l);P(x0+1,y0+1,1,Math.max(1,h-4),l)}
// two eyes: white, pupil toward the front (left), an angry brow slanting to the middle when asked
function eyes(P,x0,y0,gap,o={}){const h=o.h||2;for(const[i,ex]of[[0,x0],[1,x0+gap]]){P(ex,y0,2,h,'#ffffff');P(ex,y0+h-1,1,1,INK);
  if(o.brow){P(ex,y0-(i?1:2),1,1,INK);P(ex+1,y0-(i?2:1),1,1,INK)}if(o.lid)P(ex,y0,2,1,o.lid)}}
function feet(P,t,a,b,c,spd=10){const f=(t*spd|0)%2;P(a-f,-1,2,1,c);P(b+f,-1,2,1,c)}
function chunkSpark(e,R,small){const t=e.t,f=(t*14|0)%2,P=MP(e,(t*12|0)%2),w=small?4:5,h=small?4:5,x0=-Math.ceil(w/2),y0=-h-1;
  for(let i=0;i<w;i+=2)P(x0+i+f,y0-1,1,1,R[2]);box(P,x0,y0,w,h,R);
  P(x0,y0+1,1,1,INK);P(x0+2,y0+1,1,1,INK);P(x0+1,y0+h-2,2,1,INK);feet(P,t,x0,x0+w-2,R[0],16)}
const SPR={
  odio(e){const t=e.t,hop=Math.abs(Math.sin(t*5))*2|0,P=MP(e,hop),R=['#9a1428','#e8303f','#ff8a7a'];
    P(-4,-12,1,2,'#fff2d8');P(-5,-13,1,1,'#fff2d8');P(3,-12,1,2,'#fff2d8');P(4,-13,1,1,'#fff2d8');
    box(P,-4,-10,8,9,R);eyes(P,-3,-6,4,{brow:1});P(-2,-3,4,1,INK);P(-1,-3,1,1,'#ffffff');P(1,-3,1,1,'#ffffff');
    feet(P,t,-3,1,'#5a0816');if(hop>1)P(5,-12-((t*6|0)%3),1,1,'#ffd0c0')},
  inveja(e){const t=e.t,f=(t*14|0)%2,P=MP(e,Math.round(Math.sin(t*3))),G=['#2a6a18','#68cc34','#b8f07a'],look=Math.round(Math.sin(t*2));
    for(const s of[-1,1]){const W=(dx,dy,w,h)=>P(s<0?-dx-w:dx,dy,w,h,'#3c8a24');if(f){W(4,-3,2,2);W(6,-5,2,2);W(8,-6,1,2)}else{W(4,0,2,2);W(6,1,2,2);W(8,2,1,2)}}
    box(P,-4,-3,8,7,G);P(-3,-2,5,4,'#ffffff');P(-3,-3,5,1,G[0]);P(-2+look,-1,2,2,INK);P(-2+look,-1,1,1,'#7a3a3a');P(-3,2,5,1,G[0])},
  discordia(e){chunkSpark(e,['#a8420e','#ff8a2c','#ffd080'],0)},
  contendinha(e){chunkSpark(e,['#7a3010','#d0662a','#f0a060'],1)},
  contenda(e){const t=e.t,push=Math.round(Math.sin(t*6)),P=MP(e,(t*8|0)%2),R=['#8a4410','#e08a34','#ffc070'];
    box(P,-4,-10,8,9,R);P(0,-9,3,6,'#c06a24');for(let j=0;j<6;j++)P(j%2?-1:0,-9+j,1,1,INK);
    P(-3,-7,2,2,'#ffffff');P(-3,-6,1,1,INK);P(1,-7,2,2,'#ffffff');P(2,-6,1,1,INK);P(-3,-4,2,1,INK);P(1,-4,2,1,INK);
    P(-6+push,-6,2,2,R[2]);P(4-push,-6,2,2,'#f0a050');feet(P,t,-3,1,'#5a2a08')},
  gula(e){const t=e.t,m=(Math.sin(t*6)+1)*1.5|0,P=MP(e,(t*4|0)%2),R=['#4a1a7a','#9040d0','#c890ff'];
    P(-9,-7,1,2,R[1]);P(8,-7,1,2,R[1]);box(P,-8,-14,16,13,R);P(-5,-6,9,3,'#a860ec');
    eyes(P,-6,-12,4,{brow:1});P(-7,-9,9,2+m,'#2a0818');for(let i=0;i<3;i++)P(-6+i*3,-9,1,1,'#ffffff');
    if(m){P(-5,-8+m,1,1,'#ffffff');P(-2,-8+m,1,1,'#ffffff');P(-5,-8+m,4,1,'#ff6a9a')}if(m>1)P(-6,-6+((t*4|0)%3),1,1,'#c8f0ff');
    feet(P,t,-6,3,'#2a0a4a',5)},
  feitico(e){const t=e.t,P=MP(e,Math.round(Math.sin(t*2.5)*1.5)),R=['#1a4a7a','#2a8ac8','#7ad0ff'],ox=-7+Math.round(Math.sin(t*3)),oy=-1+Math.round(Math.cos(t*3));
    P(-1,-9,2,2,R[0]);P(-2,-7,4,2,R[1]);P(-4,-5,8,1,R[0]);P(1,-10,1,1,'#ffe36a');
    box(P,-3,-5,7,8,R);P(-2,-3,4,3,'#0a1430');P(-2,-2,1,1,'#ffe36a');P(1,-2,1,1,'#ffe36a');
    const f=(t*8|0)%2;P(-3,3,2,1+f,R[1]);P(0,3,2,2-f,R[1]);P(3,3,1,1,R[1]);
    P(ox,oy,2,2,'#5af0ff');P(ox,oy,1,1,'#ffffff');if((t*6|0)%3===0)P(ox-1,oy-2,1,1,'#ffffff')},
  ambicao(e){const t=e.t,b=Math.abs(Math.sin(t*4))*1.5|0,P=MP(e,b),R=['#8a1a3a','#d8404a','#ff8a8a'],ca=t*3;
    P(-6,-21,12,3,'#f7c948');P(-6,-23,2,2,'#f7c948');P(-1,-24,2,3,'#f7c948');P(4,-23,2,2,'#f7c948');P(-6,-19,12,1,'#c98a1a');
    P(-4,-20,1,1,'#2a8af0');P(0,-20,1,1,'#e0283a');P(3,-20,1,1,'#5fe08a');P(-5,-21,1,1,'#fff6c0');
    box(P,-8,-18,16,17,R);eyes(P,-6,-14,6,{h:2,lid:R[0]});
    P(-6,-10,4,1,'#3a1a10');P(-1,-10,4,1,'#3a1a10');P(-7,-11,1,1,'#3a1a10');P(3,-11,1,1,'#3a1a10');P(-3,-8,4,1,INK);P(1,-9,1,1,INK);
    P(7,-9,5,6,'#c89a4a');P(8,-10,3,1,'#8a5a2a');P(9,-8,1,3,'#f7c948');P(8,-4,4,1,'#8a5a2a');
    feet(P,t,-6,2,'#4a0a1a',6);P(Math.round(Math.cos(ca)*11),-12+Math.round(Math.sin(ca)*3),1,1,'#fff6c0')},
  embriaguez(e){const t=e.t,tl=Math.round(Math.sin(t*3)*1.2),P=MP(e,0),R=['#9a2a5a','#f0609a','#ffb0d0'],B=(dx,dy,w,h,c)=>P(dx+tl,dy,w,h,c);
    box(B,-4,-11,8,10,R);B(-3,-8,2,1,INK);B(1,-8,2,1,INK);B(-4,-6,2,1,'#ff3a6a');B(2,-6,2,1,'#ff3a6a');B(-1,-4,2,1,INK);B(0,-3,1,1,INK);
    B(-6,-8,1,1,'#2a8a4a');B(-7,-7,3,4,'#2a8a4a');B(-7,-7,1,3,'#7ae0a0');
    for(let i=0;i<3;i++){const ph=(t*.8+i/3)%1;P(2+tl+Math.round(Math.sin(ph*9+i)),-12-Math.round(ph*8),1,1,'#ffe0f0')}
    feet(P,t,-3,1,'#5a1030',6)},
  impureza(e){const t=e.t,w=Math.round(Math.sin(t*4)),P=MP(e,0),R=['#5a5a10','#b0b030','#e8e870'];
    box(P,-5-w,-8+Math.abs(w),10+2*w,7-Math.abs(w),R);P(-3,-1,1,1+((t*3|0)%2),R[0]);P(2,-1,1,1+((t*3+1|0)%2),R[0]);
    P(-4,-6,3,3,'#ffffff');P(-4,-5,2,2,INK);P(0,-6,2,2,'#ffffff');P(0,-5,1,1,INK);P(-2,-2,3,1,R[0]);if(Math.sin(t*5)>.3)P(2,-10,1,1,R[2])},
  faccoes(e){const t=e.t,b=Math.abs(Math.sin(t*6))*1.5|0,P=MP(e,b),R=['#1a3a8a','#3a6ae0','#90b8ff'],wv=(t*6|0)%2;
    P(3,-15,1,13,'#6a4a2a');P(4,-15,3,2,'#e0283a');P(4+wv,-13,3,1,'#b01a2a');
    box(P,-3,-10,6,9,R);P(-3,-10,6,2,'#c0c8d8');P(-3,-9,6,1,'#8a90a8');P(-2,-7,1,2,INK);P(1,-7,1,2,INK);P(-1,-4,2,1,INK);feet(P,t,-3,1,'#0a1a4a',12)},
  ira(e){const t=e.t,rg=e.rage?1:0,b=Math.abs(Math.sin(t*(rg?9:5)))*1.5|0,P=MP(e,b),R=rg?['#9a1010','#ff3a20','#ffa060']:['#a8380e','#ff7a28','#ffc070'],f=(t*12|0)%3;
    for(let i=0;i<4;i++){const hg=2+((i+f)%3)+rg*2;P(-4+i*2,-10-hg,2,hg,i%2?'#ffd34a':'#ff8a2a');P(-4+i*2,-10-hg,1,1,'#fff6c0')}
    box(P,-4,-10,8,9,R);eyes(P,-3,-6,4,{brow:1});P(-2,-3,4,2,INK);P(-1,-3,2,1,'#ff5a3a');feet(P,t,-3,1,'#5a1404',rg?16:10);
    if(rg&&(t*8|0)%2){P(-6,-14,1,1,'#c0c0c0');P(5,-15,1,1,'#c0c0c0')}},
  ciume(e){const t=e.t,P=MP(e,Math.round(Math.sin(t*2.2)*1.5)),R=['#1a6a5a','#3ad0a8','#a0f8e0'],side=Math.sin(t*1.5)>0?-1:1,f=(t*8|0)%2;
    box(P,-3,-5,7,8,R);P(-3,3,2,1+f,R[1]);P(-1,3,2,2-f,R[1]);P(1,3,2,1+f,R[1]);P(3,3,1,1,R[0]);
    P(-2,-3,2,2,'#ffffff');P(1,-3,2,2,'#ffffff');P(side<0?-2:-1,-2,1,1,INK);P(side<0?1:2,-2,1,1,INK);P(-2,-3,2,1,R[0]);P(1,-3,2,1,R[0]);P(-1,0,3,1,R[0])},
  heresia(e){const t=e.t,sw=Math.round(Math.sin(t*3)),P=MP(e,0),R=['#3a1a6a','#7a4ad0','#b890ff'],pulse=(Math.sin(t*4)+1)/2;
    P(-6+sw,-16,1,15,'#6a4a2a');P(-7+sw,-18,3,2,pulse>.5?'#ff8aff':'#b08aff');P(-7+sw,-18,1,1,'#ffffff');
    box(P,-4,-12,9,11,R);P(-3,-15,7,3,R[1]);P(-2,-16,5,1,R[1]);P(-3,-15,7,1,R[2]);
    P(-2,-13,2,4,'#f7c948');P(0,-13,2,4,'#2a1a3a');P(-2,-12,1,1,INK);P(1,-12,1,1,pulse>.5?'#ff5aff':'#c070ff');P(-1,-10,2,1,INK);
    P(-4,-6,9,1,'#c9a24a');feet(P,t,-3,1,R[0],6)}
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
    for(let i=0;i<5;i++)P(-38-i*2,-22+Math.round(Math.sin(t*4+i)*2),1,1,'#7ac0b0')}
});
