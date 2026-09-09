const { body } = require("express-validator");

const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters."),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("Product SKU is required.")
    .isLength({ max: 50 })
    .withMessage("Product SKU cannot exceed 50 characters."),

  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category ID."),

  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("purchasePrice")
    .notEmpty()
    .withMessage("Purchase price is required.")
    .isFloat({ min: 0 })
    .withMessage("Purchase price must be a valid non-negative number."),

  body("sellingPrice")
    .notEmpty()
    .withMessage("Selling price is required.")
    .isFloat({ min: 0 })
    .withMessage("Selling price must be a valid non-negative number."),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative whole number."),

  body("minimumStock")
    .notEmpty()
    .withMessage("Minimum stock is required.")
    .isInt({ min: 0 })
    .withMessage("Minimum stock must be a non-negative whole number."),
];

const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters."),

  body("sku")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Product SKU cannot exceed 50 characters."),

  body("category").optional().isMongoId().withMessage("Invalid category ID."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  body("purchasePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Purchase price must be a valid non-negative number."),

  body("sellingPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Selling price must be a valid non-negative number."),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative whole number."),

  body("minimumStock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum stock must be a non-negative whole number."),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
};
