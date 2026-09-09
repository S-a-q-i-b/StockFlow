const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 80,
    },
    image: { type: String, default: "" },
    description: { type: String, trim: true, maxlength: 300, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
