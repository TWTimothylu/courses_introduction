// Public site key only. The secret lives in each Apps Script's private properties.
const siteKey='6Ld9HhQuAAAAAAegJ30rAD5-pVXiB84MLXDyKRIi';
let apiPromise;
function loadApi(){
 if(window.grecaptcha?.render)return Promise.resolve(window.grecaptcha);
 if(apiPromise)return apiPromise;
 apiPromise=new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('驗證載入逾時')),15000);
  window.registrationCaptchaReady=()=>{clearTimeout(timer);resolve(window.grecaptcha)};
  const script=document.createElement('script');script.src='https://www.google.com/recaptcha/api.js?onload=registrationCaptchaReady&render=explicit&hl=zh-TW';script.async=true;script.defer=true;
  script.onerror=()=>{clearTimeout(timer);reject(new Error('驗證載入失敗'))};document.head.append(script);
 });
 return apiPromise;
}
export function createCaptcha(container){
 const widget=document.createElement('div'),status=document.createElement('p');
 status.setAttribute('role','status');status.style.cssText='font-size:13px;line-height:1.7;margin:10px 0;color:#526174';status.textContent='正在載入「我不是機器人」驗證…';container.append(widget,status);
 let id=null,response='';
 loadApi().then(api=>{id=api.render(widget,{sitekey:siteKey,size:container.clientWidth<304?'compact':'normal',callback:token=>{response=token;status.textContent='驗證完成，可以送出報名。'},'expired-callback':()=>{response='';status.textContent='驗證已過期，請再次勾選「我不是機器人」。'},'error-callback':()=>{response='';status.textContent='驗證連線失敗，請重新整理頁面，或透過 LINE 聯絡老師。'}});status.textContent='請在送出前勾選「我不是機器人」。';}).catch(()=>{status.textContent='驗證無法載入，請確認網路後重新整理，或透過 LINE 聯絡老師。'});
 return {token:()=>response,reset(){response='';if(id!==null){window.grecaptcha.reset(id);status.textContent='請重新勾選「我不是機器人」，再送出報名。';}}};
}
