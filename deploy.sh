#!/bin/bash

# Dictionary App Docker Deployment Script

set -e

echo "🐳 Dictionary App Docker Deployment"
echo "=================================="

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t dictionary-app:latest .

echo "✅ Build complete!"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Creating from example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys before running the container."
    exit 1
fi

# Run the container
echo "🚀 Starting container..."
docker run -d \
  --name dictionary-app \
  --restart unless-stopped \
  -p 4000:4000 \
  --env-file .env \
  dictionary-app:latest

echo "✅ Container started successfully!"
echo "🌐 Application available at: http://localhost:4000"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker logs dictionary-app"
echo "  Stop app:  docker stop dictionary-app"
echo "  Remove:    docker rm dictionary-app"