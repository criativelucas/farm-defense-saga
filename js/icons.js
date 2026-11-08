// ---------- item icons: chunky 24x24 pixel art lit from the top left, with a dark outline added around the shape.
// Used by the shop, the farmer's equipment sheet and the battle item bar.
const WD=['#4a2614','#7a4626','#a8683c','#d09a60'],MT=['#3a4050','#6a7488','#a8b2c8','#e8eef8'],GD=['#7a4a0a','#c88a1a','#f7c948','#fff3b0'];
// visit every pixel of the 24x24 grid; fn returns a color or nothing
function px24(fn){for(let y=0;y<24;y++)for(let x0=0;x0<24;x0++){const c=fn(x0+.5,y+.5);if(c)r(x0,y,1,1,c)}}
function ell(cx,cy,rx,ry,cols,o={}){px24((u,v)=>{const dx=(u-cx)/rx,dy=(v-cy)/ry,d=dx*dx+dy*dy;if(d>1)return;
  const l=-dx*.6-dy*.8;return d>.72&&dx+dy>.2?cols[0]:l>.55?cols[3]:l>0?cols[2]:cols[1]})}
function badge(c='#5fe08a'){ell(19.5,19.5,4,4,['#1a5a2a',shade(c,-.2),c,shade(c,.5)]);r(19,17,1,5,'#ffffff');r(17,19,5,1,'#ffffff')}
function packet(col,draw){r(5,4,14,18,'#f4e6c4');r(17,4,2,18,'#dcc69a');r(5,4,14,5,col);r(5,8,14,1,shade(col,-.35));r(5,4,14,1,shade(col,.35));
  for(let i=5;i<19;i+=2)r(i,3,1,1,'#f4e6c4');r(5,21,14,1,'#cbb488');draw()}
