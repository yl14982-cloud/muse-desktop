'use strict';
const moods={
  'Focused':{caption:'One thing at a time ✦',kind:'focused'},
  'Calm':{caption:'Feeling steady · Take your time',kind:'calm'},
  'A bit tired':{caption:'Lower energy · Go gently ♡',kind:'tired'},
  'Low energy':{caption:'Rest is allowed ♡',kind:'low'},
  'Stressed':{caption:'One small step is enough ♡',kind:'stressed'}
};
const $=id=>document.getElementById(id);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let state={mood:'A bit tired',tasks:[{id:'1',title:'DSP Review',done:false},{id:'2',title:'DSP Preview',done:false}],source:'demo'};
let expanded=false;
let focus={mode:'idle',durationSeconds:3000,elapsedSeconds:0,remainingSeconds:3000,todaySeconds:0,taskId:null,taskTitle:'',goal:'',feedback:[],outcome:''};
const fmtTime=s=>`${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.floor(Math.max(0,s)%60)).padStart(2,'0')}`;
function renderFocus(){
  if($('clockNow'))$('clockNow').textContent=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  $('miniTimer').textContent='◷ '+fmtTime(focus.remainingSeconds);
  $('miniTimer').classList.toggle('active',focus.mode==='running');
  $('timerText').textContent=fmtTime(focus.remainingSeconds);
  $('focusTask').textContent=focus.taskTitle||'Choose a task clock to start';
  $('focusMode').textContent=focus.mode==='running'?'Running':focus.mode==='paused'?'Paused':focus.mode==='finished'?'Finished':'Idle';
  $('focusToggle').textContent=focus.mode==='running'?'Ⅱ Pause':focus.mode==='paused'?'▶ Resume':'▶ Start';
  $('focusToday').textContent=`Focused today: ${Math.floor(focus.todaySeconds/60)}m ${focus.todaySeconds%60}s`;
  if(document.activeElement!==$('focusGoal'))$('focusGoal').value=focus.goal||'';
  if(document.activeElement!==$('focusOutcome'))$('focusOutcome').value=focus.outcome||'';
}
async function focusDo(action,payload){if(!window.MuseDesktop)return;try{focus=await window.MuseDesktop.focusAction(action,payload);renderFocus();}catch(e){alert(e.message||'Focus timer error');}}
async function clickClock(taskId){if(['running','paused'].includes(focus.mode)&&taskId&&focus.taskId!==taskId){alert('A timer is already running for another task. Reset to save your time before switching tasks.');return;}if(focus.mode==='running'){await focusDo('pause');return;}if(focus.mode==='paused'){await focusDo('start');return;}const first=state.tasks.find(t=>t.id===taskId)||state.tasks[0];if(!first)return;await focusDo('start',{taskId:first.id,goal:$('focusGoal').value});}

