import {scheduleSource} from './schedule-config.js';
import {categories,time,validateSchedule} from './schedule-model.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const weekdays=['','星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
class CourseSchedule extends HTMLElement {
  static observedAttributes=['course','src'];
  connectedCallback(){
    if(!this.shadowRoot)this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML='<link rel="stylesheet" href="'+new URL('schedule.css',import.meta.url)+'"><div class="content"></div>';
    this.content=this.shadowRoot.querySelector('.content');
    this.shadowRoot.addEventListener('change',e=>{if(e.target.matches('select')){this.filter=e.target.value;this.draw();}});
    this.shadowRoot.addEventListener('click',e=>{if(e.target.closest('[data-retry]'))this.refresh();});
    this.refresh();this.timer=setInterval(()=>{if(!document.hidden)this.refresh();},15000);
  }
  disconnectedCallback(){clearInterval(this.timer);this.controller?.abort();}
  attributeChangedCallback(name,old,value){if(!this.content||old===value)return;if(name==='course')this.draw();else{this.last=null;this.controller?.abort();this.loading=false;this.refresh();}}
  async refresh(){
    const source=this.getAttribute('src')||scheduleSource;
    if(!source){this.state='unconfigured';this.draw();return;}
    if(this.loading)return;
    this.loading=true;const previousState=this.state,previousData=JSON.stringify(this.last);if(!this.last){this.state='loading';this.draw();}
    const controller=new AbortController();this.controller=controller;
    const timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const url=new URL(source,location.href);
      // A fresh CDN key each polling window avoids repeatedly reading a cached snapshot.
      url.searchParams.set('schedule-check',String(Math.floor(Date.now()/15000)));
      const local=['localhost','127.0.0.1','[::1]'];
      if(!local.includes(location.hostname)&&(url.protocol!=='https:'||local.includes(url.hostname)||/YOUR-|example\./i.test(url.hostname)))throw Error('Invalid source');
      const response=await fetch(url,{credentials:'omit',cache:'no-store',signal:controller.signal});
      if(!response.ok)throw Error('Unavailable');
      const data=validateSchedule(await response.json());
      if(this.controller!==controller)return;
      if(this.last&&data.revision<this.last.revision)throw Error('Old revision');
      this.last=data;this.state='ready';
    }catch{if(this.controller===controller)this.state=this.last?'stale':'error';}
    finally{clearTimeout(timeout);if(this.controller===controller){this.loading=false;if(this.isConnected&&(previousState!==this.state||previousData!==JSON.stringify(this.last)))this.draw();}}
  }
  draw(){
    if(!this.content)return;
    const state=this.state;
    if(!this.last){
      const copy={loading:['正在讀取每週課表…','請稍候，我們正在取得最新的上課時段。'],unconfigured:['上課時段，讓我們協助您確認。','每週課表整理中。歡迎透過 LINE 告訴我們孩子的年級與方便的時間。'],error:['目前無法讀取課表。','您可以稍後重試，或透過 LINE 詢問上課時段。']}[state]||['正在讀取每週課表…',''];
      this.content.innerHTML=`<div class="message" role="status"><strong>${copy[0]}</strong><p>${copy[1]}</p>${state==='error'?'<button data-retry>重新讀取</button>':''}${state!=='loading'?'<a class="cta" href="https://lin.ee/7FoFpdM" target="_blank" rel="noopener">加入 LINE，詢問上課時段 ↗</a>':''}</div>`;return;
    }
    const d=this.last,locked=this.getAttribute('course'),filter=locked??this.filter??'all';
    const selected=d.courses.filter(c=>filter==='all'||c.courseKey===filter);
    const card=c=>`<article class="slot ${c.courseKey==='open-class'?'open':''}"><p class="time">${time(c.start)}–${time(c.start+c.duration)}</p><h4>${esc(c.title)}</h4><p class="kind">${esc(categories[c.courseKey])} · ${c.duration} 分鐘</p>${c.courseKey&&c.courseKey!=='open-class'?`<a href="course-${c.courseKey}.html">認識課程 →</a>`:''}</article>`;
    this.content.innerHTML=`${!locked?`<div class="toolbar"><label>想看哪種課程？<select aria-label="篩選每週課表課程"><option value="all">所有課程與可開班時段</option>${Object.entries(categories).map(([k,v])=>`<option value="${k}" ${filter===k?'selected':''}>${v}</option>`).join('')}</select></label><span>固定每週安排 · 台北時間</span></div>`:''}<p class="status" role="status">${state==='stale'?'暫時無法更新，以下保留上次成功讀取的課表。':selected.length?`顯示 ${selected.length} 個時段`:'目前沒有符合的固定時段，歡迎詢問其他安排。'}${state==='stale'?'<button data-retry>重新讀取</button>':''}</p><div class="days">${d.settings.days.map(day=>`<section class="day"><h3>${weekdays[day]}</h3>${selected.filter(c=>c.day===day).sort((a,b)=>a.start-b.start||a.id.localeCompare(b.id)).map(card).join('')||'<p class="empty">暫無符合的時段</p>'}</section>`).join('')}</div>${locked?`<details class="openings"><summary>時間不合適？看看可開班時段</summary>${d.courses.filter(c=>c.courseKey==='open-class').map(c=>`<div><b>${weekdays[c.day]}</b>${card(c)}</div>`).join('')||'<p>目前未列出可開班時段，歡迎透過 LINE 詢問。</p>'}</details>`:''}<p class="meta">${d.updatedAt?'課表更新：'+esc(new Date(d.updatedAt).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',hour12:false})):'課表尚未提供更新時間'} · 閱覽期間定期檢查更新</p>`;
    const select=this.content.querySelector('select');if(select)select.value=filter;
  }
}
customElements.define('course-schedule',CourseSchedule);
