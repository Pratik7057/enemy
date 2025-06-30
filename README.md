# RadhaAPI Platform

A full-stack web application that provides YouTube API integration services with a complete user management system.

## Features

- 🔐 **JWT Authentication & Authorization**: Secure user authentication system with role-based access control
- 🎥 **YouTube API Integration**: Generate and manage unique API keys for YouTube API access
- 💰 **Balance Management**: Add funds to your account through multiple payment methods
- 📊 **Admin Dashboard**: Complete admin panel for user management, order tracking, and service configuration
- 📱 **Responsive Design**: Modern UI built with React and Tailwind CSS

## Technology Stack

### Frontend
- React.js
- Tailwind CSS 
- React Router
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Installation and Setup

### Prerequisites
- Node.js (v14 or above)
- MongoDB (local or Atlas)
- Git

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/radha-api.git
cd radha-api
```

2. Install dependencies
```bash
npm run install-all
```

3. Create .env file in the backend directory
```bash
# Backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/radha-api
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
- PayPal
- Bitcoin
- Bank Transfer
- QR Code Scanner (for mobile payments)

## Deployment

This application can be deployed on various platforms:

### SSL Certificate Installation
1. Generate a CSR (Certificate Signing Request)
   ```bash
   # Use the provided generate_csr script or run this command
   openssl req -new -newkey rsa:2048 -nodes -keyout radhaapi_me.key -out radhaapi_me.csr -subj "/C=IN/ST=Maharashtra/L=Mumbai/O=Radha API/OU=IT/CN=radhaapi.me/emailAddress=Pratikade1643@gmail.com"
   ```

2. Submit the CSR to your certificate authority
   - Keep the private key (radhaapi_me.key) secure
   - Once you receive the certificate, save it as radhaapi_me.crt

3. Install the certificate:
   - For Nginx:
     ```nginx
     server {
         listen 443 ssl;
         server_name radhaapi.me;
         ssl_certificate /path/to/radhaapi_me.crt;
         ssl_certificate_key /path/to/radhaapi_me.key;
         
         # Your other Nginx configuration...
     }
     ```
   - For Apache:
     ```apache
     <VirtualHost *:443>
         ServerName radhaapi.me
         SSLEngine on
         SSLCertificateFile /path/to/radhaapi_me.crt
         SSLCertificateKeyFile /path/to/radhaapi_me.key
         
         # Your other Apache configuration...
     </VirtualHost>
     ```

### Heroku
```bash
# Install Heroku CLI
heroku create radha-api
heroku config:set MONGODB_URI=your_mongodb_uri JWT_SECRET=your_jwt_secret
git push heroku main
```

### DigitalOcean
Set up a droplet with Node.js, MongoDB, and Nginx reverse proxy.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
