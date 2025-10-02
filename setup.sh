#!/bin/bash

# Voice-Enabled Report Generation POC - Complete Setup Script
# This script sets up the entire system: database, backend, frontend with dummy data

set -e  # Exit on any error

echo "🚀 Voice-Enabled Report Generation POC Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_status "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check if Java is installed (for Maven)
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please install Java 17 or later."
        print_status "Visit: https://adoptium.net/"
        exit 1
    fi
    
    # Check if Maven is installed
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed. Please install Maven first."
        print_status "Visit: https://maven.apache.org/install.html"
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All system requirements are met!"
}

# Clean up any existing containers and volumes
cleanup() {
    print_status "Cleaning up existing containers and volumes..."
    
    # Stop and remove containers
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Remove volumes if they exist
    docker volume rm poc_voice_postgres_data 2>/dev/null || true
    
    print_success "Cleanup completed!"
}

# Setup database
setup_database() {
    print_status "Setting up PostgreSQL database..."
    
    # Start only the database first
    docker-compose up -d postgres
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Check if database is ready
    max_attempts=30
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec -T postgres pg_isready -U postgres -d voice_report_poc 2>/dev/null; then
            print_success "Database is ready!"
            break
        fi
        print_status "Waiting for database... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        print_error "Database failed to start within expected time."
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up Spring Boot backend..."
    
    cd backend
    
    # Build the project
    print_status "Building Maven project..."
    mvn clean package -DskipTests
    
    if [ $? -ne 0 ]; then
        print_error "Maven build failed!"
        exit 1
    fi
    
    print_success "Backend build completed!"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up React frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "npm install failed!"
        exit 1
    fi
    
    print_success "Frontend setup completed!"
    cd ..
}

# Start all services
start_services() {
    print_status "Starting all services..."
    
    # Start backend and frontend
    docker-compose up -d backend frontend
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 15
    
    # Check if backend is ready
    max_attempts=30
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8080/api/voice/test > /dev/null 2>&1; then
            print_success "Backend is ready!"
            break
        fi
        print_status "Waiting for backend... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        print_warning "Backend may still be starting up. Please wait a moment and check manually."
    fi
    
    # Check if frontend is ready
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            print_success "Frontend is ready!"
            break
        fi
        print_status "Waiting for frontend... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        print_warning "Frontend may still be starting up. Please wait a moment and check manually."
    fi
}

# Verify setup
verify_setup() {
    print_status "Verifying setup..."
    
    # Test backend API
    if curl -s http://localhost:8080/api/voice/test | grep -q "Voice Command API is working"; then
        print_success "Backend API is working!"
    else
        print_warning "Backend API test failed. Please check the logs."
    fi
    
    # Test frontend
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Frontend is accessible!"
    else
        print_warning "Frontend test failed. Please check the logs."
    fi
    
    # Test database connection
    if docker-compose exec -T postgres psql -U postgres -d voice_report_poc -c "SELECT COUNT(*) FROM sales_data;" > /dev/null 2>&1; then
        print_success "Database connection is working!"
    else
        print_warning "Database connection test failed. Please check the logs."
    fi
}

# Show final information
show_final_info() {
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "📊 Your Voice-Enabled Report Generation POC is ready!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8080"
    echo "   Database: localhost:5432"
    echo ""
    echo "🎤 Voice Commands to try:"
    echo "   • 'Generate report for clothing category'"
    echo "   • 'Generate report for electronics category'"
    echo "   • 'Generate report for North region'"
    echo "   • 'Generate report from January to March'"
    echo "   • 'Generate report for books category from last month'"
    echo ""
    echo "📋 Features:"
    echo "   • Voice-enabled report generation"
    echo "   • Category and region filtering"
    echo "   • Date range filtering"
    echo "   • Excel report downloads"
    echo "   • Real-time data visualization"
    echo ""
    echo "🛠️  Management Commands:"
    echo "   • Stop all services: docker-compose down"
    echo "   • View logs: docker-compose logs -f"
    echo "   • Restart services: docker-compose restart"
    echo ""
    echo "📁 Project Structure:"
    echo "   • Frontend: ./frontend/"
    echo "   • Backend: ./backend/"
    echo "   • Database: PostgreSQL with dummy data"
    echo "   • Reports: ./backend/reports/"
    echo ""
    print_success "Happy voice reporting! 🎉"
}

# Main execution
main() {
    echo ""
    print_status "Starting Voice-Enabled Report Generation POC setup..."
    echo ""
    
    # Run setup steps
    check_requirements
    cleanup
    setup_database
    setup_backend
    setup_frontend
    start_services
    verify_setup
    show_final_info
}

# Handle script interruption
trap 'print_error "Setup interrupted by user"; exit 1' INT TERM

# Run main function
main "$@"
