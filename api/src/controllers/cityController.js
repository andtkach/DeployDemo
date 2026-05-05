const City = require("../models/city");

const getLatestCities = async (req, res, next) => {
  try {
    const cities = await City.find()
      .sort({ created_at: -1 })
      .limit(10)
      .lean();

    res.json(cities);
  } catch (error) {
    next(error);
  }
};

const createCity = async (req, res, next) => {
  try {
    const { name } = req.body ?? {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }

    const now = new Date();
    const city = await City.create({
      id: now.valueOf(),
      name: name.trim(),
      created_at: now,
      updated_at: null,
    });

    res.status(201).json(city);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLatestCities,
  createCity,
};
