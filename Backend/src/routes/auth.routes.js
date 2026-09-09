const express = require("express");
const bcrypt = require("bcryptjs");

const {
  register,
  login,
  logout,
  me,
} = require("../controllers/auth.controller");

const User = require("../models/user.model");
const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");
const imagekit = require("../config/imagekit");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);

/* ---------------- PROFILE UPDATE ---------------- */

router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  async (req, res, next) => {
    try {
      const update = {};

      if (req.body.name?.trim()) {
        update.name = req.body.name.trim();
      }

      if (req.body.email?.trim()) {
        update.email = req.body.email.trim().toLowerCase();
      }

      /*
       * PROFILE IMAGE UPLOAD
       */
      if (req.file) {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `profile-${req.user._id}-${Date.now()}`,
          folder: "/stockflow/profiles",
          useUniqueFileName: true,
        });

        update.profileImage = uploadResponse.url;
        update.profileImageId = uploadResponse.fileId;
      }

      const user = await User.findByIdAndUpdate(req.user._id, update, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.json({
        success: true,
        message: req.file
          ? "Profile picture uploaded successfully."
          : "Profile updated successfully.",
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

/* ---------------- REMOVE PROFILE IMAGE ---------------- */

router.delete("/profile/image", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /*
     * Delete image from ImageKit
     */
    if (user.profileImageId) {
      try {
        await imagekit.deleteFile(user.profileImageId);
      } catch (imageError) {
        console.error("ImageKit delete failed:", imageError.message);
      }
    }

    user.profileImage = "";
    user.profileImageId = "";

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

/* ---------------- CHANGE PASSWORD ---------------- */

router.put("/password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
