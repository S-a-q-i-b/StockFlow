const express = require("express");
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/auth.controller");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  async (req, res, next) => {
    try {
      const update = {};
      if (req.body.name?.trim()) update.name = req.body.name.trim();
      if (req.body.email?.trim())
        update.email = req.body.email.trim().toLowerCase();
      if (req.file) update.profileImage = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(req.user._id, update, {
        new: true,
        runValidators: true,
      });
      res.json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete("/profile/image", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (user.profileImage?.startsWith("/uploads/")) {
      const filePath = path.join(
        process.cwd(),
        user.profileImage.replace(/^\//, ""),
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    user.profileImage = "";
    await user.save();
    res.json({
      success: true,
      message: "Profile picture removed.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        profileImage: "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({
        success: false,
        message: "Current and new password are required.",
      });
    if (newPassword.length < 6)
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    const user = await User.findById(req.user._id).select("+password");
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect." });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
