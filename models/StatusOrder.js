const { mongoose } = require("mongoose");

const StatusOrderSchema = new mongoose.Schema({
  status: { type: String, required: true },
});

module.exports = mongoose.model("Status", StatusOrderSchema);
