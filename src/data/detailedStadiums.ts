// Import additional stadiums first
import { ADDITIONAL_DETAILED_STADIUMS, MORE_DETAILED_STADIUMS } from './allDetailedStadiums';

export interface SeatSection {
  id: string;
  name: string;
  level: string;
  sections: string[];
  capacity: number;
  angle: {
    start: number;
    end: number;
  };
  premium: boolean;
  description?: string;
}

export interface DetailedStadium {
  id: string;
  name: string;
  team: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  seatingSections: SeatSection[];
  specialFeatures: string[];
}

export const DETAILED_STADIUMS: DetailedStadium[] = [
  {
    id: 'yankees',
    name: 'Yankee Stadium',
    team: 'New York Yankees',
    city: 'New York',
    state: 'NY',
    latitude: 40.8296,
    longitude: -73.9262,
    orientation: 55,
    capacity: 46537,
    roof: 'open',
    specialFeatures: ['Monument Park', 'Great Hall', 'Legends Suite'],
    seatingSections: [
      {
        id: 'field_level_infield',
        name: 'Field Level Infield',
        level: 'Field',
        sections: ['114A', '114B', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
        capacity: 5200,
        angle: { start: 225, end: 315 },
        premium: true,
        description: 'Closest seats to the action behind home plate and infield'
      },
      {
        id: 'field_level_outfield',
        name: 'Field Level Outfield',
        level: 'Field',
        sections: ['131', '132', '133', '134', '135', '136', '137', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113'],
        capacity: 4800,
        angle: { start: 315, end: 225 },
        premium: false,
        description: 'Field level seats in foul territory and outfield areas'
      },
      {
        id: 'main_level',
        name: 'Main Level',
        level: '200',
        sections: ['205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240'],
        capacity: 12000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Main level seating with excellent views of the entire field'
      },
      {
        id: 'terrace_level',
        name: 'Terrace Level',
        level: '300',
        sections: ['305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334'],
        capacity: 10000,
        angle: { start: 200, end: 340 },
        premium: false,
        description: 'Upper level seating between the foul poles'
      },
      {
        id: 'grandstand',
        name: 'Grandstand',
        level: '400',
        sections: ['405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423', '424', '425', '426', '427', '428', '429', '430', '431', '432', '433'],
        capacity: 14537,
        angle: { start: 190, end: 350 },
        premium: false,
        description: 'Highest level with panoramic views of the field and city'
      }
    ]
  },
  {
    id: 'dodgers',
    name: 'Dodger Stadium',
    team: 'Los Angeles Dodgers',
    city: 'Los Angeles',
    state: 'CA',
    latitude: 34.0739,
    longitude: -118.2400,
    orientation: 25,
    capacity: 56000,
    roof: 'open',
    specialFeatures: ['Sunset views', 'Stadium Club', 'Dodger Dogs'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43'],
        capacity: 15000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field Box and MVP sections closest to the action'
      },
      {
        id: 'loge_level',
        name: 'Loge Level',
        level: 'Loge',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155'],
        capacity: 18000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Elevated seats with excellent sightlines of the entire field'
      },
      {
        id: 'reserve_level',
        name: 'Reserve Level',
        level: 'Reserve',
        sections: ['1RS', '2RS', '3RS', '4RS', '5RS', '6RS', '7RS', '8RS', '9RS', '10RS', '11RS', '12RS', '13RS', '14RS', '15RS', '16RS', '17RS', '18RS', '19RS', '20RS', '21RS', '22RS', '23RS', '24RS', '25RS', '26RS', '27RS', '28RS', '29RS', '30RS', '31RS', '32RS', '33RS', '34RS', '35RS', '36RS', '37RS', '38RS', '39RS', '40RS', '41RS', '42RS', '43RS', '44RS', '45RS', '46RS', '47RS', '48RS', '49RS', '50RS', '51RS', '52RS'],
        capacity: 14000,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Mid-level seating offering balance of view and value'
      },
      {
        id: 'top_deck',
        name: 'Top Deck',
        level: 'Top Deck',
        sections: ['1TD', '2TD', '3TD', '4TD', '5TD', '6TD', '7TD', '8TD', '9TD', '10TD', '11TD', '12TD', '13TD'],
        capacity: 6000,
        angle: { start: 210, end: 330 },
        premium: false,
        description: 'Highest level with stunning views of field and LA skyline'
      },
      {
        id: 'pavilion',
        name: 'Pavilion',
        level: 'Pavilion',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316'],
        capacity: 3000,
        angle: { start: 315, end: 225 },
        premium: false,
        description: 'Outfield seating with lively atmosphere, prime for home runs'
      }
    ]
  },
  {
    id: 'redsox',
    name: 'Fenway Park',
    team: 'Boston Red Sox',
    city: 'Boston',
    state: 'MA',
    latitude: 42.3467,
    longitude: -71.0972,
    orientation: 52,
    capacity: 37755,
    roof: 'open',
    specialFeatures: ['Green Monster', 'Pesky Pole', 'Triangle'],
    seatingSections: [
      {
        id: 'field_box',
        name: 'Field Box',
        level: 'Field',
        sections: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '19', '21', '23', '25', '27', '29', '30', '31', '33', '35', '37', '39', '41', '43', '44', '60', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82'],
        capacity: 8000,
        angle: { start: 210, end: 330 },
        premium: true,
        description: 'Premium field level seats close to the action'
      },
      {
        id: 'green_monster',
        name: 'Green Monster',
        level: 'Monster',
        sections: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'GMSRO'],
        capacity: 274,
        angle: { start: 315, end: 335 },
        premium: true,
        description: 'Iconic seats atop the 37-foot Green Monster wall'
      },
      {
        id: 'loge_box',
        name: 'Loge Box',
        level: 'Loge',
        sections: ['98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160', '161', '162', '163', '164', '165'],
        capacity: 12000,
        angle: { start: 190, end: 350 },
        premium: false,
        description: 'Mid-level seating directly behind Field Level'
      },
      {
        id: 'grandstand',
        name: 'Grandstand',
        level: 'Grandstand',
        sections: ['1', '2', '3', '4', '5', '6', '7', '8', '18', '20', '22', '24', '26', '28', '32', '34', '36', '38', '40', '42'],
        capacity: 10000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Upper level seating wrapping around most of Fenway'
      },
      {
        id: 'bleachers',
        name: 'Bleachers',
        level: 'Bleachers',
        sections: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43'],
        capacity: 7481,
        angle: { start: 330, end: 210 },
        premium: false,
        description: 'Outfield bleacher seating with passionate fans'
      }
    ]
  },
  {
    id: 'giants',
    name: 'Oracle Park',
    team: 'San Francisco Giants',
    city: 'San Francisco',
    state: 'CA',
    latitude: 37.7786,
    longitude: -122.3893,
    orientation: 87,
    capacity: 41915,
    roof: 'open',
    specialFeatures: ['McCovey Cove', 'AT&T Park Legacy', 'Garlic Fries', 'Bay Views'],
    seatingSections: [
      {
        id: 'field_club',
        name: 'Field Club',
        level: 'Field',
        sections: ['FC101', 'FC102', 'FC103', 'FC104', 'FC105', 'FC106', 'FC107', 'FC108', 'FC109', 'FC110'],
        capacity: 2000,
        angle: { start: 210, end: 330 },
        premium: true,
        description: 'Premium field level seats with club access'
      },
      {
        id: 'lower_box',
        name: 'Lower Box',
        level: 'Lower',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145'],
        capacity: 18000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Lower level seating with excellent field views'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225'],
        capacity: 8000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Mid-level premium seating with club amenities'
      },
      {
        id: 'upper_reserved',
        name: 'Upper Reserved',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335'],
        capacity: 10000,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level seating with panoramic bay views'
      },
      {
        id: 'bleachers',
        name: 'Bleachers',
        level: 'Bleachers',
        sections: ['137', '138', '139', '140', '141', '142', '143', '144', '145'],
        capacity: 3915,
        angle: { start: 330, end: 210 },
        premium: false,
        description: 'Right field bleachers overlooking McCovey Cove'
      }
    ]
  },
  {
    id: 'cubs',
    name: 'Wrigley Field',
    team: 'Chicago Cubs',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.9484,
    longitude: -87.6553,
    orientation: 13,
    capacity: 41649,
    roof: 'open',
    specialFeatures: ['Ivy-covered walls', 'Manual scoreboard', 'Rooftop seats', 'Wrigleyville'],
    seatingSections: [
      {
        id: 'field_box',
        name: 'Field Box',
        level: 'Field',
        sections: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        capacity: 8000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field level seats closest to the historic action'
      },
      {
        id: 'terrace_box',
        name: 'Terrace Box',
        level: 'Terrace',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'],
        capacity: 12000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Mid-level seating with great sightlines'
      },
      {
        id: 'upper_deck_box',
        name: 'Upper Deck Box',
        level: 'Upper',
        sections: ['401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423', '424', '425', '426', '427', '428', '429', '430'],
        capacity: 12000,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with historic ballpark atmosphere'
      },
      {
        id: 'bleachers',
        name: 'Bleachers',
        level: 'Bleachers',
        sections: ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143'],
        capacity: 9649,
        angle: { start: 315, end: 225 },
        premium: false,
        description: 'Famous outfield bleachers with ivy-covered wall views'
      }
    ]
  },
  {
    id: 'angels',
    name: 'Angel Stadium',
    team: 'Los Angeles Angels',
    city: 'Anaheim',
    state: 'CA',
    latitude: 33.8003,
    longitude: -117.8827,
    orientation: 65,
    capacity: 45517,
    roof: 'open',
    specialFeatures: ['Big A', 'Outfield Extravaganza', 'Rally Monkey'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
        capacity: 12000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field level seats close to the action'
      },
      {
        id: 'terrace_level',
        name: 'Terrace Level',
        level: 'Terrace',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'],
        capacity: 15000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Mid-level seating with excellent views'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['C301', 'C302', 'C303', 'C304', 'C305', 'C306', 'C307', 'C308', 'C309', 'C310', 'C311', 'C312'],
        capacity: 3000,
        angle: { start: 210, end: 330 },
        premium: true,
        description: 'Premium club seating with amenities'
      },
      {
        id: 'view_level',
        name: 'View Level',
        level: 'View',
        sections: ['401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423', '424', '425', '426', '427', '428', '429', '430'],
        capacity: 15517,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with panoramic views'
      }
    ]
  },
  {
    id: 'astros',
    name: 'Minute Maid Park',
    team: 'Houston Astros',
    city: 'Houston',
    state: 'TX',
    latitude: 29.7570,
    longitude: -95.3555,
    orientation: 20,
    capacity: 41168,
    roof: 'retractable',
    specialFeatures: ['Tal\'s Hill (former)', 'Train on tracks', 'Crawford Boxes', 'Retractable roof'],
    seatingSections: [
      {
        id: 'field_box',
        name: 'Field Box',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128'],
        capacity: 10000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224'],
        capacity: 8000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'mezzanine',
        name: 'Mezzanine',
        level: 'Mezzanine',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324'],
        capacity: 12000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Mid-level seating with good sightlines'
      },
      {
        id: 'upper_deck',
        name: 'Upper Deck',
        level: 'Upper',
        sections: ['401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423', '424', '425', '426', '427', '428', '429', '430'],
        capacity: 11168,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level affordable seating'
      }
    ]
  },
  {
    id: 'athletics',
    name: 'Oakland Coliseum',
    team: 'Oakland Athletics',
    city: 'Oakland',
    state: 'CA',
    latitude: 37.7516,
    longitude: -122.2006,
    orientation: 330,
    capacity: 46847,
    roof: 'open',
    specialFeatures: ['Foul Territory', 'Mt. Davis', 'Drummers'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
        capacity: 12000,
        angle: { start: 200, end: 340 },
        premium: false,
        description: 'Field level seating around the diamond'
      },
      {
        id: 'plaza_level',
        name: 'Plaza Level',
        level: 'Plaza',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'],
        capacity: 15000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Mid-level seating with good views'
      },
      {
        id: 'upper_deck',
        name: 'Upper Deck',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330'],
        capacity: 19847,
        angle: { start: 160, end: 380 },
        premium: false,
        description: 'Upper level with extensive foul territory views'
      }
    ]
  },
  {
    id: 'bluejays',
    name: 'Rogers Centre',
    team: 'Toronto Blue Jays',
    city: 'Toronto',
    state: 'ON',
    latitude: 43.6414,
    longitude: -79.3894,
    orientation: 15,
    capacity: 49282,
    roof: 'retractable',
    specialFeatures: ['CN Tower views', 'Retractable roof', 'Hotel rooms overlooking field'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135'],
        capacity: 12000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field level infield and outfield seating'
      },
      {
        id: '200_level',
        name: '200 Level',
        level: '200',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235'],
        capacity: 15000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: '200 level seating with climate control available'
      },
      {
        id: '500_level',
        name: '500 Level',
        level: '500',
        sections: ['501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511', '512', '513', '514', '515', '516', '517', '518', '519', '520', '521', '522', '523', '524', '525', '526', '527', '528', '529', '530', '531', '532', '533', '534', '535', '536', '537', '538', '539', '540'],
        capacity: 22282,
        angle: { start: 150, end: 390 },
        premium: false,
        description: 'Upper level with panoramic city views'
      }
    ]
  },
  {
    id: 'braves',
    name: 'Truist Park',
    team: 'Atlanta Braves',
    city: 'Atlanta',
    state: 'GA',
    latitude: 33.8908,
    longitude: -84.4678,
    orientation: 45,
    capacity: 41084,
    roof: 'open',
    specialFeatures: ['The Battery Atlanta', 'Chophouse', 'Monument Garden'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
        capacity: 13000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Premium field level seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225'],
        capacity: 8000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335'],
        capacity: 20084,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with excellent sightlines'
      }
    ]
  }
];

// Combine all detailed stadiums
const ALL_DETAILED_STADIUMS = [
  ...DETAILED_STADIUMS,
  ...ADDITIONAL_DETAILED_STADIUMS,
  ...MORE_DETAILED_STADIUMS
];

export function getDetailedStadium(stadiumId: string): DetailedStadium | undefined {
  return ALL_DETAILED_STADIUMS.find(stadium => stadium.id === stadiumId);
}

export { ALL_DETAILED_STADIUMS };