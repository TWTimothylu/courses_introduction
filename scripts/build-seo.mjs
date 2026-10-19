import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>fs.readFileSync(root+p,'utf8'),write=(p,s)=>fs.writeFileSync(root+p,s);
const courses=JSON.parse(read('scripts/course-details.json'));
const base='https://twtimothylu.github.io/courses_introduction/';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const org={'@type':'EducationalOrganization','@id':base+'#organization',name:'創意方塊機器人教室',url:base,logo:base+'assets/brand-logo.png',address:{'@type':'PostalAddress',streetAddress:'莒光路347巷20號1樓',addressLocality:'萬華區',addressRegion:'台北市',addressCountry:'TW'}};
const pages=[{file:'index.html',url:base,title:'台北萬華兒童程式・樂高機器人課程｜創意方塊',description:'創意方塊機器人教室位於台北萬華，提供國小至高中適齡的樂高機器人、Scratch 與 Python 課程，6 人以下小班教學。查看課程內容、費用、每週課表，預約免費體驗。',image:'class.jpg'},...courses.map(c=>({file:'course-'+c.id+'.html',url:base+'course-'+c.id+'.html',title:'台北萬華'+c.name+'｜'+c.grade.split('｜')[0]+'・創意方塊',description:'台北萬華'+c.name+'，適合'+c.grade.replace('｜','（')+'）。6 人以下小班教學。'+c.intro+'查看課程費用與每週課表，預約免費體驗。',image:'seo-'+c.id+'.jpg',course:c})),{file:'trial.html',url:base+'trial.html',title:'預約免費體驗｜台北萬華樂高・Scratch・Python｜創意方塊',description:'預約創意方塊機器人教室免費體驗，填寫孩子年級、想體驗的課程與偏好時段。送出後請加入官方 LINE，讓老師與您聯絡確認體驗安排。',image:'class.jpg'}];
// Render the very same homepage cards at build time; filtering still enhances them in the browser.
const elements={};const context={document:{getElementById:id=>elements[id]??=( {textContent:'',innerHTML:''})}};
vm.runInNewContext(read('dist/app.js').split('const gradeControl=')[0]+"\nrenderCourses('all');",context,{timeout:1000});
let home=read('dist/index.html');
home=home.replace(/<div class="course-grid" id="course-grid">[\s\S]*?<\/div><p class="fine">/,()=>'<div class="course-grid" id="course-grid">'+elements['course-grid'].innerHTML.replaceAll('.html?grade=all','.html')+'</div><p class="fine">');
home=home.replace('台北萬華｜國小一年級至高中三年級','台北萬華兒童程式與樂高機器人課程｜國小一年級至高中三年級');
write('dist/index.html',home);
for(const p of pages){
 let html=read('dist/'+p.file);
 const graph=[org,{'@type':'WebSite','@id':base+'#website',url:base,name:'創意方塊機器人教室',inLanguage:'zh-Hant',publisher:{'@id':org['@id']}},{'@type':'WebPage','@id':p.url+'#webpage',url:p.url,name:p.title,description:p.description,inLanguage:'zh-Hant',isPartOf:{'@id':base+'#website'},about:{'@id':org['@id']}}];
 if(p.course){const c=p.course;graph.push({'@type':'Course','@id':p.url+'#course',url:p.url,name:c.name,description:c.intro,inLanguage:'zh-Hant',provider:{'@id':org['@id']},educationalLevel:c.grade,teaches:c.points.map(v=>v[0]),image:base+'assets/'+p.image});graph[2].mainEntity={'@id':p.url+'#course'};}
 if(p.file==='index.html')graph.push({'@type':'ItemList',name:'常態課程',itemListElement:courses.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,url:base+'course-'+c.id+'.html'}))});
 else graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'創意方塊課程',item:base},{'@type':'ListItem',position:2,name:p.course?.name||'預約免費體驗',item:p.url}]});
 // Idempotent: replace only SEO tags, preserve styles, scripts and verification tokens.
 html=html.replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*(?:name=["'](?:description|robots|twitter:[^"']+)["']|property=["']og:[^"']+["'])[^>]*>/gi,'').replace(/<link\b[^>]*rel=["'](?:canonical|sitemap)["'][^>]*>/gi,'').replace(/<script id="site-seo" type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 const tags='<title>'+esc(p.title)+'</title><meta name="description" content="'+esc(p.description)+'"><link rel="canonical" href="'+p.url+'"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="sitemap" type="application/xml" href="'+base+'sitemap.xml">'+Object.entries({'og:title':p.title,'og:description':p.description,'og:type':'website','og:url':p.url,'og:site_name':'創意方塊機器人教室','og:locale':'zh_TW','og:image':base+'assets/'+p.image,'og:image:alt':p.course?.exploration.alt||'創意方塊教室內的學習現場'}).map(([k,v])=>'<meta property="'+k+'" content="'+esc(v)+'">').join('')+'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+esc(p.title)+'"><meta name="twitter:description" content="'+esc(p.description)+'"><meta name="twitter:image" content="'+base+'assets/'+p.image+'"><script id="site-seo" type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')+'</script>';
 html=html.replace('</head>',tags+'</head>');write('dist/'+p.file,html);
}
// Do not fabricate lastmod timestamps when the actual content change date is unknown.
write('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(p=>'  <url><loc>'+p.url+'</loc></url>').join('\n')+'\n</urlset>\n');
console.log('SEO: seven canonical pages, structured data, static course cards and sitemap generated.');
