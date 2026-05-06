const express = require("express");

const {
  createCity,
  deleteCity,
  getCities,
  getCityById,
  updateCity,
} = require("../controllers/cityController");

const router = express.Router();

router.get("/", getCities);
router.get("/:id", getCityById);
router.post("/", createCity);
router.put("/:id", updateCity);
router.delete("/:id", deleteCity);

module.exports = router;
