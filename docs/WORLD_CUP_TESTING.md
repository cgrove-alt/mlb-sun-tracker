# World Cup 2026 Features - Manual Testing Checklist

## Overview
E2E automated tests were removed due to timeout issues. Use this manual testing checklist instead.

## Landing Page (`/worldcup2026`)

### Visual Elements
- [ ] Hero section displays with tournament stats (16 venues, 104 matches, 48 teams, 3 countries)
- [ ] Timezone notice banner visible with blue styling
- [ ] Next match countdown displays (if match data available)
- [ ] Tournament info section shows opening match and final details
- [ ] Host country stats show correct venue counts (USA: 11, Mexico: 3, Canada: 2)

### Filtering
- [ ] "All" button shows all 16 venues
- [ ] "USA" button filters to 11 USA venues only
- [ ] "Mexico" button filters to 3 Mexico venues only
- [ ] "Canada" button filters to 2 Canada venues only
- [ ] Active filter button has purple background

### Venue Cards
- [ ] Each venue card shows:
  - [ ] World Cup 2026 badge with country-specific color
  - [ ] Venue name and FIFA name (if different)
  - [ ] City and country
  - [ ] Capacity and match count
  - [ ] Surface type, roof type, section count badges
  - [ ] "Find Shaded Seats" button
- [ ] Clicking "Find Shaded Seats" navigates to `/stadium/{venue-id}`

### Responsive Design
- [ ] Desktop (1920x1080): 3-column venue grid
- [ ] Tablet (768x1024): 2-column venue grid
- [ ] Mobile (375x667): 1-column venue grid
- [ ] All text readable at all sizes

## Schedule Page (`/worldcup2026/schedule`)

### Visual Elements
- [ ] Page header shows "104 matches across 16 venues"
- [ ] Timezone notice banner visible
- [ ] Next match countdown displays
- [ ] Filter section visible with 3 filters

### Filtering
- [ ] Round filter dropdown works (All, Group Stage, Round of 16, etc.)
- [ ] Country filter dropdown works (All, USA, Mexico, Canada)
- [ ] Search input filters by team name, city, or venue
- [ ] "Showing X of Y matches" counter updates correctly
- [ ] Filters work in combination

### Match Display
- [ ] Matches grouped by date with formatted date headers
- [ ] Each match card shows:
  - [ ] Round badge (Group Stage, Final, etc.)
  - [ ] Team A vs Team B
  - [ ] Venue name, city, country
  - [ ] Kickoff time with timezone
  - [ ] "Find Shaded Seats" button
- [ ] Clicking "Find Shaded Seats" navigates to correct stadium page
- [ ] Disclaimer shown about sample match data (13/104)

### Responsive Design
- [ ] Desktop: Full-width match cards
- [ ] Mobile: Stacked layout with responsive buttons

## Countdown Component

### Functionality
- [ ] Displays days, hours, minutes, seconds
- [ ] Updates every second
- [ ] Shows "Match completed" for past matches
- [ ] Displays team names if provided
- [ ] Shows venue name
- [ ] Shows kickoff time with timezone label "(timezone - venue local time)"

### Accessibility
- [ ] Screen reader announces time remaining (test with VoiceOver/NVDA)
- [ ] All time units have proper labels
- [ ] Updates don't overwhelm screen readers

## World Cup Badge

### Stadium Pages
- [ ] Badge appears on World Cup venue section cards
- [ ] Badge shows correct country color:
  - [ ] USA venues: Blue badge
  - [ ] Mexico venues: Green badge
  - [ ] Canada venues: Red badge
- [ ] Badge does NOT appear on non-WC stadiums (e.g., Yankee Stadium)

### Landing Page
- [ ] All 16 venue cards show badges
- [ ] Match counts display correctly
- [ ] Pulsing dot animation visible

## Navigation

### Mobile Menu
- [ ] Hamburger menu opens
- [ ] "⚽ World Cup 2026" link visible
- [ ] Link highlighted when on WC pages
- [ ] Clicking link navigates to `/worldcup2026`
- [ ] Menu closes after clicking link

### SEO
- [ ] `/worldcup2026` appears in sitemap.xml
- [ ] `/worldcup2026/schedule` appears in sitemap.xml
- [ ] Page titles and meta descriptions present
- [ ] OpenGraph images configured

## Cross-Browser Testing

### Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Devices
- [ ] Desktop Windows
- [ ] Desktop macOS
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad

## Performance

### Load Times
- [ ] Landing page loads in < 3 seconds
- [ ] Schedule page loads in < 3 seconds
- [ ] Images load progressively
- [ ] No layout shift during load

### Lighthouse Scores (Target > 90)
- [ ] Performance: ___
- [ ] Accessibility: ___
- [ ] Best Practices: ___
- [ ] SEO: ___

## Known Issues

- **Timezone Display**: Kickoff times show in venue local time, countdown in user's timezone. Timezone notice banner clarifies this.
- **Match Data**: Only 13/104 matches populated with sample data
- **Desktop Nav**: World Cup link only in mobile hamburger menu (intentional per design)

## Testing Sign-off

- **Tester Name**: _______________
- **Date**: _______________
- **Browser/Device**: _______________
- **Pass/Fail**: _______________
- **Notes**: _______________
