# BTraining Web App

## Deployment

### Quick Start (Server)

1.  **Connect to your server** via SSH.
2.  **Create a setup script** and run it to install dependencies (Docker, Git) and deploy the app.

    ```bash
    # Create the script
    nano setup.sh
    # (Paste the content of server-setup.sh here)
    
    # Run it
    chmod +x setup.sh
    ./setup.sh
    ```

### Manual Deployment

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/carlosru99/btraining.git btraining-web
    cd btraining-web
    ```

2.  **Configure Environment**:
    ```bash
    cp .env.example .env
    nano .env
    ```
    Update `POSTGRES_PASSWORD`, `NEXTAUTH_SECRET`, and `ADMIN_PASSWORD` with secure values.

3.  **Deploy**:
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

## Database Management

### Admin User
The default admin user created by the seed script is:
*   **Email:** `admin@gym.com`
*   **Password:** The value of `ADMIN_PASSWORD` in your `.env` file (default: `admin123` or `jhHksjoe78!`).

### Daily Backups

The project includes a `backup.sh` script to automate daily database backups.

#### 1. Configuration
Ensure the `backup.sh` script has the correct container name (check with `docker ps`).
```bash
CONTAINER_NAME="btraining-web-postgres-1"
```

#### 2. Manual Backup
Run the script to create an immediate backup in the `./backups` directory:
```bash
./backup.sh
```

#### 3. Automated Daily Backups (Cron)
To run the backup automatically every day at 3:00 AM:

1.  Open the crontab editor:
    ```bash
    crontab -e
    ```

2.  Add the following line (adjust the path to your project):
    ```cron
    0 3 * * * /home/ubuntu/btraining-web/backup.sh >> /home/ubuntu/btraining-web/backup.log 2>&1
    ```

This setup will:
*   Dump the database daily.
*   Compress it to save space.
*   Automatically delete backups older than 7 days.