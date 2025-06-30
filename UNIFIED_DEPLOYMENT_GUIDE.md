# Unified Frontend-Backend Deployment Guide for Render

This guide explains how to deploy the RADHA API application to Render, serving both frontend and backend from a single service.

## Project Structure

- `/backend`: Node.js Express backend
- `/frontend`: React frontend
- `/frontend/build`: React production build (generated)

## Deployment Steps

1. **Push your code to GitHub**: Make sure your repository includes all the changes we made.

2. **Create a new Web Service on Render**:
   - Connect your GitHub repository
   - Select "Web Service"
   - Use the settings from your `render.yaml` file:
     - Name: radhaapi
     - Environment: Node
     - Region: Singapore (or your preferred region)
     - Build Command: `npm run render-build`
     - Start Command: `cd backend && node server.js`
     - Health Check Path: `/api/health`

3. **Set Environment Variables**:
   - `NODE_ENV`: production
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `PORT`: 10000 (or any port Render assigns)
   - `YOUTUBE_API_KEY`: Your YouTube API key
   - `CORS_ORIGIN`: Your domain (e.g., https://www.radhaapi.me)
   - `REACT_APP_API_URL`: Same as your domain with /api (e.g., https://www.radhaapi.me/api)

4. **Set up custom domains**:
   - After deployment is successful, go to Settings > Custom Domain
   - Add your domains (e.g., www.radhaapi.me and api.radhaapi.me)
   - Follow Render's instructions to set up DNS records

## How It Works

The updated configuration:

1. **Build Process**:
   - The `render-build` script installs dependencies for both backend and frontend
   - It then builds the React frontend to generate static files

2. **Server Configuration**:
   - The Express server is configured to serve the React static files from `/frontend/build`
   - API routes are prefixed with `/api` to differentiate them from frontend routes
   - React routing is handled by sending `index.html` for all non-API routes

3. **API Configuration**:
   - Frontend API calls use the axios configuration that points to the correct API URL
   - In production, this is set by the `REACT_APP_API_URL` environment variable
   - In development, it defaults to `http://localhost:5001/api`

## Troubleshooting

1. **Frontend Not Loading**:
   - Check that the build directory exists: `/frontend/build`
   - Check server logs to see if the static files are being served correctly
   - Verify that your React routes are set up correctly

2. **API Calls Not Working**:
   - Make sure the `REACT_APP_API_URL` environment variable is set correctly
   - Check that the API routes in your frontend code are correct
   - Make sure CORS is configured properly in your backend

3. **Build Failures**:
   - Check the build logs on Render
   - Make sure all dependencies are correctly specified in package.json

## Local Development

For local development:
1. Run `npm run install-all` to install all dependencies
2. Run `npm run dev` to start both frontend and backend servers
