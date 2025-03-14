curl -X POST http://localhost:3000/api/v1/auth/sign-in \
-H "Content-Type: application/json" \
-d '{"email": "cp@gmail.com", "password": "password123"}'

token=


$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    "email" = "cp@gmail.com"
    "password" = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/api/v1/auth/sign-in -Method POST -Headers $headers -Body $body
$token = ($response.Content | ConvertFrom-Json).data.token

Write-Output "JWT Token: $token"


curl -X POST http://localhost:3000/api/v1/auth/sign-up \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "cp@gmail.com", "password": "password123"}'


## data


PS F:\MyApis> Write-Output "Response: $($content | ConvertTo-Json -Depth 10)"
Response: {
    "message":  "User created successfully",
    "success":  true,
    "data":  {
                 "token":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QyZTg2ZTgxZGNjNmI5YjJhZmFhNzgiLCJpYXQiOjE3NDE4NzUzMTAsImV4cCI6MTc0MTk2MTcxMH0.A3tDhR7LMvJxLpkHLybc22RK1bQSvPwqUK_oWrUAcZE",
                 "user":  {
                              "name":  "John Doe",
                              "email":  "cp@gmail.com",
                              "password":  "$2b$10$ELR3v7Lgt0Th20iQ35aed.RiTGFdE880OjzLMF2iurAU4YzYGuxfa",
                              "_id":  "67d2e86e81dcc6b9b2afaa78",
                              "createdAt":  "2025-03-13T14:15:10.335Z",       
                              "updatedAt":  "2025-03-13T14:15:10.335Z",       
                              "__v":  0
                          }
             }
}
PS F:\MyApis> 



{
  "name": "Javascript Mastery Elite Membership",
  "price": 139.00,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "startDate": "2025-01-20T00:00:00.000Z",
  "paymentMethod": "upi"
}










{"success":true,"data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QzYzRiODhlMTFjZmQwZGY0NjMzOTgiLCJpYXQiOjE3NDE5MzIzOTQsImV4cCI6MTc0MjAxODc5NH0.jJY5g6Jev1eihnFLuhVrpfuf-2DA2BRxdpjCu3w2ZMU","user":{"_id":"67d3c4b88e11cfd0df463398","name":"John Doe","email":"cpjjasasd@gmail.com","createdAt":"2025-03-14T05:55:04.819Z","updatedAt":"2025-03-14T05:55:04.819Z"}}}









# Set the JWT token
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QzYzRiODhlMTFjZmQwZGY0NjMzOTgiLCJpYXQiOjE3NDE5MzIzOTQsImV4cCI6MTc0MjAxODc5NH0.jJY5g6Jev1eihnFLuhVrpfuf-2DA2BRxdpjCu3w2ZMU"

# Set headers
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

# Create a subscription
$body = @{
    "name" = "Gamdy Mastery Elite Membership"
    "price" = 139.00
    "currency" = "USD"
    "frequency" = "monthly"
    "category" = "entertainment"
    "startDate" = "2025-01-20T00:00:00.000Z"
    "paymentMethod" = "upi"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/api/v1/subscriptions -Method POST -Headers $headers -Body $body
$content = $response.Content | ConvertFrom-Json

Write-Output "Response: $($content | ConvertTo-Json -Depth 10)"










# Set the JWT token
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QzYzRiODhlMTFjZmQwZGY0NjMzOTgiLCJpYXQiOjE3NDE5MzIzOTQsImV4cCI6MTc0MjAxODc5NH0.jJY5g6Jev1eihnFLuhVrpfuf-2DA2BRxdpjCu3w2ZMU"

# Set headers
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

# Create a subscription
$body = @{
    "name" = "Gamdy Mastery Elite Membership"
    "price" = 139.00
    "currency" = "USD"
    "frequency" = "monthly"
    "category" = "entertainment"
    "startDate" = "2025-01-20T00:00:00.000Z"
    "paymentMethod" = "upi"
} | ConvertTo-Json

Write-Output "Sending request to create subscription..."

$response = Invoke-WebRequest -Uri http://localhost:3000/api/v1/subscriptions -Method POST -Headers $headers -Body $body

Write-Output "Request sent. Processing response..."

if ($response.StatusCode -eq 201) {
    $content = $response.Content | ConvertFrom-Json
    Write-Output "Response: $($content | ConvertTo-Json -Depth 10)"
} else {
    Write-Output "Failed to create subscription. Status code: $($response.StatusCode)"
    Write-Output "Response body: $($response.Content)"
}