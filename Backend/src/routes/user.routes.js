const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const { protect, authorize } = require("../middleware/auth.middleware");
const logActivity = require("../utils/activity");

const router = express.Router();
router.use(protect, authorize("Admin"));

const selectUser = "-password";
router.get("/", async (req, res, next) => {
  try {
    const {
      search = "",
      role = "all",
      status = "all",
      page = 1,
      limit = 10,
    } = req.query;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const filter = {};
    if (search.trim())
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    if (role !== "all") filter.role = role;
    if (status === "active") filter.isActive = true;
    if (status === "disabled") filter.isActive = false;
    const total = await User.countDocuments(filter);
    const data = await User.find(filter)
      .select(selectUser)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit);
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

router.post("/", async (req, res, next) => {
  try {
    const { name, email, password, role = "Staff" } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    if (!["Admin", "Staff"].includes(role))
      return res.status(400).json({ success: false, message: "Invalid role." });
    if (password.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Email already exists." });
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 12),
      role,
    });
    await logActivity({
      action: "User created",
      entityType: "User",
      entityId: user._id,
      userId: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user.toObject({
        transform: (_doc, ret) => {
          delete ret.password;
          return ret;
        },
      }),
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID." });
    if (String(req.user._id) === req.params.id && req.body.isActive === false)
      return res.status(400).json({
        success: false,
        message: "You cannot disable your own account.",
      });
    const update = { ...req.body };
    if (update.email) update.email = update.email.toLowerCase();
    if (update.password)
      update.password = await bcrypt.hash(update.password, 12);
    else delete update.password;
    if (update.role && !["Admin", "Staff"].includes(update.role))
      return res.status(400).json({ success: false, message: "Invalid role." });
    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select(selectUser);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    await logActivity({
      action: "User updated",
      entityType: "User",
      entityId: user._id,
      userId: req.user._id,
    });
    res.json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID." });
    if (req.params.id === String(req.user._id))
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    await logActivity({
      action: "User deleted",
      entityType: "User",
      entityId: user._id,
      userId: req.user._id,
    });
    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
