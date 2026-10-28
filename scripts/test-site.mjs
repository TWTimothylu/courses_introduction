import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../_site/',import.meta.url));
const base='https://www.creativstacks.info/';
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root);
for(const file of files){
 assert.ok(!/backend|\.gs$|\.xlsx$|\.ndjson$|setup-local|email-preview|\.git\//.test(file.replaceAll('\\','/').slice(root.length)),file);
 if(!file.endsWith('.html'))continue;
 const html=fs.readFileSync(file,'utf8');
 assert.ok(!html.includes('github.io/creativstack_camp2027/'),file+' stale camp link');
 assert.ok(!html.includes('https://twtimothylu.github.io/courses_introduction/'),file+' stale canonical or sharing URL');
 if(html.includes('window.location.replace')){
  let actual;const link={};
  vm.runInNewContext(html.match(/<script>(.*?)<\/script>/s)[1],{URL,window:{location:{search:'?course=python&utm_source=test',hash:'#info',replace:url=>actual=url}},document:{getElementById:()=>link}});
  const target=new URL(actual);assert.equal(target.origin,new URL(base).origin);assert.equal(target.search,'?course=python&utm_source=test');assert.equal(target.hash,'#info');assert.equal(link.href,actual);
  assert.ok(fs.existsSync(path.join(root,target.pathname,target.pathname.endsWith('/')?'index.html':'')),file+' redirect destination');
 }
 for(const [,value] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(?:#|https?:|data:|mailto:|tel:)/.test(value))continue;
  const resolved=new URL(value,base+path.relative(root,file).replaceAll('\\','/'));
  const rel=decodeURIComponent(resolved.pathname.slice(new URL(base).pathname.length));
  let target=path.join(root,rel);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),`${file}: missing ${value}`);
 }
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,12);
assert.ok(!sitemap.includes('register.html'));
assert.ok(!sitemap.includes('github.io'));
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: '+base+'sitemap.xml'));
for(const [,url] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)){
 const rel=url.slice(base.length);const target=path.join(root,rel.endsWith('/')||!rel?rel+'index.html':rel);
 assert.ok(fs.readFileSync(target,'utf8').includes(`rel="canonical" href="${url}"`),url);
}
const camp=path.join(root,'camps/2027-winter');
assert.ok(fs.readFileSync(path.join(camp,'register.html'),'utf8').includes('noindex,follow'));
for(const name of ['config.js','pricing.js','tracking.js']){
 assert.equal(fs.readFileSync(path.join(camp,name),'utf8'),fs.readFileSync(new URL('../camps/2027-winter/public/'+name,import.meta.url),'utf8'));
}
console.log(`Integrated site checked: ${files.length} public files, all local HTML links, 12 canonical sitemap entries, registration and tracking files.`);
