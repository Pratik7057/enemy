# Generate CSR for radhaapi.me

This guide will help you generate a Certificate Signing Request (CSR) for the domain `radhaapi.me` using the email `Pratikade1643@gmail.com`.

## Prerequisites

- OpenSSL installed on your system
  - Windows: You can download from [this link](https://slproweb.com/products/Win32OpenSSL.html)
  - Linux: `sudo apt-get install openssl`
  - macOS: `brew install openssl`

## Steps to Generate CSR

1. Open a terminal or command prompt
2. Run the following command:

```bash
# For Windows PowerShell
openssl req -new -newkey rsa:2048 -nodes -keyout radhaapi_me.key -out radhaapi_me.csr
```

3. When prompted, provide the following information:
   - Country Name (2 letter code): `IN`
   - State or Province Name: `Maharashtra`
   - Locality Name (city): `Mumbai`
   - Organization Name: `Radha API`
   - Organizational Unit Name: `IT`
   - Common Name (domain name): `radhaapi.me`
   - Email Address: `Pratikade1643@gmail.com`
   - A challenge password: (leave blank by pressing Enter)
   - An optional company name: (leave blank by pressing Enter)

## Alternative: Generate CSR with Subject in One Command

```bash
openssl req -new -newkey rsa:2048 -nodes -keyout radhaapi_me.key -out radhaapi_me.csr -subj "/C=IN/ST=Maharashtra/L=Mumbai/O=Radha API/OU=IT/CN=radhaapi.me/emailAddress=Pratikade1643@gmail.com"
```

## For Wildcard Certificate

If you want to cover all subdomains (wildcard certificate):

```bash
openssl req -new -newkey rsa:2048 -nodes -keyout radhaapi_me.key -out radhaapi_me.csr -subj "/C=IN/ST=Maharashtra/L=Mumbai/O=Radha API/OU=IT/CN=*.radhaapi.me/emailAddress=Pratikade1643@gmail.com"
```

## View CSR Contents

To verify the CSR contents:

```bash
openssl req -text -noout -in radhaapi_me.csr
```

## Next Steps

1. Keep the `.key` file secure and private - this is your private key
2. Submit the `.csr` file to your SSL certificate provider
3. Follow their instructions to complete the SSL certificate issuance process
4. Once you receive the certificate, install it on your web server

## Nginx SSL Configuration Example

After obtaining your SSL certificate, here's how to configure it in Nginx:

```nginx
server {
    listen 443 ssl;
    server_name radhaapi.me;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/radhaapi_me.key;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # Other configs
    location / {
        proxy_pass http://localhost:3000; # Assuming frontend runs on port 3000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5000; # Assuming backend runs on port 5000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name radhaapi.me;
    return 301 https://$host$request_uri;
}
```

## Using Let's Encrypt (Free SSL)

If you're hosting on a server you control, you can use Let's Encrypt to get a free SSL certificate:

```bash
# Install Certbot (Ubuntu)
sudo apt install certbot python3-certbot-nginx

# Get certificate and configure Nginx
sudo certbot --nginx -d radhaapi.me -d www.radhaapi.me

# Auto-renewal is set up by default
```

Remember to check your SSL configuration using [SSL Labs](https://www.ssllabs.com/ssltest/) after installation.
