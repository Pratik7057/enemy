# PowerShell script to deploy backend to Render

# Check if the render CLI is installed
if (-not (Get-Command render -ErrorAction SilentlyContinue)) {
    Write-Output "Render CLI not found. Please install it first."
    Write-Output "You can install it using: npm install -g @render/cli"
    exit 1
}

# Deploy the backend service
Write-Output "Deploying backend to Render..."
render deploy --yaml render-backend.yaml

Write-Output "Deployment initiated. Check the Render dashboard for status."
