
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Edit3,
  ImagePlus,
  Package,
  ShoppingCart,
  Tag,
  TrendingUp,
  Warehouse,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const productsData = [
  {
    id: "1",
    name: "Wireless Mouse",
    sku: "WM-102",
    category: "Accessories",
    description:
      "A comfortable wireless mouse designed for everyday office work, productivity and smooth navigation.",
    purchasePrice: 18,
    sellingPrice: 30,
    stock: 42,
    minimumStock: 10,
    status: "In Stock",
    sold: 128,
    createdAt: "September 02, 2026",
    image: "",
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    sku: "MK-204",
    category: "Accessories",
    description:
      "Premium mechanical keyboard with responsive switches and a comfortable typing experience.",
    purchasePrice: 52,
    sellingPrice: 80,
    stock: 18,
    minimumStock: 8,
    status: "In Stock",
    sold: 96,
    createdAt: "August 28, 2026",
    image: "",
  },
  {
    id: "3",
    name: "USB-C Cable",
    sku: "UC-301",
    category: "Cables",
    description:
      "Durable USB-C charging and data cable suitable for modern smartphones, laptops and accessories.",
    purchasePrice: 11,
    sellingPrice: 20,
    stock: 7,
    minimumStock: 10,
    status: "Low Stock",
    sold: 84,
    createdAt: "August 24, 2026",
    image: "",
  },
];

const categories = [
  "Accessories",
  "Cables",
  "Electronics",
  "Computer",
  "Other",
];

const statusStyles = {
  "In Stock":
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",

  "Low Stock":
    "bg-amber-50 text-amber-700 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",

  "Out of Stock":
    "bg-rose-50 text-rose-700 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20",
};

