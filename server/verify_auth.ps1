$baseUrl = "http://localhost:5000"

# 1. Login
Write-Host "1. Logging in..."
$loginBody = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    $userId = $loginResponse.user.id
    Write-Host "Login successful. Token received."
} catch {
    Write-Host "Login failed: $_"
    exit 1
}

# 2. Access Protected Route with Token
Write-Host "`n2. Accessing Protected Route (My Bookings) with Token..."
try {
    $headers = @{ Authorization = "Bearer $token" }
    $bookings = Invoke-RestMethod -Uri "$baseUrl/api/bookings/user/$userId" -Method Get -Headers $headers
    Write-Host "Success! Retrieved bookings."
} catch {
    Write-Host "Failed to access protected route with token: $_"
}

# 3. Access Protected Route without Token
Write-Host "`n3. Accessing Protected Route without Token..."
try {
    Invoke-RestMethod -Uri "$baseUrl/api/bookings/user/$userId" -Method Get
    Write-Host "FAILED: Should have been denied."
} catch {
    if ($_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::Unauthorized) {
        Write-Host "Success! Access denied as expected (401)."
    } else {
        Write-Host "Unexpected error: $_"
    }
}

# 4. Access Protected Route with Invalid Token
Write-Host "`n4. Accessing Protected Route with Invalid Token..."
try {
    $invalidHeaders = @{ Authorization = "Bearer invalid_token" }
    Invoke-RestMethod -Uri "$baseUrl/api/bookings/user/$userId" -Method Get -Headers $invalidHeaders
    Write-Host "FAILED: Should have been denied."
} catch {
    if ($_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::Unauthorized) {
        Write-Host "Success! Access denied as expected (401)."
    } else {
        Write-Host "Unexpected error: $_"
    }
}
