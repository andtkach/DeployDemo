const mongoose = require("mongoose");
const os = require("os");
const path = require("path");

const City = require("./models/city");

const packageJsonPath = path.join(__dirname, "..", "package.json");
const { version } = require(packageJsonPath);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => Math.floor(Math.random() * 999);

const main = async () => {
  const timestamp = new Date().toISOString();
  const hostname = os.hostname();
  console.log(`proc: datetime=${timestamp} server=${hostname} version=${version}`);
  await wait(randomDelay());
  
  const {
    MONGO_HOST = "localhost",
    MONGO_PORT = "27027",
    MONGO_DB = "depdemo-db",
    MONGO_USER = "admin",
    MONGO_PASSWORD = "password",
    MONGO_URI,
  } = process.env;

  const mongoUri =
    MONGO_URI ??
    `mongodb://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(
      MONGO_PASSWORD
    )}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

  await mongoose.connect(mongoUri);
  await wait(randomDelay());
  const cities = await City.find({ updated_at: null })
    .sort({ created_at: 1 })
    .limit(3);

  if (cities.length === 0) {
    console.log("proc: no cities to modify");
    return;
  }

  await wait(randomDelay());

  const updatedAt = new Date();

  for (const city of cities) {
    city.name = city.name.toUpperCase();
    city.updated_at = updatedAt;
    await city.save();
    await wait(randomDelay());
    console.log(`proc: updated city ${city.name}`);
    await wait(randomDelay());
  }

  await wait(randomDelay());
  console.log('proc: exit');
};

main().catch((error) => {
  console.error("proc app failed:", error);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
