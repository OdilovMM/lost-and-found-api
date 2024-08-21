const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pictureURL: {
    type: String,
    required: [true, "Iltimos, rasm yuklang"],
  },
  location: {
    type: String,
    required: [true, "Iltimos, joylashuvni kiriting"],
  },
  region: {
    type: String,
    enum: [
      "Toshkent",
      "Andijon",
      "Buxoro",
      "Jizzax",
      "Qarshi",
      "Nukus",
      "Namangan",
      "Samarkand",
      "Sirdaryo",
      "Surxondaryo",
      "Fargʻona",
      "Xorazm",
      "Xorazm",
    ],
    required: [true, "Iltimos, viloyatni kiriting"],
  },
  city: {
    type: String,
    enum: [
      "Toshkent",
      "Andijon",
      "Buxoro",
      "Jizzax",
      "Qarshi",
      "Nukus",
      "Namangan",
      "Samarkand",
      "Sirdaryo",
      "Surxondaryo",
      "Fargʻona",
      "Xorazm",
    ],
    required: [true, "Iltimos, shaharni kiriting"],
  },
  street: {
    type: String,
    required: [true, "Iltimos, kocha nomini kiriting"],
  },
  orientation: {
    type: String,
    required: [true, "Iltimos, oreintni kiriting"],
  },
  address: {
    type: String,
    required: [true, "Iltimos, joylashuvni kiriting"],
  },
  foundDate: {
    type: Date,
    required: [true, "Ilitmos, Topilgan sanani kiriting"],
  },
  contactNumber: {
    type: String,
    required: [true, "Ilimos, Aloqa uchun telefon kiriting"],
  },
  firstQuestion: {
    type: String,
    required: [true, "Ilimos, Birinchi savolni kiriting"],
  },
  secondQuestion: {
    type: String,
    required: [true, "Itlimos, ikkinchi savolni kiriting"],
  },
  status: {
    type: String,
    enum: ["open", "claimed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FoundItem", foundItemSchema);
