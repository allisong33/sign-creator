# MBTA Sign App — Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers-extended-cc:subagent-driven-development` (recommended) or `superpowers-extended-cc:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based MBTA-style sign maker that renders dynamic multi-route bus signs and train station signs, fed by manual input or the MBTA V3 API, with SVG/PNG export.

**Architecture:** Vanilla HTML/JS with ES modules and no build step. Sign rendering is DOM-based (live SVG element in the page) so that `foreignObject` text heights can be measured after paint — this drives the "Domino Effect" auto-resize algorithm. Export serializes the live SVG to a string for download. API logic is isolated in `src/bus/api.js`; rendering logic in `src/bus/renderer.js`. Train gets a parallel structure when its phases begin.

**Tech Stack:** Vanilla HTML/JS, ES modules (`<script type="module">`), MBTA V3 API (browser-direct, key in source for alpha), SVG DOM manipulation + `XMLSerializer` for export, `canvas` for PNG.

---

## Scope note

This plan covers Phases 1–10. Phases 1–2 have full task detail. Phases 3–10 have milestone-level detail to be fleshed out when reached.

---

## Phase 1 — Multi-Route Bus Rendering Engine

**Why first:** The Domino Effect algorithm requires measuring rendered text height from a live DOM element. That makes DOM-based rendering a hard prerequisite for everything else. Building this first means Phase 2 (API mode) and Phase 3 (stop-first multi-route) are built on a solid foundation rather than retrofitted.

**Key reference files (do not modify during this phase):**
- `public/assets/bus/templates/dynamic_svg_template_for_resizing_bus_sign_based_on_number_of_routes.svg` — master SVG template; `route-item-template` is the cloneable group
- `public/assets/bus/templates/javascript_snippet-resize_bus_stop_signs_based_on_number_of_routes.js` — partial algorithm reference; do not run it directly, use it as a spec for `renderer.js`
- `PRDs_and_plans/TECHNICAL_REFERENCE_Bus_Sign_Domino_Effect_for_Resizing_Bus_Stop_Sign_SVGs_based_on_number_of_Routes.md` — layout constants and Domino Effect math

---

### Task 1.1: Embed SVG template in bus.html and switch to DOM-based rendering

**Goal:** Replace the current `buildSvg()→innerHTML` string approach with a live DOM SVG so that `offsetHeight` measurement becomes possible.

**Files:**
- Modify: `bus.html` — embed SVG template, remove `buildSvg()`, wire inputs to `renderSign()`
- Create: `src/bus/renderer.js` — exports `renderSign(state)` and `getSignSvgString()`

**Acceptance Criteria:**
- [ ] Opening `bus.html` via a local HTTP server shows the sign with default values (route "109", destination "Back Bay Station", stop "1129", clock on)
- [ ] Editing any field updates the live sign immediately
- [ ] SVG preview looks identical to the original alpha
- [ ] `getSignSvgString()` returns a valid SVG string (verify by pasting in browser SVG viewer)

**Verify:** Open `bus.html` on a local server → sign renders with default values; type in Route field → pill updates live.

**Steps:**

- [ ] **Step 1: Create `src/bus/renderer.js` with the state type contract and bare exports**

```js
// src/bus/renderer.js
// Handles all DOM-based SVG rendering for the bus sign.
// Requires the SVG template to already be in the live DOM at #main-mbta-sign.

export const CONFIG = {
  baseWhiteRectHeight: 1500,
  baseCanvasHeight: 2065,
  pillHeight: 200,
  gapBeforePill: 67,
  startY_route1Pill: 50,
  towZoneStartY: 1290,
  towZoneBuffer: 40,
};

// state shape:
// {
//   stopNumber: string,
//   routes: Array<{ routeNumber: string, displayText: string, showClock: boolean }>
// }

export function renderSign(state) {
  // implemented in Task 1.2
}

export function getSignSvgString() {
  const svg = document.getElementById('main-mbta-sign');
  return new XMLSerializer().serializeToString(svg);
}
```

- [ ] **Step 2: Copy the SVG template content from the asset file into `bus.html` as the preview element**

Replace the current `<section><div class="preview"><div id="preview"></div></div></section>` with:

```html
<section>
  <div class="preview">
    <!-- SVG template: paste full contents of
         public/assets/bus/templates/dynamic_svg_template_for_resizing_bus_sign_based_on_number_of_routes.svg here -->
    <svg id="main-mbta-sign" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 2065" width="100%" height="100%">
      <!-- ... full SVG content ... -->
    </svg>
  </div>
</section>
```

The `width="100%"` and the existing `.preview svg { width: min(100%, 380px); }` CSS handle responsive sizing.

- [ ] **Step 3: Wire the existing input fields to call `renderSign()` on every change**

In the `<script>` block at the bottom of `bus.html`, replace the current `render()` function and event wiring with:

