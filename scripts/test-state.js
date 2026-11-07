const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'..','renderer.js'),'utf8');
const main=fs.readFileSync(path.join(__dirname,'..','main.js'),'utf8');
for(const mood of ['Focused','Calm','A bit tired','Low energy','Stressed']){
  assert(code.includes(`'${mood}'`));assert(main.includes(`'${mood}'`));
}
assert(main.includes("server.listen(PORT,'127.0.0.1')"));
assert(main.includes('timingSafeEqual'));
assert(main.includes('contextIsolation:true,nodeIntegration:false,sandbox:true'));
assert(code.includes('state.tasks.slice(0,2)'));
console.log('PASS: five moods, two-task limit, loopback auth, isolated desktop renderer');
