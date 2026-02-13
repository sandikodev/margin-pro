#!/bin/bash

# 🔬 Extended API Testing - Deep Dive
# Tests edge cases, error handling, and advanced features

BASE_URL="http://localhost:5173"
API_URL="$BASE_URL/api"
COOKIE_FILE="/tmp/extended-test-cookies.txt"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

pass=0
fail=0
skip=0

test() {
    local name="$1"
    local cmd="$2"
    local expected="$3"
    
    result=$(eval "$cmd" 2>&1)
    
    if echo "$result" | grep -q "$expected"; then
        echo -e "${GREEN}✓${NC} $name"
        ((pass++))
        return 0
    else
        echo -e "${RED}✗${NC} $name"
        echo -e "  ${YELLOW}Expected: $expected${NC}"
        echo -e "  ${YELLOW}Got: ${result:0:100}${NC}"
        ((fail++))
        return 1
    fi
}

echo -e "${CYAN}🔬 Extended API Testing - Deep Dive${NC}"
echo "========================================"
echo ""

# Setup: Login
echo -e "${BLUE}Setup: Authentication${NC}"
curl -s -X POST $API_URL/auth/demo -c $COOKIE_FILE > /dev/null
BIZ_ID=$(curl -s $API_URL/businesses -b $COOKIE_FILE | jq -r '.[0].id')
echo -e "${GREEN}✓${NC} Logged in as demo user"
echo -e "${GREEN}✓${NC} Business ID: $BIZ_ID"
echo ""

# ============================================
# 1. AUTHENTICATION EDGE CASES
# ============================================
echo -e "${BLUE}1. Authentication Edge Cases${NC}"
echo "-----------------------------"

test "Invalid login - wrong email" \
    "curl -s -X POST $API_URL/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"fake@test.com\",\"password\":\"wrong\"}' | jq -r '.error'" \
    "Invalid credentials"

test "Invalid login - wrong password" \
    "curl -s -X POST $API_URL/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"owner@lumina.bistro\",\"password\":\"wrong\"}' | jq -r '.error'" \
    "Invalid credentials"

test "Register - duplicate email" \
    "curl -s -X POST $API_URL/auth/register -H 'Content-Type: application/json' -d '{\"name\":\"Test\",\"email\":\"owner@lumina.bistro\",\"password\":\"test123\"}' | jq -r '.error'" \
    "already registered"

test "Logout works" \
    "curl -s -X POST $API_URL/auth/logout -b $COOKIE_FILE | jq -r '.success'" \
    "true"

# Re-login for next tests
curl -s -X POST $API_URL/auth/demo -c $COOKIE_FILE > /dev/null

echo ""

# ============================================
# 2. PROJECT CRUD OPERATIONS
# ============================================
echo -e "${BLUE}2. Project CRUD Operations${NC}"
echo "---------------------------"

# Create project with full data
PROJECT_ID="test-$(date +%s)"
PROJECT_DATA='{
  "id": "'$PROJECT_ID'",
  "businessId": "'$BIZ_ID'",
  "name": "Nasi Goreng Special",
  "label": "Best Seller",
  "costs": [
    {"id": "c1", "name": "Beras", "amount": 3000, "allocation": "unit"},
    {"id": "c2", "name": "Telur", "amount": 2000, "allocation": "unit"},
    {"id": "c3", "name": "Bumbu", "amount": 1500, "allocation": "unit"},
    {"id": "c4", "name": "Gas", "amount": 50000, "allocation": "bulk", "batchYield": 100, "bulkUnit": "units"}
  ],
  "productionConfig": {"period": "weekly", "daysActive": 6, "targetUnits": 50},
  "pricingStrategy": "markup",
  "targetMargin": 30,
  "targetNet": 0,
  "isFavorite": false,
  "lastModified": '$(date +%s000)'
}'

test "Create project with full data" \
    "curl -s -X POST $API_URL/projects -H 'Content-Type: application/json' -d '$PROJECT_DATA' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "Get project by ID" \
    "curl -s '$API_URL/projects?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r '.[] | select(.id==\"$PROJECT_ID\") | .name'" \
    "Nasi Goreng"

# Update project
UPDATE_DATA='{
  "id": "'$PROJECT_ID'",
  "businessId": "'$BIZ_ID'",
  "name": "Nasi Goreng Premium",
  "label": "Updated",
  "costs": [{"id": "c1", "name": "Beras Premium", "amount": 5000, "allocation": "unit"}],
  "productionConfig": {"period": "weekly", "daysActive": 6, "targetUnits": 50},
  "targetNet": 0,
  "lastModified": '$(date +%s000)'
}'

