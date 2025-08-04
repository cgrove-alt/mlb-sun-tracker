"use strict";
/**
 * Input validation and sanitization utilities
 * Used by both mobile and desktop versions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
exports.sanitizeInput = sanitizeInput;
exports.validateStadiumId = validateStadiumId;
exports.validateDate = validateDate;
exports.validateTime = validateTime;
exports.validateNumericRange = validateNumericRange;
exports.validateFilterCriteria = validateFilterCriteria;
exports.sanitizeApiUrl = sanitizeApiUrl;
// Sanitize user input to prevent XSS
function sanitizeInput(input) {
    if (!input || typeof input !== 'string')
        return '';
    // Remove any HTML tags
    const cleaned = input.replace(/<[^>]*>/g, '');
    // Escape special characters
    return cleaned
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
// Validate stadium ID
function validateStadiumId(id) {
    if (!id || typeof id !== 'string')
        return false;
    // Stadium IDs should only contain lowercase letters and hyphens
    return /^[a-z-]+$/.test(id);
}
// Validate date input
function validateDate(date) {
    if (!date || typeof date !== 'string')
        return false;
    // Check format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
        return false;
    const parsed = new Date(date);
    return parsed instanceof Date && !isNaN(parsed.getTime());
}
// Validate time input
function validateTime(time) {
    if (!time || typeof time !== 'string')
        return false;
    // Check format HH:MM or HH:MM:SS
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(time);
}
// Validate numeric range
function validateNumericRange(value, min, max) {
    return typeof value === 'number' &&
        !isNaN(value) &&
        value >= min &&
        value <= max;
}
// Validate filter criteria
function validateFilterCriteria(criteria) {
    if (!criteria || typeof criteria !== 'object')
        return false;
    // Validate sun preference
    if (criteria.sunPreference &&
        !['all', 'shade', 'sun'].includes(criteria.sunPreference)) {
        return false;
    }
    // Validate max sun exposure
    if (criteria.maxSunExposure !== undefined &&
        !validateNumericRange(criteria.maxSunExposure, 0, 100)) {
        return false;
    }
    // Validate price tier
    if (criteria.priceTier &&
        !['all', 'luxury', 'premium', 'moderate', 'value'].includes(criteria.priceTier)) {
        return false;
    }
    return true;
}
// Rate limiting helper
class RateLimiter {
    constructor(maxAttempts = 10, windowMs = 60000) {
        this.attempts = new Map();
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }
    isAllowed(identifier) {
        const now = Date.now();
        const attempts = this.attempts.get(identifier) || [];
        // Remove old attempts outside the window
        const validAttempts = attempts.filter(time => now - time < this.windowMs);
        if (validAttempts.length >= this.maxAttempts) {
            return false;
        }
        // Add current attempt
        validAttempts.push(now);
        this.attempts.set(identifier, validAttempts);
        // Clean up old entries periodically
        if (Math.random() < 0.01) {
            this.cleanup();
        }
        return true;
    }
    cleanup() {
        const now = Date.now();
        const entries = Array.from(this.attempts.entries());
        for (const [key, attempts] of entries) {
            const validAttempts = attempts.filter((time) => now - time < this.windowMs);
            if (validAttempts.length === 0) {
                this.attempts.delete(key);
            }
            else {
                this.attempts.set(key, validAttempts);
            }
        }
    }
}
exports.RateLimiter = RateLimiter;
// API request sanitization
function sanitizeApiUrl(url) {
    try {
        const parsed = new URL(url);
        // Only allow specific protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error('Invalid protocol');
        }
        // Only allow specific hosts
        const allowedHosts = [
            'api.open-meteo.com',
            'statsapi.mlb.com',
            'localhost',
            '127.0.0.1'
        ];
        if (!allowedHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))) {
            throw new Error('Invalid host');
        }
        return parsed.toString();
    }
    catch {
        throw new Error('Invalid URL');
    }
}
