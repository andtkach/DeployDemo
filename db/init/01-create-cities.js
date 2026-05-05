const database = db.getSiblingDB("depdemo-db");

database.createCollection("cities");

database.cities.insertMany([
  { id: 1, name: "Alicante", created_at: new Date(), updated_at: null },
  { id: 2, name: "Valencia", created_at: new Date(), updated_at: null },
  { id: 3, name: "Madrid", created_at: new Date(), updated_at: null },
]);
