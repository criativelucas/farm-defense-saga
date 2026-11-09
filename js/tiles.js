// ---------- tileset: 8x8 blocks built from each world's palette, stamped along the ground like a tile map.
// Three families: grass (Éden, Getsêmani, Sepulcro), rock (Sinai, Mar) and brick (Jericó, Babel).
// Loaded after maps.js, so this drawGround replaces the old flat one.
const T=8,TI={cap:0,capL:3,capR:4,body:5,sideL:8,sideR:9,underL:10,under:11,underR:13,N:14};
function shade(h,k){const n=parseInt(h.slice(1),16),f=v=>clamp(Math.round(k<0?v*(1+k):v+(255-v)*k),0,255);
  return'#'+((1<<24)|(f(n>>16)<<16)|(f(n>>8&255)<<8)|f(n&255)).toString(16).slice(1)}
const theme=P=>P.grass?'grass':P.bricks?'brick':'rock';

function buildTiles(P,th){
  const A=mkHD(T*TI.N,T*2),g=A.getContext('2d'),keep=C,s=1/RS;C=g;
  const out=shade(P.fill,-.55),drip=shade(P.top2,-.4);
  const body=(o,v)=>{r(o,0,T,T,P.fill);
    if(th==='brick'){for(const[row,off]of[[0,v%2?2:6],[4,v%2?6:2]]){r(o,row+3,T,1,P.band);r(o+off,row,1,3,P.band);r(o+(off+1)%T,row,2,1,P.lite)}}
    else{for(let i=0;i<T;i+=s)for(let j=0;j<T;j+=s){const n=hs(i*RS+v*13,j*RS+v*7+3);if(n>.9)r(o+i,j,s,s,P.dark);else if(n<.05)r(o+i,j,s,s,P.lite)}
      if(th==='rock'){// chunky stones: a crack across, one down, and a lit lip under each crack
        const cy=v===1?5:3,cx=(v*3+2)%T;r(o,cy,T,1,P.dark);r(o,cy+1,T,1,P.lite);r(o+cx,0,1,cy,P.dark);r(o+cx+1,0,1,cy,P.band);r(o+(cx+4)%T,cy+1,1,T-cy-1,P.dark)}
      else if(v===1){r(o+2,3,3,2,P.dark);r(o+2,3,2,1,P.lite)}else if(v===2){r(o+5,5,2,1,P.dark);r(o+1,1,1,2,P.band)}}};
  const cap=(o,v)=>{body(o,v);r(o,0,T,1,P.top1);r(o,1,T,2,P.top2);
    if(th==='grass'){for(let i=0;i<T;i++){const d=hs(i+v*5,77)*3|0;r(o+i,3,1,d,P.top2);r(o+i,3+d,1,1,drip)}r(o+(v*3+1)%7,1,1,1,P.top1)}
    else{r(o,3,T,1,P.dark);r(o+(v%2?3:7),1,1,2,P.dark);if(th==='rock')r(o+(v*2+1)%6,4,2,1,P.dark)}};
  for(let v=0;v<3;v++){cap(TI.cap*T+v*T,v);body(TI.body*T+v*T,v)}
  // exposed edges: dark outline on the outside, a lit column on the left (light comes from the top left)
  let o=TI.capL*T;cap(o,1);g.clearRect(o,0,1,1);r(o,1,1,T-1,out);r(o+1,1,1,T-1,P.lite);
  o=TI.capR*T;cap(o,2);g.clearRect(o+T-1,0,1,1);r(o+T-1,1,1,T-1,out);r(o+T-2,1,1,T-1,P.dark);
  o=TI.sideL*T;body(o,0);r(o,0,1,T,out);r(o+1,0,1,T,P.lite);
  o=TI.sideR*T;body(o,2);r(o+T-1,0,1,T,out);r(o+T-2,0,1,T,P.dark);
  // floating platform undersides, rounded at the bottom
  for(let v=0;v<2;v++){o=(TI.under+v)*T;body(o,v);g.clearRect(o,T-1,T,1);r(o,T-2,T,1,out);r(o+3+v*2,T-1,2,1,out)}
  o=TI.underL*T;body(o,1);g.clearRect(o,4,2,T-4);g.clearRect(o+2,T-1,T-2,1);r(o,0,1,4,out);r(o+1,4,1,2,out);r(o+2,T-2,T-2,1,out);r(o+1,0,1,4,P.lite);
  o=TI.underR*T;body(o,2);g.clearRect(o+T-2,4,2,T-4);g.clearRect(o,T-1,T-2,1);r(o+T-1,0,1,4,out);r(o+T-2,4,1,2,out);r(o,T-2,T-2,1,out);
  C=keep;return A;
}

