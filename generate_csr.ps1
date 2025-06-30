# Generate CSR for radhaapi.me

# Check if OpenSSL is installed
$opensslPath = $null
try {
    $opensslPath = (Get-Command openssl -ErrorAction Stop).Source
    Write-Host "OpenSSL found at: $opensslPath" -ForegroundColor Green
} catch {
    Write-Host "OpenSSL not found in PATH." -ForegroundColor Yellow
    Write-Host "Checking common installation locations..." -ForegroundColor Yellow
    
    $possiblePaths = @(
        "C:\Program Files\OpenSSL-Win64\bin\openssl.exe",
        "C:\Program Files (x86)\OpenSSL-Win32\bin\openssl.exe",
        "C:\OpenSSL-Win64\bin\openssl.exe",
        "C:\OpenSSL-Win32\bin\openssl.exe"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $opensslPath = $path
            Write-Host "OpenSSL found at: $opensslPath" -ForegroundColor Green
            break
        }
    }
    
    if ($null -eq $opensslPath) {
        Write-Host "OpenSSL not found. Please install it from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Red
        Write-Host "Or install using chocolatey: choco install openssl" -ForegroundColor Red
        pause
        exit
    }
}

Write-Host "`nGenerating 2048-bit RSA private key and CSR for radhaapi.me..." -ForegroundColor Cyan

# CSR details
$country = "IN"
$state = "Maharashtra"
$city = "Mumbai"
$organization = "Radha API"
$organizationalUnit = "IT"
$commonName = "radhaapi.me"
$email = "Pratikade1643@gmail.com"

# Generate private key and CSR
$subj = "/C=$country/ST=$state/L=$city/O=$organization/OU=$organizationalUnit/CN=$commonName/emailAddress=$email"

try {
    & $opensslPath req -new -newkey rsa:2048 -nodes -keyout radhaapi_me.key -out radhaapi_me.csr -subj $subj
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nCSR generation successful!" -ForegroundColor Green
        Write-Host "Private key saved as: radhaapi_me.key" -ForegroundColor Green
        Write-Host "CSR saved as: radhaapi_me.csr" -ForegroundColor Green
        
        Write-Host "`nIMPORTANT: Keep your private key secure and never share it." -ForegroundColor Yellow
        Write-Host "Submit the CSR file to your SSL certificate provider." -ForegroundColor Yellow
        
        Write-Host "`nDisplaying CSR contents for verification:" -ForegroundColor Cyan
        Write-Host "----------------------------------------" -ForegroundColor Cyan
        & $opensslPath req -text -noout -in radhaapi_me.csr
    } else {
        Write-Host "Failed to generate CSR. OpenSSL returned error code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
