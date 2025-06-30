# RadhaAPI Platform

A full-stack web application that provides YouTube API integration services with a complete user management system.

## Features

- 🔐 **JWT Authentication & Authorization**: Secure user authentication system with role-based access control
- 🎥 **YouTube API Integration**: Generate and manage unique API keys for YouTube API access
- 💰 **Balance Management**: Add funds to your account through multiple payment methods
- 📊 **Admin Dashboard**: Complete admin panel for user management, order tracking, and service configuration
- 📱 **Responsive Design**: Modern UI built with React and Tailwind CSS
- 💳 **QR Code Payment**: Scan and pay option for quick mobile payments

## Technology Stack

### Frontend
- React.js with functional components and hooks
- Tailwind CSS for responsive and modern UI design 
- React Router v6 for navigation
- Axios for API requests
- React Context API for state management

### Backend
- Node.js runtime environment
- Express.js framework
- MongoDB with Mongoose ODM
- JWT for secure authentication
- Bcrypt for password hashing

## Live Demo
Visit our live demo at: [radhaapi.me](https://radhaapi.me)

## Installation and Setup

### Prerequisites
- Node.js (v14 or above)
- MongoDB (local or Atlas)
- Git

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/radhaapi.git
cd radhaapi
```

2. Install dependencies
```bash
npm run install-all
```

3. Create .env file in the backend directory
```bash
# Backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/radhaapi
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
YOUTUBE_API_KEY=your_youtube_api_key
```

4. Start the development server
```bash
npm start
```

This will concurrently start both backend (port 5000) and frontend (port 3000) servers.

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### User Endpoints
- `POST /api/user/generate-api-key` - Generate a new YouTube API key
- `GET /api/user/api-key` - Get user's API key details
- `POST /api/user/add-balance` - Add balance to user account
- `GET /api/user/transactions` - Get user transactions

### Admin Endpoints
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/api-logs` - Get YouTube API usage logs (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)

### YouTube API Endpoints
- `GET /api/youtube` - Access YouTube data using generated API key

## Payment Methods

The platform supports multiple payment methods:
- PayPal Integration
- Bitcoin/Cryptocurrency
- Bank Transfer
- QR Code Scanner Integration for mobile payments

### QR Code Scanner Implementation

Our QR code scanner feature allows users to quickly make payments using their mobile devices:

1. We've already installed the necessary dependencies:
```bash
# Already included in package.json
# react-qr-scanner
```

2. QR Code Scanner Component:
```jsx
import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';

const QRCodeScanner = ({ onScan }) => {
  const [error, setError] = useState(null);
  
  const handleScan = (data) => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = (err) => {
    setError(err);
  };

  return (
    <div className="qr-scanner-container p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Scan Payment QR Code</h3>
      {error && <p className="text-red-500 mb-2">Error: {error.message}</p>}
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
        className="rounded-lg overflow-hidden shadow-lg"
      />
      <p className="mt-2 text-sm text-gray-600">Position the QR code in the center of the camera</p>
    </div>
  );
};

export default QRCodeScanner;
```

3. Integration with Payment Page:
```jsx
// In AddBalance.js
import QRCodeScanner from '../components/common/QRCodeScanner';

const AddBalance = () => {
  // ...existing code
  
  const handleQRScan = (data) => {
    // Process the payment data from QR code
    // Format: {paymentMethod}:{amount}:{transactionId}
    const [method, amount, txId] = data.split(':');
    
    setPaymentDetails({
      method,
      amount: parseFloat(amount),
      transactionId: txId
    });
    
    // Proceed with payment processing
    processPayment();
  };
  
  return (
    <div>
      {/* ...existing payment options */}
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Scan to Pay</h3>
        <QRCodeScanner onScan={handleQRScan} />
      </div>
    </div>
  );
};

## Deployment

This application can be deployed on various platforms:

### Domain Registration & Setup

1. **Domain Name**:
   - Using the domain: radhaapi.me
   - Registered through providers like Namecheap, GoDaddy, or Google Domains
   - Typical cost: $10-15 per year

2. **DNS Configuration**:
   - Set up A records pointing to your server IP address
   - Configure CNAME records for subdomains (www, api, admin)
   - Set up MX records if you plan to use custom email addresses

### Hosting Options

#### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

1. **Server Setup**:
   ```bash
   # Update server
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **Project Deployment**:
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/radhaapi.git
   cd radhaapi
   
   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install && npm run build
   
   # Set up PM2 for process management
   npm install -g pm2
   cd ../backend
   pm2 start server.js --name "radhaapi-backend"
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**:
   ```bash
   sudo apt install -y nginx
   
   # Create Nginx config
   sudo nano /etc/nginx/sites-available/radha-api
   ```
   
   Add the following configuration:
   ```nginx   server {
       listen 80;
       server_name radhaapi.me www.radhaapi.me;
       
       location / {
           root /path/to/radhaapi/frontend/build;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
4. **SSL Certificate Setup**:
   ```bash   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d radhaapi.me -d www.radhaapi.me
   ```

#### Option 2: Modern Deployment (Frontend: Vercel, Backend: Render.com)

1. **Frontend Deployment (Vercel)**:
   - Connect your GitHub repository to Vercel
   - Set build command: `cd frontend && npm install && npm run build`
   - Set output directory: `frontend/build`
   - Add environment variables as needed

2. **Backend Deployment (Render.com)**:
   - Create a new Web Service in Render
   - Connect your GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && node server.js`
   - Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
3. Set up PM2 for process management

#### AWS
1. Deploy frontend to S3 + CloudFront
2. Deploy backend to EC2 or Elastic Beanstalk
3. Use RDS or DocumentDB for database

## Frontend Enhancements for Dynamic UI

Our frontend uses several techniques to create a dynamic and engaging user experience:

### Animation and Transitions
- Smooth page transitions using React Router v6 
- Loading state animations for data fetching operations
- Interactive UI elements with hover and focus effects

### Responsive Design
- Mobile-first design approach using Tailwind CSS
- Custom breakpoints for various device sizes
- Adaptive layouts for desktop, tablet, and mobile views

### Modern UI Components
- Custom-designed cards with subtle shadows and hover effects
- Interactive data visualizations with Chart.js
- Toast notifications for user feedback
- Skeleton loaders for content loading states

### Theme Customization
The application supports light and dark mode themes:

```jsx
// In ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Github Repository Setup

1. **Create a New Repository**:
   - Go to GitHub and create a new repository named "radha-api"
   - Make it public or private based on your preference

2. **Push Your Local Repository**:
   ```bash
   # Initialize git repository if not already done
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit"
     # Add remote repository
   git remote add origin https://github.com/yourusername/radhaapi.git
   
   # Push to main branch
   git push -u origin main
   ```

3. **Set Up GitHub Actions for CI/CD**:
   Create a file at `.github/workflows/main.yml`:
   ```yaml
   name: RadhaAPI CI/CD
   
   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]
   
   jobs:
     build-and-test:
       runs-on: ubuntu-latest
       
       steps:
       - uses: actions/checkout@v2
       
       - name: Setup Node.js
         uses: actions/setup-node@v2
         with:
           node-version: '16.x'
           
       - name: Install Backend Dependencies
         run: cd backend && npm install
         
       - name: Install Frontend Dependencies
         run: cd frontend && npm install
         
       - name: Build Frontend
         run: cd frontend && CI=false npm run build
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact us at support@radhaapi.me
