// ---------- cards drawn as pixel art: each category has its own shape, frame and layout
const CARD_W=120,CARD_H=168,MINI_W=72,MINI_H=100,CK=3;// cards are drawn at 3x so text and art stay sharp
const CSTYLE={
  semente:{shape:'chamfer',rim:['#16201e','#eef6f2','#a8c4ba','#5f7e74','#22302c'],bg:['#5a3a2e','#2c1a14'],gem:['#ffe08a','#f08a2a','#8a3a10'],plate:'ribbon'},
  hibrida:{shape:'chamfer',rim:['#16201e','#e8fff0','#8ae0a8','#9a6ad8','#22302c'],bg:['#4a3450','#22142a'],gem:['#ffe08a','#f08a2a','#8a3a10'],plate:'ribbon'},
  bencao:{shape:'shield',rim:['#2a1604','#fff4b0','#f0b838','#a86a10','#3a2006'],bg:['#40306a','#1c1234'],gem:['#fffbe0','#f7c948','#8a5a10'],plate:'gold'},
  parabola:{shape:'torn',rim:['#6a5236','#ffffff','#f8f0dc','#e0d0b0','#8a7050'],bg:['#f0e2c0','#d4bc8c'],gem:['#d8f0ff','#4a9ad8','#1a4a8a'],plate:'dark',ink:'#3a2416'},
  propria:{shape:'hex',rim:['#1e1030','#ffffff','#e0d0f8','#9a80c8','#2a1840'],bg:['#462a66','#22123a'],gem:['#f0d8ff','#a050e0','#4a1a7a'],plate:'gold',lattice:1},
  joio:{shape:'octa',rim:['#121206','#a0a048','#6a6a2a','#3e3e18','#1a1a0a'],bg:['#30301a','#18180a'],gem:['#e8e8a0','#8a8a3a','#3a3a14'],plate:'dark'}
};
// left/right edge of the card shape on row y, shrunk by d pixels
function cardSpan(shape,y,W,H,d){
  const yy=y-d,h=H-2*d,w=W-2*d;if(yy<0||yy>=h)return null;let l=0,r=w;
  const cut=(c,a)=>Math.max(0,c-a);
  // small stepped pixel corners; each category differs only a little at the corners
  const step=(n,a)=>a>=n?0:Math.ceil((n-a)/2)*2;
  if(shape==='chamfer'){const c=step(4,Math.min(yy,h-1-yy));l=c;r=w-c}
  if(shape==='octa'){const c=step(6,Math.min(yy,h-1-yy));l=c;r=w-c}
  if(shape==='hex'){const c=yy<8?step(8,yy):step(4,h-1-yy);l=c;r=w-c}
  if(shape==='shield'){const c=Math.max(step(4,yy),step(10,h-1-yy));l=c;r=w-c}
  if(shape==='torn'){l=(hs(yy>>2,7)*3)|0;r=w-((hs(yy>>2,9)*3)|0)}
  return[d+l,d+r];
}
function fillShape(g,shape,W,H,d,style){g.fillStyle=style;for(let y=0;y<H;y++){const s=cardSpan(shape,y,W,H,d);if(s)g.fillRect(s[0]|0,y,(s[1]-s[0])|0,1)}}
function wrapLines(g,text,maxW,maxLines){const words=text.split(' '),out=[];let line='';
  for(const w of words){const t=line?line+' '+w:w;if(g.measureText(t).width>maxW&&line){out.push(line);line=w;if(out.length===maxLines)break}else line=t}
  if(out.length<maxLines&&line)out.push(line);if(out.length===maxLines&&words.join(' ').length>out.join(' ').length)out[maxLines-1]=out[maxLines-1].replace(/.{2}$/,'…');return out}
function pxText(g,t,x,y,font,col,shadow,align='center'){g.font=font;g.textAlign=align;g.textBaseline='alphabetic';if(shadow){g.fillStyle=shadow;g.fillText(t,x+1,y+1)}g.fillStyle=col;g.fillText(t,x,y)}
function gemDraw(g,cx,cy,rad,cols,txt){C=g;disc(cx,cy,rad+1,'#120808');disc(cx,cy,rad,cols[2]);disc(cx,cy-1,rad-1,cols[1]);disc(cx-2,cy-3,(rad/3)|0,cols[0]);C=x;
  pxText(g,txt,cx,cy+5,'700 14px "Pixelify Sans", monospace','#ffffff','#000000')}
