// ---------- pixel VFX: puffs of smoke and dust, sparks, glints, splashes, holy light, healing crosses, falling leaves.
// Fading uses dithering (fewer pixels) instead of transparency, the way pixel art games do it.
function vfx(k,px,py,o={}){if(!S)return;const L=S.vfx||(S.vfx=[]),add=v=>L.push(Object.assign({k,x:px,y:py,t:0},v));
  if(k==='puff'||k==='dust'){const n=o.n||4;for(let i=0;i<n;i++){const side=k==='dust'?(i%2?1:-1):0;
    add({vx:k==='dust'?side*rnd(20,45):rnd(-12,12),vy:k==='dust'?rnd(-6,-2):rnd(-18,-6),r0:rnd(1,2),r1:rnd(3,5.5),max:rnd(.45,.8),c:o.c||(k==='dust'?'#d8c8a8':'#e8dcc8'),x:px+rnd(-2,2),y:py+rnd(-2,1)})}}
  else if(k==='smoke')add({vx:rnd(-3,3),vy:rnd(-10,-6),r0:1,r1:3.5,max:2.2,c:o.c||'#8a8090'});
  else if(k==='spark')for(let i=0;i<(o.n||5);i++){const a=rnd(0,Math.PI*2),v=rnd(40,90);add({vx:Math.cos(a)*v,vy:Math.sin(a)*v,max:rnd(.15,.3),c:o.c||'#fff6c0'})}
  else if(k==='sparkle')add({max:o.max||.5,s:o.s||3,c:o.c||'#ffffff'});
  else if(k==='blink'){for(let i=0;i<10;i++){const a=i/10*Math.PI*2;add({k:'bit',vx:Math.cos(a)*50,vy:Math.sin(a)*50,max:.3,c:'#bffff0'})}add({max:.25,c:'#ffffff'})}
  else if(k==='heal')for(let i=0;i<3;i++)add({x:px+rnd(-6,6),y:py+rnd(-4,4),vy:-rnd(14,22),max:rnd(.7,1),d:i*.12,c:o.c||'#9ff7b8'});
  else if(k==='ring2')add({max:.5,r:o.r||30,c:o.c||'#ffffff'});
  else if(k==='holy')add({max:1.1,c:'#fff3b0'});
  else if(k==='splash')add({max:.3});
  else if(k==='leaf')add({vx:rnd(-8,-3),vy:rnd(10,16),max:9,ph:rnd(0,6),c:o.c||pick(['#5fae4a','#8ad05a','#d9a050']),land:0});
}
function ditherDisc(cx,cy,rad,c,den){const s=.5;C.fillStyle=OV||c;const k=C.__k||1;
  for(let dy=-rad;dy<=rad;dy+=s)for(let dx=-rad;dx<=rad;dx+=s){if(dx*dx+dy*dy>rad*rad)continue;const a=Math.round(dx*2),b=Math.round(dy*2);
    if(den<.75&&(a+b)%2)continue;if(den<.4&&(a%2||b%2))continue;C.fillRect(Math.round((cx+dx)*k)/k,Math.round((cy+dy)*k)/k,s,s)}}
