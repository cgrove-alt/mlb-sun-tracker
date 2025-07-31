"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunCalculator = void 0;
exports.formatSunPosition = formatSunPosition;
exports.getCompassDirection = getCompassDirection;
exports.calculateGameSunExposure = calculateGameSunExposure;
// sunCalculator.ts
const suncalc_1 = __importDefault(require("suncalc"));
const nrelSolarPosition_1 = require("./nrelSolarPosition");
class SunCalculator {
    constructor(stadium) {
        this.stadium = stadium;
        this.stadiumGeometry = this.initializeStadiumGeometry();
    }
    initializeStadiumGeometry() {
        return {
            roofHeight: this.stadium.roofHeight || 150,
            roofOverhang: this.stadium.roofOverhang || 50,
            upperDeckHeight: this.stadium.upperDeckHeight || 100,
            fieldLevel: 0,
            homeplate: { x: 0, y: 0 },
            orientation: this.stadium.orientation || 0
        };
    }
    calculateSunPosition(date, time) {
        const dateTime = new Date(`${date}T${time}`);
        const useNREL = process.env.REACT_APP_USE_NREL_SPA !== 'false'; // Default to true
        let altitude;
        let azimuth;
        if (useNREL) {
            try {
                // Use NREL Solar Position Algorithm
                const timeZoneOffset = -dateTime.getTimezoneOffset() / 60;
                const nrelResult = (0, nrelSolarPosition_1.computeSunPosition)(dateTime, this.stadium.latitude, this.stadium.longitude, timeZoneOffset);
                altitude = nrelResult.elevation;
                azimuth = nrelResult.azimuth;
            }
            catch (error) {
                console.warn('NREL SPA calculation failed, falling back to SunCalc:', error);
                // Fall through to SunCalc
                const sunPos = suncalc_1.default.getPosition(dateTime, this.stadium.latitude, this.stadium.longitude);
                altitude = sunPos.altitude * 180 / Math.PI;
                azimuth = (sunPos.azimuth * 180 / Math.PI + 180) % 360;
            }
        }
        else {
            // Use original SunCalc implementation
            const sunPos = suncalc_1.default.getPosition(dateTime, this.stadium.latitude, this.stadium.longitude);
            altitude = sunPos.altitude * 180 / Math.PI;
            azimuth = (sunPos.azimuth * 180 / Math.PI + 180) % 360;
        }
        // Get sun times (still using SunCalc for these)
        const sunTimes = suncalc_1.default.getTimes(dateTime, this.stadium.latitude, this.stadium.longitude);
        return {
            altitude,
            azimuth,
            elevation: this.getElevationAngle(altitude * Math.PI / 180),
            isDay: dateTime > sunTimes.sunrise && dateTime < sunTimes.sunset,
            solarNoon: sunTimes.solarNoon,
            sunrise: sunTimes.sunrise,
            sunset: sunTimes.sunset,
            goldenHour: sunTimes.goldenHour,
            civilTwilight: {
                start: sunTimes.dawn,
                end: sunTimes.dusk
            }
        };
    }
    getElevationAngle(altitudeRad) {
        const altitudeDeg = altitudeRad * 180 / Math.PI;
        if (altitudeDeg < 0)
            return 'below_horizon';
        if (altitudeDeg < 10)
            return 'very_low';
        if (altitudeDeg < 30)
            return 'low';
        if (altitudeDeg < 50)
            return 'medium';
        if (altitudeDeg < 70)
            return 'high';
        return 'very_high';
    }
    calculateShadows(sunPosition, sections) {
        const shadows = [];
        const { altitude, azimuth } = sunPosition;
        if (altitude <= 0) {
            return sections.map(section => ({
                sectionId: section.id,
                coverage: 0,
                inShadow: false,
                shadowSources: {
                    roof: 0,
                    upperDeck: 0,
                    bowl: 0
                },
                sunExposure: 0
            }));
        }
        sections.forEach(section => {
            const shadowData = this.calculateSectionShadow(section, altitude, azimuth);
            shadows.push(shadowData);
        });
        return shadows;
    }
    calculateSectionShadow(section, sunAltitude, sunAzimuth) {
        const adjustedAzimuth = (sunAzimuth - this.stadiumGeometry.orientation + 360) % 360;
        const roofShadow = this.calculateRoofShadow(section, sunAltitude, adjustedAzimuth);
        const upperDeckShadow = section.level === 'field' || section.level === 'lower'
            ? this.calculateUpperDeckShadow(section, sunAltitude, adjustedAzimuth)
            : 0;
        const bowlShadow = this.calculateBowlShadow(section, sunAltitude, adjustedAzimuth);
        const totalCoverage = Math.min(100, roofShadow + upperDeckShadow + bowlShadow);
        return {
            sectionId: section.id,
            coverage: Math.round(totalCoverage),
            inShadow: totalCoverage > 50,
            shadowSources: {
                roof: roofShadow,
                upperDeck: upperDeckShadow,
                bowl: bowlShadow
            },
            sunExposure: Math.max(0, 100 - totalCoverage)
        };
    }
    calculateRoofShadow(section, sunAltitude, sunAzimuth) {
        if (sunAltitude <= 0)
            return 0;
        // Fixed roof stadiums always have 100% coverage
        if (this.stadium.roofType === 'fixed')
            return 100;
        // For covered sections, they should always have complete coverage
        if (section.covered) {
            // Covered sections have permanent overhead coverage that blocks direct sunlight
            return 100; // Covered sections provide complete protection from direct sun
        }
        // For retractable roofs when closed
        if (this.stadium.roofType === 'retractable') {
            // Calculate shadow based on roof overhang
            const roofHeight = this.stadiumGeometry.roofHeight;
            const shadowLength = roofHeight / Math.tan(sunAltitude * Math.PI / 180);
            const shadowDirection = (sunAzimuth + 180) % 360;
            const sectionAngle = this.getSectionAngle(section);
            const angleDiff = Math.abs(((shadowDirection - sectionAngle + 180 + 360) % 360) - 180);
            // If sun is coming from behind the section, no shadow
            if (angleDiff > 90) {
                return 0;
            }
            // For covered sections, assume a typical overhang depth
            const overhangDepth = section.covered ? 30 : this.stadiumGeometry.roofOverhang;
            const effectiveShadow = Math.min(shadowLength, overhangDepth);
            // Calculate coverage based on shadow depth vs section depth
            const sectionDepth = section.depth || 50;
            let coverage = (effectiveShadow / sectionDepth) * 100;
            // For low sun angles, reduce effectiveness of overhang
            if (sunAltitude < 30) {
                coverage *= (sunAltitude / 30); // Linear reduction for low sun
            }
            return Math.min(100, coverage);
        }
        return 0;
    }
    calculateUpperDeckShadow(section, sunAltitude, sunAzimuth) {
        if (sunAltitude <= 0)
            return 0;
        const shadowLength = this.stadiumGeometry.upperDeckHeight / Math.tan(sunAltitude * Math.PI / 180);
        const shadowDirection = (sunAzimuth + 180) % 360;
        const sectionAngle = this.getSectionAngle(section);
        const angleDiff = Math.abs(shadowDirection - sectionAngle);
        if (angleDiff > 60 && angleDiff < 300) {
            return 0;
        }
        const coverage = (shadowLength / (section.depth || 50)) * 50;
        return Math.min(50, coverage);
    }
    calculateBowlShadow(section, sunAltitude, sunAzimuth) {
        if (sunAltitude > 30)
            return 0;
        const sectionAngle = this.getSectionAngle(section);
        const angleDiff = Math.abs(sunAzimuth - sectionAngle);
        if (angleDiff > 90 && angleDiff < 270) {
            const shadowFactor = (30 - sunAltitude) / 30;
            return shadowFactor * 30;
        }
        return 0;
    }
    getSectionAngle(section) {
        const baseAngle = {
            'home': 0,
            'first': 90,
            'outfield': 180,
            'third': 270
        };
        const side = section.side || 'home';
        return (baseAngle[side] || section.angle || 0) + this.stadiumGeometry.orientation;
    }
    projectShadow(origin, azimuth, length) {
        const shadowAzimuth = (azimuth + 180) % 360;
        const shadowRad = shadowAzimuth * Math.PI / 180;
        return {
            x: origin.x + length * Math.sin(shadowRad),
            y: origin.y + length * Math.cos(shadowRad)
        };
    }
    calculateTimeInSun(section, gameStartTime, gameDuration = 3) {
        const intervals = 12;
        const timeStep = gameDuration * 60 / intervals;
        let sunExposureMinutes = 0;
        const startDate = new Date(gameStartTime);
        // Debug logging for covered sections
        if (section.covered && process.env.NODE_ENV === 'development') {
            console.log(`[SunCalc] Calculating for covered section: ${section.name} at ${this.stadium.name}`);
        }
        for (let i = 0; i < intervals; i++) {
            const checkTime = new Date(startDate.getTime() + i * timeStep * 60000);
            const sunPos = this.calculateSunPosition(checkTime.toISOString().split('T')[0], checkTime.toTimeString().split(' ')[0]);
            if (sunPos.altitude > 0) {
                const shadows = this.calculateSectionShadow(section, sunPos.altitude, sunPos.azimuth);
                // Debug covered sections - they should always have 0% sun exposure
                if (section.covered && shadows.sunExposure > 0 && process.env.NODE_ENV === 'development') {
                    console.error(`[SunCalc] ERROR: Covered section ${section.name} has ${shadows.sunExposure}% sun exposure (should be 0%)`);
                    console.error(`  - Coverage breakdown: roof=${shadows.shadowSources.roof}%, upperDeck=${shadows.shadowSources.upperDeck}%, bowl=${shadows.shadowSources.bowl}%`);
                    console.error(`  - Total coverage: ${shadows.coverage}%`);
                    console.error(`  - Section covered flag: ${section.covered}`);
                }
                // Accumulate actual sun exposure percentage for this time interval
                // If a section has 30% sun exposure for this interval, count 30% of the time
                const exposureFraction = shadows.sunExposure / 100;
                sunExposureMinutes += timeStep * exposureFraction;
            }
        }
        return {
            totalMinutes: Math.min(sunExposureMinutes, gameDuration * 60),
            percentage: Math.min(100, (sunExposureMinutes / (gameDuration * 60)) * 100)
        };
    }
    getSunPath(date, hourInterval = 0.5) {
        const path = [];
        const dateObj = new Date(date);
        const times = suncalc_1.default.getTimes(dateObj, this.stadium.latitude, this.stadium.longitude);
        const sunrise = times.sunrise.getHours() + times.sunrise.getMinutes() / 60;
        const sunset = times.sunset.getHours() + times.sunset.getMinutes() / 60;
        for (let hour = Math.floor(sunrise); hour <= Math.ceil(sunset); hour += hourInterval) {
            const time = `${Math.floor(hour).toString().padStart(2, '0')}:${Math.round((hour % 1) * 60).toString().padStart(2, '0')}:00`;
            const position = this.calculateSunPosition(date, time);
            if (position.altitude > 0) {
                path.push({
                    time,
                    ...position
                });
            }
        }
        return path;
    }
    getOptimalSections(date, time, preference = 'shade') {
        const sunPos = this.calculateSunPosition(date, time);
        const sections = this.stadium.sections || [];
        const sectionsWithShadow = sections.map(section => {
            const shadow = this.calculateSectionShadow(section, sunPos.altitude, sunPos.azimuth);
            return {
                ...section,
                ...shadow
            };
        });
        return sectionsWithShadow.sort((a, b) => {
            if (preference === 'shade') {
                return b.coverage - a.coverage;
            }
            else if (preference === 'sun') {
                return b.sunExposure - a.sunExposure;
            }
            return 0;
        });
    }
}
exports.SunCalculator = SunCalculator;
function formatSunPosition(position) {
    const compass = getCompassDirection(position.azimuth);
    const altitude = position.altitude.toFixed(1);
    return {
        compass,
        altitude: `${altitude}°`,
        description: position.elevation,
        isDay: position.isDay
    };
}
function getCompassDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}
function calculateGameSunExposure(stadium, sections, gameDateTime, duration = 3) {
    const calculator = new SunCalculator(stadium);
    return sections.map(section => {
        const exposure = calculator.calculateTimeInSun(section, gameDateTime, duration);
        return {
            sectionId: section.id,
            ...exposure
        };
    });
}