const SMALL_ICON={dmg:[[0,6],[1,5],[2,4],[3,3],[4,2],[5,1],[6,0],[1,6],[0,5]],rng:[[1,0],[2,0],[3,0],[0,1],[4,1],[0,2],[2,2],[4,2],[0,3],[4,3],[1,4],[2,4],[3,4]],cd:[[1,0],[2,0],[3,0],[0,1],[4,1],[0,2],[2,2],[3,2],[4,2],[0,3],[4,3],[1,4],[2,4],[3,4],[2,1]]};
function iconPx(g,k,x0,y0,c){g.fillStyle=c;SMALL_ICON[k].forEach(([a,b])=>g.fillRect(x0+a,y0+b,1,1))}
function cardCanvas(c,mini=false){
  const W=mini?MINI_W:CARD_W,H=mini?MINI_H:CARD_H,cv2=mkHD(W,H,CK),g=cv2.getContext('2d');
  const I=info(c),cat=catOf(c),st=CSTYLE[cat],rare=!!c.rare;
  const rim=rare?['#2a1604','#fffbe0','#f7c948','#b07a1a','#3a2006']:st.rim;
  // frame: dark outline, light bevel, mid, dark inner line, then the inner field
  for(let k=0;k<4;k++)fillShape(g,st.shape,W,H,k*(mini?1:2),rim[k]);
  fillShape(g,st.shape,W,H,mini?4:8,rim[4]);
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,st.bg[0]);gr.addColorStop(1,st.bg[1]);fillShape(g,st.shape,W,H,mini?5:9,gr);
  if(st.lattice){g.save();g.globalAlpha=.12;g.fillStyle='#ffffff';for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++)if(((xx+y)%12===0||(xx-y+999)%12===0)){const s=cardSpan(st.shape,y,W,H,mini?5:9);if(s&&xx>s[0]&&xx<s[1])g.fillRect(xx,y,1,1)}g.restore()}
  if(st.shape==='torn'){g.save();g.globalAlpha=.25;for(let i=0;i<60;i++){g.fillStyle=hs(i,c.uid|0)>.5?'#b89a68':'#fff6e0';g.fillRect(10+hs(i,3)*(W-20),10+hs(i,4)*(H-20),2,1)}g.restore()}
  // corner rivets on the steel frame
  if(st.shape==='chamfer'&&!mini){[[6,12],[W-8,12],[6,H-14],[W-8,H-14]].forEach(([a,b])=>{g.fillStyle='#22302c';g.fillRect(a,b,3,3);g.fillStyle='#eef6f2';g.fillRect(a,b,1,1)})}
  // art window
  const art=mkHD(64,44,CK);cardArtTo(art,c);
  const ax=mini?4:12,aw=mini?64:96,ah=mini?44:66;
  const ay=mini?(cat==='semente'||cat==='hibrida'?14:16):(cat==='semente'||cat==='hibrida'?20:30);
  g.fillStyle='#0a0606';g.fillRect(ax-2,ay-2,aw+4,ah+4);g.fillStyle=st.shape==='torn'?'#8a7050':rim[2];g.fillRect(ax-1,ay-1,aw+2,ah+2);g.imageSmoothingEnabled=true;g.drawImage(art,ax,ay,aw,ah);g.imageSmoothingEnabled=false;
  g.fillStyle='#ffffff22';g.fillRect(ax,ay,aw,1);
  // name plate
  const name=I.name.replace(' ★','');
  if(st.plate==='ribbon'){const py=ay+ah+(mini?2:4),ph=mini?13:17;
    g.fillStyle='#4a0c10';g.fillRect(2,py+3,8,ph-2);g.fillRect(W-10,py+3,8,ph-2);g.fillStyle='#801c24';g.fillRect(3,py+4,6,ph-4);g.fillRect(W-9,py+4,6,ph-4);
    g.fillStyle='#2a0608';g.fillRect(6,py-1,W-12,ph+2);g.fillStyle='#c03a3a';g.fillRect(7,py,W-14,ph);g.fillStyle='#e86060';g.fillRect(7,py,W-14,1);g.fillStyle='#8a2028';g.fillRect(7,py+ph-2,W-14,2);
    pxText(g,name,W/2,py+(mini?10:13),(mini?'700 8px':'700 11px')+' "Pixelify Sans", monospace','#ffffff','#3a0608')}
  else{const py=mini?3:(st.shape==='hex'?9:st.shape==='octa'?8:9),ph=mini?11:16,px0=mini?16:28,pw=W-px0-(mini?4:10);
    const plateCol=st.plate==='gold'?['#5a3a06','#f7c948','#c9921a']:['#120a08','#4a3a32','#2a1e18'];
    g.fillStyle=plateCol[0];g.fillRect(px0-1,py-1,pw+2,ph+2);g.fillStyle=plateCol[2];g.fillRect(px0,py,pw,ph);g.fillStyle=plateCol[1];g.fillRect(px0,py,pw,1);
    pxText(g,name,px0+pw/2,py+(mini?8:12),(mini?'700 7px':'700 10px')+' "Pixelify Sans", monospace',st.plate==='gold'?'#2a1408':'#fbe9d0',st.plate==='gold'?null:'#000')}
  if(mini){
    // short rule text in the lower field, so a card in hand says what it does
    const sy=(cat==='semente'||cat==='hibrida')?ay+ah+19:ay+ah+8;g.font='600 7px "Pixelify Sans", monospace';
    wrapLines(g,I.short,W-10,Math.max(1,Math.floor((H-6-sy)/8))).forEach((ln,i)=>pxText(g,ln,W/2,sy+i*8,'600 7px "Pixelify Sans", monospace',st.ink||'#fbe9d0',st.ink?null:'#000000aa'));
    gemDraw(g,cat==='semente'||cat==='hibrida'?W/2:9,cat==='semente'||cat==='hibrida'?8:9,6,st.gem,'');
    pxText(g,String(I.cost),cat==='semente'||cat==='hibrida'?W/2:9,(cat==='semente'||cat==='hibrida'?8:9)+4,'700 10px "Pixelify Sans", monospace','#ffffff','#000');
    if(rare){C=g;for(let i=0;i<5;i++)r(hs(i,7)*W,hs(i,8)*H,1,1,'#fff6c0');C=x}
    if(c.plus){g.fillStyle='#1a4a8a';g.fillRect(W-12,4,9,9);pxText(g,'+',W-7.5,12,'700 10px "Pixelify Sans", monospace','#bfe8ff')}
    return cv2}
  if(CARDS[c.k]&&cardLv(c.k))pxText(g,'Nv '+(cardLv(c.k)+1),W-18,H-6,'700 9px "Pixelify Sans", monospace','#7fc8ff','#000');
  // cost gem
  if(cat==='semente'||cat==='hibrida')gemDraw(g,W/2,10,10,st.gem,String(I.cost));else gemDraw(g,15,16,10,st.gem,String(I.cost));
  // fruit suits under the art
  I.fruits.forEach((f,i)=>{const e=mkHD(12,12,CK);embTo(e,f);g.fillStyle='#000000aa';g.fillRect(ax+2+i*16,ay+ah-16,14,14);g.drawImage(e,ax+3+i*16,ay+ah-15,12,12)});
  if(c.plus){g.fillStyle='#0a1a30';g.fillRect(ax+aw-16,ay+2,14,14);g.fillStyle='#4a9ad8';g.fillRect(ax+aw-15,ay+3,12,12);pxText(g,'+',ax+aw-9,ay+13,'700 12px "Pixelify Sans", monospace','#ffffff')}
  // type line, rules text, stats, verse
  const ink=st.ink||'#fbe9d0',dim=st.ink?'#6a4a30':'#c9a99a';
  let ty=(cat==='semente'||cat==='hibrida')?ay+ah+31:ay+ah+12;
  const own=CARDS[c.k]&&CARDS[c.k].own;
  pxText(g,((own?'Carta de '+CHARS[own].name:CAT_LABEL[cat])+(I.fruit?' · '+I.fruit:'')).toUpperCase(),W/2,ty,'7px "Pixelify Sans", monospace',dim);
  g.font='9px "Pixelify Sans", monospace';const lines=wrapLines(g,I.short,W-22,(cat==='semente'||cat==='hibrida')?2:3);
  lines.forEach((ln,i)=>pxText(g,ln,W/2,ty+11+i*10,'9px "Pixelify Sans", monospace',ink,st.ink?null:'#00000088'));
  const s2=I.kinds&&STATS[I.key];
  const by=H-15;
  if(s2&&cat!=='bencao'){const parts=[['dmg',s2.dmg],['rng',String(s2.rng)],['cd',s2.cd]];let xx=14;
    parts.forEach(([k,v])=>{iconPx(g,k,xx,by-6,st.ink?'#8a3a10':'#ffd070');pxText(g,v,xx+8,by,'8px "Pixelify Sans", monospace',ink,null,'left');g.font='8px "Pixelify Sans", monospace';xx+=12+g.measureText(v).width})}
  else if(I.ref)pxText(g,I.ref,W/2,by,'italic 7px "Pixelify Sans", monospace',st.ink?'#7a4a20':'#d8b070');
  if(st.shape==='shield'){C=g;disc(W/2,H-4,3,'#3a2006');disc(W/2,H-4,2,'#e0284a');r(W/2-1,H-5,1,1,'#ffb0c8');C=x}
  if(st.shape==='torn'){g.globalCompositeOperation='destination-out';for(let xx=0;xx<W;xx++){const tt=(hs(xx>>2,11)*4)|0,bb=(hs(xx>>2,13)*4)|0;g.fillRect(xx,0,1,tt);g.fillRect(xx,H-bb,1,bb)}g.globalCompositeOperation='source-over'}
  if(rare){C=g;for(let i=0;i<10;i++){const sx=hs(i,c.uid|0)*W,sy=hs(i,5)*H;r(sx,sy,1,1,'#fff6c0');r(sx-1,sy,3,1,'#f7c94888');r(sx,sy-1,1,3,'#f7c94888')}C=x;pxText(g,'★',W-16,ty-1,'10px "Pixelify Sans", monospace','#f7c948','#000')}
  return cv2;
}

