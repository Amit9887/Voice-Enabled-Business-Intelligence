#!/bin/bash

# Test script to verify the complete setup works correctly

set -e

echo "🧪 Testing Voice-Enabled Report Generation POC Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test functions
test_backend_api() {
    print_status "Testing backend API..."
    
    if curl -s http://localhost:8080/api/voice/test | grep -q "Voice Command API is working"; then
        print_success "Backend API is responding correctly"
        return 0
    else
        print_error "Backend API test failed"
        return 1
    fi
}

test_voice_command() {
    print_status "Testing voice command processing..."
    
    response=$(curl -s -X POST http://localhost:8080/api/voice/process \
        -H "Content-Type: application/json" \
        -d '{"command": "Generate report for clothing category"}')
    
    if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
        records=$(echo "$response" | jq '.salesData | length')
        print_success "Voice command processed successfully - Found $records records"
        return 0
    else
        print_error "Voice command processing failed"
        return 1
    fi
}

test_sales_data_api() {
    print_status "Testing sales data API..."
    
    response=$(curl -s http://localhost:8080/api/sales/data)
    
    if echo "$response" | jq -e '.[]' > /dev/null 2>&1; then
        count=$(echo "$response" | jq '. | length')
        print_success "Sales data API working - Found $count records"
        return 0
    else
        print_error "Sales data API failed"
        return 1
    fi
}

test_database_connection() {
    print_status "Testing database connection..."
    
    if docker-compose exec -T postgres psql -U postgres -d voice_report_poc -c "SELECT COUNT(*) FROM sales_data;" > /dev/null 2>&1; then
        count=$(docker-compose exec -T postgres psql -U postgres -d voice_report_poc -t -c "SELECT COUNT(*) FROM sales_data;" | tr -d ' \n')
        print_success "Database connection working - $count records in database"
        return 0
    else
        print_error "Database connection failed"
        return 1
    fi
}

test_frontend_access() {
    print_status "Testing frontend accessibility..."
    
    if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
        print_success "Frontend is accessible"
        return 0
    else
        print_error "Frontend accessibility test failed"
        return 1
    fi
}

test_report_generation() {
    print_status "Testing report generation..."
    
    response=$(curl -s -X POST http://localhost:8080/api/voice/process \
        -H "Content-Type: application/json" \
        -d '{"command": "Generate report for electronics category"}')
    
    if echo "$response" | jq -e '.reportUrl' > /dev/null 2>&1; then
        report_url=$(echo "$response" | jq -r '.reportUrl')
        filename=$(basename "$report_url")
        
        # Test download endpoint
        if curl -s -I "http://localhost:8080/api/voice/download/$filename" | grep -q "200"; then
            print_success "Report generation and download working"
            return 0
        else
            print_error "Report download failed"
            return 1
        fi
    else
        print_error "Report generation failed"
        return 1
    fi
}

test_different_voice_commands() {
    print_status "Testing various voice commands..."
    
    commands=(
        "Generate report for books category"
        "Generate report for North region"
        "Generate report for electronics category from last month"
        "Generate report for clothing category from North region"
    )
    
    passed=0
    total=${#commands[@]}
    
    for command in "${commands[@]}"; do
        response=$(curl -s -X POST http://localhost:8080/api/voice/process \
            -H "Content-Type: application/json" \
            -d "{\"command\": \"$command\"}")
        
        if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
            records=$(echo "$response" | jq '.salesData | length')
            print_success "Command '$command' - $records records"
            ((passed++))
        else
            print_error "Command '$command' failed"
        fi
    done
    
    if [ $passed -eq $total ]; then
        print_success "All voice commands working ($passed/$total)"
        return 0
    else
        print_error "Some voice commands failed ($passed/$total)"
        return 1
    fi
}

# Main test execution
main() {
    echo ""
    print_status "Starting comprehensive system tests..."
    echo ""
    
    tests_passed=0
    total_tests=7
    
    # Run all tests
    if test_backend_api; then ((tests_passed++)); fi
    if test_sales_data_api; then ((tests_passed++)); fi
    if test_database_connection; then ((tests_passed++)); fi
    if test_frontend_access; then ((tests_passed++)); fi
    if test_voice_command; then ((tests_passed++)); fi
    if test_report_generation; then ((tests_passed++)); fi
    if test_different_voice_commands; then ((tests_passed++)); fi
    
    echo ""
    echo "📊 Test Results Summary"
    echo "======================"
    echo "Tests Passed: $tests_passed/$total_tests"
    
    if [ $tests_passed -eq $total_tests ]; then
        print_success "🎉 All tests passed! System is working correctly."
        echo ""
        echo "✅ Your Voice-Enabled Report Generation POC is fully functional!"
        echo ""
        echo "🌐 Access your application:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend: http://localhost:8080"
        echo ""
        echo "🎤 Try these voice commands:"
        echo "   • 'Generate report for clothing category'"
        echo "   • 'Generate report for North region'"
        echo "   • 'Generate report for electronics from last month'"
        exit 0
    else
        print_error "❌ Some tests failed. Please check the logs and try running ./setup.sh again."
        exit 1
    fi
}

# Run main function
main "$@"
