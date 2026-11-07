'use strict';
// Runs only against our freshly built app on an isolated Windows CI runner.
// The debugging endpoint is enabled for this test process only, never by default.
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const {setTimeout: delay} = require('node:timers/promises');

async function freePort() {
  const server = net.createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}
async function waitFor(fn, label, timeout = 45000) {
  const deadline = Date.now() + timeout;
  let last;
  while (Date.now() < deadline) {
    try { const result = await fn(); if (result) return result; } catch(e) { last = e; }
    await delay(250);
  }
  throw new Error(`Timed out: ${label}${last ? ': '+last.message : ''}`);
}
async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, {once:true});
    ws.addEventListener('error', reject, {once:true});
  });
  let id = 0; const pending = new Map();
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id); clearTimeout(item.timer);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  });
  return {
    close: () => ws.close(),
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const requestId = ++id;
        const timer = setTimeout(() => {pending.delete(requestId);reject(new Error(`CDP timed out: ${method}`));},15000);
        pending.set(requestId, {resolve,reject,timer});
        ws.send(JSON.stringify({id:requestId,method,params}));
      });
    }
  };
}
async function main() {
  assert.equal(process.platform, 'win32', 'Packaged smoke test requires Windows');
  const executable = path.resolve('dist/win-unpacked/Muse Desktop.exe');
  assert(fs.existsSync(executable), 'Build the Windows app before testing');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'muse-smoke-'));
  const port = await freePort();
  const env = {...process.env};
  for (const key of Object.keys(env)) if (/^(MUSE_|ELECTRON_RUN_AS_NODE)/.test(key)) delete env[key];
  let child, cdp;
  const launch = async () => {
    child = spawn(executable, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`], {env,stdio:'ignore'});
    child.on('error', err => console.error('Launch failed:',err.message));
    const target = await waitFor(async () => {
      if (child.exitCode !== null) throw new Error(`App exited: ${child.exitCode}`);
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      return list.find(t => t.type === 'page' && t.url.startsWith('file:') && t.url.endsWith('/index.html'));
    }, 'packaged renderer');
    cdp = await connect(target.webSocketDebuggerUrl);
    await waitFor(async () => evaluate("typeof window.MuseDesktop === 'object' && document.getElementById('briefTasks').children.length > 0"), 'preload and task UI');
  };
  const evaluate = async expression => {
    const result = await cdp.send('Runtime.evaluate', {expression,awaitPromise:true,returnByValue:true});
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const stop = async () => {
    if(cdp){cdp.close();cdp=null;}
    if(child && child.exitCode === null) {
      const killer=spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore'});
      await new Promise(resolve=>killer.once('exit',resolve));
      await delay(500);
    }
  };
  try {
    await launch();
    assert.equal(await evaluate('typeof require'), 'undefined', 'Renderer must not expose Node require');
    assert.equal((await evaluate('window.MuseDesktop.getConnection()')).configured, false);
    const response=await fetch('http://127.0.0.1:43187/v1/state',{method:'POST',body:'{}'});
    assert.equal(response.status,401,'Local bridge requires authentication');
    await evaluate("document.getElementById('mini').click()");
    await waitFor(async()=>evaluate("!document.getElementById('panel').hidden"),'expanded panel');
    assert.equal((await evaluate('window.MuseDesktop.getState()')).tasks.length,0,'Fresh profiles start without fake tasks');
    assert.equal((await evaluate('window.MuseDesktop.getSync()')).notionEnabled,false);
    await evaluate("document.getElementById('openTasks').click()");
    await evaluate("document.getElementById('newTaskTitle').value='Plan one small step';document.getElementById('addTaskForm').requestSubmit()");
    await waitFor(async()=>evaluate("document.getElementById('taskList').textContent.includes('Plan one small step')"),'local task added through UI');
    const local=await evaluate('window.MuseDesktop.getSync()');
    const taskId=JSON.stringify(local.availableTasks[0].id);
    await evaluate("document.querySelector('[data-choose]').click()");
    await waitFor(async()=>evaluate("document.querySelectorAll('#briefTasks [data-clock]').length === 1"),'task selected through UI');
    await evaluate("document.querySelector('[data-clock]').click()");
    await waitFor(async()=>(await evaluate('window.MuseDesktop.getFocus()')).mode==='running','timer started through UI');
    await evaluate("window.MuseDesktop.focusAction('goal',{text:'Packaged CI check'})");
    await delay(1200);
    await evaluate("document.getElementById('focusToggle').click()");
    await waitFor(async()=>(await evaluate('window.MuseDesktop.getFocus()')).mode==='paused','timer paused through UI');
    const paused=await evaluate('window.MuseDesktop.getFocus()');assert(paused.elapsedSeconds>=1);
    await evaluate("document.getElementById('moodSelect').value='Focused';document.getElementById('moodSelect').dispatchEvent(new Event('change'))");
    await waitFor(async()=>(await evaluate('window.MuseDesktop.getState()')).mood==='Focused','manual mood saved');
    // Literal text must not become executable HTML.
    await evaluate(`window.MuseDesktop.addTask(${JSON.stringify('<img src=x onerror="window.museInjected=true">')})`);
    const extra=await evaluate("window.MuseDesktop.addTask('A third task')");
    const available=await evaluate('window.MuseDesktop.getSync()');
    assert.equal(available.availableTasks.length,3);
    const threeIds=JSON.stringify(available.availableTasks.map(t=>t.id));
    assert.equal(await evaluate(`window.MuseDesktop.chooseTasks(${threeIds}).then(()=>false,()=>true)`),true);
    assert.equal((await evaluate('window.MuseDesktop.getState()')).tasks.length,1);
    assert.equal(await evaluate('!!window.museInjected'),false);
    await evaluate("document.querySelector('[data-page=\"settings\"]').click()");
    assert.equal(await evaluate("document.getElementById('connToken').type"),'password');
    assert.equal(await evaluate("document.getElementById('connToken').value"),'');
    assert.equal(await evaluate("document.getElementById('notionEnabled').checked"),false);
    assert.equal(await evaluate("document.getElementById('syncNow').disabled"),true);
    assert.equal(await evaluate("window.MuseDesktop.setNotionEnabled(true).then(()=>false,()=>true)"),true);
    await stop(); await launch();
    const restored=await evaluate('window.MuseDesktop.getFocus()');
    assert.equal(restored.mode,'paused');assert.equal(restored.goal,'Packaged CI check');
    assert.equal(restored.elapsedSeconds,paused.elapsedSeconds);
    assert.equal((await evaluate('window.MuseDesktop.getSync()')).availableTasks.length,3);
    assert.equal((await evaluate('window.MuseDesktop.getState()')).mood,'Focused');
    const reset=await evaluate("window.MuseDesktop.focusAction('reset')");
    assert.equal(reset.mode,'idle');assert(reset.sessions.some(s=>s.goal==='Packaged CI check'&&s.seconds>=1));
    await evaluate("document.getElementById('mini').click()");
    await evaluate("document.querySelector('[data-complete]').click()");
    await waitFor(async()=>(await evaluate('window.MuseDesktop.getState()')).tasks[0].done,'complete local task through UI');
    assert.equal(await evaluate("document.getElementById('focusToggle').disabled"),true);
    await evaluate("document.querySelector('[data-complete]').click()");
    await waitFor(async()=>(await evaluate('window.MuseDesktop.getState()')).tasks[0].done===false,'reopen local task through UI');
    assert.equal(await evaluate("document.getElementById('focusToggle').disabled"),false);
    const literalId=JSON.stringify(available.availableTasks[1].id);
    await evaluate(`window.MuseDesktop.chooseTasks([${taskId},${literalId}])`);
    assert.equal(await evaluate('!!document.querySelector("#briefTasks img")'),false);
    assert.equal(await evaluate('!!window.museInjected'),false);
    await evaluate(`window.MuseDesktop.chooseTasks([${taskId}])`);
    const evidence=await cdp.send('Page.captureScreenshot',{format:'png'});
    fs.mkdirSync('smoke-proofs',{recursive:true});
    fs.writeFileSync('smoke-proofs/muse-windows.png',Buffer.from(evidence.data,'base64'));
    console.log('PASS: packaged local-first Windows UI: add/select/complete/reopen tasks, two-task limit, escaped task text, focus timer, manual mood, restart persistence and optional Notion settings.');
  } finally { await stop(); fs.rmSync(profile,{recursive:true,force:true,maxRetries:3}); }
}
main().catch(error => {console.error(error);process.exitCode=1;});
