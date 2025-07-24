import { DetailedStadium } from './detailedStadiums';

export const ADDITIONAL_DETAILED_STADIUMS: DetailedStadium[] = [
  {
    id: 'brewers',
    name: 'American Family Field',
    team: 'Milwaukee Brewers',
    city: 'Milwaukee',
    state: 'WI',
    latitude: 43.0280,
    longitude: -87.9712,
    orientation: 357,
    capacity: 41900,
    roof: 'retractable',
    specialFeatures: ['Retractable roof', 'Bernie\'s Dugout', 'Tailgating'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
        capacity: 11000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'],
        capacity: 7000,
        angle: { start: 210, end: 330 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'terrace_level',
        name: 'Terrace Level',
        level: 'Terrace',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325'],
        capacity: 12000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Upper level seating with good views'
      },
      {
        id: 'upper_deck',
        name: 'Upper Deck',
        level: 'Upper',
        sections: ['401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423', '424', '425'],
        capacity: 11900,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper deck with panoramic views'
      }
    ]
  },
  {
    id: 'cardinals',
    name: 'Busch Stadium',
    team: 'St. Louis Cardinals',
    city: 'St. Louis',
    state: 'MO',
    latitude: 38.6226,
    longitude: -90.1928,
    orientation: 92,
    capacity: 44494,
    roof: 'open',
    specialFeatures: ['Gateway Arch views', 'Cardinals Hall of Fame', 'Redbird Club'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159', '160'],
        capacity: 13000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field Box and Green Seats'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['240', '241', '242', '243', '244', '245', '246', '247', '248', '249', '250', '251', '252', '253', '254', '255', '256', '257', '258', '259', '260'],
        capacity: 8000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Redbird Club and Premium seating'
      },
      {
        id: 'pavilion_level',
        name: 'Pavilion Level',
        level: 'Pavilion',
        sections: ['330', '331', '332', '333', '334', '335', '336', '337', '338', '339', '340', '341', '342', '343', '344', '345', '346', '347', '348', '349', '350', '351', '352', '353', '354', '355', '356', '357', '358', '359', '360'],
        capacity: 15000,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Mid-level seating with great sightlines'
      },
      {
        id: 'upper_deck',
        name: 'Upper Deck',
        level: 'Upper',
        sections: ['430', '431', '432', '433', '434', '435', '436', '437', '438', '439', '440', '441', '442', '443', '444', '445', '446', '447', '448', '449', '450', '451', '452', '453', '454', '455', '456', '457', '458', '459', '460'],
        capacity: 8494,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Upper deck with city and arch views'
      }
    ]
  },
  {
    id: 'diamondbacks',
    name: 'Chase Field',
    team: 'Arizona Diamondbacks',
    city: 'Phoenix',
    state: 'AZ',
    latitude: 33.4455,
    longitude: -112.0667,
    orientation: 23,
    capacity: 48686,
    roof: 'retractable',
    specialFeatures: ['Pool area', 'Retractable roof', 'Air conditioning'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD'],
        capacity: 14000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field level infield and outfield seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225'],
        capacity: 10000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330'],
        capacity: 24686,
        angle: { start: 160, end: 380 },
        premium: false,
        description: 'Upper level with desert mountain views'
      }
    ]
  },
  {
    id: 'guardians',
    name: 'Progressive Field',
    team: 'Cleveland Guardians',
    city: 'Cleveland',
    state: 'OH',
    latitude: 41.4962,
    longitude: -81.6852,
    orientation: 60,
    capacity: 34830,
    roof: 'open',
    specialFeatures: ['Heritage Park', 'Kids Clubhouse', 'Cleveland skyline views'],
    seatingSections: [
      {
        id: 'field_box',
        name: 'Field Box',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
        capacity: 9000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field Box premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'],
        capacity: 6000,
        angle: { start: 210, end: 330 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'lower_reserved',
        name: 'Lower Reserved',
        level: 'Lower',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320'],
        capacity: 10000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Lower reserved seating'
      },
      {
        id: 'upper_reserved',
        name: 'Upper Reserved',
        level: 'Upper',
        sections: ['401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420'],
        capacity: 9830,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper reserved with city views'
      }
    ]
  },
  {
    id: 'mariners',
    name: 'T-Mobile Park',
    team: 'Seattle Mariners',
    city: 'Seattle',
    state: 'WA',
    latitude: 47.5914,
    longitude: -122.3325,
    orientation: 318,
    capacity: 47929,
    roof: 'retractable',
    specialFeatures: ['Retractable roof', 'Edgar\'s Cantina', 'The Pen', 'Mount Rainier views'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149'],
        capacity: 14000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248'],
        capacity: 10000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'main_level',
        name: 'Main Level',
        level: 'Main',
        sections: ['314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339', '340', '341', '342', '343', '344', '345', '346', '347', '348'],
        capacity: 15000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Main level seating with great views'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['180', '181', '182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193', '194', '195', '196', '197', '198', '199'],
        capacity: 8929,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with mountain and water views'
      }
    ]
  },
  {
    id: 'marlins',
    name: 'loanDepot park',
    team: 'Miami Marlins',
    city: 'Miami',
    state: 'FL',
    latitude: 25.7781,
    longitude: -80.2197,
    orientation: 40,
    capacity: 37446,
    roof: 'retractable',
    specialFeatures: ['Retractable roof', 'Home Run Sculpture', 'Bobblehead Museum'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        capacity: 10000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'],
        capacity: 8000,
        angle: { start: 210, end: 330 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'lower_level',
        name: 'Lower Level',
        level: 'Lower',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120'],
        capacity: 12000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Lower level general seating'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320'],
        capacity: 7446,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with Miami skyline views'
      }
    ]
  }
];