// ---------- living props: torches, lanterns, a rope bridge, banners, butterflies
function buildProps(){
  const L=[],kind={eden:'lantern',getsemani:'lantern',tumulo:'lantern',ressurreicao:'lantern'}[MAPID]||'torch';
  const bad=x0=>x0<46||MAP.slots.some(s=>Math.abs(s.x-x0)<14)||inWater(x0)||(MAP.sea&&x0>MAP.sea[0]-8&&x0<MAP.sea[1]+8);
  MAP.flats.forEach(([a,b,y],si)=>{if(b-a<40||hs(si,6)<.3)return;const x0=a+10+(hs(si,5)*(b-a-20)|0);if(!bad(x0))L.push({t:kind,x:x0,y})});
  // little animals: birds that fly off when you come close, rabbits in the grass, lizards on the hot rocks
  if(MAP.day&&MAPID!=='getsemani'){const spots=MAP.flats.filter(([a,b])=>b-a>30&&!bad((a+b)/2));
    spots.forEach(([a,b,y],k)=>{if(hs(k,13)<.45)return;const bx=a+8+hs(k,14)*(b-a-16);if(!bad(bx))L.push({t:'bird',x:bx,y,hx:bx,hy:y,s:k,ft:-1,c:['#c0392b','#2a6ad8','#e8a020','#6a4a3a'][k%4]})});
    MAP.plats.forEach((pl,k)=>{if(!pl.wall&&hs(k,15)>.6)L.push({t:'bird',x:pl.x+pl.w-5,y:pl.y,hx:pl.x+pl.w-5,hy:pl.y,s:k+20,ft:-1,c:['#2a6ad8','#e8a020','#c0392b'][k%3]})});
    if(MAP.pal.grass)spots.slice(0,3).forEach(([a,b,y],k)=>{if(hs(k,16)>.4)L.push({t:'bunny',x:(a+b)/2,y,a:a+6,b:b-6,s:k})});
    else spots.slice(1,4).forEach(([a,b,y],k)=>{if(hs(k,17)>.4)L.push({t:'lizard',x:(a+b)/2,y,a:a+6,b:b-6,s:k})})}
  if(MAP.water)L.push({t:'bridge',a:MAP.water[0]-6,b:MAP.water[1]+5,y:gy(MAP.water[0])});
  if(MAPID==='jerico')MAP.plats.forEach((pl,k)=>{if(pl.wall&&pl.w<30)L.push({t:'banner',x:pl.x+pl.w-4,y:pl.y})});
  if(MAP.day&&!['getsemani','abismo'].includes(MAPID))for(let k=0;k<6;k++)L.push({t:'fly',x:90+k*(MAP.ww-120)/5,y:gy(90+k*(MAP.ww-120)/5),s:k});
  MAP.props=L;
}
function flame(X,Y,k){const f=(S.t*12+k)|0,h=3+(f%3),sw=Math.round(Math.sin(S.t*9+k));
  r(X-1,Y-2,4,2,'#c0401a');r(X-1+sw*.5,Y-1-h,3,h,'#ff8a2a');r(X+sw,Y-h,2,h-1,'#ffd34a');r(X+sw,Y-h-1-(f%2),1,1,'#fff6c0')}
