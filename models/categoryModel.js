const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [
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
  description: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", categorySchema);
