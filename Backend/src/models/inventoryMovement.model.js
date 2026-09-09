const mongoose = require("mongoose");

const inventoryMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: { type: String, enum: ["IN", "OUT"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "Manual adjustment",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("InventoryMovement", inventoryMovementSchema);
