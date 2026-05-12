// src/train/data.js
// Curated MBTA rapid transit and commuter rail station data.
// No API required — update manually when the MBTA changes service.
//
// Each station has:
//   id         — unique within the line (used as a key)
//   name       — display name shown in the dropdown
//   signName   — (optional) what fills the sign; omit to use name directly
//               Used when the dropdown label includes a branch annotation
//               like "St. Paul Street (B Branch)" but the sign should say
//               just "St. Paul Street".
//   placeId    — (optional) MBTA V3 place-* stop ID for facilities API lookups
//               Surface stops (most Green Line branches) typically lack elevators
//               and are left without a placeId intentionally.

export const LINES = {
  red: {
    id: 'red',
    name: 'Red Line',
    headerColor: '#DA291C',
    defaultSubheader: 'RED LINE',
    stations: [
      { id: 'alewife',           name: 'Alewife',           placeId: 'place-alfcl' },
      { id: 'davis',             name: 'Davis',             placeId: 'place-davis' },
      { id: 'porter',            name: 'Porter',            placeId: 'place-portr' },
      { id: 'harvard',           name: 'Harvard',           placeId: 'place-harsq' },
      { id: 'central',           name: 'Central',           placeId: 'place-cntsq' },
      { id: 'kendall-mit',       name: 'Kendall/MIT',       placeId: 'place-knncl' },
      { id: 'charles-mgh',       name: 'Charles/MGH',       placeId: 'place-chmnl' },
      { id: 'park-street',       name: 'Park Street',       placeId: 'place-pktrm' },
      { id: 'downtown-crossing', name: 'Downtown Crossing', placeId: 'place-dwnxg' },
      { id: 'south-station',     name: 'South Station',     placeId: 'place-sstat' },
      { id: 'broadway',          name: 'Broadway',          placeId: 'place-brdwy' },
      { id: 'andrew',            name: 'Andrew',            placeId: 'place-andrw' },
      { id: 'jfk-umass',        name: 'JFK/UMass',         placeId: 'place-jfk'   },
      // Ashmont branch
      { id: 'savin-hill',        name: 'Savin Hill',        placeId: 'place-svnhl' },
      { id: 'fields-corner',     name: 'Fields Corner',     placeId: 'place-fldcr' },
      { id: 'shawmut',           name: 'Shawmut',           placeId: 'place-smmnl' },
      { id: 'ashmont',           name: 'Ashmont',           placeId: 'place-asmnl' },
      // Braintree branch
      { id: 'north-quincy',      name: 'North Quincy',      placeId: 'place-nqncy' },
      { id: 'wollaston',         name: 'Wollaston',         placeId: 'place-wlsta' },
      { id: 'quincy-center',     name: 'Quincy Center',     placeId: 'place-qnctr' },
      { id: 'quincy-adams',      name: 'Quincy Adams',      placeId: 'place-qamnl' },
      { id: 'braintree',         name: 'Braintree',         placeId: 'place-brntn' },
    ],
  },

  orange: {
    id: 'orange',
    name: 'Orange Line',
    headerColor: '#ED8B00',
    defaultSubheader: 'ORANGE LINE',
    stations: [
      { id: 'oak-grove',         name: 'Oak Grove',             placeId: 'place-ogmnl' },
      { id: 'malden-center',     name: 'Malden Center',         placeId: 'place-mlmnl' },
      { id: 'wellington',        name: 'Wellington',             placeId: 'place-welln' },
      { id: 'assembly',          name: 'Assembly',               placeId: 'place-astao' },
      { id: 'sullivan-square',   name: 'Sullivan Square',        placeId: 'place-sull'  },
      { id: 'community-college', name: 'Community College',      placeId: 'place-ccmnl' },
      { id: 'north-station',     name: 'North Station',          placeId: 'place-north' },
      { id: 'haymarket',         name: 'Haymarket',              placeId: 'place-haecl' },
      { id: 'state',             name: 'State',                  placeId: 'place-state' },
      { id: 'downtown-crossing', name: 'Downtown Crossing',      placeId: 'place-dwnxg' },
      { id: 'chinatown',         name: 'Chinatown',              placeId: 'place-chncl' },
      { id: 'tufts-medical',     name: 'Tufts Medical Center',   placeId: 'place-tumnl' },
      { id: 'back-bay',          name: 'Back Bay',               placeId: 'place-bbsta' },
      { id: 'mass-ave',          name: 'Massachusetts Avenue',   placeId: 'place-masta' },
      { id: 'ruggles',           name: 'Ruggles',                placeId: 'place-rugg'  },
      { id: 'roxbury-crossing',  name: 'Roxbury Crossing',       placeId: 'place-rxmnl' },
      { id: 'jackson-square',    name: 'Jackson Square',         placeId: 'place-jaksn' },
      { id: 'stony-brook',       name: 'Stony Brook',            placeId: 'place-sbmnl' },
      { id: 'green-street',      name: 'Green Street',           placeId: 'place-grnst' },
      { id: 'forest-hills',      name: 'Forest Hills',           placeId: 'place-forhl' },
    ],
  },

  blue: {
    id: 'blue',
    name: 'Blue Line',
    headerColor: '#003DA5',
    defaultSubheader: 'BLUE LINE',
    stations: [
      { id: 'wonderland',        name: 'Wonderland',        placeId: 'place-wondl' },
      { id: 'revere-beach',      name: 'Revere Beach',      placeId: 'place-rbmnl' },
      { id: 'beachmont',         name: 'Beachmont',         placeId: 'place-bmmnl' },
      { id: 'suffolk-downs',     name: 'Suffolk Downs',     placeId: 'place-sdmnl' },
      { id: 'orient-heights',    name: 'Orient Heights',    placeId: 'place-orhte' },
      { id: 'wood-island',       name: 'Wood Island',       placeId: 'place-wimnl' },
      { id: 'airport',           name: 'Airport',           placeId: 'place-aport' },
      { id: 'maverick',          name: 'Maverick',          placeId: 'place-mvbcl' },
      { id: 'aquarium',          name: 'Aquarium',          placeId: 'place-aqucl' },
      { id: 'state',             name: 'State',             placeId: 'place-state' },
      { id: 'government-center', name: 'Government Center', placeId: 'place-gover' },
      { id: 'bowdoin',           name: 'Bowdoin',           placeId: 'place-bomnl' },
    ],
  },

  green: {
    id: 'green',
    name: 'Green Line',
    headerColor: '#00843D',
    defaultSubheader: 'GREEN LINE',
    stations: [
      // GLX Extension (north) — underground/elevated, have placeIds
      { id: 'medford-tufts',         name: 'Medford/Tufts',                                   placeId: 'place-mdftf' },
      { id: 'ball-square',           name: 'Ball Square',                                     placeId: 'place-balsq' },
      { id: 'magoun-square',         name: 'Magoun Square',                                   placeId: 'place-mgngl' },
      { id: 'gilman-square',         name: 'Gilman Square',                                   placeId: 'place-gilmn' },
      { id: 'east-somerville',       name: 'East Somerville',                                 placeId: 'place-esomr' },
      { id: 'union-square',          name: 'Union Square',                                    placeId: 'place-unsqu' },
      // Main trunk (shared by all branches) — underground, have placeIds
      { id: 'lechmere',              name: 'Lechmere',                                        placeId: 'place-lecmr' },
      { id: 'science-park',          name: 'Science Park/West End',                           placeId: 'place-spmnl' },
      { id: 'north-station',         name: 'North Station',                                   placeId: 'place-north' },
      { id: 'haymarket',             name: 'Haymarket',                                       placeId: 'place-haecl' },
      { id: 'government-center',     name: 'Government Center',                               placeId: 'place-gover' },
      { id: 'park-street',           name: 'Park Street',                                     placeId: 'place-pktrm' },
      { id: 'boylston',              name: 'Boylston',                                        placeId: 'place-boyls' },
      { id: 'arlington',             name: 'Arlington',                                       placeId: 'place-armnl' },
      { id: 'copley',                name: 'Copley',                                          placeId: 'place-coecl' },
      // Shared by B, C, D (not E)
      { id: 'hynes',                 name: 'Hynes Convention Center',                         placeId: 'place-hymnl' },
      { id: 'kenmore',               name: 'Kenmore',                                         placeId: 'place-kencl' },
      // B Branch (Boston College) — surface stops, no elevators
      { id: 'blandford-st',          name: 'Blandford Street' },
      { id: 'bu-east',               name: 'BU East' },
      { id: 'bu-central',            name: 'BU Central' },
      { id: 'bu-west',               name: 'BU West' },
      { id: 'st-paul-b',             name: 'St. Paul Street (B Branch)', signName: 'St. Paul Street' },
      { id: 'pleasant-st',           name: 'Pleasant Street' },
      { id: 'babcock-st',            name: 'Babcock Street' },
      { id: 'packards-corner',       name: "Packard's Corner" },
      { id: 'harvard-ave',           name: 'Harvard Avenue' },
      { id: 'griggs-st',             name: 'Griggs Street' },
      { id: 'allston-st',            name: 'Allston Street' },
      { id: 'warren-st',             name: 'Warren Street' },
      { id: 'washington-st-b',       name: 'Washington Street (B Branch)', signName: 'Washington Street' },
      { id: 'sutherland-rd',         name: 'Sutherland Road' },
      { id: 'chestnut-hill-ave',     name: 'Chestnut Hill Avenue' },
      { id: 'south-st',              name: 'South Street' },
      { id: 'boston-college',        name: 'Boston College',               placeId: 'place-bcnwa' },
      // C Branch (Cleveland Circle) — surface stops
      { id: 'saint-marys-st',        name: "Saint Mary's Street" },
      { id: 'hawes-st',              name: 'Hawes Street' },
      { id: 'kent-st',               name: 'Kent Street' },
      { id: 'st-paul-c',             name: 'St. Paul Street (C Branch)', signName: 'St. Paul Street' },
      { id: 'coolidge-corner',       name: 'Coolidge Corner' },
      { id: 'summit-ave',            name: 'Summit Avenue' },
      { id: 'brandon-hall',          name: 'Brandon Hall' },
      { id: 'fairbanks-st',          name: 'Fairbanks Street' },
      { id: 'washington-sq',         name: 'Washington Square' },
      { id: 'tappan-st',             name: 'Tappan Street' },
      { id: 'dean-rd',               name: 'Dean Road' },
      { id: 'englewood-ave',         name: 'Englewood Avenue' },
      { id: 'cleveland-circle',      name: 'Cleveland Circle',             placeId: 'place-clmnl' },
      // D Branch (Riverside) — mix of surface and underground
      { id: 'fenway',                name: 'Fenway',                       placeId: 'place-fenwy' },
      { id: 'longwood-d',            name: 'Longwood' },
      { id: 'brookline-village',     name: 'Brookline Village' },
      { id: 'brookline-hills',       name: 'Brookline Hills' },
      { id: 'beaconsfield',          name: 'Beaconsfield' },
      { id: 'reservoir',             name: 'Reservoir' },
      { id: 'chestnut-hill-d',       name: 'Chestnut Hill' },
      { id: 'newton-centre',         name: 'Newton Centre' },
      { id: 'newton-highlands',      name: 'Newton Highlands' },
      { id: 'eliot',                 name: 'Eliot' },
      { id: 'waban',                 name: 'Waban' },
      { id: 'woodland',              name: 'Woodland' },
      { id: 'riverside',             name: 'Riverside',                    placeId: 'place-river' },
      // E Branch (Heath Street) — underground to Prudential then surface
      { id: 'prudential',            name: 'Prudential',                   placeId: 'place-prmnl' },
      { id: 'symphony',              name: 'Symphony',                     placeId: 'place-symcl' },
      { id: 'northeastern',          name: 'Northeastern' },
      { id: 'museum-fine-arts',      name: 'Museum of Fine Arts' },
      { id: 'longwood-medical',      name: 'Longwood Medical Area' },
      { id: 'brigham-circle',        name: 'Brigham Circle' },
      { id: 'fenwood-rd',            name: 'Fenwood Road' },
      { id: 'mission-park',          name: 'Mission Park' },
      { id: 'riverway',              name: 'Riverway' },
      { id: 'back-of-the-hill',      name: 'Back of the Hill' },
      { id: 'heath-st',              name: 'Heath Street',                 placeId: 'place-hsmnl' },
    ],
  },

  silver: {
    id: 'silver',
    name: 'Silver Line',
    headerColor: '#7C878E',
    defaultSubheader: 'SILVER LINE',
    stations: [
      { id: 'south-station',         name: 'South Station',     placeId: 'place-sstat'  },
      { id: 'courthouse',            name: 'Courthouse',        placeId: 'place-crtst'  },
      { id: 'world-trade-center',    name: 'World Trade Center', placeId: 'place-wtcst' },
      { id: 'silver-line-way',       name: 'Silver Line Way',   placeId: 'place-slinwy' },
      { id: 'design-center',         name: 'Design Center' },
      { id: 'eastern-ave',           name: 'Eastern Avenue' },
      { id: 'box-district',          name: 'Box District' },
      { id: 'bellingham-sq',         name: 'Bellingham Square' },
      { id: 'chelsea',               name: 'Chelsea' },
      { id: 'terminal-a',            name: 'Terminal A' },
      { id: 'terminal-b',            name: 'Terminal B' },
      { id: 'terminal-c',            name: 'Terminal C' },
      { id: 'terminal-e',            name: 'Terminal E' },
    ],
  },

  commuter: {
    id: 'commuter',
    name: 'Commuter Rail',
    headerColor: '#80276C',
    defaultSubheader: 'COMMUTER RAIL',
    stations: [
      // Major hubs
      { id: 'north-station',         name: 'North Station',          placeId: 'place-north'  },
      { id: 'south-station',         name: 'South Station',          placeId: 'place-sstat'  },
      { id: 'back-bay',              name: 'Back Bay',               placeId: 'place-bbsta'  },
      { id: 'ruggles',               name: 'Ruggles',                placeId: 'place-rugg'   },
      { id: 'forest-hills-cr',       name: 'Forest Hills',           placeId: 'place-forhl'  },
      { id: 'hyde-park',             name: 'Hyde Park' },
      { id: 'route-128',             name: 'Route 128' },
      { id: 'readville',             name: 'Readville' },
      // Fairmount Line
      { id: 'fairmount',             name: 'Fairmount' },
      { id: 'blue-hill-ave',         name: 'Blue Hill Avenue' },
      { id: 'morton-st',             name: 'Morton Street' },
      { id: 'talbot-ave',            name: 'Talbot Avenue' },
      { id: 'four-corners',          name: 'Four Corners/Geneva' },
      { id: 'uphams-corner',         name: "Uphams Corner" },
      // Providence/Stoughton Line
      { id: 'providence',            name: 'Providence' },
      { id: 'tf-green',              name: 'TF Green Airport' },
      { id: 'wickford-jct',          name: 'Wickford Junction' },
      { id: 'stoughton',             name: 'Stoughton' },
      // Needham Line
      { id: 'needham-heights',       name: 'Needham Heights' },
      { id: 'needham-center',        name: 'Needham Center' },
      { id: 'needham-junction',      name: 'Needham Junction' },
      // Franklin Line
      { id: 'franklin',              name: 'Franklin' },
      { id: 'forge-park',            name: 'Forge Park/495' },
      // Kingston/Plymouth Line
      { id: 'kingston',              name: 'Kingston' },
      { id: 'plymouth',              name: 'Plymouth' },
      // Middleborough/Lakeville Line
      { id: 'middleborough',         name: 'Middleborough/Lakeville' },
      // Greenbush Line
      { id: 'greenbush',             name: 'Greenbush' },
      { id: 'scituate',              name: 'Scituate' },
      // Lowell Line
      { id: 'lowell',                name: 'Lowell' },
      { id: 'anderson-woburn',       name: 'Anderson/Woburn' },
      // Haverhill Line
      { id: 'haverhill',             name: 'Haverhill' },
      { id: 'lawrence',              name: 'Lawrence' },
      { id: 'andover',               name: 'Andover' },
      // Newburyport/Rockport Line
      { id: 'newburyport',           name: 'Newburyport' },
      { id: 'rockport',              name: 'Rockport' },
      { id: 'gloucester',            name: 'Gloucester' },
      { id: 'salem',                 name: 'Salem' },
      { id: 'beverly',               name: 'Beverly' },
      { id: 'lynn',                  name: 'Lynn' },
      { id: 'chelsea-cr',            name: 'Chelsea', signName: 'Chelsea' },
      // Fitchburg Line
      { id: 'fitchburg',             name: 'Fitchburg' },
      { id: 'wachusett',             name: 'Wachusett' },
      { id: 'ayer',                  name: 'Ayer' },
      { id: 'concord',               name: 'Concord' },
      { id: 'acton',                 name: 'Acton' },
      // Worcester Line
      { id: 'worcester',             name: 'Worcester' },
      { id: 'framingham',            name: 'Framingham' },
      { id: 'natick',                name: 'Natick' },
      { id: 'wellesley-sq',          name: 'Wellesley Square' },
      { id: 'auburndale',            name: 'Auburndale' },
      { id: 'newtonville',           name: 'Newtonville' },
      { id: 'west-newton',           name: 'West Newton' },
    ],
  },
};
