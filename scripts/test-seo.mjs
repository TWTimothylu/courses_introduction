import fs from 'node:fs';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const base='https://www.creativstacks.info/';
const courses=JSON.parse(fs.readFileSync(new URL('./course-details.json',import.meta.url),'utf8'));
const files=['index.html','trial.html',...courses.map(c=>'course-'+c.id+'.html')];
const sitemap=fs.readFileSync(root+'sitemap.xml','utf8');
const titles=new Set();
for(const file of files){
 const html=fs.readFileSync(root+file,'utf8');
 const expected=base+(file==='index.html'?'':file);
 assert.equal((html.match(/<link rel="canonical"/g)||[]).length,1,file+' canonical count');
 assert.ok(html.includes('<link rel="canonical" href="'+expected+'">'),file+' canonical');
 assert.equal((html.match(/<title>/g)||[]).length,1);const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
 assert.equal((html.match(/<meta name="description"/g)||[]).length,1);
 assert.ok(!/noindex/i.test(html));assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 const structured=JSON.parse(html.match(/<script id="site-seo" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.ok(structured['@graph'].some(n=>n['@type']==='EducationalOrganization'));
 if(file.startsWith('course-'))assert.ok(structured['@graph'].some(n=>n['@type']==='Course'));
 assert.ok(sitemap.includes('<loc>'+expected+'</loc>'));
 const image=html.match(/property="og:image" content="([^"]+)"/)[1];assert.ok(image.startsWith(base));assert.ok(fs.existsSync(root+image.slice(base.length)));
}
assert.equal((sitemap.match(/<loc>/g)||[]).length,7);
const home=fs.readFileSync(root+'index.html','utf8');assert.equal((home.match(/<article class="course">/g)||[]).length,5);
for(const c of courses)assert.ok(home.includes('href="course-'+c.id+'.html"'));
assert.ok(!/setup-local|email-preview|127\.0\.0\.1|\?v=/.test(sitemap));
console.log('SEO checks passed: canonical URLs, static course links, unique metadata, JSON-LD and sitemap.');
