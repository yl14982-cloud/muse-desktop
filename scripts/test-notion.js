const assert=require('node:assert/strict');
const {readMood,readTasks}=require('../notion-sync');
const cfg={token:'test-token-only',tasksId:'test-task-source',stateId:'test-state-page'};
const calls=[];
global.fetch=async (url,opts)=>{
  calls.push({url,headers:opts.headers,method:opts.method});
  const data=url.includes('/query')?{results:[{id:'123',url:'https://notion.so/123',properties:{Task:{title:[{plain_text:'DSP review'}]},Status:{status:{name:'Ready'}},Area:{select:{name:'DSP'}},Deadline:{date:{start:'2026-11-06'}}}}]}:{url:'https://notion.so/state',properties:{Mood:{select:{name:'Focused'}},Context:{rich_text:[{plain_text:'I can concentrate.'}]},'Observed At':{date:{start:'2026-11-06T10:00:00-05:00'}}}};
  return {ok:true,json:async()=>data};
};
(async()=>{const [m,t]=await Promise.all([readMood(cfg),readTasks(cfg)]);assert.equal(m.mood,'Focused');assert.equal(m.context,'I can concentrate.');assert.equal(t.length,1);assert.equal(t[0].title,'DSP review');assert.equal(t[0].status,'Ready');assert.equal(calls.length,2);assert(calls.every(x=>x.headers['Notion-Version']==='2025-09-03'));console.log('PASS: Notion state and task parsing with mocked API');})().catch(e=>{console.error(e);process.exit(1)});
