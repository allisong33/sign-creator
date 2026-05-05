> **NOTE TO SELF** Below is the **fully merged PRD draft** combining: my original "overall app" notes, the bus-sign prototype discussion, the MBTA API / route-stop logic notes, and the train/bus rendering architecture notes about SVG, PNGs, stretchable sign sections, route pills, maps, and assets. 2026-05-01

# PRD Draft -- MBTA Sign Creation App for Alex

## 1. Product Name

**MBTA Sign App for Alex**

Working concept: a browser-based sign-making app that lets Alex create custom and realistic-looking **MBTA-style bus and train signs**.

***

## 2. Problem Statement

Alex wants a fun, interactive way to create MBTA-style signs without manually editing every graphic in Photoshop, Procreate, or another design app.

The app should feel like a real sign-maker: the user chooses a sign type, enters or selects route/station information, sees a live preview, and exports the finished sign.

The product needs to support two types of creativity:

1. **Realistic MBTA-based signs** using route, stop, station, or line data.

2. **Fully custom signs** where Alex can make up his own route numbers, station names, colors, icons, maps, and text.
***

## 3. Product Vision

Create a kid-friendly web app where Alex can generate MBTA-style signs through a simple interface.

The app should eventually support:

- **Bus stop signs**
- **Train / station signs**
- **Real-data-assisted signs**
- **Custom pretend signs**
- **Live preview**
- **Export to PNG and/or SVG**

The key design principle is:

> Keep static sign artwork separate from dynamic/editable content.

Static assets can be PNGs or base SVGs. Dynamic content -- route numbers, destination text, station names, icons, route pills, and map choices -- should be generated or inserted by the app.
***

## 4. Primary Goals

### User-facing goals

- Let Alex make MBTA-style bus signs.
- Let Alex make MBTA-style train/station signs.
- Make the app feel interactive and fun.
- Support both realistic signs and totally custom signs.
- Let the user export/save the finished result.

### Technical/product goals

- Use reusable sign components instead of fixed one-off images.
- Keep dynamic content editable.
- Let signs resize cleanly in the browser.
- Avoid distorting static artwork when signs need to grow taller.
- Use MBTA API data where helpful, but do not require it for custom signs.
***

## 5. Non-Goals for Early Versions

The first versions should **not** try to be:
- a full graphic design editor
- a mobile app
- a user-account system
- an official MBTA-compliant sign production tool
- a database-backed project management system
- a perfect recreation of every MBTA sign type

This is a fun personal app, not an official transit signage system.

***

## 6. Primary Users

### Primary user

**Alex** -- child user interested in MBTA signs, routes, trains, stations, maps, and transit graphics.

### Secondary user

**You** -- builder/admin/designer who may want to adjust templates, layout defaults, assets, API logic, and advanced settings.
***

# 7. Top-Level App Structure

The app should start with a simple top-level choice:
    
    
    BUS | TRAIN
    

This could be implemented as:

- top tabs, or
- side tabs

The app should then branch into different workflows depending on whether the user chooses **Bus** or **Train**.
***

# 8. Main User Flows

## 8.1 Bus Mode

Bus mode should support three main workflows.

### Bus Flow A -- Select a Bus Route First

User path:

1. User selects **Bus**.

2. User chooses a bus route.

3. User optionally chooses **inbound vs. outbound**.

4. User chooses a stop on that route.

5. App generates a sign based on the selected route/stop.

6. User can customize and export.

This is the most straightforward API-powered workflow.

### Bus Flow B -- Select a Bus Stop First

User path:

1. User selects **Bus**.

2. User chooses a bus stop without first choosing a route.

3. App looks up all bus routes serving that stop.

4. App counts how many routes serve the stop.

5. App chooses the appropriate sign layout/template.

6. App renders the route pills and stop information.

7. User can customize and export.

This matters because real bus stop signs often show more than one route.

### Bus Flow C -- Create Your Own Bus Sign

User path:

1. User selects **Bus**.

2. User chooses **Create Your Own Bus Sign**.

3. User types route numbers and destination text manually.

4. User can enter up to 3 routes.

5. Empty route fields are ignored.

6. App determines how many route pills to show based on filled-in routes.

7. User can optionally include the frequent-route clock graphic.

