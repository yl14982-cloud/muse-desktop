'use strict';
const {randomUUID} = require('node:crypto');
const MOODS = ['Focused', 'Calm', 'A bit tired', 'Low energy', 'Stressed'];

function createStore(saved = null, legacy = {}, configured = false, selected = []) {
  const s = saved || {localTasks:[], notionTasks:legacy.source?.startsWith('Notion') ? legacy.tasks || [] : [], selectedIds:legacy.source?.startsWith('Notion') ? selected : [], mood:legacy.mood || 'Calm', moodSource:configured ? 'notion' : 'manual', notionEnabled:configured};
  const localTasks = (Array.isArray(s.localTasks) ? s.localTasks : []).filter(t => typeof t.id === 'string' && t.id.startsWith('local-') && typeof t.title === 'string' && t.title.trim()).map(t => ({id:t.id,title:t.title.slice(0,120),done:!!t.done,origin:'local',createdAt:t.createdAt || null}));
  const notionTasks = (Array.isArray(s.notionTasks) ? s.notionTasks : []).filter(t => typeof t.id === 'string' && !t.id.startsWith('local-') && typeof t.title === 'string').map(t => ({...t,done:!!t.done,origin:'notion'}));
  const result={version:1,localTasks,notionTasks,selectedIds:[...new Set(Array.isArray(s.selectedIds) ? s.selectedIds.filter(id => typeof id === 'string') : [])].slice(0,2),mood:MOODS.includes(s.mood) ? s.mood : 'Calm',moodSource:s.moodSource === 'notion' ? 'notion' : 'manual',notionEnabled:!!s.notionEnabled,updatedAt:s.updatedAt || null};
  const known=new Set(allTasks(result).map(t=>t.id));result.selectedIds=result.selectedIds.filter(id=>known.has(id));
  return result;
}
function allTasks(s) { return [...s.localTasks,...(s.notionEnabled ? s.notionTasks : [])]; }
function todayTasks(s) { const known=new Map(allTasks(s).map(t => [t.id,t]));return s.selectedIds.map(id=>known.get(id)).filter(Boolean).map(t=>({...t})); }
function selectTasks(s,ids) {
  if(!Array.isArray(ids) || ids.length>2 || ids.some(id=>typeof id!=='string')) throw Error('Choose up to two tasks');
  const unique=[...new Set(ids)], known=new Set(allTasks(s).map(t=>t.id));
  if(unique.some(id=>!known.has(id)))throw Error('Task is no longer available');
  s.selectedIds=unique;
}
function addLocal(s,title) {
  if(typeof title!=='string' || !title.trim())throw Error('Enter a task name');
  if(title.trim().length>120)throw Error('Task names can contain up to 120 characters');
  const task={id:'local-'+randomUUID(),title:title.trim(),done:false,origin:'local',createdAt:new Date().toISOString()};
  s.localTasks.push(task);return task;
}
function toggleLocal(s,id) {
  const task=s.localTasks.find(t=>t.id===id);
  if(!task)throw Error('Only local tasks can be completed in Muse. Update connected tasks in Notion.');
  task.done=!task.done;return task;
}
function replaceNotion(s,tasks) {
  s.notionTasks=tasks.filter(t=>typeof t.id==='string' && !t.id.startsWith('local-')).map(t=>({...t,done:t.status==='Done',origin:'notion'}));
  const known=new Set(allTasks(s).map(t=>t.id));
  s.selectedIds=s.selectedIds.filter(id=>known.has(id));
}
function enableNotion(s,enabled) {
  s.notionEnabled=!!enabled;
  if(!enabled){s.selectedIds=s.selectedIds.filter(id=>s.localTasks.some(t=>t.id===id));s.moodSource='manual';}
}
function setMood(s,mood) {if(!MOODS.includes(mood))throw Error('Choose a supported mood');s.mood=mood;s.moodSource='manual';}
module.exports={createStore,allTasks,todayTasks,selectTasks,addLocal,toggleLocal,replaceNotion,enableNotion,setMood,MOODS};
