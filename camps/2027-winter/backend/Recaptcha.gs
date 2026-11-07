/** Never put the secret in source, logs, HTML, or public responses. */
function verifyRecaptcha_(token){
 if(typeof token!=='string'||!token.trim()||token.length>4096)throw Error('請先完成「我不是機器人」驗證。');
 const secret=PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET_KEY');
 if(!secret)throw Error('驗證服務尚未就緒，請透過 LINE 聯絡老師。');
 let result;
 try{
  const response=UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify',{method:'post',payload:{secret:secret,response:token},muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw Error();
  result=JSON.parse(response.getContentText());
 }catch(ignore){throw Error('驗證服務暫時無法連線，請重新驗證後再試，或透過 LINE 聯絡老師。');}
 if(result.success!==true||!['www.creativstacks.info','creativstacks.info'].includes(result.hostname))throw Error('驗證未通過或已過期，請重新勾選「我不是機器人」。');
}
/** Manual read-only connectivity check: no registration, no mail, no secret output. */
function checkRecaptchaConnection(){
 const secret=PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET_KEY');
 if(!secret)throw Error('Missing reCAPTCHA configuration');
 const r=UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify',{method:'post',payload:{secret:secret,response:'invalid-connectivity-probe'},muteHttpExceptions:true});
 const body=JSON.parse(r.getContentText());
 if(r.getResponseCode()!==200||(body['error-codes']||[]).some(c=>c==='invalid-input-secret'||c==='missing-input-secret'))throw Error('reCAPTCHA connection/configuration failed');
 console.log('reCAPTCHA connection ready; invalid probe rejected: '+(body.success===false));
}
