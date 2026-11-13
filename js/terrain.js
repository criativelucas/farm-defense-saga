// ---------- organic terrain. The walkable ground is a height profile: nodes joined by smooth ramps, with hills, valleys
// and a few rock cliffs instead of flat blocks. It is painted per pixel: a grass (or sand) lip with tufts and drips,
// layered earth with stones and roots, rock faces at the drops. Platforms become floating islands with tapering earth,
// hanging roots and vines, and sometimes a waterfall spilling off the edge. Loaded after tiles.js.
const sstep=t=>t*t*(3-2*t);
// maps without a hand-made profile grow one from their old flat segments: each step becomes a ramp (or, now and then,
// a cliff), shrunk where a ground tree slot sits nearby so trees always stand on level ground
function growProf(M){const seg=M.seg,onPlat=s=>M.plats.some(p=>Math.abs(s.y-p.y)<1&&s.x>=p.x-2&&s.x<=p.x+p.w+2),ground=M.slots.filter(s=>!onPlat(s)).map(s=>s.x),P=[[seg[0][0],seg[0][2]]];
  for(let i=0;i<seg.length-1;i++){const b=seg[i][1],y1=seg[i][2],y2=seg[i+1][2],dy=Math.abs(y2-y1);let w=hs(i,b|0)>.75||dy<3?2:clamp(dy*1.8,12,38);
    for(const sx of ground){const room=(Math.abs(sx-b)-9)*2;if(room<w)w=Math.max(2,room)}
    P.push([b-w/2,y1],[b+w/2,y2])}
  const L=seg[seg.length-1];P.push([L[1],L[2]]);return P}
function buildProfile(){const M=MAP,P=M.prof||(M.prof=growProf(M)),n=Math.ceil(M.ww*2)+2,T=new Float32Array(n);let i=1;
  for(let j=0;j<n;j++){const u=j/2;while(i<P.length-1&&u>=P[i][0])i++;const[a,ya]=P[i-1],[b,yb]=P[i];T[j]=u<=a?ya:u>=b?yb:ya+(yb-ya)*sstep((u-a)/(b-a))}
  // organic relief over the hand-made profile: rolling rises and dips, and here and there a terraced stretch that breaks
  // into small cliffs. It stays calm by the home, the portals, water, the sea, walls and the story spots of each world.
  {const sd=MAPID.charCodeAt(0)*7+MAPID.length*3+(M.variant||0)*19,amp=MAPID==='babel'||MAPID==='tumulo'?4:10;
    const calm=u=>{let m=clamp((u-84)/50,0,1)*clamp((M.ww-34-u)/40,0,1);const near=(a,b,pad)=>{if(u>a-pad&&u<b+pad)m=Math.min(m,clamp(Math.max(a-u,u-b)/pad,0,1))};
      if(M.water)near(M.water[0],M.water[1],26);if(M.sea)near(M.sea[0],M.sea[1],30);if(MAPID==='eden')near(530,530,30);if(MAPID==='sinai')near(470,470,30);
      for(const p of M.plats)if(p.wall)near(p.x,p.x+p.w,22);return m};
    for(let j=0;j<n;j++){const u=j/2;let d=(vn(u*.016,sd)-.5)*2*amp+(vn(u*.05,sd+3)-.5)*5;if(vn(u*.006,sd+9)>.52)d=Math.round(d/6)*6;T[j]=clamp(T[j]+d*calm(u),112,186)}}
  M.gyT=T;M.flats=[];for(let k=1;k<P.length;k++)if(P[k][1]===P[k-1][1]&&P[k][0]-P[k-1][0]>=16)M.flats.push([P[k-1][0],P[k][0],P[k][1]]);
  M.slots.forEach(s=>{if(s.pl==null)s.y=gy(s.x)})}
// how far an island's body hangs below its top at x: a rounded wedge with lumpy lobes, never a smooth curve
function islandDepth(pl,u){if(pl.wall)return 4;const cx=pl.x+pl.w/2,hw=pl.w/2+1,q=(u-cx)/hw;if(Math.abs(q)>=1)return 0;const s=pl.x|0,e=1-q*q;
  let dep=(8+Math.min(pl.w,46)*.4)*Math.pow(e,.75)*(.8+.35*vn(u*.12,s));
  for(let j=0;j<2+pl.w/24;j++){const lx=cx+(hs(s,j+1)-.5)*pl.w*.75,lw=2.5+hs(j+5,s)*4;dep+=(3+hs(s,j+9)*9)*Math.exp(-(((u-lx)/lw)**2))*e}
  return Math.max(0,dep+(vn(u*.6,s+3)-.5)*3)}
