// ---------- painted scenery: sky, clouds, far ranges, cliffs, forests and towns behind each battle.
// Everything is painted per pixel on the half-unit grid. A material is a short ramp of colors (dark to light);
// shading picks a step and dithers only near the edge between two steps, the way pixel artists blend.
// Far layers fade into the sky color through dithered haze levels.
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16),bay=(X,Y)=>BAY[(Y&3)<<2|(X&3)];
const rgbOf=h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]};
const hexOf=c=>'#'+c.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
const mixHex=(a,b,t)=>{const A=rgbOf(a),B=rgbOf(b);return hexOf(A.map((v,i)=>v+(B[i]-v)*t))};
const u32=h=>{const[r,g,b]=rgbOf(h);return(0xff000000|b<<16|g<<8|r)>>>0};
let GRADE=null;
const graded=h=>{if(!GRADE)return h;const T=rgbOf(GRADE.tint);return hexOf(rgbOf(h).map((v,i)=>{v*=GRADE.mul[i];return v+(T[i]-v)*GRADE.t}))};
function rp(R,v,X,Y,sh=2){const n=R.length-1,f=(v<0?0:v>1?1:v)*n,i=f>=n?n:f|0,q=(f-i-.5)*sh+.5;return i<n&&q>bay(X,Y)?R[i+1]:R[i]}
function vn(x,y,s=0){const xi=Math.floor(x),yi=Math.floor(y),a=x-xi,b=y-yi,u=a*a*(3-2*a),v=b*b*(3-2*b),o=s*977;
  const p=hs(xi+o,yi),q=hs(xi+1+o,yi),m=hs(xi+o,yi+1),t=hs(xi+1+o,yi+1);return p+(q-p)*u+(m-p)*v+(p-q-m+t)*u*v}
const fbm=(x,y,s=0)=>vn(x,y,s)*.55+vn(x*2.1,y*2.1,s+7)*.3+vn(x*4.3,y*4.3,s+13)*.15;

const SKIES={
  day:['#1b5a92','#2271aa','#2c88bf','#3fa0cf','#5cb8dc','#84cde4','#b0e0e8','#d8f0e8'],
  desert:['#2462a8','#3079bc','#4592cb','#62aad6','#86c2df','#acd6e2','#d2e4d8','#f2e8c8'],
  dusk:['#231d48','#33275c','#4a2f6e','#6a3a7a','#91477e','#b9587a','#de7470','#f39c68','#fcc878'],
  night:['#05081e','#0a1030','#101a42','#182452','#213064','#2e3e74'],
  dawn:['#3a4688','#5a5296','#86609e','#b46e9e','#dc849a','#f4a296','#ffc49a','#ffe2b0','#fff2d0']};
const CLOUDS={day:['#6c8cb6','#90b0d4','#b8d0e8','#dfecf7','#ffffff'],dusk:['#4e3466','#7e4676','#b45e7c','#e48a84','#fcc4a0'],
  night:['#10163a','#18224c','#24325e','#344670','#4a5e88'],dawn:['#8a6898','#ba86a6','#e6a6ae','#fcccb6','#fff0dc'],storm:['#16142c','#24203c','#363050','#4a4264','#625a80']};
const SUNS={day:{r:10,glow:80,g:.5,ramp:['#ffe9a8','#fff5cc','#ffffff']},dusk:{r:20,glow:150,g:.55,ramp:['#e8583a','#f68046','#fcac5c','#fed88a']},
  dawn:{r:22,glow:170,g:.5,ramp:['#ffa070','#ffc890','#ffecc0','#ffffff']},night:{r:11,glow:60,g:.25,moon:1,ramp:['#9c9a8c','#c8c4b0','#ece8d4','#ffffff']}};
const GRADES={dusk:{mul:[.86,.66,.76],tint:'#3c1e58',t:.24},night:{mul:[.4,.48,.72],tint:'#0a1232',t:.36},dawn:{mul:[1,.88,.9],tint:'#f0a0a8',t:.14}};
const MAT={
  range:['#3f5584','#4e6898','#6582b0','#83a0c8','#a6bedc'],hills:['#2c5a66','#38707a','#4a8a86','#62a490','#84bea0'],
  snow:['#9cb6d6','#c8daee','#f2f8ff'],desert:['#7a4a4e','#965a54','#b2725c','#cc9068','#e4b47e'],
  rock:['#5a3436','#7c4a3c','#a2663e','#c4844c','#dea666','#f2c886'],redrock:['#5a2a2e','#7e3a36','#a4503c','#c4704a','#dc9460','#eeb87a'],
  grass:['#1e5a44','#2c7a46','#4a9a3e','#7cbc46','#b0dc62'],leaf:['#173e3a','#1f5642','#2a7044','#3e8c42','#62ac46','#96cc58'],
  olive:['#26383a','#34504a','#4a6a58','#688a6c','#90ac84'],bark:['#2e1a18','#4a2c22','#6a4430','#8a5e40'],
  palm:['#1c4a30','#2a6a36','#3e8a3a','#64aa44','#98c858'],water:['#2a72a8','#3e94c8','#6cbce0','#a8e0f0','#f0fcff'],
  sea:['#1c4a82','#25609c','#3478b2','#4c94c8','#78b8dc','#b8e0f0'],brick:['#5a3426','#7a4a32','#9c6440','#bc8254','#d8a46c','#eec48a'],
  stone:['#3a3a4a','#525466','#6c7084','#8a90a2','#b0b6c4'],tent:['#5a3a2a','#8a5a3a','#b8864e','#d8aa6a','#f0d090'],
  reed:['#3a5a2a','#5a7a34','#8a9a44','#bcb45a','#e0d27a'],mist:['#c8e0ec','#e4f0f6','#ffffff']};

