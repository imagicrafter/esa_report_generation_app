#!/bin/bash

# Kill any existing Node processes on port 3001
echo "Stopping any existing Node processes on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Wait a moment for processes to fully terminate
sleep 1

# Start the development server
echo "Starting development server..."
npm run dev