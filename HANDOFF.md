# HANDOFF — districtstudio.mx

Documento de traspaso para que cualquier Claude (o humano) en cualquier compu pueda retomar el trabajo sin contexto previo.

---

## 1. Qué es esto

Landing multi-página de **District Studio**: estudio creativo de FC Agency en Monterrey. Tres líneas principales:

1. **Estudio** de foto y video (renta por hora + membresías)
2. **Co-work** creativo por aplicación + programa piloto (Hot Desk, Art Residency, District Club)
3. **District Club** (membresía a la comunidad)
4. **Tienda** (próximamente, link deshabilitado)

Live: **https://districtstudio.mx**
Repo: **https://github.com/pradofox/districtstudio.mx**

---

## 1.5 Estado actual (2026-05-30)

- `main` está estable en `094dc08`. Todo lo último ya está deploy en Cloudflare.
- No hay branches WIP. Todo el trabajo se hace directo en main.
- Lo último que tocamos: copy del card co-work del home + foto B&N de la comunidad MADE en esa misma card.
- **Directorio de comunidad**: 5 perfiles llenos (Fely, Lilian, Prado Fox, Nacho, Darío). Todos con foto real en B&N. Faltan los miembros que vayan entrando.
- **Programa piloto co-work**: 3 cards (Hot Desk 50% off · Art Residency 75% off · District Club $500) con sección "Próximamente" abajo. Botón "Aplica al piloto" va a Tally form: `https://tally.so/r/0QaP1B`.
- **Cards "próximamente"** (Exhibición y Venta en home, Biblioteca Creativa en home, Biblioteca y Referencias en club, los 3 packs Individual/Pareja/Equipo del cowork): tienen marquee horizontal animado "Próximamente · Próximamente..." cruzando la imagen + 60% opacity en el contenido pero marquee a 100%.
- **Tienda en nav**: link a 40% opacity, click bloqueado (`onclick="event.preventDefault()"`), cursor preview "Próximamente" en hover.

---

## 2. Stack

| Capa | Tech | Notas |
|---|---|---|
| Markup | HTML5 plano | 7 páginas .html, sin template engine |
| Estilos | CSS3 + custom properties | `style.css` (1556 líneas), tokens en `:root` |
| JS | Vanilla | `scroll.js` (Lenis smooth scroll, reveal-on-scroll, cursor-follow, menú mobile) |
| Smooth scroll | Lenis 1.1.14 CDN | unpkg |
| Fonts | Aileron Heavy + Garet Book | self-hosted en `assets/fonts/` |
| Hosting | Cloudflare Pages (Workers Build) | auto-deploy desde main, ~2 min |
| Forms | Tally | https://tally.so/r/0QaP1B para aplicaciones piloto co-work y club |

**Sin build step.** Los archivos se sirven tal cual. Cero `npm install`. Cero webpack/vite.

---

## 3. Dev local

```bash
# Opción 1: servir el repo directo
cd districtstudio.mx
python3 -m http.server 4873
# abre http://localhost:4873

# Opción 2 (la que se usa con preview de Claude):
# rsync a /tmp/district-studio/ + python http.server vía launch.json en ~/Code/.claude/
```

Después de cada edit local: `rsync -a districtstudio.mx/ /tmp/district-studio/` si estás usando el preview de `/tmp`.

---

## 4. Deploy

Git-push-based. Sin CI custom.

```bash
git add <files>
git commit -m "..."
git push          # → main → CF Workers Build → live en ~2 min
```

Cloudflare Pages tiene branch `cloudflare/workers-autoconfig` para su config interna. No tocar.

---

## 5. Estructura del repo

