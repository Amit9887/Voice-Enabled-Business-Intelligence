#!/bin/bash

# Stop script for Voice-Enabled Report Generation POC

echo "🛑 Stopping Voice-Enabled Report Generation POC"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Stop all services
print_status "Stopping all Docker services..."
docker-compose down

print_success "All services stopped successfully!"

echo ""
echo "📋 To restart the system:"
echo "   ./setup.sh    # Full setup and start"
echo "   ./start.sh    # Quick start (if already set up)"
echo ""
echo "🧹 To clean up completely (removes all data):"
echo "   docker-compose down -v"
echo "   docker system prune -f"
echo ""
