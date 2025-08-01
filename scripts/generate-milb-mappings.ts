// Script to generate complete MiLB team mappings from MLB Stats API
async function generateMappings() {
  const sportIds = [
    { id: 11, name: 'AAA' },
    { id: 12, name: 'AA' },
    { id: 13, name: 'High-A' },
    { id: 14, name: 'Single-A' }
  ];

  const allMappings: Array<{ venueId: number, teamId: number, teamName: string, venueName: string, level: string }> = [];

  for (const sport of sportIds) {
    const url = `https://statsapi.mlb.com/api/v1/teams?sportId=${sport.id}&season=2024`;
    console.log(`\nFetching ${sport.name} teams...`);
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.teams) {
        console.log(`Found ${data.teams.length} ${sport.name} teams`);
        
        for (const team of data.teams) {
          if (team.venue && team.venue.id && team.active) {
            allMappings.push({
              venueId: team.venue.id,
              teamId: team.id,
              teamName: team.name,
              venueName: team.venue.name,
              level: sport.name
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching ${sport.name} teams:`, error);
    }
  }

  // Generate the mapping code
  console.log('\n\nexport const MILB_VENUE_TO_TEAM_MAP: Record<number, number> = {');
  
  for (const level of ['AAA', 'AA', 'High-A', 'Single-A']) {
    const levelMappings = allMappings.filter(m => m.level === level);
    console.log(`  // ${level} Teams`);
    
    for (const mapping of levelMappings) {
      console.log(`  ${mapping.venueId}: ${mapping.teamId},  // ${mapping.venueName} -> ${mapping.teamName}`);
    }
    console.log('');
  }
  
  console.log('};');
  
  console.log(`\n\nTotal mappings generated: ${allMappings.length}`);
}

generateMappings();