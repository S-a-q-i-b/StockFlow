const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const InventoryMovement = require("../models/inventoryMovement.model");
const Sale = require("../models/sale.model");
const logActivity = require("../utils/activity");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(protect, authorize("Admin", "Staff"));

const nextOrderNumber = () => {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900);
  return `ORD-${stamp}-${random}`;
};

const parseLimit = (value, fallback = 10, max = 100) =>
  Math.min(Math.max(Number(value) || fallback, 1), max);

const buildDateFilter = (from, to) => {
  const filter = {};
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  return filter;
};

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = parseLimit(req.query.limit);
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all");
    const dateFilter = buildDateFilter(req.query.from, req.query.to);

    const filter = {
      ...(status !== "all" ? { status } : {}),
      ...dateFilter,
    };

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
      ];
    }

    // $or above cannot match populated fields, so use an aggregate-safe fallback for search.
    if (search) {
      const matchingCustomers = await Customer.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        {
          customer: { $in: matchingCustomers.map((customer) => customer._id) },
        },
      ];
    }

    const [data, total] = await Promise.all([
      Order.find(filter)
        .populate("customer", "name email phone")
        .populate("createdBy", "name role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter),
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

router.post("/", async (req, res, next) => {
  try {
    const {
      customer,
      items,
      discount = 0,
      paymentMethod,
      status: requestedStatus = "Completed",
    } = req.body;

    if (!mongoose.isValidObjectId(customer)) {
      return res
        .status(400)
        .json({ success: false, message: "A valid customer is required." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one product is required." });
    }
    if (!["Cash", "Card", "Bank Transfer"].includes(paymentMethod)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment method." });
    }
    if (!["Pending", "Completed"].includes(requestedStatus)) {
      return res.status(400).json({
        success: false,
        message: "New sales can only be Pending or Completed.",
      });
    }

    const customerDoc = await Customer.findById(customer);
    if (!customerDoc)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });

    const normalized = [];
    let subtotal = 0;

    for (const item of items) {
      if (!mongoose.isValidObjectId(item.product)) {
        return res.status(400).json({
          success: false,
          message: "One or more product IDs are invalid.",
        });
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive whole number.",
        });
      }
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({
          success: false,
          message: "One of the selected products was not found.",
        });
      if (requestedStatus === "Completed" && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}.`,
        });
      }
      const lineTotal = Number(product.sellingPrice) * quantity;
      subtotal += lineTotal;
      normalized.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity,
        purchasePrice: Number(product.purchasePrice),
        sellingPrice: Number(product.sellingPrice),
        lineTotal,
      });
    }

    const safeDiscount = Number(discount);
    if (
      !Number.isFinite(safeDiscount) ||
      safeDiscount < 0 ||
      safeDiscount > subtotal
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount must be a valid amount between 0 and subtotal.",
      });
    }

    const total = subtotal - safeDiscount;
    const orderNumber = nextOrderNumber();
    const order = await Order.create({
      orderNumber,
      customer,
      items: normalized,
      subtotal,
      discount: safeDiscount,
      total,
      paymentMethod,
      status: requestedStatus,
      createdBy: req.user._id,
    });

    const changedProducts = [];
    const createdMovements = [];

    try {
      if (requestedStatus === "Completed") {
        for (const item of normalized) {
          const product = await Product.findOneAndUpdate(
            { _id: item.product, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { new: true },
          );

          if (!product)
            throw Object.assign(
              new Error(`Insufficient stock for ${item.name}.`),
              { statusCode: 400 },
            );

          product.status =
            product.stock === 0
              ? "Out of Stock"
              : product.stock <= product.minimumStock
                ? "Low Stock"
                : "In Stock";
          await product.save();
          changedProducts.push(item);

          const movement = await InventoryMovement.create({
            product: item.product,
            type: "OUT",
            quantity: item.quantity,
            reason: `Sale ${orderNumber}`,
            user: req.user._id,
          });
          createdMovements.push(movement);
        }
      }
    } catch (error) {
      for (const item of changedProducts) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
      if (createdMovements.length)
        await InventoryMovement.deleteMany({
          _id: { $in: createdMovements.map((m) => m._id) },
        });
      await Order.findByIdAndDelete(order._id);
      throw error;
    }

    if (requestedStatus === "Completed") {
      await Sale.create({
        order: order._id,
        customer,
        amount: total,
        paymentMethod,
        soldBy: req.user._id,
      });
    }

    await logActivity({
      action:
        requestedStatus === "Completed" ? "Sale completed" : "Order created",
      entityType: "Order",
      entityId: order._id,
      userId: req.user._id,
      metadata: { total, orderNumber },
    });

    const data = await Order.findById(order._id)
      .populate("customer", "name email phone address city")
      .populate("createdBy", "name email role")
      .populate("items.product", "name sku image");

    return res
      .status(201)
      .json({ success: true, message: "Sale created successfully.", data });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID." });
    const data = await Order.findById(req.params.id)
      .populate("customer")
      .populate("createdBy", "name email role")
      .populate("items.product", "name sku image");
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authorize("Admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID." });
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    const nextStatus = req.body.status;
    if (!["Pending", "Completed", "Cancelled"].includes(nextStatus))
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status." });
    if (order.status === nextStatus)
      return res.json({ success: true, data: order });

    if (order.status === "Completed" && nextStatus === "Cancelled") {
      for (const item of order.items) {
        const product = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { new: true },
        );
        if (product) {
          product.status =
            product.stock === 0
              ? "Out of Stock"
              : product.stock <= product.minimumStock
                ? "Low Stock"
                : "In Stock";
          await product.save();
          await InventoryMovement.create({
            product: item.product,
            type: "IN",
            quantity: item.quantity,
            reason: `Order ${order.orderNumber} cancelled`,
            user: req.user._id,
          });
        }
      }
    }

    if (order.status === "Pending" && nextStatus === "Completed") {
      const changed = [];
      try {
        for (const item of order.items) {
          const product = await Product.findOneAndUpdate(
            { _id: item.product, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { new: true },
          );
          if (!product)
            throw Object.assign(
              new Error(`Insufficient stock for ${item.name}.`),
              { statusCode: 400 },
            );
          product.status =
            product.stock === 0
              ? "Out of Stock"
              : product.stock <= product.minimumStock
                ? "Low Stock"
                : "In Stock";
          await product.save();
          await InventoryMovement.create({
            product: item.product,
            type: "OUT",
            quantity: item.quantity,
            reason: `Order ${order.orderNumber} completed`,
            user: req.user._id,
          });
          changed.push(item);
        }
      } catch (error) {
        for (const item of changed) {
          const product = await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } },
            { new: true },
          );
          if (product) {
            product.status =
              product.stock === 0
                ? "Out of Stock"
                : product.stock <= product.minimumStock
                  ? "Low Stock"
                  : "In Stock";
            await product.save();
          }
        }
        await InventoryMovement.deleteMany({
          reason: `Order ${order.orderNumber} completed`,
          product: { $in: changed.map((item) => item.product) },
          user: req.user._id,
        });
        throw error;
      }
      await Sale.create({
        order: order._id,
        customer: order.customer,
        amount: order.total,
        paymentMethod: order.paymentMethod,
        soldBy: req.user._id,
      });
    }

    if (nextStatus === "Cancelled")
      await Sale.findOneAndUpdate(
        { order: order._id },
        { status: "Cancelled" },
      );

    order.status = nextStatus;
    await order.save();
    await logActivity({
      action: `Order ${nextStatus.toLowerCase()}`,
      entityType: "Order",
      entityId: order._id,
      userId: req.user._id,
    });
    res.json({ success: true, message: "Order status updated.", data: order });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authorize("Admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID." });
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    if (order.status === "Completed")
      return res.status(400).json({
        success: false,
        message:
          "Completed orders cannot be deleted. Cancel the order instead.",
      });
    await order.deleteOne();
    await logActivity({
      action: "Order deleted",
      entityType: "Order",
      entityId: order._id,
      userId: req.user._id,
    });
    res.json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