```html
<script type="module">
import { renderSign, getSignSvgString } from './src/bus/renderer.js';

const els = {
  route:     document.getElementById('routeNumber'),
  dest:      document.getElementById('destinationName'),
  stop:      document.getElementById('stopNumber'),
  showClock: document.getElementById('showClock'),
  openSvg:   document.getElementById('openSvg'),
  dlSvg:     document.getElementById('downloadSvg'),
  dlPng:     document.getElementById('downloadPng'),
};

function currentState() {
  return {
    stopNumber: els.stop.value.trim() || '1129',
    routes: [{
      routeNumber:  els.route.value.trim() || '109',
      displayText:  els.dest.value.trim()  || 'Back Bay Station',
      showClock:    els.showClock.checked,
    }],
  };
}

function refresh() { renderSign(currentState()); }

[els.route, els.dest, els.stop, els.showClock].forEach(el => {
  el.addEventListener('input',  refresh);
  el.addEventListener('change', refresh);
});

// Export helpers (PNG and SVG open/download stay the same shape)
function slug(v) { return String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'bus-stop'; }
function filename(ext) { return `bus-stop-${slug(els.route.value)}-${slug(els.stop.value)}.${ext}`; }
function svgBlob() { return new Blob([getSignSvgString()], { type: 'image/svg+xml;charset=utf-8' }); }
function download(blob, name) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

els.openSvg.addEventListener('click', () => {
  const url = URL.createObjectURL(svgBlob());
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
});
els.dlSvg.addEventListener('click', () => download(svgBlob(), filename('svg')));
els.dlPng.addEventListener('click', () => {
  const url = URL.createObjectURL(svgBlob());
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = 1400; c.height = 4130;
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(b => { URL.revokeObjectURL(url); if (b) download(b, filename('png')); }, 'image/png');
  };
  img.onerror = () => { URL.revokeObjectURL(url); alert('PNG export failed.'); };
  img.src = url;
});

refresh();
</script>
```

- [ ] **Step 4: Implement `renderSign()` in renderer.js for the single-route case (no cloning yet)**

```js
export function renderSign(state) {
  const svg = document.getElementById('main-mbta-sign');
  _resetDomino(svg);
  _clearExtraRoutes();

  // Populate the template slot (route index 0)
  const route = state.routes[0] || { routeNumber: '', displayText: '', showClock: false };
  _populateRouteSlot(document.getElementById('route-item-template'), route, 0, CONFIG.startY_route1Pill);

  // Stop number
  document.getElementById('dynamic-stop-number').textContent = state.stopNumber;
}

function _resetDomino(svg) {
  svg.setAttribute('viewBox', `0 0 700 ${CONFIG.baseCanvasHeight}`);
  document.querySelector('#white-rectangle-background > #dynamic-white-bg')
    .setAttribute('height', CONFIG.baseWhiteRectHeight);
  document.getElementById('tow-zone-block').removeAttribute('transform');
  document.getElementById('bottom-yellow-background').removeAttribute('transform');
  const border = document.getElementById('outer-perimeter-border');
  border.setAttribute('d',
    'M 0 400 V 325 A 350 325 0 0 1 700 325 V 2030 A 35 35 0 0 1 665 2065 H 35 A 35 35 0 0 1 0 2030 Z'
  );
}

function _clearExtraRoutes() {
  const container = document.getElementById('extra-routes-container');
  while (container.firstChild) container.removeChild(container.firstChild);
}

function _routeSize(routeStr) {
  const l = String(routeStr).trim().length;
  if (l <= 2) return 205; if (l === 3) return 190; if (l === 4) return 145; return 120;
}

function _populateRouteSlot(groupEl, route, index, startY) {
  // Route pill text
  const pillText = groupEl.querySelector('#dynamic-route-number');
  pillText.textContent = route.routeNumber;
  pillText.setAttribute('font-size', _routeSize(route.routeNumber));
  // IDs must be unique per clone; suffix with index
  pillText.id = `dynamic-route-number-${index}`;

  // Destination text
  const destDiv = groupEl.querySelector('#dynamic-destination-name');
  destDiv.textContent = route.displayText;
  destDiv.id = `dynamic-destination-name-${index}`;

  // Clock visibility
  const clock = groupEl.querySelector('#dynamic-frequency-clock');
  clock.style.display = route.showClock ? '' : 'none';
  clock.id = `dynamic-frequency-clock-${index}`;

  // Y-position: the group lives inside white-rectangle-background which is already
  // translated by 400px, so startY is relative to that.
  // The template uses internal y="50" on the pill — we set the group's transform.
  if (startY !== CONFIG.startY_route1Pill) {
    groupEl.setAttribute('transform', `translate(0, ${startY - CONFIG.startY_route1Pill})`);
  } else {
    groupEl.removeAttribute('transform');
  }
}
```

- [ ] **Step 5: Start a local HTTP server and verify the sign renders with defaults**

```bash
cd /Users/allisonboscarine/Dropbox/_Alex/MBTA_Sign_Maker/codebase-mbta-sign-maker
python3 -m http.server 8080
```

Open `http://localhost:8080/bus.html`. Confirm:
- Sign renders with route 109, Back Bay Station, stop 1129, clock visible
- Editing Route field changes pill text live
- Editing Destination changes text live
- Clock checkbox toggles clock

- [ ] **Step 6: Commit**

```bash
git add bus.html src/bus/renderer.js
git commit -m "feat: switch bus sign to DOM-based SVG rendering (Phase 1.1)"
```

---

### Task 1.2: Implement route cloning and Y-axis positioning

**Goal:** `renderSign()` correctly clones and positions N route blocks (1–5) by calculating each block's Y-start from the measured height of the preceding destination text.

**Files:**
- Modify: `src/bus/renderer.js` — expand `renderSign()` to handle `state.routes.length > 1`