// rounded stones packed together: [edge, shade]. Edge near 0 is the crack between two stones; each stone is lit from the top left
function stoneAt(u,v,sx,sy,seed){const cx=Math.floor(u/sx),cy=Math.floor(v/sy);let d1=9,d2=9,nx=0,ny=0,id=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const a=cx+i,b=cy+j,px=(a+.2+hs(a+seed,b)*.6)*sx,py=(b+.2+hs(a,b+seed)*.6)*sy,dx=(u-px)/sx,dy=(v-py)/sy,dd=dx*dx+dy*dy;
    if(dd<d1){d2=d1;d1=dd;nx=dx;ny=dy;id=hs(a*7+seed,b*13+1)}else if(dd<d2)d2=dd}
  return[Math.sqrt(d2)-Math.sqrt(d1),.42+id*.22-(nx+ny)*.5]}
// the moss of each world: deserts get an olive moss over their sand-colored earth
const MOSS={sinai:['#4f8a34','#a6cc52'],mar:['#3f8a4a','#94c85a'],abismo:['#2e6a4e','#6aa86a'],jerico:['#5c9238','#b4d458'],babel:['#58883a','#a8c858']};

function drawGround(){
  const M=MAP,P=M.pal,th=theme(P),desert=!P.grass;M.atlas=buildTiles(P,th);M.gfalls=[];
  const B=layerBuf(GROUND,'#000000',0,1,0),{d,w,h,k}=B,R=a=>a.map(u32),T=M.gyT,G=u=>T[Math.max(0,Math.min(T.length-1,Math.round(u*2)))];
  const[m2,m1]=MOSS[MAPID]||[P.top2,P.top1];M.mossTop=m1;
  const moss=R([shade(m2,-.66),shade(m2,-.46),shade(m2,-.24),m2,mixHex(m2,m1,.5),m1,shade(m1,.32)]);
  const soil=R([shade(P.fill,-.84),shade(P.fill,-.72),shade(P.fill,-.58),shade(P.fill,-.42),shade(P.fill,-.24),P.fill,P.lite]);
  const sb=mixHex('#6e7080',P.fill,desert?.5:.15),stone=R([shade(sb,-.72),shade(sb,-.52),shade(sb,-.3),sb,shade(sb,.22),shade(sb,.45)]);
  const deep=R(['#081428','#0c2040','#14305a','#1e4a7a']),rootC=[u32(shade(P.fill,-.66)),u32(shade(P.fill,-.32)),u32(shade(P.lite,.08))];
  const near=x0=>M.slots.some(s=>Math.abs(s.x-x0)<12&&Math.abs(s.y-G(x0))<2);
  // moss drips: most columns hang a little, some hang long, each narrowing to a point
  const drip=(u,s)=>{const i=Math.floor(u*1.4),n=hs(i,s),f=u*1.4-i,L=n>.86?5+hs(i,s+1)*11:n>.45?1+hs(i,s+1)*3:0;return L*(1-Math.abs(f-.5)*1.5)};
  const rock=(u,v,dark,seed=3,sx=5.5,sy=4)=>{const[e,s]=stoneAt(u,v,sx,sy,seed);return e<.07?0:e<.15?Math.max(.05,s-.32-dark):s-dark};
  // the ground: one column at a time. A thick moss cap with a ragged top and drips, dark earth that deepens with depth,
  // rock walls under every drop
  const bowl=u=>{if(!M.water)return 0;const[a,b]=M.water,t=(u-a)/(b-a);return t<=0||t>=1?0:6+22*Math.pow(Math.sin(Math.PI*t),.7)};
  for(let X=0;X<w;X++){const u=(X+.5)/k,top=G(u),bw=bowl(u),wet=bw>0,slope=G(u+1.5)-G(u-1.5);
    let eR=9,eL=9,dR=0,dL=0;for(let q=1;q<=8;q++){if(eR===9&&G(u+q)-top>5){eR=q;dR=G(u+q+2)-top}if(eL===9&&G(u-q)-top>5){eL=q;dL=G(u-q-2)-top}}
    const cliff=Math.min(eR,eL)<4,blade=hs(X,17)>.7?hs(X,18)*1.6:0,bump=wet?0:vn(u*.6,9)*1.1+blade;
    const capH=3+vn(u*.3,7)*2.2+(cliff?1.2:0),dr=wet?0:drip(u,31)*(cliff?1.8:1);
    for(let Y=Math.max(0,Math.floor((top-bump)*k));Y<h;Y++){const v=(Y+.5)/k,dd=v-top;let c;
      if(wet&&dd<bw+.5){if(dd<.5)continue;c=rp(deep,1-Math.min(1,dd/bw),X,Y,1.6)}
      else if(wet&&dd<bw+2.5)c=rp(stone,.35+hs(X,Y)*.4,X,Y)
      else if(dd<capH)c=rp(moss,(dd<0?.95:.88-dd/capH*.5)+(fbm(u*.8,v*.8,3)-.5)*.42+(slope<-1?.08:slope>1?-.08:0)+(eL<4?.08:0)-(eR<4?.1:0),X,Y,2.4);
      else if(dd<capH+dr){const t=(dd-capH)/dr;c=rp(moss,t>.85?.62:.42-t*.25,X,Y,2)}
      else{const e=dd-capH,occ=e<2.5?.28*(1-e/2.5):0,dark=Math.min(.55,e*.0105);
        const wall=(eR<5&&dd<dR+3)||(eL<5&&dd<dL+3);
        if(wall)c=rp(stone,rock(u,v,dark+occ)+(eL<5?.08:0),X,Y,2.2);
        else c=rp(soil,.66-dark-occ+(fbm(u*.16,v*.16,5)-.5)*.32,X,Y,2.2)}
      d[Y*w+X]=c}}
  // stones bedded in the earth, moss on the ones near the top
  const egg=(cx,cy,rx,ry,ramp,lit=.5)=>{for(let Y=Math.floor((cy-ry)*k);Y<=Math.ceil((cy+ry)*k);Y++)for(let X=Math.floor((cx-rx)*k);X<=Math.ceil((cx+rx)*k);X++){
    if(X<0||Y<0||X>=w||Y>=h)continue;const nx=((X+.5)/k-cx)/rx,ny=((Y+.5)/k-cy)/ry,q=nx*nx+ny*ny;if(q>1)continue;d[Y*w+X]=rp(ramp,q>.7&&nx+ny>.3?0:light(nx,ny)*lit*2-.1,X,Y,2.2)}};
  for(let i=0;i<M.ww/10;i++){const sx=hs(i,201)*M.ww;if(inWater(sx))continue;const y0=G(sx)+8+hs(i,202)*40,rx=1.4+hs(i,203)*(hs(i,205)>.8?6:3),ry=rx*(.6+hs(i,204)*.3);egg(sx,y0,rx,ry,stone)}
  // roots: wandering lines from under the moss, lighter than the dark earth, now and then forking
  const rootLine=(x0,y0,L,dir,seed,thick)=>{let px=x0,py=y0;for(let t=0;t<L;t+=.5){px+=Math.sin(t*.25+seed)*.35*dir;py+=.5;dot(B,px+.5,py,rootC[0]);dot(B,px,py,rootC[1]);if(thick)dot(B,px-.5,py,rootC[2]);
    if(t>3&&L>4&&hs(seed,(t*2)|0)>.94)rootLine(px,py,(L-t)*.5,-dir,seed+5,false)}};
  for(let i=0;i<M.ww/7;i++){const rx=hs(i,211)*M.ww;if(inWater(rx))continue;rootLine(rx,G(rx)+3.5,6+hs(i,212)*22,i%2?1:-1,i,hs(i,213)>.55)}
  // floating islands: an overhanging moss cap, earth with roots in the upper body, packed stones below, lumpy lobes underneath,
  // moss and roots hanging into the air
  M.plats.forEach((pl,pi)=>{if(pl.wall)return;const cx=pl.x+pl.w/2,hc=pl.w/2+3,s=pi*31+7;
    for(let X=Math.floor((cx-hc)*k);X<Math.ceil((cx+hc)*k);X++){if(X<0||X>=w)continue;const u=(X+.5)/k,q=(u-cx)/hc,aq=Math.abs(q),room=G(u)-pl.y-5;if(aq>=1||room<=0)continue;
      const dep=Math.min(islandDepth(pl,u),room-4),end=aq>.86?(aq-.86)*22:0,blade=hs(X,s)>.72?hs(X,s+1)*1.6:0,top=pl.y+end-(end?0:vn(u*.7,s)*1.1+blade);
      const capH=Math.max(1.5,2.8+vn(u*.4,s+2)*1.6-end*.5),body=dep>capH,dr=Math.max(0,Math.min(room-capH,body?drip(u,s+5):drip(u,s+5)*1.6+1.5));
      for(let Y=Math.max(0,Math.floor(top*k));Y<Math.ceil((pl.y+Math.max(dep,capH+dr))*k);Y++){if(Y>=h)break;const v=(Y+.5)/k,dd=v-pl.y;let c;
        if(dd<capH)c=rp(moss,(v<pl.y?.95:.88-dd/capH*.5)+(fbm(u*.8,v*.8,s)-.5)*.42-q*.12,X,Y,2.4);
        else if(dd<capH+dr){const t=(dd-capH)/dr;c=rp(moss,t>.85?.6:.4-t*.25,X,Y,2)}
        else if(dd<dep){const f=(dd-capH)/Math.max(1,dep-capH),rim=pl.y+dep-v<1.2,rocky=f>.3+vn(u*.3,s+4)*.3;
          let sh=rocky?rock(u,v,.2*f,s)-q*.18:.6-f*.3-q*.2+(fbm(u*.2,v*.2,s+9)-.5)*.3;if(dd-capH<2)sh-=.25*(1-(dd-capH)/2);if(rim)sh=Math.min(sh,.05);
          c=rp(rocky?stone:soil,sh,X,Y,2.2)}
        else continue;
        d[Y*w+X]=c}}
    for(let j=0;j<3+pl.w/9;j++){const rx=pl.x+2+hs(pi,j+120)*(pl.w-4),bot=pl.y+Math.min(islandDepth(pl,rx),G(rx)-pl.y-5)-.5,room=G(rx)-bot-3;if(room<2)continue;
      const L=Math.min(room,3+hs(pi,j+130)*12);if(hs(pi,j+140)>.45)rootLine(rx,bot,L,j%2?1:-1,pi*9+j,hs(pi,j+150)>.6);
      else for(let t=0;t<L;t+=.5){const px=rx+Math.sin(t*.3+j)*.6;dot(B,px,bot+t,moss[t>L-1?5:2]);if(((t*2)|0)%5===0)dot(B,px+.5,bot+t,moss[4])}}});
  // a dark outline around every shape, like the sprites have
  {const OL=u32('#140c10'),src=d.slice();for(let Y=1;Y<h-1;Y++)for(let X=1;X<w-1;X++){const i=Y*w+X;if(!src[i]&&(src[i-1]||src[i+1]||src[i-w]||src[i+w]))d[i]=OL}}
  // waterfalls: off an island's edge, or out of the rock of Horeb on Sinai (Exodus 17:6)
  const fallPx=(fx,fw,y0,y1)=>{for(let X=Math.floor(fx*k);X<Math.ceil((fx+fw)*k);X++)for(let Y=Math.floor(y0*k);Y<Math.ceil(y1*k);Y++){if(X<0||X>=w||Y<0||Y>=h)continue;
      const u=(X+.5)/k,v=(Y+.5)/k,e=Math.min(u-fx,fx+fw-u);let s=.55+(vn(u*1.3,v*.05,7)-.5)*.7;if(e<.7)s-=.4;if(v<y0+1.5)s+=.35;d[Y*w+X]=ink(B,'water',s,X,Y,v)}
    for(let i=0;i<4;i++)disk(B,fx+fw/2+(i-1.5)*fw*.55,y1-.5+hs(i,fx|0)*1.5,fw*.5+hs(i+4,fx|0)*1.5,(X,Y,nx,ny,f,u,v)=>v>y1+.8||f<.1&&bay(X,Y)>.5?-1:ink(B,'mist',light(nx,ny),X,Y,v));
    M.gfalls.push({x:fx,w:fw,y0,y1})};
  M.plats.forEach(pl=>{if(!pl.fall)return;const fw=4,fx=pl.fall==='L'?pl.x-1:pl.x+pl.w-fw+1;fallPx(fx,fw,pl.y-.5,G(fx+fw/2))});
  if(M.rockFall){const f=M.rockFall;fallPx(f.x,3,f.y0,G(f.x+8))}
  putBuf(B);
  // Jericho's towers keep their brick: columns from each wall platform down to the ground, brick caps on top
  const A=M.atlas,st=(i,dx,dy,ww=T0)=>C.drawImage(A,i*T0*A.__k,0,ww*A.__k,T0*A.__k,dx,dy,ww,T0),T0=8;
  M.plats.forEach(pl=>{if(!pl.wall)return;const g2=G(pl.x+pl.w/2);
    if(M._fallen){for(let i=0;i<pl.w;i+=3)r(pl.x+i,g2-2-(hs(i,pl.x)*7|0),3,9,i%2?'#8a5c3a':'#6a4228');return}
    r(pl.x+2,pl.y,pl.w-4,g2-pl.y,'#8a5c3a');for(let j=pl.y+4;j<g2;j+=5){r(pl.x+2,j,pl.w-4,1,'#6a4228');for(let i=pl.x+2+((j/5|0)%2)*5;i<pl.x+pl.w-2;i+=10)r(i,j-4,1,4,'#6a4228')}
    r(pl.x+2,pl.y,1,g2-pl.y,'#b88a5a');r(pl.x+pl.w-3,pl.y,1,g2-pl.y,'#5a3420');
    for(let i=0;i<pl.w;i+=T0){const last=i+T0>=pl.w,px=last?pl.x+pl.w-T0:pl.x+i,v=hs(i,pl.y)*3|0;st(i===0?TI.capL:last?TI.capR:TI.cap+v,px,pl.y);st(i===0?TI.underL:last?TI.underR:TI.under+(v&1),px,pl.y+T0)}});
  outlinedGround(()=>decorate(near));
}

