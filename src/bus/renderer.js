// src/bus/renderer.js
// DOM-based SVG rendering for the MBTA bus stop sign.
// Requires the SVG template to already be live in the DOM at #main-mbta-sign.

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

let _pendingRaf = null;

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

  // Cancel any pending RAF from a previous rapid call
  if (_pendingRaf !== null) cancelAnimationFrame(_pendingRaf);

  // After paint: measure heights, set Y positions, trigger Domino if needed
  _pendingRaf = requestAnimationFrame(() => {
    _pendingRaf = null;
    let currentY = CONFIG.startY_route1Pill;

    for (let i = 0; i < state.routes.length; i++) {
      const groupEl = i === 0
        ? template
        : document.getElementById(`route-item-${i}`);

      if (i > 0) {
        const prevTextHeight = _measureDestHeight(i - 1);
        currentY = currentY + CONFIG.pillHeight + 20 + prevTextHeight + CONFIG.gapBeforePill;
        _populateRouteSlot(groupEl, state.routes[i], i, currentY);
      }
    }

    // Calculate bottom edge after the last route
    const lastTextHeight = _measureDestHeight(state.routes.length - 1);
    const bottomEdge = currentY + CONFIG.pillHeight + 20 + lastTextHeight + CONFIG.gapBeforePill;

    const collisionLine = CONFIG.towZoneStartY - CONFIG.towZoneBuffer;
    if (bottomEdge > collisionLine) {
      _applyDominoEffect(bottomEdge - collisionLine, svg);
    }
  });
}

export function getSignSvgString() {
  const svg = document.getElementById('main-mbta-sign');
  return new XMLSerializer().serializeToString(svg);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function _resetDomino(svg) {
  svg.setAttribute('viewBox', `0 0 700 ${CONFIG.baseCanvasHeight}`);
  document.getElementById('dynamic-white-bg')
    .setAttribute('height', CONFIG.baseWhiteRectHeight);
  document.getElementById('tow-zone-block').removeAttribute('transform');
  document.getElementById('bottom-yellow-background').removeAttribute('transform');
  document.getElementById('outer-perimeter-border').setAttribute('d',
    'M 0 400 V 325 A 350 325 0 0 1 700 325 V 2030 A 35 35 0 0 1 665 2065 H 35 A 35 35 0 0 1 0 2030 Z'
  );
}

function _clearExtraRoutes() {
  const container = document.getElementById('extra-routes-container');
  while (container.firstChild) container.removeChild(container.firstChild);
}

function _routeSize(routeStr) {
  const l = String(routeStr).trim().length;
  if (l <= 2) return 205;
  if (l === 3) return 190;
  if (l === 4) return 145;
  return 120;
}

// Use [id^="..."] selectors so lookup works whether IDs are original or suffixed.
function _populateRouteSlot(groupEl, route, index, startY) {
  const pillText = groupEl.querySelector('[id^="dynamic-route-number"]');
  const destDiv  = groupEl.querySelector('[id^="dynamic-destination-name"]');
  const clock    = groupEl.querySelector('[id^="dynamic-frequency-clock"]');

  pillText.textContent = route.routeNumber;
  pillText.setAttribute('font-size', _routeSize(route.routeNumber));
  pillText.id = `dynamic-route-number-${index}`;

  destDiv.textContent = route.displayText;
  destDiv.id = `dynamic-destination-name-${index}`;

  clock.style.display = route.showClock ? '' : 'none';
  clock.id = `dynamic-frequency-clock-${index}`;

  if (startY !== CONFIG.startY_route1Pill) {
    groupEl.setAttribute('transform', `translate(0, ${startY - CONFIG.startY_route1Pill})`);
  } else {
    groupEl.removeAttribute('transform');
  }
}

function _measureDestHeight(index) {
  const div = document.getElementById(`dynamic-destination-name-${index}`);
  return div ? div.offsetHeight : 400;
}

function _emptyRoute() {
  return { routeNumber: '', displayText: '', showClock: false };
}

function _applyDominoEffect(extraHeight, svg) {
  document.getElementById('dynamic-white-bg')
    .setAttribute('height', CONFIG.baseWhiteRectHeight + extraHeight);

  document.getElementById('tow-zone-block')
    .setAttribute('transform', `translate(0, ${extraHeight})`);

  document.getElementById('bottom-yellow-background')
    .setAttribute('transform', `translate(0, ${extraHeight})`);

  svg.setAttribute('viewBox', `0 0 700 ${CONFIG.baseCanvasHeight + extraHeight}`);

  const border = document.getElementById('outer-perimeter-border');
  const newBottom1 = 2030 + extraHeight;
  const newBottom2 = 2065 + extraHeight;
  const updatedD = border.getAttribute('d')
    .replace(/V \d+(\.\d+)? A 35 35 0 0 1 665/, `V ${newBottom1} A 35 35 0 0 1 665`)
    .replace(/\d+(\.\d+)? H 35 A 35 35 0 0 1 0 \d+(\.\d+)?/, `${newBottom2} H 35 A 35 35 0 0 1 0 ${newBottom1}`);
  border.setAttribute('d', updatedD);
}
