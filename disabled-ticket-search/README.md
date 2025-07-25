# Disabled Ticket Search Functionality

This directory contains the SeatGeek ticket search functionality that has been temporarily disabled.

## Files Included

- `AffordableShadeSection.tsx.txt` - Main ticket search component
- `AffordableShadeSection.css` - Styling for the ticket search component
- `SeatGeekTicketFilter.tsx.txt` - Ticket filtering component
- `SeatGeekTicketFilter.css` - Styling for the ticket filter component
- `seatgeekApi.ts.txt` - SeatGeek API service
- `../disabled_SEATGEEK_SETUP.md` - Setup documentation

## To Re-enable the Ticket Search

1. **Restore the files:**
   ```bash
   # Rename back to proper extensions
   mv AffordableShadeSection.tsx.txt ../src/components/AffordableShadeSection.tsx
   mv SeatGeekTicketFilter.tsx.txt ../src/components/SeatGeekTicketFilter.tsx
   mv seatgeekApi.ts.txt ../src/services/seatgeekApi.ts
   
   # Copy CSS files
   cp AffordableShadeSection.css ../src/components/
   cp SeatGeekTicketFilter.css ../src/components/
   
   # Restore setup documentation
   mv ../disabled_SEATGEEK_SETUP.md ../SEATGEEK_SETUP.md
   ```

2. **Add component to main app:**
   In `components/MLBSunTrackerApp.tsx`, add:
   ```typescript
   import { AffordableShadeSection } from '../src/components/AffordableShadeSection';
   ```

   Then in the JSX, add the component where you want it to appear:
   ```jsx
   <AffordableShadeSection 
     stadium={selectedStadium}
     sections={detailedSections}
     gameDateTime={gameDateTime}
     selectedGame={selectedGame}
   />
   ```

3. **Restore translations:**
   Add the "tickets" section back to the language files:
   - `src/i18n/locales/en.json`
   - `src/i18n/locales/es.json`
   - `src/i18n/locales/ja.json`

   The translations are preserved in the Git history (commit 6150654).

## Features

The disabled ticket search functionality includes:

- **Real-time ticket pricing** from SeatGeek API
- **Advanced filtering** by price, sun exposure, seating level, and coverage
- **Multi-language support** (English, Spanish, Japanese)
- **Error handling** with retry mechanisms
- **Responsive design** for mobile and desktop
- **No mock data** - only real ticket data or clear unavailable messages

## API Configuration

To use the ticket search, you'll need to:

1. Set up SeatGeek API credentials (see `SEATGEEK_SETUP.md`)
2. Configure environment variables:
   - `NEXT_PUBLIC_SEATGEEK_CLIENT_ID`
   - `NEXT_PUBLIC_SEATGEEK_CLIENT_SECRET` (optional)

## Notes

- The functionality was fully implemented and tested
- All code is production-ready
- No mock data - only real API data is displayed
- Error handling includes network timeouts, rate limits, and API errors
- The component was not connected to the main UI when disabled