// Script to fetch MiLB team IDs from MLB Stats API
import { milbApi, MILB_LEVELS } from '../src/services/milbApi';
import { AAA_STADIUMS, AA_STADIUMS, HIGH_A_STADIUMS, LOW_A_STADIUMS } from '../src/data/milbStadiums';

async function fetchTeamMappings() {
  console.log('Fetching MiLB team mappings from MLB Stats API...\n');

  const allStadiums = [
    ...AAA_STADIUMS.map(s => ({ ...s, levelKey: 'AAA' })),
    ...AA_STADIUMS.map(s => ({ ...s, levelKey: 'AA' })),
    ...HIGH_A_STADIUMS.map(s => ({ ...s, levelKey: 'HIGH_A' })),
    ...LOW_A_STADIUMS.map(s => ({ ...s, levelKey: 'LOW_A' }))
  ];

  const mappings: Record<number, { teamId: number, teamName: string, stadiumName: string }> = {};

  for (const levelKey of ['AAA', 'AA', 'HIGH_A', 'LOW_A']) {
    try {
      console.log(`\nFetching ${levelKey} teams...`);
      const teams = await milbApi.getTeamsByLevel(levelKey as any);
      
      for (const team of teams) {
        if (team.venue && team.venue.id) {
          mappings[team.venue.id] = {
            teamId: team.id,
            teamName: team.name,
            stadiumName: team.venue.name
          };
        }
      }
    } catch (error) {
      console.error(`Error fetching ${levelKey} teams:`, error);
    }
  }

  console.log('\n\nGenerated mappings:');
  console.log('export const MILB_VENUE_TO_TEAM_MAP: Record<number, number> = {');
  
  // Group by level
  const levels = ['AAA', 'AA', 'HIGH_A', 'LOW_A'];
  
  for (const level of levels) {
    const levelStadiums = allStadiums.filter(s => s.levelKey === level);
    console.log(`\n  // ${level} Teams`);
    
    for (const stadium of levelStadiums) {
      const mapping = mappings[stadium.venueId];
      if (mapping) {
        console.log(`  ${stadium.venueId}: ${mapping.teamId},  // ${stadium.name} -> ${mapping.teamName}`);
      } else {
        console.log(`  // ${stadium.venueId}: ???,  // ${stadium.name} -> ${stadium.team} (NOT FOUND)`);
      }
    }
  }
  
  console.log('};');
  
  // Summary
  const foundCount = Object.keys(mappings).length;
  const stadiumsWithMapping = allStadiums.filter(s => mappings[s.venueId]).length;
  console.log(`\n\nSummary:`);
  console.log(`Total API venues found: ${foundCount}`);
  console.log(`Stadiums with mapping: ${stadiumsWithMapping}/${allStadiums.length}`);
}

fetchTeamMappings().catch(console.error);