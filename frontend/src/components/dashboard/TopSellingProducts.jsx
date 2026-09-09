import { motion } from "framer-motion";
import { ArrowUpRight, Package, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    name: "Wireless Mouse",
    sku: "WM-102",
    sold: 128,
    revenue: "$3,840",
  },
  {
    name: "Mechanical Keyboard",
    sku: "MK-204",
    sold: 96,
    revenue: "$7,680",
  },
  {
    name: "USB-C Cable",
    sku: "UC-301",
    sold: 84,
    revenue: "$1,680",
  },
  {
    name: "Laptop Stand",
    sku: "LS-405",
    sold: 72,
    revenue: "$2,880",
  },
  {
    name: "Webcam HD",
    sku: "WC-501",
    sold: 58,
    revenue: "$2,320",
  },
];

const TopSellingProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20">
      {/* ================= HEADER ================= */}
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate font-semibold tracking-tight text-slate-900 dark:text-white">
              Top Selling Products
            </h3>

            <TrendingUp size={16} className="shrink-0 text-emerald-500" />
          </div>

          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
            Best performing products
          </p>
        </div>

        {/* View All */}
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View all
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="mt-6 min-w-0 space-y-3">
        {products.map((product, index) => (
          <motion.div
            key={product.sku}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: index * 0.08,
              ease: "easeOut",
            }}
            whileHover={{ x: 3 }}
            className="group flex min-w-0 max-w-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/30 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/20 dark:hover:bg-indigo-500/5"
          >
            {/* ================= LEFT ================= */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {/* Rank */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
                {index + 1}
              </div>

              {/* Product Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-all duration-200 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500/15 dark:group-hover:text-indigo-300">
                <Package size={18} />
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {product.name}
                </p>

                <p className="mt-1 truncate text-xs font-medium text-slate-400 dark:text-slate-500">
                  SKU: {product.sku}
                </p>
              </div>
            </div>

            {/* ================= SALES ================= */}
            <div className="min-w-0 shrink-0 text-right">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {product.revenue}
              </p>

              <p className="mt-1 truncate text-xs font-medium text-slate-400 dark:text-slate-500">
                {product.sold} sold
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
