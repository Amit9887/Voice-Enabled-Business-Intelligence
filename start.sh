#!/bin/bash

# Voice Report POC Startup Script
echo "🎤 Starting Voice Report Generation POC..."
echo "=========================================="

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    echo "   On macOS: brew services start postgresql"
    echo "   On Ubuntu: sudo systemctl start postgresql"
    exit 1
fi
echo "✅ PostgreSQL is running"

# Setup database
echo "🗄️  Setting up database..."
cd database
psql -U postgres -d postgres -f setup.sql
if [ $? -eq 0 ]; then
    echo "✅ Database setup completed"
else
    echo "❌ Database setup failed"
    exit 1
fi
cd ..

# Start backend
echo "🚀 Starting Spring Boot backend..."
cd backend
mvn clean install -q
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi

# Start backend in background
nohup mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Check if backend is responding
if curl -s http://localhost:8080/api/voice/test > /dev/null; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding"
    kill $BACKEND_PID
    exit 1
fi

# Start frontend
echo "🎨 Starting React frontend..."
cd frontend
npm install -q
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependencies installation failed"
    kill $BACKEND_PID
    exit 1
fi

# Start frontend in background
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "🎉 Voice Report POC is now running!"
echo "=================================="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo ""
echo "📝 Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop the application:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🎤 Try saying: 'Generate report from January to March'"
echo ""

# Save PIDs for cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .pids

# Wait for user input to stop
read -p "Press Enter to stop the application..."
echo "🛑 Stopping application..."

# Kill processes
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
rm -f .pids
echo "✅ Application stopped"
