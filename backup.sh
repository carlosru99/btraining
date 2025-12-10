#!/bin/bash

# Configuration
BACKUP_DIR="./backups"
CONTAINER_NAME="btraining-web-postgres-1" # Or use $(docker-compose ps -q postgres)
DB_USER="gym_user"
DB_NAME="gym_app"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="$BACKUP_DIR/backup_$DATE.sql.gz"

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

# Create backup
echo "Creating backup: $FILENAME"
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME | gzip > $FILENAME

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup successful!"
  
  # Delete backups older than 7 days
  find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete
  echo "Old backups cleaned up."
else
  echo "Backup failed!"
  exit 1
fi
