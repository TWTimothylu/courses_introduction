const videos=[...document.querySelectorAll('.video-shell video')];
const primeVideo=video=>{
  if(video.src)return;
  video.preload='auto';
  video.src=video.dataset.src;
  video.load();
};
document.querySelectorAll('.video-shell').forEach(shell=>{
  const launch=shell.querySelector('button');
  const video=shell.querySelector('video');
  const status=shell.querySelector('.video-status');
  launch.addEventListener('click',()=>{
    primeVideo(video);
    video.hidden=false;
    launch.hidden=true;
    video.focus();
    video.play().catch(()=>{
      status.hidden=false;
      status.textContent='請使用影片上的播放按鈕開始觀看。';
    });
  });
  video.addEventListener('play',()=>{
    status.hidden=true;
    videos.forEach(other=>{if(other!==video)other.pause();});
  });
  video.addEventListener('error',()=>{
    status.hidden=false;
    status.textContent='影片暫時無法載入，請點擊封面重試。';
    video.hidden=true;
    launch.hidden=false;
  });
});
const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const conserveData=connection&&(connection.saveData||/^(slow-2g|2g)$/.test(connection.effectiveType||''));
const preloadInSequence=index=>{
  const video=videos[index];
  if(!video)return;
  primeVideo(video);
  let advanced=false;
  const next=()=>{
    if(advanced)return;
    advanced=true;
    preloadInSequence(index+1);
  };
  video.addEventListener('canplaythrough',next,{once:true});
  window.setTimeout(next,8000);
};
if(videos.length&&!conserveData){
  const begin=()=>window.setTimeout(()=>preloadInSequence(0),2500);
  window.addEventListener('load',()=>{
    if('requestIdleCallback' in window)window.requestIdleCallback(begin,{timeout:6000});
    else window.setTimeout(begin,2500);
  },{once:true});
}