// ---------- decoration baked into the ground: what grows and lies around differs from world to world
const DECOR={
  eden:['bush','fern','flowers','flowers','mushroom','mossrock','grass','sapling','fern','flowers'],getsemani:['mossrock','fern','grass','bush','mossrock','sapling','fern'],
  tumulo:['flowers','flowers','bush','lily','grass','sapling','fern'],ressurreicao:['flowers','flowers','bush','lily','grass','sapling','fern','mushroom'],
  sinai:['cactus','fern','boulder','flowers','mossrock','shrub','grass','bush','cactus'],mar:['reeds','fern','shell','flowers','mossrock','bush','reeds','grass','driftwood'],
  jerico:['palmlet','fern','jar','flowers','mossrock','bush','grass','cactus','sapling'],babel:['palmlet','fern','bricks','flowers','mossrock','bush','grass','jar','sapling'],
  abismo:['reeds','fern','mossrock','shell','bush']};
function decorate(near){const M=MAP,P=M.pal,kinds=DECOR[MAPID]||DECOR.eden,G=gy,[m2,m1]=MOSS[MAPID]||[P.top2,P.top1],leaf=[shade(m2,-.45),m2,m1];
  const bad=x0=>x0<46||x0>M.ww-6||near(x0)||inWater(x0)||(M.sea&&x0>M.sea[0]-6&&x0<M.sea[1]+6)||Math.abs(G(x0+3)-G(x0-3))>3||
    M.plats.some(pl=>pl.wall&&x0>pl.x-4&&x0<pl.x+pl.w+4)||(MAPID==='eden'&&Math.abs(x0-530)<16)||(MAPID==='sinai'&&Math.abs(x0-470)<16);
  const V=(M.variant||0)*977;for(let x0=50,i=0;x0<M.ww-8;x0+=5+hs(i+V,301)*10,i++){if(bad(x0)||hs(i+V,302)<.15)continue;decor(kinds[(hs(i+V,303)*kinds.length)|0],x0,G(x0),i+V,leaf)}
  M.plats.forEach((pl,pi)=>{if(pl.wall)return;for(let ex=pl.x+3,j=0;ex<pl.x+pl.w-3;ex+=8+hs(pi,j+400)*7,j++){if(M.slots.some(s=>Math.abs(s.x-ex)<10&&Math.abs(s.y-pl.y)<1))continue;decor(kinds[(hs(pi,ex|0)*kinds.length)|0],ex,pl.y,pi*31+j+50,leaf)}})}
