import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  getInventory,
  getMovements,
  stockIn,
  stockOut,
} from "../services/inventory.service";
import { toast } from "sonner";
import ExportButton from "../components/common/ExportButton";
import { downloadCsv } from "../utils/export";

export default function Inventory() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ product: "", quantity: "", reason: "" });
  const { data, isLoading } = useQuery({
    queryKey: ["inventory", { search, status, page }],
    queryFn: () => getInventory({ search, status, page, limit: 12 }),
  });
  const { data: movementData } = useQuery({
    queryKey: ["inventory-movements"],
    queryFn: () => getMovements({ limit: 50 }),
  });
  const products = data?.data || [];
  const summary = data?.summary || {};
  const pg = data?.pagination || { page: 1, pages: 1 };
  const movements = movementData?.data || [];
  const mutation = useMutation({
    mutationFn: () => (modal === "in" ? stockIn(form) : stockOut(form)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["inventory-movements"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(
        modal === "in"
          ? "Stock added successfully."
          : "Stock removed successfully.",
      );
      setModal(null);
      setForm({ product: "", quantity: "", reason: "" });
    },
    onError: (e) =>
      toast.error(e.response?.data?.message || "Unable to update stock."),
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
            Inventory Management
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
            Inventory
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Monitor stock levels and record every inventory movement.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton
            label="Export visible"
            onClick={() =>
              downloadCsv(
                "stockflow-inventory.csv",
                products.map((p) => ({
                  Name: p.name,
                  SKU: p.sku,
                  Category: p.category?.name || "",
                  Stock: p.stock,
                  Minimum: p.minimumStock,
                  Status:
                    p.stock === 0
                      ? "Out of Stock"
                      : p.stock <= p.minimumStock
                        ? "Low Stock"
                        : "In Stock",
                })),
              )
            }
          />
          <button
            onClick={() => setModal("in")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowUpFromLine size={17} /> Stock In
          </button>
          <button
            onClick={() => setModal("out")}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowDownToLine size={17} /> Stock Out
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value={summary.totalProducts || 0} />
        <Stat label="Total Units" value={summary.totalStock || 0} />
        <Stat label="Low Stock" value={summary.lowStock || 0} />
        <Stat label="Out of Stock" value={summary.outOfStock || 0} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search product or SKU..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">All stock</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Minimum</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-16 text-center text-sm text-slate-500"
                    >
                      Loading inventory...
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-500">{p.sku}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {p.category?.name || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white">
                        {p.stock}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {p.minimumStock}
                      </td>
                      <td className="px-5 py-4">
                        <Status product={p} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Page {pg.page} of {pg.pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:opacity-40 dark:border-slate-700"
              >
                Previous
              </button>
              <button
                disabled={page >= pg.pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:opacity-40 dark:border-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Recent Movements
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest stock changes
              </p>
            </div>
            <TrendingUp className="text-violet-600" size={20} />
          </div>
          <div className="mt-5 space-y-3">
            {movements.slice(0, 10).map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${m.type === "IN" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"}`}
                  >
                    {m.type === "IN" ? (
                      <ArrowUpFromLine size={16} />
                    ) : (
                      <ArrowDownToLine size={16} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {m.product?.name || "Unknown product"}
                    </p>
                    <p className="text-xs text-slate-500">{m.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${m.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {m.type === "IN" ? "+" : "-"}
                    {m.quantity}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {modal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-violet-600">
              {modal === "in" ? "Stock In" : "Stock Out"}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
              Record inventory movement
            </h2>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Product
                </span>
                <select
                  required
                  value={form.product}
                  onChange={(e) =>
                    setForm({ ...form, product: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — {p.stock} available
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Quantity
                </span>
                <input
                  required
                  min="1"
                  step="1"
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Reason
                </span>
                <input
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Supplier delivery, damaged item, etc."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                disabled={mutation.isPending}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {mutation.isPending ? "Saving..." : "Save movement"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
function Status({ product }) {
  const s =
    product.stock === 0
      ? "Out of Stock"
      : product.stock <= product.minimumStock
        ? "Low Stock"
        : "In Stock";
  const c =
    s === "In Stock"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      : s === "Low Stock"
        ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
        : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c}`}>
      {s}
    </span>
  );
}
function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}
