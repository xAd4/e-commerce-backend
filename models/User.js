const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  img: { type: String },
  role: { enum: ["admin", "user"], required: true, default: "user" },
  state: { type: Boolean, required: true, default: true },
  google: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
//*
