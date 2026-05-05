const City = require("../models/city");

const getCities = async (req, res, next) => {
  try {
    const rawLimit = Array.isArray(req.query.num) ? req.query.num[0] : req.query.num;
    const parsedLimit = rawLimit ? Number.parseInt(rawLimit, 10) : 10;
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

    const cities = await City.find()
      .sort({ created_at: -1 })
      .limit(limit)
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
  getCities,
  createCity,
};
