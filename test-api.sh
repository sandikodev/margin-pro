#!/bin/bash

# 🧪 Margins Pro - Automated Testing Script
# Tests critical user flows via API

BASE_URL="http://localhost:5173"
API_URL="$BASE_URL/api"

echo "🧪 Starting Margins Pro Testing..."
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass_count=0
fail_count=0

test_case() {
    local name="$1"
    local result="$2"
    
    if [ "$result" = "0" ]; then
        echo -e "${GREEN}✓${NC} $name"
        ((pass_count++))
    else
        echo -e "${RED}✗${NC} $name"
        ((fail_count++))
    fi
}

echo "📡 1. Health Checks"
echo "-------------------"

# Test 1: Server is running
curl -s "$BASE_URL" > /dev/null
test_case "Server responds" $?

# Test 2: API health endpoint
response=$(curl -s "$API_URL/health")
if echo "$response" | grep -q "ok"; then
    test_case "API health check" 0
else
    test_case "API health check" 1
fi

echo ""
echo "🔐 2. Authentication Flow"
echo "-------------------------"

# Test 3: Demo mode access
demo_response=$(curl -s -X POST "$API_URL/auth/demo" -H "Content-Type: application/json")
if echo "$demo_response" | grep -q "success"; then
    test_case "Demo mode login" 0
    # Extract token from cookie
    demo_token=$(echo "$demo_response" | grep -o '"user":{[^}]*}')
else
    test_case "Demo mode login" 1
fi

# Test 4: Get current user (should work after demo login)
me_response=$(curl -s "$API_URL/auth/me" -b /tmp/cookies.txt)
if echo "$me_response" | grep -q "user"; then
    test_case "Get current user" 0
else
    test_case "Get current user" 1
fi

echo ""
echo "🏢 3. Business Management"
echo "-------------------------"

# Test 5: List businesses (should be empty for new demo user)
businesses=$(curl -s "$API_URL/businesses" -b /tmp/cookies.txt)
test_case "List businesses" $?

echo ""
echo "📊 4. Frontend Rendering"
echo "------------------------"

# Test 6: Landing page loads
landing=$(curl -s -H "Accept: text/html" "$BASE_URL/")
if echo "$landing" | grep -qi "margin"; then
    test_case "Landing page renders" 0
else
    test_case "Landing page renders" 1
fi

# Test 7: Auth page loads
auth_page=$(curl -s -H "Accept: text/html" "$BASE_URL/auth")
if echo "$auth_page" | grep -q "html"; then
    test_case "Auth page renders" 0
else
    test_case "Auth page renders" 1
fi

echo ""
echo "=================================="
echo "📊 Test Results:"
echo "   Passed: ${GREEN}$pass_count${NC}"
echo "   Failed: ${RED}$fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
