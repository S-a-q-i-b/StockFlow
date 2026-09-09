const mongoose = require("mongoose");
const logActivity = require("../utils/activity");

const buildCrud = (Model, label, populate) => {
  const list = async (req, res, next) => {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;
      const filter = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { phone: { $regex: search, $options: "i" } },
              { sku: { $regex: search, $options: "i" } },
            ],
          }
        : {};
      const total = await Model.countDocuments(filter);
      let query = Model.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      if (populate) query = query.populate(populate);
      const items = await query;
      res.json({
        success: true,
        data: items,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  };
  const getOne = async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id))
        return res
          .status(400)
          .json({ success: false, message: "Invalid record ID." });
      let query = Model.findById(req.params.id);
      if (populate) query = query.populate(populate);
      const item = await query;
      if (!item)
        return res
          .status(404)
          .json({ success: false, message: `${label} not found.` });
      res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  };
  const create = async (req, res, next) => {
    try {
      const item = await Model.create(req.body);
      if (req.user)
        await logActivity({
          action: `${label} created`,
          entityType: label,
          entityId: item._id,
          userId: req.user._id,
        });
      res.status(201).json({
        success: true,
        message: `${label} created successfully.`,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };
  const update = async (req, res, next) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item)
        return res
          .status(404)
          .json({ success: false, message: `${label} not found.` });
      if (req.user)
        await logActivity({
          action: `${label} updated`,
          entityType: label,
          entityId: item._id,
          userId: req.user._id,
        });
      res.json({
        success: true,
        message: `${label} updated successfully.`,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };
  const remove = async (req, res, next) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item)
        return res
          .status(404)
          .json({ success: false, message: `${label} not found.` });
      if (req.user)
        await logActivity({
          action: `${label} deleted`,
          entityType: label,
          entityId: item._id,
          userId: req.user._id,
        });
      res.json({ success: true, message: `${label} deleted successfully.` });
    } catch (error) {
      next(error);
    }
  };
  return { list, getOne, create, update, remove };
};

module.exports = buildCrud;