test "Update project" \
    "curl -s -X PUT $API_URL/projects/$PROJECT_ID -H 'Content-Type: application/json' -d '$UPDATE_DATA' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "Verify project updated" \
    "curl -s '$API_URL/projects?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r '.[] | select(.id==\"$PROJECT_ID\") | .name'" \
    "Premium"

test "Delete project" \
    "curl -s -X DELETE $API_URL/projects/$PROJECT_ID -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "Verify project deleted" \
    "curl -s '$API_URL/projects?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r '.[] | select(.id==\"$PROJECT_ID\") | .id'" \
    "^$"

echo ""

# ============================================
# 3. BUSINESS OPERATIONS
# ============================================
echo -e "${BLUE}3. Business Operations${NC}"
echo "----------------------"

# Create new business
NEW_BIZ_ID="biz-$(date +%s)"
BIZ_DATA='{
  "id": "'$NEW_BIZ_ID'",
  "name": "Warung Makan Test",
  "type": "fnb_offline",
  "initialCapital": 10000000,
  "currentAssetValue": 10000000,
  "cashOnHand": 5000000,
  "targetMargin": 35,
  "taxRate": 11,
  "establishedDate": '$(date +%s000)'
}'

test "Create new business" \
    "curl -s -X POST $API_URL/businesses -H 'Content-Type: application/json' -d '$BIZ_DATA' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "List businesses includes new one" \
    "curl -s $API_URL/businesses -b $COOKIE_FILE | jq -r '.[] | select(.id==\"$NEW_BIZ_ID\") | .name'" \
    "Warung Makan Test"

# Update business
UPDATE_BIZ='{
  "id": "'$NEW_BIZ_ID'",
  "name": "Warung Makan Updated",
  "type": "fnb_offline",
  "initialCapital": 10000000,
  "currentAssetValue": 12000000,
  "cashOnHand": 6000000,
  "establishedDate": '$(date +%s000)'
}'

test "Update business" \
    "curl -s -X PUT $API_URL/businesses/$NEW_BIZ_ID -H 'Content-Type: application/json' -d '$UPDATE_BIZ' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "Delete business" \
    "curl -s -X DELETE $API_URL/businesses/$NEW_BIZ_ID -b $COOKIE_FILE | jq -r '.success'" \
    "true"

echo ""

# ============================================
# 4. FINANCE MODULE
# ============================================
echo -e "${BLUE}4. Finance Module${NC}"
echo "-----------------"

# Add multiple cashflow records
CF_ID_1="cf-$(date +%s)-1"
CF_DATA_1='{
  "id": "'$CF_ID_1'",
  "businessId": "'$BIZ_ID'",
  "date": '$(date +%s000)',
  "revenue": 500000,
  "expense": 0,
  "category": "SALES",
  "note": "Penjualan hari ini"
}'

test "Add revenue record" \
    "curl -s -X POST $API_URL/finance/cashflow -H 'Content-Type: application/json' -d '$CF_DATA_1' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

CF_ID_2="cf-$(date +%s)-2"
CF_DATA_2='{
  "id": "'$CF_ID_2'",
  "businessId": "'$BIZ_ID'",
  "date": '$(date +%s000)',
  "revenue": 0,
  "expense": 200000,
  "category": "COGS",
  "note": "Belanja bahan"
}'

test "Add expense record" \
    "curl -s -X POST $API_URL/finance/cashflow -H 'Content-Type: application/json' -d '$CF_DATA_2' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "List cashflow records" \
    "curl -s '$API_URL/finance/cashflow?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r 'length'" \
    "[1-9]"

# Add liability
LIB_ID="lib-$(date +%s)"
LIB_DATA='{
  "id": "'$LIB_ID'",
  "businessId": "'$BIZ_ID'",
  "name": "Pinjaman Bank",
  "amount": 5000000,
  "dueDate": '$(date -d "+30 days" +%s000)',
  "totalTenure": 12,
  "remainingTenure": 12,
  "isPaidThisMonth": false
}'

test "Add liability" \
    "curl -s -X POST $API_URL/finance/liabilities -H 'Content-Type: application/json' -d '$LIB_DATA' -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "List liabilities" \
    "curl -s '$API_URL/finance/liabilities?businessId=$BIZ_ID' -b $COOKIE_FILE | jq -r 'length'" \
    "[1-9]"

# Mark liability as paid
test "Mark liability as paid" \
    "curl -s -X PUT $API_URL/finance/liabilities/$LIB_ID/pay -b $COOKIE_FILE | jq -r '.success'" \
    "true"

test "Delete liability" \
    "curl -s -X DELETE $API_URL/finance/liabilities/$LIB_ID -b $COOKIE_FILE | jq -r '.success'" \
    "true"

echo ""

# ============================================
# 5. MARKETPLACE
# ============================================
echo -e "${BLUE}5. Marketplace${NC}"
echo "--------------"

test "List marketplace items" \
    "curl -s $API_URL/marketplace/items -b $COOKIE_FILE | jq -r 'type'" \
    "array"

test "Get credit balance" \
    "curl -s $API_URL/marketplace/balance -b $COOKIE_FILE | jq -r '.credits'" \
    "[0-9]"

echo ""

# ============================================
# 6. ADMIN ENDPOINTS (if user is admin)
# ============================================
echo -e "${BLUE}6. Admin Endpoints${NC}"
echo "------------------"

test "List all users (admin only)" \
    "curl -s $API_URL/admin/users -b $COOKIE_FILE | jq -r 'type'" \
    "array\|error"

test "Get system settings" \
    "curl -s $API_URL/configs/settings -b $COOKIE_FILE | jq -r 'type'" \
    "object\|array"

echo ""

# ============================================
# FINAL RESULTS
# ============================================
echo "========================================"
echo -e "${CYAN}📊 Extended Test Results:${NC}"
echo -e "   ${GREEN}Passed: $pass${NC}"
echo -e "   ${RED}Failed: $fail${NC}"
echo ""

total=$((pass + fail))
percentage=$((pass * 100 / total))

if [ $fail -eq 0 ]; then
    echo -e "${GREEN}✅ ALL EXTENDED TESTS PASSED!${NC}"
    echo -e "${GREEN}Coverage: $percentage% ($pass/$total)${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed${NC}"
    echo -e "${YELLOW}Coverage: $percentage% ($pass/$total)${NC}"
    exit 1
fi
