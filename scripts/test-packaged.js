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
    const state=await evaluate('window.MuseDesktop.getState()');
    assert.equal(state.tasks.length,2,'Fresh profile contains demo tasks');
    const taskId=JSON.stringify(state.tasks[0].id);
    const running=await evaluate(`window.MuseDesktop.focusAction('start',{taskId:${taskId},goal:'Packaged CI check'})`);
    assert.equal(running.mode,'running');
    await delay(1200);
    const paused=await evaluate("window.MuseDesktop.focusAction('pause')");
    assert.equal(paused.mode,'paused'); assert(paused.elapsedSeconds>=1);
    await evaluate("document.querySelector('[data-page=\"settings\"]').click()");
    assert.equal(await evaluate("document.getElementById('connToken').type"),'password');
    assert.equal(await evaluate("document.getElementById('connToken').value"),'');
    // Force a restart to verify that timer checkpoints survive process termination.
    await stop(); await launch();
    const restored=await evaluate('window.MuseDesktop.getFocus()');
    assert.equal(restored.mode,'paused');assert.equal(restored.goal,'Packaged CI check');
    assert.equal(restored.elapsedSeconds,paused.elapsedSeconds);
    const reset=await evaluate("window.MuseDesktop.focusAction('reset')");
    assert.equal(reset.mode,'idle');assert(reset.sessions.some(s=>s.goal==='Packaged CI check'&&s.seconds>=1));
    const selected=await evaluate(`window.MuseDesktop.chooseTasks([${taskId}])`);
    assert.equal(selected,true);
    assert.equal((await evaluate('window.MuseDesktop.getState()')).tasks.length,1);
    const evidence=await cdp.send('Page.captureScreenshot',{format:'png'});
    fs.mkdirSync('smoke-proofs',{recursive:true});
    fs.writeFileSync('smoke-proofs/muse-windows.png',Buffer.from(evidence.data,'base64'));
    console.log('PASS: packaged Windows launch, isolated renderer, bridge authentication, expanded panel, timer start/pause/reset, restart persistence, task selection and Settings.');
  } finally { await stop(); fs.rmSync(profile,{recursive:true,force:true,maxRetries:3}); }
}
main().catch(error => {console.error(error);process.exitCode=1;});
