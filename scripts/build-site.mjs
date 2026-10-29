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
const allowed=/^(index\.html|style\.css|app\.js|offer\.js|trial\.(html|css|js)|course-[\w-]+\.html|course\.(css|js)|media\.(css|js)|schedule[\w.-]*\.(js|mjs|css)|sitemap\.xml)$/;
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
console.log('Complete classroom website assembled in _site.');
