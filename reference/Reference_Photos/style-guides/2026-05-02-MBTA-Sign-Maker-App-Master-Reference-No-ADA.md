# MBTA Sign Maker App — Master Reference

**Purpose:** A practical, digital-only reference for creating MBTA-inspired sign graphics in an SVG/web-app workflow, especially for a kid-friendly MBTA sign generator.  
**Status:** Working reference, not an official MBTA manual. Physical sign-compliance material intentionally omitted because this is a digital hobby/app project.  
**Created from:**

- `MBTA Signage Style Guide-Manus.md`
- `MBTA-Digital-Signage-Dimensions.md`
- `MBTA-Digital-Signage-Dimensions-Perplexity.md` — duplicate of the dimensions file; do not keep as a separate source
- MBTA `Brand Guidelines` PDF dated `10.01.20`, found through MBTA engineering/design standards materials. Use this official MBTA source for brand basics such as colors, typography, logo handling, icons, voice, and general visual identity.

---

## 1. Scope and Important Cautions

This project is for **digital graphics only**: web app previews, SVG output, PNG export, and possibly home printing for fun. It is **not** for manufacturing, installing, selling, or placing real signs in public.

Because this is digital-only:

- Treat all dimensions as **mockup proportions**, not fabrication specifications.
- Do not worry about physical mounting rules, sign protrusion, installation height, material, reflectivity, fabrication tolerances, or legal compliance standards for real public signage.
- Keep digital readability choices that matter visually, such as strong contrast, large text, simple icons, and consistent layout.
- Use current photos of real MBTA signs as the final visual truth when the written notes conflict with what you can see.

This document should be used as a **design system starter kit**, not as proof of official MBTA requirements.

---

## 2. Source Reliability Guide

Use this priority order when sources conflict:

| Priority | Source Type | How to Use It |
|---|---|---|
| 1 | Current photos of actual MBTA signs | Best source for current visual appearance, especially bus sign proportions, route pill shapes, footer wording, no-stopping text, frequent-service clock placement, and real-world quirks. |
| 2 | Official MBTA Brand Guidelines, dated `10.01.20` | Best source for MBTA brand basics: colors, typefaces, logo rules, icon principles, tone/voice, and overall visual identity. This should supersede BIA portfolio materials for brand basics. |
| 3 | Official MBTA wayfinding / engineering signage materials | Best source for actual wayfinding logic, station sign families, and signage-system structure. |
| 4 | BIA / Bertaux+Iwerks / SignMaker references | Useful background for the MBTA wayfinding system and SignMaker concept, but treat as explanatory/portfolio material unless an MBTA-hosted document says the same thing. |
| 5 | AI-generated summaries and dimensions | Useful as a starting point for digital mockups only. Verify anything that sounds like an exact official spec. |

### Practical supersession rule

The MBTA `Brand Guidelines` PDF should **supersede BIA/portfolio references for brand basics**: colors, typography, logo rules, icon style, and MBTA voice.

It does **not automatically supersede the BIA/SignMaker wayfinding system** for actual sign families, station-wayfinding logic, or template behavior. The brand guide is broad brand identity guidance; the BIA/SignMaker materials are more signage-system-specific.

For this app, that means:

- Use the MBTA Brand Guidelines for official color and typography tokens.
- Use MBTA/BIA wayfinding materials for broad sign-system concepts.
- Use current photos for the specific bus stop sign style Alex wants to reproduce.
- Use AI-generated dimensions only as editable mockup defaults.

### What was intentionally removed or downgraded

The old combined notes included physical installation, mounting-height, protrusion, and legal-compliance material. Those are not useful for this digital app and should stay out of the main design reference. If you later want a separate “real signage research” file, put that material there instead.

---


## 3. Official MBTA Brand Guidelines — What to Use Here

The MBTA `Brand Guidelines` PDF is an official MBTA brand source. It is broad: it covers brand identity, logos, typography, colors, imagery, icons, social media, internal communications, business cards, letterhead, and similar communications materials.

For this digital sign-maker app, use it for:

- official line/mode colors and supporting colors;
- Helvetica Neue / Inter / Arial hierarchy;
- `T` logo proportions, clear space, and “what not to do” rules;
- icon and pictogram principles: simple, literal, modern, fast to recognize;
- general readability principles such as legibility, contrast, and clarity;
- MBTA voice: simple, direct, clear, helpful.

Do **not** use it as the main source for:

