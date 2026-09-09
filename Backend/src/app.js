const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const customerRoutes = require("./routes/customer.routes");
const orderRoutes = require("./routes/order.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const activityRoutes = require("./routes/activity.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = String(process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("CORS origin is not allowed."));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.use(cookieParser());


app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "StockFlow API is healthy" }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/sales", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activities", activityRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
