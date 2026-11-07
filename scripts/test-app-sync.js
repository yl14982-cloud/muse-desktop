'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'muse-sync-test-'));
let tasks=[{id:'remote-1',title:'From the test adapter',status:'Ready'}],mood='Focused',fail=false,release;
const adapter={readTasks:async()=>{if(fail)throw Error('Offline');return tasks;},readMood:async()=>({mood,observedAt:'2026-11-07'})};
const electron={app:{getPath:()=>dir,whenReady:()=>({then:()=>{}}),on:()=>{}},safeStorage:{isEncryptionAvailable:()=>true},ipcMain:{handle:()=>{}}};
const context=vm.createContext({require:name=>name==='electron'?electron:name==='./notion-sync'?adapter:name.startsWith('./')?require('../'+name.slice(2)):require(name),console,structuredClone,Buffer,process:{env:{}},setInterval,clearInterval,__dirname:path.resolve(__dirname,'..')});
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','main.js'),'utf8'),context);
const run=code=>vm.runInContext(code,context);
(async()=>{
 try{
  run('load();connection={token:"mock-only-token",tasksId:"mock-tasks",stateId:"mock-state"};changeBoard(s=>{taskStore.addLocal(s,"Local survives sync");taskStore.selectTasks(s,[s.localTasks[0].id]);taskStore.enableNotion(s,true);s.moodSource="notion";});');
  await run('syncNotion()');assert.equal(run('current.tasks[0].title'),'Local survives sync');assert.equal(run('current.mood'),'Focused');
  run('changeBoard(s=>taskStore.setMood(s,"Calm"))');mood='Stressed';await run('syncNotion()');assert.equal(run('current.mood'),'Calm');
  fail=true;await run('syncNotion()');assert.equal(run('board.localTasks.length'),1);assert.equal(run('current.tasks[0].title'),'Local survives sync');assert.equal(run('syncStatus.ok'),false);
  fail=false;adapter.readTasks=()=>new Promise(resolve=>{release=resolve;});
  const inFlight=run('syncNotion()');run('syncGeneration++;changeBoard(s=>taskStore.enableNotion(s,false));');release([{id:'late',title:'Must not appear after disconnect',status:'Ready'}]);await inFlight;
  assert.equal(run('board.notionEnabled'),false);assert.equal(run('taskStore.allTasks(board).some(t=>t.id==="late")'),false);assert.equal(run('current.tasks[0].title'),'Local survives sync');
  console.log('PASS: app sync preserves local tasks, respects manual mood, tolerates API failure and rejects stale responses after disconnect');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
