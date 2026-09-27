import fs from 'node:fs/promises';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const code=await fs.readFile(new URL('./Code.gs',import.meta.url),'utf8');
let rows=[],sent=[],failMail=false,failRecord=false;
const range=(r,c,n=1,m=1)=>({getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>rows[r+i-1]?.[c+j-1]??'')),setFontWeight(){return this;},setBackground(){return this;},setNumberFormat(){return this;},setValue(v){return this.setValues([[v]]);},setValues(v){if(failRecord&&v[0][0]==='已寄出')throw Error('storage unavailable');for(let i=0;i<v.length;i++){rows[r+i-1]??=[];for(let j=0;j<v[i].length;j++)rows[r+i-1][c+j-1]=v[i][j];}return this;}});
const sheet={getMaxRows:()=>1000,setColumnWidth(){},getRange:range,getLastRow:()=>rows.length,appendRow:r=>rows.push(r)};
const cache=new Map();
const ctx=vm.createContext({Date,console,Session:{getEffectiveUser:()=>({getEmail:()=> 'teacher_lu@creativstacks.info'})},PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'test-sheet'})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush(){}},CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v),remove:k=>cache.delete(k)})},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},Utilities:{getUuid:()=>crypto.randomUUID(),formatDate:(d,t,f)=>f==='yyyyMMdd'?'20260926':'2026-09-26',DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(a,s)=>Array.from(crypto.createHash(a).update(s).digest())},MailApp:{getRemainingDailyQuota:()=>100,sendEmail:m=>{if(failMail)throw Error('mail temporarily unavailable');sent.push(m);}}});
ctx.ContentService={MimeType:{JSON:'application/json'},createTextOutput:text=>({text,setMimeType(){return this;}})};
vm.runInContext(code,ctx);rows=[vm.runInContext('HEADERS',ctx)];
function data(){let token=crypto.randomUUID();cache.set('form:'+token,String(Date.now()-3000));return {childName:'測試小方',grade:3,school:'測試國小',course:'scratch',parentName:'測試家長',phone:'0900000000',email:'preview@example.invalid',experience:'沒有，想第一次試試',preferredTimes:['週六上午'],consent:true,privacyVersion:'2026-09-26-v1',submissionId:crypto.randomUUID(),token};}
const a=data();a.referrer="王小明的媽媽";const first=ctx.submitApplication(a);assert.equal(first.ok,true);assert.equal(first.emailStatus,'sent');assert.equal(rows.length,2);assert.equal(sent.length,1);assert.equal(rows[1][25],"王小明的媽媽");assert.equal(ctx.validate_(data()).referrer,"");assert.throws(()=>ctx.validate_({...data(),referrer:"字".repeat(81)}));
assert.equal(ctx.submitApplication(a).registrationId,first.registrationId);assert.equal(rows.length,2);assert.equal(sent.length,1);
assert.equal(ctx.submitApplication({...a,childName:'changed'}).ok,false);
assert.equal(ctx.submitApplication({...data(),consent:false}).ok,false);
assert.equal(ctx.submitApplication({...data(),phone:'bad'}).ok,false);
assert.equal(ctx.submitApplication({...data(),preferredTimes:[]}).ok,false);
assert.equal(ctx.submitApplication({...data(),course:'unknown'}).ok,false);
assert.equal(ctx.cell_('=SUM(1,2)'),"'=SUM(1,2)");
failMail=true;const b=data();b.email='retry@example.invalid';assert.equal(ctx.submitApplication(b).emailStatus,'pending');assert.equal(rows[2][18],'待重試');failMail=false;ctx.processMailQueue();assert.equal(rows[2][18],'已寄出');
failRecord=true;const c=data();c.email='uncertain@example.invalid';assert.equal(ctx.submitApplication(c).emailStatus,'pending');assert.equal(rows[3][18],'寄送中');const count=sent.length;failRecord=false;ctx.processMailQueue();assert.equal(sent.length,count);
rows[3][24]=new Date(Date.now()-1000000);ctx.processMailQueue();assert.equal(rows[3][18],'待人工確認');assert.equal(sent.length,count);
const escaped=ctx.mailForRow_([...rows[1].slice(0,2),'<script>',...rows[1].slice(3)]);assert.ok(escaped.htmlBody.includes('&lt;script&gt;'));assert.ok(!escaped.htmlBody.includes('<script>'));
await fs.writeFile(new URL('../dist/email-preview.html',import.meta.url),'<meta charset="utf-8"><title>確認信設計預覽</title><p style="text-align:center;font-family:Arial">設計預覽・此信未寄出</p>'+ctx.mailForRow_(rows[1]).htmlBody);
console.log('PASS: validation, consent, duplicate prevention, durable save, retry, uncertain-send protection, HTML escaping. No external mail sent.');

assert.equal(JSON.parse(ctx.doPost({postData:{contents:JSON.stringify({action:'token'})}}).text).ok,true);
assert.equal(JSON.parse(ctx.doPost({postData:{contents:'{invalid'}}).text).ok,false);
assert.equal(JSON.parse(ctx.doPost({postData:{contents:JSON.stringify({action:'submit',data:{consent:false}})}}).text).ok,false);
assert.equal(ctx.cell_('0900000000'),"'0900000000");
console.log('PASS: JSON transport validation and telephone preservation.');

const existing=rows.slice(1).map(r=>r.slice()); rows[0]=rows[0].slice(0,25);ctx.updateRegistrationFields();assert.equal(rows[0][25],"推薦人");assert.deepEqual(rows.slice(1),existing);console.log("PASS: existing Sheet migration preserves registration rows.");
