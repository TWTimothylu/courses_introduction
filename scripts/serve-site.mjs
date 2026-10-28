import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../_site/',import.meta.url));
const prefix='/courses_introduction/';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xml':'application/xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4'};
http.createServer((req,res)=>{
 try{
 const url=new URL(req.url,'http://localhost');
 if(!url.pathname.startsWith(prefix)){res.writeHead(404).end();return;}
 let target=path.resolve(root,decodeURIComponent(url.pathname.slice(prefix.length))||'.');
 if(target!==path.resolve(root)&&!target.startsWith(path.resolve(root)+path.sep)){res.writeHead(403).end();return;}
 if(fs.statSync(target).isDirectory()){
 if(!url.pathname.endsWith('/')){res.writeHead(302,{Location:url.pathname+'/'+url.search}).end();return;}
 target=path.join(target,'index.html');
 }
 res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
 fs.createReadStream(target).pipe(res);
 }catch{res.writeHead(404).end('Not found');}
}).listen(4175,'127.0.0.1',()=>console.log('http://127.0.0.1:4175/courses_introduction/'));
