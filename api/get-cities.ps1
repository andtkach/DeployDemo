$ErrorActionPreference = "Stop"

$response = Invoke-RestMethod -Method Get -Uri "http://localhost:3031/cities"
$response | ConvertTo-Json -Depth 5
