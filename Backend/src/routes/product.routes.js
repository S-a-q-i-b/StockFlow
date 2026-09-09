const express = require("express");

const { protect, authorize } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  createProductValidator,
  updateProductValidator,
} = require("../validators/product.validator");

const validate = require("../middleware/validation.middleware");

const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", protect, listProducts);

router.post(
  "/",
  protect,
  authorize("Admin", "Staff"),
  upload.single("image"),
  createProductValidator,
  validate,
  createProduct,
);

router.get("/:id", protect, getProduct);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Staff"),
  upload.single("image"),
  updateProductValidator,
  validate,
  updateProduct,
);

router.delete("/:id", protect, authorize("Admin"), deleteProduct);

module.exports = router;
