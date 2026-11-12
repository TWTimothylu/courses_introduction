import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const run=(file,cwd=root)=>execFileSync(process.execPath,[file],{cwd,stdio:'inherit'});
run('scripts/build-course-pages.mjs');
run('scripts/build.mjs',path.join(root,'camps/2027-winter'));
// Only this disposable output may be cleared. dist is maintained source.
const out=path.join(root,'_site');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const allowed=/^(index\.html|style\.css|app\.js|offer\.js|recaptcha\.js|trial\.(html|css|js)|course-[\w-]+\.html|course\.(css|js)|media\.(css|js)|schedule[\w.-]*\.(js|mjs|css)|sitemap\.xml)$/;
for(const name of fs.readdirSync(path.join(root,'dist'))){
 if(name==='assets'||allowed.test(name))fs.cpSync(path.join(root,'dist',name),path.join(out,name),{recursive:true});
}
fs.mkdirSync(path.join(out,'camps'),{recursive:true});
fs.copyFileSync(path.join(root,'camps/index.html'),path.join(out,'camps/index.html'));
fs.cpSync(path.join(root,'camps/2027-winter/dist'),path.join(out,'camps/2027-winter'),{recursive:true});
const base='https://www.creativstacks.info/';
const campMap=fs.readFileSync(path.join(out,'camps/2027-winter/sitemap.xml'),'utf8');
const urls=campMap.match(/<url>[\s\S]*?<\/url>/g).join('\n');
const map=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8').replace('</urlset>',`<url><loc>${base}camps/</loc></url>\n${urls}\n</urlset>`);
fs.writeFileSync(path.join(out,'sitemap.xml'),map);
fs.writeFileSync(path.join(out,'.nojekyll'),'');
run('scripts/build-legacy.mjs');
// Google tag (GA4 / Google Ads), added right before </head> of every public page.
// Redirect-only legacy pages are skipped so a visit is not counted twice.
const googleTagId='G-MH5D7SY722';
const googleTag=`<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=${googleTagId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleTagId}');</script>`;
const htmlFiles=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?htmlFiles(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);
for(const file of htmlFiles(out)){
 const html=fs.readFileSync(file,'utf8');
 if(html.includes('window.location.replace')||html.includes('googletagmanager.com/gtag/js'))continue;
 if(!html.includes('</head>'))throw new Error('No </head> in '+file);
 fs.writeFileSync(file,html.replace('</head>',googleTag+'</head>'));
}
console.log('Complete classroom website assembled in _site.');
