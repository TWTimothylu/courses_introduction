const SETTINGS = Object.freeze({
  sender: 'teacher_lu@creativstacks.info',
  sheetName: '體驗課報名',
  lineUrl: 'https://lin.ee/7FoFpdM',
  privacyVersion: '2026-09-26-v1'
});
const HEADERS = ['報名時間','報名編號','小朋友名字','年級','學校','體驗課程','偏好時段','相關經驗','經驗補充','家長稱呼','家長手機','家長Email','其他安排需求','個資使用同意','同意條款版本','報名來源','聯絡進度','LINE已聯絡','確認信狀態','寄信時間','寄信錯誤','請求識別碼','資料指紋','寄信嘗試次數','最後嘗試時間','推薦人'];
const COURSE_NAMES = {essential:'簡易樂高機器人班',prime:'樂高機器人班',scratch:'Scratch 程式班','robot-python':'樂高機器人 Python 班',python:'Python 程式班',unsure:'由老師推薦課程'};
const TIMES = ['平日下午','平日晚上','週六上午','週六下午','週日上午','週日下午','時間彈性，可討論'];
const EXPERIENCES = ['沒有，想第一次試試','玩過樂高，尚未接觸程式','學過機器人或 Scratch','學過 Python 或其他文字程式','其他經驗'];

