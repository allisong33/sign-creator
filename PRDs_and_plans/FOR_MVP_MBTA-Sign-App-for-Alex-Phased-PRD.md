# MBTA Sign App for Alex — Phased Product Requirements Document

*Updated 5/4/2026 while I was at the dentist with Violet!*

**Version:** Phased PRD draft  
**Date:** 2026-05-04  
**Working product name:** MBTA Sign App for Alex  
**Deployment assumption:** GitHub repo deployed through Vercel  
**Scope note:** Personal, digital-only, kid-friendly sign maker. Not an official MBTA tool and not for manufacturing real signs.

---

## 1. Product Summary

The MBTA Sign App for Alex is a browser-based app for creating MBTA-style bus stop signs and train/station signs.

It should support:

1. **MBTA-data-assisted signs** — user selects real routes/stops/stations and the app fills fields.
2. **Create Your Own signs** — user manually types route/station/stop text and makes pretend/custom signs.

Core principle:

> Keep static sign templates/assets separate from dynamic fields.

Dynamic fields include route numbers, stop/station names, stop numbers, line colors, icons, maps, and which SVG template is used.

---

## 2. Current Status

### Bus Alpha

A working one-route bus stop sign alpha exists. It supports:

- manual route number;
- manual destination/stop text;
- manual bus stop number;
- frequent-service clock yes/no;
- live preview;
- SVG export;
- PNG export.

The current bus SVG template supports **one route only**.

### Train Alpha

A working train/station sign alpha exists. It supports:

- line color selection;
- station name;
- sub-header text;
- icons;
- maps;
- live preview;
- SVG export;
- PNG export.

The train alpha currently uses external assets, but stable assets should move into the repo.

---

## 3. Goals

### User-facing goals

- Let Alex make MBTA-style bus signs.
- Let Alex make MBTA-style train/station signs.
- Keep the app simple and fun.
- Support both real-data-assisted and custom/pretend signs.
- Provide live preview.
- Provide SVG/PNG export.

### Technical goals

- Reusable SVG templates.
- Dynamic editable content.
- No baked-in route/station text.
- Repo-hosted assets instead of Dropbox links.
- GitHub + Vercel deployment.
- Bus and train phases separated.
- Avoid overbuilding UI before core sign logic works.

---

## 4. Non-Goals

Early versions should not be:

- a full graphic design editor;
- a mobile app;
- a user-account system;
- an official MBTA-compliant sign production tool;
- a database-backed project system;
- a perfect recreation of every MBTA sign type;
- a full transit-planning app.

---

## 5. Major Product Decision: Bus First

Bus mode should come first because:

- the one-route bus SVG works;
- the API route → stop flow is concrete;
- the dynamic fields are clear;
- the user wants a break from manual SVG design;
- API output can be limited to one displayed route until more templates exist.

Train mode remains alpha until bus mode is stable.

---

## 6. Repo, Assets, and Deployment

### GitHub + Vercel

The app will likely live in GitHub and deploy to Vercel.

It can start as plain HTML/CSS/JavaScript. Later it may move to React/Vite/Next if the UI becomes complex.

### Public repo vs. public/static assets

A public GitHub repo means the files are visible in GitHub.  
A public/static asset folder means the deployed app can load those files by URL.

For this project, most assets are not private. They need to be browser-accessible.

### Recommended structure for simple static app

```text
index.html
bus.html
train.html
assets/
  bus/
    templates/
  train/
    icons/
    maps/
    templates/
docs/
  UI-Research-and-Wishlist.md
  API-Notes.md
```

### Recommended structure if using a framework

```text
public/
  assets/
    bus/
      templates/
    train/
      icons/
      maps/
      templates/
src/
docs/
  UI-Research-and-Wishlist.md
  API-Notes.md
```

### Do we need `public/`?

Not necessarily for a simple static HTML app.  
If using a framework, `public/` is usually the simplest way to serve stable URL-addressable assets.

“Public” here means browser-loadable, not “previously secret.”

### Dropbox links

Dropbox raw links are okay for alpha testing only. Long term, move stable assets into the repo.

### Private information

Do not commit anything that would be a problem if public.

Likely okay to commit:

- SVG templates;
- map/image assets;
- icon SVGs;
- UI code;
- PRD/docs.

Potentially sensitive:

- API keys;
- private notes;
- local file paths.

