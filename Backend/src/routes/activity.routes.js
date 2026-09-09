const express = require("express");
const Activity = require("../models/activity.model");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(protect, authorize("Admin"));

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
    const [data, total] = await Promise.all([
      Activity.find()
        .populate("user", "name email role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Activity.countDocuments(),
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