let syncData={availableTasks:[],chosenTaskIds:[],syncStatus:{configured:false,message:'Not configured'}};
function cat(mood){let kind=(moods[mood]||moods.Calm).kind,open=['focused','stressed'].includes(kind),sleepy=['tired','low'].includes(kind);
const eyes=open?'<circle cx="54" cy="66" r="2.8" fill="#736879"/><circle cx="83" cy="66" r="2.8" fill="#736879"/>':'<path d="M48 65q6 7 12 0M77 65q6 7 12 0" fill="none" stroke="#726777" stroke-width="2.05" stroke-linecap="round"/>';
const brows=kind==='stressed'?'<path d="M44 58l10 -5M84 53l10 5" stroke="#756980" stroke-width="2.05" stroke-linecap="round"/>':'';
const sparkle=kind==='focused'?'<path d="M18 25l-4 -8M116 25l6 -8" stroke="#e5a65d" stroke-width="3" stroke-linecap="round"/>':sleepy?'<text x="17" y="26" fill="#8a8fbb" font-size="15" font-weight="700">z</text><text x="7" y="12" fill="#8a8fbb" font-size="11" font-weight="700">z</text>':'';
return `<svg class="cat" viewBox="0 0 140 102" aria-hidden="true">${sparkle}<path d="M32 49Q33 33 46 30L54 35Q69 28 83 35L94 30Q110 37 110 52Q120 64 111 80Q102 93 69 92Q34 93 26 81Q19 67 32 49Z" fill="#fff5ef" stroke="#afa2bd" stroke-width="2.05" stroke-linejoin="round"/><path d="M33 78q-12 0-10 9q4 9 17 5M100 78q13 0 15 9q-3 9-18 5" fill="#fff5ef" stroke="#afa2bd" stroke-width="1.95" stroke-linecap="round"/>${brows}${eyes}<ellipse cx="41" cy="75" rx="8" ry="4.3" fill="#f5b4b7" opacity=".64"/><ellipse cx="98" cy="75" rx="8" ry="4.3" fill="#f5b4b7" opacity=".64"/><path d="M65 74q4 5 8 0" fill="none" stroke="#726777" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}
function render(){const mood=moods[state.mood]?state.mood:'Calm';$('miniCat').innerHTML=cat(mood);$('bigCat').innerHTML=cat(mood);$('miniMood').textContent=mood;$('taskCount').textContent=`✦ ${state.tasks.length}`;$('bigMood').textContent=mood;$('caption').textContent=moods[mood].caption;
$('briefTasks').innerHTML=state.tasks.slice(0,2).map((t,i)=>`<div class="brief-task ${t.done?'done':''}"><span class="num">${i+1}</span><span class="txt">${escapeHtml(t.title)}</span><button class="clock-btn" data-clock="${escapeHtml(t.id)}" title="Start / pause 50-minute focus" aria-label="Focus timer">◷</button></div>`).join('')||'<div class="info">No tasks selected</div>';
$('detailTasks').innerHTML=state.tasks.slice(0,2).map(t=>`<div class="task ${t.done?'done':''}"><span class="today-dot" aria-hidden="true">${t.done?'✓':''}</span><span class="tasklabel">${escapeHtml(t.title)}</span><button class="remove-today" data-remove-today="${escapeHtml(t.id)}" aria-label="Remove ${escapeHtml(t.title)} from Today's Tasks" title="Back to All Tasks · Does not delete the task"><svg class="remove-cat-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6.5 13.5 7.8 5.8 13.5 9.2a15 15 0 0 1 5 0l5.7-3.4 1.3 7.7c1.9 2.5 2.1 6.5.4 9.3-2.1 3.9-5.7 5.8-9.9 5.8S8.2 26.7 6.1 22.8c-1.7-2.8-1.5-6.8.4-9.3Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.4 16.4c1.3-1.4 2.6-1.4 3.7 0M18 16.4c1.3-1.4 2.6-1.4 3.7 0" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/><path d="m15.3 20.2.7.6.7-.6M16 20.8v1.2m0 0c-1.2 1.3-2.5 1.3-3.1.3M16 22c1.2 1.3 2.5 1.3 3.1.3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`).join('');
$('detailTasks').querySelectorAll('[data-remove-today]').forEach(el=>el.onclick=async e=>{e.stopPropagation();await removeFromToday(el.dataset.removeToday);});
$('todayTitle').textContent=`Today's Tasks (${state.tasks.length})`;
document.querySelectorAll('[data-clock]').forEach(el=>el.onclick=e=>{e.stopPropagation();clickClock(el.dataset.clock);});renderFocus();
$('date').textContent=new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}).format(new Date());
}
async function expand(flag){expanded=flag;$('panel').hidden=!flag;if(window.MuseDesktop)await window.MuseDesktop.expand(flag);}
$('mini').addEventListener('click',e=>{if(e.target.closest('#hide')||e.target.closest('.drag'))return;expand(!expanded);});
$('mini').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();expand(!expanded);}});
$('collapse').onclick=()=>expand(false);
$('miniTimer').onclick=e=>{e.stopPropagation();clickClock(focus.taskId||state.tasks[0]?.id);};
$('focusToggle').onclick=()=>clickClock(focus.taskId||state.tasks[0]?.id);
$('focusReset').onclick=()=>{if(confirm('Restart this 50-minute cycle? Elapsed time will be saved in today’s total.'))focusDo('reset');};
// Keep the longer goal/feedback/review form collapsed by default.
// The user may expand it only when they want to record a focus block.
let focusDetailsOpen=false;
function setFocusDetails(open){
  focusDetailsOpen=!!open;
  if($('focusDetails'))$('focusDetails').hidden=!focusDetailsOpen;
  if($('focusDetailsToggle'))$('focusDetailsToggle').setAttribute('aria-expanded',String(focusDetailsOpen));
  if($('focusDetailsChevron'))$('focusDetailsChevron').textContent=focusDetailsOpen?'⌃':'⌄';
}
if($('focusDetailsToggle'))$('focusDetailsToggle').onclick=()=>setFocusDetails(!focusDetailsOpen);
setFocusDetails(false);

