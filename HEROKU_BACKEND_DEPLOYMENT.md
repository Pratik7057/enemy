# Heroku Backend Deployment Guide - RadhaAPI

## Prerequisites

1. Heroku CLI installed
2. Git installed
3. Heroku account
4. MongoDB Atlas setup

## Deployment Steps

### 1. Install Heroku CLI
```bash
# Windows (using Chocolatey)
choco install heroku-cli

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
# Navigate to backend folder
cd backend

# Create new Heroku app
heroku create radhaapi-backend

# Or if you want a specific name
heroku create your-app-name
```

### 4. Set Environment Variables
```bash
# Set production environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_complex_jwt_secret"
heroku config:set YOUTUBE_API_KEY="your_youtube_api_key"
heroku config:set CORS_ORIGIN="https://www.radhaapi.me"
heroku config:set ADMIN_EMAIL="admin@radhaapi.me"

# View all config vars
heroku config
```

### 5. Deploy to Heroku
```bash
# Initialize git if not already done
git init

# Add Heroku remote
heroku git:remote -a radhaapi-backend

# Add all files
git add .

# Commit changes
git commit -m "Deploy RadhaAPI backend to Heroku"

# Push to Heroku
git push heroku main
```

### 6. View Logs
```bash
# View real-time logs
heroku logs --tail

# View recent logs
heroku logs
```

### 7. Open App
```bash
# Open app in browser
heroku open
```

## Environment Variables Setup

Set these environment variables in Heroku dashboard or via CLI:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radhaapi
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRY=7d
YOUTUBE_API_KEY=your_youtube_api_key
CORS_ORIGIN=https://www.radhaapi.me
ADMIN_EMAIL=admin@radhaapi.me
NODE_ENV=production
```

## MongoDB Atlas Setup

1. Create MongoDB Atlas cluster
2. Create database user
3. Whitelist Heroku IPs (or allow from anywhere: 0.0.0.0/0)
4. Get connection string
5. Replace <username>, <password>, and <cluster> in MONGODB_URI

## Testing Deployment

1. Test health endpoint: `https://your-app-name.herokuapp.com/api/health`
2. Test authentication endpoints
3. Check logs for any issues

## Troubleshooting

### Common Issues:

1. **App crash on startup**
   - Check logs: `heroku logs --tail`
   - Verify environment variables
   - Check MongoDB connection

2. **Database connection failed**
   - Verify MongoDB Atlas network access
   - Check MONGODB_URI format
   - Ensure database user has proper permissions

3. **CORS errors**
   - Verify CORS_ORIGIN environment variable
   - Check frontend URL configuration

### Useful Commands:

```bash
# Restart app
heroku restart

# Scale dynos
heroku ps:scale web=1

# Run commands on Heroku
heroku run node -v

# View app info
heroku info
```

## Domain Configuration

1. After deployment, note your Heroku app URL
2. Configure your frontend to use this URL as API_URL
3. Add custom domain if needed:
   ```bash
   heroku domains:add api.radhaapi.me
   ```

## Auto-Deploy from GitHub (Optional)

1. Go to Heroku Dashboard
2. Select your app
3. Go to Deploy tab
4. Connect GitHub repository
5. Enable automatic deploys from main branch

Your backend will now be available at: `https://your-app-name.herokuapp.com`