8. User exports the sign.

This is the pure "fun/custom" mode and should not depend on live MBTA data.

***

## 8.2 Train Mode

Train mode should support at least two workflows.

### Train Flow A -- Select a Line / Station

User path:

1. User selects **Train**.

2. User picks a line color, such as Red, Orange, Blue, Green, etc.

3. App returns stations for that line.

4. User selects a station.

5. User chooses icons.

6. For each icon, user chooses whether it appears on the left or right.

7. User chooses map options.

8. App generates the train sign.

9. User exports the result.

Open issue: It is not yet clear whether the train flow needs inbound/outbound selection, branch selection, or other direction logic.

### Train Flow B -- Create Your Own Train Sign

User path:

1. User selects **Train**.

2. User chooses **Create Your Own Train Sign**.

3. User enters station text.

4. User optionally enters subtext.

5. User chooses line color.

6. User chooses icons.

7. User chooses map options.

8. App generates the sign.

9. User exports the result.

***

# 9. Bus Mode Requirements

## 9.1 Bus Sign Inputs

The bus sign maker should support:

- route number 1
- destination text 1
- route number 2
- destination text 2
- route number 3
- destination text 3
- stop number
- optional frequent-route clock
- optional real stop selection
- optional direction selection

## 9.2 Route Count Logic

The app should support up to **3 route slots** initially.

Rules:

- If 1 route is filled in, show 1 route pill.
- If 2 routes are filled in, show 2 route pills.
- If 3 routes are filled in, show 3 route pills.
- Blank route fields are ignored.
- The number of active routes determines the sign layout/height.

For real MBTA-data mode, route count can come from the API by fetching routes serving a selected stop. The app can then choose a one-route, two-route, three-route, or taller/alternate layout.

## 9.3 Frequent Route Clock

The app should allow the user to include or exclude the frequent-route clock graphic.

There are two possible modes:

### Manual mode

User directly chooses whether the clock appears.

### Data-assisted mode

App checks whether a selected route is considered frequent and shows the clock accordingly.

Open issue: The API may determine frequent status based on **route**, not stop. So if the user starts by choosing a stop, the app may need to look up each route serving that stop and check whether each route is frequent.

## 9.4 Direction Handling

Direction should be optional for the MVP.

For a simple version:
    
    
    Route → Stop → Sign
    

This is probably enough at first.

For a more realistic later version:
    
    
    Route → Direction → Stop → Sign
    

Direction may matter for destination text and more accurate stop lists, but it does not need to block the first working version.

***

# 10. Train Mode Requirements

## 10.1 Train Sign Inputs

Train mode should eventually support:

- line color
- station name
- optional subtext
- icons
- icon placement: left or right
- optional system map
- optional line map
- custom station text
- custom line color
- custom icons

## 10.2 Line / Station Selection

Initial train flow:

1. User picks line color.

2. App gets stations for that line.

3. User chooses a station.

Open questions:

- Does inbound/outbound matter for train signs?
- Does Green Line need branch selection?
- Should the app return all stations for a color, or split them by branch?
- Should station subtext come from the API or be manually typed?
- Should icons ever come from the API, or should they always be manually selected?

Current recommendation: **do not rely on the API for icons at first.** Let the user choose icons manually.

## 10.3 Train Map Options

User should eventually be able to choose:

- no map
- full MBTA system map
- selected-line map
- both maps, if the template supports it

The sign layout/header should resize or adjust based on whether maps are displayed.

***

# 11. Data / API Requirements

## 11.1 Live MBTA API Use

The MBTA V3 API can power the live route/stop flow directly in the browser. A separate database is not required for a simple route dropdown → stop dropdown workflow.

Basic flow:
    
    
    User selects route
    → App requests stops for that route
    → App fills stop dropdown
    

## 11.2 Sparse API Responses

Use sparse fieldsets where possible so the app only requests the fields it needs.

Example:
    
    
    https://api-v3.mbta.com/stops?filter[route]=109&fields[stop]=name&sort=name
    

This helps keep the response small and easier to work with.

## 11.3 Useful API Endpoints

### All bus routes
    
    
    https://api-v3.mbta.com/routes?filter[type]=3&fields[route]=short_name,long_name,direction_names,direction_destinations&sort=short_name
    

