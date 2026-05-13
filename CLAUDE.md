# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal browser-based MBTA-style sign maker for bus stops and train stations. Supports manual ("Create Your Own") and MBTA V3 API-assisted sign creation. Output is SVG/PNG export. Not an official MBTA tool.

## Development server

There is no build step. Both files must be served over HTTP — **do not open as `file://`**:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/bus.html or http://localhost:8080/train.html
```

`bus.html` uses `<script type="module">` (imports `src/bus/renderer.js` and `src/bus/api.js`), which requires HTTP. `train.html` loads `<image href="...">` assets from `public/assets/train/`, which also fails over `file://`.

**After editing any ES module (`src/bus/*.js`), do a hard refresh** (`Cmd+Shift+R` / `Ctrl+Shift+R`) — browsers cache ES modules within a session. If the import references a name that doesn't exist in the cached module, the entire `<script type="module">` block silently fails with no UI error.

There are no tests, linters, or CI scripts at this time.

## Architecture

**Stack:** Vanilla HTML/JS, `<script type="module">` for ES modules, no bundler, no framework. Planned migration to Vite/React at Phase 10 (unified UI) if needed.

**Homepage and navigation:**

| File | What it does |
|------|-------------|
| `index.html` | Default homepage (Night Sky design). Checks `localStorage('acTheme')` at load and immediately redirects to `index2/3/4.html` if a preference is set. |
| `index2.html` | Alternate homepage — Google search-page clone style |
| `index3.html` | Alternate homepage — 1999 MSN portal style |
| `index4.html` | Alternate homepage — Windows 98 desktop simulation |
| `themes.html` | Style chooser — lets Alex pick which homepage shows at `/`. Writes `acTheme` to `localStorage`. |
| `vercel.json` | Tells Vercel this is a static site (`"buildCommand": "", "outputDirectory": "."`) |

`bus.html` and `train.html` both have a fixed 36px `.site-nav` bar (beige, Inter) linking back to `index.html` and cross-linking to each other. The nav CSS is inlined in each file's `<style>` block.

**Two independent sign tools:**

| File | What it does |
|------|-------------|
| `bus.html` | Bus stop sign maker — one or more routes, clock icon, tow zone |
| `train.html` | Train station sign maker — line color, station name, icons, optional maps |

**Sign rendering approach (bus):**

The bus sign SVG lives as a **live DOM element** inside the page so that `foreignObject` text heights can be measured via `offsetHeight` after the browser paints. This measurement drives the **Domino Effect** algorithm: when stacked route blocks overflow the safe zone above the Tow Zone, all lower elements are shifted down by the exact overflow amount and the SVG canvas is expanded to match. The key layout constants are:

- Pill height: 200px | Padding below pill: 20px | Gap between routes: 67px
- Tow Zone start Y: 1290 | Buffer above Tow Zone: 40px → collision line = 1250
- Base canvas height: 2065px

The `outer-perimeter-border` path cannot be translated — its bottom coordinates (`2030`, `2065`) must be updated via string replacement when the canvas expands.

**Critical `foreignObject` constraint:** The destination text `<div>` inside `<foreignObject>` must NOT have `height: 100%`. That causes `offsetHeight` to return the full `foreignObject` container height (400px) instead of the actual rendered text height (~110px per line at font-size 100px, line-height 1.1). Remove `height: 100%` and leave only `width: 100%`.

**Sign rendering approach (train):**

Currently generates SVG as a string in `buildSvg()` and sets `innerHTML`. Icons and maps are loaded as `<image href="...">` pointing to `public/assets/train/`.

**`src/` directory** is reserved for ES modules extracted from the HTML files:
- `src/bus/renderer.js` — `renderSign(state)`, `getSignSvgString()`, Domino Effect logic
- `src/bus/api.js` — `fetchBusRoutes()`, `fetchStopsForRoute()`, `fetchRoutesForStop()`
- `src/bus/state.js` — sign state management (planned)
- `src/train/data.js` — curated station data for all MBTA rapid transit lines; each station has `id`, `name`, optional `signName`, optional `placeId`
- `src/train/api.js` — `fetchStationFacilities(placeId)` for elevator/escalator data from MBTA V3 `/facilities`

**Export pipeline:**

SVG export serializes the live DOM: `new XMLSerializer().serializeToString(svgEl)`. PNG export draws the serialized SVG onto a `<canvas>` at 2× the viewBox dimensions. PNG dimensions must read from the live viewBox attribute — never hardcode — because the Domino Effect can expand the canvas beyond the base 2065px height.

