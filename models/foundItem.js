const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foundItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"],
    },
    photo: {
      type: String,
      required: [true, "Iltimos, rasm yuklang"],
    },
    name: {
      type: String,
      required: [true, "Iltimos, topilgan buyum nomini kiriting"],
    },
    region: {
      type: String,
      enum: [
        "Hammasi",
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
      required: [true, "Iltimos, viloyatni kiriting"],
    },
    city: {
      type: String,
      enum: [
        "Hammasi",
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
    category: {
      type: String,
      enum: [
        "Hammasi",
        "Elektronikalar",
        "Kiyimlar",
        "Zargarlik-buyumlari",
        "Shaxsiy",
        "Hujatlar",
        "Kalitlar",
        "Sumkalar",
        "Sport",
        "Uy anjomlari",
        "Boshqalar",
      ],
      default: "Boshqalar",
      required: true,
    },
    street: {
      type: String,
      required: [true, "Iltimos, kocha nomini kiriting"],
    },
    orientation: {
      type: String,
      required: [true, "Iltimos, oreintni kiriting"],
    },

    foundDate: {
      type: Date,
      required: [true, "Ilitmos, Topilgan sanani kiriting"],
    },
    contactNumber: {
      type: String,
      required: [true, "Iltimos, aloqa uchun telefon kiriting"],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  }
);

foundItemSchema.index({ name: "text" });

foundItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});



module.exports = mongoose.model("Item", foundItemSchema);
