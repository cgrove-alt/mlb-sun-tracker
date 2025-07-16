// SeatGeek API Integration
// API Docs: https://platform.seatgeek.com/

export interface SeatGeekEvent {
  id: number;
  title: string;
  datetime_local: string;
  venue: {
    id: number;
    name: string;
  };
  performers: Array<{
    name: string;
    id: number;
  }>;
  stats: {
    lowest_price: number | null;
    average_price: number | null;
    highest_price: number | null;
    listing_count: number | null;
  };
  url: string;
}

export interface SeatGeekListing {
  id: number;
  section: string;
  row: string;
  quantity: number;
  price: number;
  deals?: {
    deal_score: number;
  };
  delivery?: {
    electronic: boolean;
  };
}

export interface SeatGeekEventDetail {
  id: number;
  title: string;
  datetime_local: string;
  stats: {
    listing_count: number;
    lowest_price: number | null;
    average_price: number | null;
  };
  listings?: SeatGeekListing[];
}

// SeatGeek Venue IDs for MLB Stadiums
export const SEATGEEK_VENUE_IDS: Record<string, number> = {
  // American League
  'angels': 30,        // Angel Stadium
  'astros': 17,        // Minute Maid Park
  'athletics': 234,    // Oakland Coliseum (Note: They're moving to Sutter Health Park)
  'bluejays': 119,     // Rogers Centre
  'guardians': 21,     // Progressive Field
  'mariners': 22,      // T-Mobile Park
  'orioles': 336,      // Oriole Park at Camden Yards
  'rangers': 5420,     // Globe Life Field
  'rays': 27,          // Tropicana Field
  'redsox': 39,        // Fenway Park
  'royals': 28,        // Kauffman Stadium
  'tigers': 29,        // Comerica Park
  'twins': 19,         // Target Field
  'whitesox': 31,      // Guaranteed Rate Field
  'yankees': 237,      // Yankee Stadium
  
  // National League
  'braves': 4263,      // Truist Park
  'brewers': 32,       // American Family Field
  'cardinals': 33,     // Busch Stadium
  'cubs': 34,          // Wrigley Field
  'diamondbacks': 35,  // Chase Field
  'dodgers': 236,      // Dodger Stadium
  'giants': 23,        // Oracle Park
  'marlins': 61,       // loanDepot park
  'mets': 20,          // Citi Field
  'nationals': 219,    // Nationals Park
  'padres': 24,        // Petco Park
  'phillies': 37,      // Citizens Bank Park
  'pirates': 38,       // PNC Park
  'reds': 36,          // Great American Ball Park
  'rockies': 25,       // Coors Field
};

class SeatGeekAPI {
  private clientId: string;
  private clientSecret: string;
  private baseUrl = 'https://api.seatgeek.com/2';
  private isConfigured: boolean;

  constructor() {
    // Check if proper credentials are configured
    this.clientId = process.env.NEXT_PUBLIC_SEATGEEK_CLIENT_ID || '';
    this.clientSecret = process.env.NEXT_PUBLIC_SEATGEEK_CLIENT_SECRET || '';
    
    // API is considered configured if we have a client ID that's not the old demo one
    this.isConfigured = !!this.clientId && this.clientId !== 'MzgxNDY4MjN8MTcwMjQwNTI5My4wNTUwNzI';
    
    if (!this.isConfigured) {
      console.warn('SeatGeek API credentials not configured. Set NEXT_PUBLIC_SEATGEEK_CLIENT_ID environment variable.');
    }
  }

  private async fetchWithAuth(endpoint: string, params: URLSearchParams = new URLSearchParams()) {
    // Check if API is configured
    if (!this.isConfigured) {
      throw new Error('SeatGeek API credentials not configured. Please set NEXT_PUBLIC_SEATGEEK_CLIENT_ID environment variable.');
    }

    // Add authentication
    params.append('client_id', this.clientId);
    if (this.clientSecret) {
      params.append('client_secret', this.clientSecret);
    }

    const url = `${this.baseUrl}${endpoint}?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        let errorMessage = `SeatGeek API error: ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse error response, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error('SeatGeek API error:', response.status, errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching from SeatGeek:', error);
      throw error;
    }
  }

