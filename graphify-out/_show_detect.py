import json
from pathlib import Path

d = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
files = d.get('files', {})
code = files.get('code', [])
doc = files.get('document', [])
paper = files.get('paper', [])
img = files.get('image', [])
vid = files.get('video', [])
total = len(code)+len(doc)+len(paper)+len(img)+len(vid)
print(f'Corpus: {total} files - {d.get("total_words",0):,} words')
if code: print(f'  code:     {len(code)} files')
if doc: print(f'  docs:     {len(doc)} files')
if paper: print(f'  papers:   {len(paper)} files')
if img: print(f'  images:   {len(img)} files')
if vid: print(f'  video:    {len(vid)} files')

skip = d.get('skipped_sensitive', [])
if skip: print(f'Skipped {len(skip)} sensitive files')

scan_root = d.get('scan_root', str(Path.cwd()))
from collections import Counter
subdirs = Counter()
for ftype, flist in files.items():
    for f in flist:
        fp = Path(f).resolve()
        try:
            rel = str(fp.relative_to(Path(scan_root).resolve()))
        except:
            rel = str(fp)
        relfwd = rel.replace('\\', '/')
        if relfwd.startswith('graphify-out/') or '/graphify-out/' in relfwd:
            continue
        parts = relfwd.split('/')
        if len(parts) > 1:
            subdirs[parts[0]] += 1
        else:
            subdirs['(root)'] += 1

if subdirs:
    print()
    print('Top subdirectories:')
    for dname, cnt in subdirs.most_common(10):
        print(f'  {dname}: {cnt} files')