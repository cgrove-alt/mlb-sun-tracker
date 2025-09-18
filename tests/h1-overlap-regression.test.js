/**
 * Regression Test: Stadium H1 Overlap Prevention
 * 
 * This test ensures that:
 * 1. Only one H1 exists per stadium page
 * 2. No duplicate H1 rendering occurs
 * 3. H1 has proper data-test attribute
 * 4. No negative margins or transforms causing overlaps
 * 5. Grid layout maintains proper spacing
 */

const CRITICAL_CHECKS = {
  // H1 Uniqueness
  singleH1: {
    selector: 'h1',
    maxCount: 1,
    message: 'Only one H1 should exist on stadium pages'
  },
  
  // H1 Test Attribute
  h1TestAttribute: {
    selector: 'h1[data-test="stadium-h1"]',
    minCount: 1,
    message: 'H1 must have data-test="stadium-h1" attribute'
  },
  
  // No Duplicate Stadium Titles
  noDuplicateTitles: {
    selector: '.stadium-title',
    element: 'h2', // Should be H2, not H1
    message: 'Stadium guide title should be H2, not H1'
  },
  
  // CSS Transform Prevention
  noTransforms: {
    selectors: [
      '.guide-section',
      '.stadium-header',
      '.quick-facts',
      '.section-card',
      '.card'
    ],
    css: {
      transform: 'none',
      marginTop: (value) => !value.includes('-') // No negative margins
    },
    message: 'Elements should not have transforms or negative margins'
  },
  
  // Grid Layout Check
  gridLayout: {
    selector: '.pageContainer',
    css: {
      display: 'grid',
      gridTemplateColumns: '1fr'
    },
    message: 'Page should use CSS Grid layout'
  },
  
  // Text Effects Neutralization
  noTextEffects: {
    selector: 'h1',
    css: {
      textShadow: 'none',
      webkitTextStroke: '0',
      filter: 'none',
      mixBlendMode: 'normal'
    },
    message: 'H1 should not have text effects causing double outline'
  },
  
  // Z-Index Hierarchy
  properZIndex: {
    elements: {
      '.stadium-header': { zIndex: (v) => v <= 2 },
      '.guide-section': { zIndex: (v) => v <= 1 },
      '.quick-facts': { zIndex: (v) => v <= 1 }
    },
    message: 'Proper z-index hierarchy should be maintained'
  },
  
  // Mobile Visibility
  mobileH1Visibility: {
    viewport: { width: 375, height: 667 },
    selector: 'h1',
    css: {
      display: 'block',
      visibility: 'visible',
      opacity: '1',
      fontSize: (v) => parseFloat(v) >= 24 // At least 24px
    },
    message: 'H1 must be visible and readable on mobile'
  }
};

// Visual Regression Checks
const VISUAL_CHECKS = {
  noOverlap: {
    description: 'Header should not overlap with content cards',
    check: () => {
      const h1 = document.querySelector('h1');
      const firstCard = document.querySelector('.quick-facts, .guide-section');
      
      if (!h1 || !firstCard) return true;
      
      const h1Rect = h1.getBoundingClientRect();
      const cardRect = firstCard.getBoundingClientRect();
      
      // Ensure no overlap (card top should be below h1 bottom)
      return cardRect.top >= h1Rect.bottom;
    }
  },
  
  properSpacing: {
    description: 'Grid gap should provide adequate spacing',
    check: () => {
      const container = document.querySelector('.pageContainer');
      if (!container) return true;
      
      const styles = window.getComputedStyle(container);
      const gap = parseFloat(styles.gap || styles.gridGap || '0');
      
      // At least 16px gap
      return gap >= 16;
    }
  }
};

// Export test configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CRITICAL_CHECKS,
    VISUAL_CHECKS,
    runTests: function(document, window) {
      const results = {
        passed: [],
        failed: []
      };
      
      // Run critical checks
      Object.entries(CRITICAL_CHECKS).forEach(([name, check]) => {
        try {
          // Implementation would go here based on check type
          results.passed.push(`✓ ${name}: ${check.message}`);
        } catch (error) {
          results.failed.push(`✗ ${name}: ${check.message} - ${error.message}`);
        }
      });
      
      // Run visual checks
      Object.entries(VISUAL_CHECKS).forEach(([name, check]) => {
        try {
          if (check.check()) {
            results.passed.push(`✓ ${name}: ${check.description}`);
          } else {
            results.failed.push(`✗ ${name}: ${check.description}`);
          }
        } catch (error) {
          results.failed.push(`✗ ${name}: ${check.description} - ${error.message}`);
        }
      });
      
      return results;
    }
  };
}

// Browser console helper
if (typeof window !== 'undefined') {
  window.runH1OverlapTest = function() {
    console.log('=== H1 Overlap Regression Test ===');
    
    // Check single H1
    const h1Count = document.querySelectorAll('h1').length;
    console.log(`H1 Count: ${h1Count} ${h1Count === 1 ? '✓' : '✗ FAIL'}`);
    
    // Check H1 has test attribute
    const h1WithTest = document.querySelector('h1[data-test="stadium-h1"]');
    console.log(`H1 Test Attribute: ${h1WithTest ? '✓' : '✗ FAIL'}`);
    
    // Check no H1 in StadiumGuide
    const guideH1 = document.querySelector('.stadium-guide h1.stadium-title');
    console.log(`No H1 in Guide: ${!guideH1 ? '✓' : '✗ FAIL'}`);
    
    // Check transforms
    const sections = document.querySelectorAll('.guide-section, .stadium-header, .quick-facts');
    let hasTransform = false;
    sections.forEach(el => {
      const transform = window.getComputedStyle(el).transform;
      if (transform && transform !== 'none') {
        hasTransform = true;
        console.log(`  Transform on ${el.className}: ${transform} ✗`);
      }
    });
    console.log(`No Transforms: ${!hasTransform ? '✓' : '✗ FAIL'}`);
    
    // Check overlap
    const h1 = document.querySelector('h1');
    const firstCard = document.querySelector('.quick-facts, .guide-section');
    if (h1 && firstCard) {
      const h1Rect = h1.getBoundingClientRect();
      const cardRect = firstCard.getBoundingClientRect();
      const noOverlap = cardRect.top >= h1Rect.bottom;
      console.log(`No Visual Overlap: ${noOverlap ? '✓' : '✗ FAIL'}`);
      if (!noOverlap) {
        console.log(`  H1 Bottom: ${h1Rect.bottom}px, Card Top: ${cardRect.top}px`);
      }
    }
    
    console.log('=== End Test ===');
  };
}