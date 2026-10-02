$ErrorActionPreference = 'Stop'
$crmRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $crmRoot
$crmData = Join-Path $crmRoot '.local-crm/mongo'
New-Item -ItemType Directory -Force -Path $crmData | Out-Null
$crmMongo = 'C:/Program Files/MongoDB/Server/8.0/bin/mongod.exe'
if (-not (Test-Path -LiteralPath $crmMongo)) { throw 'MongoDB 8.0 is required for the local demo.' }
$crmListener = Test-NetConnection -ComputerName 127.0.0.1 -Port 27018 -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $crmListener) {
  $crmLog = Join-Path $crmRoot '.local-crm/mongo.log'
  Start-Process -FilePath $crmMongo -ArgumentList @('--dbpath', ('"' + $crmData + '"'), '--replSet', 'crmDemo', '--bind_ip', '127.0.0.1', '--port', '27018', '--logpath', ('"' + $crmLog + '"'), '--logappend') -WindowStyle Hidden
}
& node scripts/prepare-crm-demo.mjs
if ($LASTEXITCODE -ne 0) { throw 'Demo preparation failed.' }
& node node_modules/tsx/dist/cli.mjs scripts/seed-crm-demo.ts
if ($LASTEXITCODE -ne 0) { throw 'Practice record setup failed.' }
$env:DATABASE_URI = 'mongodb://127.0.0.1:27018/ypaa_crm_demo?replicaSet=crmDemo'
$env:CRM_DEMO_MODE = 'true'
$env:CRM_DEMO_ISOLATED = 'true'
$env:CRM_IMPORT_THROUGH = (Get-Content -LiteralPath '.local-crm/snapshot.json' -Raw | ConvertFrom-Json).latestPaymentDate
& node node_modules/next/dist/bin/next dev --hostname 127.0.0.1
