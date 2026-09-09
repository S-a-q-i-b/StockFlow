import { AlertTriangle, ArrowRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    name: "Wireless Mouse",
    sku: "WM-102",
    stock: 4,
  },
  {
    name: "Mechanical Keyboard",
    sku: "MK-204",
    stock: 3,
  },
  {
    name: "USB-C Cable",
    sku: "UC-301",
    stock: 2,
  },
];

const LowStockCard = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <AlertTriangle size={20} strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold tracking-tight text-slate-900 dark:text-white">
              Low Stock
            </h3>

            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              Products that need attention
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          12 items
        </span>
      </div>

      {/* Products */}
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.sku}
            className="group flex items-center justify-between rounded-xl border border-transparent bg-slate-50 p-3.5 transition-all duration-200 hover:border-amber-100 hover:bg-amber-50/40 dark:bg-slate-800/60 dark:hover:border-amber-500/20 dark:hover:bg-amber-500/5"
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* Product Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm transition-colors group-hover:text-amber-500 dark:bg-slate-700 dark:text-slate-500 dark:group-hover:text-amber-400">
                <Package size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {product.name}
                </p>

                <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  SKU: {product.sku}
                </p>
              </div>
            </div>

            {/* Stock */}
            <div className="ml-3 shrink-0 text-right">
              <span className="text-sm font-bold text-rose-500 dark:text-rose-400">
                {product.stock}
              </span>

              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                left
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button
        type="button"
        onClick={() => navigate("/inventory")}
        className="group mt-6 flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all duration-200 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        View inventory
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </button>
    </div>
  );
};

export default LowStockCard;
