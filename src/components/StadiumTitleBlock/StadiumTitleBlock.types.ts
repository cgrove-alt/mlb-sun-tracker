export type StadiumLeague = 'MLB' | 'NFL' | 'MiLB';
export type StadiumPurpose = 'shade-guide' | 'game-day' | 'visitor-guide';
export type RoofType = 'open' | 'retractable' | 'fixed';

export interface StadiumLocation {
  city: string;
  state: string;
}

export interface StadiumTeam {
  name: string;
  league: StadiumLeague;
  division?: string;
}

export interface StadiumQuickFacts {
  location: StadiumLocation;
  capacity: number;
  orientation: number;
  roofType: RoofType;
  yearBuilt?: number;
}

export interface StadiumTitleData {
  purpose: StadiumPurpose;
  stadium: {
    name: string;
    id: string;
  };
  team: StadiumTeam;
  quickFacts: StadiumQuickFacts;
}

export interface GameInfo {
  isToday: boolean;
  time?: string;
  opponent?: string;
  isHome?: boolean;
}

export interface WeatherInfo {
  temperature?: number;
  condition?: string;
  icon?: string;
}

export interface ShadeInfo {
  percentage?: number;
  bestSections?: string[];
}

export interface StadiumTitleBlockProps {
  data: StadiumTitleData;
  showBreadcrumb?: boolean;
  className?: string;
  compact?: boolean;
  gameInfo?: GameInfo;
  weatherInfo?: WeatherInfo;
  shadeInfo?: ShadeInfo;
  onCalculateShade?: () => void;
  onViewSections?: () => void;
}