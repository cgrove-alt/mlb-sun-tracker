// FAQ data for World Cup 2026 — shared between server and client components

export interface FAQItem {
  question: string;
  answer: string;
}

export const WORLD_CUP_FAQ_DATA: FAQItem[] = [
  {
    question: 'Which World Cup 2026 stadiums have roofs?',
    answer: 'Five stadiums have roof coverage: SoFi Stadium (Inglewood, CA) has a fixed roof, while AT&T Stadium (Arlington, TX), Mercedes-Benz Stadium (Atlanta, GA), NRG Stadium (Houston, TX), and BC Place (Vancouver, Canada) have retractable roofs. The remaining 11 venues are open-air stadiums.'
  },
  {
    question: 'Where should I sit for shade at MetLife Stadium during the World Cup?',
    answer: 'At MetLife Stadium, the west side upper deck sections (200-level and 300-level) tend to offer the best shade during afternoon matches. For 3 PM kickoffs, look for sections on the south and west sides. For evening matches (6 PM+), most seats will be in shade as the sun sets.'
  },
  {
    question: 'Is it hot at the Mexico City World Cup games?',
    answer: 'Mexico City has a mild climate with average highs of 75-77°F (24-25°C) in June and July — cooler than most US host cities. However, the city sits at 7,350 feet elevation, making UV radiation significantly stronger. Bring SPF 50+ sunscreen and stay hydrated. Afternoon rain showers are common.'
  },
  {
    question: 'What time are World Cup 2026 matches?',
    answer: 'World Cup 2026 matches typically kick off at 12:00 PM, 3:00 PM, 6:00 PM, or 9:00 PM local time. Group stage matches run from June 11 to June 27, followed by the knockout rounds from June 28 to July 19. The final is at MetLife Stadium on July 19.'
  },
  {
    question: 'Which World Cup 2026 venue has the most shade?',
    answer: 'Among open-air venues, BMO Field (Toronto) and the three Mexican stadiums (Estadio Azteca, Estadio Akron, Estadio BBVA) score highest for shade due to their bowl designs and seat configurations. The five roofed venues (SoFi, AT&T, Mercedes-Benz, NRG, BC Place) offer guaranteed full shade.'
  },
  {
    question: 'What should I bring to an open-air World Cup match?',
    answer: 'For daytime matches at open-air venues: SPF 30+ sunscreen, a wide-brimmed hat, UV-blocking sunglasses, a portable fan, and plenty of water. Check FIFA\'s prohibited items list before attending — umbrellas and large parasols are typically not allowed. Consider wearing light-colored, moisture-wicking clothing.'
  },
  {
    question: 'When is the World Cup 2026 Final?',
    answer: 'The FIFA World Cup 2026 Final takes place on July 19, 2026, at MetLife Stadium in East Rutherford, New Jersey (the New York/New Jersey metropolitan area). Kickoff is at 3:00 PM ET. The third-place match is on July 18 at Hard Rock Stadium in Miami.'
  },
  {
    question: 'How many matches are in the 2026 World Cup?',
    answer: 'The 2026 World Cup features 104 matches — the most in tournament history. This includes 72 group stage matches (48 teams in 12 groups of 4), 16 Round of 32 matches, 8 Round of 16, 4 quarterfinals, 2 semifinals, a third-place match, and the final. Matches are spread across 16 venues in the US, Mexico, and Canada.'
  }
];
