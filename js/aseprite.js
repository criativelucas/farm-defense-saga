// ---------- sprites drawn in Aseprite
// Export a sheet from Aseprite (File > Export Sprite Sheet: PNG + JSON, with Tags) into assets/sprites/ and add its name
// to assets/sprites/sprites.json. A sheet named after an enemy (odio, golias...), a farmer (lavrador, davi...) or a tree
// (tree-videira...) replaces the code drawing for it; anything without a sheet keeps the code drawing.
// One sprite pixel is one world unit, the same chunky grid as the rest of the game. See assets/sprites/LEIA-ME.md.
const ASE={},ASE_DIR='assets/sprites/';
async function loadAseprite(){let list;
  try{const r=await fetch(ASE_DIR+'sprites.json',{cache:'no-cache'});if(!r.ok)return;list=await r.json()}catch(e){return}
  await Promise.all((Array.isArray(list)?list:[]).map(async n=>{try{ASE[n]=await aseParse(await (await fetch(ASE_DIR+n+'.json',{cache:'no-cache'})).json(),ASE_DIR)}catch(e){console.warn('sprite do Aseprite não carregou:',n,e)}}));
  if(typeof CARD_CACHE!=='undefined')CARD_CACHE.clear()}
// Aseprite's JSON, in either "Hash" or "Array" form; trimmed frames go back to their place on the full canvas
function aseParse(j,dir){
  const fr=Array.isArray(j.frames)?j.frames:Object.values(j.frames),meta=j.meta||{};
  const frames=fr.map(f=>({x:f.frame.x,y:f.frame.y,w:f.frame.w,h:f.frame.h,ox:f.spriteSourceSize?f.spriteSourceSize.x:0,oy:f.spriteSourceSize?f.spriteSourceSize.y:0,
    sw:f.sourceSize?f.sourceSize.w:f.frame.w,sh:f.sourceSize?f.sourceSize.h:f.frame.h,d:Math.max(16,f.duration||100)}));
  const tags={};for(const t of meta.frameTags||[]){let seq=[];for(let i=t.from;i<=t.to;i++)seq.push(i);if(t.direction==='reverse')seq.reverse();if(t.direction==='pingpong')seq=seq.concat(seq.slice(1,-1).reverse());tags[t.name.toLowerCase()]=seq}
  // the feet: a slice named "pivot" (its pivot point, or the bottom middle of the slice); otherwise the bottom middle of the canvas
  const sl=(meta.slices||[]).find(s=>s.name.toLowerCase()==='pivot'),k0=sl&&sl.keys&&sl.keys[0];
  const px=k0?(k0.pivot?k0.bounds.x+k0.pivot.x:k0.bounds.x+k0.bounds.w/2):frames[0].sw/2,py=k0?(k0.pivot?k0.bounds.y+k0.pivot.y:k0.bounds.y+k0.bounds.h):frames[0].sh;
  return new Promise((res,rej)=>{const img=new Image();img.onerror=()=>rej(new Error('imagem não encontrada: '+img.src));
    img.onload=()=>res({frames,tags,all:frames.map((_,i)=>i),px,py,tint:new Map(),
      cut:frames.map(f=>{const c=mkCanvas(f.sw,f.sh);c.getContext('2d').drawImage(img,f.x,f.y,f.w,f.h,f.ox,f.oy,f.w,f.h);return c})});
    img.src=dir+String(meta.image||'').split(/[\\/]/).pop()})}
// the frame shown at time t (seconds) inside a tag, following each frame's own duration
function aseFrame(s,tag,t){const q=s.tags[tag]||s.all;let tot=0;for(const i of q)tot+=s.frames[i].d;let ms=((t*1000)%tot+tot)%tot;for(const i of q){ms-=s.frames[i].d;if(ms<0)return i}return q[0]}
// draw sheet `name` with its feet at (x0,y0), using the first of `tags` it has; outline passes (OV set) draw a solid silhouette
function aseDraw(name,tags,t,x0,y0,flip,sc=1){const s=ASE[name];if(!s)return false;const tag=tags.find(n=>n&&s.tags[n]),i=aseFrame(s,tag,t);let c=s.cut[i];
  if(OV){const key=i+OV;let tc=s.tint.get(key);if(!tc){tc=mkCanvas(c.width,c.height);const g=tc.getContext('2d');g.drawImage(c,0,0);g.globalCompositeOperation='source-in';g.fillStyle=OV;g.fillRect(0,0,c.width,c.height);s.tint.set(key,tc)}c=tc}
  const g=C;g.save();g.translate(Math.round(x0),Math.round(y0));if(flip)g.scale(-1,1);if(sc!==1)g.scale(sc,sc);g.imageSmoothingEnabled=false;g.drawImage(c,-s.px,-s.py);g.restore();return true}
// hook into the three drawings; each falls back to the code drawing when there is no sheet
{const base=enemyBody;enemyBody=e=>{if(!aseDraw(e.k,[e.flash>0&&'hurt',e.frz>0&&'frozen','walk','idle'],e.t||0,e.x,e.y,false))base(e)}}
{const base=gardenerBody;gardenerBody=p=>{const n=(RUN&&RUN.char)||'lavrador';
  if(!aseDraw(n,[p.slam&&'slam',!p.on&&'jump',p.swing>0&&'attack',Math.abs(p.vx)>20&&'walk','idle'],S?S.t:0,p.x,p.y,p.face<0))base(p)}}
{const base=drawTower;drawTower=(k,X,Y,t,tr,sz=1)=>{if(!aseDraw('tree-'+k,['idle'],t||0,X,Y,false,sz))base(k,X,Y,t,tr,sz)}}
loadAseprite();
