"""Empaqueta los fotogramas seq/<nombre>/NNN.webp en seq/<nombre>.json (un solo archivo por animación)."""
import base64, json, pathlib
root = pathlib.Path(__file__).parent / "seq"
for d in sorted(p for p in root.iterdir() if p.is_dir()):
    frames = sorted(d.glob("*.webp"))
    data = {"type": "image/webp", "frames": [base64.b64encode(f.read_bytes()).decode() for f in frames]}
    out = root / f"{d.name}.json"; out.write_text(json.dumps(data), encoding="utf-8")
    print(d.name, len(frames), out.stat().st_size // 1024, "KB")