// ---- the pixel buffer of one layer
function layerBuf(cvs,haze,h0,h1,max=.9){const w=cvs.width,h=cvs.height,id=new ImageData(w,h);
  return{cvs,w,h,k:cvs.__k,id,d:new Uint32Array(id.data.buffer),haze,h0,h1,max,m:{}}}
const putBuf=B=>B.cvs.getContext('2d').putImageData(B.id,0,0);
function mat(B,n){if(B.m[n])return B.m[n];const out=[];for(let k=0;k<=4;k++)out.push(MAT[n].map(h=>u32(mixHex(graded(h),B.haze,k/4*B.max))));return B.m[n]=out}
function hzL(B,v,X,Y){const f=clamp((v-B.h0)/(B.h1-B.h0),0,1)*4,i=f|0;return i>=4?4:f-i>bay(Y+2,X+1)?i+1:i}
const ink=(B,n,s,X,Y,v,sh=2)=>rp(mat(B,n)[hzL(B,v,X,Y)],s,X,Y,sh);
const dot=(B,u,v,c)=>{const X=Math.floor(u*B.k),Y=Math.floor(v*B.k);if(X>=0&&Y>=0&&X<B.w&&Y<B.h)B.d[Y*B.w+X]=c};
// visit every pixel of a disc; fn returns a color, or -1 to leave the pixel alone
function disk(B,cx,cy,rad,fn){const{d,w,h,k}=B,x0=Math.max(0,Math.floor((cx-rad)*k)),x1=Math.min(w-1,Math.ceil((cx+rad)*k)),y0=Math.max(0,Math.floor((cy-rad)*k)),y1=Math.min(h-1,Math.ceil((cy+rad)*k));
  for(let Y=y0;Y<=y1;Y++){const v=(Y+.5)/k,ny=(v-cy)/rad;for(let X=x0;X<=x1;X++){const u=(X+.5)/k,nx=(u-cx)/rad,q=nx*nx+ny*ny;if(q>1)continue;const c=fn(X,Y,nx,ny,1-Math.sqrt(q),u,v);if(c!==-1)d[Y*w+X]=c}}}
const light=(nx,ny)=>{const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));return .5+.5*(-.48*nx-.6*ny+.64*nz)};

// ---- painters
function pSky(B,o){const R=o.sky.map(u32),{d,w,h,k}=B,s=o.sun;
  for(let Y=0;Y<h;Y++){const v=Y/k,t=(v-26)/(o.hor-26);for(let X=0;X<w;X++){let g=0;if(s){const dx=X/k-s.x,dy=(v-s.y)*1.2,q=1-Math.sqrt(dx*dx+dy*dy)/s.glow;if(q>0)g=q*q*s.g}d[Y*w+X]=rp(R,t+g,X,Y,1.5)}}
  if(o.stars){const a=u32('#ffffff'),b=u32('#b8c0e8'),c=u32('#6a74b0');for(let i=0;i<o.stars;i++){const u=hs(i,41)*w/k,v=24+hs(i,42)*(o.hor-70);dot(B,u,v,hs(i,43)>.8?a:b);
    if(hs(i,44)>.93){dot(B,u-.5,v,c);dot(B,u+.5,v,c);dot(B,u,v-.5,c);dot(B,u,v+.5,c)}}}
  if(s){const SR=s.ramp.map(u32);disk(B,s.x,s.y,s.r,(X,Y,nx,ny,f)=>rp(SR,s.moon?.62-nx*.3-ny*.2-(vn(nx*3+5,ny*3+5)>.6?.3:0):.15+f*1.4,X,Y,2))}}
// a cumulus: a back row of puffs, a front row over it, a flat dithered base; each puff lit from the top left
function pCloud(B,cx,cy,wd,ht,seed,ramp){const R=ramp.map(u32),P=[],n=Math.max(3,wd/12|0),base=cy+ht*.5;
  for(let i=0;i<n-1;i++){const t=(i+.5)/(n-1)-.5,rr=ht*(.4+.42*(1-Math.abs(t)*1.7))*(.8+hs(seed,i)*.45);P.push([cx+t*wd*.72+(hs(seed,i+9)-.5)*6,cy-rr*.5,rr])}
  for(let i=0;i<n;i++){const t=i/(n-1)-.5,rr=ht*(.3+.24*(1-Math.abs(t)*1.5))*(.8+hs(seed,i+20)*.4);P.push([cx+t*wd,base-rr*.9,rr])}
  for(const[px,py,pr]of P)disk(B,px,py,pr,(X,Y,nx,ny,f,u,v)=>{if(v>base+hs(X,seed)*1.2||f<.06&&bay(X,Y)>.5)return-1;
    return rp(R,light(nx,ny)*.95-.5*clamp((v-cy+ht*.1)/(ht*.5),0,1)-(v>base-ht*.12?.18:0),X,Y,2.2)})}
