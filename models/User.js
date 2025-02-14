const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const encryptPassword = require("../middlewares/encryptPasword");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  img: { type: String },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
  state: { type: Boolean, default: true },
  google: { type: Boolean, default: false },
});

UserSchema.pre("save", encryptPassword);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = mongoose.model("User", UserSchema);
