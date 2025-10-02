#!/bin/bash

# API Test Script for Voice Report POC
echo "🧪 Testing Voice Report POC APIs..."
echo "=================================="

BASE_URL="http://localhost:8080/api"

# Test backend health
echo "1. Testing backend health..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/voice/test")
if [ "$response" = "200" ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed (HTTP $response)"
    exit 1
fi

# Test voice command processing
echo "2. Testing voice command processing..."
response=$(curl -s -X POST "$BASE_URL/voice/process" \
  -H "Content-Type: application/json" \
  -d '{"command": "Generate report from January 1st to March 31st"}')

if echo "$response" | grep -q "success.*true"; then
    echo "✅ Voice command processing works"
    echo "   Response: $(echo "$response" | jq -r '.message' 2>/dev/null || echo "Check response format")"
else
    echo "❌ Voice command processing failed"
    echo "   Response: $response"
fi

# Test sales data API
echo "3. Testing sales data API..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sales/data")
if [ "$response" = "200" ]; then
    echo "✅ Sales data API is working"
else
    echo "❌ Sales data API failed (HTTP $response)"
fi

# Test date range API
echo "4. Testing date range API..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sales/data/date-range?startDate=2024-01-01&endDate=2024-03-31")
if [ "$response" = "200" ]; then
    echo "✅ Date range API is working"
else
    echo "❌ Date range API failed (HTTP $response)"
fi

echo ""
echo "🎉 API testing completed!"
echo "Check the results above for any issues."
