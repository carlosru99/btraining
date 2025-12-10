#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest code..."
git pull

# 2. Ensure .env exists
if [ ! -f .env ]; then
  echo "⚠️  .env file not found!"
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "Please edit .env with your production values and run this script again."
  exit 1
fi

# 3. Build and start containers
echo "🏗️  Building and starting services..."
docker compose up -d --build

# 4. Wait for postgres to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# 5. Setup Database
echo "🗄️  Setting up database..."

# Try to run migrations
if docker compose exec app npx prisma@5.22.0 migrate deploy; then
    echo "✅ Migrations applied successfully."
else
    echo "⚠️  Migration failed. Attempting 'db push' to sync schema..."
    docker compose exec app npx prisma@5.22.0 db push
fi

# 6. Seed Database
echo "🌱 Seeding database..."
docker compose exec app npx prisma@5.22.0 db seed

echo "✅ Deployment complete! App is running."

