const express = require("express");

const { createCity, getCities } = require("../controllers/cityController");

const router = express.Router();

router.get("/", getCities);
router.post("/", createCity);

module.exports = router;
