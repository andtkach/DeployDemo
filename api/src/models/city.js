const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    created_at: Date,
    updated_at: { type: Date, default: null },
  },
  { collection: "cities" }
);

module.exports = mongoose.model("City", citySchema);
