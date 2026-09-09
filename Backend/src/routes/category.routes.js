const express = require("express");
const mongoose = require("mongoose");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const { protect, authorize } = require("../middleware/auth.middleware");
const logActivity = require("../utils/activity");
const upload = require("../middleware/upload.middleware");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 12, sort = "name" } = req.query;
    const filter = search
      ? { name: { $regex: search.trim(), $options: "i" } }
      : {};
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 12));
    const total = await Category.countDocuments(filter);
    const sortValue = sort === "date" ? { createdAt: -1 } : { name: 1 };
    const [categories, counts] = await Promise.all([
      Category.find(filter)
        .sort(sortValue)
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);
    const countMap = new Map(
      counts.map((item) => [String(item._id), item.count]),
    );
    const data = categories.map((category) => ({
      ...category.toObject(),
      productCount: countMap.get(String(category._id)) || 0,
    }));
    res.json({
      success: true,
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.max(1, Math.ceil(total / safeLimit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID." });
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    const productCount = await Product.countDocuments({
      category: category._id,
    });
    res.json({ success: true, data: { ...category.toObject(), productCount } });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authorize("Admin", "Staff"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { name, description = "" } = req.body;
      if (!name?.trim())
        return res
          .status(400)
          .json({ success: false, message: "Category name is required." });
      const exists = await Category.findOne({ name: name.trim() });
      if (exists)
        return res.status(409).json({
          success: false,
          message: "A category with this name already exists.",
        });
      const image = req.file ? `/uploads/${req.file.filename}` : "";
      const data = await Category.create({
        name: name.trim(),
        description,
        image,
      });
      await logActivity({
        action: "Category created",
        entityType: "Category",
        entityId: data._id,
        userId: req.user._id,
      });
      res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: { ...data.toObject(), productCount: 0 },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:id",
  authorize("Admin", "Staff"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id))
        return res
          .status(400)
          .json({ success: false, message: "Invalid category ID." });
      const current = await Category.findById(req.params.id);
      if (!current)
        return res
          .status(404)
          .json({ success: false, message: "Category not found." });
      if (
        req.body.name &&
        req.body.name.trim().toLowerCase() !== current.name.toLowerCase()
      ) {
        const exists = await Category.findOne({
          name: req.body.name.trim(),
          _id: { $ne: current._id },
        });
        if (exists)
          return res.status(409).json({
            success: false,
            message: "A category with this name already exists.",
          });
      }
      const update = {
        name: req.body.name?.trim(),
        description: req.body.description ?? current.description,
      };
      if (req.file) update.image = `/uploads/${req.file.filename}`;
      else if ("image" in req.body) update.image = req.body.image;
      const data = await Category.findByIdAndUpdate(current._id, update, {
        new: true,
        runValidators: true,
      });
      const productCount = await Product.countDocuments({ category: data._id });
      await logActivity({
        action: "Category updated",
        entityType: "Category",
        entityId: data._id,
        userId: req.user._id,
      });
      res.json({
        success: true,
        message: "Category updated successfully.",
        data: { ...data.toObject(), productCount },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete("/:id", authorize("Admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID." });
    const count = await Product.countDocuments({ category: req.params.id });
    if (count > 0)
      return res.status(409).json({
        success: false,
        message:
          "Category cannot be deleted while products are assigned to it.",
      });
    const data = await Category.findByIdAndDelete(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    await logActivity({
      action: "Category deleted",
      entityType: "Category",
      entityId: data._id,
      userId: req.user._id,
    });
    res.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
