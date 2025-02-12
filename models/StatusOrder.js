const { mongoose } = require("mongoose");

const StatusOrderSchema = new mongoose.Schema({
  role: { type: String, required: true },
});

module.exports = mongoose.model("Status", StatusOrderSchema);
