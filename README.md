# district-studio-web

Landing de District Studio - estudio creativo de FC Agency en Monterrey.

## Stack

HTML + CSS + JS vanilla. Sin build step. Lenis via CDN. Cloudflare Pages.

## Dev local

```bash
python3 -m http.server 4873
# o
npx serve .
```

## Estructura

```
index.html    # landing completa
style.css     # tokens, layout, componentes
scroll.js     # Lenis, parallax, cursor-follow, reveal
assets/       # fonts, logo, images
_headers      # Cloudflare Pages headers
_redirects    # Cloudflare Pages redirects
```

## Assets pendientes

- `assets/fonts/Aileron-Heavy.woff2` (+ .woff)
- `assets/fonts/Garet-Book.woff2` (+ .woff)
- Fotos reales de los espacios en `assets/images/spaces/`
- Favicon y og-image generados desde isotipo

## Deploy

Push a `main` -> Cloudflare Pages redespliega.

## Handoff

`../../01_INPUT/PARA CLAUDE CODE/DISTRICT-handoff.md`