Purpose:

- populate the first route dropdown

### Stops for a route
    
    
    https://api-v3.mbta.com/stops?filter[route]=109&fields[stop]=name&sort=name
    

Purpose:

- populate stop dropdown after route selection

### Route details with direction info
    
    
    https://api-v3.mbta.com/routes/109?fields[route]=direction_names,direction_destinations,short_name,long_name
    

Purpose:

- support inbound/outbound or destination-aware flows later

### Stops for a route in a direction
    
    
    https://api-v3.mbta.com/stops?filter[route]=109&filter[direction_id]=0&fields[stop]=name&sort=name
    
    
    
    https://api-v3.mbta.com/stops?filter[route]=109&filter[direction_id]=1&fields[stop]=name&sort=name
    

Purpose:

- direction-specific stop lists

### Bus routes serving a stop
    
    
    https://api-v3.mbta.com/routes?filter[stop]=2773&filter[type]=3&fields[route]=short_name,long_name,direction_names,direction_destinations&sort=short_name
    

Purpose:

- determine all bus routes at a stop
- count how many route pills to show
- get route `short_name` values for the black pills

### Stop details
    
    
    https://api-v3.mbta.com/stops/2773?fields[stop]=name,address,municipality,on_street,at_street
    

Purpose:

- display or use stop name/address/town information
***

# 12. Sign Composition / Rendering Architecture

This is the section where the newer "separate topic" fits best.

## 12.1 General Rendering Principle

The app should separate:
    
    
    Static artwork
    from
    Dynamic/editable content
    

Examples:

| Static / semi-static | Dynamic / editable | 
| ---- | ----  |
| map image | station name | 
| bus sign top image | route number | 
| bus sign bottom image | destination text | 
| train map PNG | icons | 
| base sign shell | route pills | 
| red tow-zone footer | frequent-route badge | 

Do not bake route numbers, destination names, station names, or variable icons directly into background images.

Use:

- **SVG** for editable vector/header/sign elements
- **PNG** for static maps or artwork that does not need to be edited
- **HTML/CSS or SVG overlays** for route pills, text, badges, and dynamic content

This was the main architectural takeaway from the separate rendering discussion.

***

## 12.2 Train Sign Composition

Train signs should likely be composed as:
    
    
    Parent sign wrapper
    ├── Editable SVG header
    └── PNG map section
    

### Header

Use inline SVG when the header needs to be editable.

The inline SVG can include elements with IDs like:

- `stationName`
- `subtitle`
- `wheelchairIcon`
- `escalatorIcon`
- `lineColorBlock`

JavaScript can then update those elements directly.

### Maps

Do **not** convert detailed map PNGs into SVG using automatic tracing.

Automatic PNG-to-SVG conversion is usually bad for:

- maps
- small text
- dense diagrams
- detailed transit graphics

Instead:

- keep maps as PNG assets
- place them under the editable SVG header
- size them inside the same parent wrapper

### Sizing

The whole train sign should scale as one unit.

Recommended pattern:
    
    
    sign wrapper width = 100%
    header SVG width = 100%
    map section width = 100%
    

Usually, do **not** change the SVG `viewBox` to match the displayed width. Keep the internal `viewBox` stable and control the displayed size with CSS.
***

## 12.3 Bus Sign Composition

For bus stop signs, do **not** vertically stretch one full PNG.

Instead, compose the sign from parts:
    
    
    Bus sign
    ├── Top section: fixed height
    ├── Middle section: stretchable
    └── Bottom section: fixed height
    

### Top section

Includes:

- yellow arch
- T logo
- any fixed top artwork

### Middle section

Includes:

- stretchable light/white body area
- dynamic route blocks
- route pills
- destination text
- optional frequent-route clock/badge

### Bottom section

Includes:

- red tow-zone area
- footer/contact area
- rounded bottom corners
- fixed bottom artwork

This lets the sign grow taller for more routes without distorting the yellow arch or bottom footer.

***

## 12.4 Route Pills

The black route-number pills should be generated dynamically.

They should **not** be baked into the sign background.

Recommended simple implementation:
    
    
    HTML/CSS pill
    

Each pill is a styled element with:

- black background
- large border radius
- white centered route number text
- width/height rules
- optional auto-shrink for long route numbers

