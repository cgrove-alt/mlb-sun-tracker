# Sun Position Implementation

## Overview

The Shadium computes sun azimuth and altitude with the NOAA Global Monitoring
Laboratory Solar Calculator (Jean Meeus, *Astronomical Algorithms*), including
atmospheric refraction. Production code lives in `src/utils/solarPosition.ts`
and is exposed through `getSunPosition` in `src/utils/sunPosition.ts`.

Callers must pass a **UTC `Date`**. Stadium wall-clock times go through
`stadiumLocalToUTC` or `calendarDateAndTimeToUTC` first. Date-only ISO strings
(`YYYY-MM-DD`) must never be parsed with `new Date('YYYY-MM-DD')` — that is
UTC midnight, which is the previous evening in every US stadium timezone.

## Coordinate system

- **Azimuth**: compass degrees, 0 = north, 90 = east, 180 = south, 270 = west
- **Altitude**: apparent degrees above the horizon (geometric + NOAA refraction)
- **Geometric altitude**: unrefracted, exposed as `geometricAltitudeDegrees`

## Accuracy

Pinned against NOAA's published calculator in `src/utils/__tests__/sunAccuracy.test.ts`.

| Check | Typical error |
| --- | --- |
| NOAA GML calculator | < 0.01° (we implement the same formulas) |
| NREL SPA (Reda & Andreas 2003 table) | ~0.003° azimuth / elevation |
| Solar noon azimuth (northern hemisphere) | on the meridian (~180°) |

A 33° NOAA azimuth "discrepancy" documented in an earlier draft was a timezone
error in the comparison (1 PM EST vs 1 PM EDT), not an algorithm error. At
1 PM EDT on the 2024 summer solstice in NYC, azimuth is 181.55° — due south,
as required near solar noon.

## Why refraction matters

`suncalc.getPosition` returns *geometric* altitude and does not apply
refraction (the library's refraction helper is used only for the moon). At
20:15 EDT at Yankee Stadium that understates altitude by ~0.24°. Shadow length
is `height / tan(altitude)`; a 50 ft structure at ~2° vs ~1.77° differs by
about 13%. Evening games are where shade maps are most sensitive.

## Time conversion

| Input | Function |
| --- | --- |
| `YYYY-MM-DD` + hour + minute at a stadium | `calendarDateAndTimeToUTC` |
| `"YYYY-MM-DD"` + `"HH:MM"` strings | `stadiumLocalToUTC` |
| A real UTC instant (MLB API `gameDate`) + clock | `stadiumLocalDateAndTimeToUTC` |

## Testing

- `src/utils/__tests__/sunAccuracy.test.ts` — NOAA pins, refraction, SPA cross-check
- `src/utils/__tests__/shadeRegression.test.ts` — per-stadium position at a fixed UTC instant
- `src/utils/__tests__/stadiumTime.test.ts` — calendar-date vs UTC-midnight
- `app/api/stadium/[stadiumId]/rows/shade/__tests__/route.integration.test.ts` — `?date=` is the stadium calendar date
