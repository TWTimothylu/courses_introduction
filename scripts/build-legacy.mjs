import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const out=fileURLToPath(new URL('../_site/',import.meta.url));
const base='https://www.creativstacks.info/';
const routes={
 '常態課程介紹':'#courses',
 '常態課程介紹/簡易樂高機器人班':'course-essential.html',
 '常態課程介紹/樂高機器人班':'course-prime.html',
 '常態課程介紹/scratch程式班':'course-scratch.html',
 '常態課程介紹/樂高機器人python班':'course-robot-python.html',
 '常態課程介紹/python程式班':'course-python.html'
};
// Exact former project URLs also work if a shared link retains the old prefix.
for(const file of ['index.html','trial.html','course-essential.html','course-prime.html','course-scratch.html','course-robot-python.html','course-python.html','camps/index.html','camps/2027-winter/index.html','camps/2027-winter/course-rc.html','camps/2027-winter/course-scratch.html','camps/2027-winter/course-essential.html','camps/2027-winter/register.html']){
 routes['courses_introduction/'+file]=file.replace(/index\.html$/,'');
}
function redirect(destination){
 const url=new URL(destination,base).href;
 return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>課程頁面已更新｜創意方塊</title><link rel="canonical" href="${url}"><meta name="robots" content="noindex,follow"></head><body><h1>課程頁面已更新</h1><p><a id="continue" href="${url}">前往課程介紹 →</a></p><script>const target=new URL(${JSON.stringify(url)});target.search=window.location.search;if(window.location.hash)target.hash=window.location.hash;document.getElementById('continue').href=target.href;window.location.replace(target.href);</script></body></html>`;
}
for(const [route,destination] of Object.entries(routes)){
 const file=route.endsWith('.html')?path.join(out,route):path.join(out,route,'index.html');
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,redirect(destination));
}
fs.writeFileSync(path.join(out,'courses_introduction/index.html'),redirect(''));
fs.writeFileSync(path.join(out,'404.html'),`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>找不到這個頁面｜創意方塊</title><style>body{max-width:640px;margin:12vh auto;padding:24px;font:18px/1.8 Arial,sans-serif;color:#152640}a{color:#b94413}</style></head><body><h1>這個頁面可能搬家了。</h1><p>教室網站已更新，請從以下入口繼續瀏覽。</p><p><a href="/">教室首頁</a> · <a href="/#courses">常態課程</a> · <a href="/camps/">寒暑假營隊</a> · <a href="/trial.html">預約體驗</a></p></body></html>`);
fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`);
console.log('Legacy course routes, helpful 404 and root robots.txt generated.');
