/** Server-side bot checks; math challenges are retired. */
function verifyChallenge_(v){
 if(v.website!=='')throw Error('無法受理此報名，請透過 LINE 聯絡老師。');
 verifyRecaptcha_(v.recaptchaToken);
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
