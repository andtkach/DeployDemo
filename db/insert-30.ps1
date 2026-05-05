$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

$eval = @"
const database = db.getSiblingDB('depdemo-db');
const names = [
  'Athens', 'Brno', 'Cairo', 'Dublin', 'Edinburgh', 'Florence', 'Geneva',
  'Hamburg', 'Istanbul', 'Jakarta', 'Kyoto', 'Lima', 'Manila', 'Naples',
  'Oslo', 'Prague', 'Quebec', 'Rome', 'Seoul', 'Tokyo', 'Uppsala', 'Vienna',
  'Warsaw', 'Xian', 'Yokohama', 'Zurich', 'Tallinn', 'Riga', 'Vilnius', 'Bern'
];

const now = new Date();
const documents = Array.from({ length: 30 }, (_, index) => ({
  id: now.valueOf() + index,
  name: names[Math.floor(Math.random() * names.length)],
  created_at: new Date(),
  updated_at: null
}));

database.cities.insertMany(documents);
"@

podman exec depdemo-mongodb mongosh `
  --username admin `
  --password password `
  --authenticationDatabase admin `
  --quiet `
  --eval $eval
