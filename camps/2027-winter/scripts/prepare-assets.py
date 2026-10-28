from pathlib import Path
from PIL import Image,ImageOps
import argparse
parser=argparse.ArgumentParser(description='Prepare assets from the retained camp source-material folder.')
parser.add_argument('--source-dir', type=Path, default=Path(__file__).resolve().parents[4]/'營隊課程')
root=parser.parse_args().source_dir.resolve()
if not (root/'網頁用素材').is_dir():
 raise SystemExit('Source materials not found. Pass --source-dir pointing to 營隊課程.')
out=Path(__file__).resolve().parents[1]/'public/assets';out.mkdir(parents=True,exist_ok=True)
sources={'rc.webp':root/'網頁用素材/樂高科技遙控車營-招生廣告-1x1-v6.png','scratch.webp':root/'網頁用素材/Scratch遊戲營_查看課程主圖_1x1.png','essential.webp':root/'網頁用素材/小小樂高工程師營-招生廣告-1x1-v3.png','class2.webp':root/'素材/小小機器人營3.jpg'}
for name,p in sources.items():
 im=ImageOps.exif_transpose(Image.open(p)).convert('RGB');im.thumbnail((960,960));im.save(out/name,'WEBP',quality=85)
for size in [640,960]:
 im=ImageOps.exif_transpose(Image.open(root/'素材/小小機器人營1.jpg')).convert('RGB');im.thumbnail((size,size));im.save(out/f'class-{size}.webp','WEBP',quality=85)
im=Image.open(root/'網頁用素材/brand-logo.png');im.thumbnail((160,160));im.save(out/'logo.png')
print('Prepared 7 web assets.')