  async getEventsByVenue(
    venueId: number, 
    dateTime?: string,
    options: {
      perPage?: number;
      type?: string;
    } = {}
  ): Promise<SeatGeekEvent[]> {
    const params = new URLSearchParams();
    params.append('venue.id', venueId.toString());
    
    if (dateTime) {
      // Format: YYYY-MM-DD
      const date = new Date(dateTime);
      const dateStr = date.toISOString().split('T')[0];
      params.append('datetime_local.gte', dateStr);
      params.append('datetime_local.lte', dateStr);
    }
    
    params.append('per_page', (options.perPage || 10).toString());
    
    if (options.type) {
      params.append('type', options.type);
    } else {
      params.append('type', 'mlb'); // Filter to MLB games only
    }

    const response = await this.fetchWithAuth('/events', params);
    return response.events || [];
  }

  async getEventDetails(eventId: number): Promise<SeatGeekEventDetail> {
    const response = await this.fetchWithAuth(`/events/${eventId}`);
    return response;
  }

  async getEventListings(eventId: number, options: {
    quantity?: number;
    priceMax?: number;
    section?: string;
  } = {}): Promise<SeatGeekListing[]> {
    const params = new URLSearchParams();
    
    if (options.quantity) {
      params.append('quantity', options.quantity.toString());
    }
    
    if (options.priceMax) {
      params.append('highest_price.lte', options.priceMax.toString());
    }
    
    if (options.section) {
      params.append('section', options.section);
    }

    const response = await this.fetchWithAuth(`/events/${eventId}/listings`, params);
    return response.listings || [];
  }

  // Get affordable tickets in specific sections
  async getAffordableTicketsInSections(
    eventId: number,
    sections: string[],
    maxPrice: number = 40
  ): Promise<Map<string, SeatGeekListing[]>> {
    const sectionListings = new Map<string, SeatGeekListing[]>();
    
    // Fetch listings for each section
    const promises = sections.map(async (section) => {
      try {
        const listings = await this.getEventListings(eventId, {
          section,
          priceMax: maxPrice
        });
        
        if (listings.length > 0) {
          sectionListings.set(section, listings);
        }
      } catch (error) {
        console.error(`Error fetching listings for section ${section}:`, error);
      }
    });
    
    await Promise.all(promises);
    return sectionListings;
  }

  // Generate SeatGeek URL for ticket purchase
  generateTicketUrl(event: SeatGeekEvent, options: {
    section?: string;
    quantity?: number;
    priceMax?: number;
  } = {}): string {
    let url = event.url;
    
    // Add affiliate tracking if needed
    const affiliateId = process.env.NEXT_PUBLIC_SEATGEEK_AFFILIATE_ID;
    if (affiliateId) {
      url += `?aid=${affiliateId}`;
    }
    
    // Add section filter if specified
    if (options.section) {
      url += (url.includes('?') ? '&' : '?') + `section=${encodeURIComponent(options.section)}`;
    }
    
    return url;
  }

  // Check if API is configured
  isApiConfigured(): boolean {
    return this.isConfigured;
  }

  // Find MLB game event for a specific venue and date/time
  async findGameEvent(
    stadiumId: string,
    gameDateTime: Date
  ): Promise<SeatGeekEvent | null> {
    const venueId = SEATGEEK_VENUE_IDS[stadiumId];
    if (!venueId) {
      console.error(`No SeatGeek venue ID found for stadium: ${stadiumId}`);
      return null;
    }
    
    if (!this.isConfigured) {
      throw new Error('SeatGeek API credentials not configured');
    }
    
    try {
      const events = await this.getEventsByVenue(venueId, gameDateTime.toISOString());
      
      // Find the event that matches closest to our game time
      const gameTime = gameDateTime.getTime();
      const matchingEvent = events.find(event => {
        const eventTime = new Date(event.datetime_local).getTime();
        const timeDiff = Math.abs(eventTime - gameTime);
        // Within 4 hours of game time
        return timeDiff < 4 * 60 * 60 * 1000;
      });
      
      return matchingEvent || null;
    } catch (error) {
      console.error('Error finding game event:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const seatgeekApi = new SeatGeekAPI();