**PNG export and `foreignObject`:** Browsers taint the canvas when an SVG containing `<foreignObject>` is drawn onto it, causing `toBlob()` to throw a `SecurityError`. For PNG export, `stripForeignObjects()` in `bus.html` clones the SVG, word-wraps each destination text using canvas `measureText()`, and replaces every `<foreignObject>` with native SVG `<text>`/`<tspan>` elements before drawing. The live DOM and SVG download are unaffected. The SVG clone for PNG also needs explicit pixel `width`/`height` attributes — the live SVG uses `width="100%" height="100%"` which has no intrinsic size when loaded as a standalone image.

## MBTA V3 API

- Base URL: `https://api-v3.mbta.com`
- Auth header: `x-api-key: <key>`
- Bus routes: `GET /routes?filter[type]=3` — type 3 = bus (GTFS standard)
- Frequent bus routes: `attributes.description === "Frequent Bus"` (renamed from "Key Bus" in December 2024)
- Stops for a route: `GET /stops?filter[route]={routeId}&fields[stop]=name`
- All routes at a stop: `GET /routes?filter[stop]={stopId}&filter[type]=3&fields[route]=short_name,long_name,description,direction_destinations`
- Direction determination: `GET /stops?filter[route]={routeId}&filter[direction_id]=0&fields[stop]=id` — if stopId appears, direction is 0; otherwise 1. Use `direction_destinations[direction]` as the destination text (e.g. "Back Bay Station"), not `long_name` (which includes both terminals and "via" text).
- API key lives in `src/bus/api.js` as a constant. **TODO (Phase 10):** move to a Vercel serverless proxy; see `docs/API-Notes.md`

## UI conventions (bus.html controls)

Button classes and their colors:
- `.add` — MBTA yellow `#F9B326`, dark text — used for **+ Add Route**
- `.remove` — red `#b71c1c`, white text — used for **Remove route**
- `.export` — steel blue `#546e7a`, white text — used for all three export buttons
- `.mode-toggle button.active` — MBTA yellow `#F9B326`, dark text — active mode tab

## Key reference files

| Path | Purpose |
|------|---------|
| `PRDs_and_plans/FOR_MVP_MBTA-Sign-App-for-Alex-Phased-PRD.md` | Source of truth for scope, phase boundaries, data models, acceptance criteria |
| `PRDs_and_plans/TECHNICAL_REFERENCE_Bus_Sign_Domino_Effect_for_Resizing_Bus_Stop_Sign_SVGs_based_on_number_of_Routes.md` | Layout constants and Domino Effect math |
| `public/assets/bus/templates/dynamic_svg_template_for_resizing_bus_sign_based_on_number_of_routes.svg` | Master bus SVG template; `route-item-template` is the cloneable group |
| `public/assets/bus/templates/javascript_snippet-resize_bus_stop_signs_based_on_number_of_routes.js` | Reference algorithm for the Domino Effect (partial stub, not executed directly) |
| `docs/superpowers/plans/2026-05-07-mbta-sign-app-full-plan.md` | Full implementation plan through Phase 10 with task-level detail for Phases 1–2 |

## Phase status

| Phase | What | Status |
|-------|------|--------|
| 0 | Alpha prototypes + repo reorg | Done |
| 1 | Multi-route bus rendering engine (Domino Effect) | Done |
| 2 | Bus API route-first mode + multi-route stop fill | Done |
| 3 | Bus API stop-first mode (multi-route, live stop search) | Done |
| 4 | Bus custom mode enhancement (labels, field order, offline-safe) | Done |
| 5 | Bus polish — stop search, export filenames, Start Over, error states | Done |
| 6 | Train station JSON mode — `src/train/data.js`, Use Station Data tab, station picker | Done |
| 7 | Train 4 icon slots (left-1/2, right-1/2) + accessibility API (`src/train/api.js`) | Done |
| 8 | Train multi-line station support (Downtown Crossing = Red + Orange, etc.) | **Next** |
| 9 | Train API deeper exploration (real-time alerts, departures, etc.) | Future |
| 10 | Unified UI + Vite/React migration | Future |
| — | Homepage (4 designs) + Vercel deployment at adventurecore.org | Done (outside phase plan) |

## Open questions — stop and ask, do not silently resolve

- Direction selector: required for route→stop lists? (Deferred to someday-maybe)
- Stops with > 5 routes: currently silently capped at 5 (first 5 returned by API). Warn the user or let them pick? (Resolved as "silent cap for now")
- Frequency number in the clock face: is it in the API `attributes.headway_secs`? (See `docs/someday-maybe.md`)
- Multi-line station visual style? (Deferred to Phase 8)
- placeId coverage: Green Line branch surface stops and most Commuter Rail stations don't have placeIds in `src/train/data.js` yet — add when needed
