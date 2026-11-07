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

function drawGround(){
  const P=MAP.pal,th=theme(P),A=buildTiles(P,th);MAP.atlas=A;
  const st=(i,dx,dy,w=T)=>C.drawImage(A,i*T*A.__k,0,w*A.__k,T*A.__k,dx,dy,w,T);
  const near=x0=>MAP.slots.some(s=>Math.abs(s.x-x0)<10);
  // Jericho's walls stand behind the path as brick columns under their platforms
  MAP.plats.forEach(pl=>{if(!pl.wall)return;if(MAP._fallen){const g2=gy(pl.x+pl.w/2);for(let i=0;i<pl.w;i+=3)r(pl.x+i,g2-2-(hs(i,pl.x)*7|0),3,9,i%2?'#8a5c3a':'#6a4228');return}const gyv=gy(pl.x+pl.w/2);r(pl.x+2,pl.y,pl.w-4,gyv-pl.y,'#8a5c3a');
    for(let j=pl.y+4;j<gyv;j+=5){r(pl.x+2,j,pl.w-4,1,'#6a4228');for(let i=pl.x+2+((j/5|0)%2)*5;i<pl.x+pl.w-2;i+=10)r(i,j-4,1,4,'#6a4228')}
    r(pl.x+2,pl.y,1,gyv-pl.y,'#b88a5a');r(pl.x+pl.w-3,pl.y,1,gyv-pl.y,'#5a3420')});
  MAP.seg.forEach(([a,b,y],si)=>{
    const prev=MAP.seg[si-1],next=MAP.seg[si+1],openL=prev&&prev[2]>y,openR=next&&next[2]>y;
    for(let j=y,row=0;j<H;j+=T,row++)for(let i=a;i<b;i+=T){const v=hs(i,j)*3|0;st(openL&&i===a?(row?TI.sideL:TI.capL):(row?TI.body:TI.cap)+(i===a&&openL?0:v),i,j,Math.min(T,b-i))}
    if(openR)for(let j=y,row=0;j<H;j+=T,row++)st(row?TI.sideR:TI.capR,b-T,j);
    for(let row=2;y+row*T<H;row++){C.fillStyle=`rgba(10,2,12,${Math.min(.5,(row-1)*.11)})`;C.fillRect(a,y+row*T,b-a,T)}
    // the top edge: grass blades, loose stones, a few hanging drips over the cliffs
    for(let i=a;i<b;i++){const n=hs(i,si+31);if(th==='grass'){if(n>.5)r(i,y-1,1,1,P.top1);if(n>.84)r(i,y-2,1,1,P.top1)}else if(n>.82)r(i,y-1,2,1,P.top2)}
    if(th==='grass'){if(openL)for(let j=0;j<3+(hs(a,3)*5|0);j++)r(a+1,y+3+j,1,1,P.top2);if(openR)for(let j=0;j<3+(hs(b,3)*5|0);j++)r(b-2,y+3+j,1,1,P.top2)}
    // props baked into the ground: flowers and bushes, boulders and shrubs, jars and broken bricks
    for(let i=a+6;i<b-6;i+=5){const n=hs(i,si+50);if(near(i)||inWater(i)||n<.62)continue;
      if(th==='grass'){if(n>.93)blob(i,y-3,5,3,shade(P.top2,-.35),P.top2,P.top1,i);else if(n>.88){r(i,y-4,1,4,'#e8e0d0');r(i-2,y-6,5,2,'#d8343a');r(i-1,y-7,3,1,'#d8343a');r(i-1,y-6,1,1,'#fff')}
        else{r(i,y-3,1,3,P.top2);r(i-1,y-4,3,1,pick(['#ff8ab0','#ffe36a','#ffffff','#c58cff']));r(i,y-5,1,1,'#fff6c0')}}
      else if(th==='rock'){if(n>.9)blob(i,y-3,5,3,P.dark,P.fill,P.lite,i);else if(n>.8){for(let k=0;k<4;k++)r(i-2+k,y-2-k%2*2,1,2+k%2*2,'#8a6a3a')}}
      else{if(n>.9){r(i-2,y-6,5,6,'#b8683a');r(i-1,y-7,3,1,'#8a4a28');r(i-2,y-5,1,4,'#d88a50');r(i-1,y-3,3,1,'#8a4a28')}else if(n>.8){r(i-2,y-2,4,2,P.lite);r(i+2,y-1,3,1,P.fill)}}}
  });
  if(MAP.water){const[a,b]=MAP.water,y=gy(a);for(let j=y;j<H;j++)r(a,j,b-a,1,j<y+20?'#0e1a30':'#081022');
    for(let j=y,row=0;j<H;j+=T,row++){st(row?TI.sideR:TI.capR,a-T,j);st(row?TI.sideL:TI.capL,b,j)}}
  MAP.plats.forEach(pl=>{for(let i=0;i<pl.w;i+=T){const last=i+T>=pl.w,px=last?pl.x+pl.w-T:pl.x+i,v=hs(i,pl.y)*3|0;
      st(i===0?TI.capL:last?TI.capR:TI.cap+v,px,pl.y);st(i===0?TI.underL:last?TI.underR:TI.under+(v&1),px,pl.y+T)}
    if(th==='grass')for(let i=1;i<pl.w-1;i++)if(hs(i,pl.y)>.55)r(pl.x+i,pl.y-1,1,1,P.top1)});
}