// one mountain: a lit left face and a shaded right face split by a wandering ridge, gullies, optional snow cap
function pPeak(B,ax,ay,hw,seed,o){const{d,w,h,k}=B,base=o.base||200,sl=(base-ay)/hw,sk=(hs(seed,1)-.5)*.6,bot=Math.min(h,Math.ceil((o.bot||170)*k));
  const x0=Math.max(0,Math.floor((ax-hw*1.5)*k)),x1=Math.min(w-1,Math.ceil((ax+hw*1.5)*k));
  for(let X=x0;X<=x1;X++){const u=(X+.5)/k,dx=u-ax,a=Math.abs(dx)/hw;
    const top=o.round?ay+a*a*(base-ay)*.45+(fbm(u*.08,seed,3)-.5)*o.jag:ay+Math.abs(dx)*sl*(.8+.4*vn(u*.04,seed))+(fbm(u*.1,seed,3)-.5)*o.jag;
    for(let Y=Math.max(0,Math.ceil(top*k));Y<bot;Y++){const v=(Y+.5)/k,dep=v-ay;let s;
      if(o.round)s=.62-dx/hw*.3+(fbm(u*.25,v*.25,seed)-.5)*.35+.14*Math.max(0,1-(v-top)/4);
      else{const lit=u<ax+dep*sk+(vn(v*.12,seed,5)-.5)*Math.min(dep,40)*.5,e=vn(u*.35+dep*(lit?.3:-.3),v*.08,seed+9);
        s=(lit?.7:.32)+.14*Math.max(0,1-(v-top)/5);if(e>.66)s-=.22;else if(e<.22)s+=.1;
        if(o.snow&&dep<o.snow+(vn(u*.3,seed,11)-.5)*7-Math.abs(dx)*.12){d[Y*w+X]=ink(B,'snow',lit?.85:.3,X,Y,v);continue}}
      d[Y*w+X]=ink(B,o.m,s,X,Y,v,2.4)}}}
// a sunlit cliff: grass (or sand) cap with drips, rock strata, cracks, a lit left edge and a shaded right edge
function pCliff(B,x0,x1,top,seed,o){const{d,w,h,k}=B,bot=Math.min(h,Math.ceil((o.bot||175)*k)),m=o.m||'rock',cap=o.cap;
  for(let X=Math.max(0,Math.floor((x0-5)*k));X<=Math.min(w-1,Math.ceil((x1+5)*k));X++){const u=(X+.5)/k,t=top+(vn(u*.12,seed)-.5)*4,
    capH=cap?2.5+vn(u*.4,seed,6)*2.5:1.5,drip=cap&&hs(X>>1,seed)>.78?hs(X>>1,seed+1)*4:0,bump=cap?vn(u*.7,seed,8)*2.2:0;
    for(let Y=Math.max(0,Math.floor((t-bump)*k));Y<bot;Y++){const v=(Y+.5)/k,dep=v-t,
      eL=x0+(vn(v*.1,seed,2)-.5)*7+Math.max(0,dep)*.05,eR=x1+(vn(v*.1,seed,4)-.5)*7-Math.max(0,dep)*.05,inCap=dep<capH+drip+1,
      lo=inCap?eL-1.5:eL,hi=inCap?eR+1.5:eR;if(u<lo||u>hi)continue;
      if(cap&&dep<capH){d[Y*w+X]=ink(B,cap,.8-Math.max(0,dep)/capH*.45+(u-eL<3?.12:0),X,Y,v);continue}
      if(cap&&inCap){d[Y*w+X]=ink(B,cap,.05,X,Y,v);continue}
      const fl=u-eL,fr=eR-u,sv=dep+(vn(u*.07,seed,9)-.5)*5,ph=((sv%8)+8)%8,cx=u+(vn(v*.1,seed,12)-.5)*4;
      let s=.56-dep*.004+(fbm(u*.25,v*.25,seed)-.5)*.25;if(!cap&&dep<capH)s=.95;
      if(fl<5)s+=.3*(1-fl/5);if(fr<6)s-=.32*(1-fr/6);if(ph<1)s-=.3;else if(ph<2)s+=.12;
      if(((cx%13)+13)%13<.8&&vn(u*.05,v*.05,seed)>.4)s-=.28;
      d[Y*w+X]=ink(B,m,s,X,Y,v,2.2)}}
  if(o.fall){const fx=x0+(x1-x0)*o.fall,fw=4+hs(seed,7)*4,y0=top-1,y1=o.fallTo||150;pFall(B,fx,fw,y0,y1,seed)}}
