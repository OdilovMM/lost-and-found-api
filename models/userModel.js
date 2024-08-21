const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Iltimos, Ism kiriting"],
    unique: true,
    minLength: 3,
    maxLength: 15,
  },
  email: {
    type: String,
    required: [true, "Email kiritilishi kerak"],
    validate: {
      validator: validator.isEmail,
      message: "Togri email kiriting",
    },
    unique: true,
    minLength: 3,
    maxLength: 20,
  },
  mobile: {
    type: String,
    required: [true, "Telefon raqam majburiy"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "seller"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "blocked", "deleted"],
    default: "active",
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