function decor(t,X,Y,s,leaf){const R=(dx,dy,w,h,c)=>r(X+dx,Y+dy,w,h,c);
  if(t==='bush'){const z=3+hs(s,1)*3;blob(X,Y-z*.7,z+1|0,z*.8|0,leaf[0],leaf[1],leaf[2],s);if(hs(s,2)>.5)for(let i=0;i<3;i++)R(-z+hs(s,i+3)*z*2,-z*1.1+hs(s,i+6)*z,1,1,['#ff4f7b','#ffe36a','#c58cff'][(s+i)%3])}
  else if(t==='fern'){for(let b=0;b<7;b++){const a=Math.PI*(.18+b*.11),dir=b<3.5?-1:1;for(let j=0;j<7;j+=.5)R(Math.cos(a)*j*dir*(b<3.5?1:-1)*.9,-Math.sin(a)*j+j*j*.05,.5,.5,j>5?leaf[2]:leaf[1])}}
  else if(t==='flowers'){for(let i=0;i<4;i++){const fx=-3+i*2+hs(s,i)*1.5,fh=2+hs(s,i+4)*3;R(fx,-fh,.5,fh,leaf[1]);R(fx-.5,-fh-1,1.5,1.5,['#ff8ab0','#ffe36a','#ffffff','#c58cff','#ff6a4a'][(s+i)%5]);R(fx,-fh-.5,.5,.5,'#fff6c0')}}
  else if(t==='lily'){for(let i=0;i<3;i++){const fx=-2+i*2;R(fx,-5,.5,5,leaf[1]);R(fx-1,-7,2.5,2,'#ffffff');R(fx-.5,-6,1.5,1,'#f0e8d0');R(fx,-7,.5,.5,'#ffe36a')}}
  else if(t==='mushroom'){for(const[ox,sz]of[[0,1],[3,.7]]){R(ox,-2*sz,1,2*sz,'#f0e8d8');R(ox-1.5*sz,-3.5*sz,3*sz+1,1.5*sz,'#e0283a');R(ox-1*sz,-3.5*sz,1,.5,'#ffffff');R(ox+1*sz,-3*sz,.5,.5,'#ffffff')}}
  else if(t==='mossrock'||t==='boulder'||t==='skullrock'){const z=2.5+hs(s,1)*3;blob(X,Y-z*.6,z+1|0,z*.75|0,'#4a4a56','#7a7a88','#a8a8b8',s+7);if(t==='mossrock')R(-z*.6,-z*1.25,z*1.2,1,leaf[1]);if(t==='skullrock'){R(-1,-z,1,1,'#2a2a30');R(1,-z,1,1,'#2a2a30')}}
  else if(t==='cactus'){const hh=6+hs(s,1)*5;R(-1,-hh,2.5,hh,'#3e7a34');R(-1,-hh,1,hh,'#6aaa4a');R(-1,-hh-.5,2.5,.5,'#8ac860');
    R(-3.5,-hh*.6,2.5,1,'#3e7a34');R(-3.5,-hh*.6-3,1,3,'#3e7a34');R(-3.5,-hh*.6-3,.5,3,'#6aaa4a');if(hs(s,2)>.4){R(1.5,-hh*.45,2,1,'#3e7a34');R(2.5,-hh*.45-2.5,1,2.5,'#3e7a34')}if(hs(s,3)>.5)R(0,-hh-1.5,1,1,'#ff6a8a')}
  else if(t==='sapling'){const hh=7+hs(s,1)*5,lean=(hs(s,2)-.5)*4;for(let j=0;j<hh;j+=.5)R(lean*j/hh,-j,1,.5,j<hh*.5?'#5a3a24':'#6a4a2e');R(lean*.5,-hh*.6,(lean>0?-3:3),.5,'#5a3a24');
    blob(X+lean,Y-hh-1,4,3,leaf[0],leaf[1],leaf[2],s);blob(X+lean*.5+(lean>0?-3:3),Y-hh*.6-1.5,3,2,leaf[0],leaf[1],leaf[2],s+3)}
  else if(t==='grass'){for(let i=0;i<6;i++)R(-3+i,-(1.5+hs(s,i)*3),.5,1.5+hs(s,i)*3,i%2?leaf[1]:leaf[2])}
  else if(t==='shrub'){for(let i=0;i<9;i++){const a=Math.PI*(.15+i*.085),L=3+hs(s,i)*2;for(let j=0;j<L;j+=.5)R(Math.cos(a)*j,-Math.sin(a)*j,.5,.5,j>L-1?'#a8a050':'#6a6a30')}}
  else if(t==='palmlet'){for(let b=0;b<5;b++){const a=Math.PI*(.1+b*.2);for(let j=0;j<6;j+=.5)R(Math.cos(a)*j,-3-Math.sin(a)*j+j*j*.08,.5,.5,j>4?'#8ad050':'#3a8a3a')}R(0,-3,.5,3,'#6a4a2a')}
  else if(t==='jar'){R(-1.5,-5,3,5,'#b8683a');R(-1.5,-5,1,4,'#d88a50');R(-1,-6,2,1,'#8a4a28');R(-1.5,-1,3,1,'#8a4a28')}
  else if(t==='bricks'){for(let i=0;i<3;i++)for(let j=0;j<3-i;j++){R(-4+j*3+i*1.5,-2-i*2,2.5,1.5,'#b07050');R(-4+j*3+i*1.5,-2-i*2,2.5,.5,'#d09070')}}
  else if(t==='shell'){R(-1,-1.5,3,1.5,'#f8d8c8');R(-.5,-2,2,.5,'#ffe8e0');R(0,-1.5,.5,1.5,'#e0a898');R(1,-1.5,.5,1.5,'#e0a898')}
  else if(t==='reeds'){for(let i=0;i<5;i++){const hh=4+hs(s,i)*5;R(-2+i,-hh,.5,hh,'#6a8a3a');if(i%2)R(-2+i,-hh-1.5,.5,1.5,'#7a4a2a')}}
  else if(t==='driftwood'){R(-4,-1.5,8,1.5,'#9a8068');R(-4,-1.5,8,.5,'#c0a888');R(2,-2.5,1,1,'#9a8068')}
}
// falling water off the islands: bright streaks slide down, foam flickers where it lands
function drawGFalls(){for(const f of MAP.gfalls||[]){if(f.x<S.cam-10||f.x>S.cam+W+10)continue;const h=f.y1-f.y0;x.globalAlpha=.8;
  for(let j=0;j<f.w;j+=.5)for(let n=0;n<2;n++){const yy=f.y0+((S.t*40+hs(j*2|0,n+1)*h+n*h/2)%h);r(f.x+j,yy,.5,Math.min(3,f.y1-yy),'#ffffff')}
  x.globalAlpha=1;for(let n=0;n<4;n++)if(Math.sin(S.t*7+n*1.7+f.x)>0)r(f.x-1+hs(n,f.x|0)*(f.w+2),f.y1-1-hs(n+3,f.x|0)*2.5,1,.5,'#ffffff');
  if(Math.random()<.05)S.parts.push({x:f.x+rnd(0,f.w),y:f.y1-1,vx:rnd(-12,12),vy:rnd(-30,-12),g:120,life:.5,max:.5,c:'#bfe8ff',s:1})}}
