import pathlib, json, sys
sys.path.insert(0, str(pathlib.Path.home() / "AppData/Roaming/Python/Python312/site-packages"))
from graphify.detect import detect
result = detect(pathlib.Path("."))
out = pathlib.Path("graphify-out/.graphify_detect.json")
out.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
# print summary
files = result.get("files", [])
print(f"Detected {len(files)} files")
exts = {}
for f in files:
    ext = pathlib.Path(f.get("path", "")).suffix or "(no ext)"
    exts[ext] = exts.get(ext, 0) + 1
for ext, count in sorted(exts.items(), key=lambda x: -x[1]):
    print(f"  {ext or '(no ext)'}: {count}")
print(f"Output written to graphify-out/.graphify_detect.json")