function pFall(B,fx,fw,y0,y1,seed){const{d,w,k}=B;
  for(let X=Math.floor(fx*k);X<Math.ceil((fx+fw)*k);X++)for(let Y=Math.floor(y0*k);Y<Math.ceil(y1*k);Y++){const u=(X+.5)/k,v=(Y+.5)/k,e=Math.min(u-fx,fx+fw-u);
    let s=.5+(vn(u*1.3,v*.05,seed)-.5)*.7;if(e<.7)s-=.4;if(v<y0+2)s+=.35;if(X>=0&&X<w)d[Y*w+X]=ink(B,'water',s,X,Y,v)}
  for(let i=0;i<4;i++)disk(B,fx+fw/2+(i-1.5)*fw*.6,y1-1+hs(seed,i)*2,fw*.55+hs(seed,i+4)*2,(X,Y,nx,ny,f,u,v)=>f<.1&&bay(X,Y)>.5?-1:ink(B,'mist',light(nx,ny),X,Y,v));
  MAP.falls.push({x:fx,w:fw,y0,y1})}
// a tree crown: one big puff with smaller lumps around its top, leafy texture from noise
function pCrown(B,cx,cy,rr,seed,m='leaf'){const L=[[0,0,1]];for(let j=0;j<4;j++){const a=-Math.PI*(.12+j*.25)+(hs(seed,j)-.5)*.4;L.push([Math.cos(a)*rr*.62,Math.sin(a)*rr*.5,.5+hs(seed,j+5)*.2])}
  for(const[ox,oy,f]of L){const R=rr*f;disk(B,cx+ox,cy+oy,R,(X,Y,nx,ny,e,u,v)=>{if(e<.08&&bay(X,Y)>.6)return-1;
    return ink(B,m,light(nx,ny)-.28*clamp((v-cy)/rr,0,1)+(vn(u*.9,v*.9,seed)-.5)*.3,X,Y,v,2.4)})}}
function pTrunk(B,x,y0,y1,wd,seed){const{d,w,k}=B;for(let Y=Math.floor(y0*k);Y<Math.ceil(y1*k);Y++){const v=(Y+.5)/k,t=(v-y0)/(y1-y0),bw=wd*(.75+t*t*.6),cx=x+Math.sin(v*.15+seed)*.8;
  for(let X=Math.floor((cx-bw/2)*k);X<Math.ceil((cx+bw/2)*k);X++){if(X<0||X>=w)continue;const u=(X+.5)/k,q=(u-cx)/bw+.5;d[Y*w+X]=ink(B,'bark',q<.35?.85:q>.75?.1:.5,X,Y,v)}}}
function pTree(B,x,base,rr,seed,m='leaf'){pTrunk(B,x,base-rr*1.6,base,rr*.32,seed);pCrown(B,x,base-rr*2.1,rr,seed,m)}
// a forest band: rows of crowns, back row first and higher; the floor below the band is deep shade
function pForest(B,x0,x1,base,rad,seed,m='leaf',rows=3){const{d,w,h,k}=B;
  for(let Y=Math.floor((base-rad*.3)*k);Y<h;Y++)for(let X=Math.max(0,Math.floor(x0*k));X<Math.min(w,x1*k);X++)d[Y*w+X]=ink(B,m,.04,X,Y,(Y+.5)/k);
  for(let row=rows-1;row>=0;row--)for(let u=x0+hs(row,seed)*rad,i=0;u<x1+rad;u+=rad*(1.05+hs(i,seed+row)*.6),i++){
    const rr=rad*(.75+hs(i,seed+row+3)*.5);pCrown(B,u,base-row*rad*.55-rr*.35+(hs(i,seed+5)-.5)*rad*.5,rr,seed+i*7+row,m)}}
function pPalm(B,x,base,ht,lean,seed){const{k}=B,tx=t=>x+lean*t*t*ht*.35,ty=t=>base-t*ht;
  for(let t=0;t<=1;t+=.4/ht){const cx=tx(t),cy=ty(t),wd=1.4-t*.5,ring=((cy*1.6|0)%3)===0;for(let o=-wd;o<=wd;o+=.5){const X=(cx+o)*k|0,Y=cy*k|0;dot(B,cx+o,cy,ink(B,'bark',(o<0?.75:.3)-(ring?.25:0),X,Y,cy))}}
  const hx=tx(1),hy=ty(1);
  for(let f=0;f<9;f++){const a=Math.PI*(1.12-f/8*1.24)+(hs(seed,f)-.5)*.25,len=ht*(.4+hs(seed,f+9)*.16),up=Math.sin(a),dir=Math.cos(a)<0?-1:1;
    for(let s=0;s<=1;s+=.35/len){const px=hx+Math.cos(a)*len*s,py=hy-up*len*s*.7+s*s*len*.5,tone=.8-s*.35+up*.15;
      dot(B,px,py,ink(B,'palm',tone,px*k|0,py*k|0,py));const lf=(1-s)*3.2+.8;
      for(let q=.5;q<lf;q+=.5){const lx=px+dir*q*.35,ly=py+q;dot(B,lx,ly,ink(B,'palm',tone-.15-q*.08,lx*k|0,ly*k|0,ly))}}}
  disk(B,hx,hy+1.2,1.4,(X,Y,nx,ny,e,u,v)=>ink(B,'bark',light(nx,ny)*.6,X,Y,v))}