**Acceptance Criteria:**
- [ ] Two routes render without overlap
- [ ] Three routes with long destination text render without overlap
- [ ] The first route always starts at Y=50 (no regression)
- [ ] Clock is independently togglable per route

**Verify:** In browser, manually construct a 3-route state and call `renderSign()` from the console; routes should stack cleanly.

**Steps:**

- [ ] **Step 1: Add measurement helper with RAF deferral**

`foreignObject` div heights are only available after paint. We trigger measurement in a `requestAnimationFrame` callback:

```js
// renderer.js — add after _populateRouteSlot

function _measureDestHeight(index) {
  const div = document.getElementById(`dynamic-destination-name-${index}`);
  return div ? div.offsetHeight : 400; // 400 = safe fallback
}
```

- [ ] **Step 2: Update `renderSign()` to clone for routes[1..n] and run Domino check after RAF**

```js
export function renderSign(state) {
  const svg = document.getElementById('main-mbta-sign');
  _resetDomino(svg);
  _clearExtraRoutes();

  document.getElementById('dynamic-stop-number').textContent = state.stopNumber;

  const template = document.getElementById('route-item-template');
  const container = document.getElementById('extra-routes-container');

  // Populate template slot (index 0)
  _populateRouteSlot(template, state.routes[0] || _emptyRoute(), 0, CONFIG.startY_route1Pill);

  // Clone for routes 1..n
  for (let i = 1; i < state.routes.length; i++) {
    const clone = template.cloneNode(true);
    clone.id = `route-item-${i}`;
    container.appendChild(clone);
    // Y will be set after paint in the RAF below
  }

  // After paint: measure heights, set Y positions, trigger Domino if needed
  requestAnimationFrame(() => {
    let currentY = CONFIG.startY_route1Pill;

    for (let i = 0; i < state.routes.length; i++) {
      const groupEl = i === 0
        ? template
        : document.getElementById(`route-item-${i}`);

      if (i > 0) {
        // Now we can measure the previous route's text height
        const prevTextHeight = _measureDestHeight(i - 1);
        currentY = currentY + CONFIG.pillHeight + 20 + prevTextHeight + CONFIG.gapBeforePill;
        _populateRouteSlot(groupEl, state.routes[i], i, currentY);
      }
    }

    // Calculate bottom edge: after the last route's pill + padding + text
    const lastTextHeight = _measureDestHeight(state.routes.length - 1);
    const bottomEdge = currentY + CONFIG.pillHeight + 20 + lastTextHeight + CONFIG.gapBeforePill;

    const collisionLine = CONFIG.towZoneStartY - CONFIG.towZoneBuffer;
    if (bottomEdge > collisionLine) {
      _applyDominoEffect(bottomEdge - collisionLine, svg);
    }
  });
}

function _emptyRoute() {
  return { routeNumber: '', displayText: '', showClock: false };
}
```

- [ ] **Step 3: Verify in browser with a 2-route state via console**

Open `http://localhost:8080/bus.html`, then in DevTools console:

```js
// import renderer in console (or expose renderSign on window temporarily)
renderSign({
  stopNumber: '1129',
  routes: [
    { routeNumber: '109', displayText: 'Back Bay Station', showClock: true },
    { routeNumber: '39',  displayText: 'Forest Hills Station via South Huntington Ave', showClock: false },
  ]
});
```

Both routes should appear, stacked, without overlap.

- [ ] **Step 4: Commit**

```bash
git add src/bus/renderer.js
git commit -m "feat: implement route cloning and Y-positioning (Phase 1.2)"
```

---

### Task 1.3: Implement `_applyDominoEffect()`

**Goal:** When routes overflow the safe boundary above the Tow Zone, all lower elements shift down and the SVG canvas grows to match.

**Files:**
- Modify: `src/bus/renderer.js` — implement `_applyDominoEffect(extraHeight, svg)`

**Acceptance Criteria:**
- [ ] A 3-route sign with long destinations does not have text overlapping the Tow Zone
- [ ] The outer perimeter border still encloses the full sign after resize
- [ ] The viewBox bottom coordinate matches `2065 + extraHeight`
- [ ] Exporting a resized sign produces a valid SVG with correct dimensions

**Verify:** Console-call `renderSign()` with 3 long-destination routes; inspect `<svg viewBox>` attribute — height should exceed 2065.

**Steps:**

- [ ] **Step 1: Implement `_applyDominoEffect()`**

```js
function _applyDominoEffect(extraHeight, svg) {
  // 1. Expand white background rect
  document.getElementById('dynamic-white-bg')
    .setAttribute('height', CONFIG.baseWhiteRectHeight + extraHeight);

  // 2. Translate tow zone block down
  document.getElementById('tow-zone-block')
    .setAttribute('transform', `translate(0, ${extraHeight})`);

  // 3. Translate bottom yellow background down
  document.getElementById('bottom-yellow-background')
    .setAttribute('transform', `translate(0, ${extraHeight})`);

  // 4. Expand SVG viewBox
  svg.setAttribute('viewBox', `0 0 700 ${CONFIG.baseCanvasHeight + extraHeight}`);

  // 5. Update outer perimeter border path — only the two bottom coordinates change.
  // Original path ends: ...V 2030 A 35 35 0 0 1 665 2065 H 35 A 35 35 0 0 1 0 2030 Z
  const border = document.getElementById('outer-perimeter-border');
  const newBottom1 = 2030 + extraHeight;
  const newBottom2 = 2065 + extraHeight;
  const currentD = border.getAttribute('d');
  const updatedD = currentD
    .replace(/V \d+(\.\d+)? A 35 35 0 0 1 665/, `V ${newBottom1} A 35 35 0 0 1 665`)
    .replace(/\d+(\.\d+)? H 35 A 35 35 0 0 1 0 \d+(\.\d+)?/, `${newBottom2} H 35 A 35 35 0 0 1 0 ${newBottom1}`);
  border.setAttribute('d', updatedD);
}
```

