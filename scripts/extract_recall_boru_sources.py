"""Internal, reading-order English transcriptions; artwork reviewed separately.
This source archive is not the chatbot's reviewed rules reference.
"""
from pathlib import Path
import re
import pdfplumber

root=Path(__file__).resolve().parents[1]
for slug, filename in [('recall','Recall_Englishrules_compressed.pdf'),('brian-boru','Brian_Boru_Rulebook.pdf')]:
    source=root/f'content/games/{slug}/source/{filename}'
    parts=[f'# {slug} — supplied English rulebook transcription',
        'Internal source transcript. Columns are extracted separately to repair reading order. Text-only extraction cannot reproduce pictograms or spatial relationships: consult the supplied PDF and image-sources.json. Reviewed semantic equivalents, including visually verified icons, are in ../rules.en.md and ../rules.zh.md.']
    with pdfplumber.open(source) as pdf:
        for number,page in enumerate(pdf.pages,1):
            parts.append(f'\n## PDF page {number}\n')
            split=(slug=='recall' and number>=2) or (slug=='brian-boru' and number in [2,4,5,7,8,9,12])
            chunks=[page.crop((0,0,page.width/2,page.height-12)),page.crop((page.width/2,0,page.width,page.height-12))] if split else [page]
            for chunk in chunks:
                text=chunk.extract_text(x_tolerance=2) or ''
                text=text.replace('ﬁ','fi').replace('ﬂ','fl')
                for a,b in [('fi rst','first'),('fi nal','final'),('fi eld','field'),('fi nd','find'),('fi g','fig'),('fi ve','five'),('eff ect','effect'),('diff er','differ'),('Shuffl e','Shuffle'),('shuffl e','shuffle'),('fl ip','flip'),('fl e','fle'),('fulfi l','fulfil'),('specifi c','specific'),('identifi ed','identified'),('Effi ciency','Efficiency'),('defi n','defin')]:
                    text=text.replace(a,b)
                text=re.sub(r'^\d{1,2}\s*$','',text,flags=re.M)
                parts.append(text.strip())
    (source.parent/'rulebook-text.en.md').write_text('\n\n'.join(parts)+'\n',encoding='utf-8')
    print(slug, 'transcribed', len(pdf.pages), 'pages')
