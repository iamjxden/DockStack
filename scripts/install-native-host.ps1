param(
  [Parameter(Mandatory = $true)][string]$Browser,
  [Parameter(Mandatory = $true)][string]$ExtensionId,
  [string]$BinaryPath = "$(Resolve-Path "$PSScriptRoot\..\target\release\native-core.exe")"
)

$hostName = "io.dockstack.core"

switch ($Browser.ToLower()) {
  "chrome" {
    $regPath = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$hostName"
  }
  "edge" {
    $regPath = "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\$hostName"
  }
  default {
    throw "Unsupported browser: $Browser"
  }
}

$manifestDir = Join-Path $env:LOCALAPPDATA "DockStack\NativeMessagingHosts"
New-Item -ItemType Directory -Force -Path $manifestDir | Out-Null
$manifestPath = Join-Path $manifestDir "$hostName.json"

$manifest = @{
  name = $hostName
  description = "DockStack native core"
  path = $BinaryPath
  type = "stdio"
  allowed_origins = @("chrome-extension://$ExtensionId/")
} | ConvertTo-Json -Depth 5

Set-Content -Path $manifestPath -Value $manifest -Encoding UTF8
New-Item -Path $regPath -Force | Out-Null
Set-ItemProperty -Path $regPath -Name '(default)' -Value $manifestPath

Write-Host "Installed native host manifest at $manifestPath"
