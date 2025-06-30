@echo off
echo Generating CSR for radhaapi.me
echo =================================

echo Installing OpenSSL if not present via chocolatey...
echo If this fails, you may need to install Chocolatey first or manually install OpenSSL.
where choco >nul 2>nul
if %errorlevel% neq 0 (
    echo Chocolatey not found. Please install Chocolatey or OpenSSL manually.
    echo Visit: https://chocolatey.org/install
    echo Or download OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html
    pause
    exit /b
)

where openssl >nul 2>nul
if %errorlevel% neq 0 (
    echo OpenSSL not found. Attempting to install using Chocolatey...
    choco install openssl -y
)

echo.
echo Generating 2048-bit RSA private key and CSR for radhaapi.me...
echo.

openssl req -new -newkey rsa:2048 -nodes -keyout radhaapi_me.key -out radhaapi_me.csr -subj "/C=IN/ST=Maharashtra/L=Mumbai/O=Radha API/OU=IT/CN=radhaapi.me/emailAddress=Pratikade1643@gmail.com"

echo.
if %errorlevel% neq 0 (
    echo Failed to generate CSR. Please install OpenSSL manually and try again.
    pause
    exit /b
)

echo CSR generation successful!
echo.
echo Private key saved as: radhaapi_me.key
echo CSR saved as: radhaapi_me.csr
echo.
echo IMPORTANT: Keep your private key secure and never share it.
echo Submit the CSR file to your SSL certificate provider.
echo.

echo Displaying CSR contents for verification:
echo ----------------------------------------
openssl req -text -noout -in radhaapi_me.csr

pause