function doGet(e) {
  const template=HtmlService.createTemplateFromFile('Registration');
  const configuredHome=PropertiesService.getScriptProperties().getProperty('HOME_URL') || '';
  template.homeUrl=/^https:\/\//.test(configuredHome)?configuredHome:'https://www.creativstacks.info/常態課程介紹';
  template.initialCourse=Object.prototype.hasOwnProperty.call(COURSE_NAMES,e && e.parameter && e.parameter.course)?e.parameter.course:'';
  return template.evaluate().setTitle('預約免費體驗｜創意方塊機器人教室').addMetaTag('viewport','width=device-width, initial-scale=1');
}
function getFormToken(){
  const token=Utilities.getUuid();
  CacheService.getScriptCache().put('form:'+token,String(Date.now()),21600);
  return token;
}
function sheet_(){
  const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if(!id)throw new Error('尚未設定收件試算表');
  const sheet=SpreadsheetApp.openById(id).getSheetByName(SETTINGS.sheetName);
  if(!sheet)throw new Error('找不到報名工作表');
  const headers=sheet.getRange(1,1,1,HEADERS.length).getValues()[0];
  // Add the optional field after existing columns without shifting mail/status indexes.
  if(headers[25]==='' && JSON.stringify(headers.slice(0,25))===JSON.stringify(HEADERS.slice(0,25))){
    sheet.getRange(1,26).setValue('推薦人');
    sheet.getRange(1,26).setFontWeight('bold').setBackground('#eef0f3');
    sheet.setColumnWidth(26,240);
    sheet.getRange(2,26,sheet.getMaxRows()-1,1).setNumberFormat('@');
    headers[25]='推薦人';
  }
  if(JSON.stringify(headers)!==JSON.stringify(HEADERS))throw new Error('報名表欄位已變更，請聯絡管理者');
  return sheet;
}
function assertSender_(){
  if(Session.getEffectiveUser().getEmail().toLowerCase()!==SETTINGS.sender)throw new Error('請使用 '+SETTINGS.sender+' 執行與部署');
}
function setup(){
  assertSender_();
  const sheet=sheet_();
  sheet.setFrozenRows(1);
  sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#eef0f3').setWrap(true);
  sheet.setRowHeight(1,42);
  sheet.setColumnWidths(1,HEADERS.length,150);
  sheet.setColumnWidth(6,230);sheet.setColumnWidth(7,260);sheet.setColumnWidth(12,250);
  sheet.setColumnWidth(9,260);sheet.setColumnWidth(13,260);
  // Plain-text input columns preserve telephone zeroes and prevent formulas.
  if(sheet.getMaxRows()>1)sheet.getRange(2,3,sheet.getMaxRows()-1,14).setNumberFormat('@');
  if(!sheet.getFilter())sheet.getRange(1,1,sheet.getMaxRows(),HEADERS.length).createFilter();
  const statuses=SpreadsheetApp.newDataValidation().requireValueInList(['待聯絡','已聯絡','已安排','已體驗','已取消'],true).setAllowInvalid(false).build();
  sheet.getRange(2,17,sheet.getMaxRows()-1,1).setDataValidation(statuses);
  sheet.getRange(2,18,sheet.getMaxRows()-1,1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='processMailQueue'))ScriptApp.newTrigger('processMailQueue').timeBased().everyMinutes(5).create();
  return '收件表與寄信排程已設定；請部署為以自己身分執行的網頁應用程式。';
}
function text_(value,max,required){
  if(typeof value!=='string'){if(required)throw new Error('請完成所有必填欄位');return '';}
  const s=value.trim();
  if((required&&!s)||s.length>max||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s))throw new Error('欄位內容無效或過長');
  return s;
}
function validate_(raw){
  if(!raw||typeof raw!=='object'||raw.website)throw new Error('無法接受這份報名');
  if(raw.consent!==true||raw.privacyVersion!==SETTINGS.privacyVersion)throw new Error('請閱讀並同意個人資料使用說明');
  const d={
    childName:text_(raw.childName,40,true),grade:Number(raw.grade),school:text_(raw.school,80,true),
    course:text_(raw.course,40,true),parentName:text_(raw.parentName,40,true),
    phone:text_(raw.phone,20,true).replace(/[ -]/g,''),email:text_(raw.email,160,true).toLowerCase(),
    experience:text_(raw.experience,80,true),experienceNotes:text_(raw.experienceNotes,500,false),notes:text_(raw.notes,800,false),referrer:text_(raw.referrer,80,false),
    submissionId:text_(raw.submissionId,50,true),token:text_(raw.token,50,true)
  };
  if(!Number.isInteger(d.grade)||d.grade<1||d.grade>12)throw new Error('請選擇有效年級');
  if(!Object.prototype.hasOwnProperty.call(COURSE_NAMES,d.course)||!EXPERIENCES.includes(d.experience))throw new Error('請選擇有效課程與經驗');
  if(!/^(09\d{8}|\+8869\d{8})$/.test(d.phone))throw new Error('請確認家長手機號碼');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)||/[\r\n]/.test(d.email))throw new Error('請確認 Email 格式');
  if(!/^[0-9a-f-]{36}$/i.test(d.submissionId)||!/^[0-9a-f-]{36}$/i.test(d.token))throw new Error('報名連線已失效，請重新整理');
  if(!Array.isArray(raw.preferredTimes)||!raw.preferredTimes.length||raw.preferredTimes.length>TIMES.length||raw.preferredTimes.some(t=>!TIMES.includes(t)))throw new Error('請選擇偏好時段');
  d.preferredTimes=TIMES.filter(t=>raw.preferredTimes.includes(t));
  return d;
}
function fingerprint_(d){
  const {token,submissionId,...content}=d;
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(content)).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
}
function cell_(s){return typeof s==='string'&&/^(?:[=+\-@]|0\d)/.test(s)?"'"+s:s;}
function submitApplication(raw){
  let d;
  try{assertSender_();d=validate_(raw);}catch(e){return {ok:false,message:e.message};}
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(15000))return {ok:false,message:'目前有其他報名正在處理，請稍後再試。'};
  let result;
  try{
    const sheet=sheet_(), fingerprint=fingerprint_(d), count=sheet.getLastRow()-1;
    const rows=count>0?sheet.getRange(2,1,count,HEADERS.length).getValues():[];
    const previous=rows.find(r=>r[21]===d.submissionId);
    if(previous){
      if(previous[22]!==fingerprint)return {ok:false,message:'這份報名已收件。若要更正資料，請加入 LINE 聯絡我們。'};
      return {ok:true,registrationId:previous[1],emailStatus:previous[18]==='已寄出'?'sent':'pending'};
    }
    const issued=Number(CacheService.getScriptCache().get('form:'+d.token));
    if(!issued||Date.now()-issued<2000||Date.now()-issued>21600000)return {ok:false,message:'報名連線已過期或尚未就緒，請重新整理後再送出。'};
    const today=Utilities.formatDate(new Date(),'Asia/Taipei','yyyy-MM-dd');
    const todayRows=rows.filter(r=>r[0] instanceof Date&&Utilities.formatDate(r[0],'Asia/Taipei','yyyy-MM-dd')===today);
    if(todayRows.filter(r=>r[11]===d.email).length>=3)return {ok:false,message:'此信箱今天已送出多份報名；如需補充或更正，請透過 LINE 聯絡我們。'};
    if(todayRows.length>=100)return {ok:false,message:'線上報名暫停收件，請透過官方 LINE 聯絡我們。'};
    const id='CS-'+Utilities.formatDate(new Date(),'Asia/Taipei','yyyyMMdd')+'-'+Utilities.getUuid().slice(0,8).toUpperCase();
    const row=[new Date(),id,d.childName,d.grade+' 年級',d.school,COURSE_NAMES[d.course],d.preferredTimes.join('、'),d.experience,d.experienceNotes,d.parentName,d.phone,d.email,d.notes,'已同意',SETTINGS.privacyVersion,'體驗課報名頁','待聯絡',false,'待寄送','','',d.submissionId,fingerprint,0,'',d.referrer].map(cell_);
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    CacheService.getScriptCache().remove('form:'+d.token);
    result={ok:true,registrationId:id,emailStatus:'pending'};
  }catch(e){return {ok:false,message:'暫時無法確認收件結果，請在本頁重試；若持續發生，請透過 LINE 聯絡我們。'};}
  finally{lock.releaseLock();}
  // The registration is durable before email is attempted.
  try{result.emailStatus=sendForId_(result.registrationId)?'sent':'pending';}catch(e){}
  return result;
}
function escape_(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function mailForRow_(r){
  const message='您好，我已填寫體驗課報名。孩子姓名：'+r[2]+'；想體驗：'+r[5]+'。請協助安排，謝謝！';
  const body=r[9]+' 您好：\n\n我們已收到 '+r[2]+' 的體驗課報名！\n報名編號：'+r[1]+'\n想體驗的課程：'+r[5]+'\n偏好時段：'+r[6]+'\n\n下一步：請加入創意方塊官方 LINE，並主動傳訊息告知孩子的名字，方便我們與您聯絡。\n'+SETTINGS.lineUrl+'\n\n可複製這段訊息：\n'+message+'\n\n這封信代表已收到報名意願；實際課程、日期與時間，需由老師聯繫確認後才完成預約。\n\n創意方塊機器人教室\n台北市萬華區莒光路347巷20號1樓';
  const htmlBody='<div style="background:#f5f7fa;padding:30px 12px;font-family:Arial,sans-serif;color:#152640;line-height:1.8"><div style="max-width:560px;margin:auto;background:white;border-radius:18px;overflow:hidden"><div style="padding:28px 32px;background:#152640;color:white;font-size:20px;font-weight:bold">創意方塊<span style="font-size:13px;display:block;font-weight:normal">機器人教室 · 免費體驗</span></div><div style="padding:30px 32px"><p style="color:#b94413;font-size:13px">WE HAVE YOUR REGISTRATION</p><h1 style="font-size:27px;line-height:1.4">報名已收到，<br>請加入 LINE 安排體驗時間。</h1><p>'+escape_(r[9])+' 您好：<br>謝謝您為 '+escape_(r[2])+' 報名體驗課！</p><div style="background:#f5f7fa;padding:18px;border-radius:10px;font-size:14px">報名編號：'+escape_(r[1])+'<br>體驗課程：'+escape_(r[5])+'<br>偏好時段：'+escape_(r[6])+'</div><p>請加入官方 LINE，<b>並主動傳訊息告知孩子的名字</b>，讓老師為您安排課程與時間。</p><p style="text-align:center;margin:26px 0"><a href="'+SETTINGS.lineUrl+'" style="display:inline-block;background:#087e42;color:white;padding:13px 18px;border-radius:9px;text-decoration:none;font-weight:bold">加入 LINE，聯繫安排體驗課 ↗</a></p><p style="font-size:13px;color:#637083">加入後，可複製這段訊息：</p><blockquote style="margin:0;border-left:3px solid #e77838;padding:12px 16px;background:#fff7f1">'+escape_(message)+'</blockquote><p style="font-size:13px;color:#637083;margin-top:24px">此信代表已收到報名意願。實際課程、日期與時間需經老師確認，才算完成預約。</p><hr style="border:0;border-top:1px solid #dce2ea;margin:24px 0"><p style="font-size:13px">創意方塊機器人教室<br>台北市萬華區莒光路347巷20號1樓<br><a href="https://maps.app.goo.gl/Wwa9s3u1zihoFzgVA">Google 地圖・查看位置與導航</a></p></div></div></div>';
  return {to:r[11],subject:'【創意方塊】已收到體驗課報名｜請加入 LINE 安排時間',body,htmlBody,name:'創意方塊機器人教室',replyTo:SETTINGS.sender};
}
function sendForId_(id){
  assertSender_();
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(5000))return false;
  try{
    const sheet=sheet_(),n=sheet.getLastRow()-1;
    if(n<1)return false;
    const rows=sheet.getRange(2,1,n,HEADERS.length).getValues();
    const index=rows.findIndex(r=>r[1]===id);
    if(index<0)return false;
    const r=rows[index], row=index+2;
    if(r[18]==='已寄出')return true;
    if(!['待寄送','待重試'].includes(r[18])||Number(r[23])>=3||MailApp.getRemainingDailyQuota()<1)return false;
    sheet.getRange(row,19).setValue('寄送中');
    sheet.getRange(row,24,1,2).setValues([[Number(r[23])+1,new Date()]]);
    SpreadsheetApp.flush();
    try{
      MailApp.sendEmail(mailForRow_(r));
    }catch(e){
      sheet.getRange(row,19,1,3).setValues([[Number(r[23])+1>=3?'待人工確認':'待重試','',String(e.message).slice(0,500)]]);
      return false;
    }
    // If delivery succeeded but recording fails, keep the uncertain state for manual review.
    sheet.getRange(row,19,1,3).setValues([['已寄出',new Date(),'']]);
    SpreadsheetApp.flush();
    return true;
  }finally{lock.releaseLock();}
}
function processMailQueue(){
  assertSender_();
  const sheet=sheet_(),n=sheet.getLastRow()-1;
  if(n<1)return;
  const rows=sheet.getRange(2,1,n,HEADERS.length).getValues();
  const queued=rows.filter(r=>['待寄送','待重試'].includes(r[18])).slice(0,15);
  queued.forEach(r=>sendForId_(r[1]));
  // A interrupted send has an unknown outcome. Flag it for manual review, never automatically resend it.
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(5000))return;
  try{
    const fresh=sheet.getRange(2,1,sheet.getLastRow()-1,HEADERS.length).getValues();
    fresh.forEach((r,i)=>{
      if(r[18]==='寄送中'&&r[24] instanceof Date&&Date.now()-r[24].getTime()>900000){
        sheet.getRange(i+2,19).setValue('待人工確認');
        sheet.getRange(i+2,21).setValue('前次寄送中斷，請先確認寄件紀錄再決定是否重寄。');
      }
    });
  }finally{lock.releaseLock();}
}


// Public JSON transport: callers omit browser credentials, avoiding multi-login routing.
function doPost(e) {
  let result;
  try {
    const raw=e && e.postData && e.postData.contents || '';
    if(raw.length>15000)throw new Error('報名資料過長');
    const request=JSON.parse(raw);
    if(request.action==='token')result={ok:true,token:getFormToken()};
    else if(request.action==='submit')result=submitApplication(request.data);
    else result={ok:false,message:'不支援的操作'};
  } catch(error) { result={ok:false,message:'無法處理報名資料，請重新整理後再試。'}; }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function updateRegistrationFields(){
  assertSender_();
  sheet_();
  console.log("推薦人欄位已就緒");
}
