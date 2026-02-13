#!/bin/bash

# 🎯 Comprehensive System Test
# Tests all critical paths via API

BASE_URL="http://localhost:5173"
API_URL="$BASE_URL/api"
COOKIE_FILE="/tmp/test-cookies.txt"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎯 Margins Pro - Comprehensive System Test${NC}"
echo "=============================================="
echo ""

pass=0
fail=0

test() {
    local name="$1"
    local cmd="$2"
    local expected="$3"
    
    result=$(eval "$cmd" 2>/dev/null)
    
    if echo "$result" | grep -q "$expected"; then
        echo -e "${GREEN}✓${NC} $name"
        ((pass++))
        return 0
    else
        echo -e "${RED}✗${NC} $name"
        echo -e "  ${YELLOW}Expected: $expected${NC}"
        echo -e "  ${YELLOW}Got: $result${NC}"
        ((fail++))
        return 1
    fi
}

echo -e "${BLUE}1. Authentication & Session${NC}"
echo "----------------------------"

# Demo login
test "Demo login" \
    "curl -s -X POST $API_URL/auth/demo -c $COOKIE_FILE | jq -r '.success'" \
    "true"

test "Get current user" \
    "curl -s $API_URL/auth/me -b $COOKIE_FILE | jq -r '.user.email'" \
    "lumina.bistro"

echo ""
echo -e "${BLUE}2. Business Management${NC}"
echo "----------------------"

# Get businesses
BIZ_COUNT=$(curl -s $API_URL/businesses -b $COOKIE_FILE | jq -r 'length')
test "List businesses (has data)" \
    "echo $BIZ_COUNT" \
    "[1-9]"

BIZ_ID=$(curl -s $API_URL/businesses -b $COOKIE_FILE | jq -r '.[0].id')
test "Get business ID" \
    "echo $BIZ_ID" \
    "."

echo ""
echo -e "${BLUE}3. Project/Calculator${NC}"
echo "---------------------"

# Create project
PROJECT_DATA='{
  "id": "test-'$(date +%s)'",
  "businessId": "'$BIZ_ID'",
  "name": "Test Menu",
  "label": "Test",
  "costs": [
    {"id": "c1", "name": "Bahan", "amount": 5000, "allocation": "unit"},
    {"id": "c2", "name": "Packaging", "amount": 2000, "allocation": "unit"}
  ],
  "productionConfig": {"period": "weekly", "daysActive": 5, "targetUnits": 40},
  "pricingStrategy": "markup",
  "targetNet": 0,
  "lastModified": '$(date +%s000)'
}'

test "Create project" \
    "curl -s -X POST $API_URL/projects -H 'Content-Type: application/json' -d '$PROJECT_DATA' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "List projects" \
    "curl -s '$API_URL/projects?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r 'length'" \
    "[1-9]"

PROJECT_ID=$(curl -s "$API_URL/projects?businessId=$BIZ_ID" -b $COOKIE_FILE | jq -r '.[0].id')
test "Get project data" \
    "curl -s '$API_URL/projects?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r '.[0].name'" \
    "Test Menu"

echo ""
echo -e "${BLUE}4. Finance Module${NC}"
echo "-----------------"

# Create cashflow
CASHFLOW_DATA='{
  "id": "cf-'$(date +%s)'",
  "businessId": "'$BIZ_ID'",
  "date": '$(date +%s000)',
  "revenue": 100000,
  "expense": 0,
  "category": "SALES",
  "note": "Test revenue"
}'

test "Add cashflow record" \
    "curl -s -X POST $API_URL/finance/cashflow -H 'Content-Type: application/json' -d '$CASHFLOW_DATA' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "List cashflow" \
    "curl -s '$API_URL/finance/cashflow?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r 'length'" \
    "[1-9]"

echo ""
echo -e "${BLUE}5. Data Persistence${NC}"
echo "-------------------"

# Verify data persists
test "Project still exists" \
    "curl -s '$API_URL/projects?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r '.[0].id'" \
    "$PROJECT_ID"

test "Cashflow still exists" \
    "curl -s '$API_URL/finance/cashflow?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r 'length'" \
    "[1-9]"

echo ""
echo "=============================================="
echo -e "${BLUE}📊 Final Results:${NC}"
echo -e "   ${GREEN}Passed: $pass${NC}"
echo -e "   ${RED}Failed: $fail${NC}"
echo ""

if [ $fail -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}System is ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "${YELLOW}Review failures before deployment.${NC}"
    exit 1
fi