function updVfx(dt){if(!S||!S.vfx)return;
  for(const v of S.vfx){v.t+=dt;if(v.d>0){v.d-=dt;v.t=0;continue}
    if(v.vx!=null&&v.k!=='leaf'){v.x+=v.vx*dt;v.y+=(v.vy||0)*dt;if(v.k==='puff'||v.k==='dust'||v.k==='smoke'){v.vx*=.92;v.vy*=.96}}
    if(v.k==='leaf'){if(!v.land){v.x+=(v.vx+Math.sin(v.t*2.4+v.ph)*14)*dt;v.y+=v.vy*dt;if(v.y>=gy(v.x)-.5){v.y=gy(v.x)-.5;v.land=1;v.max=v.t+3}}}}
  S.vfx=S.vfx.filter(v=>v.t<v.max);if(S.vfx.length>260)S.vfx.splice(0,S.vfx.length-260);
  // the world breathes: rain splashes, falling leaves on day maps, smoke from torches
  if(S.rain>0)for(let i=0;i<Math.ceil(dt*30);i++)if(Math.random()<dt*30){const sx=S.cam+rnd(0,W);if(!inWater(sx))vfx('splash',sx,gy(sx))}
  if(MAP.day&&MAP.pal.grass&&Math.random()<dt*.9)vfx('leaf',S.cam+rnd(0,W+60),-4);
  if(MAP.props&&Math.random()<dt*2.5){const p=pick(MAP.props);if(p.t==='torch'&&p.x>S.cam-10&&p.x<S.cam+W+10)vfx('smoke',p.x+1,p.y-19)}
  if(MAP.day&&Math.random()<dt*1.5)vfx('sparkle',S.cam+rnd(20,W-20),rnd(30,150),{s:1.5,max:.6,c:'#fff8d8'})}
function drawVfx(){if(!S||!S.vfx)return;
  for(const v of S.vfx){if(v.d>0)continue;const u=v.t/v.max;
    if(v.k==='puff'||v.k==='dust'||v.k==='smoke'){ditherDisc(v.x,v.y,v.r0+(v.r1-v.r0)*Math.sqrt(u),v.c,1-u)}
    else if(v.k==='spark'){r(v.x,v.y,1,.5,v.c);r(v.x-v.vx*.02,v.y-v.vy*.02,.5,.5,v.c)}
    else if(v.k==='bit'){if(u<.7||(v.t*20|0)%2)r(v.x,v.y,.5,.5,v.c)}
    else if(v.k==='sparkle'){const s=v.s*Math.sin(u*Math.PI);r(v.x-s,v.y,s*2+.5,.5,v.c);r(v.x,v.y-s,.5,s*2+.5,v.c);if(s>1)r(v.x-.5,v.y-.5,1.5,1.5,v.c)}
    else if(v.k==='blink'){const h=12*(1-u);r(v.x-.5,v.y-h,1.5,h*2,v.c)}
    else if(v.k==='heal'){const a=u<.7||(v.t*16|0)%2;if(a){r(v.x-1,v.y,2.5,.5,v.c);r(v.x,v.y-1,.5,2.5,v.c);r(v.x-.5,v.y-.5,1.5,1.5,v.c)}}
    else if(v.k==='ring2'){const R=v.r*Math.sqrt(u),n=Math.max(12,R*4|0);for(let i=0;i<n;i++){if(u>.5&&i%2)continue;const a=i/n*Math.PI*2;r(v.x+Math.cos(a)*R,v.y+Math.sin(a)*R*.5,.5,.5,v.c)}}
    else if(v.k==='holy'){const w=6*(1-Math.abs(u*2-1)*.6),gy0=gy(v.x);ditherDisc(v.x,gy0,w*1.4,'#fff3b0',1-u);
      for(let y=0;y<gy0;y+=.5)if(((y*2|0)+(v.t*30|0))%3)r(v.x-w/2+Math.sin(y*.3+v.t*9)*.5,y,w,.5,u<.8?'#fff6c8':'#f7c948');
      for(let i=0;i<4;i++){const sy=((v.t*90+i*40)%gy0);r(v.x+Math.sin(i*2+v.t*5)*w,sy,.5,1,'#ffffff')}}
    else if(v.k==='splash'){if(u<.5){r(v.x-1,v.y-1-u*6,.5,.5,'#bfe8ff');r(v.x+1,v.y-1.5-u*5,.5,.5,'#bfe8ff')}r(v.x-1-u*3,v.y-.5,.5+u*6,.5,'#9ad0ff')}
    else if(v.k==='leaf'){const f=(v.t*6+v.ph|0)%2;if(v.land&&v.max-v.t<1&&(v.t*10|0)%2)continue;r(v.x,v.y,f?1.5:1,f?.5:1,v.c);r(v.x+(f?1:.5),v.y-.5,.5,.5,shade(v.c,-.25))}}
}
