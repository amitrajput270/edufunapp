#!/bin/bash

# EduFun Library Server Startup Script
# This script starts both the web server and the contact form handler

echo "🚀 Starting EduFun Library servers..."

# Create data directory for contact submissions
mkdir -p contact_data

# Function to handle cleanup on exit
cleanup() {
    echo -e "\n🛑 Shutting down servers..."
    jobs -p | xargs -r kill
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Start the web server (port 8080)
echo "📁 Starting web server on port 8080..."
python3 -m http.server 8080 &
WEB_PID=$!

# Wait a moment for web server to start
sleep 2

# Start the contact form handler (port 8081)
echo "📧 Starting contact form handler on port 8081..."
python3 contact_handler.py &
HANDLER_PID=$!

# Wait a moment for contact handler to start
sleep 2

echo ""
echo "✅ All servers are running!"
echo ""
echo "🌐 Website: http://localhost:8080"
echo "📋 Contact Form: http://localhost:8080/contact.html"
echo "🔧 Admin Panel: http://localhost:8080/admin-submissions.html"
echo "📊 Form Handler API: http://localhost:8081"
echo ""
echo "📝 Data files will be saved in: ./contact_data/"
echo "   - contact_submissions.csv (spreadsheet format)"
echo "   - contact_submissions.json (structured data)"
echo "   - contact_backups/ (automatic backups)"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait
