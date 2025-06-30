# Heroku पर Backend Deploy करने की गाइड - RadhaAPI

## आवश्यकताएँ

1. Heroku CLI installed
2. Git installed  
3. Heroku account
4. MongoDB Atlas setup

## Deployment के Steps

### 1. Heroku CLI Install करें
```bash
# Windows के लिए Heroku CLI download करें
# https://devcenter.heroku.com/articles/heroku-cli से download करें
```

### 2. Heroku में Login करें
```bash
heroku login
```

### 3. Heroku App Create करें
```bash
# Backend folder में जाएँ
cd backend

# नया Heroku app बनाएँ
heroku create radhaapi-backend

# या अपना नाम specify करें
heroku create your-app-name
```

### 4. Environment Variables Set करें
```bash
# Production environment variables set करें
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="आपका_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="आपका_complex_jwt_secret"
heroku config:set YOUTUBE_API_KEY="आपका_youtube_api_key"
heroku config:set CORS_ORIGIN="https://www.radhaapi.me"
heroku config:set ADMIN_EMAIL="admin@radhaapi.me"

# सभी config variables देखें
heroku config
```

### 5. Heroku पर Deploy करें
```bash
# Git initialize करें (अगर पहले से नहीं है)
git init

# Heroku remote add करें
heroku git:remote -a radhaapi-backend

# सभी files add करें
git add .

# Changes commit करें
git commit -m "Deploy RadhaAPI backend to Heroku"

# Heroku पर push करें
git push heroku main
```

### 6. Logs देखें
```bash
# Real-time logs देखें
heroku logs --tail

# Recent logs देखें
heroku logs
```

### 7. App Open करें
```bash
# Browser में app open करें
heroku open
```

## Environment Variables की List

Heroku dashboard या CLI के through ये environment variables set करें:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radhaapi
JWT_SECRET=आपका_super_secure_jwt_secret_key
JWT_EXPIRY=7d
YOUTUBE_API_KEY=आपका_youtube_api_key
CORS_ORIGIN=https://www.radhaapi.me
ADMIN_EMAIL=admin@radhaapi.me
NODE_ENV=production
```

## MongoDB Atlas Setup

1. MongoDB Atlas cluster create करें
2. Database user create करें
3. Heroku IPs को whitelist करें (या सभी से allow करें: 0.0.0.0/0)
4. Connection string लें
5. MONGODB_URI में <username>, <password>, और <cluster> को replace करें

## Deployment Test करना

1. Health endpoint test करें: `https://your-app-name.herokuapp.com/api/health`
2. Authentication endpoints test करें
3. किसी भी issue के लिए logs check करें

## समस्या निवारण

### Common Issues:

1. **App startup पर crash**
   - Logs check करें: `heroku logs --tail`
   - Environment variables verify करें
   - MongoDB connection check करें

2. **Database connection fail**
   - MongoDB Atlas network access verify करें
   - MONGODB_URI format check करें
   - Database user के permissions check करें

3. **CORS errors**
   - CORS_ORIGIN environment variable verify करें
   - Frontend URL configuration check करें

### Useful Commands:

```bash
# App restart करें
heroku restart

# Dynos scale करें
heroku ps:scale web=1

# Heroku पर commands run करें
heroku run node -v

# App info देखें
heroku info
```

## Domain Configuration

1. Deployment के बाद, आपका Heroku app URL note करें
2. Frontend को configure करें कि वह इस URL को API_URL के रूप में use करे
3. जरूरत हो तो custom domain add करें:
   ```bash
   heroku domains:add api.radhaapi.me
   ```

## GitHub से Auto-Deploy (Optional)

1. Heroku Dashboard पर जाएँ
2. आपका app select करें
3. Deploy tab पर जाएँ
4. GitHub repository connect करें
5. Main branch से automatic deploys enable करें

## Quick PowerShell Script से Deploy करना

```powershell
# PowerShell में script run करें
./deploy-backend-heroku.ps1
```

यह script automatically सब कुछ setup कर देगा।

आपका backend अब available होगा: `https://your-app-name.herokuapp.com`

## Frontend Configuration

Backend deploy करने के बाद, आपको frontend के environment variables update करने होंगे:

```bash
# Frontend के .env.production में
REACT_APP_API_URL=https://your-app-name.herokuapp.com/api
```
