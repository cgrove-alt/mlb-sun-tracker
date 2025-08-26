# SeatGeek Integration

This document describes the SeatGeek API integration for ticket purchasing functionality.

## Overview

The MLB Stadium Sun Tracker now integrates with SeatGeek to provide real-time ticket pricing and purchasing options, specifically highlighting affordable seats in shaded sections.

## Features

### 🎟️ Affordable Shaded Sections
- Displays sections with ≤20% sun exposure and tickets under $40
- Shows pricing from lowest to highest
- Direct links to SeatGeek for ticket purchase
- Multilingual support (English, Spanish, Japanese)

### 🔗 Deep Linking
- Generates direct SeatGeek URLs with section and price filters
- Opens in new tab for seamless user experience
- Includes affiliate tracking (when configured)

## API Integration

### SeatGeek API Service (`src/services/seatgeekApi.ts`)

#### Key Methods:
- `getEventsByVenue(venueId, dateTime)` - Find events at specific venue
- `getEventListings(eventId, options)` - Get tickets for an event
- `getAffordableTicketsInSections(eventId, sections, maxPrice)` - Filter tickets by section and price
- `findGameEvent(stadiumId, gameDateTime)` - Match MLB games to SeatGeek events
- `generateTicketUrl(event, options)` - Create purchase links

### Venue Mapping

All 30 MLB stadiums are mapped to their corresponding SeatGeek venue IDs:

```typescript
export const SEATGEEK_VENUE_IDS: Record<string, number> = {
  'angels': 30,        // Angel Stadium
  'astros': 17,        // Minute Maid Park
  'yankees': 237,      // Yankee Stadium
  // ... etc
};
```

## Component Integration

### AffordableShadeSection Component

**Location**: `src/components/AffordableShadeSection.tsx`

**Props**:
- `stadium`: Selected stadium
- `sections`: All stadium sections with sun exposure data
- `gameDateTime`: Game date and time
- `selectedGame`: MLB game data (optional)

**Behavior**:
1. Filters sections with ≤20% sun exposure
2. Queries SeatGeek API for tickets under $40 in those sections
3. Displays results with pricing and purchase links
4. Shows loading states and error handling

## Configuration

### Environment Variables

For production deployment, set these environment variables:

```bash
NEXT_PUBLIC_SEATGEEK_CLIENT_ID=your_client_id
NEXT_PUBLIC_SEATGEEK_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SEATGEEK_AFFILIATE_ID=your_affiliate_id
```

### Demo Mode

The integration includes demo credentials for development:
- Uses public SeatGeek demo client ID
- Falls back gracefully when venues aren't found
- Displays appropriate error messages

## User Experience

### Loading States
- Shows spinner while fetching ticket data
- Displays "Loading ticket information..." message

### Error Handling
- "No ticket data available for this game"
- "Failed to load ticket information"
- "No affordable shaded seats found for this game"

### Success State
- Cards showing section name, sun exposure, and pricing
- "Buy Tickets" button with arrow animation
- "View all tickets on SeatGeek" fallback link

## Styling

**CSS File**: `src/components/AffordableShadeSection.css`

**Key Features**:
- Responsive design (mobile-friendly)
- Dark mode support
- Hover animations
- Accessibility-compliant colors
- Loading spinners and transitions

## Translations

Ticket-related strings are translated in all supported languages:

**English**: "Shaded Seats Under $40"
**Spanish**: "Asientos Sombreados Bajo $40"
**Japanese**: "$40以下の日陰席"

## Security & Privacy

- API requests are made client-side
- No sensitive data is stored
- Links open in new tabs with security attributes
- Error handling prevents information leakage

## Testing

The integration handles various edge cases:
- Stadium not found in SeatGeek
- No events found for the game time
- No affordable tickets available
- API rate limiting and errors

## Future Enhancements

Potential improvements:
- Price alerts for specific sections
- Historical pricing data
- Multi-game ticket packages
- Seat quality ratings integration
- Additional ticket providers