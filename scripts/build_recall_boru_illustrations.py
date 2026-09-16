"""Reproduce source-art crops. Requires Pillow, pdfplumber and Poppler pdftoppm.
Coordinates use the 1200px-long-edge review renders (Recall 901x1200;
Brian Boru 1200x1200). No diagram content is painted over or invented.
"""
import hashlib
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    'recall': ('Recall_Englishrules_compressed.pdf', [901, 1200], [
        ('keycard.webp', 6, [466, 77, 565, 313]),
        ('recall.webp', 7, [460, 94, 863, 335]),
        ('crystals.webp', 7, [150, 839, 399, 1155]),
        ('water-movement.webp', 10, [531, 225, 859, 346]),
        ('relicube.webp', 10, [479, 516, 772, 694]),
        ('reveal.webp', 6, [432, 777, 878, 1009]),
        ('shared-building.webp', 8, [183, 942, 313, 1066]),
        ('camps.webp', 8, [509, 918, 825, 1069]),
        ('vault.webp', 9, [88, 213, 351, 326]),
        ('monuments.webp', 12, [461, 788, 823, 1023]),
        ('excavation.webp', 9, [399, 1004, 513, 1134]),
    ]),
    'brian-boru': ('Brian_Boru_Rulebook.pdf', [1200, 1200], [
        ('trick-cards.webp', 7, [113, 532, 536, 702]),
        ('expansion.webp', 7, [189, 982, 458, 1180]),
        ('courtship.webp', 7, [669, 848, 1022, 1020]),
        ('icon-coin.webp', 6, [181, 237, 255, 297]),
        ('icon-renown.webp', 6, [181, 369, 256, 431]),
        ('icon-church.webp', 6, [189, 435, 254, 501]),
        ('icon-battle.webp', 6, [189, 505, 259, 569]),
        ('icon-courtship.webp', 6, [181, 593, 254, 650]),
        ('icon-expand.webp', 6, [181, 692, 266, 753]),
        ('icon-liberate.webp', 6, [181, 782, 253, 846]),
    ])
}
scratch = ROOT / 'tmp/onboard/artwork'
scratch.mkdir(parents=True, exist_ok=True)
for slug, (filename, reference_size, crops) in SOURCES.items():
    source = ROOT / f'content/games/{slug}/source/{filename}'
    canonical = ROOT / f'content/games/{slug}/images'
    public = ROOT / f'public/guide-assets/{slug}'
    canonical.mkdir(parents=True, exist_ok=True)
    public.mkdir(parents=True, exist_ok=True)
    images = {}
    records = []
    sizes = {}
    for name, page, rect in crops:
        if page not in images:
            prefix = scratch / f'{slug}-{page}'
            subprocess.run(['pdftoppm', '-f', str(page), '-l', str(page), '-singlefile', '-scale-to', '2400', '-png', str(source), str(prefix)], check=True, capture_output=True)
            images[page] = Image.open(str(prefix)+'.png').convert('RGB')
        im = images[page]
        sx, sy = im.width/reference_size[0], im.height/reference_size[1]
        box = tuple(round(v*(sx if i%2==0 else sy)) for i,v in enumerate(rect))
        crop = im.crop(box)
        crop.save(canonical/name, 'WEBP', lossless=True)
        shutil.copy2(canonical/name, public/name)
        sizes[name] = list(crop.size)
        records.append({'file':name,'pdfPage':page,'referenceSize':reference_size,'crop':rect,'renderSize':list(im.size),'outputSize':list(crop.size),'assembly':'none','masking':'none'})
    (ROOT/f'public/games/{slug}/guide-image-sizes.js').write_text('export const imageSizes = '+json.dumps(sizes,indent=2)+';\n',encoding='utf-8')
    manifest={'source':f'source/{filename}','sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'edition':'Alion 2025, supplied clarified PDF modified 2026-01-06' if slug=='recall' else 'Osprey Games English first edition 2021','coordinateSystem':'Top-left origin; full MediaBox, unrotated','generator':'scripts/build_recall_boru_illustrations.py','images':records,'cover':{'source':'cover-art.webp' if slug=='recall' else 'pic6149105.webp','provenance':'User-supplied image; copied unchanged to public coverart.webp'}}
    (ROOT/f'content/games/{slug}/image-sources.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    print(slug, len(records), 'artwork crops')