const ITEMI={
  'w:enxada'(){for(let i=0;i<14;i++){r(5+i*.6|0,22-i,2,1,i%4?WD[2]:WD[1]);r(5+i*.6|0,22-i,1,1,WD[3])}r(9,4,9,3,MT[2]);r(9,4,9,1,MT[3]);r(16,7,2,3,MT[1]);r(12,7,2,2,WD[1])},
  'w:foice'(){for(let i=0;i<11;i++){const x0=3+i*.75|0,y0=22-i;r(x0,y0,2,1,WD[2]);r(x0,y0,1,1,WD[3]);if(i===2||i===3)r(x0,y0,2,1,'#c0392b')}
    r(10,11,3,2,MT[1]);
    px24((u,v)=>{const dx=u-13,dy=v-11,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);if(a>.3&&a<2.7)return;const ro=a>-.4&&a<.3?8.6-(a+.4)*5:8.6;if(d>ro||d<5.4)return;
      return d<6.4?MT[3]:d>7.6?MT[1]:MT[2]})},
  'w:forcado'(){for(let y=10;y<24;y++){r(11,y,2,1,WD[2]);r(11,y,1,1,WD[3])}r(10,9,4,2,MT[1]);r(5,8,14,2,MT[2]);r(5,8,14,1,MT[3]);
    for(const tx of[5,11,17]){r(tx,2,2,6,MT[2]);r(tx,2,1,6,MT[3]);r(tx+1,2,1,6,MT[1]);r(tx,1,1,1,MT[3])}},
  'w:arado'(){for(let i=0;i<9;i++){r(3+i*.5|0,2+i,2,1,WD[2]);r(3+i*.5|0,2+i,1,1,WD[3])}for(let i=0;i<8;i++)r(7+i*.4|0,4+i,2,1,WD[1]);
    for(let i=0;i<15;i++){r(6+i,11+(i/7|0),1,2,WD[2]);r(6+i,11+(i/7|0),1,1,WD[3])}
    px24((u,v)=>{if(v<14||v>20||u<13||u>22)return;if(u-13<(v-14)*1.4)return;return v<15.5?MT[3]:u>20?MT[1]:MT[2]});
    ell(19,8,3.2,3.2,[WD[0],WD[1],WD[2],WD[3]]);r(18,7,2,2,MT[1])},
  'i:cerca'(){for(const p of[3,17]){r(p,5,4,17,WD[2]);r(p,5,1,17,WD[3]);r(p+3,5,1,17,WD[1]);r(p+1,3,2,2,WD[2]);r(p+1,3,1,1,WD[3])}
    for(const y0 of[8,15]){r(1,y0,22,3,WD[2]);r(1,y0,22,1,WD[3]);r(1,y0+2,22,1,WD[1]);r(4,y0+1,1,1,MT[1]);r(19,y0+1,1,1,MT[1])}
    r(0,22,24,2,'#3a8a3a');for(const g of[2,8,13,21])r(g,20,1,2,'#5fae4a')},
  'i:espantalho'(){r(11,12,2,12,WD[1]);r(2,13,20,2,WD[2]);r(2,13,20,1,WD[3]);
    r(7,12,10,8,'#c0392b');r(7,12,10,1,'#e05a4a');r(9,12,1,8,'#8a2018');r(14,12,1,8,'#8a2018');r(7,16,10,1,'#8a2018');r(11,17,3,2,'#e8c050');
    for(const hx of[1,21]){r(hx,12,2,4,'#e8c050');r(hx,12,1,2,'#fff0a0')}
    ell(12,8,4.4,4,['#9a7a48','#c8a068','#dcbc84','#f0d8a8']);r(10,7,1,1,'#2a1408');r(14,7,1,1,'#2a1408');r(10,10,4,1,'#6a4a2a');r(9,9,1,1,'#6a4a2a');r(14,9,1,1,'#6a4a2a');
    r(5,4,14,2,'#c89a40');r(5,4,14,1,'#e8c060');r(8,0,8,4,'#b08030');r(8,0,8,1,'#d8a848');r(8,3,8,1,'#c0392b');r(7,6,1,2,'#e8c050');r(16,6,1,2,'#e8c050')},
  'i:lama'(){ell(12,17,10.5,4.6,['#3a2210','#5a3a20','#7a5030','#a07850']);r(6,15,5,1,'#c0a07a');r(15,18,3,1,'#a08060');
    ell(16,13.5,2,2,['#3a2210','#5a3a20','#7a5030','#c0a07a']);ell(8,12,1.4,1.4,['#3a2210','#5a3a20','#7a5030','#c0a07a']);r(3,10,1,2,'#6a4428');r(20,9,1,1,'#6a4428');r(19,7,1,1,'#7a5030')},
  hearts(){px24((u,v)=>{const X=(u-12)/9.5,Y=-(v-11.5)/9;const q=X*X+Y*Y-1;if(q*q*q-X*X*Y*Y*Y>0)return;const l=-X*.7+Y*.7;
    return X+(-Y)>.85&&q>-.35?'#9a1030':l>.75?'#ffc0c8':l>.2?'#ff5a6a':'#e02848'});r(6,6,2,2,'#ffffff');badge()},
  bag(){ell(12,15,8.4,7,['#5a3418','#8a5a30','#b07a44','#d8a468']);r(9,6,6,4,'#8a5a30');r(9,6,2,4,'#b07a44');r(8,9,8,1,'#e8c890');r(11,10,2,2,'#e8c890');
    r(10,3,3,3,GD[2]);r(10,3,1,1,GD[3]);r(13,4,2,2,GD[1]);r(7,14,3,3,'#7a4a24');badge('#ffd23a')},
  mana(){ell(12,15,7.5,7,['#4a1a7a','#7b2fbf','#a860f0','#e2b0ff']);r(6,11,12,1,'#c890ff');r(8,13,2,4,'#ffffff');
    r(10,4,4,5,'#d8e8f0');r(10,4,1,5,'#ffffff');r(9,2,6,2,WD[2]);r(9,2,6,1,WD[3]);r(4,4,1,1,'#ffe36a');r(19,6,1,1,'#ffe36a');r(18,3,1,1,'#ffffff')},
  vaso(){r(4,9,16,3,'#e07a4a');r(4,9,16,1,'#f8a070');r(5,10,14,1,'#4a2a18');
    for(let y=12;y<23;y++){const k=(y-12)*.25|0;r(5+k,y,14-2*k,1,'#c0603a');r(5+k,y,2,1,'#e07a4a');r(17-k,y,2,1,'#8a3a20')}r(7,15,10,1,'#8a3a20');
    r(11,4,2,6,'#3a8a3a');r(8,4,3,2,'#5fae4a');r(13,3,3,2,'#7fd060')},
  adubo(){r(5,7,14,16,'#c8a070');r(5,7,2,16,'#e0c090');r(17,7,2,16,'#9a7a48');r(6,4,12,4,'#b08858');r(7,6,10,1,'#6a4a2a');r(11,2,2,3,'#b08858');
    ell(12,15,3.5,3,['#1e6a2e','#3a9a3a','#5fd060','#a0f080']);r(12,12,1,6,'#1e6a2e');r(4,22,16,2,'#5a3a20');r(6,21,3,1,'#7a5030')},
  spray(){r(7,10,10,13,'#3aa858');r(7,10,2,13,'#6ad080');r(15,10,2,13,'#1e7a3a');r(8,14,8,5,'#e8f8e0');r(11,15,2,3,'#3aa858');r(9,6,6,4,'#e0e0ea');r(9,6,2,4,'#ffffff');
    r(8,3,9,3,'#5a6070');r(8,3,9,1,'#8a90a0');r(17,4,2,1,'#5a6070');r(12,6,3,3,'#3a4050');for(const[a,b]of[[20,3],[21,5],[20,1],[22,3]])r(a,b,1,1,'#bfe8ff')},
  mel(){r(5,9,14,13,'#e8a020');r(5,9,3,13,'#ffd060');r(16,9,3,13,'#b06810');r(8,13,8,5,'#f8f0d8');r(10,14,4,3,'#e8a020');r(11,15,2,1,'#2a1a08');
    r(4,6,16,4,'#f0e8d8');for(let i=5;i<19;i+=3)r(i,7,2,2,'#e04a4a');r(4,9,16,1,'#c8a878');r(15,1,2,8,WD[2]);r(15,1,1,8,WD[3]);r(14,0,4,2,WD[1]);r(16,10,1,2,'#ffd060')},
  fertil(){ell(12,15,7.5,7,['#1a5a2a','#2a8a3a','#5fd060','#c0ffb0']);r(8,13,2,4,'#ffffff');r(10,4,4,5,'#d8e8f0');r(10,4,1,5,'#ffffff');r(9,2,6,2,WD[2]);
    r(13,14,3,2,'#a0f080');r(14,12,1,6,'#1a5a2a');r(4,5,1,1,'#ffe36a');r(19,4,1,1,'#ffffff');r(20,8,1,1,'#ffe36a')},
  arvore(){for(const[a,b]of[[3,8],[20,6],[4,20],[21,19],[12,1]]){r(a,b,1,1,'#fff6c0');r(a-1,b,3,1,'#fff6c033')}
    ell(12,16,6,6.5,GD);r(9,13,2,3,'#ffffff');r(11,5,2,6,'#3a8a3a');r(7,5,4,3,'#5fd060');r(13,4,4,3,'#7fe070');r(7,5,4,1,'#a0f090')},
  'g:regar'(){r(4,10,14,11,'#6a8aa8');r(4,10,14,2,'#a8c8e0');r(4,10,2,11,'#8aaac8');r(16,12,2,9,'#4a6a88');r(17,13,5,2,'#6a8aa8');r(21,11,2,3,'#8aaac8');
    r(7,5,9,2,'#4a6a88');r(6,5,1,6,'#4a6a88');r(16,5,1,6,'#4a6a88');for(const[a,b]of[[23,15],[22,18],[23,20],[21,21]])r(a,b,1,1,'#7fc8ff')},
  'g:adubo'(){ITEMI.adubo()},'g:spray'(){ITEMI.spray()},'g:mel'(){ITEMI.mel()},
  'g:harpa'(){r(5,3,3,19,GD[1]);r(5,3,1,19,GD[3]);r(5,3,15,3,GD[1]);r(5,3,15,1,GD[3]);px24((u,v)=>{const x0=19-(v-4)*.35;return u>x0&&u<x0+2.5&&v>4&&v<20?GD[2]:null});r(5,20,11,3,GD[0]);
    for(let i=0;i<5;i++)r(9+i*2,6,1,14-i*2.2,'#fff6e0')},
  'g:luva'(){r(6,10,12,11,'#e05a4a');r(6,10,3,11,'#f08070');r(15,10,3,11,'#b03a2a');r(3,12,4,6,'#e05a4a');r(3,12,1,6,'#f08070');for(let i=0;i<4;i++){r(7+i*3,3,2,8,'#e05a4a');r(7+i*3,3,1,8,'#f08070')}r(6,19,12,3,'#f0c040');r(6,19,12,1,'#fff080')},
  'g:vender'(){ITEMI.bag();r(3,3,8,5,'#ffe04a');r(3,3,8,1,'#fff6b0');r(5,4,4,3,'#2a1408');r(6,5,2,1,'#ffe04a')},
  'seed:*'(key){const k=key.slice(5),p=GPLANTS[k]||{col:'#5fae4a'},c=p.col||'#5fae4a';
    if(p.tree){r(4,13,16,3,'#e07a4a');r(4,13,16,1,'#f8a070');for(let y=16;y<23;y++){const q=(y-16)*.3|0;r(5+q,y,14-2*q,1,'#c0603a');r(5+q,y,2,1,'#e07a4a');r(17-q,y,2,1,'#8a3a20')}
      drawTower(p.tree,12,14,1,null,.48);return}
    packet(c,()=>{
      if(k==='trigo'){r(12,10,1,11,'#9a7a30');for(let y=11;y<18;y+=2){r(10,y,2,2,'#e8c860');r(13,y,2,2,'#d8b040');r(10,y,1,1,'#fff0a0')}}
      else if(k==='uva'){for(const[a,b]of[[9,11],[12,11],[15,11],[10.5,14],[13.5,14],[12,17]])ell(a,b,1.8,1.8,['#3a1a6a','#6a2aa8','#9b4be0','#d8a8ff']);r(12,9,2,2,'#3a8a3a')}
      else if(k==='roma'){ell(12,15,4.5,4.5,['#7a1020','#c01a38','#e0284a','#ff9aa8']);r(11,9,3,2,'#c01a38');r(10,9,1,1,'#7a1020');r(14,9,1,1,'#7a1020')}
      else{r(8,12,9,1,'#5a6a3a');for(const[a,b]of[[9,14],[13,13],[15,16]])ell(a,b,1.8,2.2,['#2a3a1a','#4a5a2a','#6a7a3a','#c8d8a0']);r(10,10,3,2,'#8aaa6a');r(15,11,3,2,'#8aaa6a')}})}
};
function itemIconTo(cvs,key,draw){const N=26,src=mkCanvas(N,N),g=src.getContext('2d');g.__k=1;g.imageSmoothingEnabled=false;const keep=C;C=g;g.translate(1,1);
  try{draw?draw():(ITEMI[key]||(key.startsWith('seed:')&&ITEMI['seed:*'])||(()=>{}))(key)}finally{C=keep}
  const sil=mkCanvas(N,N),s=sil.getContext('2d');s.drawImage(src,0,0);s.globalCompositeOperation='source-in';s.fillStyle='#1a0c10';s.fillRect(0,0,N,N);
  const out=mkCanvas(N,N),o=out.getContext('2d');for(const[a,b]of[[-1,0],[1,0],[0,-1],[0,1]])o.drawImage(sil,a,b);o.drawImage(src,0,0);
  cvs.width=cvs.height=N*4;const c=cvs.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(out,0,0,N*4,N*4)}
// the old entry points now paint the chunky icons
function toolIconTo(cvs,k){itemIconTo(cvs,'w:'+k)}
function barrierIconTo(cvs,k){itemIconTo(cvs,'i:'+k)}
function shopIconTo(cvs,k){itemIconTo(cvs,k)}
function treeIconTo(cvs,k){itemIconTo(cvs,'',()=>drawTower(k,12,23,1,null,.82))}
