// Opens the game in headless Chrome, served from the project folder. Shared by tools/visual.mjs and tools/perf.mjs.
import {spawn} from 'node:child_process';import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {fileURLToPath} from 'node:url';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const CHROME=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.mp3':'audio/mpeg','.wav':'audio/wav','.json':'application/json','.webmanifest':'application/manifest+json'};
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));

export async function openGame(){
  const server=http.createServer((q,res)=>{const f=path.join(ROOT,decodeURIComponent(new URL(q.url,'http://x').pathname));
    if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end()}
    res.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res)}).listen(0);
  const port=server.address().port,dbg=9000+(process.pid%400),prof=fs.mkdtempSync(path.join(os.tmpdir(),'fds-tool-'));
  const chrome=spawn(CHROME,['--headless=new',`--remote-debugging-port=${dbg}`,`--user-data-dir=${prof}`,'--window-size=1280,720','--hide-scrollbars','--mute-audio','--no-first-run','about:blank'],{stdio:'ignore'});
  let targets=[];for(let i=0;i<60&&!targets.length;i++){try{targets=(await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json()).filter(t=>t.type==='page')}catch(e){}await sleep(200)}
  const ws=new WebSocket(targets[0].webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const wait=new Map(),errors=[];
  ws.onmessage=ev=>{const m=JSON.parse(ev.data);if(m.id&&wait.has(m.id)){wait.get(m.id)(m);wait.delete(m.id);return}
    if(m.method==='Runtime.exceptionThrown')errors.push((m.params.exceptionDetails.exception||{}).description||m.params.exceptionDetails.text)};
  const send=(method,params={})=>new Promise(r=>{const i=++id;wait.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
  const js=async e=>{const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});const x=r.result||{};if(x.exceptionDetails)errors.push('eval: '+((x.exceptionDetails.exception||{}).description||x.exceptionDetails.text));return x.result&&x.result.value};
  await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:`http://127.0.0.1:${port}/jardim-do-fruto.html`});
  for(let i=0;i<60;i++){if(await js('typeof showHub=="function"&&!!window.S'))break;await sleep(200)}
  await js(`localStorage.clear();1`);
  const shot=async()=>(await send('Page.captureScreenshot',{format:'png'})).result.data;
  const close=()=>{ws.close();chrome.kill();server.close();try{fs.rmSync(prof,{recursive:true,force:true})}catch(e){}};
  return{js,send,shot,close,errors}}