// draw something onto the ground canvas with a dark outline around it, like the sprites
function outlinedGround(fn){const keep=C,off=mkHD(MAP.ww,H),g=off.getContext('2d');C=g;try{fn()}finally{C=keep}
  const sil=mkHD(MAP.ww,H),s=sil.getContext('2d');s.setTransform(1,0,0,1,0,0);s.drawImage(off,0,0);s.globalCompositeOperation='source-in';s.fillStyle='#1a0c10';s.fillRect(0,0,sil.width,sil.height);
  for(const[a,b]of[[-1,0],[1,0],[0,-1],[0,1]])C.drawImage(sil,a,b,MAP.ww,H);C.drawImage(off,0,0,MAP.ww,H)}

// ---------- each of a world's four levels has its own lay of the land. The first keeps the hand-made layout; the
// others raise a mound or two on long flats (never under a tree slot) and shift the islands, always within jump reach.
function varyTerrain(v){const M=MAP;
  if(!M.base){if(!M.prof)M.prof=growProf(M);
    M.slots.forEach(s=>{const i=M.plats.findIndex(p=>Math.abs(s.y-p.y)<1&&s.x>=p.x-2&&s.x<=p.x+p.w+2);if(i>=0){s.pl=i;s.dx=s.x-M.plats[i].x}});
    M.base={plats:M.plats.map(p=>({...p})),prof:M.prof.map(n=>[...n]),slots:M.slots.map(s=>({x:s.x,y:s.y}))}}
  M.plats=M.base.plats.map(p=>({...p}));M.prof=M.base.prof.map(n=>[...n]);M.slots.forEach((s,i)=>{s.x=M.base.slots[i].x;s.y=M.base.slots[i].y});
  if(!v)return;const P=M.prof,free=m=>m>70&&!M.slots.some(s=>s.pl==null&&Math.abs(s.x-m)<26)&&!inWater(m)&&!(M.sea&&m>M.sea[0]-30&&m<M.sea[1]+30)&&
    !(MAPID==='eden'&&Math.abs(m-530)<30)&&!(MAPID==='sinai'&&Math.abs(m-470)<30)&&!M.plats.some(p=>p.wall&&m>p.x-24&&m<p.x+p.w+24);
  let made=0;for(let i=0;i<P.length-1&&made<2;i++){const[a,y]=P[i],[b,y2]=P[i+1];if(y!==y2||b-a<64)continue;
    for(let tries=0;tries<6;tries++){const m=a+22+hs(v*13+i,tries)*(b-a-44);if(!free(m))continue;const hh=5+hs(v*7+i,3)*5;P.splice(i+1,0,[m-18,y],[m,y-hh],[m+18,y]);made++;i+=3;break}}}
