const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { signToken, cookieOptions } = require("../utils/jwt");

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const count = await User.countDocuments();
    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role:
        count === 0 ? "Admin" : role === "Admin" ? "Staff" : role || "Staff",
    });

    const token = signToken(user._id.toString());

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (
      !user ||
      !user.isActive ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = signToken(user._id.toString());

    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      message: "Login successful.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: "Logged out successfully.",
  });
};

const me = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
};
