const express = require("express");
const { protect, authorize } = require("../middleware/auth.middleware");
const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");
const logActivity = require("../utils/activity");

const router = express.Router();
router.use(protect, authorize("Admin", "Staff"));

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = String(req.query.search || "").trim();
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const [customers, total, stats] = await Promise.all([
      Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Customer.countDocuments(filter),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        {
          $group: {
            _id: "$customer",
            orders: { $sum: 1 },
            spent: { $sum: "$total" },
          },
        },
      ]),
    ]);
    const map = new Map(stats.map((s) => [String(s._id), s]));
    const data = customers.map((c) => {
      const s = map.get(String(c._id)) || {};
      return { ...c.toObject(), orders: s.orders || 0, spent: s.spent || 0 };
    });
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
  } catch (e) {
    next(e);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid customer ID." });
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    const orders = await Order.find({ customer: customer._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .select("orderNumber items total status paymentMethod createdAt");
    const active = orders.filter((o) => o.status !== "Cancelled");
    const spent = active.reduce((s, o) => s + o.total, 0);
    res.json({
      success: true,
      data: { ...customer.toObject(), orders, spent },
    });
  } catch (e) {
    next(e);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const item = await Customer.create(req.body);
    await logActivity({
      action: "Customer created",
      entityType: "Customer",
      entityId: item._id,
      userId: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      data: item,
    });
  } catch (e) {
    next(e);
  }
});
router.put("/:id", async (req, res, next) => {
  try {
    const item = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    await logActivity({
      action: "Customer updated",
      entityType: "Customer",
      entityId: item._id,
      userId: req.user._id,
    });
    res.json({
      success: true,
      message: "Customer updated successfully.",
      data: item,
    });
  } catch (e) {
    next(e);
  }
});
router.delete("/:id", authorize("Admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid customer ID." });
    const linked = await Order.exists({ customer: req.params.id });
    if (linked)
      return res.status(400).json({
        success: false,
        message: "Customers with order history cannot be deleted.",
      });
    const item = await Customer.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    await logActivity({
      action: "Customer deleted",
      entityType: "Customer",
      entityId: item._id,
      userId: req.user._id,
    });
    res.json({ success: true, message: "Customer deleted successfully." });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
