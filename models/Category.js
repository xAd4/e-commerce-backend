const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("Category", CategorySchema);
//*
