const youtubeVideos={
  robot:'IH5aCnKfEhE',
  scratch:'-ZPYLjzbxyE'
};

export function videoMarkup(name,label){
  const youtubeId=youtubeVideos[name];
  if(!youtubeId)throw new Error('Missing YouTube video ID for '+name);
  return '<div class="video-shell"><button class="video-launch" type="button" aria-label="播放'+label+'" data-youtube-id="'+youtubeId+'"><img src="assets/'+name+'-poster.webp" alt="" width="720" height="720" loading="lazy" decoding="async"><span class="play-label"><b aria-hidden="true">▶</b>播放課堂影片</span></button><div class="youtube-player" hidden aria-live="polite"></div><p class="video-status" role="status" hidden></p><noscript><a href="https://www.youtube.com/shorts/'+youtubeId+'" target="_blank" rel="noopener">在 YouTube 開啟'+label+'</a></noscript></div>';
}
