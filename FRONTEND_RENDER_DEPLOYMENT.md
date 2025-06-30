# Frontend Deployment Guide for Render

This guide explains how to deploy only the frontend of the RadhaAPI application on Render.

## Prerequisites

- A Render account
- Your backend already deployed and running on Render or another service
- Git repository with your code

## Deployment Steps

1. **Login to Render Dashboard**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Login to your account

2. **Create a New Static Site**
   - Click on "New" and select "Static Site"
   - Connect to your GitHub/GitLab repository
   - Or deploy from an existing repository

3. **Configure the Static Site**
   - **Name**: radhaapi-frontend
   - **Environment**: Static Site
   - **Build Command**: `cd frontend && npm install && REACT_APP_API_URL=https://www.radhaapi.me/api npm run build`
   - **Publish Directory**: `frontend/build`
   - **Branch**: main (or your preferred branch)

4. **Environment Variables**
   - Add the following environment variable:
     - `REACT_APP_API_URL`: `https://www.radhaapi.me/api`

5. **Advanced Settings**
   - If you have your own domain, you can configure it in the "Settings" tab after deployment

6. **Deploy**
   - Click "Create Static Site"
   - Render will build and deploy your frontend

## Custom Domain Setup (Optional)

1. Go to your static site's "Settings" tab
2. Under "Custom Domain", click on "Add Custom Domain"
3. Follow the instructions to verify domain ownership and set up DNS records

## Troubleshooting

- If you encounter routing issues, check that the `_redirects` file exists in your `frontend/public` directory
- Verify that your API endpoint in the environment variables points to your running backend
- Check the build logs in Render for any errors during deployment

## Maintenance

To redeploy after making changes:
1. Push your changes to the connected repository
2. Render will automatically detect changes and redeploy

## Using render-frontend.yaml (Optional)

If you prefer using a configuration file:
1. Add the `render-frontend.yaml` file to your repository
2. In Render, when creating a new service, select "Blueprint" as the deployment option
3. Render will use the configuration from the YAML file