// a shaded block for buildings: brick courses, lit left column, shaded right column
function pBox(B,x0,y0,x1,y1,m,o={}){const{d,w,k}=B;
  for(let Y=Math.max(0,Math.floor(y0*k));Y<Math.min(B.h,Math.ceil(y1*k));Y++)for(let X=Math.max(0,Math.floor(x0*k));X<Math.min(w,Math.ceil(x1*k));X++){
    const u=(X+.5)/k,v=(Y+.5)/k;let s=o.s??.55;const fl=u-x0,fr=x1-u;if(fl<1.2)s+=.3;if(fr<1.5)s-=.3;if(v-y0<1)s+=.25;
    if(o.courses&&((v-y0)%o.courses)<.5)s-=.18;s+=(hs(X,Y)-.5)*.1;d[Y*w+X]=ink(B,m,s,X,Y,v)}}
function pWall(B,x0,x1,top,base,m,tw=4){pBox(B,x0,top,x1,base,m,{courses:3});for(let u=x0;u<x1-1;u+=tw)pBox(B,u,top-2,u+tw*.55,top,m)}
function pTent(B,cx,base,wd,ht,seed){const{d,w,k}=B;
  for(let Y=Math.floor((base-ht)*k);Y<Math.ceil(base*k);Y++){const v=(Y+.5)/k,t=(v-(base-ht))/ht,hw=wd/2*t;
    for(let X=Math.floor((cx-hw)*k);X<Math.ceil((cx+hw)*k);X++){if(X<0||X>=w)continue;const u=(X+.5)/k,q=(u-cx)/(hw||1);
      let s=q<0?.75:.35;if((((u-cx)/2.2|0)+seed)%2)s-=.15;if(Math.abs(q)<.12&&t>.55)s=0;d[Y*w+X]=ink(B,'tent',s,X,Y,v)}}}
function pZiggurat(B,cx,base,bw,tiers,th){
  for(let i=0;i<tiers;i++){const hw=bw/2*(1-i/tiers*.8),y1=base-i*th,y0=y1-th;pBox(B,cx-hw,y0,cx+hw,y1,'brick',{courses:2.5});
    pBox(B,cx-hw-1,y0-1,cx+hw+1,y0+.5,'brick',{s:.85});for(let u=cx-hw+3;u<cx+hw-3;u+=6)pBox(B,u,y0+3,u+1.5,y0+5.5,'brick',{s:.05})}
  pBox(B,cx-5,base-tiers*th,cx+5,base,'brick',{s:.75,courses:1.5});
  const tp=base-tiers*th,hw=bw/2*(1-.8);for(let u=cx-hw;u<=cx+hw;u+=5)pBox(B,u,tp-14,u+.6,tp,'bark',{s:.3});pBox(B,cx-hw,tp-9,cx+hw,tp-8.4,'bark',{s:.3});pBox(B,cx-hw,tp-14,cx+hw,tp-13.4,'bark',{s:.3})}
function pReeds(B,x0,x1,base,seed){for(let u=x0,i=0;u<x1;u+=.5+hs(i,seed)*1.2,i++){const ht=6+hs(i,seed+1)*10,lean=(hs(i,seed+2)-.5)*.3;
  for(let t=0;t<ht;t+=.5)dot(B,u+lean*t,base-t,ink(B,'reed',.25+t/ht*.6,(u*2)|0,(base-t)*2|0,base-t));if(hs(i,seed+3)>.7)for(let t=0;t<2.5;t+=.5)dot(B,u+lean*ht,base-ht-t,ink(B,'bark',.55,0,0,base))}}
function pAcacia(B,x,base,s,seed){pTrunk(B,x,base-s*1.3,base,1.3,seed);pTrunk(B,x+s*.25,base-s*1.25,base-s*.5,.9,seed+1);
  for(let j=-2;j<=2;j++)pCrown(B,x+j*s*.32+s*.1,base-s*1.4+Math.abs(j)*.6,s*.32,seed+j*3,'olive')}
function pBush(B,x,base,rr,seed,m='leaf',fl){pCrown(B,x,base-rr*.6,rr,seed,m);if(fl)for(let i=0;i<5;i++){const u=x+(hs(seed,i)-.5)*rr*1.4,v=base-rr*.6+(hs(seed,i+5)-.6)*rr;dot(B,u,v,u32(graded(fl)));dot(B,u,v-.5,u32(graded('#fff4e0')))}}
// a far floating island: grass cap, a rock wedge tapering to a point, sometimes a thread of water falling off it
function pIsle(B,cx,top,wd,seed,fall){const{d,w,h,k}=B,hw=wd/2;
  for(let X=Math.max(0,Math.floor((cx-hw-1)*k));X<Math.min(w,Math.ceil((cx+hw+1)*k));X++){const u=(X+.5)/k,q=(u-cx)/hw;if(Math.abs(q)>=1)continue;
    const dep=wd*.6*Math.pow(1-q*q,.7)*(.8+.3*vn(u*.3,seed)),bump=vn(u*.8,seed+1)*1.4;
    for(let Y=Math.max(0,Math.floor((top-bump)*k));Y<Math.min(h,Math.ceil((top+dep)*k));Y++){const v=(Y+.5)/k,dd=v-top;
      d[Y*w+X]=dd<2.5?ink(B,'grass',.85-dd*.2-q*.1,X,Y,v):ink(B,'rock',.6-q*.3-dd/dep*.4+(fbm(u*.3,v*.3,seed)-.5)*.3,X,Y,v,2.2)}}
  if(fall)pFall(B,cx+hw*.4,2.5,top,top+wd*1.6,seed)}
