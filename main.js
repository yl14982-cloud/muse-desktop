'use strict';
const {app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen, safeStorage} = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const crypto = require('node:crypto');
const notionSync = require('./notion-sync');
const focusStore = require('./focus-store');

const MOODS = new Set(['Focused', 'Calm', 'A bit tired', 'Low energy', 'Stressed']);
const PORT = 43187;
let win, tray, server, token, dataFile, tokenFile, syncTimer;
let connectionFile; let connection={token:'',tasksId:'',stateId:''};
let focus = focusStore.createFocus(); let focusFile, focusTicker;
let availableTasks=[]; let syncStatus={configured:false,ok:false,message:"Notion not configured",lastSync:null}; let chosenTaskIds=[];
let current = {
  mood: 'A bit tired',
  tasks: [{id:'dsp-review', title:'DSP Review', done:false}, {id:'dsp-preview', title:'DSP Preview', done:false}],
  updatedAt: null,
  source: 'demo'
};
const clamp = (s, limit) => String(s ?? '').slice(0, limit);
function persist() { fs.writeFileSync(dataFile, JSON.stringify(current, null, 2), {encoding:'utf8', mode:0o600}); }
function load() {
  dataFile = path.join(app.getPath('userData'), 'muse-state.json');
  focusFile = path.join(app.getPath('userData'), 'muse-focus.json');
  try {const saved=JSON.parse(fs.readFileSync(focusFile,'utf8'));
    focus={...focusStore.createFocus(),...saved};
    // Pause upon startup: do not claim unattended time while app was closed.
    if(focus.mode==='running'){focus.mode='paused';focus.startedAt=null;}
    if(!Array.isArray(focus.sessions))focus.sessions=[];
    if(!Array.isArray(focus.feedback))focus.feedback=[];
  }catch{}
  connectionFile=path.join(app.getPath('userData'),'notion-connection.json');
  try {
    const saved=JSON.parse(fs.readFileSync(connectionFile,'utf8'));
    connection.tasksId=saved.tasksId||'';connection.stateId=saved.stateId||'';
    if(saved.tokenEncrypted && safeStorage.isEncryptionAvailable())
      connection.token=safeStorage.decryptString(Buffer.from(saved.tokenEncrypted,'base64'));
  } catch(e){if(e.code!=='ENOENT')console.warn('Could not load connection:',e.message);}
  tokenFile = path.join(app.getPath('userData'), 'bridge-token.txt');
  try {const parsed = JSON.parse(fs.readFileSync(dataFile,'utf8'));
    if (MOODS.has(parsed.mood)) current.mood = parsed.mood;
    if (Array.isArray(parsed.tasks)) current.tasks = parsed.tasks.slice(0,2).map((t,i)=>({id:clamp(t.id||i,80),title:clamp(t.title,120),done:!!t.done}));
    current.updatedAt=parsed.updatedAt??null; current.source=parsed.source??'demo';
  } catch {}
  try {token=fs.readFileSync(tokenFile,'utf8').trim(); if(token.length<32)throw Error('invalid');}
  catch {token=crypto.randomBytes(32).toString('hex');fs.writeFileSync(tokenFile,token,{mode:0o600});}
  try { const setting=JSON.parse(fs.readFileSync(path.join(app.getPath('userData'),'muse-settings.json'),'utf8'));chosenTaskIds=Array.isArray(setting.chosenTaskIds)?setting.chosenTaskIds.slice(0,2):[]; }catch{}
  persist();
}
function focusSnapshot(){
  const value=focusStore.snapshot(focus);
  // Stored focus seconds are credited to the day in which the session started.
  const day=focus.activeDate || focusStore.todayKey();
  value.todaySeconds=focus.sessions.filter(s=>s.date===focusStore.todayKey()).reduce((sum,s)=>sum+(s.seconds||0),0)+(day===focusStore.todayKey()?value.elapsedSeconds:0);
  return value;
}
function notifyFocus(){if(win&&!win.isDestroyed())win.webContents.send('muse:focus',focusSnapshot());}
function persistFocus(){
  const copy={...focus};
  // On restart the session is paused with elapsed time persisted, not silently kept running.
  if(copy.mode==='running') {copy.elapsedSeconds=focusStore.accumulated(focus);copy.startedAt=null;copy.mode='paused';}
  fs.writeFileSync(focusFile,JSON.stringify(copy,null,2),{mode:0o600});
}
function checkpointFocus(){
  if(focus.mode!=='running')return;
  if(focusStore.accumulated(focus)>=focus.durationSeconds){
    focus.elapsedSeconds=focus.durationSeconds;focus.startedAt=null;focus.mode='finished';
    // A completed focus block is not the same as a completed Notion task.
    focus.sessions.push({date:focus.activeDate||focusStore.todayKey(),taskId:focus.taskId,taskTitle:focus.taskTitle,seconds:focus.durationSeconds,goal:focus.goal,feedback:[...focus.feedback],outcome:focus.outcome,completed:true,endedAt:new Date().toISOString()});
    focus.elapsedSeconds=0;focus.taskId=null;focus.taskTitle='';focus.goal='';focus.feedback=[];focus.outcome='';
    persistFocus();
  }
  if(Math.floor(Date.now()/1000)%15===0)persistFocus();
  notifyFocus();
}
function focusAction(action,payload={}){
  const now=Date.now();
  const text=(x,max=800)=>clamp(x,max).trim();
  if(action==='start'){
    if(focus.mode==='running')return focusSnapshot();
    if(focus.mode==='paused'){focus.startedAt=now;focus.mode='running';}
    else{
      const requested=current.tasks.find(t=>t.id===payload.taskId);
      if(!requested)throw Error('Choose one of today’s tasks first');
      focus={...focusStore.createFocus(),sessions:focus.sessions,mode:'running',taskId:requested.id,taskTitle:requested.title,goal:text(payload.goal||'',500),startedAt:now,activeDate:focusStore.todayKey()};
    }
  } else if(action==='pause') {
    if(focus.mode==='running'){focus.elapsedSeconds=focusStore.accumulated(focus,now);focus.startedAt=null;focus.mode='paused';}
  } else if(action==='reset'){
    // Save partial time before clearing; resetting must not erase study already recorded.
    const seconds=focusStore.accumulated(focus,now);
    if(['paused','running'].includes(focus.mode)&&seconds>0)focus.sessions.push({date:focus.activeDate||focusStore.todayKey(),taskId:focus.taskId,taskTitle:focus.taskTitle,seconds,goal:focus.goal,feedback:[...focus.feedback],outcome:focus.outcome,completed:false,endedAt:new Date().toISOString()});
    focus={...focusStore.createFocus(),sessions:focus.sessions};
  } else if(action==='goal')focus.goal=text(payload.text,500);
  else if(action==='feedback'){
    const v=text(payload.text);if(v)focus.feedback.push({at:new Date().toISOString(),text:v});
  } else if(action==='outcome'){focus.outcome=text(payload.text,2000);if(focus.mode==='finished'&&focus.sessions.length)focus.sessions[focus.sessions.length-1].outcome=focus.outcome;}
  else throw Error('Unknown focus action');
  persistFocus();notifyFocus();return focusSnapshot();
}
function saveSettings(){fs.writeFileSync(path.join(app.getPath('userData'),'muse-settings.json'),JSON.stringify({chosenTaskIds},null,2),{mode:0o600});}
function notionConfig(){return {token:connection.token||process.env.MUSE_NOTION_TOKEN||'',tasksId:connection.tasksId||process.env.MUSE_TASKS_DATA_SOURCE_ID||'',stateId:connection.stateId||process.env.MUSE_STATE_PAGE_ID||''};}
function connectionStatus(){const c=notionConfig();return {configured:!!(c.token&&c.tasksId&&c.stateId),tasksId:c.tasksId,stateId:c.stateId,encrypted:!!connection.token};}
function syncSnapshot(){return {state:current,availableTasks,syncStatus,chosenTaskIds};}
function notifySync(){if(win&&!win.isDestroyed())win.webContents.send('muse:sync',syncSnapshot());}
async function syncNotion(){
  const cfg=notionConfig();
  if(!cfg.token || !cfg.tasksId || !cfg.stateId){syncStatus={configured:false,ok:false,message:'Connect Notion in Settings',lastSync:null};notifySync();return syncSnapshot();}
  syncStatus={...syncStatus,configured:true,message:'Syncing…'};notifySync();
  const errors=[];
  try {const tasks=await notionSync.readTasks(cfg);availableTasks=tasks;
    // Only explicitly selected tasks are shown; never silently pick deadlines or Proposed rows.
    current.tasks=chosenTaskIds.map(id=>tasks.find(t=>t.id===id)).filter(Boolean).map(t=>({id:t.id,title:t.title,done:t.status==='Done'}));
    if(chosenTaskIds.length===0)current.tasks=[];
    current.source='Notion Tasks';persist();notify();
  }catch(e){errors.push('Tasks: '+e.message);}
  try {const result=await notionSync.readMood(cfg);if(result.mood){current.mood=result.mood;current.updatedAt=result.observedAt||null;current.source='Notion Muse State';persist();notify();}}
  catch(e){errors.push('Mood: '+e.message);}
  syncStatus={configured:true,ok:errors.length===0,message:errors.length?errors.join('; '):'Connected',lastSync:new Date().toISOString()};notifySync();return syncSnapshot();
}
function notify() { if(win&&!win.isDestroyed()) win.webContents.send('muse:state', current); }
function update(payload) {
  if (!payload || typeof payload !== 'object') return {ok:false,error:'invalid payload'};
  if (payload.mood!==undefined) {if (!MOODS.has(payload.mood)) return {ok:false,error:'invalid mood'};current.mood=payload.mood;}
  if (payload.tasks!==undefined) {
    if (!Array.isArray(payload.tasks)||payload.tasks.length>2||payload.tasks.some(t=>!t || typeof t.title!=='string' || !t.title.trim()))return {ok:false,error:'up to two valid tasks required'};
    current.tasks=payload.tasks.map((t,i)=>({id:clamp(t.id??`task-${i+1}`,80),title:clamp(t.title,120),done:!!t.done}));
  }
  current.updatedAt = new Date().toISOString();
  current.source = clamp(payload.source || 'local-bridge',80);
  persist();notify();return {ok:true,state:current};
}
function send(res,status,body) {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'null'});res.end(JSON.stringify(body));}
function startBridge() {
  server=http.createServer((req,res)=>{
    // No CORS preflight or wildcard origin: other websites cannot use this endpoint.
    if(req.method!=='POST'||req.url!=='/v1/state')return send(res,404,{ok:false,error:'not found'});
    const auth=req.headers.authorization||'';
    const expected=`Bearer ${token}`;
    const a=Buffer.from(auth),b=Buffer.from(expected);
    if(a.length!==b.length || !crypto.timingSafeEqual(a,b))return send(res,401,{ok:false,error:'unauthorized'});
    if(req.headers.origin && req.headers.origin!=='null')return send(res,403,{ok:false,error:'browser origin rejected'});
    let data='';req.on('data',part=>{data+=part;if(data.length>12000)req.destroy();});
    req.on('end',()=>{try{send(res,200,update(JSON.parse(data)));}catch{send(res,400,{ok:false,error:'invalid JSON'});}});
  });
  server.on('error',err=>console.error('Muse local bridge unavailable:',err.message));
  server.listen(PORT,'127.0.0.1');
}
function expanded(flag) {
  if (!win||win.isDestroyed())return;
  const display=screen.getDisplayMatching(win.getBounds()).workArea;
  const newHeight=flag?670:192;
  const previous=win.getBounds();
  win.setBounds({x:Math.max(display.x,Math.min(previous.x,display.x+display.width-540)),y:Math.max(display.y,Math.min(previous.y,display.y+display.height-newHeight)),width:540,height:Math.min(newHeight,display.height)});
  win.webContents.send('muse:expanded',flag);
}
function createWindow() {
  win = new BrowserWindow({width:540,height:192,minWidth:540,minHeight:190,frame:false,transparent:true,backgroundColor:'#00000000',
    resizable:false,alwaysOnTop:true,skipTaskbar:true,hasShadow:false,show:false,
    icon:path.join(__dirname,'assets','muse.png'),
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  const work=screen.getPrimaryDisplay().workArea;
  win.setPosition(Math.max(work.x,work.x+work.width-565),Math.max(work.y,work.y+30));
  win.loadFile(path.join(__dirname,'index.html'));
  win.once('ready-to-show',()=>win.show());
  win.on('closed',()=>{win=null;});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
}
function createTray() {
  tray=new Tray(nativeImage.createFromPath(path.join(__dirname,'assets','muse.png')));
  tray.setToolTip('Muse Desktop');
  tray.setContextMenu(Menu.buildFromTemplate([
    {label:'Show Muse',click:()=>{if(!win)createWindow();else win.show();}},
    {label:'Collapse',click:()=>expanded(false)},
    {type:'separator'},
    {label:'Quit Muse',click:()=>app.quit()}
  ]));
  tray.on('double-click',()=>{if(win)win.show();});
}
app.whenReady().then(()=>{
  load();createWindow();createTray();startBridge();
  focusTicker=setInterval(checkpointFocus,1000);
  syncNotion().catch(console.error);syncTimer=setInterval(()=>syncNotion().catch(console.error),90000);
  ipcMain.handle('muse:get-state',()=>current);
  ipcMain.handle('muse:get-focus',()=>focusSnapshot());
  ipcMain.handle('muse:focus-action',(_,action,payload)=>focusAction(action,payload));
  ipcMain.handle('muse:get-sync',()=>syncSnapshot());
  ipcMain.handle('muse:get-connection',()=>connectionStatus());
  ipcMain.handle('muse:save-connection',async (_,payload)=>{
    if(!payload || typeof payload!=='object') throw Error('Invalid connection');
    const uuid=/^[0-9a-fA-F-]{32,36}$/;
    const cleanId=x=>String(x||'').replace(/-/g,'').toLowerCase();
    const tasksId=cleanId(payload.tasksId),stateId=cleanId(payload.stateId);
    if(!uuid.test(tasksId)||!uuid.test(stateId))throw Error('Invalid Notion IDs');
    const candidate=String(payload.token||'').trim();
    const tokenToStore=candidate||connection.token;
    if(!tokenToStore||tokenToStore.length<16||tokenToStore.length>512)throw Error('Enter a valid Notion token');
    if(!safeStorage.isEncryptionAvailable())throw Error('Secure credential storage is not available on this computer');
    const encrypted=safeStorage.encryptString(tokenToStore).toString('base64');
    fs.writeFileSync(connectionFile,JSON.stringify({tasksId,stateId,tokenEncrypted:encrypted}),{mode:0o600});
    connection={token:tokenToStore,tasksId,stateId};
    return {connection:connectionStatus(),sync:await syncNotion()};
  });
  ipcMain.handle('muse:forget-connection',()=>{connection={token:'',tasksId:'',stateId:''};try{fs.unlinkSync(connectionFile);}catch{};syncStatus={configured:false,ok:false,message:'Notion disconnected',lastSync:null};notifySync();return connectionStatus();});
  ipcMain.handle('muse:sync-now',()=>syncNotion());
  // Selecting today's tasks is a LOCAL operation. Never write back to Notion.
  // In particular, removal must still work when the Notion token is missing,
  // an API refresh failed, or the task list has not loaded yet.
  ipcMain.handle('muse:choose-tasks',(_,ids)=>{
    if(!Array.isArray(ids)||ids.length>2||ids.some(id=>typeof id!=='string'||!id))return false;
    const uniqueIds=[...new Set(ids)];
    const oldTasks=current.tasks;
    const oldChosen=chosenTaskIds;
    const known=new Set([...chosenTaskIds,...oldTasks.map(t=>t.id),...availableTasks.map(t=>t.id)]);
    if(uniqueIds.some(id=>!known.has(id)))return false;
    const nextTasks=uniqueIds.map(id=>{
      const latest=availableTasks.find(t=>t.id===id);
      const cached=oldTasks.find(t=>t.id===id);
      if(!latest&&!cached)return null;
      return {id,title:latest?.title??cached.title,done:latest?latest.status==='Done':!!cached.done};
    });
    if(nextTasks.some(t=>!t))return false;
    try{
      chosenTaskIds=uniqueIds;
      saveSettings();
      current.tasks=nextTasks;
      persist();
    }catch(e){
      chosenTaskIds=oldChosen;current.tasks=oldTasks;
      console.error('Local today-task selection failed:',e);
      return false;
    }
    notify();notifySync();return true;
  });
  ipcMain.handle('muse:expand',(_,flag)=>{expanded(!!flag);return true;});
  ipcMain.handle('muse:toggle-task',()=>false); // Notion remains canonical; no local false completion
  ipcMain.handle('muse:hide',()=>{if(win)win.hide();});
  ipcMain.handle('muse:token-path',()=>tokenFile);
  ipcMain.handle('muse:close',()=>app.quit());
  app.on('activate',()=>{if(!win)createWindow();});
});
app.on('window-all-closed',()=>{/* tray keeps Muse running */});
app.on('before-quit',()=>{if(syncTimer)clearInterval(syncTimer);if(focusTicker)clearInterval(focusTicker);if(focusFile)persistFocus();if(server)server.close();});
