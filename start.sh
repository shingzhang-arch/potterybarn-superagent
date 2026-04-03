#!/bin/bash

# PB Super Agent - Local Server Startup Script

PORT=${1:-8000}

echo "=========================="
echo "PB Super Agent Explorer"
echo "=========================="
echo ""
echo "Starting local server on port $PORT..."
echo ""
echo "Open your browser to:"
echo "  http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server $PORT --directory "$(dirname "${BASH_SOURCE[0]}")"
