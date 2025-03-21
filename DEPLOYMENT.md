# Warrex API Deployment Guide

This guide provides instructions for deploying the Warrex API to production environments.

## Prerequisites

- Node.js 16.x or higher
- MongoDB Atlas account or other MongoDB deployment
- Docker (optional, for containerized deployment)
- A domain name with SSL certificate (recommended)

## Environment Setup

1. Create a production environment file:

```bash
cp .env .env.production
```

2. Edit `.env.production` with your production settings:

```
PORT=5001
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
NODE_ENV=production
JWT_EXPIRATION=30d
UPLOAD_PATH=./uploads
CORS_ORIGIN=https://your-frontend-domain.com
```

## Deployment Options

### Option 1: Traditional Node.js Deployment

1. Install dependencies:

```bash
npm ci --production
```

2. Start the server:

```bash
npm start
```

For production environments, it's recommended to use a process manager like PM2:

```bash
npm install -g pm2
pm2 start src/server.js --name warrex-api
pm2 save
```

### Option 2: Docker Deployment

1. Build the Docker image:

```bash
docker build -t warrex-api .
```

2. Run the container:

```bash
docker run -d -p 5001:5001 --name warrex-api \
  --env-file .env.production \
  -v $(pwd)/uploads:/usr/src/app/uploads \
  warrex-api
```

### Option 3: Cloud Deployment

#### Heroku

1. Install Heroku CLI and login:

```bash
heroku login
```

2. Create a new Heroku app:

```bash
heroku create warrex-api
```

3. Set environment variables:

```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
heroku config:set JWT_EXPIRATION=30d
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
```

4. Deploy to Heroku:

```bash
git push heroku main
```

#### AWS Elastic Beanstalk

1. Install EB CLI:

```bash
pip install awsebcli
```

2. Initialize EB application:

```bash
eb init
```

3. Create an environment:

```bash
eb create warrex-api-prod
```

4. Set environment variables:

```bash
eb setenv MONGODB_URI=your_mongodb_uri JWT_SECRET=your_jwt_secret NODE_ENV=production
```

5. Deploy:

```bash
eb deploy
```

## Securing Your API

1. Use HTTPS only in production
2. Set up a reverse proxy (Nginx or Apache) in front of your Node.js server
3. Configure proper CORS settings in `.env.production`
4. Regularly update dependencies for security patches
5. Set up monitoring and logging (e.g., with ELK stack or cloud services)

## Database Backups

For MongoDB Atlas:

1. Configure automated backups in the Atlas dashboard
2. Set up a backup schedule that meets your recovery point objective (RPO)
3. Periodically test restoring from backups

## Monitoring

1. Set up application monitoring with tools like:
   - New Relic
   - Datadog
   - PM2 Plus
   - MongoDB Atlas monitoring

2. Configure alerts for:
   - High CPU/memory usage
   - API response time degradation
   - Error rate spikes
   - Database connection issues

## Scaling

As your application grows, consider:

1. Horizontal scaling with load balancers
2. Implementing caching with Redis
3. Using a CDN for static assets
4. Optimizing database queries and indexes

## Troubleshooting

If you encounter issues in production:

1. Check application logs
2. Verify MongoDB connection
3. Ensure environment variables are correctly set
4. Check for network/firewall issues
5. Verify disk space for uploads

For more assistance, refer to the documentation or contact the development team. 