/** Basic automated-form abuse protection. Not a replacement for managed CAPTCHA. */
function challenge_(){
 const id=Utilities.getUuid(),a=2+Math.floor(Math.random()*8),b=1+Math.floor(Math.random()*9);
 CacheService.getScriptCache().put('camp-challenge:'+id,JSON.stringify({answer:String(a+b),created:Date.now()}),1800);
 return json_({ok:true,challengeId:id,question:a+' + '+b+' = ?'});
}
function verifyChallenge_(v){
 if(v.website!==''||typeof v.challengeId!=='string'||!/^[a-f0-9-]{36}$/i.test(v.challengeId))throw Error('請重新載入驗證題目後再送出。');
 const cache=CacheService.getScriptCache(),key='camp-challenge:'+v.challengeId,raw=cache.get(key);
 if(!raw)throw Error('驗證已過期，請重新載入驗證題目。');
 const c=JSON.parse(raw);
 if(Date.now()-c.created<3000)throw Error('請稍候幾秒，再送出報名資料。');
 if(Date.now()-c.created>1800000||String(v.challengeAnswer).trim()!==c.answer){cache.remove(key);throw Error('驗證答案不正確或已過期，請重新作答。');}
}
function emailKey_(value){
 const s=String(value||'').replace(/^'/,'').trim().toLowerCase(),parts=s.split('@');
 if(parts.length===2&&['gmail.com','googlemail.com'].includes(parts[1]))return parts[0].split('+')[0].replace(/\./g,'')+'@gmail.com';
 return s;
}
function phoneKey_(value){return String(value||'').replace(/[^0-9]/g,'').replace(/^(?:886|0)/,'');}
function checkAbuse_(v,rows){
 const email=emailKey_(v.email),phone=phoneKey_(v.phone),records=rows.slice(1);
 if(records.some(r=>String(r[27])==='垃圾報名'&&emailKey_(r[16])===email))throw Error('此資料無法受理，請透過 LINE 聯絡老師協助報名。');
 const recent=records.filter(r=>Date.now()-new Date(r[1]).getTime()<3600000&&(emailKey_(r[16])===email||phoneKey_(r[15])===phone));
 if(recent.length>=3)throw Error('短時間內已有多筆資料，請透過 LINE 聯絡老師確認。');
}