- [ ] **Step 2: Test with a deliberately long 3-route scenario**

In browser console:

```js
renderSign({
  stopNumber: '1000',
  routes: [
    { routeNumber: '1',   displayText: 'Harvard Square via Massachusetts Avenue and Dudley Square', showClock: true },
    { routeNumber: '66',  displayText: 'Harvard Square via Brookline Village and Dudley Square', showClock: true },
    { routeNumber: '111', displayText: 'Woodlawn or Broadway & Park Ave via Bellingham Square', showClock: true },
  ]
});
```

Verify: Tow Zone is below all route text; sign expands correctly; outer border encloses everything.

- [ ] **Step 3: Test with a 1-route short sign (no Domino should trigger)**

```js
renderSign({
  stopNumber: '1129',
  routes: [{ routeNumber: '109', displayText: 'Back Bay', showClock: false }]
});
```

Verify: `<svg viewBox>` is still `0 0 700 2065`.

- [ ] **Step 4: Commit**

```bash
git add src/bus/renderer.js
git commit -m "feat: implement Domino Effect SVG resize (Phase 1.3)"
```

---

### Task 1.4: Custom mode multi-route form UI (add / remove up to 5 routes)

**Goal:** The custom mode controls let the user add up to 5 route blocks (each with number, destination text, and clock toggle) and remove any of them; the sign re-renders on every change.

**Files:**
- Modify: `bus.html` — replace single-route controls with dynamic multi-route form
- Modify: `src/bus/renderer.js` — no changes; renderer already handles N routes

**Acceptance Criteria:**
- [ ] Default state shows one route block with pre-filled values
- [ ] "Add route" button appends a new empty block (disabled when 5 are present)
- [ ] Each block has a "Remove" button (disabled when only 1 block remains)
- [ ] Any input change re-renders the sign
- [ ] State is read correctly from all blocks into the `routes[]` array

**Verify:** Add 3 routes with different text lengths → sign renders all 3 without overlap.

**Steps:**

- [ ] **Step 1: Replace the single-route controls section in bus.html**

Remove the individual `#routeNumber`, `#destinationName`, `#showClock` fields. Replace with:

```html
<div id="route-blocks"></div>
<button id="addRoute" type="button" class="secondary" style="width:100%;margin-bottom:12px">+ Add Route</button>
```

- [ ] **Step 2: Add route block template HTML (hidden) and JS to manage it**

Add a hidden template element at the bottom of `<body>`:

```html
<template id="route-block-template">
  <div class="route-block" style="border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:10px">
    <div class="group">
      <label>Route number</label>
      <input type="text" class="route-number" value="109" autocomplete="off">
    </div>
    <div class="group">
      <label>Destination text</label>
      <textarea class="route-dest" style="min-height:70px">Back Bay Station</textarea>
    </div>
    <div class="group">
      <label class="check">
        <input type="checkbox" class="route-clock" checked>
        Show frequent-service clock
      </label>
    </div>
    <button type="button" class="remove-route secondary" style="width:100%">Remove route</button>
  </div>
</template>
```

- [ ] **Step 3: Add multi-route state management JS to bus.html script block**

```js
const MAX_ROUTES = 5;

function getRouteBlocks() {
  return Array.from(document.querySelectorAll('#route-blocks .route-block'));
}

function currentState() {
  return {
    stopNumber: document.getElementById('stopNumber').value.trim() || '1129',
    routes: getRouteBlocks().map(block => ({
      routeNumber: block.querySelector('.route-number').value.trim() || '???',
      displayText:  block.querySelector('.route-dest').value.trim()   || '',
      showClock:    block.querySelector('.route-clock').checked,
    })),
  };
}

function syncButtons() {
  const blocks = getRouteBlocks();
  document.getElementById('addRoute').disabled = blocks.length >= MAX_ROUTES;
  blocks.forEach(b => {
    b.querySelector('.remove-route').disabled = blocks.length <= 1;
  });
}

function addRouteBlock(defaults = {}) {
  const tmpl = document.getElementById('route-block-template');
  const clone = tmpl.content.cloneNode(true);
  const block = clone.querySelector('.route-block');
  if (defaults.routeNumber) block.querySelector('.route-number').value = defaults.routeNumber;
  if (defaults.displayText)  block.querySelector('.route-dest').value   = defaults.displayText;
  if (defaults.showClock !== undefined) block.querySelector('.route-clock').checked = defaults.showClock;

  block.querySelector('.remove-route').addEventListener('click', () => {
    block.remove(); syncButtons(); refresh();
  });
  ['input', 'change'].forEach(ev => {
    block.querySelectorAll('input, textarea').forEach(el => el.addEventListener(ev, () => refresh()));
  });

  document.getElementById('route-blocks').appendChild(block);
  syncButtons();
}

document.getElementById('addRoute').addEventListener('click', () => {
  addRouteBlock({ routeNumber: '', displayText: '', showClock: false });
  refresh();
});

// Initialize with one block
addRouteBlock({ routeNumber: '109', displayText: 'Back Bay Station', showClock: true });
```