function drawProps(){
  const cam=S.cam;
  for(const p of MAP.props){if(p.t!=='bridge'&&(p.x<cam-30||p.x>cam+W+30))continue;
    if(p.t==='torch'){r(p.x,p.y-11,2,11,'#5a3420');r(p.x,p.y-11,1,11,'#7a4a2a');r(p.x-2,p.y-13,6,2,'#3a2418');r(p.x-1,p.y-12,4,1,'#6a4228');flame(p.x,p.y-13,p.x);
      if(Math.random()<.04)S.parts.push({x:p.x+1,y:p.y-17,vx:rnd(-4,4),vy:rnd(-24,-12),g:-6,life:.8,max:.8,c:'#ffb04a',s:1})}
    else if(p.t==='lantern'){const sw=Math.sin(S.t*1.8+p.x)*1.2,on=.75+Math.sin(S.t*7+p.x)*.15;
      r(p.x,p.y-18,1,18,'#4a2a18');r(p.x,p.y-18,5,1,'#4a2a18');r(p.x+4+sw*.5,p.y-17,1,2,'#c9a070');
      const lx=Math.round(p.x+3+sw);r(lx,p.y-15,4,1,'#3a2010');r(lx,p.y-14,4,4,'#d86a2a');x.globalAlpha=on;r(lx+1,p.y-14,2,3,'#ffe0a0');x.globalAlpha=1;r(lx,p.y-10,4,1,'#3a2010')}
    else if(p.t==='bridge'){if(p.b<cam-10||p.a>cam+W+10)continue;const y=p.y,sp=p.b-p.a;
      for(const px of[p.a,p.b-2]){r(px,y-11,2,11,'#6a4228');r(px,y-11,1,11,'#8a5a34');r(px-1,y-12,4,1,'#3a2418')}
      for(let i=0;i<=sp;i++){const u=i/sp,yy=y-10+Math.sin(u*Math.PI)*4+Math.sin(S.t*2+u*6)*.6;r(p.a+i,yy,1,1,'#c9a070')}
      for(let i=p.a+2;i<p.b-2;i+=4){const u=(i-p.a)/sp,b=Math.round(Math.sin(S.t*2.4+u*6)*.6);r(i,y-2+b,3,2,'#8a5a34');r(i,y-2+b,3,1,'#b07a48')}
      for(let k=1;k<3;k++){const u=k/3,lx=Math.round(p.a+sp*u),ly=Math.round(y-10+Math.sin(u*Math.PI)*4);r(lx,ly+1,1,2,'#3a2010');r(lx-1,ly+3,3,3,'#e8902a');r(lx,ly+4,1,1,'#fff0b0')}}
    else if(p.t==='banner'){if(MAP._fallen)continue;r(p.x,p.y-18,1,18,'#4a2a18');r(p.x-1,p.y-19,3,1,'#c9a24a');
      for(let c=0;c<7;c++){const off=Math.round(Math.sin(S.t*5-c*.8)*(c*.25));r(p.x+1+c,p.y-17+off,1,9-(c>4?c-4:0),c%2?'#c0283f':'#e0284a');r(p.x+1+c,p.y-14+off,1,1,'#f7c948')}}
    else if(p.t==='bird'){const near=S.state!=='title'&&Math.abs(S.p.x-p.hx)<26&&Math.abs(S.p.y-p.hy)<22;
      if(p.ft<0&&near){p.ft=S.t;p.dir=S.p.x<p.hx?1:-1;sfx&&0}
      if(p.ft>=0){const e=S.t-p.ft;if(e>7&&!near){p.ft=-1}else{const fx=p.hx+p.dir*e*70,fy=p.hy-8-e*38+Math.sin(e*14)*1.5,w=(S.t*16|0)%2;
        r(fx-1,fy,3,2,p.c);r(fx+(p.dir>0?2:-2),fy,1,1,'#f7c948');r(fx-2,fy-(w?2:-1),2,1,p.c);r(fx+1,fy-(w?2:-1),2,1,p.c);continue}}
      const pk=Math.sin(S.t*3+p.s*2)>.7,hop=Math.sin(S.t*1.3+p.s)>.95?1:0,X=p.hx,Y=p.hy-hop;
      r(X-1,Y-3,3,2,p.c);r(X-1,Y-3,1,1,shade(p.c,.35));r(X+(pk?1:2),Y-(pk?2:4),1.5,1.5,p.c);r(X+(pk?2.5:3),Y-(pk?1.5:3.5),1,.5,'#f7c948');r(X-2,Y-2.5,1,1,shade(p.c,-.3));r(X,Y-1,.5,1,'#3a2418');r(X+1,Y-1,.5,1,'#3a2418')}
    else if(p.t==='bunny'){const ph=(S.t*.5+p.s)%4,mv=ph<1.2,X=p.a+(Math.sin(S.t*.25+p.s)*.5+.5)*(p.b-p.a),Y=gy(X)-(mv?Math.abs(Math.sin(ph*8))*3:0),f=Math.cos(S.t*.25+p.s)>0?1:-1,c=p.s%2?'#f4f0e8':'#b08a6a';
      r(X-2,Y-3,5,3,c);r(X+(f>0?2:-3),Y-5,2,2,c);r(X+(f>0?2:-2),Y-8,1,3,c);r(X+(f>0?3:-3),Y-7,1,2,c);r(X+(f>0?3:-3),Y-4,.5,.5,'#2a1a1a');r(X-(f>0?3:-3),Y-3,1,1,'#ffffff')}
    else if(p.t==='lizard'){const ph=(S.t*.7+p.s*1.3)%3,X=p.a+((Math.sin(S.t*.4+p.s)*.5+.5))*(p.b-p.a),Y=gy(X),f=Math.cos(S.t*.4+p.s)>0?1:-1,leg=(S.t*12|0)%2&&ph<1.5;
      r(X-3,Y-1.5,6,1.5,'#7a9a3a');r(X+(f>0?3:-5),Y-2,2,1.5,'#7a9a3a');r(X+(f>0?4:-4),Y-2,.5,.5,'#1a1a10');r(X-(f>0?6:-3),Y-1,3,.5,'#6a8a30');r(X-1,Y-(leg?.5:0),1,.5,'#5a7a28');r(X+1,Y-(leg?0:.5),1,.5,'#5a7a28')}
    else if(p.t==='fly'){const t=S.t*.8+p.s*2,fx=p.x+Math.sin(t)*26+Math.sin(t*2.3)*8,fy=p.y-16+Math.sin(t*1.7)*8,w=(S.t*14+p.s|0)%2,c=['#ffe36a','#ff8ab0','#c58cff','#ffffff','#7ad0ff'][p.s%5];
      r(fx,fy,1,2,'#3a2418');if(w){r(fx-2,fy-1,2,2,c);r(fx+1,fy-1,2,2,c)}else{r(fx-1,fy,1,1,c);r(fx+1,fy,1,1,c)}}}
}
function propLights(L){for(const p of MAP.props){
  if(p.t==='torch')L.push({x:p.x+1,y:p.y-16,r:34+Math.sin(S.t*11+p.x)*3,c:'#ff9a3a',a:.55});
  else if(p.t==='lantern')L.push({x:p.x+5,y:p.y-12,r:26+Math.sin(S.t*7+p.x)*2,c:'#ffc070',a:.5});
  else if(p.t==='bridge')for(let k=1;k<3;k++)L.push({x:p.a+(p.b-p.a)*k/3,y:p.y-5,r:18,c:'#ffb050',a:.45})}}

