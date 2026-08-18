import type { OfficialInventory } from '../officialTypes';

export const MILB_OFFICIAL_INVENTORIES: Record<string, OfficialInventory> = {
  "buffalo-bisons": {
    stadiumId: "buffalo-bisons",
    league: 'MiLB',
    orientation: 158,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/buffalo/tickets/seating-diagram",
    geometryUrl: "https://img.mlbstatic.com/milb-images/image/private/t_w2208/milb/f90jhubwo9m6lmshtxpw.jpg",
    inventoryNotes: "Sahlen Field official 3-D diagram: 100-126 and 128 in the lower horseshoe, 201-222 under the roof, Bully Hill Party Deck past 128. FAQ reserved 100-120 / accessible 123-124 is a ticket-product subset of the same chart.",
    bands: [
      { ids: ["100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "128"], level: "lower", namePrefix: "Reserved" },
      { ids: ["201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222"], level: "upper", namePrefix: "Section", startOffset: 74, endOffset: 286 },
    ],
    named: [
      { id: "bully-hill-party-deck", name: "Bully Hill Party Deck", level: "club", compassOffset: 90, span: 16 },
    ],
  },
  "durham-bulls": {
    stadiumId: "durham-bulls",
    league: 'MiLB',
    orientation: 150,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/durham/ballpark/seating-map",
    inventoryNotes: "Club seating map + DBAP products: 100-level horseshoe, even 200s, Blue Monster.",
    bands: [
      { ids: ["100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "113", "114", "115", "116", "117", "118"], level: "lower", namePrefix: "Section" },
      { ids: ["202", "204", "206", "208", "210"], level: "upper", namePrefix: "Section", startOffset: 74, endOffset: 286 },
    ],
    named: [
      { id: "blue-monster", name: "Blue Monster", level: "club", compassOffset: 270, span: 18 },
      { id: "pnc-triangle-club", name: "PNC Triangle Club", level: "club", compassOffset: 180, span: 12 },
      { id: "jackie-robinson-deck", name: "Jackie Robinson Deck", level: "standing", compassOffset: 20, span: 20 },
    ],
  },
  "erie-seawolves": {
    stadiumId: "erie-seawolves",
    league: 'MiLB',
    orientation: 45,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/erie/tickets",
    inventoryNotes: "UPMC Park club tickets page publishes reserved 102-117 and club 201-211 plus the Party Deck.",
    bands: [
      { ids: ["102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117"], level: "lower", namePrefix: "Section" },
      { ids: ["201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211"], level: "club", namePrefix: "Club" },
    ],
    named: [
      { id: "party-deck", name: "Party Deck", level: "club", compassOffset: 90, span: 14 },
    ],
  },
  "jacksonville-jumbo-shrimp": {
    stadiumId: "jacksonville-jumbo-shrimp",
    league: 'MiLB',
    orientation: 43,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/jacksonville/tickets",
    inventoryNotes: "Club ticket page lists 102-113 and 118-120 as published reserved products.",
    bands: [
      { ids: ["102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "118", "119", "120"], level: "lower", namePrefix: "Section" },
    ],
    named: [],
  },
  "las-vegas-aviators": {
    stadiumId: "las-vegas-aviators",
    league: 'MiLB',
    orientation: 80,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/las-vegas/tickets",
    inventoryNotes: "Las Vegas Ballpark official products: 101-117 field, pool, berm, Home Run Porch, Las Vegas Club.",
    bands: [
      { ids: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117"], level: "field", namePrefix: "Section" },
    ],
    named: [
      { id: "pool-area", name: "Pool Area", level: "club", compassOffset: 20, span: 16 },
      { id: "berm", name: "Grass Berm", level: "standing", compassOffset: 0, span: 28 },
      { id: "home-run-porch", name: "Home Run Porch", level: "standing", compassOffset: 40, span: 18 },
      { id: "las-vegas-club", name: "Las Vegas Club", level: "club", compassOffset: 180, span: 14 },
      { id: "party-deck", name: "Party Deck", level: "club", compassOffset: 90, span: 14 },
    ],
  },
  "montgomery-biscuits": {
    stadiumId: "montgomery-biscuits",
    league: 'MiLB',
    orientation: 45,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/montgomery/tickets",
    inventoryNotes: "Montgomery Riverwalk Stadium club page publishes reserved 101-117 and the Outfield Lawn.",
    bands: [
      { ids: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117"], level: "lower", namePrefix: "Section" },
    ],
    named: [
      { id: "outfield-lawn", name: "Outfield Lawn", level: "standing", compassOffset: 0, span: 30 },
    ],
  },
  "norfolk-tides": {
    stadiumId: "norfolk-tides",
    league: 'MiLB',
    orientation: 138,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/norfolk/tickets",
    inventoryNotes: "Harbor Park club page publishes reserved 200-223.",
    bands: [
      { ids: ["200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223"], level: "upper", namePrefix: "Section", startOffset: 74, endOffset: 286 },
    ],
    named: [],
  },
  "oklahoma-city-dodgers": {
    stadiumId: "oklahoma-city-dodgers",
    league: 'MiLB',
    orientation: 70,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/oklahoma-city/tickets",
    inventoryNotes: "Chickasaw Bricktown Ballpark club page publishes 100-112, 200-203, and the outfield Lawn.",
    bands: [
      { ids: ["100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112"], level: "lower", namePrefix: "Section" },
      { ids: ["200", "201", "202", "203"], level: "club", namePrefix: "Section", startOffset: 80, endOffset: 280 },
    ],
    named: [
      { id: "lawn", name: "Lawn", level: "standing", compassOffset: 0, span: 28 },
    ],
  },
  "salem-red-sox": {
    stadiumId: "salem-red-sox",
    league: 'MiLB',
    orientation: 150,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/salem/tickets",
    inventoryNotes: "Salem Memorial Ballpark club page publishes 101-105 and 113-117 plus the Green Monster.",
    bands: [
      { ids: ["101", "102", "103", "104", "105", "113", "114", "115", "116", "117"], level: "lower", namePrefix: "Section" },
    ],
    named: [
      { id: "green-monster", name: "Green Monster", level: "club", compassOffset: 270, span: 18 },
    ],
  },
  "somerset-patriots": {
    stadiumId: "somerset-patriots",
    league: 'MiLB',
    orientation: 90,
    angleConvention: 'baseball-local',
    sourceKind: "official-static-chart",
    officialUrl: "https://www.milb.com/somerset/tickets",
    inventoryNotes: "TD Bank Ballpark club page publishes 101-122 and 201-218 plus standing room.",
    bands: [
      { ids: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122"], level: "lower", namePrefix: "Section" },
      { ids: ["201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218"], level: "upper", namePrefix: "Section", startOffset: 74, endOffset: 286 },
    ],
    named: [
      { id: "standing-room", name: "Standing Room", level: "standing", compassOffset: 20, span: 16 },
    ],
  },
};