function hillsAndRanges(F,o){const wF=F.w/F.k;
  for(let i=0,u=-20;u<wF+60;i++,u+=46+hs(i,1)*48)pPeak(F,u,o.peakY+hs(i,2)*22,46+hs(i,3)*30,i,{m:o.far||'range',jag:5,snow:o.snow?8+hs(i,4)*8:0,bot:172});
  for(let i=0,u=0;u<wF+60;i++,u+=44+hs(i,5)*40)pPeak(F,u,o.hillY+hs(i,6)*12,46+hs(i,7)*26,i+50,{m:o.near||'hills',jag:3,round:1,bot:172})}

// ---- per world: what stands in each layer
const SCENES={
  eden(L){L.clouds(6);hillsAndRanges(L.far,{peakY:72,hillY:104,snow:1});
    const M=L.mid,wM=M.w/M.k;for(let u=10,i=0;u<wM;i++,u+=100+hs(i,1)*70){const x1=u+50+hs(i,2)*50;pCliff(M,u,x1,84+hs(i,3)*22,i,{cap:'grass',fall:hs(i,4)>.35?.3+hs(i,5)*.4:0,fallTo:136})}
    for(let i=0,u=60;u<wM-30;i++,u+=130+hs(i,61)*80)pIsle(M,u,62+hs(i,62)*22,18+hs(i,63)*12,i+40,hs(i,64)>.4);
    pForest(M,-10,wM+10,152,8,7);
    const N=L.near,wN=N.w/N.k;for(let u=30,i=0;u<wN;i++,u+=80+hs(i,1)*70){pTree(N,u,184,13+hs(i,2)*6,i);if(hs(i,3)>.3)pBush(N,u+38,176,6+hs(i,4)*3,i+40,'leaf',['#ff8ab0','#ffe36a','#ffffff'][i%3])}},
  getsemani(L){L.clouds(3);const F=L.far,wF=F.w/F.k;hillsAndRanges(F,{peakY:96,hillY:116});
    const cx=wF*.55;pPeak(F,cx,112,70,77,{m:'hills',jag:2,round:1,bot:172});pWall(F,cx-56,cx+56,114,132,'stone',3);
    for(let u=cx-56;u<cx+56;u+=14)pBox(F,u,108,u+6,132,'stone',{courses:3});pBox(F,cx-12,96,cx+12,116,'stone',{s:.7,courses:3});pBox(F,cx-14,94,cx+14,97,'rock',{s:.95});
    for(let i=0;i<34;i++){const u=cx-52+hs(i,3)*104,v=110+hs(i,4)*20,c=u32(hs(i,5)>.5?'#ffd27a':'#ffb050');dot(F,u,v,c);if(hs(i,6)>.6)dot(F,u+.5,v,c)}
    const M=L.mid,wM=M.w/M.k;for(let i=0,u=-20;u<wM+40;i++,u+=60+hs(i,1)*40)pPeak(M,u,126+hs(i,2)*10,60,i+90,{m:'hills',jag:2,round:1,bot:180});
    for(let u=10,i=0;u<wM;i++,u+=24+hs(i,3)*20)pTree(M,u,146+hs(i,4)*6,6+hs(i,5)*3,i+30,'olive');
    const N=L.near,wN=N.w/N.k;for(let u=20,i=0;u<wN;i++,u+=70+hs(i,1)*60)pTree(N,u,184,12+hs(i,2)*5,i+60,'olive')},
  tumulo(L){L.clouds(5);hillsAndRanges(L.far,{peakY:96,hillY:112});
    const M=L.mid,wM=M.w/M.k;pForest(M,-10,wM+10,150,7,21,'olive',2);for(let u=20,i=0;u<wM;i++,u+=40+hs(i,1)*40)pTree(M,u,150,7+hs(i,2)*3,i+5);
    const N=L.near,wN=N.w/N.k;for(let u=10,i=0;u<wN;i++,u+=26+hs(i,1)*26)pBush(N,u,178,5+hs(i,2)*4,i,'leaf',['#ffffff','#ffd0e0','#ffe36a'][i%3])},
  sinai(L){const S2=L.sky;pPeak(S2,290,60,150,5,{m:'redrock',jag:4,bot:216,base:210});pCloud(S2,290,50,84,18,3,CLOUDS.storm);pCloud(S2,262,60,40,10,4,CLOUDS.storm);
    MAP.smokes.push({x:290,y:44,sky:1});L.clouds(3);
    const F=L.far,wF=F.w/F.k;for(let i=0,u=-20;u<wF+60;i++,u+=40+hs(i,1)*44)pPeak(F,u,112+hs(i,2)*14,40+hs(i,3)*24,i,{m:'desert',jag:4,bot:172});
    const M=L.mid,wM=M.w/M.k;for(let u=0,i=0;u<wM;i++,u+=100+hs(i,1)*80)pCliff(M,u,u+40+hs(i,2)*40,118+hs(i,3)*18,i,{m:'redrock'});
    for(let u=40,i=0;u<wM;i++,u+=50+hs(i,4)*40){const tx=u,ty=146+hs(i,5)*6;pTent(M,tx,ty,20,8,i);MAP.midFires.push({x:tx+13,y:ty-2})}
    const N=L.near,wN=N.w/N.k;for(let u=20,i=0;u<wN;i++,u+=60+hs(i,1)*60){pPeak(N,u,166+hs(i,2)*6,16+hs(i,3)*8,i+70,{m:'redrock',jag:2,round:1,bot:200});if(hs(i,4)>.4)pAcacia(N,u+30,180,10+hs(i,5)*5,i)}},
  mar(L){L.clouds(5);const F=L.far,wF=F.w/F.k;
    for(let i=0,u=-20;u<wF+60;i++,u+=50+hs(i,1)*50)pPeak(F,u,104+hs(i,2)*12,50+hs(i,3)*30,i,{m:'desert',jag:4,bot:130});
    pBox(F,0,124,wF,180,'sea',{s:.5});for(let i=0;i<300;i++){const u=hs(i,7)*wF,v=125+hs(i,8)*30;for(let q=0;q<2+hs(i,9)*4;q+=.5)dot(F,u+q,v,ink(F,'sea',.95,(u+q)*2|0,v*2|0,v))}
    const M=L.mid,wM=M.w/M.k;for(let u=0,i=0;u<wM;i++,u+=120+hs(i,1)*80)pCliff(M,u,u+36+hs(i,2)*40,124+hs(i,3)*14,i,{m:'redrock'});pReeds(M,0,wM,156,3);
    const N=L.near,wN=N.w/N.k;for(let u=30,i=0;u<wN;i++,u+=70+hs(i,1)*60)pPalm(N,u,182,30+hs(i,2)*14,(hs(i,3)-.5)*1.4,i);pReeds(N,0,wN,180,9)},
  jerico(L){L.clouds(5);const F=L.far,wF=F.w/F.k;hillsAndRanges(F,{peakY:96,hillY:116,far:'range',near:'desert'});
    const M=L.mid,wM=M.w/M.k,cx=wM*.5;pPeak(M,cx,124,110,9,{m:'desert',jag:2,round:1,bot:190});pWall(M,cx-70,cx+70,112,136,'brick',4);
    for(let u=cx-70;u<cx+70;u+=28)pWall(M,u,u+10,100,136,'brick',3.4);for(let i=0;i<10;i++)pBox(M,cx-60+hs(i,4)*110,104+hs(i,5)*6,cx-54+hs(i,4)*110,113,'brick',{s:.75});
    for(let u=10,i=0;u<wM;i++,u+=30+hs(i,1)*40)if(Math.abs(u-cx)>74)pPalm(M,u,150,16+hs(i,2)*8,(hs(i,3)-.5),i);
    const N=L.near,wN=N.w/N.k;for(let u=20,i=0;u<wN;i++,u+=50+hs(i,1)*50){pPalm(N,u,186,32+hs(i,2)*14,(hs(i,3)-.5)*1.4,i+20);if(hs(i,4)>.5)pBush(N,u+22,178,5,i,'olive')}},
  babel(L){L.clouds(4);const F=L.far,wF=F.w/F.k;hillsAndRanges(F,{peakY:100,hillY:118,far:'range',near:'desert'});
    const M=L.mid,wM=M.w/M.k,cx=wM*.5;pZiggurat(M,cx,160,190,7,12);MAP.smokes.push({x:cx-120,y:146},{x:cx+130,y:148});
    for(const sx of[cx-120,cx+130]){pBox(M,sx-6,146,sx+6,160,'brick',{s:.4,courses:2});pBox(M,sx-3,142,sx+3,147,'brick',{s:.3})}
    for(let u=10,i=0;u<wM;i++,u+=22+hs(i,1)*20)if(Math.abs(u-cx)>100)pBox(M,u,148+hs(i,2)*6,u+10+hs(i,3)*6,170,'brick',{s:.6,courses:3});
    const N=L.near,wN=N.w/N.k;for(let u=20,i=0;u<wN;i++,u+=70+hs(i,1)*60){pPalm(N,u,186,30+hs(i,2)*12,(hs(i,3)-.5)*1.2,i+40);pBox(N,u+18,170,u+30,186,'brick',{s:.5,courses:3})}}
};
SCENES.abismo=SCENES.mar;