// sky life: painted clouds drift, birds cross, smoke rises from Sinai
function drawSkyLife(){
  if(MAP.clouds)for(let i=0;i<4;i++){const span=W+220,cx=((i*157-S.cam*.06+S.t*(1.2+i*.5))%span+span)%span-110,cy=18+i*13+hs(i,3)*10|0;dl(x,MAP.clouds[i%3],Math.round((cx-30+CAMF)*RS)/RS,cy-20)}
  for(const s of MAP.smokes||[])if(s.sky)smoke(s.x,s.y,1.4);
  if(!['getsemani','abismo','sinai'].includes(MAPID)){const per=26,ph=(S.t%per)/per;if(ph<.6){const k=ph/.6,bx=W+30-k*(W+90),by=34+Math.sin(S.t*.5)*6;
    for(let j=0;j<5;j++){const px=Math.round(bx+j*7),py=Math.round(by+Math.abs(j-2)*4+Math.sin(S.t*3+j)),w=(S.t*9+j|0)%2;r(px-2,py-w,2,1,'#2a1830');r(px,py,1,1,'#2a1830');r(px+1,py-w,2,1,'#2a1830')}}}
}
// a column of dithered smoke puffs that rise, drift right and thin out
function smoke(sx,sy,sc){for(let i=0;i<7;i++){const ph=(S.t*.09+i/7)%1,px=sx+Math.sin(ph*5+i)*2*sc+ph*16*sc,py=sy-ph*44*sc;
  ditherDisc(px,py,(1.5+ph*7)*sc,ph<.5?'#8a8494':'#a8a2b0',.9-ph*.8)}}
function drawFarLife(){
  if(MAPID==='mar'||MAPID==='abismo')for(let i=0;i<16;i++){const sx=Math.round((hs(i,1)*W*1.4+S.t*(3+hs(i,2)*5))%(W+20))-10,sy=130+(hs(i,3)*24|0);if(Math.sin(S.t*2.5+i*1.7)>.35)r(sx,sy,2+(i%2),1,'#d8f0ff')}
}
function drawMidLife(){const o=lay(PAR[1]);
  for(const f of MAP.midFires||[]){const sx=f.x+o;if(sx>-10&&sx<W+10)flame(sx-1,f.y+6,f.x)}
  // waterfalls: bright streaks slide down the painted water, foam flickers at the foot
  for(const f of MAP.falls||[]){const sx=f.x+o,h=f.y1-f.y0;if(sx<-10||sx>W+10)continue;x.globalAlpha=.75;
    for(let j=0;j<f.w;j+=.5)for(let n=0;n<2;n++){const yy=f.y0+((S.t*34+hs(j*2|0,n+1)*h+n*h/2)%h);r(sx+j,yy,.5,2+hs(j*2|0,n+5)*3,'#ffffff')}
    x.globalAlpha=1;for(let n=0;n<3;n++)if(Math.sin(S.t*6+n*2+f.x)>0)r(sx+hs(n,f.x|0)*f.w,f.y1-2-hs(n+3,f.x|0)*3,1,.5,'#ffffff')}
  for(const s of MAP.smokes||[])if(!s.sky){const sx=s.x+o;if(sx>-30&&sx<W+30)smoke(sx,s.y,.8)}
}
