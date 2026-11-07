'use strict';
// Read-only Notion adapter. Credentials stay in the main Electron process.

const MOODS = new Set(['Focused','Calm','A bit tired','Low energy','Stressed']);
const API = 'https://api.notion.com/v1';
function richText(prop) { return (prop?.rich_text||[]).map(x=>x.plain_text||x.text?.content||'').join(''); }
async function notion(path, cfg, opts={}) {
  const token = cfg.token;
  if(!token) throw new Error('Notion not configured: set MUSE_NOTION_TOKEN');
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
  try {
    const response=await fetch(`${API}${path}`,{method:opts.method||'GET',body:opts.body?JSON.stringify(opts.body):undefined,headers:{Authorization:`Bearer ${token}`,'Notion-Version':'2025-09-03','Content-Type':'application/json'},signal:controller.signal});
    const value=await response.json();
    if(!response.ok) throw new Error(`Notion HTTP ${response.status}: ${value.message||'request failed'}`);
    return value;
  } finally {clearTimeout(timeout);}
}
async function readMood(cfg) {
  if(!cfg.stateId) throw new Error('Set Muse State page ID');
  const page=await notion(`/pages/${cfg.stateId}`,cfg);
  const mood=page.properties?.Mood?.select?.name;
  return {mood:MOODS.has(mood)?mood:null, context:richText(page.properties?.Context), observedAt:page.properties?.['Observed At']?.date?.start||null, pageUrl:page.url};
}
async function readTasks(cfg) {
  if(!cfg.tasksId) throw new Error('Set Tasks data source ID');
  const result=await notion(`/data_sources/${cfg.tasksId}/query`,cfg,{method:'POST',body:{page_size:100,sorts:[{timestamp:'last_edited_time',direction:'descending'}]}});
  return result.results.map(p=>({id:p.id, title:(p.properties?.Task?.title||[]).map(v=>v.plain_text||v.text?.content||'').join('').slice(0,120), status:p.properties?.Status?.status?.name||'', area:p.properties?.Area?.select?.name||'', deadline:p.properties?.Deadline?.date?.start||null, url:p.url})).filter(t=>t.title&&t.status!=='Done');
}
module.exports={readMood,readTasks};