```
districtstudio.mx/
├── index.html         # home (hero + marquee + sobre + grid Espacios + calendario + FAQ + JSON-LD)
├── estudio.html       # estudio foto/video (hero + features 4 cols + renta por hora + membresías)
├── cowork.html        # co-work (hero + A quién buscamos + Programa piloto + Tu lugar siempre reservado + Beneficios)
├── club.html          # District Club (hero + Qué incluye + La membresía card horizontal + Calendario + Cómo aplicar)
├── comunidad.html     # comunidad (hero + A quién buscamos + Cómo ser parte + Directorio de miembros)
├── tienda.html        # placeholder (link deshabilitado en nav)
├── guide.html         # style guide interna
├── style.css          # sistema completo: tokens, type scale, grid, todos los componentes
├── scroll.js          # Lenis + reveal + cursor + mobile menu
├── site.webmanifest
├── robots.txt + llms.txt + sitemap.xml
├── _headers + _redirects  # Cloudflare config (cache, security headers)
└── assets/
    ├── fonts/         # Aileron-Heavy + Garet-Book (woff/woff2)
    ├── favicon/
    ├── logo/          # isotipo + wordmark (sets white/black)
    ├── images/
    │   ├── spaces/    # cards del home y heros (foto, detail, eventos, eventos-home, podcast, video, residencias, exhibicion, cowork-hero, club-hero, comunidad-hero)
    │   └── members/   # fotos del directorio de comunidad (fely-cepeda, lilian-balderas, prado-fox, nacho-contreras, dario-rangel)
    └── og/            # og-image.jpg para social
```

---

## 6. Sistema de diseño

Todo en `:root` de `style.css`. Cualquier cambio global = un commit pequeño en una sección.

**Type scale (clamp)**:
- `--text-h1` 48-112px (page hero, no usado actualmente, los heros usan h2)
- `--text-h2` 32-72px (section titles + page hero titles)
- `--text-h3` 24-54px (subsections, `.section__h3`)
- `--text-h4` 18-22px (card titles, plan names)
- `--text-lede` 18-22px (lede paragraphs)
- `--text-body` 16px (body text)
- `--text-small` 14px (descripciones de cards)
- `--text-micro` 12px (footnotes, labels)

**Pesos**:
- 900 (Aileron Heavy) — todos los headings
- 300 (sintetizado de Garet) — **TODOS los cuerpos de texto**
- 400 (Garet Book) — default body, no se usa explícitamente

**Color**:
- `--black #000`, `--white #FFF`, `--gray #1A1A1A`, `--muted #888`
- `--bg` y `--fg` cambian con `prefers-color-scheme`
- **`.force-dark` / `.force-light`** — helpers para forzar modo en cada sección

**Grid**:
- `--grid-max: 1400px`
- `--pad-x: 32px` (sides), `--pad-y: 120px` (vertical sections)
- `--gap: 48px`

---

## 7. Componentes clave

- **`.nav`** — header sticky, hamburguesa overlay en mobile (<760px). Link Tienda con `.nav__link--soon` (transparency + click bloqueado + cursor preview).
- **`.page-hero`** — `<header>` full-bleed con `background-image`, gradient overlay oscuro + dark cap arriba (180px) para legibilidad del nav, fade-to-white opcional cuando la sección siguiente es `.force-light`.
- **`.section__head` + `.section__body`** — patrón estándar: label + h2/h3 + grid de párrafos.
- **`.plans` / `.plan--pilot` / `.plan--horiz`** — cards de membresía. Variant `--pilot` con badge tipo píldora, precio tachado + final, lista de features, sección "Próximamente" con border dashed.
- **`.features`** — grid de 4 cols con foto cuadrada + título + checks (estudio "Todo para tu producción", club "Qué incluye").
- **`.soon-marquee`** — banda horizontal animada "Próximamente · Próximamente..." que se aplica sobre imagen + .space--soon / .feature--soon / .plan--soon para 60% opacity en contenido (marquee a 100%).
- **`.spaces` (home)** — grid de 6 cards clicables (`<a>` cada una).
- **`.members`** — directorio del comunidad page, filtros all/actuales/alumni vía `data-status`.

