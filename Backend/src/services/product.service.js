const Product = require("../models/product.model");
const Category = require("../models/category.model");

const getProductStatus = (stock, minimumStock) => {
  if (stock === 0) {
    return "Out of Stock";
  }

  if (stock <= minimumStock) {
    return "Low Stock";
  }

  return "In Stock";
};

const parseNumber = (value, fieldName, { integer = false } = {}) => {
  if (value === undefined || value === null || value === "") {
    const error = new Error(`${fieldName} is required.`);
    error.statusCode = 400;
    throw error;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    const error = new Error(`${fieldName} must be a valid number.`);
    error.statusCode = 400;
    throw error;
  }

  if (number < 0) {
    const error = new Error(`${fieldName} cannot be negative.`);
    error.statusCode = 400;
    throw error;
  }

  if (integer && !Number.isInteger(number)) {
    const error = new Error(`${fieldName} must be a whole number.`);
    error.statusCode = 400;
    throw error;
  }

  return number;
};

const createProduct = async (data) => {
  const {
    name,
    sku,
    category,
    description = "",
    purchasePrice,
    sellingPrice,
    stock,
    minimumStock,
    image = "",
  } = data;

  if (!name || !name.trim()) {
    const error = new Error("Product name is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!sku || !sku.trim()) {
    const error = new Error("Product SKU is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!category) {
    const error = new Error("Category is required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedName = name.trim();
  const normalizedSku = sku.trim().toUpperCase();
  const normalizedDescription = description?.trim() || "";

  const normalizedPurchasePrice = parseNumber(purchasePrice, "Purchase price");

  const normalizedSellingPrice = parseNumber(sellingPrice, "Selling price");

  const normalizedStock = parseNumber(stock, "Stock", {
    integer: true,
  });

  const normalizedMinimumStock = parseNumber(minimumStock, "Minimum stock", {
    integer: true,
  });

  const categoryExists = await Category.findById(category);

  if (!categoryExists) {
    const error = new Error("Selected category does not exist.");
    error.statusCode = 404;
    throw error;
  }

  const existingProduct = await Product.findOne({
    sku: normalizedSku,
  });

  if (existingProduct) {
    const error = new Error("A product with this SKU already exists.");

    error.statusCode = 409;
    throw error;
  }

  const product = await Product.create({
    name: normalizedName,
    sku: normalizedSku,
    category,
    description: normalizedDescription,
    purchasePrice: normalizedPurchasePrice,
    sellingPrice: normalizedSellingPrice,
    stock: normalizedStock,
    minimumStock: normalizedMinimumStock,
    image: image || "",
    status: getProductStatus(normalizedStock, normalizedMinimumStock),
  });

  return product;
};

const updateProduct = async (productId, data) => {
  const currentProduct = await Product.findById(productId);

  if (!currentProduct) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};

  if (data.name !== undefined) {
    const name = String(data.name).trim();

    if (!name) {
      const error = new Error("Product name cannot be empty.");
      error.statusCode = 400;
      throw error;
    }

    updateData.name = name;
  }

  if (data.sku !== undefined) {
    const sku = String(data.sku).trim().toUpperCase();

    if (!sku) {
      const error = new Error("Product SKU cannot be empty.");
      error.statusCode = 400;
      throw error;
    }

    const existingProduct = await Product.findOne({
      sku,
      _id: { $ne: currentProduct._id },
    });

    if (existingProduct) {
      const error = new Error("A product with this SKU already exists.");

      error.statusCode = 409;
      throw error;
    }

    updateData.sku = sku;
  }

  if (data.category !== undefined) {
    const categoryExists = await Category.findById(data.category);

    if (!categoryExists) {
      const error = new Error("Selected category does not exist.");

      error.statusCode = 404;
      throw error;
    }

    updateData.category = data.category;
  }

  if (data.description !== undefined) {
    updateData.description = String(data.description).trim();
  }

  if (data.purchasePrice !== undefined) {
    updateData.purchasePrice = parseNumber(
      data.purchasePrice,
      "Purchase price",
    );
  }

  if (data.sellingPrice !== undefined) {
    updateData.sellingPrice = parseNumber(data.sellingPrice, "Selling price");
  }

  if (data.stock !== undefined) {
    updateData.stock = parseNumber(data.stock, "Stock", {
      integer: true,
    });
  }

  if (data.minimumStock !== undefined) {
    updateData.minimumStock = parseNumber(data.minimumStock, "Minimum stock", {
      integer: true,
    });
  }

  if (data.image !== undefined) {
    updateData.image = data.image;
  }

  const nextStock =
    updateData.stock !== undefined ? updateData.stock : currentProduct.stock;

  const nextMinimumStock =
    updateData.minimumStock !== undefined
      ? updateData.minimumStock
      : currentProduct.minimumStock;

  updateData.status = getProductStatus(nextStock, nextMinimumStock);

  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  }).populate("category", "name image");

  return product;
};

const getProducts = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(50, Math.max(Number(limit) || 10, 1));

  const skip = (safePage - 1) * safeLimit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name image")
      .sort(sort)
      .skip(skip)
      .limit(safeLimit),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate(
    "category",
    "name image",
  );

  if (!product) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const deleteProduct = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }

  await Product.findByIdAndDelete(productId);

  return product;
};

module.exports = {
  getProductStatus,
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
};
