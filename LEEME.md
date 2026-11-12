# Web de Huellitas 3D

Web pública + panel de administración (`/admin`) para editar trabajos, precios, textos, reseñas y avisos sin tocar código.

## Qué hay en cada carpeta

| Carpeta / archivo | Para qué sirve |
| --- | --- |
| `index.html` | La página que ven los visitantes |
| `assets/` | Estilos (`site.css`) y funciones (`site.js`) |
| `data/trabajos.json` | Lista de trabajos realizados (la edita el panel) |
| `data/sitio.json` | Textos, precio por hora, servicios, preguntas, contacto y aviso |
| `data/resenas.json` | Reseñas de clientes |
| `img/` | Fotos y videos iniciales |
| `uploads/` | Aquí guarda el panel las fotos y modelos 3D que subas |
| `admin/` | Panel de administración (Decap CMS) |

## Publicarla (una sola vez, unos 15 minutos)

1. **GitHub:** entra a github.com con tu cuenta `jhonorteg14` → botón **New repository** → nombre `huellitas-3d` → **Private** → Create.
   En el repositorio vacío toca **uploading an existing file** y arrastra TODO el contenido de esta carpeta (no la carpeta en sí). Commit.
2. **Netlify:** entra a app.netlify.com → **Sign up with GitHub** → **Add new site → Import an existing project → GitHub** → elige `huellitas-3d` → Deploy (no hay que configurar nada más).
3. **Nombre del sitio:** en Netlify, *Site configuration → Change site name* → `huellitas3d`. Tu web queda en `https://huellitas3d.netlify.app`.
   Si eliges otro nombre, cámbialo también en `admin/config.yml` (líneas `site_url` y `display_url`).
4. **Permitir el inicio de sesión del panel:**
   - En GitHub: *Settings → Developer settings → OAuth Apps → New OAuth App*.
     Homepage URL: `https://huellitas3d.netlify.app` · Authorization callback URL: `https://api.netlify.com/auth/done` → Register → copia el **Client ID** y genera un **Client secret**.
   - En Netlify: *Site configuration → Access & security → OAuth → Install provider → GitHub* → pega el Client ID y el Client secret.
5. Entra a `https://huellitas3d.netlify.app/admin`, toca **Iniciar sesión con GitHub** y listo.

## Usar el panel

- **Trabajos realizados → Lista de trabajos → Agregar Trabajo:** nombre, categoría, foto principal, más fotos, descripción. Marca *Destacado* para que salga primero, o desmarca *Visible* para ocultarlo sin borrarlo. Si subes un `.stl`, el trabajo muestra el botón **Ver en 3D**.
- **Ajustes de la web:** precio por hora, eslogan, servicios, preguntas frecuentes, horario, contacto y el **aviso de temporada** (ej.: “Retomamos el 16 de diciembre”).
- **Reseñas:** agrega reseñas reales de clientes.
- Toca **Publicar**. La web se actualiza sola en 1–2 minutos.

## Dominio propio (opcional)

Compra `huellitas3d.com` (o similar, unos USD 10–15 al año) en Namecheap, Cloudflare o GoDaddy y conéctalo en Netlify: *Domain management → Add a domain*.
