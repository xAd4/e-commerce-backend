const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: Boolean, default: true },
});

module.exports = mongoose.model("Category", CategorySchema);
//*
