#!/bin/bash

# Ensure .env exists
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "Please edit .env with your production values."
  exit 1
fi

# Build and start containers
echo "Starting services..."
docker compose up -d --build

# Wait for postgres to be ready
echo "Waiting for database..."
sleep 10

# Run migrations
echo "Running migrations..."
docker compose exec app npx prisma@5.22.0 migrate deploy

# Seed database (optional, uncomment if needed)
# echo "Seeding database..."
# docker compose exec app npx prisma@5.22.0 db seed

echo "Deployment complete! App should be running at the configured NEXTAUTH_URL."
