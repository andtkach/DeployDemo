param(
  [string]$ApiUrl = "http://localhost:3031",
  [int]$Requests = 40
)

$counts = @{}

for ($i = 1; $i -le $Requests; $i++) {
  $json = curl.exe -s -H "Connection: close" "$ApiUrl/" | ConvertFrom-Json
  $version  = $json.version
  $server   = $json.servername

  if (-not $counts.ContainsKey($version)) { $counts[$version] = 0 }
  $counts[$version]++

  $line = "[{0,3}/{1}] version={2}  server={3}" -f $i, $Requests, $version, $server

  switch ($version) {
    "v2" { Write-Host $line -ForegroundColor Cyan   }
    "v3" { Write-Host $line -ForegroundColor Yellow }
    default { Write-Host $line }
  }
}

Write-Host ""
Write-Host "--- Summary ($Requests requests) ---" -ForegroundColor White
foreach ($ver in ($counts.Keys | Sort-Object)) {
  $count = $counts[$ver]
  $pct   = [math]::Round(($count / $Requests) * 100, 1)
  $bar   = "#" * [math]::Round($pct / 2)
  $color = switch ($ver) { "v2" { "Cyan" } "v3" { "Yellow" } default { "White" } }
  Write-Host ("{0}  {1,3} hits  {2,5}%  {3}" -f $ver, $count, $pct, $bar) -ForegroundColor $color
}