// ---------- card markup for menus and the hand
function cardHTML(c,cls=''){const I=info(c),cat=catOf(c);
  return `<button type="button" class="card2 c-${cat}${c.rare?' rare':''}${c.plus?' plus':''} ${cls}" data-uid="${c.uid}" title="${c.locked?'Carta por descobrir':(I.name+': '+I.desc+(I.ref?' ('+I.ref+')':'')).replace(/"/g,'&quot;')}"><canvas width="${CARD_W*CK}" height="${CARD_H*CK}" data-card="${c.uid}"></canvas></button>`}
function paintCards(root,cards){root.querySelectorAll('canvas[data-card]').forEach(cv2=>{const card=cards.find(k=>String(k.uid)===cv2.dataset.card);if(card){const g=cv2.getContext('2d');g.clearRect(0,0,cv2.width,cv2.height);g.drawImage(card.locked?cardBack():cardCanvas(card),0,0)}})}
// the back of a card nobody has found yet
function cardBack(mini){const W=mini?MINI_W:CARD_W,H=mini?MINI_H:CARD_H,c=mkHD(W,H,CK),g=c.getContext('2d');
  fillShape(g,'chamfer',W,H,0,'#120a08');fillShape(g,'chamfer',W,H,2,'#8a5a30');fillShape(g,'chamfer',W,H,4,'#3a2216');fillShape(g,'chamfer',W,H,7,'#24140c');
  g.fillStyle='#3a2418';for(let y=10;y<H-10;y+=6)for(let xx=10+(y/6%2)*3;xx<W-10;xx+=6)g.fillRect(xx,y,2,2);
  pxText(g,'?',W/2,H/2+16,'700 46px "Pixelify Sans", monospace','#c9a24a','#000');pxText(g,'por descobrir',W/2,H-16,'9px "Pixelify Sans", monospace','#c9a99a');return c}
