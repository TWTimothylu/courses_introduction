(() => {
const form=document.getElementById('trial-form'), button=document.getElementById('submit-button'), error=document.getElementById('form-error'), dialog=document.getElementById('success-dialog');
const live=!!(window.google && google.script && google.script.run);
let token='', requestId=crypto.randomUUID(), busy=false, completed=false;
const startedAt=Date.now();
const names={essential:'簡易樂高機器人班',prime:'樂高機器人班',scratch:'Scratch 程式班','robot-python':'樂高機器人 Python 班',python:'Python 程式班',unsure:'由老師推薦課程'};
const initial=window.INITIAL_COURSE||new URLSearchParams(location.search).get('course');
if(names[initial])form.elements.course.value=initial;
if(live){
document.getElementById('preview-notice').hidden=true;
button.textContent='準備報名表…';button.disabled=true;
google.script.run.withSuccessHandler(t=>{token=t;button.disabled=false;button.textContent='送出體驗報名 →';}).withFailureHandler(()=>{error.hidden=false;error.textContent='報名表暫時無法連線，請重新整理，或透過官方 LINE 聯絡我們。';}).getFormToken();
}
form.elements.grade.addEventListener('change',()=>{
const grade=Number(form.elements.grade.value);
document.getElementById('course-hint').textContent=grade<=3?'1–3 年級可從簡易樂高機器人開始；不確定也能請老師推薦。':grade<=5?'3–7 年級可探索樂高機器人或 Scratch。':grade<=7?'這個年級可探索機器人、Scratch 或 Python；老師會協助確認。':'6–12 年級可探索 Python 或樂高機器人 Python。';
});
form.addEventListener('change',()=>{if(form.querySelector('input[name=preferredTimes]:checked'))document.getElementById('time-error').hidden=true;});
function showReceipt(result,data){
completed=live;error.hidden=true;
document.getElementById('success-badge').textContent=live?'報名已收到':'完成畫面預覽・未實際送出';
document.getElementById('receipt-message').textContent=live?
'已收到 '+data.childName+' 的體驗意願（編號 '+result.registrationId+'）。'+(result.emailStatus==='sent'?'確認信已寄至 '+data.email+'，也請留意垃圾郵件匣。':'確認信將寄至 '+data.email+'；您可以先加入 LINE 聯絡我們。'):
'這是送出後的畫面示範，資料未寫入試算表，也沒有寄出確認信。正式啟用後，會在這裡顯示報名編號與寄信結果。';
document.getElementById('line-copy-text').textContent='您好，我已填寫體驗課報名。孩子姓名：'+data.childName+'；想體驗：'+names[data.course]+'。請協助安排，謝謝！';
dialog.showModal();
if(live){button.textContent='報名已收到';button.disabled=true;}
}
form.addEventListener('submit',event=>{
event.preventDefault();if(busy||completed)return;
error.hidden=true;
const times=Array.from(form.querySelectorAll('input[name=preferredTimes]:checked')).map(el=>el.value);
if(!times.length){document.getElementById('time-error').hidden=false;form.querySelector('input[name=preferredTimes]').focus();return;}
const data=Object.fromEntries(new FormData(form));data.preferredTimes=times;data.consent=form.elements.consent.checked;
data.phone=data.phone.replace(/[ -]/g,'');data.email=data.email.trim().toLowerCase();
if(!/^(09\d{8}|\+8869\d{8})$/.test(data.phone)){error.hidden=false;error.textContent='請確認手機號碼，例：0912-345-678。';form.elements.phone.focus();return;}
Object.assign(data,{submissionId:requestId,token,startedAt,privacyVersion:'2026-09-26-v1',source:'體驗課報名頁'});
if(!live){showReceipt({},data);return;}
busy=true;button.disabled=true;button.textContent='正在送出，請稍候…';
google.script.run.withSuccessHandler(result=>{
busy=false;
if(result && result.ok){showReceipt(result,data);}
else {button.disabled=false;button.textContent='重新送出體驗報名 →';error.hidden=false;error.textContent=result?.message||'暫時無法完成報名，請稍後再試或加入 LINE 聯絡我們。';}
}).withFailureHandler(()=>{
busy=false;button.disabled=false;button.textContent='重新送出體驗報名 →';error.hidden=false;error.textContent='連線中斷，尚未確認是否送出成功。請使用本頁重新送出；系統會依報名編號避免重複登記。';
}).submitApplication(data);
});
dialog.querySelectorAll('.close,.dismiss').forEach(el=>el.addEventListener('click',()=>dialog.close()));
document.getElementById('copy-message').addEventListener('click',async()=>{
const status=document.getElementById('copy-status');
try{await navigator.clipboard.writeText(document.getElementById('line-copy-text').textContent);status.textContent='已複製，加入 LINE 後貼上即可。';}catch{status.textContent='請長按或選取上方文字，手動複製到 LINE。';}
});
})();