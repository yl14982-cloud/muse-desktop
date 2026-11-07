'use strict';
const moods={
  'Focused':{caption:'One thing at a time ✦',kind:'focused'},
  'Calm':{caption:'Feeling steady · Take your time',kind:'calm'},
  'A bit tired':{caption:'Lower energy · Go gently ♡',kind:'tired'},
  'Low energy':{caption:'Rest is allowed ♡',kind:'low'},
  'Stressed':{caption:'One small step is enough ♡',kind:'stressed'}
};
const $=id=>document.getElementById(id);
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let state={mood:'Calm',tasks:[],source:'Local mood'};
let syncData={availableTasks:[],chosenTaskIds:[],notionEnabled:false,moodSource:'manual',syncStatus:{ok:true,message:'Local mode · No account needed'}};
let focus={mode:'idle',durationSeconds:3000,elapsedSeconds:0,remainingSeconds:3000,todaySeconds:0,taskId:null,taskTitle:'',goal:'',feedback:[],outcome:'',sessions:[]};
let expanded=false,activePage=null,focusDetailsOpen=false;
const fmtTime=s=>`${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.floor(Math.max(0,s)%60)).padStart(2,'0')}`;
function showError(error){$('appMessage').textContent=error.message||String(error);}
function clearError(){$('appMessage').textContent='';}
function applySync(value){syncData=value;state=value.state;render();if(activePage==='tasks')renderTaskList();if(activePage==='settings')updateSyncStatus();}
async function refresh(){if(window.MuseDesktop)applySync(await window.MuseDesktop.getSync());}
function renderFocus(){
  $('clockNow').textContent=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  $('miniTimer').textContent='◷ '+fmtTime(focus.remainingSeconds);
  $('miniTimer').classList.toggle('active',focus.mode==='running');
  $('timerText').textContent=fmtTime(focus.remainingSeconds);
  $('focusTask').textContent=focus.taskTitle||'Choose a task clock to start';
  $('focusMode').textContent=focus.mode==='running'?'Running':focus.mode==='paused'?'Paused':focus.mode==='finished'?'Finished':'Idle';
  $('focusToggle').textContent=focus.mode==='running'?'Ⅱ Pause':focus.mode==='paused'?'▶ Resume':'▶ Start';
  $('focusToggle').disabled=!['running','paused'].includes(focus.mode)&&!state.tasks.some(t=>!t.done);
  $('focusToday').textContent=`Focused today: ${Math.floor(focus.todaySeconds/60)}m ${focus.todaySeconds%60}s`;
  if(document.activeElement!==$('focusGoal'))$('focusGoal').value=focus.goal||'';
  if(document.activeElement!==$('focusOutcome'))$('focusOutcome').value=focus.outcome||'';
}
async function focusDo(action,payload){if(!window.MuseDesktop)return;try{clearError();focus=await window.MuseDesktop.focusAction(action,payload);renderFocus();}catch(e){showError(e);}}
async function clickClock(taskId){
  if(['running','paused'].includes(focus.mode)&&taskId&&focus.taskId!==taskId){showError(new Error('Pause and reset to save the current session before switching tasks.'));return;}
  if(focus.mode==='running')return focusDo('pause');
  if(focus.mode==='paused')return focusDo('start');
  const task=state.tasks.find(t=>t.id===taskId&&!t.done)||state.tasks.find(t=>!t.done);
  if(!task){await expand(true);showPage('tasks');$('newTaskTitle')?.focus();return;}
  await focusDo('start',{taskId:task.id,goal:$('focusGoal').value});
}
function cat(mood){let kind=(moods[mood]||moods.Calm).kind,open=['focused','stressed'].includes(kind),sleepy=['tired','low'].includes(kind);
const eyes=open?'<circle cx="54" cy="66" r="2.8" fill="#736879"/><circle cx="83" cy="66" r="2.8" fill="#736879"/>':'<path d="M48 65q6 7 12 0M77 65q6 7 12 0" fill="none" stroke="#726777" stroke-width="2.05" stroke-linecap="round"/>';
const brows=kind==='stressed'?'<path d="M44 58l10 -5M84 53l10 5" stroke="#756980" stroke-width="2.05" stroke-linecap="round"/>':'';
const sparkle=kind==='focused'?'<path d="M18 25l-4 -8M116 25l6 -8" stroke="#e5a65d" stroke-width="3" stroke-linecap="round"/>':sleepy?'<text x="17" y="26" fill="#8a8fbb" font-size="15" font-weight="700">z</text><text x="7" y="12" fill="#8a8fbb" font-size="11" font-weight="700">z</text>':'';
return `<svg class="cat" viewBox="0 0 140 102" aria-hidden="true">${sparkle}<path d="M32 49Q33 33 46 30L54 35Q69 28 83 35L94 30Q110 37 110 52Q120 64 111 80Q102 93 69 92Q34 93 26 81Q19 67 32 49Z" fill="#fff5ef" stroke="#afa2bd" stroke-width="2.05" stroke-linejoin="round"/><path d="M33 78q-12 0-10 9q4 9 17 5M100 78q13 0 15 9q-3 9-18 5" fill="#fff5ef" stroke="#afa2bd" stroke-width="1.95" stroke-linecap="round"/>${brows}${eyes}<ellipse cx="41" cy="75" rx="8" ry="4.3" fill="#f5b4b7" opacity=".64"/><ellipse cx="98" cy="75" rx="8" ry="4.3" fill="#f5b4b7" opacity=".64"/><path d="M65 74q4 5 8 0" fill="none" stroke="#726777" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}
function render(){
  const mood=moods[state.mood]?state.mood:'Calm';
  $('miniCat').innerHTML=cat(mood);$('bigCat').innerHTML=cat(mood);$('miniMood').textContent=mood;
  $('taskCount').textContent=`✦ ${state.tasks.length}`;$('bigMood').textContent=mood;$('caption').textContent=moods[mood].caption;
  $('modeLabel').textContent=syncData.notionEnabled?'Local tasks + Notion':'Local mode · No account needed';
  $('moodSelect').value=mood;
  $('moodHelp').textContent=syncData.moodSource==='notion'?'Reading mood from Notion. Choosing here switches to manual.':'Your choice · Saved on this device';
  $('briefTasks').innerHTML=state.tasks.slice(0,2).map((t,i)=>`<div class="brief-task ${t.done?'done':''}"><span class="num">${i+1}</span><span class="txt">${escapeHtml(t.title)}</span><button class="clock-btn" data-clock="${escapeHtml(t.id)}" ${t.done?'disabled':''} title="Start / pause focus" aria-label="Focus timer">◷</button></div>`).join('')||'<button id="firstTask" class="empty-task">+ Add your first task</button>';
  $('detailTasks').innerHTML=state.tasks.slice(0,2).map(t=>`<div class="task ${t.done?'done':''}">${t.origin==='local'?`<button class="check" data-complete="${escapeHtml(t.id)}" aria-label="${t.done?'Reopen':'Complete'} ${escapeHtml(t.title)}" aria-pressed="${t.done}">${t.done?'✓':''}</button>`:'<span class="today-dot" title="Managed in Notion"></span>'}<span class="tasklabel">${escapeHtml(t.title)}<small class="origin">${t.origin==='notion'?'Notion · read only':'Local'}</small></span><button class="remove-today" data-remove-today="${escapeHtml(t.id)}" aria-label="Remove ${escapeHtml(t.title)} from Today" title="Back to All Tasks">×</button></div>`).join('')||'<p class="info">Add a local task below. No account or connection needed.</p>';
  $('todayTitle').textContent=`Today's Tasks (${state.tasks.length}/2)`;
  document.querySelectorAll('[data-clock]').forEach(el=>el.onclick=e=>{e.stopPropagation();clickClock(el.dataset.clock);});
  document.querySelectorAll('[data-complete]').forEach(el=>el.onclick=()=>toggleTask(el.dataset.complete));
  document.querySelectorAll('[data-remove-today]').forEach(el=>el.onclick=()=>chooseTasks(state.tasks.filter(t=>t.id!==el.dataset.removeToday).map(t=>t.id)));
  if($('firstTask'))$('firstTask').onclick=async e=>{e.stopPropagation();await expand(true);showPage('tasks');$('newTaskTitle').focus();};
  $('date').textContent=new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}).format(new Date());
  renderFocus();
}
async function expand(flag){expanded=flag;$('panel').hidden=!flag;if(window.MuseDesktop)await window.MuseDesktop.expand(flag);}
async function chooseTasks(ids){try{clearError();await window.MuseDesktop.chooseTasks(ids);await refresh();}catch(e){showError(e);}}
async function toggleTask(id){try{clearError();await window.MuseDesktop.toggleTask(id);await refresh();}catch(e){showError(e);}}
function renderTaskList(){
  const target=$('taskList');if(!target)return;
  const selected=syncData.chosenTaskIds||[];
  const section=(title,tasks)=>`<h4>${title}</h4>`+(tasks.map(t=>`<div class="data task-row ${t.done?'completed-row':''}"><label class="choose"><input type="checkbox" data-choose="${escapeHtml(t.id)}" ${selected.includes(t.id)?'checked':''} aria-label="Select ${escapeHtml(t.title)} for Today"><span>${escapeHtml(t.title)}<small class="origin">${t.origin==='local'?'Local':`Notion · ${escapeHtml(t.status)}`}</small></span></label>${t.origin==='local'?`<button class="small-action" data-toggle="${escapeHtml(t.id)}">${t.done?'Reopen':'Complete'}</button>`:''}</div>`).join('')||'<p class="info">Nothing here yet.</p>');
  const all=syncData.availableTasks||[];
  target.innerHTML=section('Local tasks',all.filter(t=>t.origin==='local'&&!t.done))+section('Completed locally',all.filter(t=>t.origin==='local'&&t.done))+(syncData.notionEnabled?section('From Notion · read only',all.filter(t=>t.origin==='notion')):'<p class="info">Notion is optional. Connect it later in Settings if you want sync.</p>');
  target.querySelectorAll('[data-choose]').forEach(el=>el.onchange=async()=>{
    const ids=[...selected];if(el.checked){if(ids.length>=2){el.checked=false;showError(new Error('Today has two tasks. Remove one before choosing another.'));return;}ids.push(el.dataset.choose);}else ids.splice(ids.indexOf(el.dataset.choose),1);
    await chooseTasks(ids);
  });
  target.querySelectorAll('[data-toggle]').forEach(el=>el.onclick=()=>toggleTask(el.dataset.toggle));
}
function updateSyncStatus(){
  if($('syncStatusText'))$('syncStatusText').textContent=syncData.syncStatus.message;
  if($('notionEnabled'))$('notionEnabled').checked=!!syncData.notionEnabled;
  if($('moodSource'))$('moodSource').value=syncData.moodSource||'manual';
  if($('syncNow'))$('syncNow').disabled=!syncData.notionEnabled;
}
function showPage(page){
  activePage=page;$('sub').hidden=false;$('menu').hidden=true;clearError();
  const titles={tasks:'All Tasks',projects:'Projects',progress:'Progress',settings:'Settings'};$('subTitle').textContent=titles[page];
  if(page==='tasks'){
    $('subBody').innerHTML='<form id="addTaskForm" class="add-task-form"><label for="newTaskTitle">New local task</label><div class="task-input-row"><input id="newTaskTitle" maxlength="120" required placeholder="What would you like to do?" autocomplete="off"><button type="submit" class="sync-btn">Add task</button></div><p class="info">Saved on this device. Choose up to two tasks for Today.</p></form><div id="taskList"></div>';
    $('addTaskForm').onsubmit=async e=>{e.preventDefault();const title=$('newTaskTitle').value;const button=e.submitter||$('addTaskForm').querySelector('button');button.disabled=true;try{clearError();await window.MuseDesktop.addTask(title);$('newTaskTitle').value='';await refresh();$('newTaskTitle').focus();}catch(err){showError(err);}finally{button.disabled=false;}};
    renderTaskList();
  }
  if(page==='projects')$('subBody').innerHTML='<p class="info">Use All Tasks for your local board. Project grouping is planned for a later release.</p>';
  if(page==='progress')$('subBody').innerHTML=`<div class="data">Focused today: ${Math.floor(focus.todaySeconds/60)}m ${focus.todaySeconds%60}s</div><p class="info">Recent sessions, stored on this device</p>${(focus.sessions||[]).slice(-8).reverse().map(s=>`<div class="data"><strong>${escapeHtml(s.taskTitle||'Focus')}</strong> · ${Math.floor(s.seconds/60)}m ${s.seconds%60}s<br><small>${escapeHtml(s.date)} · ${escapeHtml(s.goal)}${s.outcome?` · ${escapeHtml(s.outcome)}`:''}</small></div>`).join('')}`;
  if(page==='settings'){
    $('subBody').innerHTML='<p class="info">Local tasks, completion and focus work without an account. Notion sync is optional.</p><div class="data" id="syncStatusText"></div><label class="choose data"><input id="notionEnabled" type="checkbox">Enable optional Notion sync</label><label class="field-label">Mood source<select id="moodSource"><option value="manual">My manual choice</option><option value="notion">Read from Notion</option></select></label><button id="syncNow" class="sync-btn">Sync now</button><details class="connection-form" id="connectionDetails"><summary>Set up optional Notion connection</summary><p class="info">Use your own read-only integration, Tasks data source and State row. Saving enables sync and reads mood from Notion. Local tasks remain on this device.</p><label>Integration token (encrypted on this device)<input id="connToken" type="password" autocomplete="off" placeholder="Paste to set or replace; blank keeps saved token"></label><label>Tasks data source ID<input id="connTasks" spellcheck="false" placeholder="32-character ID"></label><label>Muse State page ID<input id="connState" spellcheck="false" placeholder="32-character ID"></label><div class="connection-actions"><button id="saveConnection" class="sync-btn">Save & sync</button><button id="forgetConnection" class="sync-btn secondary">Disconnect</button></div><p class="info" id="connectionMessage">Never share your token. Chat updates require an authorized writer in Notion; Muse does not monitor conversations.</p></details>';
    updateSyncStatus();
    window.MuseDesktop.getConnection().then(c=>{if(activePage==='settings'){$('connTasks').value=c.tasksId||'';$('connState').value=c.stateId||'';}}).catch(showError);
    $('notionEnabled').onchange=async()=>{try{applySync(await window.MuseDesktop.setNotionEnabled($('notionEnabled').checked));}catch(e){showError(e);updateSyncStatus();}};
    $('moodSource').onchange=async()=>{try{applySync(await window.MuseDesktop.setMoodSource($('moodSource').value));}catch(e){showError(e);updateSyncStatus();}};
    $('syncNow').onclick=async()=>{try{applySync(await window.MuseDesktop.syncNow());}catch(e){showError(e);}};
    $('saveConnection').onclick=async()=>{const button=$('saveConnection');button.disabled=true;try{const result=await window.MuseDesktop.saveConnection({token:$('connToken').value,tasksId:$('connTasks').value,stateId:$('connState').value});$('connToken').value='';applySync(result.sync);$('connectionMessage').textContent=result.sync.syncStatus.message;}catch(e){showError(e);}finally{button.disabled=false;}};
    $('forgetConnection').onclick=async()=>{if(!confirm('Disconnect Notion? Your local tasks and focus history will remain.'))return;try{await window.MuseDesktop.forgetConnection();await refresh();showPage('settings');}catch(e){showError(e);}};
  }
}
$('mini').onclick=e=>{if(e.target.closest('button')||e.target.closest('#miniTimer')||e.target.closest('.drag'))return;expand(!expanded);};
$('mini').onkeydown=e=>{if(e.target!==$('mini'))return;if(e.key==='Enter'||e.key===' '){e.preventDefault();expand(!expanded);}};
$('collapse').onclick=()=>expand(false);
$('miniTimer').onclick=e=>{e.stopPropagation();clickClock(focus.taskId);};
$('focusToggle').onclick=()=>clickClock(focus.taskId);
$('focusReset').onclick=()=>{if(confirm('Reset this focus cycle? Elapsed time will be saved.'))focusDo('reset');};
$('focusDetailsToggle').onclick=()=>{focusDetailsOpen=!focusDetailsOpen;$('focusDetails').hidden=!focusDetailsOpen;$('focusDetailsToggle').setAttribute('aria-expanded',String(focusDetailsOpen));$('focusDetailsChevron').textContent=focusDetailsOpen?'⌃':'⌄';};
$('focusGoal').onchange=()=>focusDo('goal',{text:$('focusGoal').value});
$('saveFeedback').onclick=()=>{const text=$('focusFeedback').value.trim();if(text){focusDo('feedback',{text});$('focusFeedback').value='';}};
$('saveOutcome').onclick=()=>focusDo('outcome',{text:$('focusOutcome').value});
$('hide').onclick=e=>{e.stopPropagation();window.MuseDesktop?.hide();};
$('back').onclick=()=>{activePage=null;$('sub').hidden=true;$('menu').hidden=false;};
$('openTasks').onclick=()=>showPage('tasks');
$('moodSelect').onchange=async()=>{try{await window.MuseDesktop.setMood($('moodSelect').value);await refresh();}catch(e){showError(e);render();}};
$('miniMood').onclick=async e=>{e.stopPropagation();await expand(true);$('moodSelect').focus();};
document.querySelectorAll('[data-page]').forEach(el=>el.onclick=()=>showPage(el.dataset.page));
if(window.MuseDesktop){
  window.MuseDesktop.onState(v=>{state=v;render();});window.MuseDesktop.onSync(applySync);
  window.MuseDesktop.onFocus(v=>{focus=v;renderFocus();});
  window.MuseDesktop.onExpanded(v=>{expanded=v;$('panel').hidden=!v;});
  refresh().catch(showError);window.MuseDesktop.getFocus().then(v=>{focus=v;renderFocus();}).catch(showError);
}
render();
setInterval(renderFocus,30000);
