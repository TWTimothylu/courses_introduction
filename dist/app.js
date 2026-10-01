const courses=[{"id":"essential","name":"簡易樂高機器人班","tag":"第一台機器人","line":"喜歡動手，就從積木開始。","min":1,"max":3,"group":"1-3","grade":"1–3 年級｜小一 — 小三","price":"6,600","features":["組裝機器人，認識簡單機械","用圖像指令，練習程式邏輯","設計與改裝，實現自己的想法"],"equipment":"無需自備教具","detail":"使用 LEGO Spike Essential。透過組裝與圖像程式，練習空間認知、機械原理與解決問題。"},{"id":"prime","name":"樂高機器人班","tag":"動手解決真實任務","line":"讓自己造的機器人，聽懂指令。","min":3,"max":7,"group":"3-7","grade":"3–7 年級｜小三 — 國一","price":"7,800","features":["設計機構，學習機械原理","積木式程式，控制機器人動作","拆解任務，測試並改良作品"],"equipment":"第一期免費提供教具","detail":"使用 LEGO Spike Prime。第二期起需自備教具，或每期加收 2,000 元使用教室教具。自備教具享三期、每期 1,200 元課程費折扣。"},{"id":"scratch","name":"Scratch 程式班","tag":"自己的遊戲，自己設計","line":"把玩遊戲的熱情，變成創作力。","min":3,"max":7,"group":"3-7","grade":"3–7 年級｜小三 — 國一","price":"7,800","features":["設計角色、關卡與道具","用積木程式，建立遊戲規則","創作遊戲，練習邏輯與除錯"],"equipment":"無需自備教具","detail":"使用 Scratch，在遊戲創作中練習程式邏輯與運算思維，結合電腦繪圖，讓孩子設計自己的角色與作品。"},{"id":"robot-python","name":"樂高機器人 Python 班","tag":"讓程式走進真實世界","line":"用文字程式，挑戰更進階的機器人。","min":6,"max":12,"group":"6-12","grade":"6–12 年級｜小六 — 高三","price":"7,800","features":["Python 語法與函式","控制感測器與馬達","自走車、機械手臂等專題挑戰"],"equipment":"第一期免費提供教具","detail":"使用 LEGO Spike Prime 與 Pybricks Python。第二期起自備教具享三期、每期 1,200 元折扣；使用教室教具則每期加收 2,000 元。"},{"id":"python","name":"Python 程式班","tag":"從邏輯走向文字程式","line":"寫出自己的小工具，解決生活問題。","min":6,"max":12,"group":"6-12","grade":"6–12 年級｜小六 — 高三","price":"7,800","features":["變數、條件、迴圈與函式","資料結構、演算法與除錯","小遊戲、自動化工具與爬蟲入門"],"equipment":"需自備 Windows 或 macOS 筆電","detail":"從基礎語法到資料結構，以情境題與專題實作練習問題拆解，逐步建立獨立編寫程式的能力。"}];

function renderCourses(value='all'){
const list=courses.filter(c=>value==='all'||c.group===value);
document.getElementById('count').textContent=value==='all'?'目前顯示全部 '+list.length+' 門課程。':'已找到 '+list.length+' 門適合 '+value.replace('-', '–')+' 年級的課程。';
document.getElementById('course-cta-label').textContent=value==='all'?'查看全部 '+list.length+' 門課程':'查看 '+list.length+' 門適合課程';
document.getElementById('course-results-title').textContent=value==='all'?'探索全部 '+list.length+' 門課程。':value.replace('-', '–')+' 年級，適合的課程。';
document.getElementById('course-grid').innerHTML=list.map(c=>'<article class="course"><div class="course-top"><span class="course-tag">'+c.tag+'</span><h3>'+c.name+'</h3><p>'+c.line+'</p><p class="class-size">6 人以下小班教學</p></div><div class="course-body"><span class="grade-label">'+c.grade+'</span><ul>'+c.features.map(f=>'<li>'+f+'</li>').join('')+'</ul><p class="price">NT$ '+c.price+' <small>/ 12 堂・每堂 1.5 小時</small></p><p class="equipment">'+c.equipment+'</p><a class="course-detail-link" href="course-'+c.id+'.html?grade='+encodeURIComponent(value)+'" aria-label="認識'+c.name+'">認識這門課 <span aria-hidden="true">→</span></a><a class="button" href="trial.html?course='+c.id+'" aria-label="預約'+c.name+'免費體驗">預約免費體驗 ↗</a></div></article>').join('');
return list.map(c=>({name:c.name,grades:c.grade,price:c.price}));
}
const gradeControl=document.getElementById('grade');
const validGroups=['all','1-3','3-7','6-12'];
let initialGroup=new URLSearchParams(location.search).get('grade');
if(!validGroups.includes(initialGroup)){try{initialGroup=sessionStorage.getItem('course-grade');}catch{}}
gradeControl.value=validGroups.includes(initialGroup)?initialGroup:'all';
gradeControl.addEventListener('change',e=>{const group=e.target.value;try{sessionStorage.setItem('course-grade',group);}catch{}const url=new URL(location.href);url.searchParams.set('grade',group);history.replaceState(null,'',url);renderCourses(group);});
renderCourses(gradeControl.value);
window.addEventListener('pageshow',()=>renderCourses(gradeControl.value));
document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause()})));
