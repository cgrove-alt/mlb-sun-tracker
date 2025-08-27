# ChipScroller Component

A horizontal scrolling container for chip/pill filters with smooth scrolling, gradient fade edges, and mobile-optimized touch interactions.

## Features

- 🎯 **Horizontal Scrolling**: Smooth horizontal scroll with touch support
- 🎨 **Gradient Fade Edges**: Visual indicators for scrollable content
- 📱 **Mobile Optimized**: Touch scrolling, snap points, hidden scrollbars
- ♿ **Accessible**: ARIA attributes, keyboard navigation, screen reader support
- 🎛️ **Single & Multi-select**: Support for both selection modes
- 🎯 **Auto-scroll to Selected**: Automatically centers selected items
- 🚫 **Disabled State**: Support for disabled chips
- 🖼️ **Icon Support**: Optional icons for visual enhancement

## Usage

### Basic Usage

```tsx
import { ChipScroller } from '@/components/ChipScroller';

const options = [
  { id: 'all', label: 'All' },
  { id: 'shaded', label: 'Shaded Seats', icon: '🌂' },
  { id: 'covered', label: 'Covered', icon: '🏠' },
];

function MyComponent() {
  const [selected, setSelected] = useState('all');

  return (
    <ChipScroller
      options={options}
      selectedId={selected}
      onSelect={setSelected}
      chipClassName="my-chip"
      selectedChipClassName="my-chip-selected"
    />
  );
}
```

### Multi-select Mode

```tsx
const [selectedIds, setSelectedIds] = useState(['shade', 'covered']);

<ChipScroller
  options={amenities}
  multiple
  selectedIds={selectedIds}
  onMultiSelect={setSelectedIds}
/>
```

### With Custom Styling

The component uses CSS modules for the container, but chip styles are customizable via className props:

```css
.my-chip {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 8px 16px;
  background: white;
  transition: all 0.2s;
}

.my-chip-selected {
  background: #1d4ed8;
  color: white;
}
```

## Props

### ChipScroller Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ChipOption[]` | required | Array of chip options |
| `onSelect` | `(id: string) => void` | - | Callback for single selection |
| `selectedId` | `string` | - | Currently selected chip ID (single mode) |
| `multiple` | `boolean` | `false` | Enable multi-select mode |
| `selectedIds` | `string[]` | `[]` | Selected chip IDs (multi mode) |
| `onMultiSelect` | `(ids: string[]) => void` | - | Callback for multi selection |
| `className` | `string` | `''` | Additional className for container |
| `chipClassName` | `string` | `''` | Base className for chips |
| `selectedChipClassName` | `string` | `''` | className for selected chips |
| `disabledChipClassName` | `string` | `''` | className for disabled chips |
| `ariaLabel` | `string` | `'Filter options'` | ARIA label for the group |

### ChipOption Interface

```ts
interface ChipOption {
  id: string;           // Unique identifier
  label: string;        // Display text
  selected?: boolean;   // Pre-selected state
  icon?: ReactNode;     // Optional icon
  disabled?: boolean;   // Disabled state
}
```

## CSS Variables Used

The component integrates with your design system tokens:

- `--spacing-4`: Horizontal padding
- Design system colors and spacing from your tokens

## Browser Support

- ✅ Modern browsers with CSS mask support
- ✅ Mobile Safari (iOS)
- ✅ Chrome/Edge (Android)
- ✅ Firefox

## Accessibility

- ARIA `role="group"` with label
- `aria-pressed` for selection state
- `aria-disabled` for disabled chips
- Keyboard navigation support
- Screen reader announcements

## Performance

- Uses CSS for scrolling (no JS scroll listeners)
- Scroll snap for better UX
- Hidden scrollbars for cleaner appearance
- Gradient masks for edge fading effect