function varyIslands(v){const M=MAP;
  if(v){const P=M.plats;P.forEach((pl,i)=>{if(pl.wall)return;const h1=hs(v*31+i,7),h2=hs(v*17+i,9);let nx=clamp(pl.x+Math.round((h1-.5)*22),24,M.ww-pl.w-8);
      for(const q of P)if(q!==pl&&nx<q.x+q.w+12&&nx+pl.w>q.x-12)nx=pl.x;pl.x=nx;
      let low=1e9;for(let x0=pl.x;x0<=pl.x+pl.w;x0+=2)low=Math.min(low,gy(x0));pl.y=Math.round(clamp(pl.y+[0,-6,6,-4,4][(h2*5)|0],low-46,low-28))})}
  // islands of many sizes: some stay small, others stretch wide. An island only grows over open ground (no bed under its
  // new part), keeps 12 units from its neighbours, floats 24 units over the ground under all of it, and its trees stay put
  const P=M.plats,ground=M.slots.filter(s=>s.pl==null).map(s=>s.x),order=P.map((p,i)=>i).sort((a,b)=>P[a].x-P[b].x);
  order.forEach((i,j)=>{const pl=P[i];pl.xs=pl.x;if(pl.wall)return;const prev=j?P[order[j-1]]:null,next=j<order.length-1?P[order[j+1]]:null;
    let lo=prev?prev.x+prev.w+12:24,hi=next?next.x-12:M.ww-8;for(const gx of ground){if(gx<pl.x-6)lo=Math.max(lo,gx+10);else if(gx>pl.x+pl.w+6)hi=Math.min(hi,gx-10)}
    const nw=pl.w*[.9,1,1.5,1.9,2.4][(hs(i*7+v*3,23)*5)|0],cx=pl.x+pl.w/2;let a=Math.max(lo,Math.min(pl.x,cx-nw/2)),b=Math.min(hi,Math.max(pl.x+pl.w,cx+nw/2));
    let low=1e9;for(let x0=a;x0<=b;x0+=2)low=Math.min(low,gy(x0));if(pl.y>low-24){a=pl.x;b=pl.x+pl.w}
    pl.x=Math.round(a);pl.w=Math.round(b-a)});
  // two or three extra islets per level: small stepping stones at their own heights, some stacked a jump above another island
  {const sd=MAPID.charCodeAt(0)*5+v*23;for(let k=0;k<3;k++){const w=16+(hs(sd,k+40)*16|0),x0=Math.round(70+hs(sd,k+50)*(M.ww-150)),under=M.plats.find(p=>!p.wall&&x0+w>p.x&&x0<p.x+p.w);let y;
      if(under){if(hs(sd,k+60)<.45)continue;y=under.y-30}else{let lo=1e9;for(let u=x0;u<=x0+w;u+=2)lo=Math.min(lo,gy(u));y=lo-(30+(hs(sd,k+70)*14|0))}
      if(y<56||M.plats.some(p=>p!==under&&x0<p.x+p.w+10&&x0+w>p.x-10&&Math.abs(p.y-y)<26)||(under&&M.plats.some(p=>p.wall&&x0<p.x+p.w+10&&x0+w>p.x-10)))continue;
      M.plats.push({x:x0,xs:x0,y:Math.round(y),w,extra:1})}}
  // no island sinks into the new relief: every one floats at least 24 units over the highest ground under it
  M.plats.forEach(pl=>{if(pl.wall)return;let hi=1e9;for(let u=pl.x;u<=pl.x+pl.w;u+=2)hi=Math.min(hi,gy(u));if(pl.y>hi-24)pl.y=Math.round(hi-24)});
  // one or two islands spill a waterfall, in every world
  if(v||!M.plats.some(p=>p.fall)){let n=0;M.plats.forEach((pl,i)=>{delete pl.fall;const h=hs(v*5+i,11);if(!pl.wall&&h>.55&&n<2){pl.fall=h>.78?'L':'R';n++}})}
  M.slots.forEach(s=>{if(s.pl!=null){const pl=M.plats[s.pl];s.x=pl.xs+s.dx;s.y=pl.y}})}