This makes it easier to support:

- 1 route
- 2 routes
- 3 routes
- eventually more routes

without creating a separate background for every variation.

***

## 12.5 Route Blocks

Each bus route should be represented as a reusable route block.

Conceptual data structure:
    
    
    [
      { number: "39", destination: "Back Bay\nStation", frequencyMinutes: 15 },
      { number: "41", destination: "JFK/UMass\nStation" }
    ]
    

Each route block renders:

- route pill
- destination text
- optional frequency badge/clock

The app can then generate one route block per route object.

This is cleaner than manually positioning every possible route variation.

***

## 12.6 Asset Hosting

Recommended asset strategy:

- Store image assets inside the project repo.
- Let Vercel serve them as normal public/static files.
- Reference them with paths like `/maps/red-line-map.png` or `/assets/bus-top.png`.

Avoid:

- hotlinking raw GitHub image URLs
- base64-encoding every image unless there is a specific export reason

This keeps the app more stable and easier to deploy.

***

# 13. Current Bus Prototype Notes

A current bus sign prototype exists with:

- base sign SVG
- editable route numbers
- editable destination text
- editable stop number
- live preview
- optional position tweaks
- SVG export
- PNG export

The current hand-tuned two-route defaults are:

| Setting | Value | 
| ---- | ----  |
| Route X | 340 | 
| Route font size | 170 | 
| Top route Y | 575 | 
| Bottom route Y | 1089 | 
| Destination X | 140 | 
| Destination font size | 104 | 
| Top destination Y | 690 | 
| Bottom destination Y | 1210 | 
| Line gap | 132 | 
| Stop number font size | 102 | 
| Stop number X | 688 | 
| Stop number Y | 2050 | 

These values work as a good baseline for a two-route sign, but they are not a complete long-term solution because longer route names, 3-digit route numbers, and varied destination text may need auto-fitting.

***

# 14. UX Requirements

## 14.1 Child-Friendly Main UI

The primary UI should be simple:

- choose Bus or Train
- choose real sign or custom sign
- enter/select route/station details
- preview sign
- download sign

Advanced position controls should be hidden in an **Advanced** or **Layout Tweaks** section.

## 14.2 Live Preview

The preview should update immediately when the user changes:

- route number
- destination text
- station name
- line color
- icons
- map options
- frequent-route clock toggle

## 14.3 Export

At minimum, support:

- PNG export
- SVG export where feasible

SVG export is ideal for crisp graphics. PNG export is useful for sharing and printing.

***

# 15. Technical Requirements

## 15.1 Rendering

The app should support both of these rendering approaches depending on sign type:

### SVG-first rendering

Best for:

- editable headers
- simple vector sign elements
- text placement
- route pills if doing them as SVG

### HTML/CSS composition

Best for:

- dynamic route blocks
- stretchable bus middle section
- CSS route pills
- mixed PNG/SVG signs

The final app may use a hybrid approach.

## 15.2 Responsiveness

Signs should scale as one visual unit.

For SVG-based signs:
    
    
    Use stable viewBox
    Scale displayed width/height with CSS
    

For mixed SVG/PNG signs:
    
    
    Use one wrapper
    Set child elements to width: 100%
    Keep proportions consistent
    

## 15.3 Text Fitting

The app should eventually include auto-fit behavior.

For route pills:

- center the route number
- shrink 3-digit numbers if needed
- prevent overflow

For destination/station text:

- auto-wrap long names
- shrink font size when needed
- preserve MBTA-like visual hierarchy
***

# 16. Functional Requirements

## Global Requirements

The app must:

- provide Bus and Train modes
- support real-data-assisted and custom workflows
- show live preview
- export finished signs
- keep dynamic content editable
- preserve sign alignment while resizing

## Bus Requirements

The app must:

- support up to 3 custom route entries
- ignore blank route entries
- generate the correct number of route pills
- support route-first API flow
- support stop-first API flow eventually
- count routes serving a stop
- choose sign layout based on route count
- optionally include frequent-route clock
- support custom text without API dependency

## Train Requirements

The app must:

- support line color selection
- support station name selection or custom station name
- support optional subtext
- support manual icon selection
- support left/right icon placement
- support optional map display
- support editable SVG header composition
- support PNG map assets below the header
***

