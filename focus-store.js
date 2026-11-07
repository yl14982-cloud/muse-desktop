'use strict';
// Pure helpers: the 50-minute timer counts wall-clock time only while running.
const DURATION_SECONDS=50*60;
const todayKey=(now=new Date())=>[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
function createFocus(){return {durationSeconds:DURATION_SECONDS,elapsedSeconds:0,startedAt:null,mode:'idle',taskId:null,taskTitle:'',goal:'',feedback:[],outcome:'',sessions:[],lastSavedAt:null};}
function accumulated(f,now=Date.now()){return Math.min(f.durationSeconds,(f.elapsedSeconds||0)+(f.mode==='running'&&Number.isFinite(f.startedAt)?Math.max(0,Math.floor((now-f.startedAt)/1000)):0));}
function snapshot(f,now=Date.now()){const elapsed=accumulated(f,now);return {...f,elapsedSeconds:elapsed,remainingSeconds:Math.max(0,f.durationSeconds-elapsed),todaySeconds:(f.sessions||[]).filter(s=>s.date===todayKey(new Date(now))).reduce((a,s)=>a+(s.seconds||0),0)+ (f.mode==='running'||f.mode==='paused'? elapsed:0)};}
module.exports={DURATION_SECONDS,todayKey,createFocus,accumulated,snapshot};
