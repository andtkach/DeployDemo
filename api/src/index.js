const express = require("express");
const mongoose = require("mongoose");
const os = require("os");
const path = require("path");

const cityRoutes = require("./routes/cityRoutes");

const packageJsonPath = path.join(__dirname, "..", "package.json");
const { version } = require(packageJsonPath);

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    servername: os.hostname(),
    version,
    datetime: new Date().toISOString(),
  });
});

app.use("/cities", cityRoutes);

app.use((err, req, res, next) => {
  console.error("api error:", err);
  res.status(500).json({ error: "internal server error" });
});

const start = async () => {
  const {
    MONGO_HOST = "localhost",
    MONGO_PORT = "27027",
    MONGO_DB = "depdemo-db",
    MONGO_USER = "admin",
    MONGO_PASSWORD = "password",
    MONGO_URI,
    PORT = "3031",
  } = process.env;

  const mongoUri =
    MONGO_URI ??
    `mongodb://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(
      MONGO_PASSWORD
    )}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

  await mongoose.connect(mongoUri);

  app.listen(Number(PORT), () => {
    console.log(`api: listening on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("api failed to start:", error);
  process.exitCode = 1;
});
