const express = require("express");

const { createCity, getLatestCities } = require("../controllers/cityController");

const router = express.Router();

router.get("/", getLatestCities);
router.post("/", createCity);

module.exports = router;