// foreground plants close to the camera: painted like the rest but kept in shadow, in the light of the hour
function paintFG(desert){const mk=(w,h,fn)=>{const c=mkHD(w,h),B=layerBuf(c,'#000000',0,1,0);fn(B);putBuf(B);return c},L=desert?'palm':'leaf';
  const leafy=(B,u,v,rr,seed)=>disk(B,u,v,rr,(X,Y,nx,ny,f,uu,vv)=>f<.1&&bay(X,Y)>.5?-1:ink(B,L,light(nx,ny)*.62+(vn(uu,vv,seed)-.5)*.2,X,Y,vv,2.4));
  return{vine:mk(26,72,B=>{for(let i=0;i<4;i++){const vx=5+i*5,len=30+hs(i,5)*36;for(let t=6;t<len;t+=.5){const px=vx+Math.sin(t*.15+i)*2;dot(B,px,t,ink(B,L,.15,px*2|0,t*2|0,t));if(((t*2)|0)%9===0)leafy(B,px+(i%2?1.6:-1.6),t,1.8,i)}}
      for(let j=0;j<5;j++)leafy(B,4+j*4.5,4+hs(j,3)*4,5+hs(j,4)*2,j+20)}),
    fern:mk(44,32,B=>{for(let b=0;b<9;b++){const a=Math.PI*(.12+b*.095),len=16+hs(b,6)*8;for(let t=0;t<len;t+=.5){const px=22+Math.cos(a)*t,py=31-Math.sin(a)*t+t*t*.018;
        dot(B,px,py,ink(B,L,.35-t/len*.15,px*2|0,py*2|0,py));if(t>2&&((t*2)|0)%3===0){dot(B,px+.5,py+.8,ink(B,L,.55,0,0,py));dot(B,px-.5,py+.8,ink(B,L,.45,1,1,py))}}}}),
    rock:mk(40,24,B=>{disk(B,20,22,17,(X,Y,nx,ny,f,u,v)=>v>23.5?-1:ink(B,desert?'redrock':'stone',light(nx,ny)*.6+(fbm(u*.3,v*.3,4)-.5)*.25,X,Y,v,2.4));if(!desert)for(let j=0;j<4;j++)leafy(B,8+j*7,8+hs(j,9)*3,3,j+40)}),
    frond:mk(54,44,B=>{for(let f=0;f<7;f++){const a=Math.PI*(-.05-f*.13),len=20+hs(f,8)*10;for(let t=0;t<len;t+=.5){const px=27+Math.cos(a)*t*(f%2?1:-1),py=2-Math.sin(a)*t*.6+t*t*.03;
        dot(B,px,py,ink(B,'palm',.4-t/len*.2,px*2|0,py*2|0,py));for(let q=.5;q<(1-t/len)*4+1;q+=.5)dot(B,px+(f%2?.3:-.3)*q,py+q,ink(B,'palm',.25,0,0,py))}}})}}
