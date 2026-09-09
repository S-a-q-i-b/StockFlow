import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Edit3,
  FolderOpen,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/category.service";

const schema = z.object({
  name: z.string().trim().min(2, "Category name is required.").max(80),
  description: z.string().max(300).optional(),
});
const blank = { name: "", description: "", image: null };

export default function Categories() {
  const qc = useQueryClient();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [menu, setMenu] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", { search, page }],
    queryFn: () => getCategories({ search, page, limit: 8 }),
  });
  const items = data?.data || [];
  const pg = data?.pagination || { page: 1, pages: 1, total: 0 };
  const mutation = useMutation({
    mutationFn: async () => {
      const valid = schema.safeParse(form);
      if (!valid.success) throw new Error(valid.error.issues[0].message);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      if (form.image instanceof File) fd.append("image", form.image);
      return editing ? updateCategory(editing._id, fd) : createCategory(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setModal(false);
      setEditing(null);
      setForm(blank);
      setError("");
      toast.success(editing ? "Category updated." : "Category created.");
    },
    onError: (e) =>
      setError(
        e.message || e.response?.data?.message || "Unable to save category.",
      ),
  });
  const del = useMutation({
    mutationFn: () => deleteCategory(deleteId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setDeleteId(null);
      toast.success("Category deleted.");
    },
    onError: (e) =>
      toast.error(e.response?.data?.message || "Unable to delete category."),
  });
  const open = (item = null) => {
    setEditing(item);
    setForm(
      item
        ? { name: item.name, description: item.description || "", image: null }
        : blank,
    );
    setError("");
    setModal(true);
  };
  const close = () => {
    setModal(false);
    setEditing(null);
    setForm(blank);
    setError("");
  };
  return (
    <div className="space-y-6" onClick={() => setMenu(null)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm font-semibold text-violet-600">
            Catalog Structure
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
            Categories
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Organize products and keep your catalog easy to navigate.
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 dark:shadow-none"
        >
          <Plus size={18} /> Add Category
        </button>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Categories" value={pg.total} />
        <Stat
          label="Products assigned"
          value={items.reduce((s, c) => s + (c.productCount || 0), 0)}
        />
        <Stat
          label="Empty categories"
          value={items.filter((c) => !c.productCount).length}
        />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
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
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Loading categories...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-14 text-center text-sm text-rose-600">
          Unable to load categories. Check the API connection.
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center dark:border-slate-800 dark:bg-slate-900">
          <FolderOpen className="mx-auto text-slate-300" size={40} />
          <p className="mt-3 font-semibold text-slate-800 dark:text-white">
            No categories found
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="relative overflow-visible rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-violet-50 dark:bg-violet-500/10">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-violet-500">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {c.productCount || 0} products
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenu(menu === c._id ? null : c._id);
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {menu === c._id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-10 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                    >
                      <button
                        onClick={() => open(c)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Edit3 size={15} /> Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteId(c._id)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-5 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
                {c.description || "No description added yet."}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Package size={14} /> {c.productCount || 0} Products
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-violet-600">
                  {editing ? "Edit category" : "New category"}
                </p>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  {editing ? "Update Category" : "Add Category"}
                </h2>
              </div>
              <button
                onClick={close}
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
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Name
                </span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Accessories"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Description
                </span>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Computer and desk accessories..."
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Image
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files?.[0] || null })
                  }
                  className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:font-semibold dark:file:bg-violet-500/10"
                />
                {editing?.image && !form.image && (
                  <img
                    src={editing.image}
                    alt="Current"
                    className="mt-3 h-16 w-16 rounded-xl object-cover"
                  />
                )}
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={close}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {mutation.isPending
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Create category"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Page {pg.page} of {pg.pages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-slate-700"
          >
            Prev
          </button>
          <button
            disabled={page >= pg.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-slate-700"
          >
            Next
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete category?"
        message="A category can only be deleted when no products are assigned to it."
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => del.mutate()}
        loading={del.isPending}
      />
    </div>
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
