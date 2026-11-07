// ---------- menu skin: pixel-art frames drawn once and handed to CSS as border-images.
// Parchment panels in a carved wooden frame, dark slots with an orange rim, a caramel title ribbon like the logo, pill buttons.
(function(){
  const keep=C,out={};
  const make=(n,w,h,draw)=>{const c=mkCanvas(w,h);C=c.getContext('2d');draw(w,h,C);out[n]=`url(${c.toDataURL()})`};
  const rings=(w,h,cols)=>cols.forEach((c,i)=>{if(!c)return;r(i,i,w-i*2,1,c);r(i,h-1-i,w-i*2,1,c);r(i,i,1,h-i*2,c);r(w-1-i,i,1,h-i*2,c)});
  const nip=(w,h,g,n=1)=>{for(let k=0;k<n;k++)for(const[a,b]of[[k,0],[0,k]]){g.clearRect(a,b,1,1);g.clearRect(w-1-a,b,1,1);g.clearRect(a,h-1-b,1,1);g.clearRect(w-1-a,h-1-b,1,1)}};
  // parchment in a carved frame: 48x48, slice 16
  make('parch',48,48,(w,h,g)=>{
    r(0,0,w,h,'#e8c995');for(let i=0;i<w;i++)for(let j=0;j<h;j++){const n=hs(i,j+400);if(n>.94)r(i,j,1,1,'#dcb47a');else if(n<.04)r(i,j,1,1,'#f4dcae')}
    rings(w,h,['#24100a','#e09048','#b8692e','#9a5428','#7a3e1e','#5a2a12','#24100a','#b88a56','#d4ae78']);
    for(let i=10;i<w-10;i+=6)r(i,3,2,1,'#b06028');for(let i=10;i<w-10;i+=6)r(i,h-4,2,1,'#5a2a12');
    for(const[sx,sy]of[[1,1],[-1,1],[1,-1],[-1,-1]]){const X=sx>0?0:w-1,Y=sy>0?0:h-1,P=(dx,dy,c)=>r(X+dx*sx,Y+dy*sy,1,1,c);
      for(let a=0;a<12;a++)for(let b=0;b<12;b++){if(a>4&&b>4)continue;if(a+b>14)continue;P(a,b,(a===0||b===0)?'#24100a':(a===1||b===1)?'#ffe0a0':(a===4||b===4)&&a<12&&b<12?'#7a4a18':'#d8a040')}
      P(2,2,'#fff6c8');P(3,3,'#7a4a18');P(9,2,'#7a4a18');P(2,9,'#7a4a18');
      // a little vine curl painted on the parchment
      [[10,10],[11,10],[12,11],[12,12],[11,13],[10,12],[13,9],[14,9],[9,13],[9,14]].forEach(([a,b])=>P(a,b,'#a8743c'));P(14,8,'#5fae4a');P(8,14,'#5fae4a')}
  });
  // dark slot with an orange rim: 16x16, slice 5
  make('slot',16,16,(w,h,g)=>{r(0,0,w,h,'#4a2616');for(let j=6;j<h-5;j+=3)r(5,j,w-10,1,'#52301c');
    rings(w,h,['#1a0c06','#f0a050','#d0782e','#8a4a1e','#2a140a']);nip(w,h,g);r(1,1,1,1,'#1a0c06');r(w-2,1,1,1,'#1a0c06');r(1,h-2,1,1,'#1a0c06');r(w-2,h-2,1,1,'#1a0c06')});
  make('slotOn',16,16,(w,h,g)=>{r(0,0,w,h,'#5a3418');rings(w,h,['#1a0c06','#fff3b0','#f7c948','#c9921a','#2a140a']);nip(w,h,g)});
  // title ribbon in the colors of the logo's SAGA banner: caramel cloth, dark seams, silver diamond studs
  make('plaque',32,20,(w,h,g)=>{r(0,0,w,h,'#b8834e');for(let j=4;j<h-4;j+=2)for(let i=6;i<w-6;i++)if(hs(i,j)>.55)r(i,j,1,1,'#a87444');
    rings(w,h,['#2a1808','#e0b07a','#c08a52','#7a5030']);nip(w,h,g,2);r(1,1,1,1,'#2a1808');r(w-2,1,1,1,'#2a1808');r(1,h-2,1,1,'#2a1808');r(w-2,h-2,1,1,'#2a1808');
    for(const X of[5,w-6]){r(X,h/2-3,1,1,'#f0f0ff');r(X-1,h/2-2,3,1,'#c8c8d8');r(X-2,h/2-1,5,2,'#e0e0f0');r(X-1,h/2+1,3,1,'#8a8aa0');r(X,h/2+2,1,1,'#6a6a80')}});
  // pill buttons: 16x16, slice 4
  const pill=(n,hi,mid,lo)=>make(n,16,16,(w,h,g)=>{r(0,0,w,h,mid);rings(w,h,['#24100a']);r(1,1,w-2,2,hi);r(1,h-4,w-2,3,lo);nip(w,h,g,2);r(1,1,1,1,'#24100a');r(w-2,1,1,1,'#24100a');r(1,h-2,1,1,'#24100a');r(w-2,h-2,1,1,'#24100a')});
  pill('btn','#fff0a0','#f8b830','#c0661a');pill('btnDark','#9a6448','#6a3e2a','#3a2018');pill('btnRed','#ff9a7a','#d0502a','#7a2410');
  C=keep;
  const st=document.documentElement.style;Object.entries(out).forEach(([k,v])=>st.setProperty('--f-'+k,v));
})();
