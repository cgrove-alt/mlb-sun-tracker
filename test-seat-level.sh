#!/bin/bash

# MLB Sun Tracker - Seat-Level Feature Test Script
# Tests core functionality across multiple stadiums

set -e

echo "=================================================="
echo "MLB Sun Tracker - Seat-Level Feature Testing"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to run test
test_stadium() {
    local stadium=$1
    local section=$2
    local description=$3

    echo -n "Testing $description... "

    # Check if section file exists
    if [ -f "src/data/seatData/$stadium/sections/$section.ts" ]; then
        echo -e "${GREEN}✓${NC} Section file exists"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Section file missing"
        ((FAILED++))
        return 1
    fi

    # Check if metadata exists
    if [ -f "src/data/seatData/$stadium/metadata.ts" ]; then
        echo "  ${GREEN}✓${NC} Metadata file exists"
        ((PASSED++))
    else
        echo "  ${RED}✗${NC} Metadata file missing"
        ((FAILED++))
        return 1
    fi

    # Check if precomputed sun data exists
    if [ -f "src/data/seatData/$stadium/precomputed-sun-1310pm.json.gz" ]; then
        SIZE=$(du -h "src/data/seatData/$stadium/precomputed-sun-1310pm.json.gz" | cut -f1)
        echo "  ${GREEN}✓${NC} Precomputed sun data exists ($SIZE)"
        ((PASSED++))
    else
        echo "  ${YELLOW}⚠${NC} Precomputed sun data missing (optional)"
    fi
}

echo "======================================"
echo "1. Testing Tier 1 Stadiums (Pilot)"
echo "======================================"
echo ""

test_stadium "dodger-stadium" "101" "Dodger Stadium Section 101"
echo ""
test_stadium "yankees" "114" "Yankee Stadium Section 114"
echo ""
test_stadium "redsox" "18" "Fenway Park Section 18 (Green Monster)"
echo ""
test_stadium "cubs" "214" "Wrigley Field Section 214 (Bleachers)"
echo ""
test_stadium "giants" "101" "Oracle Park Section 101"
echo ""
test_stadium "cardinals" "101" "Busch Stadium Section 101"
echo ""

echo "======================================"
echo "2. Testing Other Divisions"
echo "======================================"
echo ""

test_stadium "angels" "101" "Angel Stadium (AL West)"
echo ""
test_stadium "astros" "101" "Minute Maid Park (AL West)"
echo ""
test_stadium "phillies" "101" "Citizens Bank Park (NL East)"
echo ""
test_stadium "rockies" "105" "Coors Field (NL West)"
echo ""

echo "======================================"
echo "3. Testing Build Output"
echo "======================================"
echo ""

# Check if build directory exists
if [ -d ".next" ]; then
    echo -e "${GREEN}✓${NC} Next.js build directory exists"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Next.js build not found (run 'npm run build')"
fi

# Check for generated routes
if [ -d ".next/server/app/stadium" ]; then
    STADIUM_COUNT=$(find .next/server/app/stadium -name "page.js" 2>/dev/null | wc -l)
    echo -e "${GREEN}✓${NC} Found ~$STADIUM_COUNT stadium route files"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Stadium routes not found (build may be needed)"
fi

echo ""
echo "======================================"
echo "4. Testing Public Assets"
echo "======================================"
echo ""

# Check for SVG stadium maps
SVG_COUNT=$(find public/stadiums/maps -name "*.svg" 2>/dev/null | wc -l)
if [ $SVG_COUNT -ge 30 ]; then
    echo -e "${GREEN}✓${NC} Found $SVG_COUNT stadium SVG maps"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Found only $SVG_COUNT stadium SVG maps (expected 30)"
fi

# Check for search index
if [ -f "public/data/search/search-index.min.json" ]; then
    SIZE=$(du -h public/data/search/search-index.min.json | cut -f1)
    echo -e "${GREEN}✓${NC} Search index exists ($SIZE)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Search index missing"
fi

echo ""
echo "======================================"
echo "Test Summary"
echo "======================================"
echo ""
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run build' to generate all 4,918 static pages"
    echo "2. Run 'npm run dev' to test in development mode"
    echo "3. Visit http://localhost:3000/stadium/dodgers/section/101"
    echo "4. Verify seat grid appears with color-coded sun exposure"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review errors above.${NC}"
    exit 1
fi
