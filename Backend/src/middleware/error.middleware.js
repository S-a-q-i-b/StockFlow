const notFound = (req, res) =>
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });

const errorHandler = (error, req, res, next) => {
  console.error(error);
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with the same unique value already exists.",
    });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }
  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid record ID." });
  }
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error.",
  });
};

module.exports = { notFound, errorHandler };