- exact bus stop sign layout;
- exact current bus sign footer language;
- exact route pill dimensions;
- exact frequent-service clock placement;
- dynamic SVG template sizing.

Those should come from current photos and from the app’s own visual testing.

## 4. Recommended File Organization

Keep:

```text
MBTA-Sign-Maker-App-Master-Reference.md
```

Archive or delete:

```text
MBTA-Digital-Signage-Dimensions-Perplexity.md
```

Optional archive names for the source files:

```text
_archive/MBTA-General-Brand-and-Signage-Reference-Notes.md
_archive/MBTA-Digital-Signage-Dimensions-Original.md
```

---

## 5. Core Visual Language

The MBTA-inspired look should feel:

- flat, bold, and utilitarian;
- high contrast;
- icon-driven where useful;
- text-forward rather than decorative;
- consistent across bus, subway, and station sign templates;
- simple enough that route/station text can be dynamically swapped.

Core recurring elements:

- strong color bands;
- Helvetica-like typography;
- circular `T` logo;
- arrows and transit icons;
- black route pills or badges;
- large readable station/route text;
- limited palette with line colors doing most of the visual work.

---

## 6. Color Tokens

Use these as digital design tokens. Hex colors are more useful for the app than PMS/CMYK.

**Authority:** These color values should be treated as coming primarily from the official MBTA `Brand Guidelines` PDF, not from the BIA portfolio page or AI summaries. The brand guide identifies color as a central communication device for lines and modes and lists the system colors and additional colors used below.

| Token | Hex | Use |
|---|---:|---|
| Red Line | `#DA291C` | Red Line bands, red warning/no-stopping areas |
| Orange Line | `#ED8B00` | Orange Line bands |
| Green Line | `#00843D` | Green Line bands |
| Blue Line | `#003DA5` | Blue Line bands |
| Silver Line | `#7C878E` | Silver Line bands |
| Commuter Rail Purple | `#80276C` | Commuter Rail bands |
| Ferry Aqua | `#008EAA` | Ferry references if needed |
| Bus Yellow | `#FFC72C` | Bus sign header/footer, frequent-service icon backgrounds |
| MBTA Dark Gray / Black | `#212322` | Text, route pills, dark sign backgrounds |
| White | `#FFFFFF` | Main sign field, reversed text |

Suggested CSS variables:

```css
:root {
  --mbta-red: #DA291C;
  --mbta-orange: #ED8B00;
  --mbta-green: #00843D;
  --mbta-blue: #003DA5;
  --mbta-silver: #7C878E;
  --mbta-commuter-purple: #80276C;
  --mbta-ferry-aqua: #008EAA;
  --mbta-bus-yellow: #FFC72C;
  --mbta-dark: #212322;
  --mbta-white: #FFFFFF;
}
```

---

## 7. Typography Tokens

**Authority:** Use the official MBTA `Brand Guidelines` PDF as the main source for typography. It identifies Helvetica Neue as the primary/secondary brand typeface, Inter as the web typeface, and Arial as the internal presentation typeface. For the app, the practical goal is to get the same Helvetica-like visual effect in browser/SVG output, not to require every exact licensed font file.

### Recommended font stack

For digital rendering, use this practical fallback stack:

```css
font-family: "Helvetica Neue", Helvetica, Arial, Inter, system-ui, sans-serif;
```

### Recommended weights

| Element | Weight | Case |
|---|---|---|
| Station names | Bold / 700 | Usually ALL CAPS |
| Subway line labels | Regular or Medium | Usually ALL CAPS |
| Bus route numbers | Bold / 700 or 800 | Numbers/letters as route uses them |
| Bus destinations | Regular or Medium | Usually Title Case or MBTA-style destination case |
| Footer/contact text | Regular or Medium | Mixed case or all caps depending on photo reference |
| Warning/no-stopping bar | Bold / 700 | ALL CAPS |

### Kerning and route-number notes

For route numbers like `109`, browser/SVG kerning can look awkward, especially around `1` and `0`. Start with:

```css
.route-number {
  font-family: "Helvetica Neue", Helvetica, Arial, Inter, system-ui, sans-serif;
  font-weight: 800;
  font-kerning: normal;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
```

If a specific route number still looks bad in SVG, use `<tspan>` spacing only for that rendered route text. Do not over-engineer unless the number visibly bothers you.

---


### Logo and icon notes from the MBTA brand guide