---

## 8. Convenciones

- **Commits** en español, descriptivos. Co-Author de Claude opcional.
- **Copy** en español MX (sin "voseo"). Tono curado, directo, sin tecnicismos de moda.
- **Imágenes**: B&N, redimensionadas a max 1600-2000px lado largo, JPEG quality 85-88. Pipeline:
  ```python
  from PIL import Image
  img = Image.open(src)
  # resize si >1600
  gray = img.convert('L').convert('RGB')
  gray.save(out, 'JPEG', quality=85)
  ```
- **Naming de imágenes**: descriptivo (no IMG_0203). Spaces como `cowork-hero.jpg`, members como `nombre-apellido.jpg`.
- **WhatsApp links**: número `528120743501`. Mensajes precargados unificados por sección (ver mapping abajo).
- **Tally form**: `https://tally.so/r/0QaP1B` para Programa Piloto Co-work y Aplicación al Club.

### Mensajes WhatsApp por botón

| Página · Botón | Mensaje |
|---|---|
| Estudio · Reservar estudio | "Quiero agendar el estudio" |
| Estudio · Obtener membresía | "Quiero obtener mi membresía de District Studio Foto y Video" |
| Cowork · Aplica al co-work (todos) | "Me interesa aplicar a District Co-work" |
| Cowork · Aplica al piloto | → Tally form (no WhatsApp) |
| Club · Aplica al club (ambos) | → Tally form (no WhatsApp) |

---

## 9. Cosas a saber / gotchas

- **El nav Tienda tiene `onclick="event.preventDefault()"`**. Cuando active la tienda, quitar ese atributo y la clase `nav__link--soon` de los 5 archivos HTML.
- **Las cards "soon"** (5 cards en home + club + 3 packs en cowork) tienen marquee + 60% opacity. Para "activarlas" hay que quitar `--soon` del article y borrar el `<div class="soon-marquee">`.
- **`eventos.jpg` vs `eventos-home.jpg`**: el primero lo usan estudio/club/comunidad/tienda como placeholder genérico, el segundo es la foto real de evento solo para el card del home. **No los mezcles.**
- **Heros tienen un fade-to-white al final** cuando la siguiente sección es `.force-light` (vía `:has` selector). Funciona en navegadores modernos; degrada bien si no.
- **El gradient del hero** tiene dos capas: una banda oscura sólida arriba (0.78 → 0 en 180px) para legibilidad del nav, sumada al gradient base. Si vuelves a tener texto del nav ilegible sobre alguna foto nueva, ajusta el stop del primer gradient en `.page-hero::before`.
- **Botón "Aplica al co-work" debajo de los Paquetes** está comentado en HTML porque los packs están como "Próximamente". Para reactivarlos: descomentar las 4 líneas marcadas `<!-- Botón oculto temporalmente porque los paquetes están "Próximamente" -->`.
- **Cmd+Shift+R** después de cada deploy para bypass del cache del browser.
- **La preview de Claude** corre en `localhost:4873` desde `/tmp/district-studio/`. Tras cada edit hacer `rsync` para sincronizar.

---

## 10. Para retomar el trabajo (fresh Claude o nueva compu)

```bash
gh repo clone pradofox/districtstudio.mx
cd districtstudio.mx
python3 -m http.server 4873
# o usar el preview de Claude apuntando a /tmp/district-studio/
```

Luego leer este HANDOFF.md + el README.md y ya. El sistema de diseño está autocontenido en `style.css` con tokens en `:root`. Todas las páginas siguen la misma estructura: nav idéntico, page-hero, secciones, footer idéntico.

Cualquier cambio global se hace en `style.css` (tokens). Cualquier cambio de copy en el HTML específico.

---

**Última actualización**: 2026-05-30
**Mantenido por**: sopadeletras® (Lili Balderez + Roberto Prado) para FC Agency