---

## 7. MBTA API Key Strategy

The user already has an MBTA V3 API key.

### Alpha recommendation

Use browser-direct API calls first.

Pros:

- fastest;
- simplest;
- no backend;
- good for API exploration.

Cons:

- any key used in browser JavaScript is visible.

This is acceptable for alpha if the user is comfortable with it.

### Later option

Use a Vercel serverless proxy and store the API key in Vercel environment variables if key hiding, caching, or API protection becomes important.

---

## 8. Top-Level App Structure

Final app:

```text
BUS | TRAIN
```

Each mode should offer:

```text
Use MBTA Data | Create Your Own
```

Conceptual structure:

```text
App
├── Bus Mode
│   ├── Use MBTA Data
│   └── Create Your Own
└── Train Mode
    ├── Station List / API-Assisted
    └── Create Your Own
```

---

# 9. Phase Plan

## Phase 0 — Existing Alpha Prototypes

Status: done / mostly done.

### Bus

- One-route manual bus sign.
- Clock yes/no.
- Live preview.
- SVG/PNG export.

### Train

- Manual train/station sign.
- Line color selection.
- Icons.
- Maps.
- SVG/PNG export.

---

## Phase 1 — Bus API Route-First Mode with One-Route Output

This is the next build phase.

Purpose: begin using MBTA V3 API without requiring new SVG templates.

### User flow

```text
Bus
→ Use MBTA Data
→ Choose route
→ Choose stop
→ App fills one-route bus sign
→ User can edit fields manually
→ Export
```

### API-filled fields

When user selects route + stop:

- black pill route number = selected route short name;
- stop/destination text = selected stop name for now;
- bus stop number = selected stop ID if it matches bus stop number behavior;
- frequent clock = yes/no if known, otherwise manual fallback.

### One-route limitation

Even if the stop has multiple routes, Phase 1 displays only the route the user selected.

### Custom override

After API fill, user can edit:

- route number;
- stop/destination text;
- stop number;
- frequent clock toggle.

### Frequent clock logic

Because it is not yet confirmed whether the API directly identifies frequent bus routes in the needed way:

1. Start with a local `FREQUENT_BUS_ROUTES` list if available.
2. If unknown, leave clock as manual.
3. Explore API support later.

### Conceptual endpoints

```text
GET /routes?filter[type]=3&fields[route]=short_name,long_name,direction_names,direction_destinations&sort=short_name
```

Purpose: populate route dropdown.

```text
GET /stops?filter[route]={route_id}&fields[stop]=name&sort=name
```

Purpose: populate stop dropdown.

Use stop object `id` as the first candidate for bus stop number.

### Acceptance criteria

- User can choose “Use MBTA Data.”
- App loads bus routes.
- User chooses route.
- App loads stops for selected route.
- User chooses stop.
- App fills one-route sign.
- User can edit after API fill.
- API failure shows friendly message.
- Custom mode still works.
- SVG/PNG export still works.

---

## Phase 2 — Bus Custom Mode Cleanup

Purpose: make the manual bus builder clean and reliable.

Scope:

- Keep one-route custom mode.
- Add clear custom/API mode selector.
- Ensure custom mode works offline/no API.
- Improve labels.
- Rename clock toggle to something like “Show frequent-service symbol.”

Acceptance criteria:

- Custom mode works without API.
- User can export.
- API failure does not affect custom mode.

---

## Phase 3 — Bus Multi-Route Template Creation

Depends on new SVG templates.

User will create templates for:

- 2-route bus sign;
- 3-route bus sign;
- 4-route bus sign;
- 5-route bus sign.

Template registry concept:

```js
const BUS_TEMPLATES = {
  1: renderOneRouteBusSign,
  2: renderTwoRouteBusSign,
  3: renderThreeRouteBusSign,
  4: renderFourRouteBusSign,
  5: renderFiveRouteBusSign
};
```

5 routes is the practical initial max.

If a stop has more than 5 routes, app can:

- show first 5 and warn;
- ask user which routes to include;
- or suggest custom/manual mode.

Acceptance criteria:

- 1–5 route templates can render once templates exist.
- Blank custom route fields are ignored.
- Template matches active route count.
- Long text does not obviously break the sign.

---

## Phase 4 — Bus Stop-First API Mode

Purpose: user chooses stop first.

Flow:

```text
Bus
→ Use MBTA Stop Data
→ Search/select stop
→ App fetches bus routes serving stop
→ App counts routes
→ App chooses route-count template
→ User can edit
→ Export
```

Why later:

- many stops have similar names;
- some stops have too many routes;
- route order may matter;
- destination text may be ambiguous;
- direction may matter.

Acceptance criteria:

- User can search/select stop.
- App fetches routes serving stop.
- App counts routes.
- App chooses template for 1–5 routes.
- App handles more than 5 routes gracefully.

---

## Phase 5 — Bus Polish and Data Refinement

Scope:

- direction-aware route → stop lists;
- better stop search;
- better frequent route detection;
- better destination handling;
- text auto-fit;
- route number auto-fit;
- loading/error states;
- export filenames;
- Vercel asset cleanup.

Acceptance criteria:

- Alex can use bus flow without developer supervision.
- Long text works acceptably.
- Preview/export match closely.

---

## Phase 6 — Train Station JSON Mode

Purpose: train line → station dropdown with local JSON.

Flow:

```text
Train
→ Choose line
→ Station dropdown filters to that line
→ Choose station
→ App fills sign
→ User customizes icons/maps
→ Export
```

Use local JSON created from user’s station lists.

Recommended structure:

```js
const TRAIN_STATIONS = {
  red: [
    { name: "Alewife", lines: ["red"] },
    { name: "Davis", lines: ["red"] }
  ],
  green: {
    trunk: [
      { name: "Lechmere", lines: ["green"] },
      { name: "Science Park/West End", lines: ["green"] }
    ],
    b: [],
    c: [],
    d: [],
    e: []
  }
};
```

Acceptance criteria:

- User chooses line.
- Station dropdown updates.
- User chooses station.
- Header color/station text update.
- Export works.

---

## Phase 7 — Train Icon Slots and Arrow Assets

Scope:

- create left arrow by flipping right arrow horizontally;
- add more icon slots on left/right sides of white sub-header;
- support none/elevator/escalator/wheelchair/bus/right arrow/left arrow/airplane/etc.

Acceptance criteria:

- Icons can be chosen per slot.
- Slots can be blank.
- Icons render in preview/export.

---

## Phase 8 — Train Multi-Line Station Support

Scope:

- handle stations served by multiple lines;
- decide visual style:
  - sub-header text;
  - split color bands;
  - stacked labels;
  - or special templates.

Data model example:

```js
{
  name: "Downtown Crossing",
  lines: ["red", "orange"],
  defaultSubheader: "RED LINE / ORANGE LINE",
  templateType: "multi-line"
}
```

Acceptance criteria:

- Multi-line station metadata exists.
- At least one multi-line station design renders.
- User can override sub-header.

---

## Phase 9 — Train API Exploration

Explore whether MBTA API adds value for train signs.

Questions:

- Can API provide stations by line cleanly?
- How does it represent parent stations?
- How should Green Line branches be handled?
- Is curated JSON better for visual sign-making?

Recommendation: use curated station JSON first; add train API only if useful.

---

## Phase 10 — Unified UI and Vercel Deployment

Scope:

- combine Bus and Train modes;
- top-level tabs;
- Custom vs. MBTA Data workflows;
- shared preview/export controls;
- shared asset registry;
- child-friendly UI;
- responsive layout;
- repo asset paths;
- Vercel deployment.

Create:

```text
docs/UI-Research-and-Wishlist.md
```

Purpose:

- screenshots;
- UI inspiration;
- app-flow wishes;
- color/layout notes;
- kid-friendly design ideas;
- Alex mode vs. builder mode ideas.

Acceptance criteria:

- Bus and Train live in one shell.
- App deploys through GitHub/Vercel.
- Assets load from repo paths.
- UI feels coherent.

---

# 10. Data Models

## BusRouteBlock

```ts
type BusRouteBlock = {
  routeId?: string;
  routeNumber: string;
  displayText: string;
  showFrequentClock: boolean;
};
```

Example:

```js
{
  routeId: "109",
  routeNumber: "109",
  displayText: "Clarendon Ave @ Beacon St",
  showFrequentClock: false
}
```

## BusSignState

```ts
type BusSignState = {
  mode: "custom" | "api-route-first" | "api-stop-first";
  stopId?: string;
  stopNumber: string;
  stopName?: string;
  routes: BusRouteBlock[];
  templateRouteCount: 1 | 2 | 3 | 4 | 5;
};
```

