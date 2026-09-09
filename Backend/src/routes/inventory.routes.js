const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product.model");
const InventoryMovement = require("../models/inventoryMovement.model");
const logActivity = require("../utils/activity");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(protect, authorize("Admin", "Staff"));

const normalizeStatus = (product) => {
  product.status =
    product.stock === 0
      ? "Out of Stock"
      : product.stock <= product.minimumStock
        ? "Low Stock"
        : "In Stock";
};

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all");
    const filter = {};
    if (search)
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    if (status === "out") filter.stock = 0;
    if (status === "low")
      filter.$expr = {
        $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$minimumStock"] }],
      };
    if (status === "in") filter.$expr = { $gt: ["$stock", "$minimumStock"] };

    const [data, total, summaryAgg] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort({ stock: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalStock: { $sum: "$stock" },
            stockValue: { $sum: { $multiply: ["$stock", "$purchasePrice"] } },
          },
        },
      ]),
    ]);

    const [lowStock, outOfStock] = await Promise.all([
      Product.countDocuments({
        stock: { $gt: 0 },
        $expr: { $lte: ["$stock", "$minimumStock"] },
      }),
      Product.countDocuments({ stock: 0 }),
    ]);

    const summary = {
      ...(summaryAgg[0] || { totalProducts: 0, totalStock: 0, stockValue: 0 }),
      lowStock,
      outOfStock,
    };
    res.json({
      success: true,
      data,
      summary,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

const changeStock = async (req, res, next, direction) => {
  try {
    const {
      product,
      quantity,
      reason = direction === "IN" ? "Stock received" : "Manual stock out",
    } = req.body;
    const qty = Number(quantity);
    if (!mongoose.isValidObjectId(product) || !Number.isInteger(qty) || qty < 1)
      return res.status(400).json({
        success: false,
        message: "Product and a positive integer quantity are required.",
      });

    const updated =
      direction === "IN"
        ? await Product.findByIdAndUpdate(
            product,
            { $inc: { stock: qty } },
            { new: true },
          )
        : await Product.findOneAndUpdate(
            { _id: product, stock: { $gte: qty } },
            { $inc: { stock: -qty } },
            { new: true },
          );

    if (!updated)
      return res.status(400).json({
        success: false,
        message:
          direction === "OUT"
            ? "Insufficient stock or product not found."
            : "Product not found.",
      });
    normalizeStatus(updated);
    await updated.save();

    await InventoryMovement.create({
      product,
      type: direction,
      quantity: qty,
      reason,
      user: req.user._id,
    });
    await logActivity({
      action: direction === "IN" ? "Stock increased" : "Stock decreased",
      entityType: "Product",
      entityId: product,
      userId: req.user._id,
      metadata: { quantity: qty, reason },
    });
    res.json({
      success: true,
      message:
        direction === "IN"
          ? "Stock added successfully."
          : "Stock removed successfully.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

router.post("/stock-in", (req, res, next) => changeStock(req, res, next, "IN"));
router.post("/stock-out", (req, res, next) =>
  changeStock(req, res, next, "OUT"),
);

router.get("/movements", async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
    const filter = {};
    if (["IN", "OUT"].includes(req.query.type)) filter.type = req.query.type;
    const [data, total] = await Promise.all([
      InventoryMovement.find(filter)
        .populate("product", "name sku")
        .populate("user", "name role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      InventoryMovement.countDocuments(filter),
    ]);
    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
