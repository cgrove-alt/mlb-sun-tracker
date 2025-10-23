#!/bin/bash

# MLB Sun Tracker - Complete Stadium Test Script
# Tests all 30 MLB stadiums systematically

set -e

echo "========================================================="
echo "MLB Sun Tracker - Complete 30 Stadium Verification"
echo "========================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TOTAL_STADIUMS=0
PASSED_STADIUMS=0
FAILED_STADIUMS=0

# Test each stadium
test_stadium_complete() {
    local stadium_id=$1
    local stadium_name=$2

    ((TOTAL_STADIUMS++))

    echo -n "$TOTAL_STADIUMS. Testing $stadium_name ($stadium_id)... "

    # Check if stadium directory exists
    if [ ! -d "src/data/seatData/$stadium_id" ]; then
        echo -e "${RED}✗ MISSING${NC}"
        ((FAILED_STADIUMS++))
        return 1
    fi

    # Count section files
    SECTION_COUNT=$(find "src/data/seatData/$stadium_id/sections" -name "*.ts" -not -name "_template.ts" 2>/dev/null | wc -l | xargs)

    # Check metadata
    METADATA_EXISTS=0
    if [ -f "src/data/seatData/$stadium_id/metadata.ts" ]; then
        METADATA_EXISTS=1
    fi

    # Check precomputed data
    PRECOMPUTED_EXISTS=0
    if [ -f "src/data/seatData/$stadium_id/precomputed-sun-1310pm.json.gz" ]; then
        PRECOMPUTED_EXISTS=1
    fi

    # Determine status
    if [ $SECTION_COUNT -gt 0 ] && [ $METADATA_EXISTS -eq 1 ]; then
        echo -e "${GREEN}✓ PASS${NC} ($SECTION_COUNT sections"
        if [ $PRECOMPUTED_EXISTS -eq 1 ]; then
            echo -n ", precomputed data"
        fi
        echo ")"
        ((PASSED_STADIUMS++))
    else
        echo -e "${RED}✗ FAIL${NC} (sections: $SECTION_COUNT, metadata: $METADATA_EXISTS)"
        ((FAILED_STADIUMS++))
    fi
}

echo "Testing all 30 MLB stadiums..."
echo ""

# American League East
echo "=== American League East ==="
test_stadium_complete "yankees" "New York Yankees"
test_stadium_complete "redsox" "Boston Red Sox"
test_stadium_complete "bluejays" "Toronto Blue Jays"
test_stadium_complete "rays" "Tampa Bay Rays"
test_stadium_complete "orioles" "Baltimore Orioles"
echo ""

# American League Central
echo "=== American League Central ==="
test_stadium_complete "guardians" "Cleveland Guardians"
test_stadium_complete "twins" "Minnesota Twins"
test_stadium_complete "tigers" "Detroit Tigers"
test_stadium_complete "whitesox" "Chicago White Sox"
test_stadium_complete "royals" "Kansas City Royals"
echo ""

# American League West
echo "=== American League West ==="
test_stadium_complete "astros" "Houston Astros"
test_stadium_complete "mariners" "Seattle Mariners"
test_stadium_complete "rangers" "Texas Rangers"
test_stadium_complete "athletics" "Oakland Athletics"
test_stadium_complete "angels" "Los Angeles Angels"
echo ""

# National League East
echo "=== National League East ==="
test_stadium_complete "braves" "Atlanta Braves"
test_stadium_complete "phillies" "Philadelphia Phillies"
test_stadium_complete "mets" "New York Mets"
test_stadium_complete "nationals" "Washington Nationals"
test_stadium_complete "marlins" "Miami Marlins"
echo ""

# National League Central
echo "=== National League Central ==="
test_stadium_complete "cardinals" "St. Louis Cardinals"
test_stadium_complete "cubs" "Chicago Cubs"
test_stadium_complete "brewers" "Milwaukee Brewers"
test_stadium_complete "reds" "Cincinnati Reds"
test_stadium_complete "pirates" "Pittsburgh Pirates"
echo ""

# National League West
echo "=== National League West ==="
test_stadium_complete "dodger-stadium" "Los Angeles Dodgers"
test_stadium_complete "giants" "San Francisco Giants"
test_stadium_complete "padres" "San Diego Padres"
test_stadium_complete "diamondbacks" "Arizona Diamondbacks"
test_stadium_complete "rockies" "Colorado Rockies"
echo ""

# Final summary
echo "========================================================="
echo "FINAL RESULTS"
echo "========================================================="
echo ""
echo "Total Stadiums Tested: $TOTAL_STADIUMS"
echo -e "Passed: ${GREEN}$PASSED_STADIUMS${NC}"
echo -e "Failed: ${RED}$FAILED_STADIUMS${NC}"
echo ""

# Calculate total section count
TOTAL_SECTIONS=$(find src/data/seatData/*/sections -name "*.ts" -not -name "_template.ts" 2>/dev/null | wc -l | xargs)
echo "Total Section Files: $TOTAL_SECTIONS"
echo ""

if [ $FAILED_STADIUMS -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: All 30 MLB stadiums verified!${NC}"
    echo ""
    echo "🎉 MAJOR MILESTONE ACHIEVED!"
    echo "   - 30/30 stadiums complete"
    echo "   - $TOTAL_SECTIONS section files generated"
    echo "   - Seat-level sun exposure for entire MLB"
    echo ""
    exit 0
else
    echo -e "${RED}❌ INCOMPLETE: $FAILED_STADIUMS stadium(s) failed verification.${NC}"
    exit 1
fi
