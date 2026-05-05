$ErrorActionPreference = "Stop"

$body = @{
  name = "London"
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post -Uri "http://localhost:3031/cities" -ContentType "application/json" -Body $body
$response | ConvertTo-Json -Depth 5