function renderHand(){
  const el=$('cards');el.innerHTML='';const n=S.hand.length,conf=S.babelOn>0;
  for(let j=0;j<n;j++){
    const i=conf&&S.perm[j]!=null?S.perm[j]:j,c=S.hand[i],b=document.createElement('button');b.type='button';
    b.style.setProperty('--rot',((j-(n-1)/2)*5)+'deg');b.style.setProperty('--lift',(Math.abs(j-(n-1)/2)*4)+'px');
    if(!c){b.className='hc2 empty';b.disabled=true;el.append(b);continue}
    const I=info(c);b.className='hc2 c-'+catOf(c)+(S.sel===i?' sel':'')+(conf?' garbled':'');
    b.innerHTML=`<canvas width="${MINI_W*CK}" height="${MINI_H*CK}"></canvas><span class="key">${j+1}</span>`;b.title=conf?'':I.name+': '+I.desc;
    const g=b.querySelector('canvas').getContext('2d');
    if(conf){g.scale(CK,CK);g.fillStyle='#3a1e4a';g.fillRect(0,0,MINI_W,MINI_H);pxText(g,garble('????'),MINI_W/2,MINI_H/2,'16px serif','#e0c0ff')}else g.drawImage(cardCanvas(c,true),0,0);
    b.addEventListener('pointerdown',e=>startDrag(e,i,b));
    b.addEventListener('click',e=>{e.currentTarget.blur();if(e.detail===0)onCardClick(i)});
    if(i===S.newIdx)b.classList.add('enter');el.append(b)}
  $('pilecount').textContent=S.draw.length;renderItems();
  const pv=$('nextc');pv.innerHTML='';const nx=S.draw[0];if(nx&&!conf){const m=cardCanvas(nx,true);pv.append(m);pv.title='Próxima: '+info(nx).name}
}
