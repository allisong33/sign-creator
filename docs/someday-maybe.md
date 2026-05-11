# Someday / Maybe

Ideas deferred from active development. Revisit when the core app is stable.

## Direction-aware route→stop lists

Currently the route→stop dropdown shows all stops for a route regardless of direction. Adding an inbound/outbound selector would let users narrow the list to only stops served in a given direction. This requires fetching stops with `filter[direction_id]=0` or `1`, then switching between the two lists when the user toggles direction.

## Destination text auto-fit (Custom mode)

Very long destination strings can overflow the sign's `foreignObject` container. Auto-reducing the font size (e.g., stepping down from 100px in 5px increments until `offsetHeight ≤ 220`) would keep long text on one or two lines without manual editing.

## Offline / no-network smoke test for Custom mode

Custom mode should work without any network access (all data is entered manually). A quick manual checklist: disable Wi-Fi, reload the page over `file://` or the local HTTP server, confirm sign renders and exports without errors.

## Frequency number in clock face

The clock currently always shows "15". The MBTA API `attributes.headway_secs` field may contain the actual headway, but as of Phase 5 no reliable API value was available to use here. Investigate whether a V3 endpoint returns current scheduled headways per route.
