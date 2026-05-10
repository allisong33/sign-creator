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
- `src/train/` — parallel structure (planned, Phase 6+)

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
| 3 | Bus API stop-first mode (multi-route) | **Next** |
| 4–5 | Bus custom mode polish, data refinement | Future |
| 6–9 | Train station JSON, icons, multi-line, API | Future |
| 10 | Unified UI + Vercel deployment | Future |

## Open questions — stop and ask, do not silently resolve

- Direction selector: required for route→stop lists? (Deferred to Phase 5)
- Stops with > 5 routes: currently silently capped at 5 (first 5 returned by API). Warn the user or let them pick? (Revisit Phase 3)
- Frequency number in the clock face: is it in the API `attributes.headway_secs`? (Investigate Phase 5)
- Green Line station grouping by branch? (Deferred to Phase 6)
- Multi-line station visual style? (Deferred to Phase 8)
