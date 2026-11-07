import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const trial=await readFile(new URL('../registration-backend/Recaptcha.gs',import.meta.url),'utf8');
assert.equal(trial,await readFile(new URL('../camps/2027-winter/backend/Recaptcha.gs',import.meta.url),'utf8'));
let secret='test-secret',calls=0,mode='valid';
const ctx=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:()=>secret})},UrlFetchApp:{fetch:(url,options)=>{
 calls++;assert.equal(url,'https://www.google.com/recaptcha/api/siteverify');assert.equal(options.method,'post');assert.equal(options.payload.secret,secret);
 if(mode==='network')throw Error('private service details');
 return {getResponseCode:()=>mode==='http'?503:200,getContentText:()=>mode==='json'?'invalid':JSON.stringify({success:mode!=='invalid',hostname:mode==='hostname'?'attacker.example':'www.creativstacks.info'})};
}}});vm.runInContext(trial,ctx);
for(const token of [undefined,null,123,'',' ', 'x'.repeat(4097)])assert.throws(()=>ctx.verifyRecaptcha_(token),/請先完成/);
assert.equal(calls,0);secret='';assert.throws(()=>ctx.verifyRecaptcha_('token'),/尚未就緒/);assert.equal(calls,0);secret='test-secret';
assert.doesNotThrow(()=>ctx.verifyRecaptcha_('valid-token'));
for(mode of ['invalid','hostname'])assert.throws(()=>ctx.verifyRecaptcha_('token'),/未通過或已過期/);
for(mode of ['network','http','json'])assert.throws(()=>ctx.verifyRecaptcha_('token'),/暫時無法連線/);
console.log('PASS: shared CAPTCHA verifier rejects missing, malformed, invalid and wrong-host tokens; fails closed on missing secret, HTTP, network and JSON errors.');
