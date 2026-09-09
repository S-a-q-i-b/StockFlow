const mongoose = require("mongoose");
const InventoryMovement = require("../models/inventoryMovement.model");
const logActivity = require("../utils/activity");

const {
  createProduct: createProductService,
  updateProduct: updateProductService,
  getProducts: getProductsService,
  getProductById: getProductByIdService,
  deleteProduct: deleteProductService,
} = require("../services/product.service");

const listProducts = async (req, res, next) => {
  try {
    const {
      search = "",
      category = "all",
      stockStatus = "all",
      sort = "date",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          sku: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (category !== "all") {
      filter.category = category;
    }

    if (stockStatus === "out") {
      filter.stock = 0;
    }

    if (stockStatus === "in") {
      filter.$expr = {
        $gt: ["$stock", "$minimumStock"],
      };
    }

    if (stockStatus === "low") {
      filter.$expr = {
        $and: [
          {
            $gt: ["$stock", 0],
          },
          {
            $lte: ["$stock", "$minimumStock"],
          },
        ],
      };
    }

    const sortMap = {
      price: {
        sellingPrice: 1,
      },
      priceDesc: {
        sellingPrice: -1,
      },
      name: {
        name: 1,
      },
      date: {
        createdAt: -1,
      },
    };

    const result = await getProductsService(filter, {
      page,
      limit,
      sort: sortMap[sort] || sortMap.date,
    });

    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await getProductByIdService(req.params.id);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image || "",
    };

    const product = await createProductService(payload);

    if (req.user && product.stock > 0) {
      await InventoryMovement.create({
        product: product._id,
        type: "IN",
        quantity: product.stock,
        reason: "Initial stock",
        user: req.user._id,
      });
    }

    if (req.user) {
      await logActivity({
        action: "Product created",
        entityType: "Product",
        entityId: product._id,
        userId: req.user._id,
      });
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const payload = {
      ...req.body,
    };

    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    }

    const product = await updateProductService(req.params.id, payload);

    if (req.user) {
      await logActivity({
        action: "Product updated",
        entityType: "Product",
        entityId: product._id,
        userId: req.user._id,
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await deleteProductService(req.params.id);

    if (req.user) {
      await logActivity({
        action: "Product deleted",
        entityType: "Product",
        entityId: product._id,
        userId: req.user._id,
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