// ---------- living props: torches, lanterns, a rope bridge, banners, butterflies
function buildProps(){
  const L=[],kind={eden:'lantern',getsemani:'lantern',tumulo:'lantern'}[MAPID]||'torch';
  const bad=x0=>x0<46||MAP.slots.some(s=>Math.abs(s.x-x0)<14)||inWater(x0)||(MAP.sea&&x0>MAP.sea[0]-8&&x0<MAP.sea[1]+8);
  MAP.seg.forEach(([a,b,y],si)=>{if(b-a<50||hs(si,6)<.3)return;const x0=a+10+(hs(si,5)*(b-a-20)|0);if(!bad(x0))L.push({t:kind,x:x0,y})});
  if(MAP.water)L.push({t:'bridge',a:MAP.water[0]-6,b:MAP.water[1]+5,y:gy(MAP.water[0])});
  if(MAPID==='jerico')MAP.plats.forEach((pl,k)=>{if(pl.wall&&pl.w<30)L.push({t:'banner',x:pl.x+pl.w-4,y:pl.y})});
  if(['eden','tumulo','jerico'].includes(MAPID))for(let k=0;k<5;k++)L.push({t:'fly',x:90+k*(MAP.ww-120)/5,y:gy(90+k*(MAP.ww-120)/5),s:k});
  MAP.props=L;
  // drifting clouds in the colors of each sky
  const cc=MAP.day?{[MAPID]:['#a8c4e0','#dceaf8','#ffffff']}[MAPID]:{eden:['#8a4a6a','#c87a8a','#f0b0a8'],mar:['#9a5a7a','#d8909a','#f8c8b0'],jerico:['#a8604a','#e0a070','#f8d8a0'],babel:['#5a3050','#8a4a6a','#b06a80'],tumulo:['#c890a0','#f0c0c0','#fff0e0']}[MAPID];
  MAP.clouds=cc?[0,1,2].map(i=>{const c=mkHD(64,22),keep=C;C=c.getContext('2d');blob(32,14,24+i*3,6,cc[0],cc[1],cc[2],i*7+1);blob(20,10,12,6,cc[0],cc[1],cc[2],i*7+2);blob(42,9,13,6,cc[0],cc[1],cc[2],i*7+3);C=keep;return c}):null;
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
    else if(p.t==='banner'){r(p.x,p.y-18,1,18,'#4a2a18');r(p.x-1,p.y-19,3,1,'#c9a24a');
      for(let c=0;c<7;c++){const off=Math.round(Math.sin(S.t*5-c*.8)*(c*.25));r(p.x+1+c,p.y-17+off,1,9-(c>4?c-4:0),c%2?'#c0283f':'#e0284a');r(p.x+1+c,p.y-14+off,1,1,'#f7c948')}}
    else if(p.t==='fly'){const t=S.t*.8+p.s*2,fx=p.x+Math.sin(t)*26+Math.sin(t*2.3)*8,fy=p.y-16+Math.sin(t*1.7)*8,w=(S.t*14+p.s|0)%2,c=['#ffe36a','#ff8ab0','#c58cff','#ffffff','#7ad0ff'][p.s%5];
      r(fx,fy,1,2,'#3a2418');if(w){r(fx-2,fy-1,2,2,c);r(fx+1,fy-1,2,2,c)}else{r(fx-1,fy,1,1,c);r(fx+1,fy,1,1,c)}}}
}
function propLights(L){for(const p of MAP.props){
  if(p.t==='torch')L.push({x:p.x+1,y:p.y-16,r:34+Math.sin(S.t*11+p.x)*3,c:'#ff9a3a',a:.55});
  else if(p.t==='lantern')L.push({x:p.x+5,y:p.y-12,r:26+Math.sin(S.t*7+p.x)*2,c:'#ffc070',a:.5});
  else if(p.t==='bridge')for(let k=1;k<3;k++)L.push({x:p.a+(p.b-p.a)*k/3,y:p.y-5,r:18,c:'#ffb050',a:.45})}}

