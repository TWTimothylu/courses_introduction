(()=>{const groups=['all','1-3','3-7','6-12'];let selected=new URLSearchParams(location.search).get('grade');if(!groups.includes(selected)){try{selected=sessionStorage.getItem('course-grade');}catch{}}if(groups.includes(selected)){document.querySelectorAll('[data-return]').forEach(a=>a.href='index.html?grade='+selected+'#courses');document.querySelectorAll('.related-card').forEach(a=>{const url=new URL(a.href);url.searchParams.set('grade',selected);a.href=url.href;});}})();

// One compact position indicator on mobile; every chapter remains a real anchor.
(()=>{
  const nav=document.querySelector('.detail-nav');if(!nav)return;
  const links=[...nav.querySelectorAll('a')];
  const chapters=links.map(link=>({link,section:document.querySelector(link.hash)})).filter(c=>c.section);
  const panel=document.createElement('div');panel.className='chapter-links';panel.id='chapter-links';
  links.forEach(link=>panel.append(link));
  const toggle=document.createElement('button');toggle.type='button';toggle.className='chapter-toggle';
  toggle.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-expanded','false');
  toggle.innerHTML='<span class="chapter-position"><small>目前位置</small><strong>課程概覽</strong></span><span class="chapter-action">章節目錄 <span aria-hidden="true">⌄</span></span>';
  nav.append(toggle,panel);nav.classList.add('chapter-nav');
  const mobile=matchMedia('(max-width:750px)');
  function close(restore=false){toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');if(restore)toggle.focus();}
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  nav.addEventListener('keydown',event=>{if(event.key==='Escape'){close(true);}});
  document.addEventListener('click',event=>{if(!nav.contains(event.target))close();});
  nav.addEventListener('focusout',event=>{if(event.relatedTarget&&!nav.contains(event.relatedTarget))close();});
  panel.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;close();const section=document.querySelector(link.hash);if(section){section.setAttribute('tabindex','-1');section.focus({preventScroll:true});}});
  mobile.addEventListener('change',()=>{close();update();});
  let queued=false;
  function update(){
    queued=false;const edge=nav.getBoundingClientRect().height+32;
    let active=null;for(const chapter of chapters){if(chapter.section.getBoundingClientRect().top<=edge)active=chapter;}
    // The open menu must not change the reading-position threshold.
    chapters.forEach(c=>{if(c===active)c.link.setAttribute('aria-current','location');else c.link.removeAttribute('aria-current');});
    toggle.querySelector('strong').textContent=active?active.link.textContent:'課程概覽';
    toggle.querySelector('small').textContent=active?'目前位置 · '+(chapters.indexOf(active)+1)+' / '+chapters.length:'目前位置';
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);
  new ResizeObserver(schedule).observe(document.querySelector('main'));
  update();
})();