// Continue with remaining stadiums...
export const MORE_DETAILED_STADIUMS: DetailedStadium[] = [
  {
    id: 'mets',
    name: 'Citi Field',
    team: 'New York Mets',
    city: 'New York',
    state: 'NY',
    latitude: 40.7571,
    longitude: -73.8458,
    orientation: 90,
    capacity: 41922,
    roof: 'open',
    specialFeatures: ['Jackie Robinson Rotunda', 'Shea Bridge', 'Home Run Apple'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142'],
        capacity: 12000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'promenade_level',
        name: 'Promenade Level',
        level: 'Promenade',
        sections: ['501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511', '512', '513', '514', '515', '516', '517', '518', '519', '520', '521', '522', '523', '524', '525', '526', '527', '528', '529', '530'],
        capacity: 15000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Mid-level seating with good sightlines'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330'],
        capacity: 14922,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with NYC skyline views'
      }
    ]
  },
  {
    id: 'nationals',
    name: 'Nationals Park',
    team: 'Washington Nationals',
    city: 'Washington',
    state: 'DC',
    latitude: 38.8730,
    longitude: -77.0074,
    orientation: 87,
    capacity: 41313,
    roof: 'open',
    specialFeatures: ['Presidents Race', 'Capitol Building views', 'Cherry Blossoms'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140'],
        capacity: 12000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'gallery_level',
        name: 'Gallery Level',
        level: 'Gallery',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'],
        capacity: 10000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Mid-level premium seating'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335'],
        capacity: 19313,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with monument and city views'
      }
    ]
  },
  {
    id: 'orioles',
    name: 'Oriole Park at Camden Yards',
    team: 'Baltimore Orioles',
    city: 'Baltimore',
    state: 'MD',
    latitude: 39.2838,
    longitude: -76.6218,
    orientation: 58,
    capacity: 45971,
    roof: 'open',
    specialFeatures: ['Warehouse', 'Eutaw Street', 'Retro ballpark design'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98'],
        capacity: 15000,
        angle: { start: 180, end: 360 },
        premium: true,
        description: 'Field Box and Lower Box seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['218', '220', '222', '224', '226', '228', '230', '232', '234', '236', '238', '240', '242', '244', '246', '248', '250', '252', '254', '256', '258', '260', '262', '264', '266', '268', '270', '272', '274', '276', '278', '280', '282'],
        capacity: 8000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club Box premium seating'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339', '340', '341', '342', '343', '344', '345', '346', '347', '348', '349', '350', '351', '352', '353', '354', '355', '356', '357', '358', '359', '360', '361', '362', '363', '364', '365', '366', '367', '368', '369', '370', '371', '372', '373', '374', '375', '376', '377', '378', '379', '380', '381', '382'],
        capacity: 22971,
        angle: { start: 160, end: 380 },
        premium: false,
        description: 'Upper Reserved with warehouse views'
      }
    ]
  },
  {
    id: 'padres',
    name: 'Petco Park',
    team: 'San Diego Padres',
    city: 'San Diego',
    state: 'CA',
    latitude: 32.7076,
    longitude: -117.1570,
    orientation: 25,
    capacity: 40209,
    roof: 'open',
    specialFeatures: ['Park at the Park', 'Western Metal Supply Co. Building', 'Beach views'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
        capacity: 12000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225'],
        capacity: 8000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club level with premium amenities'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325'],
        capacity: 15000,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Upper level with bay and city views'
      },
      {
        id: 'outfield',
        name: 'Outfield',
        level: 'Outfield',
        sections: ['Park', 'Beach', 'Bud Deck'],
        capacity: 5209,
        angle: { start: 315, end: 225 },
        premium: false,
        description: 'Unique outfield seating areas'
      }
    ]
  },
  {
    id: 'phillies',
    name: 'Citizens Bank Park',
    team: 'Philadelphia Phillies',
    city: 'Philadelphia',
    state: 'PA',
    latitude: 39.9061,
    longitude: -75.1665,
    orientation: 59,
    capacity: 42792,
    roof: 'open',
    specialFeatures: ['Liberty Bell', 'Ashburn Alley', 'Phanatic\'s Phun Zone'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145'],
        capacity: 13000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field Box and Diamond Club seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'],
        capacity: 9000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club Box premium seating'
      },
      {
        id: 'terrace_level',
        name: 'Terrace Level',
        level: 'Terrace',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335'],
        capacity: 20792,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with city skyline views'
      }
    ]
  },
  {
    id: 'pirates',
    name: 'PNC Park',
    team: 'Pittsburgh Pirates',
    city: 'Pittsburgh',
    state: 'PA',
    latitude: 40.4468,
    longitude: -80.0057,
    orientation: 25,
    capacity: 38362,
    roof: 'open',
    specialFeatures: ['Roberto Clemente Bridge', 'Allegheny River views', 'PNC Diamond'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'],
        capacity: 11000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field Box premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'],
        capacity: 7000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club seating with river views'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330'],
        capacity: 20362,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with bridge and river views'
      }
    ]
  },
  {
    id: 'rangers',
    name: 'Globe Life Field',
    team: 'Texas Rangers',
    city: 'Arlington',
    state: 'TX',
    latitude: 32.7512,
    longitude: -97.0833,
    orientation: 46,
    capacity: 40300,
    roof: 'retractable',
    specialFeatures: ['Retractable roof', 'Climate controlled', 'Texas Live!'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'],
        capacity: 12000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
        capacity: 8000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'],
        capacity: 20300,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with panoramic views'
      }
    ]
  },
  {
    id: 'rays',
    name: 'Tropicana Field',
    team: 'Tampa Bay Rays',
    city: 'St. Petersburg',
    state: 'FL',
    latitude: 27.7682,
    longitude: -82.6534,
    orientation: 316,
    capacity: 25025,
    roof: 'fixed',
    specialFeatures: ['Fixed dome', 'Catwalk system', 'Ted Williams Museum'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120'],
        capacity: 8000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Field level seating under the dome'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'],
        capacity: 5000,
        angle: { start: 210, end: 330 },
        premium: true,
        description: 'Climate-controlled club seating'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320'],
        capacity: 12025,
        angle: { start: 180, end: 360 },
        premium: false,
        description: 'Upper level dome seating'
      }
    ]
  },
  {
    id: 'reds',
    name: 'Great American Ball Park',
    team: 'Cincinnati Reds',
    city: 'Cincinnati',
    state: 'OH',
    latitude: 39.0979,
    longitude: -84.5080,
    orientation: 105,
    capacity: 42319,
    roof: 'open',
    specialFeatures: ['Riverfront views', 'Hall of Fame', 'Gap'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135'],
        capacity: 13000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field Box premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225'],
        capacity: 9000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club seating with river views'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '421', '422', '423', '424', '425', '426', '427', '428', '429', '430', '431', '432', '433', '434', '435'],
        capacity: 20319,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with city and river views'
      }
    ]
  },
  {
    id: 'rockies',
    name: 'Coors Field',
    team: 'Colorado Rockies',
    city: 'Denver',
    state: 'CO',
    latitude: 39.7559,
    longitude: -104.9942,
    orientation: 40,
    capacity: 50144,
    roof: 'open',
    specialFeatures: ['Rocky Mountain views', 'Purple Row', 'Rooftop'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145'],
        capacity: 15000,
        angle: { start: 180, end: 360 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'],
        capacity: 10000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Club level with mountain views'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339', '340', '341', '342', '343', '344', '345', '346', '347', '348', '349', '350'],
        capacity: 25144,
        angle: { start: 160, end: 380 },
        premium: false,
        description: 'Upper level with panoramic mountain views'
      }
    ]
  },
  {
    id: 'royals',
    name: 'Kauffman Stadium',
    team: 'Kansas City Royals',
    city: 'Kansas City',
    state: 'MO',
    latitude: 39.0517,
    longitude: -94.4803,
    orientation: 58,
    capacity: 37903,
    roof: 'open',
    specialFeatures: ['Fountains', 'Crown Vision', 'Outfield Experience'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135'],
        capacity: 11000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field Box and Diamond Box seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'],
        capacity: 7000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club seating with fountain views'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335'],
        capacity: 19903,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with fountain and city views'
      }
    ]
  },
  {
    id: 'tigers',
    name: 'Comerica Park',
    team: 'Detroit Tigers',
    city: 'Detroit',
    state: 'MI',
    latitude: 42.3390,
    longitude: -83.0485,
    orientation: 145,
    capacity: 41083,
    roof: 'open',
    specialFeatures: ['Tiger statues', 'Ferris wheel', 'Carousel'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140'],
        capacity: 12000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field Box premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225'],
        capacity: 9000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club seating with city views'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335'],
        capacity: 20083,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with Detroit skyline views'
      }
    ]
  },
  {
    id: 'twins',
    name: 'Target Field',
    team: 'Minnesota Twins',
    city: 'Minneapolis',
    state: 'MN',
    latitude: 44.9817,
    longitude: -93.2776,
    orientation: 0,
    capacity: 38544,
    roof: 'open',
    specialFeatures: ['Minneapolis skyline', 'Target Plaza', 'Gold Glove Bar'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'],
        capacity: 11000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field level premium seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20'],
        capacity: 7000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club seating with skyline views'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230'],
        capacity: 20544,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with panoramic city views'
      }
    ]
  },
  {
    id: 'whitesox',
    name: 'Guaranteed Rate Field',
    team: 'Chicago White Sox',
    city: 'Chicago',
    state: 'IL',
    latitude: 41.8299,
    longitude: -87.6338,
    orientation: 90,
    capacity: 40615,
    roof: 'open',
    specialFeatures: ['Exploding scoreboard', 'Fundamentals deck', 'Chicago skyline'],
    seatingSections: [
      {
        id: 'field_level',
        name: 'Field Level',
        level: 'Field',
        sections: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145'],
        capacity: 12000,
        angle: { start: 190, end: 350 },
        premium: true,
        description: 'Field Box and Lower Box seating'
      },
      {
        id: 'club_level',
        name: 'Club Level',
        level: 'Club',
        sections: ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225'],
        capacity: 8000,
        angle: { start: 200, end: 340 },
        premium: true,
        description: 'Club Box premium seating'
      },
      {
        id: 'upper_level',
        name: 'Upper Level',
        level: 'Upper',
        sections: ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335'],
        capacity: 20615,
        angle: { start: 170, end: 370 },
        premium: false,
        description: 'Upper level with city skyline views'
      }
    ]
  }
];