// sky life: clouds drift, birds cross, the far sea sparkles, tent fires flicker on Sinai
function drawSkyLife(){
  if(MAP.clouds)for(let i=0;i<5;i++){const span=W+140,cx=((i*131-S.cam*.06+S.t*(1.5+i*.6))%span+span)%span-70,cy=10+i*11+hs(i,3)*12|0;x.globalAlpha=.85;dl(x,MAP.clouds[i%3],Math.round(cx),cy);x.globalAlpha=1}
  if(!['getsemani','abismo','sinai'].includes(MAPID)){const per=26,ph=(S.t%per)/per;if(ph<.6){const k=ph/.6,bx=W+30-k*(W+90),by=34+Math.sin(S.t*.5)*6;
    for(let j=0;j<5;j++){const px=Math.round(bx+j*7),py=Math.round(by+Math.abs(j-2)*4+Math.sin(S.t*3+j)),w=(S.t*9+j|0)%2;r(px-2,py-w,2,1,'#2a1830');r(px,py,1,1,'#2a1830');r(px+1,py-w,2,1,'#2a1830')}}}
}
function drawFarLife(){
  if(MAPID==='mar'||MAPID==='abismo')for(let i=0;i<16;i++){const sx=Math.round((hs(i,1)*W*1.4+S.t*(3+hs(i,2)*5))%(W+20))-10,sy=130+(hs(i,3)*24|0);if(Math.sin(S.t*2.5+i*1.7)>.35)r(sx,sy,2+(i%2),1,'#d8f0ff')}
}
function drawMidLife(){
  if(!MAP.midFires)return;const off=Math.round(S.cam*PAR[1]);
  for(const f of MAP.midFires){const sx=f.x-off;if(sx<-10||sx>W+10)continue;x.globalAlpha=.5+Math.sin(S.t*9+f.x)*.25+Math.random()*.15;r(sx-2,f.y,5,6,'#ffe0a0');x.globalAlpha=1}
}

// ---------- day levels: a blue sky with a real sun, and the parallax silhouettes washed in daylight haze
function daySky(){const desert=!MAP.pal.grass;
  skyGrad(desert?[[0,'#3f86d4'],[.6,'#94cbee'],[1,'#f6dfb2']]:[[0,'#3a86de'],[.55,'#86c4f2'],[1,'#d6efff']]);
  C.globalAlpha=.1;for(let rr=30;rr>10;rr-=5)disc(300,42,rr,'#fff8d0');C.globalAlpha=1;disc(300,42,9,'#fff2b8');disc(299,41,7,'#ffffff');
  if(MAPID==='sinai'){for(let i=0;i<W;i+=.5){const d=Math.abs(i-290),h=Math.max(0,150-d*.95-hs(i*2|0,3)*4);if(h>0)r(i,H-h-30,.5,h+30,i<290?'#c0a088':'#a0806c')}
    blob(290,64,16,5,'#d8e4f0','#eef4fa','#ffffff',61)}
}
function dayTint(){const desert=!MAP.pal.grass;
  [[FAR,desert?'#e0d0b8':'#a4cbe8',.72],[MID,desert?'#c0a07c':'#7cae86',.74],[NEAR,desert?'#7a5c40':'#3e7048',.62]].forEach(([c,col,a])=>{
    const g=c.getContext('2d');g.save();g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';g.globalAlpha=a;g.fillStyle=col;g.fillRect(0,0,c.width,c.height);g.restore()})}