const statusDots = {
  "In Stock": "bg-emerald-500",
  "Low Stock": "bg-amber-500",
  "Out of Stock": "bg-rose-500",
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product =
    productsData.find((item) => item.id === id) || productsData[0];

  const [showEditModal, setShowEditModal] = useState(false);

  const [imagePreview, setImagePreview] = useState(product.image || "");

  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    category: product.category,
    description: product.description,
    purchasePrice: product.purchasePrice,
    sellingPrice: product.sellingPrice,
    stock: product.stock,
    minimumStock: product.minimumStock,
  });

  const profit = Number(formData.sellingPrice) - Number(formData.purchasePrice);

  const margin =
    Number(formData.sellingPrice) > 0
      ? ((profit / Number(formData.sellingPrice)) * 100).toFixed(1)
      : "0.0";

  const stockPercentage = Math.min(
    (Number(formData.stock) / Math.max(Number(formData.minimumStock) * 4, 50)) *
      100,
    100,
  );

  const getStatus = () => {
    const stock = Number(formData.stock);
    const minimumStock = Number(formData.minimumStock);

    if (stock === 0) return "Out of Stock";
    if (stock <= minimumStock) return "Low Stock";

    return "In Stock";
  };

  const currentStatus = getStatus();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleUpdateProduct = (event) => {
    event.preventDefault();

    /*
      Frontend-only phase:
      Later this will be replaced with an API request.
    */

    setShowEditModal(false);
  };

  return (
    <div className="min-w-0 overflow-x-hidden">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          to="/products"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Product Details
            </p>

            <h1 className="truncate text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                SKU: {product.sku}
              </span>

              <span className="text-sm text-slate-400">•</span>

              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {product.category}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${statusStyles[currentStatus]}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusDots[currentStatus]}`}
                />

                {currentStatus}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] dark:shadow-indigo-950/30"
          >
            <Edit3 size={17} />
            Edit Product
          </button>
        </div>
      </motion.div>

      {/* =========================================================
          MAIN GRID
      ========================================================== */}
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1fr_1.5fr]">
        {/* =====================================================
            PRODUCT PREVIEW
        ====================================================== */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/50 to-violet-50 dark:from-slate-800 dark:via-indigo-950/40 dark:to-violet-950/30">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white text-indigo-500 shadow-xl shadow-indigo-100 dark:bg-slate-800 dark:text-indigo-400 dark:shadow-black/20">
                <Package size={64} strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Product Image
              </h2>

              <span className="text-xs font-medium text-slate-400">
                Preview
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Product image preview. Image upload will be connected to the
              backend later.
            </p>
          </div>
        </motion.div>

        {/* =====================================================
            PRODUCT INFORMATION
        ====================================================== */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="min-w-0 space-y-6"
        >
          {/* ===================================================
              PRICING
          ==================================================== */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <TrendingUp size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Pricing Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Product pricing and profit
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBox
                label="Purchase Price"
                value={`$${Number(formData.purchasePrice).toFixed(2)}`}
              />

              <InfoBox
                label="Selling Price"
                value={`$${Number(formData.sellingPrice).toFixed(2)}`}
                valueClass="text-indigo-600 dark:text-indigo-400"
              />

              <InfoBox
                label="Profit / Unit"
                value={`$${profit.toFixed(2)}`}
                valueClass="text-emerald-600 dark:text-emerald-400"
              />
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10">
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Profit Margin
              </span>

              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {margin}%
              </span>
            </div>
          </div>

          {/* ===================================================
              INVENTORY
          ==================================================== */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Warehouse size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Inventory Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Current stock levels
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBox
                label="Current Stock"
                value={formData.stock}
                valueClass={
                  Number(formData.stock) <= Number(formData.minimumStock)
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-slate-900 dark:text-white"
                }
              />

              <InfoBox
                label="Minimum Stock"
                value={formData.minimumStock}
              />

              <InfoBox
                label="Units Sold"
                value={product.sold}
                valueClass="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Stock Level
                </span>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {formData.stock} units
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stockPercentage}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full ${
                    currentStatus === "Low Stock"
                      ? "bg-amber-500"
                      : currentStatus === "Out of Stock"
                        ? "bg-rose-500"
                        : "bg-indigo-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =========================================================
          DESCRIPTION + META
      ========================================================== */}
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Tag size={19} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Description
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Product information
              </p>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {formData.description}
          </p>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
              <CalendarDays size={19} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Product Activity
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Product metadata
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <MetaRow label="Product ID" value={`#${product.id}`} />
            <MetaRow label="SKU" value={formData.sku} />
            <MetaRow label="Category" value={formData.category} />
            <MetaRow label="Created" value={product.createdAt} />
          </div>
        </motion.div>
      </div>

      {/* =========================================================
          QUICK ACTIONS
      ========================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Quickly manage this product.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {/* Create Sale */}
          <button
            type="button"
            onClick={() => navigate("/sales")}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
          >
            <ShoppingCart size={17} />
            Create Sale
          </button>

          {/* Manage Stock */}
          <button
            type="button"
            onClick={() => navigate("/inventory")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
          >
            <Warehouse size={17} />
            Manage Stock
          </button>
        </div>
      </motion.div>

      {/* =========================================================
          EDIT PRODUCT MODAL
      ========================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowEditModal(false)}
            className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Product
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Update your product information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProduct} className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <FormField label="Product Name">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Product name"
                  />
                </FormField>

                {/* SKU */}
                <FormField label="SKU">
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="SKU"
                  />
                </FormField>

                {/* Category */}
                <FormField label="Category">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Purchase Price */}
                <FormField label="Purchase Price">
                  <input
                    type="number"
                    min="0"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                  />
                </FormField>

                {/* Selling Price */}
                <FormField label="Selling Price">
                  <input
                    type="number"
                    min="0"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                  />
                </FormField>

                {/* Stock */}
                <FormField label="Stock Quantity">
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                  />
                </FormField>

                {/* Minimum Stock */}
                <FormField label="Minimum Stock">
                  <input
                    type="number"
                    min="0"
                    name="minimumStock"
                    value={formData.minimumStock}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                  />
                </FormField>

                {/* Description */}
                <div className="sm:col-span-2">
                  <FormField label="Description">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="form-input resize-none"
                      placeholder="Product description..."
                    />
                  </FormField>
                </div>

                {/* Image */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Product Image
                  </label>

                  <label className="group relative flex min-h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/5">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition group-hover:opacity-100">
                          <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-lg">
                            Change Image
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm dark:bg-slate-700 dark:text-slate-300">
                          <ImagePlus size={20} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-200">
                            Upload product image
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            PNG, JPG or WEBP • Max 5MB
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <CheckCircle2 size={17} />
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ===============================================================
   INFO BOX
================================================================ */

const InfoBox = ({
  label,
  value,
  valueClass = "text-slate-900 dark:text-white",
}) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className={`mt-2 text-xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
};

/* ===============================================================
   META ROW
================================================================ */

const MetaRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
      <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
        {label}
      </span>

      <span className="truncate text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
        {value}
      </span>
    </div>
  );
};

/* ===============================================================
   FORM FIELD
================================================================ */

const FormField = ({ label, children }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <div className="[&_.form-input]:w-full [&_.form-input]:rounded-xl [&_.form-input]:border [&_.form-input]:border-slate-200 [&_.form-input]:bg-slate-50 [&_.form-input]:px-4 [&_.form-input]:py-2.5 [&_.form-input]:text-sm [&_.form-input]:text-slate-900 [&_.form-input]:outline-none [&_.form-input]:transition [&_.form-input]:placeholder:text-slate-400 [&_.form-input]:focus:border-indigo-500 [&_.form-input]:focus:bg-white [&_.form-input]:focus:ring-2 [&_.form-input]:focus:ring-indigo-500/10 [&_.form-input]:dark:border-slate-700 [&_.form-input]:dark:bg-slate-800 [&_.form-input]:dark:text-white [&_.form-input]:dark:placeholder:text-slate-500 [&_.form-input]:dark:focus:bg-slate-800">
        {children}
      </div>
    </div>
  );
};

export default ProductDetails;

