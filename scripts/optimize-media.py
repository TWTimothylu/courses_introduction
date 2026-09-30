from pathlib import Path
from PIL import Image, ImageOps
import subprocess,json
root=Path(__file__).resolve().parents[1]
a=root/'dist/assets'
ff=root/'.openai/ffmpeg.exe'
for name in ['class','competition']:
    with Image.open(a/(name+'.jpg')) as src:
        src=ImageOps.exif_transpose(src).convert('RGB')
        for width in [640,1280]:
            im=src.resize((width,round(src.height*width/src.width)),Image.Resampling.LANCZOS)
            im.save(a/(name+'-'+str(width)+'.webp'),'WEBP',quality=82,method=6)
with Image.open(a/'brand-logo.png') as src:
    src.thumbnail((128,128),Image.Resampling.LANCZOS)
    src.save(a/'brand-logo-small.webp','WEBP',lossless=True,method=6)
    src.save(a/'favicon.png',optimize=True)
for name in ['robot','scratch']:
    target=a/(name+'-web.mp4')
    subprocess.run([str(ff),'-y','-hide_banner','-loglevel','error','-i',str(a/(name+'.mp4')),'-vf','scale=720:720','-c:v','libx264','-preset','slow','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',str(target)],check=True)
    frame=root/'.openai'/(name+'-poster.png')
    subprocess.run([str(ff),'-y','-hide_banner','-loglevel','error','-ss','2','-i',str(target),'-frames:v','1',str(frame)],check=True)
    with Image.open(frame) as im: im.save(a/(name+'-poster.webp'),'WEBP',quality=82,method=6)
print(json.dumps({p.name:p.stat().st_size for p in a.iterdir()},indent=2))
