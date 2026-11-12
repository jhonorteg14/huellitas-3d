"""Arma index.html (web pública) y preview.html (vista previa en Claude) a partir de src/body.html."""
import json, pathlib
root = pathlib.Path(__file__).parent
body = (root / "src/body.html").read_text(encoding="utf-8")
seed = {n: json.loads((root / f"data/{n}.json").read_text(encoding="utf-8")) for n in ("sitio", "trabajos", "resenas")}
seed_js = json.dumps(seed, ensure_ascii=False).replace("</", "<\\/")

head = """<title>Huellitas 3D</title>
<meta name="description" content="Huellitas 3D: diseño e impresión 3D en Cuenca, Ecuador. Figuras personalizadas, retratos de mascotas, piezas funcionales, maquetas, pintado a mano y proyectos de electrónica y robótica.">
<meta property="og:title" content="Huellitas 3D · Deja tu huella">
<meta property="og:description" content="Diseño e impresión 3D en Cuenca. Cotiza por WhatsApp.">
<meta property="og:image" content="img/baily.webp">
<meta name="theme-color" content="#060706">
<link rel="icon" href="admin/logo.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Figtree:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="assets/site.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Huellitas 3D","description":"Diseño e impresión 3D, pintado personalizado y proyectos de electrónica y robótica.","telephone":"+593992642244","email":"jhonorteg.ko@gmail.com","address":{"@type":"PostalAddress","streetAddress":"Presidente Córdova y Bajada del Vado","addressLocality":"Cuenca","addressCountry":"EC"},"geo":{"@type":"GeoCoordinates","latitude":-2.8974511,"longitude":-79.0105898},"openingHours":["Mo-Fr 08:00-18:00","Sa 07:00-13:00"],"founder":"John Macas","foundingDate":"2025","sameAs":["https://www.facebook.com/share/14dxGsj7DzV/","https://www.tiktok.com/@huellitas3d1"]}</script>
"""
scripts = f"""
<script type="application/json" id="seed">{seed_js}</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="assets/site.js"></script>
"""
full = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
{head}</head>
<body>
{body}
{scripts}</body>
</html>
"""
(root / "index.html").write_text(full, encoding="utf-8")
# Vista previa para Claude (el visor agrega su propio esqueleto)
(root / "preview.html").write_text(head.replace("<title>", '<meta name="claude:viewport-fit-sides" content="cover">\n<title>', 1).replace("<title>Huellitas 3D</title>", "<title>Huellitas 3D</title>") + body + scripts, encoding="utf-8")
print("ok")