// ---------- weather by level: [first, second, third, fourth]
const WEATHER={eden:[null,null,'petals','rain'],jerico:['wind',null,'sand',null],mar:['wind','mist','mist',null],sinai:[null,'rain','sand','rain'],
  babel:['sand',null,'wind','sand'],getsemani:['mist','rain','mist','mist'],tumulo:['petals'],ressurreicao:['petals',null,'petals','mist']};
function drawWeather(){const w=S.wx;if(!w||CFG.lite&&w!=='rain')return;const t=S.t,loop=(v,m)=>((v%m)+m)%m;
  if(w==='rain'){x.globalAlpha=.55;for(let i=0;i<70;i++){const sx=loop(hs(i,1)*W*1.3-t*90-i*7,W+40)-20,sy=loop(hs(i,2)*H+t*260,H+20)-10;r(sx,sy,.5,4,'#bfe0ff');r(sx-.5,sy+4,.5,2,'#bfe0ff')}
    x.globalAlpha=1;x.fillStyle='rgba(40,60,100,.12)';x.fillRect(0,0,W+1,H);if(Math.random()<.4){const sx=S.cam+rnd(0,W);if(!inWater(sx))vfx('splash',sx,gy(sx))}}
  else if(w==='wind'){for(let i=0;i<22;i++){const sp=50+hs(i,3)*60,sx=loop(hs(i,1)*(W+60)-t*sp,W+60)-30,sy=30+hs(i,2)*150+Math.sin(t*2+i)*8,f=(t*8+i|0)%2;r(sx,sy,f?2:1,f?1:2,['#7ac050','#c8d050','#e8a040','#5fae4a'][i%4])}}
  else if(w==='sand'){x.globalAlpha=.6;for(let i=0;i<60;i++){const sp=80+hs(i,3)*90,sx=loop(hs(i,1)*(W+60)-t*sp,W+60)-30,sy=60+hs(i,2)*140+Math.sin(t*3+i)*4;r(sx,sy,1+(i%3===0),.5,'#e8c890')}
    x.globalAlpha=1;x.fillStyle='rgba(220,170,100,.08)';x.fillRect(0,0,W+1,H)}
  else if(w==='petals'){for(let i=0;i<26;i++){const sx=loop(hs(i,1)*(W+40)-t*(14+hs(i,4)*12),W+40)-20+Math.sin(t*1.5+i)*6,sy=loop(hs(i,2)*H+t*(18+hs(i,5)*14),H+10)-5,f=(t*4+i|0)%2;r(sx,sy,f?1.5:1,1,i%3?'#ffc8dc':'#ffffff')}}}
