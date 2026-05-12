# AI Technical Reference: Bus Sign SVG Resizing Logic ("The Domino Effect")

**Module Context:** This document specifically covers the dynamic SVG resizing logic for the Bus Stop Sign Generator (which is one module within the larger MBTA Sign Generator application).

## Core Architecture & Assets
Do not alter the base SVG layout or hardcoded base coordinates. Your task is to implement the dynamic cloning and coordinate shifting using these two files:

* **Master SVG Template:** `../public/assets/bus/templates/dynamic_svg_template_for_resizing_bus_sign_based_on_number_of_routes.svg`
  *(Look for `🟢 DYNAMIC` and `🟢 DYNAMIC DOMINO` comment flags for injection targets).*
* **Math/Logic Snippet:** `../public/assets/bus/templates/javascript_snippet-resize_bus_stop_signs_based_on_number_of_routes.js`

## The Technical Challenge
The user of the MBTA Sign Generator (Bus Stop Function) will eventually have the option to choose and list multiple bus routes on the same bus stop sign (just like on real bus stop signs). Because it's unknown ex ante how many routes the user will choose to include on sign, we don't know ahead of time how tall the sign will need to be in order to accommodate all of those routes. 

SVGs rely on an absolute coordinate system (`x` and `y` grids) and lack HTML "document flow." Because we use HTML `<foreignObject>` tags to auto-wrap route destination text (e.g., "Back Bay Station"), the height of the route destination text is unpredictable until rendered. When text wraps to multiple lines, the routes take up more vertical space. If the total generated text extends past the safe bounds of the standard 1500px white background, we must manually calculate the new height needed and physically push all lower SVG elements down the Y-axis to prevent overlapping. We call this the **Domino Effect**.

## The Math & Variables
To maintain visual fidelity to real MBTA signs, the script must calculate exact Y-coordinates for each cloned route and check against a safe boundary.

**Layout Constants:**
* **Base Pill Height:** `200px`
* **Padding (Pill to Text):** `20px`
* **Required Gap (Text to next Pill):** Exactly `67px`
* **Tow Zone Start Y:** `1290` (Where the red block begins)
* **Tow Zone Buffer:** `40px` (Minimum safe distance required above the Tow Zone)

**Calculation Loop:**
1. Clone the `<g id="route-item-template">` for the current route.
2. Inject the text.
3. Measure the rendered height: `const textHeight = element.offsetHeight;`
4. Calculate the start Y-coordinate for the *next* cloned route (this acts as our current bottom boundary): 
   `nextY = currentY + PillHeight (200) + Padding (20) + textHeight + Gap (67)`

## Executing the Domino Effect
Once all routes are rendered in the loop, check if the final `nextY` position (the absolute bottom of the generated content) encroaches on the safe buffer space above the Tow Zone. 

**The Collision Line** = `Tow Zone Start Y (1290) - Tow Zone Buffer (40) = 1250`

If `nextY > 1250`, the Domino Effect is triggered. Calculate the `extraHeightNeeded` (`nextY - 1250`) and apply it to the `🟢 DYNAMIC DOMINO` targets:

1. **`#dynamic-white-bg` (rect):** `height = 1500 + extraHeightNeeded`
2. **`#tow-zone-block` (g):** Apply `transform="translate(0, extraHeightNeeded)"`
3. **`#bottom-yellow-background` (g):** Apply `transform="translate(0, extraHeightNeeded)"`
4. **`<svg>` (Canvas):** Increase the 4th value (height) of the `viewBox` attribute by `extraHeightNeeded`.

### CRITICAL: The Outer Border Regex
The perimeter of the sign is drawn using a single continuous path: `<path id="outer-perimeter-border">`.
* **Path Data:** `d="M 0 400 V 325 A 350 325 0 0 1 700 325 V 2030 A 35 35 0 0 1 665 2065 H 35 A 35 35 0 0 1 0 2030 Z"`
* **Action:** You cannot translate this element. You must use Regex or String Manipulation to dynamically replace the bottom coordinates (`2030` and `2065`) with `(2030 + extraHeightNeeded)` and `(2065 + extraHeightNeeded)`. Do not alter the top arch coordinates (`325` and `400`).