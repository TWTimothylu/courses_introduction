document.querySelectorAll('.video-shell').forEach(shell=>{
  const launch=shell.querySelector('.video-launch');
  let player=shell.querySelector('.youtube-player');
  const status=shell.querySelector('.video-status');
  launch.addEventListener('click',()=>{
    const legacySource=shell.querySelector('video')?.dataset.src||'';
    const youtubeId=launch.dataset.youtubeId||(legacySource.includes('robot')?'IH5aCnKfEhE':legacySource.includes('scratch')?'-ZPYLjzbxyE':'');
    if(!youtubeId)return;
    document.querySelectorAll('.youtube-player iframe').forEach(other=>{
      other.contentWindow?.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:''}),'*');
    });
    if(!player){
      player=document.createElement('div');
      player.className='youtube-player';
      player.setAttribute('aria-live','polite');
      shell.querySelector('video')?.remove();
      shell.insertBefore(player,status);
    }
    const frame=document.createElement('iframe');
    frame.src='https://www.youtube-nocookie.com/embed/'+youtubeId+'?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1';
    frame.title=launch.getAttribute('aria-label').replace('播放','');
    frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen=true;
    frame.referrerPolicy='strict-origin-when-cross-origin';
    player.replaceChildren(frame);
    player.hidden=false;
    launch.hidden=true;
    status.hidden=true;
  });
});