## BusApiRoute

```ts
type BusApiRoute = {
  id: string;
  shortName: string;
  longName?: string;
  directionNames?: string[];
  directionDestinations?: string[];
};
```

## BusApiStop

```ts
type BusApiStop = {
  id: string;
  name: string;
  municipality?: string;
  onStreet?: string;
  atStreet?: string;
};
```

## TrainStation

```ts
type TrainStation = {
  id?: string;
  name: string;
  lines: string[];
  branches?: string[];
  defaultSubheader?: string;
  templateType?: "single-line" | "multi-line";
};
```

## TrainSignState

```ts
type TrainSignState = {
  mode: "custom" | "station-json" | "api-assisted";
  line: string;
  stationName: string;
  subheaderText: string;
  leftIcons: string[];
  rightIcons: string[];
  showMaps: boolean;
  mapSet?: string[];
};
```

---

# 11. API Plan

## Immediate API helpers

```js
async function fetchBusRoutes() {}
async function fetchStopsForRoute(routeId) {}
async function buildOneRouteSignFromRouteAndStop(route, stop) {}
```

## Later API helpers

```js
async function fetchRoutesForStop(stopId) {}
async function fetchStopDetails(stopId) {}
async function fetchRouteDetails(routeId) {}
```

## API failure handling

The app should handle:

- API unavailable;
- no routes returned;
- no stops returned;
- invalid route/stop;
- network offline;
- API key issue.

Friendly fallback:

```text
Could not load MBTA data right now. You can still create a custom sign.
```

---

# 12. Requirements Summary

## Bus

Must eventually support:

- custom mode;
- route-first API mode;
- stop-first API mode;
- 1–5 route templates;
- clock yes/no;
- manual override after API fill;
- SVG/PNG export.

## Train

Must eventually support:

- custom train sign;
- local station JSON mode;
- icons;
- maps;
- multi-line stations;
- possible API-assisted mode later.

## Export

Must support:

- SVG download;
- PNG download;
- open SVG in new tab.

Cross-origin PNG export problems should decrease once assets are served from the same repo/deployment.

---

# 13. Testing Checklist

## Bus manual tests

- Route `1`
- Route `39`
- Route `109`
- Route `7412`
- Short destination
- Long destination
- Clock on/off
- Empty stop number
- Long stop number
- SVG export
- PNG export

## Bus API tests

- Load route list
- Choose route
- Load stops
- Choose stop
- Fill sign
- Edit after API fill
- API failure fallback
- Vercel deployed version

## Train tests

- Choose each line
- Choose station
- Change icons
- Show/hide maps
- Export SVG
- Export PNG
- Multi-line station later

---

# 14. Open Questions

## Bus

- Should API-filled display text ultimately be selected stop name, route destination, or another field?
- Does MBTA stop ID always match the bus stop number printed on signs?
- Best source for frequent bus route status?
- Should direction be required later?
- How should stops with more than 5 routes be handled?

## Train

- Should Green Line stations be grouped by branch?
- How should multi-line stations render?
- Should train API ever replace curated JSON?
- Which train maps/assets should be first?

## Technical

- Vanilla HTML/JS or React/Vite later?
- Browser-direct MBTA API or Vercel proxy?
- Should app save user-created signs?
- Should export use serialized SVG, canvas, or a library?

---

# 15. Near-Term Build Order

1. Create bus API branch/working file.
2. Add Bus mode selector:
   - Create Your Own
   - Use MBTA Route Data
3. Keep current one-route manual sign working.
4. Add API route dropdown.
5. Add API stop dropdown.
6. On stop selection, fill route number, stop name/display text, stop number, frequent clock if known.
7. Allow manual edits after API fill.
8. Add loading/error states.
9. Move train assets from Dropbox to repo folders.
10. Create train station JSON from user’s station lists.
11. Add train station dropdown.
12. Return to bus SVG templates for 2–5 route signs.

---

# 16. One-Sentence Summary

Build Bus first: keep the working manual one-route bus sign, add MBTA V3 route-first API lookup next, limit API output to one displayed route until more SVG templates exist, then expand to multi-route bus templates, train station JSON, train icons/multi-line support, and finally a unified GitHub/Vercel app UI.
