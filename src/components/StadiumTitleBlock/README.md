# StadiumTitleBlock Component

A comprehensive, interactive stadium title component that provides rich information about stadiums with enhanced user experience features.

## Overview

The `StadiumTitleBlock` component is a feature-rich header component designed to display stadium information in an engaging and informative way. It supports MLB, NFL, and MiLB stadiums with league-specific customizations.

## Features

### Core Features
- **Stadium Information Display**: Name, team, location, capacity, orientation, roof type
- **League-Specific Adaptations**: Different icons and terminology for MLB, NFL, MiLB
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Accessibility**: Full ARIA labels, keyboard navigation, screen reader support

### Enhanced Features
- **Live Game Indicator**: Shows when there's a game today with animated badge
- **Weather Integration**: Current weather conditions and temperature
- **Shade Percentage**: Real-time shade coverage information
- **Quick Actions**: Calculate shade and view sections buttons
- **Social Sharing**: Share to Twitter, Facebook, or copy link
- **Favorites System**: Save favorite stadiums locally
- **Expandable Details**: Additional stadium information on demand

## Installation

```tsx
import StadiumTitleBlock from '@/components/StadiumTitleBlock';
import { StadiumTitleData } from '@/components/StadiumTitleBlock';
```

## Basic Usage

```tsx
const titleData: StadiumTitleData = {
  purpose: 'shade-guide',
  stadium: {
    name: 'Angel Stadium',
    id: 'angels'
  },
  team: {
    name: 'Los Angeles Angels',
    league: 'MLB'
  },
  quickFacts: {
    location: {
      city: 'Anaheim',
      state: 'CA'
    },
    capacity: 45517,
    orientation: 65,
    roofType: 'open',
    yearBuilt: 1966
  }
};

<StadiumTitleBlock data={titleData} />
```

## Advanced Usage

```tsx
<StadiumTitleBlock
  data={titleData}
  showBreadcrumb={true}
  compact={false}
  gameInfo={{
    isToday: true,
    time: '7:10 PM',
    opponent: 'Yankees',
    isHome: true
  }}
  weatherInfo={{
    temperature: 75,
    condition: 'Partly Cloudy',
    icon: '⛅'
  }}
  shadeInfo={{
    percentage: 65,
    bestSections: ['301', '302', '303']
  }}
  onCalculateShade={() => handleCalculateShade()}
  onViewSections={() => handleViewSections()}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `StadiumTitleData` | Yes | - | Core stadium information |
| `showBreadcrumb` | `boolean` | No | `true` | Show breadcrumb navigation |
| `className` | `string` | No | `''` | Additional CSS classes |
| `compact` | `boolean` | No | `false` | Use compact layout |
| `gameInfo` | `GameInfo` | No | - | Today's game information |
| `weatherInfo` | `WeatherInfo` | No | - | Current weather data |
| `shadeInfo` | `ShadeInfo` | No | - | Shade coverage information |
| `onCalculateShade` | `() => void` | No | - | Calculate shade callback |
| `onViewSections` | `() => void` | No | - | View sections callback |

## Type Definitions

### StadiumTitleData
```typescript
interface StadiumTitleData {
  purpose: 'shade-guide' | 'game-day' | 'visitor-guide';
  stadium: {
    name: string;
    id: string;
  };
  team: {
    name: string;
    league: 'MLB' | 'NFL' | 'MiLB';
    division?: string;
  };
  quickFacts: {
    location: {
      city: string;
      state: string;
    };
    capacity: number;
    orientation: number;
    roofType: 'open' | 'retractable' | 'fixed';
    yearBuilt?: number;
  };
}
```

### GameInfo
```typescript
interface GameInfo {
  isToday: boolean;
  time?: string;
  opponent?: string;
  isHome?: boolean;
}
```

### WeatherInfo
```typescript
interface WeatherInfo {
  temperature?: number;
  condition?: string;
  icon?: string;
}
```

### ShadeInfo
```typescript
interface ShadeInfo {
  percentage?: number;
  bestSections?: string[];
}
```

## Helper Utilities

Use the provided utility functions to prepare data:

```tsx
import { prepareStadiumTitleBlockData } from '@/utils/stadiumTitleData';

const { data, gameInfo, weatherInfo, shadeInfo } = prepareStadiumTitleBlockData(
  stadium,
  {
    guide: stadiumGuide,
    gameTime: '7:10 PM',
    opponent: 'Yankees',
    temperature: 75,
    weatherCondition: 'Partly Cloudy',
    shadedSections: 65,
    totalSections: 100,
    bestShadedSections: ['301', '302', '303']
  }
);
```

## Styling

The component uses CSS Modules for styling. Key style customization points:

- `.titleBlock` - Main container
- `.stadiumName` - Primary title
- `.teamInfo` - Team information section
- `.quickFacts` - Metadata pills
- `.enhancedInfo` - Weather and shade cards
- `.actionButtons` - Action button container

## Responsive Behavior

### Desktop (> 1024px)
- Horizontal layout with side-by-side elements
- Full feature set visible
- Hover effects on interactive elements

### Tablet (768px - 1024px)
- Optimized spacing
- Grid layout for metadata
- Touch-friendly controls

### Mobile (< 768px)
- Stacked layout
- Full-width buttons
- Simplified metadata display
- Collapsible sections

## Accessibility

- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Readers**: Hidden descriptive text for context
- **Color Contrast**: WCAG AAA compliant
- **Focus Management**: Proper focus trapping in menus

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Lazy loads interactive features
- Uses React.memo for re-render optimization
- CSS animations use transform for GPU acceleration
- LocalStorage for favorites (minimal impact)

## Examples

### MLB Stadium
```tsx
<StadiumTitleBlock
  data={{
    purpose: 'shade-guide',
    stadium: { name: 'Fenway Park', id: 'redsox' },
    team: { name: 'Boston Red Sox', league: 'MLB' },
    quickFacts: {
      location: { city: 'Boston', state: 'MA' },
      capacity: 37755,
      orientation: 25,
      roofType: 'open',
      yearBuilt: 1912
    }
  }}
/>
```

### NFL Stadium
```tsx
<StadiumTitleBlock
  data={{
    purpose: 'shade-guide',
    stadium: { name: 'Gillette Stadium', id: 'patriots' },
    team: { name: 'New England Patriots', league: 'NFL' },
    quickFacts: {
      location: { city: 'Foxborough', state: 'MA' },
      capacity: 65878,
      orientation: 0,
      roofType: 'open',
      yearBuilt: 2002
    }
  }}
/>
```

## Future Enhancements

- [ ] Real-time game scores integration
- [ ] Live weather API connection
- [ ] Animated transitions between states
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced tooltip system
- [ ] 360° stadium view integration

## Contributing

When contributing to this component:

1. Maintain accessibility standards
2. Test on multiple screen sizes
3. Ensure backwards compatibility
4. Update documentation
5. Add unit tests for new features

## License

Part of The Shadium project - All rights reserved