- [ ] **Step 4: Verify in browser**

- Add 3 route blocks with long text → all 3 render correctly
- Remove a block → sign updates
- 5 blocks → "Add route" disables
- 1 block → "Remove" disables

- [ ] **Step 5: Commit**

```bash
git add bus.html
git commit -m "feat: multi-route custom form UI with add/remove controls (Phase 1.4)"
```

---

### Task 1.5: Verify SVG/PNG export works with DOM-based rendering

**Goal:** All three export actions (Open SVG in tab, Download SVG, Download PNG) produce correct output for both single and multi-route signs, including Domino-resized ones.

**Files:**
- Modify: `bus.html` — export wiring already written in Task 1.1; verify and fix if needed

**Acceptance Criteria:**
- [ ] "Open SVG in New Tab" opens a correctly-rendered SVG
- [ ] "Download SVG" produces a `.svg` file that opens correctly in a browser
- [ ] "Download PNG" produces a `.png` at 2× resolution
- [ ] A Domino-resized sign exports at the correct expanded height (not clipped to 2065)
- [ ] Filename includes route number and stop number

**Verify:** Download SVG with a 2-route sign; open in browser → both routes visible, sign not clipped.

**Steps:**

- [ ] **Step 1: Confirm `getSignSvgString()` captures the full live DOM including Domino changes**

The `XMLSerializer` serializes the live `<svg>` element including any attribute changes made by `_applyDominoEffect()`. No additional work needed if the SVG is live in the DOM and `renderSign()` has completed its RAF callback.

**Known timing issue:** Export buttons must not be clicked before the `requestAnimationFrame` callback fires. Because RAF completes in ~1 frame (16ms), this is not a real problem for human interaction. No special handling required for Phase 1.

- [ ] **Step 2: Verify PNG canvas dimensions match viewBox**

Current PNG code hardcodes `c.width = 1400; c.height = 4130`. For a Domino-resized sign the canvas height is wrong. Fix:

```js
els.dlPng.addEventListener('click', () => {
  const svgEl = document.getElementById('main-mbta-sign');
  const vb = svgEl.getAttribute('viewBox').split(' ').map(Number);
  const vbW = vb[2], vbH = vb[3];
  const scale = 2;
  const url = URL.createObjectURL(svgBlob());
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = vbW * scale; c.height = vbH * scale;
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(b => { URL.revokeObjectURL(url); if (b) download(b, filename('png')); }, 'image/png');
  };
  img.onerror = () => { URL.revokeObjectURL(url); alert('PNG export failed.'); };
  img.src = url;
});
```

- [ ] **Step 3: Manual test all export paths**

Test matrix:
| Sign | Export | Expected |
|------|--------|----------|
| 1 route, no Domino | SVG | 700×2065 sign |
| 1 route, no Domino | PNG | 1400×4130 px |
| 3 routes, Domino triggered | SVG | 700×(2065+extra) sign |
| 3 routes, Domino triggered | PNG | 1400×(4130+extra×2) px |

- [ ] **Step 4: Commit**

```bash
git add bus.html
git commit -m "fix: PNG export canvas height tracks Domino-resized viewBox (Phase 1.5)"
```

---

## Phase 2 — Bus API Route-First Mode

**Depends on:** Phase 1 complete (multi-route renderer working in custom mode).

**Why this ordering:** With the rendering engine solid, API mode is purely a data-layer addition — fetch routes, fetch stops, pre-fill the existing `routes[]` state, let the renderer do the rest.

---

### Task 2.1: Create `src/bus/api.js` with MBTA API functions

**Goal:** Isolated module handles all MBTA V3 API calls; exports typed fetch functions the UI can call.

**Files:**
- Create: `src/bus/api.js`

**Acceptance Criteria:**
- [ ] `fetchBusRoutes()` returns an array of `{ id, shortName, longName, isFrequent }` objects
- [ ] `fetchStopsForRoute(routeId)` returns an array of `{ id, name }` objects
- [ ] Both functions throw a descriptive error on non-200 response
- [ ] `isFrequent` is `true` only when `attributes.description === 'Frequent Bus'`
- [ ] API key is in a clearly marked `TODO` constant at the top of the file

**Verify:** In browser console, `import('./src/bus/api.js').then(m => m.fetchBusRoutes()).then(console.log)` returns a non-empty array.

**Steps:**

- [ ] **Step 1: Write `api.js`**

```js
// src/bus/api.js
// TODO (Phase 10): Move API_KEY to a Vercel serverless proxy environment variable
// so it is not exposed in client-side JavaScript. See docs/API-Notes.md.
const API_KEY = 'YOUR_MBTA_API_KEY_HERE'; // replace before use
const BASE = 'https://api-v3.mbta.com';

function headers() {
  return { 'x-api-key': API_KEY };
}

async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`, { headers: headers() });
  if (!res.ok) throw new Error(`MBTA API error ${res.status}: ${path}`);
  return res.json();
}