const SCN_CACHE=new Map();
function paintScene(lw,day){const key=MAPID+(day?':d':':n'),hit=SCN_CACHE.get(key);
  if(hit){[SKY,FAR,MID,NEAR]=hit.c;Object.assign(MAP,hit.meta);return}
  const desert=!MAP.pal.grass,mood=['getsemani','abismo'].includes(MAPID)?'night':MAPID==='tumulo'?'dawn':day?'day':'dusk';
  const sky=mood==='day'&&desert?SKIES.desert:SKIES[mood],haze=sky[sky.length-2];
  MAP.midFires=[];MAP.falls=[];MAP.smokes=[];MAP.mood=mood;
  SKY=mkHD(W+1,H);FAR=mkHD(lw(PAR[0]),H);MID=mkHD(lw(PAR[1]),H);NEAR=mkHD(lw(PAR[2]),H);
  GRADE=GRADES[mood]||null;
  const sun={...SUNS[mood],x:mood==='dusk'?90:mood==='dawn'?220:300,y:mood==='dusk'?122:mood==='dawn'?138:54};
  const L={sky:layerBuf(SKY,haze,70,240,.8),far:layerBuf(FAR,haze,60,158),mid:layerBuf(MID,haze,40,300,.8),near:layerBuf(NEAR,haze,90,420,.7)};
  pSky(L.sky,{sky,hor:150,sun,stars:mood==='night'?140:mood==='dusk'?40:0});
  L.clouds=n=>{for(let i=0;i<n;i++)pCloud(L.sky,20+i*(W/n)+hs(i,71)*30,114+hs(i,72)*8,50+hs(i,73)*34,14+hs(i,74)*8,i+3,CLOUDS[mood])};
  (SCENES[MAPID]||SCENES.eden)(L);
  [L.sky,L.far,L.mid,L.near].forEach(putBuf);
  // drifting clouds over the sky, in the same light
  MAP.clouds=[0,1,2].map(i=>{const c=mkHD(100,40),B=layerBuf(c,haze,0,1);pCloud(B,50,22,56+i*12,17+i*4,i*7+1,CLOUDS[mood]);putBuf(B);return c});
  MAP.fgSpr=paintFG(desert);
  GRADE=null;
  if(SCN_CACHE.size>=3)SCN_CACHE.delete(SCN_CACHE.keys().next().value);
  SCN_CACHE.set(key,{c:[SKY,FAR,MID,NEAR],meta:{midFires:MAP.midFires,falls:MAP.falls,smokes:MAP.smokes,clouds:MAP.clouds,fgSpr:MAP.fgSpr,mood}});
}