$('focusGoal').onchange=()=>focusDo('goal',{text:$('focusGoal').value});
$('saveFeedback').onclick=()=>{const input=$('focusFeedback');if(!input.value.trim())return;focusDo('feedback',{text:input.value});input.value='';};
$('saveOutcome').onclick=()=>focusDo('outcome',{text:$('focusOutcome').value});
$('hide').onclick=e=>{e.stopPropagation();if(window.MuseDesktop)window.MuseDesktop.hide();else $('mini').style.opacity='.4';};
// This selection is local to Muse. It never deletes or edits the task in Notion.
async function updateTodaySelection(ids){
  ids=[...new Set(ids)].slice(0,2);
  if(window.MuseDesktop){
    try{
      const ok=await window.MuseDesktop.chooseTasks(ids);
      if(!ok){alert('Could not save today’s task selection locally. Please restart Muse and try again.');return false;}
    }catch(e){alert('Could not update today’s task selection: '+(e.message||String(e)));return false;}
  }else{
    state.tasks=state.tasks.filter(t=>ids.includes(t.id));
    render();
  }
  syncData.chosenTaskIds=ids;
  return true;
}
async function removeFromToday(id){
  if(!id)return;
  const ids=state.tasks.map(t=>t.id).filter(x=>x!==id);
  if(await updateTodaySelection(ids)){
    if(!$('sub').hidden && $('subTitle').textContent==='All Tasks')showPage('tasks');
  }
}
$('back').onclick=()=>{$('sub').hidden=true;$('menu').hidden=false;};
function showPage(page){$('sub').hidden=false;$('menu').hidden=true;const titles={tasks:'All Tasks',projects:'Projects',progress:'Progress',settings:'Settings'};$('subTitle').textContent=titles[page];let body='';
if(page==='tasks') { const selected=syncData.chosenTaskIds||[];body='<p class="info">Choose up to TWO today. No automatic task selection or Notion edits.</p>'+syncData.availableTasks.map(t=>`<label class="data choose"><input type="checkbox" data-choose="${escapeHtml(t.id)}" ${selected.includes(t.id)?'checked':''}><span>${escapeHtml(t.title)} <small>· ${escapeHtml(t.area)} / ${escapeHtml(t.status)}</small></span></label>`).join('')+'<p class="info">If the list is empty, connect your Notion integration in the README.</p>'; }
if(page==='projects')body='<p class="info">Project data will come from Notion. No duplicate task database is created locally.</p>';
if(page==='progress')body=`<div class="data">Today's focus time: ${Math.floor(focus.todaySeconds/60)} minutes (${focus.todaySeconds%60} sec)</div><div class="data">Tasks: ${state.tasks.filter(t=>t.done).length} / ${state.tasks.length} completed</div><p class="info">Recent focus sessions (stored on this device only)</p>${(focus.sessions||[]).slice(-8).reverse().map(x=>`<div class="data"><strong>${escapeHtml(x.taskTitle||'Focus')}</strong> · ${Math.floor(x.seconds/60)}m ${x.seconds%60}s · ${escapeHtml(x.date||'')}<br/><small>${escapeHtml(x.goal||'')}</small>${x.outcome?`<br/><small>Outcome: ${escapeHtml(x.outcome)}</small>`:''}</div>`).join('')}<p class="info">Timer measures elapsed focus-block time, not verified attention.</p>`;
if(page==='settings')body=`<div class="data">Notion: ${escapeHtml(syncData.syncStatus?.message||'Unknown')}</div><div class="data">State source: ${escapeHtml(state.source||'demo')}</div><button id="syncNow" class="sync-btn">Sync now</button><div class="connection-form"><h4>Notion connection</h4><label>Integration token (stored encrypted on this device)<input id="connToken" type="password" autocomplete="off" placeholder="Paste token to set or replace" /></label><label>Tasks data source ID<input id="connTasks" type="text" spellcheck="false" placeholder="32-character ID" /></label><label>Muse State page ID<input id="connState" type="text" spellcheck="false" placeholder="32-character ID" /></label><div class="connection-actions"><button id="saveConnection" class="sync-btn">Save & sync</button><button id="forgetConnection" class="sync-btn secondary">Disconnect</button></div><p class="info" id="connectionMessage">Never share your token. This app uses read-only Notion access.</p></div><p class="info">Notion data is refreshed periodically. ChatGPT does not continuously monitor conversations.</p>`;
$('subBody').innerHTML=body;
if(page==='tasks')document.querySelectorAll('[data-choose]').forEach(el=>el.addEventListener('change',async()=>{const id=el.dataset.choose;let ids=[...(syncData.chosenTaskIds||[])];if(el.checked){if(ids.length>=2){el.checked=false;return;}ids.push(id);}else ids=ids.filter(x=>x!==id);el.disabled=true;const ok=await updateTodaySelection(ids);if(!ok)el.checked=!el.checked;showPage('tasks');}));
if(page==='settings'){
 const b=$('syncNow');if(b)b.onclick=async()=>{if(window.MuseDesktop){syncData=await window.MuseDesktop.syncNow();showPage('settings');}};
 if(window.MuseDesktop?.getConnection)window.MuseDesktop.getConnection().then(c=>{if($('connTasks'))$('connTasks').value=c.tasksId||'';if($('connState'))$('connState').value=c.stateId||'';});
 const save=$('saveConnection');if(save)save.onclick=async()=>{save.disabled=true;try{const out=await window.MuseDesktop.saveConnection({token:$('connToken').value,tasksId:$('connTasks').value,stateId:$('connState').value});syncData=out.sync;$('connToken').value='';showPage('settings');}catch(err){$('connectionMessage').textContent=err.message||'Connection failed';}finally{save.disabled=false;}};
 const forget=$('forgetConnection');if(forget)forget.onclick=async()=>{if(!confirm('Disconnect Notion on this computer?'))return;await window.MuseDesktop.forgetConnection();showPage('settings');};
}
}
document.querySelectorAll('[data-page]').forEach(el=>el.onclick=()=>showPage(el.dataset.page));
if(window.MuseDesktop){window.MuseDesktop.getState().then(v=>{state=v;render();});window.MuseDesktop.getFocus().then(v=>{focus=v;renderFocus();});window.MuseDesktop.onFocus(v=>{focus=v;renderFocus();});window.MuseDesktop.getSync().then(v=>{syncData=v;});window.MuseDesktop.onSync(v=>{syncData=v;});window.MuseDesktop.onState(v=>{state=v;render();});window.MuseDesktop.onExpanded(v=>{expanded=v;$('panel').hidden=!v;});}else{window.MusePreview={receiveState(payload){if(!payload||!moods[payload.mood])return false;state={...state,...payload};render();return true;}};}
render();

setInterval(()=>{if($('clockNow'))$('clockNow').textContent=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});},30000);
