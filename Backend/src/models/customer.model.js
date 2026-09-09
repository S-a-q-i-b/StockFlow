const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    address: { type: String, trim: true, maxlength: 250, default: "" },
    city: { type: String, trim: true, maxlength: 80, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", customerSchema);