# 17. MVP Recommendation

## MVP should focus on Bus first

Bus mode is more concrete because:

- there is already a working visual prototype
- the route/stop API flow is clearer
- the dynamic route-count problem is well-defined
- the current target sign type is already partly built

## MVP Bus Scope

Include:

- Bus / Train top-level tabs, with Train allowed to say "Coming soon"
- Create Your Own Bus Sign
- 1--3 route entries
- ignore blank route entries
- route pills generated dynamically
- live preview
- PNG/SVG export
- optional frequent-route clock toggle
- basic route-first API flow if manageable
- route-count-driven layout if manageable

## MVP Technical Focus

The most important MVP architecture decision:

> Stop treating the bus sign as one fixed image. Treat it as a composed sign with a fixed top, stretchable middle, fixed bottom, and dynamic route blocks.

This will make the app much easier to expand beyond one or two routes.

***

# 18. Phase 2 Recommendation

## Phase 2: Better Bus Data + Layout

Add:

- stop-first flow
- route count from selected stop
- route-count-based layout generation
- direction-aware stop lists
- auto-fit text
- better frequent-route logic

## Phase 3: Train Mode

Add:

- train mode UI
- line color selection
- station selection
- editable SVG train header
- PNG map section
- icon selection
- icon left/right placement
- custom train sign flow
***

# 19. Acceptance Criteria

## Global Acceptance Criteria

- User can choose Bus or Train mode.
- User can create a sign through a form-based interface.
- Preview updates live.
- User can export the sign as PNG.
- SVG export is available where practical.
- Resizing the browser does not break sign alignment.

## Bus Acceptance Criteria

- User can create a custom bus sign with 1, 2, or 3 routes.
- Empty route fields are ignored.
- Number of route pills matches number of active routes.
- Destination text appears under the correct route pill.
- Frequent-route clock can be toggled.
- Sign height/layout adjusts based on active route count.
- Route-first API flow can populate stops for a selected route.
- Stop-first API flow can identify routes serving a selected stop.
- Exported sign matches preview closely.

## Train Acceptance Criteria

- User can choose a train line color.
- User can enter or select station text.
- User can add icons.
- User can choose icon side: left or right.
- User can choose map display options.
- Header and map sections scale together.
- Exported sign matches preview closely.
***

# 20. Open Questions

## Product / UX

- Should Bus and Train be top tabs or side tabs?
- Should Train appear in MVP as "coming soon," or be hidden until ready?
- Should the app prioritize realistic MBTA data or custom creativity?
- Should advanced layout controls be available to Alex, or only hidden for you?

## Bus

- Should 1-route, 2-route, and 3-route signs use separate templates or one dynamic layout?
- How should the sign handle 4+ routes?
- Should the frequent-route clock be per-route or sign-wide?
- Should the app auto-detect frequent routes or leave it as a manual toggle?
- How should long destination names wrap?
- Should route-first mode require direction, or keep it optional?

## Train

- Does train mode need direction?
- Does Green Line need branch selection?
- Should station subtext come from API data or be manually entered?
- Should icons be API-driven or manual?
- Which map assets should be included first?
- Should maps be cropped/full-size/selectable?

## Technical

- Should bus route blocks be HTML/CSS or SVG?
- Should export be generated from the DOM, canvas, or serialized SVG?
- Should PNG export include externally loaded assets?
- How should assets be organized in the repo?
- Should the app eventually save user-created signs?
***

# 21. Suggested Build Order

1. Refactor bus sign into composed top/middle/bottom structure.

2. Generate route blocks dynamically from an array.

3. Support 1, 2, and 3 active custom routes.

4. Add frequent-route clock toggle.

5. Add PNG/SVG export.

6. Add route-first MBTA API dropdown flow.

7. Add stop-first API flow and route-count detection.

8. Add text auto-fit and auto-wrap.

9. Build first train-sign prototype with editable SVG header and PNG maps.

10. Add train icon and map options.

***

# 22. One-Sentence Summary

Build a kid-friendly MBTA sign-maker web app where Bus and Train signs are composed from static assets plus dynamic editable content, with Bus mode first using route pills, stretchable sign sections, optional MBTA API data, and live exportable previews.