- The circular `T` mark is the core visual shortcut for the MBTA.
- Do not stretch, flip, recolor unpredictably, add gradients, or alter the `T` mark.
- For a kid-friendly digital app, it is fine to use a simplified/rebuilt SVG `T` mark for personal mockups, but keep it visually respectful and avoid presenting the output as official MBTA material.
- Icons should be simple, literal, modern, and quickly recognizable.

## 8. Primary Template: Bus Street Sign

This is the most important template for the current project.

### 8.1 Design goal

Create a stretchable, MBTA-inspired bus stop sign that can handle 1, 2, 3, or more bus routes without distorting the top arch, footer, route pills, or text.

### 8.2 Static mockup default

The old dimension notes used this as a digital mockup starting point:

```text
400 × 900 px
aspect ratio ≈ 1:2.25
```

That is fine for a quick static mockup, but for the actual app it is better to use an SVG `viewBox` and calculate the sign height based on route count.

### 8.3 Recommended dynamic SVG model

Use a fixed width and dynamic height.

Example normalized model:

```text
signWidth = 700
headerHeight = 400
routeTopPadding = 60
routeRowHeight = 190 to 240
routeGap = 28
routeBottomPadding = 60
noStoppingHeight = 150
footerHeight = 175

routeAreaHeight = routeTopPadding + (routeCount * routeRowHeight) + ((routeCount - 1) * routeGap) + routeBottomPadding
signHeight = headerHeight + routeAreaHeight + noStoppingHeight + footerHeight
```

These numbers are not official. They are starting values for a clean SVG implementation. Adjust after comparing to your reference images.

### 8.4 Bus sign zones

| Zone | Purpose | Digital implementation |
|---|---|---|
| Header arch | Yellow arch/top with circular `T` mark | Keep fixed height. Do not stretch vertically. |
| Route area | White stretchable middle area | Height depends on number of route rows. |
| Route row | Route pill + destination text + optional frequent icon | Repeat as an SVG/component group. |
| No-stopping bar | Red warning strip | Keep fixed height. Text may be simplified. |
| Footer | Yellow contact/stop-ID area | Keep fixed height unless text needs more room. |

### 8.5 Stretching strategy

Best approach:

1. Build the top arch/header as SVG.
2. Build the white middle as a simple `<rect>` whose height changes.
3. Build each bus route as a reusable SVG group/component.
4. Build the red no-stopping bar as a fixed-height rectangle placed after the route area.
5. Build the yellow footer as a fixed-height rectangle placed after the no-stopping bar.
6. Set the SVG `viewBox` height to the computed `signHeight`.

Avoid stretching a whole PNG vertically. That will distort the arch, text, and footer. If using a PNG reference, use it only as a temporary tracing/reference layer.

### 8.6 Route row structure

Each route row should contain:

- black route pill or rounded rectangle;
- white route number text centered inside pill;
- destination text to the right or below depending on template;
- optional frequent-service clock icon;
- enough vertical spacing that multiple routes do not feel cramped.

Recommended SVG route pill:

```svg
<rect x="60" y="0" width="120" height="70" rx="35" fill="var(--mbta-dark)" />
<text x="120" y="48" text-anchor="middle" class="route-number">109</text>
```

For variable-length routes:

```text
pillHeight = 70
pillPaddingX = 28
pillWidth = measuredTextWidth + (pillPaddingX * 2)
pillRx = pillHeight / 2
```

For very short routes, use a circular badge by setting width equal to height.

### 8.7 Frequent-service clock icon

Use the yellow clock icon for routes that run frequently. In your app, this can be a boolean property on the route:

```json
{
  "route": "109",
  "destination": "Sullivan Square",
  "isFrequent": true
}
```

Placement options:

- next to the route pill;
- to the far right of the route row;
- aligned with the route number baseline.

Use current sign photos to decide which looks most accurate.

### 8.8 No-stopping bar text

The exact wording may vary by sign generation/version. Use one of these app-level defaults:

```text
NO STOPPING / TOW ZONE
```

or

```text
NO STOPPING / $100 FINE / TOW ZONE ▶
```

Do not treat either as universal. Make this text editable in the app if possible.

### 8.9 Footer text

The source notes suggest a footer containing MBTA contact information and a bus stop ID. For the app, use editable placeholder text:

```text
MBTA.COM · 617-222-3200 · BUS STOP #0000
```

If the goal is visual accuracy for a specific real stop, compare the footer against a current photo of that sign style.

---

## 9. Secondary Template: Busway Berth Sign

Use this for bus stations/busways where a berth letter appears.

