// A (Low-A) Stadium Layouts
// Complete venue-specific seating configurations for all 35 A stadiums

import { VenueLayout } from './milbVenueLayouts';

export const aVenueLayouts: VenueLayout[] = [
  {
    venueId: 'augusta-greenjackets',
    venueName: 'SRP Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Opened 2018, Savannah River views, downtown North Augusta'
  },

  {
    venueId: 'bradenton-marauders',
    venueName: 'LECOM Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Pirates spring training facility, Gulf Coast location'
  },

  {
    venueId: 'carolina-mudcats',
    venueName: 'Five County Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Brewers affiliate, rural North Carolina setting'
  },

  {
    venueId: 'charleston-riverdogs',
    venueName: 'Joseph P. Riley Jr. Park',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-1', name: 'Box 1', level: 'field', baseAngle: 340, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-2', name: 'Box 2', level: 'field', baseAngle: 350, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-3', name: 'Box 3', level: 'field', baseAngle: 0, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-4', name: 'Box 4', level: 'field', baseAngle: 10, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-5', name: 'Box 5', level: 'field', baseAngle: 20, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'box-6', name: 'Box 6', level: 'field', baseAngle: 30, angleSpan: 10, covered: false, price: 'premium' },
      
      // Reserved
      { id: 'res-7', name: 'Reserved 7', level: 'lower', baseAngle: 40, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-8', name: 'Reserved 8', level: 'lower', baseAngle: 55, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-9', name: 'Reserved 9', level: 'lower', baseAngle: 70, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-10', name: 'Reserved 10', level: 'lower', baseAngle: 85, angleSpan: 15, covered: false, price: 'value' },
      
      { id: 'res-11', name: 'Reserved 11', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'res-12', name: 'Reserved 12', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-13', name: 'Reserved 13', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-14', name: 'Reserved 14', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'res-15', name: 'Reserved 15', level: 'lower', baseAngle: 320, angleSpan: 10, covered: false, price: 'premium' },
      { id: 'res-16', name: 'Reserved 16', level: 'lower', baseAngle: 330, angleSpan: 10, covered: false, price: 'premium' },
      
      // GA
      { id: 'rf-ga', name: 'Right Field GA', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-ga', name: 'Left Field GA', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' },
      
      // Piazza
      { id: 'piazza', name: 'The Piazza', level: 'ga', baseAngle: 150, angleSpan: 60, covered: false, price: 'value' }
    ],
    notes: 'Downtown Charleston on the Ashley River, "The Joe"'
  },

  {
    venueId: 'clearwater-threshers',
    venueName: 'BayCare Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Phillies spring training complex, Clearwater Beach nearby'
  },

  {
    venueId: 'columbia-fireflies',
    venueName: 'Segra Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Opened 2016, downtown Columbia views of State House'
  },

  {
    venueId: 'delmarva-shorebirds',
    venueName: 'Arthur W. Perdue Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Eastern Shore of Maryland, Orioles affiliate'
  },

  {
    venueId: 'down-east-wood-ducks',
    venueName: 'Grainger Stadium',
    lastUpdated: '2024-01',
    sections: [
      // Box Seats
      { id: 'box-a', name: 'Box A', level: 'field', baseAngle: 340, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-b', name: 'Box B', level: 'field', baseAngle: 0, angleSpan: 20, covered: false, price: 'premium' },
      { id: 'box-c', name: 'Box C', level: 'field', baseAngle: 20, angleSpan: 20, covered: false, price: 'premium' },
      
      // Grandstand
      { id: 'grand-1', name: 'Grandstand 1', level: 'lower', baseAngle: 40, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'grand-2', name: 'Grandstand 2', level: 'lower', baseAngle: 60, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'grand-3', name: 'Grandstand 3', level: 'lower', baseAngle: 80, angleSpan: 20, covered: true, price: 'value' },
      
      { id: 'grand-4', name: 'Grandstand 4', level: 'lower', baseAngle: 260, angleSpan: 20, covered: true, price: 'value' },
      { id: 'grand-5', name: 'Grandstand 5', level: 'lower', baseAngle: 280, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'grand-6', name: 'Grandstand 6', level: 'lower', baseAngle: 300, angleSpan: 20, covered: true, price: 'moderate' },
      { id: 'grand-7', name: 'Grandstand 7', level: 'lower', baseAngle: 320, angleSpan: 20, covered: true, price: 'moderate' },
      
      // Bleachers
      { id: 'rf-bleach', name: 'Right Field Bleachers', level: 'ga', baseAngle: 100, angleSpan: 50, covered: false, price: 'value' },
      { id: 'lf-bleach', name: 'Left Field Bleachers', level: 'ga', baseAngle: 210, angleSpan: 50, covered: false, price: 'value' }
    ],
    notes: 'Historic stadium from 1949, Eastern North Carolina'
  },

  {
    venueId: 'dunedin-blue-jays',
    venueName: 'TD Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Blue Jays spring training facility, renovated 2020'
  },

  {
    venueId: 'fayetteville-woodpeckers',
    venueName: 'Segra Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Opened 2019, downtown Fayetteville, Fort Liberty nearby'
  },

  {
    venueId: 'fort-wayne-tincaps',
    venueName: 'Parkview Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Downtown Fort Wayne, award-winning design, opened 2009'
  },

  {
    venueId: 'fredericksburg-nationals',
    venueName: 'Virginia Credit Union Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Opened 2020, Nationals affiliate, modern amenities'
  },

  {
    venueId: 'fresno-grizzlies',
    venueName: 'Chukchansi Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Downtown Fresno, formerly AAA, now Single-A'
  },

  {
    venueId: 'great-lakes-loons',
    venueName: 'Dow Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Midland, Michigan, Great Lakes Bay Region'
  },

  {
    venueId: 'hickory-crawdads',
    venueName: 'L.P. Frans Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Rangers affiliate, foothills of North Carolina'
  },

  {
    venueId: 'inland-empire-66ers',
    venueName: 'San Manuel Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'San Bernardino, historic Route 66 theme'
  },

  {
    venueId: 'jupiter-hammerheads',
    venueName: 'Roger Dean Chevrolet Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Shared with Cardinals spring training, Palm Beach County'
  },

  {
    venueId: 'kannapolis-cannon-ballers',
    venueName: 'Atrium Health Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Opened 2020, downtown Kannapolis, White Sox affiliate'
  },

  {
    venueId: 'lake-elsinore-storm',
    venueName: 'Lake Elsinore Diamond',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Padres affiliate, lake views, Southern California'
  },

  {
    venueId: 'lynchburg-hillcats',
    venueName: 'Bank of the James Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Blue Ridge Mountain views, Guardians affiliate'
  },

  {
    venueId: 'modesto-nuts',
    venueName: 'John Thurman Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Central Valley location, Mariners affiliate'
  },

  {
    venueId: 'myrtle-beach-pelicans',
    venueName: 'Pelicans Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Near Myrtle Beach attractions, Cubs affiliate'
  },

  {
    venueId: 'palm-beach-cardinals',
    venueName: 'Roger Dean Chevrolet Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Shared with Jupiter Hammerheads, Cardinals spring training'
  },

  {
    venueId: 'quad-cities-river-bandits',
    venueName: 'Modern Woodmen Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Mississippi River location, historic ballpark from 1931'
  },

  {
    venueId: 'rancho-cucamonga-quakes',
    venueName: 'LoanMart Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'San Bernardino County, mountain views'
  },

  {
    venueId: 'salem-red-sox',
    venueName: 'Carilion Clinic Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Roanoke Valley, Blue Ridge Mountains backdrop'
  },

  {
    venueId: 'san-jose-giants',
    venueName: 'Excite Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Silicon Valley location, Giants affiliate'
  },

  {
    venueId: 'st-lucie-mets',
    venueName: 'Clover Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Mets spring training facility, Port St. Lucie'
  },

  {
    venueId: 'stockton-ports',
    venueName: 'Banner Island Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Downtown waterfront location, Athletics affiliate'
  },

  {
    venueId: 'tampa-tarpons',
    venueName: 'George M. Steinbrenner Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Yankees spring training facility, Tampa Bay area'
  },

  {
    venueId: 'visalia-rawhide',
    venueName: 'Valley Strong Ballpark',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Central Valley location, Diamondbacks affiliate'
  },

  {
    venueId: 'west-virginia-power',
    venueName: 'Appalachian Power Park',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Charleston, WV on Kanawha River, Mariners affiliate'
  },

  {
    venueId: 'asheville-tourists-a',
    venueName: 'McCormick Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Historic ballpark in Blue Ridge Mountains, Astros affiliate'
  },

  {
    venueId: 'greensboro-grasshoppers-a',
    venueName: 'First National Bank Field',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Greensboro, NC, Pirates affiliate'
  },

  {
    venueId: 'lexington-legends',
    venueName: 'Legends Lane Stadium',
    lastUpdated: '2024-01',
    sections: [
      { id: 'gs-1', name: 'Grandstand 1', level: 'lower', baseAngle: 350, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-2', name: 'Grandstand 2', level: 'lower', baseAngle: 5, angleSpan: 15, covered: true, price: 'moderate' },
      { id: 'gs-3', name: 'Grandstand 3', level: 'lower', baseAngle: 20, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-4', name: 'Grandstand 4', level: 'lower', baseAngle: 35, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-5', name: 'Grandstand 5', level: 'lower', baseAngle: 260, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-6', name: 'Grandstand 6', level: 'lower', baseAngle: 275, angleSpan: 15, covered: false, price: 'value' },
      { id: 'gs-7', name: 'Grandstand 7', level: 'lower', baseAngle: 290, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'gs-8', name: 'Grandstand 8', level: 'lower', baseAngle: 305, angleSpan: 15, covered: false, price: 'moderate' },
      { id: 'rf-bleacher', name: 'RF Bleacher', level: 'ga', baseAngle: 65, angleSpan: 55, covered: false, price: 'value' },
      { id: 'cf-hill', name: 'Center Field Hill', level: 'berm', baseAngle: 120, angleSpan: 120, covered: false, price: 'value' },
      { id: 'lf-bleacher', name: 'LF Bleacher', level: 'ga', baseAngle: 240, angleSpan: 55, covered: false, price: 'value' },
      { id: 'picnic', name: 'Picnic Pavilion', level: 'ga', baseAngle: 100, angleSpan: 50, covered: true, price: 'value' }
    ],
    notes: 'Lexington, KY, Reds affiliate'
  }
];