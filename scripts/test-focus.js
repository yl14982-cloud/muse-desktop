'use strict';
const assert=require('node:assert/strict');
const {createFocus,accumulated,snapshot,DURATION_SECONDS}=require('../focus-store');
const f=createFocus();assert.equal(DURATION_SECONDS,3000);assert.equal(snapshot(f).remainingSeconds,3000);
f.mode='running';f.startedAt=1000;assert.equal(accumulated(f,51000),50);
f.elapsedSeconds=50;f.startedAt=null;f.mode='paused';assert.equal(accumulated(f,99000),50);
f.mode='running';f.startedAt=99000;assert.equal(accumulated(f,109000),60);
assert.equal(accumulated(f,9999999),3000);
console.log('Focus timer pure helper tests passed');
