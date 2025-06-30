# Complete Guide: SSL Certificate for radhaapi.me

## Step 1: Install OpenSSL

### For Windows:

1. **Using Chocolatey (Recommended)**:
   ```powershell
   # Install Chocolatey (if not already installed)
   Set-ExecutionPolicy Bypass -Scope Process -Force
   [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
   iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
   
   # Install OpenSSL using Chocolatey
   choco install openssl -y
   ```

2. **Direct Download**:
   - Visit [Win32/Win64 OpenSSL Installer](https://slproweb.com/products/Win32OpenSSL.html)
   - Download and install the appropriate version (e.g., "Win64 OpenSSL v1.1.1" or newer)
   - During installation, choose to copy DLLs to the OpenSSL bin directory
   - Add OpenSSL bin directory to your system PATH:
     - Open System Properties → Advanced → Environment Variables
     - Edit Path variable and add `C:\Program Files\OpenSSL-Win64\bin`

### For Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install openssl
```

### For macOS:
```bash
brew install openssl
```

## Step 2: Generate a CSR and Private Key

Once OpenSSL is installed, open a command prompt or PowerShell and run:

```powershell
# Create a directory to store your SSL files
mkdir C:\SSL
cd C:\SSL

# Generate CSR and private key
openssl req -new -newkey rsa:2048 -nodes -keyout radhaapi_me.key -out radhaapi_me.csr
```

When prompted, enter the following information:
- Country Name (2 letter code): `IN`
- State or Province Name: `Maharashtra`
- Locality Name (city): `Mumbai`
- Organization Name: `Radha API`
- Organizational Unit Name: `IT`
- Common Name (domain name): `radhaapi.me`
- Email Address: `Pratikade1643@gmail.com`
- A challenge password: (leave blank by pressing Enter)
- An optional company name: (leave blank by pressing Enter)

Alternatively, use this one-liner:
```powershell
openssl req -new -newkey rsa:2048 -nodes -keyout radhaapi_me.key -out radhaapi_me.csr -subj "/C=IN/ST=Maharashtra/L=Mumbai/O=Radha API/OU=IT/CN=radhaapi.me/emailAddress=Pratikade1643@gmail.com"
```

## Step 3: Verify the CSR

Check the contents of your CSR to ensure all information is correct:
```powershell
openssl req -text -noout -in radhaapi_me.csr
```

## Step 4: Obtain a Certificate

### Option 1: Purchase from a Commercial Certificate Authority
1. Submit your CSR to a Certificate Authority (CA) like:
   - DigiCert
   - Comodo/Sectigo
   - GoDaddy
   - Namecheap

2. Follow their instructions to validate domain ownership
   - Email validation
   - DNS validation (add a TXT record)
   - HTTP validation (upload a file to your server)

3. Download the certificate files once validated

### Option 2: Free Certificate from Let's Encrypt

If you have server access (not applicable for managed hosting):

#### Using Certbot (Ubuntu server with Nginx):
```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d radhaapi.me -d www.radhaapi.me
```

#### Using Certbot with manual DNS validation:
```bash
sudo certbot certonly --manual --preferred-challenges dns -d radhaapi.me -d www.radhaapi.me
```

## Step 5: Install the Certificate

### For Nginx:
```nginx
server {
    listen 443 ssl http2;
    server_name radhaapi.me www.radhaapi.me;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/radhaapi_me.key;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    
    # Proxy settings for React frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Proxy settings for Node.js API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name radhaapi.me www.radhaapi.me;
    return 301 https://$host$request_uri;
}
```

### For Apache:
```apache
<VirtualHost *:443>
    ServerName radhaapi.me
    ServerAlias www.radhaapi.me
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/radhaapi_me.key
    SSLCertificateChainFile /path/to/ca_bundle.crt  # If provided by CA
    
    # Security headers
    Header always set Strict-Transport-Security "max-age=63072000"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Proxy settings for React frontend
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # Proxy settings for Node.js API
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
    
    ErrorLog ${APACHE_LOG_DIR}/radhaapi_error.log
    CustomLog ${APACHE_LOG_DIR}/radhaapi_access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName radhaapi.me
    ServerAlias www.radhaapi.me
    Redirect permanent / https://radhaapi.me/
</VirtualHost>
```

## Step 6: Set Up Automatic Renewal (for Let's Encrypt)

Let's Encrypt certificates are valid for 90 days. Set up auto-renewal:

### For Certbot:
```bash
# Test renewal process
sudo certbot renew --dry-run

# Add to crontab to check twice daily (recommended)
echo "0 0,12 * * * root python3 -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew" | sudo tee -a /etc/crontab > /dev/null
```

## Step 7: Test Your SSL Configuration

1. Visit [SSL Labs](https://www.ssllabs.com/ssltest/)
2. Enter your domain name (radhaapi.me)
3. Review the results and make adjustments as needed

## Common Issues and Solutions

### Mixed Content Warnings
- Ensure all resources (images, scripts, etc.) are loaded via HTTPS
- Update your frontend code to use relative URLs or HTTPS URLs

### Certificate Chain Issues
- Make sure you've installed the certificate chain (if provided by your CA)
- Some CAs provide a bundle file that needs to be installed

### Certificate Renewal Failures
- For Let's Encrypt, ensure your renewal script has proper permissions
- Check if domain validation method is still valid

## Backup Your Certificate Files

Always keep secure backups of:
- Your private key (radhaapi_me.key)
- Your certificate (certificate.crt)
- Intermediate certificates/chain files
- CSR file (radhaapi_me.csr)

Store these securely as losing the private key would require obtaining a new certificate.