export async function fetchBusRoutes() {
  const data = await apiFetch(
    '/routes?filter[type]=3' +
    '&fields[route]=short_name,long_name,description' +
    '&sort=short_name'
  );
  return data.data.map(r => ({
    id:         r.id,
    shortName:  r.attributes.short_name,
    longName:   r.attributes.long_name,
    isFrequent: r.attributes.description === 'Frequent Bus',
  }));
}

export async function fetchStopsForRoute(routeId) {
  const data = await apiFetch(
    `/stops?filter[route]=${encodeURIComponent(routeId)}` +
    '&fields[stop]=name' +
    '&sort=name'
  );
  return data.data.map(s => ({
    id:   s.id,
    name: s.attributes.name,
  }));
}
```

- [ ] **Step 2: Insert the real API key**

The user will paste the key. Replace `'YOUR_MBTA_API_KEY_HERE'` with the actual key at this step.

- [ ] **Step 3: Smoke-test in browser console**

```js
const { fetchBusRoutes, fetchStopsForRoute } = await import('./src/bus/api.js');
const routes = await fetchBusRoutes();
console.log('Route count:', routes.length);  // expect ~170+
console.log('Frequent routes:', routes.filter(r => r.isFrequent).map(r => r.shortName));
const stops = await fetchStopsForRoute('1');  // Route 1
console.log('Stops for route 1:', stops.slice(0, 5));
```

- [ ] **Step 4: Commit**

```bash
git add src/bus/api.js
git commit -m "feat: add MBTA V3 API module with bus routes and stops (Phase 2.1)"
```

---

### Task 2.2: Add mode selector (Custom vs. Use MBTA Data) to bus.html

**Goal:** Two toggle buttons switch between Custom mode (existing multi-route form) and API mode (route/stop dropdowns, revealed in Task 2.3–2.4).

**Files:**
- Modify: `bus.html`

**Acceptance Criteria:**
- [ ] Mode selector appears above the controls
- [ ] Clicking "Create Your Own" shows the route-blocks form and hides API controls
- [ ] Clicking "Use MBTA Data" hides the route-blocks form and shows the API controls panel
- [ ] Custom mode is the default; the sign still works with no network connection in Custom mode
- [ ] Active mode button has a distinct visual style

**Verify:** Switch to API mode → route-blocks form hidden; switch back → form visible, sign still interactive.

**Steps:**

- [ ] **Step 1: Add mode toggle HTML above the controls form**

```html
<div class="mode-toggle" style="display:flex;gap:8px;margin-bottom:16px">
  <button id="modeCustom"  class="mode-btn active" type="button">Create Your Own</button>
  <button id="modeApi"     class="mode-btn"         type="button">Use MBTA Data</button>
