# AdventureCore — MBTA Sign Maker

Live at **[adventurecore.org](https://adventurecore.org)**

A personal browser-based tool for making MBTA-style bus stop and train station signs. Built for Alex and the Adventure Friends. Not an official MBTA product.

## Tools

| Page | What it does |
|------|-------------|
| [bus.html](bus.html) | Bus stop sign maker — pick routes via MBTA API or enter manually, export as SVG or PNG |
| [train.html](train.html) | Train station sign maker — line color, station name, accessibility icons, optional maps |

## Homepages

There are four homepage designs. Visit `adventurecore.org` and use the **Themes** page to pick one — the choice is saved in the browser.

| File | Style |
|------|-------|
| `index.html` | Night Sky (default) |
| `index2.html` | Google-style |
| `index3.html` | 1999 MSN portal |
| `index4.html` | Windows 98 desktop |
| `themes.html` | Style chooser |

## Running locally

No build step. Serve over HTTP (ES modules and SVG assets don't work over `file://`):

```bash
python3 -m http.server 8080
# open http://localhost:8080/
```

Hard-refresh (`Cmd+Shift+R`) after editing any file in `src/bus/` — browsers cache ES modules within a session.

## Stack

Vanilla HTML/CSS/JS, ES modules, no bundler, no framework. Deployed on Vercel (static).
