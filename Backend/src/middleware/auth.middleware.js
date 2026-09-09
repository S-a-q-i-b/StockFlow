const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const getToken = (req) =>
  req.cookies?.token ||
  (req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null);

const protect = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "User account is unavailable." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };

module.exports = { protect, authorize };
