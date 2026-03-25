// Pre-computed shade analysis for World Cup 2026 venues
// Generated from sun position calculations using June 21 reference date
// Uses NREL Solar Position Algorithm + row-level shadow calculations

export interface VenueShadeGuide {
  venueId: string;
  venueName: string;
  roofType: 'open' | 'retractable' | 'fixed';
  referenceDate: string;
  shadeScore: number;
  kickoffAnalysis: KickoffShadeAnalysis[];
}

export interface KickoffShadeAnalysis {
  kickoffTime: string;
  sunAzimuth: number;
  sunAltitude: number;
  bestSections: string[];
  worstSections: string[];
  shadePct: number;
  recommendation: string;
}

export const WORLD_CUP_SHADE_GUIDES: VenueShadeGuide[] = [
  {
    "venueId": "metlife-stadium-wc",
    "venueName": "MetLife Stadium",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 7,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 140,
        "sunAltitude": 69,
        "bestSections": [
          "Lower 207",
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 51,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 245,
        "sunAltitude": 59,
        "bestSections": [
          "Lower 207",
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 55,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 280,
        "sunAltitude": 26,
        "bestSections": [
          "Lower 207",
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 68,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 307,
        "sunAltitude": -5,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "sofi-stadium-wc",
    "venueName": "SoFi Stadium",
    "roofType": "fixed",
    "referenceDate": "2026-06-21",
    "shadeScore": 10,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a fixed roof — full shade guaranteed."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a fixed roof — full shade guaranteed."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a fixed roof — full shade guaranteed."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a fixed roof — full shade guaranteed."
      }
    ]
  },
  {
    "venueId": "att-stadium-wc",
    "venueName": "AT&T Stadium",
    "roofType": "retractable",
    "referenceDate": "2026-06-21",
    "shadeScore": 10,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      }
    ]
  },
  {
    "venueId": "mercedes-benz-stadium-wc",
    "venueName": "Mercedes-Benz Stadium",
    "roofType": "retractable",
    "referenceDate": "2026-06-21",
    "shadeScore": 10,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      }
    ]
  },
  {
    "venueId": "arrowhead-stadium-wc",
    "venueName": "Arrowhead Stadium (GEHA Field)",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 7,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 127,
        "sunAltitude": 67,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 52,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 241,
        "sunAltitude": 64,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 53,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 277,
        "sunAltitude": 30,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 66,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 304,
        "sunAltitude": -3,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "hard-rock-stadium-wc",
    "venueName": "Hard Rock Stadium",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 7,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 93,
        "sunAltitude": 71,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 51,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 269,
        "sunAltitude": 68,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 52,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 284,
        "sunAltitude": 28,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 67,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 302,
        "sunAltitude": -10,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "lincoln-financial-field-wc",
    "venueName": "Lincoln Financial Field",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 7,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 137,
        "sunAltitude": 69,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 51,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 245,
        "sunAltitude": 60,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 54,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 279,
        "sunAltitude": 26,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 67,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 307,
        "sunAltitude": -5,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "levis-stadium-wc",
    "venueName": "Levi's Stadium",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 7,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 128,
        "sunAltitude": 70,
        "bestSections": [
          "Lower 211",
          "Lower 212",
          "Lower 213",
          "Lower 214",
          "Lower 215"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 51,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 247,
        "sunAltitude": 63,
        "bestSections": [
          "Lower 211",
          "Lower 212",
          "Lower 213",
          "Lower 214",
          "Lower 215"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 53,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 280,
        "sunAltitude": 27,
        "bestSections": [
          "Lower 211",
          "Lower 212",
          "Lower 213",
          "Lower 214",
          "Lower 215"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 67,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 305,
        "sunAltitude": -5,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "gillette-stadium-wc",
    "venueName": "Gillette Stadium",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 7,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 149,
        "sunAltitude": 69,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 52,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 246,
        "sunAltitude": 57,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 56,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 281,
        "sunAltitude": 24,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 69,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 309,
        "sunAltitude": -6,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "nrg-stadium-wc",
    "venueName": "NRG Stadium",
    "roofType": "retractable",
    "referenceDate": "2026-06-21",
    "shadeScore": 10,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      }
    ]
  },
  {
    "venueId": "lumen-field-wc",
    "venueName": "Lumen Field",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 6,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 143,
        "sunAltitude": 62,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 54,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 231,
        "sunAltitude": 58,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 55,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 274,
        "sunAltitude": 29,
        "bestSections": [
          "Lower 208",
          "Lower 209",
          "Lower 210",
          "Lower 211",
          "Lower 212"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 67,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 305,
        "sunAltitude": 1,
        "bestSections": [
          "Field 106",
          "Field 107",
          "Field 108",
          "Field 109",
          "Field 110"
        ],
        "worstSections": [
          "West Party Deck",
          "East Party Deck",
          "South Party Deck",
          "North Party Deck",
          "Upper 519"
        ],
        "shadePct": 79,
        "recommendation": "Most seats will be in shade — excellent conditions."
      }
    ]
  },
  {
    "venueId": "estadio-azteca-wc",
    "venueName": "Estadio Azteca",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 8,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 64,
        "sunAltitude": 80,
        "bestSections": [
          "Platea Media 201",
          "Platea Media 202",
          "Platea Media 203",
          "Platea Media 204",
          "Platea Media 205"
        ],
        "worstSections": [
          "Platea Baja 140",
          "Platea Baja 139",
          "Platea Baja 138",
          "Platea Baja 137",
          "Platea Baja 136"
        ],
        "shadePct": 63,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 284,
        "sunAltitude": 57,
        "bestSections": [
          "Platea Media 201",
          "Platea Media 202",
          "Platea Media 203",
          "Platea Media 204",
          "Platea Media 205"
        ],
        "worstSections": [
          "Platea Baja 140",
          "Platea Baja 139",
          "Platea Baja 138",
          "Platea Baja 137",
          "Platea Baja 136"
        ],
        "shadePct": 68,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 290,
        "sunAltitude": 16,
        "bestSections": [
          "Platea Media 201",
          "Platea Media 202",
          "Platea Media 203",
          "Platea Media 204",
          "Platea Media 205"
        ],
        "worstSections": [
          "Platea Baja 140",
          "Platea Baja 139",
          "Platea Baja 138",
          "Platea Baja 137",
          "Platea Baja 136"
        ],
        "shadePct": 83,
        "recommendation": "Most seats will be in shade — excellent conditions."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 306,
        "sunAltitude": -22,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "estadio-akron-wc",
    "venueName": "Estadio Akron",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 8,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 75,
        "sunAltitude": 77,
        "bestSections": [
          "Graderia 201",
          "Graderia 202",
          "Graderia 203",
          "Graderia 204",
          "Graderia 205"
        ],
        "worstSections": [
          "Platea Baja 140",
          "Platea Baja 139",
          "Platea Baja 138",
          "Platea Baja 137",
          "Platea Baja 136"
        ],
        "shadePct": 65,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 281,
        "sunAltitude": 61,
        "bestSections": [
          "Graderia 201",
          "Graderia 202",
          "Graderia 203",
          "Graderia 204",
          "Graderia 205"
        ],
        "worstSections": [
          "Platea Baja 140",
          "Platea Baja 139",
          "Platea Baja 138",
          "Platea Baja 137",
          "Platea Baja 136"
        ],
        "shadePct": 69,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 288,
        "sunAltitude": 20,
        "bestSections": [
          "Graderia 201",
          "Graderia 202",
          "Graderia 203",
          "Graderia 204",
          "Graderia 205"
        ],
        "worstSections": [
          "Platea Baja 140",
          "Platea Baja 139",
          "Platea Baja 138",
          "Platea Baja 137",
          "Platea Baja 136"
        ],
        "shadePct": 88,
        "recommendation": "Most seats will be in shade — excellent conditions."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 304,
        "sunAltitude": -18,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "estadio-bbva-wc",
    "venueName": "Estadio BBVA",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 8,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 101,
        "sunAltitude": 80,
        "bestSections": [
          "Platea Alta 201",
          "Platea Alta 202",
          "Platea Alta 203",
          "Platea Alta 204",
          "Platea Alta 205"
        ],
        "worstSections": [
          "Platea 140",
          "Platea 139",
          "Platea 138",
          "Platea 137",
          "Platea 136"
        ],
        "shadePct": 64,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 273,
        "sunAltitude": 59,
        "bestSections": [
          "Platea Alta 201",
          "Platea Alta 202",
          "Platea Alta 203",
          "Platea Alta 204",
          "Platea Alta 205"
        ],
        "worstSections": [
          "Platea 140",
          "Platea 139",
          "Platea 138",
          "Platea 137",
          "Platea 136"
        ],
        "shadePct": 69,
        "recommendation": "Mixed shade conditions — upper deck and west-side seats recommended."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 287,
        "sunAltitude": 19,
        "bestSections": [
          "Platea Alta 201",
          "Platea Alta 202",
          "Platea Alta 203",
          "Platea Alta 204",
          "Platea Alta 205"
        ],
        "worstSections": [
          "Platea 140",
          "Platea 139",
          "Platea 138",
          "Platea 137",
          "Platea 136"
        ],
        "shadePct": 83,
        "recommendation": "Most seats will be in shade — excellent conditions."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 308,
        "sunAltitude": -17,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  },
  {
    "venueId": "bc-place-wc",
    "venueName": "BC Place",
    "roofType": "retractable",
    "referenceDate": "2026-06-21",
    "shadeScore": 10,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 0,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Stadium has a retractable roof — expect full shade when closed."
      }
    ]
  },
  {
    "venueId": "bmo-field-wc",
    "venueName": "BMO Field",
    "roofType": "open",
    "referenceDate": "2026-06-21",
    "shadeScore": 9,
    "kickoffAnalysis": [
      {
        "kickoffTime": "12:00",
        "sunAzimuth": 135,
        "sunAltitude": 64,
        "bestSections": [
          "Lower 101",
          "Lower 102",
          "Lower 103",
          "Lower 104",
          "Lower 105"
        ],
        "worstSections": [
          "Temp 320",
          "Temp 319",
          "Temp 318",
          "Temp 317",
          "Temp 316"
        ],
        "shadePct": 83,
        "recommendation": "Most seats will be in shade — excellent conditions."
      },
      {
        "kickoffTime": "15:00",
        "sunAzimuth": 234,
        "sunAltitude": 61,
        "bestSections": [
          "Lower 101",
          "Lower 102",
          "Lower 103",
          "Lower 104",
          "Lower 105"
        ],
        "worstSections": [
          "Temp 320",
          "Temp 319",
          "Temp 318",
          "Temp 317",
          "Temp 316"
        ],
        "shadePct": 83,
        "recommendation": "Most seats will be in shade — excellent conditions."
      },
      {
        "kickoffTime": "18:00",
        "sunAzimuth": 275,
        "sunAltitude": 30,
        "bestSections": [
          "Lower 101",
          "Lower 102",
          "Lower 103",
          "Lower 104",
          "Lower 105"
        ],
        "worstSections": [
          "Temp 320",
          "Temp 319",
          "Temp 318",
          "Temp 317",
          "Temp 316"
        ],
        "shadePct": 89,
        "recommendation": "Most seats will be in shade — excellent conditions."
      },
      {
        "kickoffTime": "21:00",
        "sunAzimuth": 304,
        "sunAltitude": 0,
        "bestSections": [],
        "worstSections": [],
        "shadePct": 100,
        "recommendation": "Sun is below the horizon — no sun exposure."
      }
    ]
  }
] as const;

/** Get shade guide for a specific venue */
export function getShadeGuide(venueId: string): VenueShadeGuide | undefined {
  return WORLD_CUP_SHADE_GUIDES.find(g => g.venueId === venueId);
}

/** Get shade analysis for a specific venue and kickoff time */
export function getKickoffShade(venueId: string, kickoffTime: string): KickoffShadeAnalysis | undefined {
  const guide = getShadeGuide(venueId);
  return guide?.kickoffAnalysis.find(k => k.kickoffTime === kickoffTime);
}
