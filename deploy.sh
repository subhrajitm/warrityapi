#!/bin/bash

# Exit on error
set -e

# Deployment script for Warrity API
echo "Deploying Warrity API to production..."

# Pull latest changes
echo "Pulling latest changes from git..."
git pull

# Install dependencies
echo "Installing dependencies..."
npm ci --production

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs uploads nginx/ssl

# Copy production environment file
echo "Setting up environment variables..."
cp .env.production .env

# Build Docker images
echo "Building Docker images..."
docker-compose build

# Stop and remove existing containers
echo "Stopping existing containers..."
docker-compose down

# Start new containers
echo "Starting new containers..."
docker-compose up -d

# Show container status
echo "Container status:"
docker-compose ps

echo "Deployment completed successfully!"
echo "API is now running at https://api.warrity.yourdomain.com" 