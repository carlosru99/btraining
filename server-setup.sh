#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Server Setup..."

# 1. Update and Install Dependencies (Ubuntu/Debian)
echo "📦 Installing dependencies (Git, Docker)..."
sudo apt-get update
sudo apt-get install -y git curl

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "Docker installed. You might need to log out and back in for group changes to take effect."
else
    echo "Docker is already installed."
fi

# Install Docker Compose if not present (newer docker includes compose plugin)
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo apt-get install -y docker-compose-plugin
fi

# 2. Clone Repository
# REPLACE THIS WITH YOUR REPO URL
REPO_URL="YOUR_GITHUB_REPO_URL_HERE"
APP_DIR="btraining-web"

if [ -d "$APP_DIR" ]; then
    echo "📂 Directory $APP_DIR already exists. Pulling latest changes..."
    cd $APP_DIR
    git pull
else
    echo "📂 Cloning repository..."
    if [ "$REPO_URL" == "YOUR_GITHUB_REPO_URL_HERE" ]; then
        echo "❌ Error: You need to edit this script and set your REPO_URL"
        exit 1
    fi
    git clone "$REPO_URL" "$APP_DIR"
    cd $APP_DIR
fi

# 3. Setup Environment
if [ ! -f .env ]; then
    echo "⚙️  Setting up .env file..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Please edit .env file with your production secrets!"
    echo "   Run: nano .env"
    read -p "Press Enter when you have finished editing .env..."
fi

# 4. Deploy
echo "🚀 Running deployment script..."
chmod +x deploy.sh
./deploy.sh

echo "✅ Setup complete!"
