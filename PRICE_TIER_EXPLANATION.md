# How Price Tiers Are Determined

## Overview
Price tiers for stadium sections are hardcoded in the stadium section data files. Each section has an optional `price` field that can be one of four values:

## Price Tier Categories
1. **`luxury`** - Most expensive seats
2. **`premium`** - High-end seats  
3. **`moderate`** - Mid-range seats
4. **`value`** - Most affordable seats

## How They're Assigned

### 1. Default Assignment (generateStandardSections function)
For stadiums using the standard section generator:
```typescript
price: level === 'field' ? 'premium' : level === 'upper' ? 'value' : 'moderate'
```
- **Field level** → `premium`
- **Upper level** → `value`
- **All other levels** (lower, club) → `moderate`

### 2. Custom Stadium Assignments
Some stadiums like Yankee Stadium and Fenway Park have custom price assignments:

#### Yankee Stadium Example:
- **Legends seats** (field level behind home plate) → `luxury`
- **Field MVP seats** → `premium`
- **Main level** → `moderate`
- **Terrace/Grandstand** → `value`
- **Bleachers** → `value`

#### Fenway Park Example:
- **Field Box** (behind home plate) → `luxury`
- **Dugout Box** (behind dugouts) → `luxury`
- **Infield Box** → `premium`
- **Green Monster seats** → `luxury`
- **Grandstand** → `moderate`
- **Pavilion/Bleachers** → `value`

## Data Sources
The price tier assignments are stored in:
- `/src/data/stadiumSections.ts` - Contains all section data including prices

## How It's Used
The price filter in the app allows users to filter sections by these price tiers. The filter appears in both desktop and mobile versions of the app.

## Note on Accuracy
These price tiers are **approximations** based on typical MLB stadium pricing patterns:
- Seats closer to the field and behind home plate are generally more expensive
- Upper deck and bleacher seats are typically the most affordable
- Club level and premium areas command higher prices

The actual ticket prices vary by:
- Game popularity (opponent, day of week, etc.)
- Dynamic pricing
- Season ticket vs single game pricing
- Secondary market factors

These tiers are meant to give users a general sense of relative pricing between sections, not exact dollar amounts.