Recommended digital mockup starting point:

```text
500 × 700 px
```

Core layout:

- yellow header or yellow letter block;
- small `BERTH` label;
- large berth letter, e.g., `A`;
- white route list area;
- route rows using the same route pill/destination pattern as the bus street sign.

This is lower priority than the street bus stop sign unless Alex specifically wants busway signs.

---

## 10. Subway / Train Sign Templates

The old dimensions file included three useful subway/station template categories. Treat these as starting proportions for digital mockups only.

### 10.1 Overhead directional sign

Purpose: Long horizontal blade-style sign above fare gates, passageways, or platform entrances.

Recommended digital starting point:

```text
1600 × 300 px
aspect ratio ≈ 5.3:1
```

Core layout:

```text
[Arrow] [Line color / station or line block] [Destination or service info] [Icons]
```

Design notes:

- white background;
- line color band on left or as a block;
- station/line text in white on color;
- secondary info in black on white;
- arrows and icons placed at clear decision points.

### 10.2 Platform wall / station identification sign

Purpose: Large station-name sign on the platform wall.

Recommended digital starting point:

```text
1200 × 350 px
aspect ratio ≈ 3.4:1
```

Single-line station concept:

```text
[Large line-color band with STATION NAME]
[White lower band with line/service information]
```

For multi-line stations, use stacked or side-by-side line color bands.

### 10.3 Surface entry / exit sign

Purpose: Entrance or exit sign near street level or station walls.

Recommended digital starting point:

```text
900 × 300 px
```

Core layout:

- dark MBTA gray background;
- white `T` logo;
- large white station name;
- smaller service/direction text;
- optional icon strip.

---

## 11. SVG Implementation Rules

### 11.1 Use `viewBox`, not fixed pixel-only sizing

For each sign, define an SVG coordinate system and scale the whole graphic in CSS.

Example:

```svg
<svg viewBox="0 0 700 1400" width="100%" height="auto" role="img">
  <!-- sign elements -->
</svg>
```

### 11.2 Use reusable groups/components

Good candidates for reusable components:

- `TLogo`
- `RoutePill`
- `RouteRow`
- `FrequentClockIcon`
- `ArrowIcon`
- `LineBadge`
- `NoStoppingBar`
- `FooterBar`

### 11.3 Prefer real SVG shapes over image stretching

Use SVG for:

- arch/header;
- white stretchable middle rectangle;
- route pills;
- warning bars;
- text;
- icons you can rebuild.

Use images only for:

- temporary reference layers;
- complex logos/icons you are not ready to rebuild;
- inspiration photos outside the exported final sign.

### 11.4 Make text editable

The app should expose these editable fields:

Bus sign:

- route number;
- route destination;
- frequent route toggle;
- no-stopping/warning bar text;
- bus stop ID;
- footer/contact text.

Subway/station sign:

- station name;
- line color;
- destination/endpoints;
- direction arrow;
- icons;
- secondary service text.

### 11.5 Keep official-looking text editable because it may change

Do not hard-code every warning/footer phrase forever. MBTA signage content may vary by sign type, year, municipality, or stop. Use defaults, but allow manual overrides.

---

## 12. App Data Model Ideas

### 12.1 Bus sign route object

```json
{
  "route": "109",
  "destination": "Sullivan Square",
  "isFrequent": true,
  "notes": "Destination text can be manually overridden for visual accuracy."
}
```

### 12.2 Bus sign object

```json
{
  "template": "bus-street-sign",
  "stopName": "Main St @ Example Ave",
  "stopId": "0000",
  "routes": [
    {
      "route": "109",
      "destination": "Sullivan Square",
      "isFrequent": true
    },
    {
      "route": "89",
      "destination": "Clarendon Hill",
      "isFrequent": false
    }
  ],
  "warningText": "NO STOPPING / TOW ZONE",
  "footerText": "MBTA.COM · 617-222-3200 · BUS STOP #0000"
}
```

### 12.3 Subway sign object

```json
{
  "template": "station-identification",
  "stationName": "Harvard",
  "lines": ["red"],
  "secondaryText": "RED LINE · ALL TRAINS",
  "arrow": null,
  "icons": []
}
```

---

## 13. Open Questions to Verify from Photos

These are the items most likely to vary or be wrong in AI-generated notes:

- exact bus sign footer wording;
- exact no-stopping/tow-zone wording;
- whether route destinations are Title Case, ALL CAPS, or mixed;
- route pill shape for 1-, 2-, and 3-digit routes;
- route pill size and spacing;
- frequent-service clock icon size and placement;
- whether the `T` logo is best rebuilt as SVG or inserted as an image;
- exact proportions of the yellow arch/top section;
- exact bottom footer height relative to route count;
- current Red/Orange/Green/Blue/Silver endpoint wording.

When in doubt, choose what looks right from a current photo rather than what an old or AI-generated document says.

---

## 14. Practical Build Order

Recommended order for the app:

1. Build one static bus sign SVG with editable route number/destination text.
2. Convert the route row into a reusable component.
3. Add dynamic route count and computed sign height.
4. Add the no-stopping bar and footer as fixed-height components.
5. Add the frequent-service clock as an optional route-row element.
6. Add subway station sign templates.
7. Add export to PNG/SVG.
8. Add MBTA route/stop data integration only after the visual templates feel good.

---

## 15. Short Version for Future AI Prompts

Use this when asking an AI coding tool to build or revise the sign app:

> Build a digital-only MBTA-inspired SVG sign generator. Do not use real manufacturing specs. Use current MBTA photos as visual reference. Use the official MBTA Brand Guidelines for color, typography, logo, and icon principles, but use wayfinding/signage references and current photos for actual sign-template layout. Use an SVG viewBox and scalable components. For bus signs, keep the yellow arch header, red no-stopping bar, and yellow footer fixed-height, but make the white middle route area stretch based on route count. Each route row should have a black rounded route pill with white bold route number text, destination text, and an optional frequent-service yellow clock icon. Use Helvetica Neue/Arial/Inter/system-ui fallback fonts and MBTA color tokens. Keep warning/footer text editable because exact wording varies.

---

## 16. Public Source Links

These sources are useful background references, but they should not override current photos for visual details. Use MBTA-hosted sources before portfolio/writeup sources when they cover the same issue.

### Highest-priority public/official sources for this file

- MBTA Engineering Design Standards and Guidelines page: https://www.mbta.com/engineering/design-standards-and-guidelines
- MBTA Brand Guidelines PDF, dated 10.01.20 — official MBTA source for brand basics such as color, typography, logo use, icons, and communications style. If you have the PDF saved locally, treat that copy as the main source for brand basics.
- MBTA Wayfinding by Design PDF, 2015: https://cdn.mbta.com/sites/default/files/engineering/001-design-standards-and-guidelines/2015-08-07-wayfinding-by-design.pdf

### Useful but secondary explanatory/background sources

- BIA.studio — MBTA System-Wide Wayfinding Signage System: https://www.bia.studio/work/mbta-system-wide-wayfinding-signage-system/
- BIA.studio — MBTA System-Wide Signage Installations: https://www.bia.studio/work/mbta-system-wide-signage-installations/
- SEGD — Compliant and Consistent: BIA.studio Creates Tools for MBTA: https://segd.org/resources/compliant-and-consistent-biastudio-creates-tools-mbta/
- MBTA Brand Guidelines 10.01.20 archive mirror: https://archive.org/details/mbta-brand-guidelines-10.01.20

### Working rule

When MBTA-hosted brand guidance and BIA/portfolio material disagree on brand basics, follow the MBTA-hosted brand guidance. When the question is about sign-template logic and the MBTA brand guide is silent, use MBTA wayfinding materials, BIA/SignMaker background, and current photos.

---

## 17. Change Log

### 2026-05-02 — MBTA Brand Guidelines update

- Added the official MBTA `Brand Guidelines` PDF dated `10.01.20` as the primary authority for brand basics.
- Updated the source reliability hierarchy so current photos remain first for visual bus-sign details, but the MBTA brand guide now outranks BIA/portfolio materials for colors, typography, logo rules, icons, voice, and general visual identity.
- Clarified that the brand guide does not automatically replace the BIA/SignMaker wayfinding system for sign-family/template logic.
- Added an official-brand-guidelines section explaining which parts of the PDF are useful for this digital app and which details still need photo/signage verification.
- Updated public source links and the future-AI prompt accordingly.

### 2026-05-02

- Combined the two non-duplicate source concepts into one digital-only master reference.
- Removed real-world manufacturing and installation emphasis.
- Preserved useful color, typography, bus sign, subway sign, and SVG implementation guidance.
- Marked dimensions as digital mockup defaults rather than official measurements.
- Added source reliability tiers and photo-verification cautions.
- Added a practical app build order and reusable prompt for future AI coding work.
