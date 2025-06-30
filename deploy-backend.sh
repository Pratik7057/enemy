#!/bin/bash
# Script to deploy backend to Render

# Check if the render CLI is installed
if ! command -v render &> /dev/null
then
    echo "Render CLI not found. Please install it first."
    echo "You can install it using: npm install -g @render/cli"
    exit 1
fi

# Deploy the backend service
echo "Deploying backend to Render..."
render deploy --yaml render-backend.yaml

echo "Deployment initiated. Check the Render dashboard for status."
