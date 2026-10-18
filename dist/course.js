(()=>{const groups=['all','1-3','3-7','6-12'];let selected=new URLSearchParams(location.search).get('grade');if(!groups.includes(selected)){try{selected=sessionStorage.getItem('course-grade');}catch{}}if(groups.includes(selected)){document.querySelectorAll('[data-return]').forEach(a=>a.href='index.html?grade='+selected+'#courses');document.querySelectorAll('.related-card').forEach(a=>{const url=new URL(a.href);url.searchParams.set('grade',selected);a.href=url.href;});}})();

(()=>{
 const nav=document.querySelector('.detail-nav');if(!nav)return;
 const labels={fit:'適合幾年級','small-class':'小班怎麼教',learning:'會學到什麼',classroom:'看看上課現場',photos:'課堂照片',process:'孩子怎麼學',info:'費用與地點',schedule:'每週上課時間',faq:'家長常問'};
 const links=[...nav.querySelectorAll('a')];links.forEach(a=>a.textContent=labels[a.hash.slice(1)]||a.textContent);
 const chapters=links.map(link=>({link,section:document.querySelector(link.hash)})).filter(c=>c.section);
 const desktop=document.createElement('div');desktop.className='chapter-links';links.forEach(a=>desktop.append(a));
 const bar=document.createElement('div');bar.className='chapter-bar';
 bar.innerHTML='<a class="chapter-step previous" href="#main" aria-label="上一節">‹</a><button class="chapter-toggle" type="button" aria-haspopup="dialog" aria-controls="chapter-sheet" aria-expanded="false"><span class="chapter-position"><small>課程概覽 · 點此選章節</small><strong>從這裡開始</strong></span><span aria-hidden="true">⌄</span></button><a class="chapter-step next" href="#fit" aria-label="下一節">›</a><div class="chapter-progress" aria-hidden="true"><span></span></div>';
 nav.append(bar,desktop);nav.classList.add('chapter-nav','chapter-nav-v2');
 const toggle=bar.querySelector('button'),prev=bar.querySelector('.previous'),next=bar.querySelector('.next');
 const dialog=document.createElement('dialog');dialog.id='chapter-sheet';dialog.className='chapter-sheet';dialog.setAttribute('aria-labelledby','chapter-sheet-title');
 dialog.innerHTML='<div class="sheet-handle" aria-hidden="true"></div><div class="sheet-heading"><div><p>想先了解什麼？</p><h2 id="chapter-sheet-title">選擇想看的章節</h2></div><button class="sheet-close" type="button" aria-label="關閉章節目錄">×</button></div><nav class="sheet-chapters" aria-label="選擇章節"></nav>';
 const sheetLinks=chapters.map((c,i)=>{const a=c.link.cloneNode(true);const n=document.createElement('span');n.className='sheet-number';n.textContent=String(i+1).padStart(2,'0');a.prepend(n);dialog.querySelector('nav').append(a);return a;});document.body.append(dialog);
 const mobile=matchMedia('(max-width:750px)');let savedOverflow='';
 function close(){if(dialog.open)dialog.close();}
 dialog.addEventListener('close',()=>{document.body.style.overflow=savedOverflow;toggle.setAttribute('aria-expanded','false');});
 toggle.addEventListener('click',()=>{savedOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';toggle.setAttribute('aria-expanded','true');});
 dialog.querySelector('.sheet-close').addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom||e.clientX<r.left||e.clientX>r.right)close();}});
 function jump(e){const a=e.target.closest('a');if(!a)return;if(a.getAttribute('aria-disabled')==='true'){e.preventDefault();return;}const section=document.querySelector(a.hash);if(!section)return;close();section.setAttribute('tabindex','-1');section.focus({preventScroll:true});const title=section.querySelector('h2')||section;title.classList.remove('chapter-arrival');requestAnimationFrame(()=>title.classList.add('chapter-arrival'));setTimeout(()=>title.classList.remove('chapter-arrival'),1200);}
 dialog.addEventListener('click',jump);nav.addEventListener('click',jump);mobile.addEventListener('change',()=>{close();schedule();});
 let queued=false;
 function update(){queued=false;const edge=nav.getBoundingClientRect().height+40;let index=-1;chapters.forEach((c,i)=>{if(c.section.getBoundingClientRect().top<=edge)index=i;});
 chapters.forEach((c,i)=>{for(const a of [c.link,sheetLinks[i]]){if(i===index)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}});
 toggle.querySelector('strong').textContent=index<0?'課程概覽':chapters[index].link.textContent;
 toggle.querySelector('small').textContent=(index<0?'開始探索':('第 '+(index+1)+' / '+chapters.length+' 節'))+' · 點此選章節';
 prev.href=index<=0?'#main':chapters[index-1].link.hash;prev.setAttribute('aria-disabled',String(index<0));prev.tabIndex=index<0?-1:0;
 next.href=index>=chapters.length-1?'#faq':chapters[index+1].link.hash;next.setAttribute('aria-disabled',String(index>=chapters.length-1));next.tabIndex=index>=chapters.length-1?-1:0;
 prev.setAttribute('aria-label',index<=0?'返回課程概覽':'上一節：'+chapters[index-1].link.textContent);next.setAttribute('aria-label',index>=chapters.length-1?'已到最後一節':'下一節：'+chapters[index+1].link.textContent);
 let progress=0;if(index>=0){const top=chapters[index].section.getBoundingClientRect().top;const end=index+1<chapters.length?chapters[index+1].section.getBoundingClientRect().top:chapters[index].section.getBoundingClientRect().bottom;progress=(index+Math.min(1,Math.max(0,(edge-top)/Math.max(1,end-top))))/chapters.length;}
 bar.querySelector('.chapter-progress span').style.transform='scaleX('+progress+')';
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);new ResizeObserver(schedule).observe(document.querySelector('main'));update();
})();
// Manual exploration tabs: keyboard and touch share the same selection state.
document.querySelectorAll('.explore-card').forEach(card=>{
 const tabs=[...card.querySelectorAll('[role=tab]')],panels=[...card.querySelectorAll('[role=tabpanel]')];
 function select(index,focus=false){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});card.querySelector('.explore-marker').textContent='0'+(index+1)+' · '+panels[index].dataset.marker;if(focus)tabs[index].focus();}
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(index));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();select(next,true);}});});
});
