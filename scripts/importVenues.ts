#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface SeatingGeometry {
  bowlShape: 'circular' | 'rectangular' | 'oval';
  fieldDimensions: {
    length: number;
    width: number;
  };
  endZoneOrientation?: string;
  primarySeatingAngle: number;
  sideline1Angle?: number;
  sideline2Angle?: number;
  endZone1Angle?: number;
  endZone2Angle?: number;
}

interface Venue {
  id: string;
  name: string;
  league: string;
  team: string;
  alternateTeams?: string[];
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
  timezone: string;
  seatingGeometry: SeatingGeometry;
  venueType: string;
  surface: string;
  opened: number;
  address: string;
}

interface League {
  name: string;
  sport: string;
  season: {
    start: string;
    end: string;
  };
  gameTypes: string[];
  typicalGameTimes: string[];
}

interface VenueType {
  defaultGameDuration: number;
  shadePriority: 'low' | 'medium' | 'high';
  sunExposureConcerns: string[];
  seasonalFactors: string[];
}

interface VenuesConfig {
  venues: Venue[];
  leagues: Record<string, League>;
  venueTypes: Record<string, VenueType>;
}

interface GeneratedVenueData {
  venues: Venue[];
  venuesByLeague: Record<string, Venue[]>;
  venueById: Record<string, Venue>;
  leagues: Record<string, League>;
  venueTypes: Record<string, VenueType>;
}

/**
 * Import venues from venues.json and generate static props data
 */
class VenueImporter {
  private config: VenuesConfig;
  private outputDir: string;

  constructor(configPath: string, outputDir: string = 'src/data') {
    this.config = this.loadConfig(configPath);
    this.outputDir = outputDir;
  }

  private loadConfig(configPath: string): VenuesConfig {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(configContent) as VenuesConfig;
    } catch (error) {
      throw new Error(`Failed to load venues config from ${configPath}: ${error}`);
    }
  }

  /**
   * Generate static props data for all venues
   */
  public generateStaticProps(): GeneratedVenueData {
    const venuesByLeague: Record<string, Venue[]> = {};
    const venueById: Record<string, Venue> = {};

    // Group venues by league
    this.config.venues.forEach(venue => {
      if (!venuesByLeague[venue.league]) {
        venuesByLeague[venue.league] = [];
      }
      venuesByLeague[venue.league].push(venue);
      venueById[venue.id] = venue;
    });

    return {
      venues: this.config.venues,
      venuesByLeague,
      venueById,
      leagues: this.config.leagues,
      venueTypes: this.config.venueTypes
    };
  }

  /**
   * Generate main venues data file
   */
  public generateVenuesFile(): void {
    const staticProps = this.generateStaticProps();
    const outputPath = path.join(this.outputDir, 'venues.ts');
    
    const content = `// Auto-generated venues data
// Generated on ${new Date().toISOString()}

export interface Venue {
  id: string;
  name: string;
  league: string;
  team: string;
  alternateTeams?: string[];
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
  timezone: string;
  seatingGeometry: {
    bowlShape: 'circular' | 'rectangular' | 'oval';
    fieldDimensions: {
      length: number;
      width: number;
    };
    endZoneOrientation?: string;
    primarySeatingAngle: number;
    sideline1Angle?: number;
    sideline2Angle?: number;
    endZone1Angle?: number;
    endZone2Angle?: number;
  };
  venueType: string;
  surface: string;
  opened: number;
  address: string;
}

export const ALL_VENUES: Venue[] = ${JSON.stringify(staticProps.venues, null, 2)};

export const VENUES_BY_LEAGUE: Record<string, Venue[]> = ${JSON.stringify(staticProps.venuesByLeague, null, 2)};

export const VENUE_BY_ID: Record<string, Venue> = ${JSON.stringify(staticProps.venueById, null, 2)};

export const LEAGUES = ${JSON.stringify(staticProps.leagues, null, 2)};

export const VENUE_TYPES = ${JSON.stringify(staticProps.venueTypes, null, 2)};

// Helper functions
export function getVenueById(id: string): Venue | null {
  return VENUE_BY_ID[id] || null;
}

export function getVenuesByLeague(league: string): Venue[] {
  return VENUES_BY_LEAGUE[league] || [];
}

export function getAllLeagues(): string[] {
  return Object.keys(LEAGUES);
}

export function getLeagueInfo(league: string) {
  return (LEAGUES as any)[league] || null;
}

export function getVenueTypeInfo(venueType: string) {
  return (VENUE_TYPES as any)[venueType] || null;
}
`;

    this.ensureDirectoryExists(this.outputDir);
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated venues data: ${outputPath}`);
  }

  /**
   * Generate static params for Next.js dynamic routes
   */
  public generateStaticParams(): void {
    const outputPath = path.join(this.outputDir, 'venueParams.ts');
    
    const allSlugs = this.config.venues.map(venue => ({ slug: venue.id }));
    const leagueSlugs = Object.keys(this.config.leagues).map(league => ({ league: league.toLowerCase() }));
    
    const content = `// Auto-generated static params for Next.js
// Generated on ${new Date().toISOString()}

export const VENUE_STATIC_PARAMS = ${JSON.stringify(allSlugs, null, 2)};

export const LEAGUE_STATIC_PARAMS = ${JSON.stringify(leagueSlugs, null, 2)};
`;

    this.ensureDirectoryExists(this.outputDir);
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated static params: ${outputPath}`);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Run the complete import process
   */
  public async import(): Promise<void> {
    console.log('🚀 Starting venue import process...');
    console.log(`📁 Config: venues.json`);
    console.log(`📁 Output: ${this.outputDir}`);
    console.log(`📊 Found ${this.config.venues.length} venues across ${Object.keys(this.config.leagues).length} leagues`);
    
    try {
      this.generateVenuesFile();
      this.generateStaticParams();
      
      console.log('✅ Venue import completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Update your Next.js dynamic routes to use the new venue data');
      console.log('2. Update your sun tracker to work with different venue types');
      console.log('3. Add league filtering to your navigation');
      
    } catch (error) {
      console.error('❌ Import failed:', error);
      process.exit(1);
    }
  }
}

// CLI execution
if (require.main === module) {
  const configPath = process.argv[2] || 'venues.json';
  const outputDir = process.argv[3] || 'src/data';
  
  const importer = new VenueImporter(configPath, outputDir);
  importer.import().catch(console.error);
}

export { VenueImporter };