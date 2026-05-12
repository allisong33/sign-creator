/**
 * MBTA Sign Generator - Dynamic Layout Engine
 * * CLAUDE PROMPT: This script handles the dynamic resizing of an SVG MBTA sign.
 * The SVG uses a mix of native vector shapes and <foreignObject> wrappers for HTML text wrapping.
 * The absolute positioning nature of SVG requires us to manually calculate and push elements
 * down the Y-axis when text wraps to multiple lines. 
 */

// =======================================================================
// 1. DATA MODEL (Example Input from App)
// =======================================================================
const mockUserInput = {
  busStopNumber: "1129",
  routes: [
    { number: "109", destination: "Back Bay Station", isFrequent: true, frequency: "15" },
    { number: "41", destination: "JFK/UMass Station via Centre St", isFrequent: false },
    { number: "39", destination: "Forest Hills", isFrequent: true, frequency: "10" }
  ]
};

// =======================================================================
// 2. CONFIGURATION & CONSTANTS
// =======================================================================
const CONFIG = {
  baseWhiteRectHeight: 1500, // Safe default height for 1-2 standard routes
  baseCanvasHeight: 2065,    // Default viewBox height
  
  // Layout Spacing
  pillHeight: 200,           // Height of the black route pill
  gapBeforePill: 67,         // The required gap between the bottom of previous text and the next pill
  
  // Starting Y-Coordinates
  startY_route1Pill: 50,
  towZoneStartY: 1290,       // The exact Y-coordinate where the red Tow Zone block begins
  towZoneBuffer: 40,         // Minimum safe pixel distance required between the last route and the Tow Zone
  
  // Domino Effect Elements (These shift down when height increases)
  dominoElements: {
    whiteBgRect: document.querySelector('#white-rectangle-background > rect'),
    towZoneBlock: document.getElementById('tow-zone-block'),
    bottomYellowBg: document.getElementById('bottom-yellow-background'),
    mainSvg: document.querySelector('svg'),
    outerBorderPath: document.getElementById('outer-perimeter-border')
  }
};

// =======================================================================
// 3. CORE LOGIC: Populate and Measure
// =======================================================================

function generateSign(data) {
  document.getElementById('dynamic-stop-number').textContent = data.busStopNumber;
  
  let currentYTracker = CONFIG.startY_route1Pill; // Tracks exact Y pixel position

  // Loop through all routes provided by the user
  data.routes.forEach((route, index) => {
    
    // CLAUDE PROMPT: Write DOM cloning logic here to duplicate the route template.
    // Assign the cloned <g> element's internal items to start at `currentYTracker`.
    
    // ... [DOM population logic goes here] ...
    
    // MEASURE THE TEXT: Grab actual rendered pixel height of the wrapped text
    const destinationDiv = document.getElementById(`dynamic-destination-name-${index}`);
    const renderedTextHeight = destinationDiv.offsetHeight; 
    
    // CALCULATE NEXT STARTING POINT:
    // Current Y + Pill (200) + 20px padding + Rendered Text Height + 67px gap
    const nextYStart = currentYTracker + CONFIG.pillHeight + 20 + renderedTextHeight + CONFIG.gapBeforePill;
    
    currentYTracker = nextYStart; 
  });

  // =======================================================================
  // 4. TRIGGER THE DOMINO EFFECT (The Overlap Check)
  // =======================================================================
  /* * CLAUDE PROMPT: After the loop finishes, currentYTracker sits exactly where 
   * the NEXT route would theoretically begin. We use this as the "bottom edge" 
   * of the generated content. If this bottom edge encroaches on the Tow Zone, 
   * we must expand the sign.
   */
  
  const bottomOfGeneratedRoutes = currentYTracker; 
  const collisionLine = CONFIG.towZoneStartY - CONFIG.towZoneBuffer;
  
  if (bottomOfGeneratedRoutes > collisionLine) {
    // Calculate exactly how many pixels we need to push the bottom elements down
    const extraHeightNeeded = bottomOfGeneratedRoutes - collisionLine;
    
    applyDominoEffect(extraHeightNeeded);
  }
}

// =======================================================================
// 5. THE DOMINO EFFECT FUNCTION
// =======================================================================

function applyDominoEffect(extraHeight) {
  /*
   * CLAUDE PROMPT: This function handles the coordinate shifts for the SVG.
   * 1. Add extraHeight to the white background <rect> height.
   * 2. Apply transform="translate(0, extraHeight)" to towZoneBlock <g> and bottomYellowBg <g>.
   * 3. Update <svg> viewBox attribute to increase overall height.
   */
   
   const newCanvasHeight = CONFIG.baseCanvasHeight + extraHeight;
   CONFIG.dominoElements.mainSvg.setAttribute("viewBox", `0 0 700 ${newCanvasHeight}`);
   
   // ... [Translation logic goes here] ...
   
   /*
    * CRITICAL CLAUDE PROMPT regarding the Outer Perimeter Border:
    * The outer border is a hardcoded <path d="..."> string ending in: ... 0 2030 Z"
    * Use a Regex or String Replacement to update '2030' and '2065' 
    * dynamically based on (2030 + extraHeight) and (2065 + extraHeight).
    */
}