</div>
```

Add CSS:

```css
.mode-btn { flex:1; background:#e8e4dc; color:var(--ink); font-weight:700; }
.mode-btn.active { background:var(--ink); color:#fff; }
```

- [ ] **Step 2: Add `<div id="api-controls" style="display:none">` wrapper (populated in Tasks 2.3–2.4)**

```html
<div id="api-controls" style="display:none">
  <!-- route/stop dropdowns go here -->
</div>
```

- [ ] **Step 3: Wire toggle logic**

```js
const customPanel = document.getElementById('route-blocks');
const addRouteBtn  = document.getElementById('addRoute');
const apiPanel     = document.getElementById('api-controls');

function setMode(mode) {
  const isApi = mode === 'api';
  customPanel.style.display = isApi ? 'none' : '';
  addRouteBtn.style.display  = isApi ? 'none' : '';
  apiPanel.style.display     = isApi ? '' : 'none';
  document.getElementById('modeCustom').classList.toggle('active', !isApi);
  document.getElementById('modeApi').classList.toggle('active', isApi);
  if (isApi) onApiModeActivated();  // defined in Task 2.3
}

document.getElementById('modeCustom').addEventListener('click', () => setMode('custom'));
document.getElementById('modeApi').addEventListener('click',    () => setMode('api'));
```

- [ ] **Step 4: Commit**

```bash
git add bus.html
git commit -m "feat: add Custom/API mode selector toggle (Phase 2.2)"
```

---

### Task 2.3: Wire route dropdown — fetch and populate on API mode activation

**Goal:** Switching to API mode triggers `fetchBusRoutes()`, populates a `<select>`, and shows a loading/error state.

**Files:**
- Modify: `bus.html` — add route select inside `#api-controls`; add `onApiModeActivated()` and loading state logic

**Acceptance Criteria:**
- [ ] Switching to API mode shows a loading message then populates the route dropdown
- [ ] Each option shows the route short name (and long name as secondary info)
- [ ] On network error, shows: "Could not load MBTA data right now. You can still create a custom sign."
- [ ] Route dropdown is cached — switching back and forth doesn't re-fetch

**Verify:** Switch to API mode → route select populates with bus routes; disconnect network, repeat → error message appears.

**Steps:**

- [ ] **Step 1: Add HTML inside `#api-controls`**

```html
<div id="api-controls" style="display:none">
  <div class="group">
    <label for="apiRoute">Bus route</label>
    <select id="apiRoute"><option value="">Loading routes…</option></select>
  </div>
  <div class="group" style="display:none" id="stop-group">
    <label for="apiStop">Bus stop</label>
    <select id="apiStop"><option value="">Choose a route first</option></select>
  </div>
  <p id="api-error" style="color:#AA202E;display:none;font-size:13px">
    Could not load MBTA data right now. You can still create a custom sign.
  </p>
</div>
```

- [ ] **Step 2: Implement `onApiModeActivated()` with caching**

```js
import { fetchBusRoutes, fetchStopsForRoute } from './src/bus/api.js';

let cachedRoutes = null;

async function onApiModeActivated() {
  if (cachedRoutes) { _populateRouteSelect(cachedRoutes); return; }
  document.getElementById('apiRoute').innerHTML = '<option value="">Loading routes…</option>';
  document.getElementById('api-error').style.display = 'none';
  try {
    cachedRoutes = await fetchBusRoutes();
    _populateRouteSelect(cachedRoutes);
  } catch (e) {
    document.getElementById('apiRoute').innerHTML = '<option value="">—</option>';
    document.getElementById('api-error').style.display = '';
  }
}

function _populateRouteSelect(routes) {
  const sel = document.getElementById('apiRoute');
  sel.innerHTML = '<option value="">— choose a route —</option>' +
    routes.map(r =>
      `<option value="${r.id}" data-frequent="${r.isFrequent}">${r.shortName} — ${r.longName}</option>`
    ).join('');
}
```

- [ ] **Step 3: Commit**

```bash
git add bus.html
git commit -m "feat: populate route dropdown from MBTA API (Phase 2.3)"
```

---

### Task 2.4: Wire stop dropdown — fetch stops when route is chosen

**Goal:** Selecting a route fetches and populates the stop dropdown; stop dropdown is hidden until a route is chosen.

**Files:**
- Modify: `bus.html`

**Acceptance Criteria:**
- [ ] Stop dropdown is hidden until a route is selected
- [ ] Selecting a route shows loading state then populates stop dropdown
- [ ] On stop fetch error, friendly error message appears
- [ ] Stop dropdown resets when a different route is selected

**Verify:** Select Route 1 → stop dropdown populates with Route 1 stops; change to Route 39 → stop dropdown refreshes.

**Steps:**

- [ ] **Step 1: Add route-change handler**

```js
document.getElementById('apiRoute').addEventListener('change', async function () {
  const routeId = this.value;
  const stopGroup = document.getElementById('stop-group');
  const stopSel   = document.getElementById('apiStop');

  if (!routeId) { stopGroup.style.display = 'none'; return; }

  stopGroup.style.display = '';
  stopSel.innerHTML = '<option value="">Loading stops…</option>';
  document.getElementById('api-error').style.display = 'none';

  try {
    const stops = await fetchStopsForRoute(routeId);
    stopSel.innerHTML = '<option value="">— choose a stop —</option>' +
      stops.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  } catch (e) {
    stopSel.innerHTML = '<option value="">—</option>';
    document.getElementById('api-error').style.display = '';
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add bus.html
git commit -m "feat: populate stop dropdown from MBTA API (Phase 2.4)"
```

---

### Task 2.5: Implement sign fill from selected route + stop

**Goal:** Selecting a stop pre-fills the sign fields and re-renders; all fields remain editable; frequent clock is set from `isFrequent` on the route.

**Files:**
- Modify: `bus.html` — add stop-change handler that fills the custom form fields and calls `refresh()`

**Acceptance Criteria:**
- [ ] Selecting a stop fills: route number pill, destination text (stop name), stop number (stop id), clock (route isFrequent)
- [ ] User can edit any field after fill; sign updates live
- [ ] One route block is shown in custom form (overwrites previous state)
- [ ] Switching back to Custom mode preserves the filled values

**Verify:** Select Route 1 → pick a stop → sign fills with route 1 data; edit the destination field → sign updates.

**Steps:**

- [ ] **Step 1: Add stop-change handler**

```js
document.getElementById('apiStop').addEventListener('change', function () {
  const stopId = this.value;
  if (!stopId) return;

  const routeSel  = document.getElementById('apiRoute');
  const selectedOption = routeSel.options[routeSel.selectedIndex];
  const routeId   = routeSel.value;
  const shortName = selectedOption.text.split(' — ')[0];
  const isFrequent = selectedOption.dataset.frequent === 'true';
  const stopName  = this.options[this.selectedIndex].text;

  // Fill into the single custom route block (index 0)
  const block = document.querySelector('#route-blocks .route-block');
  if (block) {
    block.querySelector('.route-number').value = shortName;
    block.querySelector('.route-dest').value   = stopName;
    block.querySelector('.route-clock').checked = isFrequent;
  }

  // Fill stop number field
  document.getElementById('stopNumber').value = stopId;

  // Switch to custom panel so user sees editable fields, then refresh
  setMode('custom');
  refresh();
});
```

- [ ] **Step 2: Verify fill → edit flow in browser**

1. Switch to "Use MBTA Data"
2. Select a route
3. Select a stop
4. App switches back to Custom mode with filled values
5. Edit the destination → sign updates

- [ ] **Step 3: Commit**

```bash
git add bus.html
git commit -m "feat: fill bus sign from MBTA route + stop selection (Phase 2.5)"
```

---

### Task 2.6: Phase 2 testing checklist

**Goal:** Verify all §13 bus manual tests and bus API tests pass.

**Files:** No code changes — this task is pure testing.

**Acceptance Criteria:**
- [ ] All bus manual tests pass (Routes 1, 39, 109, 7412; short/long dest; clock on/off; empty stop; long stop; SVG export; PNG export)
- [ ] All bus API tests pass (load routes; choose route; load stops; choose stop; fill sign; edit after fill; API failure fallback)

**Verify:** Work through the checklist below and mark each item.

**Steps:**

- [ ] Route `1` in custom mode → correct pill
- [ ] Route `39` → correct pill
- [ ] Route `109` → correct pill
- [ ] Route `7412` → correct pill (4 chars → font-size 145)
- [ ] Short destination ("Park St") → renders
- [ ] Long destination (80+ char string) → wraps, Domino triggers if needed
- [ ] Clock on → clock visible
- [ ] Clock off → clock hidden
- [ ] Empty stop number → bottom section shows nothing
- [ ] Long stop number ("123456789") → fits in bottom section
- [ ] SVG export → valid file
- [ ] PNG export → correct dimensions
- [ ] API mode: route list loads
- [ ] API mode: choose Route 1 → stops load
- [ ] API mode: choose a stop → sign fills
- [ ] API mode: edit destination after fill → sign updates
- [ ] API mode: disconnect network, switch to API mode → error message appears, custom mode still works
- [ ] Commit if any small fixes were needed during testing

---

## Phase 3 — Bus API Stop-First Mode with Multi-Route

**Summary milestone — detail to be written when Phase 2 is complete.**

**Goal:** User searches/selects a stop first; app fetches all routes at that stop and renders a multi-route sign automatically using the Domino Effect engine.

**Key new API function needed:**
```js
export async function fetchRoutesForStop(stopId) {
  // GET /routes?filter[stop]={stopId}&filter[type]=3&fields[route]=short_name,description
}
```

**Key new UI work:**
- Stop search input with typeahead (or simple text filter over a fetched stop list)
- Auto-select correct number of route slots based on route count at stop
- Graceful handling of stops with more than 5 routes (show first 5 + warning)
- Direction selector (inbound/outbound) to filter stop list

**Acceptance criteria (high level):**
- User can search/select a stop
- App fills a multi-route sign with all routes at that stop (up to 5)
- User can edit any field after fill
- Export works

---

## Phase 4 — Bus Custom Mode Enhancement

**Summary milestone.**

**Goal:** Make the manual bus builder clean and reliable as a standalone tool.

**Scope:**
- Rename "Frequent-service clock" toggle to "Show frequent-service symbol"
- Improve labels and field order
- Ensure Custom mode has zero dependency on API connectivity
- Route count selector (1–5) with matching form fields
- Offline/no-network smoke test

---

## Phase 5 — Bus Polish and Data Refinement

**Summary milestone.**

**Goal:** Make the bus flow usable by Alex without developer help.

**Scope:**
- Direction-aware route→stop lists (inbound/outbound selector)
- Better stop search (search by name substring, not just scroll)
- Export filenames that include stop name
- Frequency number in clock face (if API provides it — check `attributes.headway_secs`)
- Loading spinners and better error states
- Text auto-fit for very long destination strings

---

## Phase 6 — Train Station JSON Mode

**Summary milestone.**

**Goal:** Train mode gets a line → station dropdown powered by a local JSON file.

**Key new file:** `src/train/data.js` — exports `TRAIN_STATIONS` object structured as in §10 of the PRD.

**New file:** `src/train/renderer.js` — DOM-based rendering for the train SVG template (analogous to bus renderer).

**Flow:** Choose line → station dropdown populates → choose station → header color + station name fill → icons + maps can be customized → export.

---

## Phase 7 — Train Icon Slots and Arrow Assets

**Summary milestone.**

**Goal:** Add more icon slots to the train sign sub-header; create left arrow by flipping right arrow SVG horizontally.

**Scope:** Left/right icon slots independent; support none/elevator/escalator/wheelchair/bus/arrow-left/arrow-right/airplane per slot.

---

## Phase 8 — Train Multi-Line Station Support

**Summary milestone.**

**Goal:** Handle stations served by multiple lines (e.g., Downtown Crossing = Red + Orange).

**Key data model addition:** `lines: string[]`, `defaultSubheader: string`, `templateType: "multi-line"` on `TrainStation`.

---

## Phase 9 — Train API Exploration

**Summary milestone.**

**Goal:** Evaluate whether MBTA API adds anything useful over curated JSON for train signs.

**Recommendation from PRD:** Stick with curated JSON for visual sign-making; add train API only if a clear need emerges.

---

## Phase 10 — Unified UI + Vercel Deployment

**Summary milestone.**

**Goal:** Combine bus and train into a single shell with top-level tabs; deploy to GitHub + Vercel.

**Key work:**
- `index.html` — top-level shell with BUS / TRAIN tabs
- Shared export controls
- Shared asset registry
- Move MBTA API key to Vercel environment variable + serverless proxy function (see `docs/API-Notes.md`)
- Child-friendly responsive UI
- Repo asset paths replacing any remaining Dropbox links

---

## Open Questions (from §14 of PRD)

These are still open — do not silently resolve them; stop and ask:

| Question | Status |
|----------|--------|
| Direction selector required for stop lists? | Deferred to Phase 5 |
| Stops with > 5 routes — show first 5 or let user pick? | Deferred to Phase 3 |
| Frequency number in clock face (is it in the API?) | Investigate in Phase 5 |
| Green Line stations grouped by branch? | Deferred to Phase 6 |
| Multi-line station visual style? | Deferred to Phase 8 |
