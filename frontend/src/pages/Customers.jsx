import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "../services/customer.service";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(100),
  email: z.string().trim().email("Valid email is required."),
  phone: z.string().trim().min(5, "Phone is required."),
});
const blank = { name: "", email: "", phone: "", address: "", city: "" };
export default function Customers() {
  const nav = useNavigate(),
    qc = useQueryClient(),
    { isAdmin } = useAuth();
  const [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    [modal, setModal] = useState(false),
    [editing, setEditing] = useState(null),
    [form, setForm] = useState(blank),
    [error, setError] = useState(""),
    [deleteId, setDeleteId] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customers", { search, page }],
    queryFn: () => getCustomers({ search, page, limit: 8 }),
  });
  const rows = data?.data || [],
    pg = data?.pagination || { page: 1, pages: 1, total: 0 };
  const mutation = useMutation({
    mutationFn: () => {
      const valid = schema.safeParse(form);
      if (!valid.success) throw new Error(valid.error.issues[0].message);
      return editing ? updateCustomer(editing._id, form) : createCustomer(form);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setModal(false);
      setEditing(null);
      setForm(blank);
      setError("");
      toast.success(editing ? "Customer updated." : "Customer added.");
    },
    onError: (e) =>
      setError(
        e.message || e.response?.data?.message || "Unable to save customer.",
      ),
  });
  const del = useMutation({
    mutationFn: () => deleteCustomer(deleteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setDeleteId(null);
      toast.success("Customer deleted.");
    },
    onError: (e) =>
      toast.error(e.response?.data?.message || "Unable to delete customer."),
  });
  const open = (c = null) => {
    setEditing(c);
    setForm(
      c
        ? {
            name: c.name,
            email: c.email || "",
            phone: c.phone || "",
            address: c.address || "",
            city: c.city || "",
          }
        : blank,
    );
    setError("");
    setModal(true);
  };
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Customer Management
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
            Customers
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage contacts, spending and customer history.
          </p>
        </div>
        <button
          onClick={() => open()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={18} /> Add Customer
        </button>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total customers" value={pg.total} />
        <Stat label="Visible customers" value={rows.length} />
        <Stat
          label="Visible spending"
          value={
            "$" + rows.reduce((s, c) => s + (c.spent || 0), 0).toLocaleString()
          }
        />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
            placeholder="Search customer name, email or phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Orders</th>
                <th className="px-5 py-4">Spent</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-14 text-center text-sm text-slate-500"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-14 text-center text-sm text-rose-500"
                  >
                    Unable to load customers.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-14 text-center text-sm text-slate-500"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                rows.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-950"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
                          <UserRound size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {c.city || "No city"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {c.email || "—"}
                      </p>
                      <p className="text-xs text-slate-500">{c.phone || "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200">
                      {c.orders || 0}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      ${Number(c.spent || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => nav(`/customers/${c._id}`)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => open(c)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                        >
                          <Pencil size={17} />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(c._id)}
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
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Page {pg.page} of {pg.pages}
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
              disabled={page >= pg.pages}
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
        title="Delete customer?"
        message="Customers with order history cannot be removed."
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => del.mutate()}
        loading={del.isPending}
      />
      {modal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <motion.form
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  {editing ? "Edit customer" : "New customer"}
                </p>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  {editing ? "Update Customer" : "Add Customer"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X />
              </button>
            </div>
            {error && (
              <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                {error}
              </div>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Address
                </span>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  rows="3"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                disabled={mutation.isPending}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {mutation.isPending
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Create customer"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}
function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </label>
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
