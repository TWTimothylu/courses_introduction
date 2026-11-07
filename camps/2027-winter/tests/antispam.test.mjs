import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import crypto from 'node:crypto';
function harness(){
 const cache=new Map(),rows=[Array(36).fill('')];let clock=Date.parse('2026-11-07T00:00:00Z');
 class Clock extends Date{constructor(...v){super(...(v.length?v:[clock]))}static now(){return clock}}
 const props={REGISTRATION_OPEN:'true',CONSENT_VERSION:'test',SHEET_ID:'test'};
 const c=vm.createContext({Date:Clock,CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v),remove:k=>cache.delete(k)})},PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]})},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>({getDataRange:()=>({getValues:()=>rows}),appendRow:r=>rows.push(r)})}),flush(){}},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})},Utilities:{getUuid:()=>crypto.randomUUID(),formatDate:()=> '2026-11-07',DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,s)=>crypto.createHash('sha256').update(s).digest(),base64Encode:b=>b.toString('base64')}});
 for(const f of ['Catalog.gs','AntiSpam.gs','Code.gs'])vm.runInContext(fs.readFileSync('backend/'+f,'utf8'),c);
 const payload=()=>({requestId:crypto.randomUUID(),camp:'rc',plan:'takehome',grade:'3',child:'Alex Chen',parent:'王媽媽',phone:'0912345678',email:'test@example.com',emergencyName:'王爸爸',emergencyPhone:'0987654321',school:'',referral:'',diet:'',notes:'',experience:'none',privacy:true,rules:true,outdoor:true,ability:false,early:[],consentVersion:'test',website:''});
 const verified=()=>{const ch=c.challenge_(),secret=JSON.parse(cache.get('camp-challenge:'+ch.challengeId));clock+=4000;return {...payload(),challengeId:ch.challengeId,challengeAnswer:secret.answer}};
 const post=v=>c.doPost({postData:{contents:JSON.stringify(v)}});
 return {c,cache,rows,payload,verified,post,advance:n=>clock+=n};
}
test('reject direct submissions without verification before writing',()=>{const h=harness(),r=h.post(h.payload());assert.equal(r.saved,false);assert.equal(h.rows.length,1)});
test('reject honeypot and incorrect answers without writing',()=>{for(const patch of [{website:'https://spam.invalid'},{challengeAnswer:'99'}]){const h=harness(),r=h.post({...h.verified(),...patch});assert.equal(r.saved,false);assert.equal(h.rows.length,1)}});
test('accept international names; consume challenge; preserve idempotent retries',()=>{const h=harness(),v=h.verified(),r=h.post(v);assert.equal(r.ok,true);assert.equal(h.rows.length,2);assert.equal(h.post(v).registrationId,r.registrationId);assert.equal(h.rows.length,2);assert.equal(h.post({...v,requestId:crypto.randomUUID()}).saved,false)});
test('reject expired and premature challenges',()=>{const h=harness(),v=h.verified();h.advance(-3500);assert.equal(h.post(v).saved,false);h.advance(1800001);assert.equal(h.post(v).saved,false);assert.equal(h.rows.length,1)});
test('marked spam email blocks case, Gmail dot and plus aliases',()=>{const h=harness(),row=Array(36).fill('');row[16]='Spam.User@gmail.com';row[27]='垃圾報名';h.rows.push(row);assert.equal(h.post({...h.verified(),email:'s.p.a.m.user+new@googlemail.com'}).saved,false);assert.equal(h.rows.length,2)});
test('three registrations per hour per normalized email or phone',()=>{const h=harness();for(let i=0;i<3;i++)assert.equal(h.post(h.verified()).ok,true);assert.equal(h.post({...h.verified(),email:'another@example.com'}).saved,false);assert.equal(h.rows.length,4)});
test('notification worker skips spam without accessing recipient or sending mail',()=>{const h=harness(),row=Array(36).fill('');row[27]='垃圾報名';row[28]='待寄送';row[32]='待寄送';h.rows.push(row);assert.doesNotThrow(()=>h.c.processNotifications())});
test('phone throttling recognizes Sheets numeric phones and country prefixes',()=>{const h=harness();for(let i=0;i<3;i++){const row=Array(36).fill('');row[1]='2026-11-07T00:00:00Z';row[15]=912345678;row[16]='other@example.com';h.rows.push(row)}for(const phone of ['0912345678','+886912345678'])assert.equal(h.post({...h.verified(),phone}).saved,false)});
