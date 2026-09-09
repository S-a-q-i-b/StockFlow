import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ImagePlus,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import AnimatedSelect from "../components/common/AnimatedSelect";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ExportButton from "../components/common/ExportButton";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../services/category.service";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/product.service";
import { downloadCsv } from "../utils/export";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  sku: z.string().trim().min(2, "SKU is required."),
  category: z.string().min(1, "Select a category."),
  purchasePrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  minimumStock: z.coerce.number().int().min(0),
  description: z.string().max(500).optional(),
});
const statusStyles = {
  "In Stock":
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  "Low Stock":
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "Out of Stock":
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};
const emptyForm = {
  name: "",
  sku: "",
  category: "",
  description: "",
  purchasePrice: "",
  sellingPrice: "",
  stock: "",
  minimumStock: "",
  image: null,
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  ...props
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const {
    data: productResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", { search, category, status, page }],
    queryFn: () =>
      getProducts({ search, category, stockStatus: status, page, limit: 5 }),
    keepPreviousData: true,
  });
  const { data: categoryResponse } = useQuery({
    queryKey: ["categories", "select"],
    queryFn: () => getCategories({ limit: 50 }),
    staleTime: 60000,
  });
  const products = productResponse?.data || [];
  const pagination = productResponse?.pagination || {
    page: 1,
    pages: 1,
    total: 0,
  };
  const categories = categoryResponse?.data || [];
  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(form);
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);
      const fd = new FormData();
      Object.entries(parsed.data).forEach(([k, v]) => {
        if (k === "image") {
          if (v instanceof File) fd.append("image", v);
          return;
        }
        fd.append(k, String(v ?? ""));
      });
      return editing ? updateProduct(editing._id, fd) : createProduct(fd);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setModal(null);
      setEditing(null);
      setForm(emptyForm);
      setError("");
      toast.success(
        editing
          ? "Product updated successfully."
          : "Product created successfully.",
      );
    },
    onError: (e) =>
      setError(
        e.message || e.response?.data?.message || "Something went wrong.",
      ),
  });
  const delMutation = useMutation({
    mutationFn: () => deleteProduct(deleteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteId(null);
      toast.success("Product deleted.");
    },
    onError: (e) =>
      toast.error(e.response?.data?.message || "Unable to delete product."),
  });
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModal("form");
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category?._id || "",
      description: p.description || "",
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      stock: p.stock,
      minimumStock: p.minimumStock,
      image: null,
    });
    setError("");
    setModal("form");
  };
  const imgPreview = useMemo(
    () =>
      form.image instanceof File
        ? URL.createObjectURL(form.image)
        : editing?.image || "",
    [form.image, editing],
  );
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Inventory Catalog
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Products
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage products, pricing, stock levels and product images.
          </p>
        </div>
        <ExportButton
          label="Export visible"
          onClick={() =>
            downloadCsv(
              "stockflow-products.csv",
              products.map((p) => ({
                Name: p.name,
                SKU: p.sku,
                Category: p.category?.name || "",
                PurchasePrice: p.purchasePrice,
                SellingPrice: p.sellingPrice,
                Stock: p.stock,
                MinimumStock: p.minimumStock,
                Status: p.status,
              })),
            )
          }
        />{" "}
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 dark:shadow-none"
        >
          <Plus size={18} rotate={360} /> Add Product
        </button>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat label="Products" value={pagination.total} />
        <MiniStat
          label="Visible Stock"
          value={products.reduce((s, p) => s + p.stock, 0)}
        />
        <MiniStat
          label="Low / Out"
          value={products.filter((p) => p.status !== "In Stock").length}
        />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_180px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name or SKU..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">All stock status</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-16 text-center text-sm text-rose-500"
                  >
                    Unable to load products. Check that the API is running.
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <Package className="mx-auto text-slate-300" size={34} />
                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No products found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try another search or create your first product.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="sf-hover-card hover:bg-slate-50/80 dark:hover:bg-slate-950/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                              <Package size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      ${Number(product.sellingPrice).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200">
                      {product.stock}{" "}
                      <span className="text-xs text-slate-400">
                        / min {product.minimumStock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[product.status]}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        >
                          <Pencil size={17} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(product._id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Page {pagination.page} of {pagination.pages} · {pagination.total}{" "}
            total
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete product?"
        message="This permanently removes the product record. Make sure it is no longer needed."
        confirmText="Delete Product"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => delMutation.mutate()}
        loading={delMutation.isPending}
      />
      {modal === "form" && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  {editing ? "Edit product" : "New product"}
                </p>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  {editing ? "Update Product" : "Add Product"}
                </h2>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X />
              </button>
            </div>
            {error && (
              <div className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                {error}
              </div>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Wireless Mouse"
              />
              <Field
                label="SKU"
                name="sku"
                value={form.sku}
                onChange={(e) =>
                  setForm({ ...form, sku: e.target.value.toUpperCase() })
                }
                placeholder="WM-102"
              />
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Category
                </span>
                <AnimatedSelect
                  value={form.category}
                  onChange={(value) => setForm({ ...form, category: value })}
                  placeholder="Select category"
                  options={categories.map((c) => ({
                    value: c._id,
                    label: c.name,
                  }))}
                />
              </label>
              <Field
                label="Purchase price"
                type="number"
                name="purchasePrice"
                value={form.purchasePrice}
                onChange={(e) =>
                  setForm({ ...form, purchasePrice: e.target.value })
                }
              />
              <Field
                label="Selling price"
                type="number"
                name="sellingPrice"
                value={form.sellingPrice}
                onChange={(e) =>
                  setForm({ ...form, sellingPrice: e.target.value })
                }
              />
              <Field
                label="Stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
              <Field
                label="Minimum stock"
                type="number"
                name="minimumStock"
                value={form.minimumStock}
                onChange={(e) =>
                  setForm({ ...form, minimumStock: e.target.value })
                }
              />
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="3"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Short product description..."
                />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Product image
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    <ImagePlus size={18} />
                    Choose image
                    <input
                      hidden
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.files?.[0] || null })
                      }
                    />
                  </label>
                  {imgPreview && (
                    <img
                      src={imgPreview}
                      alt="Preview"
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  )}
                </div>
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saveMutation.isPending
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Create product"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
function MiniStat({ label, value }) {
  return (
    <div className="sf-hover-card rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}
