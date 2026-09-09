const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const Activity = require("../models/activity.model");

const rangeToDate = (range) => {
  const now = new Date();
  const from = new Date(now);

  if (range === "7d") {
    from.setDate(now.getDate() - 6);
  } else if (range === "30d") {
    from.setDate(now.getDate() - 29);
  } else if (range === "6m") {
    from.setMonth(now.getMonth() - 5, 1);
  } else {
    from.setMonth(now.getMonth() - 11, 1);
  }

  from.setHours(0, 0, 0, 0);

  return { from, to: now };
};

const buildSeries = (orders, range, from, to) => {
  const map = new Map();

  const months = range === "6m" || range === "12m";

  const cursor = new Date(from);

  while (cursor <= to) {
    let key;
    let label;

    if (months) {
      key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(
        2,
        "0",
      )}`;

      label = cursor.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    } else {
      key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, "0"),
        String(cursor.getDate()).padStart(2, "0"),
      ].join("-");

      label = cursor.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    map.set(key, {
      key,
      label,
      revenue: 0,
      profit: 0,
      orders: 0,
    });

    if (months) {
      cursor.setMonth(cursor.getMonth() + 1);
    } else {
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  for (const order of orders) {
    const date = new Date(order.createdAt);

    let key;

    if (months) {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
    } else {
      key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");
    }

    const bucket = map.get(key);

    if (!bucket) continue;

    const orderTotal = Number(order.total || 0);
    const discount = Number(order.discount || 0);

    bucket.revenue += orderTotal;
    bucket.orders += 1;

    const itemProfit = (order.items || []).reduce(
      (sum, item) =>
        sum +
        (Number(item.sellingPrice || 0) - Number(item.purchasePrice || 0)) *
          Number(item.quantity || 0),
      0,
    );

    bucket.profit += itemProfit - discount;
  }

  return Array.from(map.values());
};

const getDashboard = async (req, res, next) => {
  try {
    const range = ["7d", "30d", "6m", "12m"].includes(req.query.range)
      ? req.query.range
      : "7d";

    const { from, to } = rangeToDate(range);

    const [
      products,
      categories,
      customers,
      completedOrders,
      recentOrders,
      activities,
      topProducts,
    ] = await Promise.all([
      Product.countDocuments(),

      Category.countDocuments(),

      Customer.countDocuments(),

      Order.find({
        status: "Completed",
        createdAt: {
          $gte: from,
          $lte: to,
        },
      }).lean(),

      Order.find()
        .populate("customer", "name")
        .sort({ createdAt: -1 })
        .limit(8),

      Activity.find()
        .populate("user", "name role")
        .sort({ createdAt: -1 })
        .limit(8),

      Order.aggregate([
        {
          $match: {
            status: "Completed",
            createdAt: {
              $gte: from,
              $lte: to,
            },
          },
        },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id: "$items.product",

            name: {
              $first: "$items.name",
            },

            sold: {
              $sum: "$items.quantity",
            },

            revenue: {
              $sum: "$items.lineTotal",
            },
          },
        },

        {
          $sort: {
            sold: -1,
          },
        },

        {
          $limit: 5,
        },
      ]),
    ]);

    const [lowStock, outOfStock, allLowStockProducts] = await Promise.all([
      Product.countDocuments({
        stock: {
          $gt: 0,
        },

        $expr: {
          $lte: ["$stock", "$minimumStock"],
        },
      }),

      Product.countDocuments({
        stock: 0,
      }),

      Product.find({
        $or: [
          {
            stock: 0,
          },

          {
            $expr: {
              $lte: ["$stock", "$minimumStock"],
            },
          },
        ],
      })
        .sort({ stock: 1 })
        .limit(6)
        .select("name sku stock minimumStock image status"),
    ]);

    const revenue = completedOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0,
    );

    const profit = completedOrders.reduce((sum, order) => {
      const itemProfit = (order.items || []).reduce(
        (itemSum, item) =>
          itemSum +
          (Number(item.sellingPrice || 0) - Number(item.purchasePrice || 0)) *
            Number(item.quantity || 0),
        0,
      );

      return sum + itemProfit - Number(order.discount || 0);
    }, 0);

    res.json({
      success: true,

      data: {
        stats: {
          totalProducts: products,
          totalCategories: categories,
          totalCustomers: customers,
          totalSales: completedOrders.length,
          totalRevenue: revenue,
          totalProfit: profit,
          lowStock,
          outOfStock,
        },

        // IMPORTANT:
        // from and to are passed here.
        chart: buildSeries(completedOrders, range, from, to),

        recentOrders,

        recentActivities: activities,

        topProducts,

        lowStockProducts: allLowStockProducts,

        range: {
          from,
          to,
          key: range,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
