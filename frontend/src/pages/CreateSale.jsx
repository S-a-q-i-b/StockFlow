import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { getCustomers } from "../services/customer.service";
import { createOrder } from "../services/order.service";
import { getProducts } from "../services/product.service";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
const paymentMethods = [
  { value: "Cash", label: "Cash", icon: Wallet },
  { value: "Card", label: "Card", icon: CreditCard },
  { value: "Bank Transfer", label: "Bank Transfer", icon: CreditCard },
];

export default function CreateSale() {
  const qc = useQueryClient();
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [error, setError] = useState("");

  const { data: customerResponse, isLoading: customersLoading } = useQuery({
    queryKey: ["sale-customers", customerSearch],
    queryFn: () => getCustomers({ search: customerSearch, limit: 20 }),
  });
  const { data: productResponse, isLoading: productsLoading } = useQuery({
    queryKey: ["sale-products", productSearch],
    queryFn: () =>
      getProducts({ search: productSearch, limit: 50, stockStatus: "all" }),
  });

  const customers = customerResponse?.data || [];
  const products = productResponse?.data || [];

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0),
    [cart],
  );
  const safeDiscount = Math.min(Math.max(Number(discount) || 0, 0), subtotal);
  const total = subtotal - safeDiscount;

  const addToCart = (product) => {
    if (product.stock < 1)
      return toast.error(`${product.name} is out of stock.`);
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) return current;
        return current.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const changeQty = (id, delta) =>
    setCart((current) =>
      current
        .map((item) => {
          if (item._id !== id) return item;
          return {
            ...item,
            quantity: Math.min(item.stock, Math.max(0, item.quantity + delta)),
          };
        })
        .filter((item) => item.quantity > 0),
    );

  const mutation = useMutation({
    mutationFn: () =>
      createOrder({
        customer: customer._id,
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        discount: safeDiscount,
        paymentMethod,
        status: "Completed",
      }),
    onSuccess: (response) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["sale-products"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(
        `Sale ${response.data.orderNumber} completed successfully.`,
      );
      setCustomer(null);
      setCart([]);
      setDiscount("");
      setCustomerSearch("");
      setProductSearch("");
      setError("");
    },
    onError: (e) =>
      setError(
        e.response?.data?.message || e.message || "Unable to complete sale.",
      ),
  });

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
            Sales Management
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Create New Sale
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Build a POS-style cart and complete the sale against live inventory.
          </p>
        </div>
        <button
          onClick={() => {
            setCustomer(null);
            setCart([]);
            setDiscount("");
            setError("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <X size={17} /> Clear Sale
        </button>
      </div>
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <User size={19} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Customer
                </h2>
                <p className="text-xs text-slate-500">
                  Select the customer for this sale.
                </p>
              </div>
            </div>
            {customer ? (
              <div className="flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {customer.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {customer.email || customer.phone || "No contact"}
                  </p>
                </div>
                <button
                  onClick={() => setCustomer(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                >
                  <X size={17} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search customer by name, email or phone..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  {customersLoading ? (
                    <p className="p-4 text-sm text-slate-500">
                      Loading customers...
                    </p>
                  ) : customers.length === 0 ? (
                    <p className="p-4 text-sm text-slate-500">
                      No customers found.
                    </p>
                  ) : (
                    customers.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => setCustomer(c)}
                        className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {c.email || c.phone || "No contact"}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          {c.orders || 0} orders
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Products
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Only products with available stock can be added.
              </p>
            </div>
            <div className="relative mb-4">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search product or SKU..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {productsLoading ? (
                <p className="col-span-full py-8 text-center text-sm text-slate-500">
                  Loading products...
                </p>
              ) : (
                products.map((p) => (
                  <button
                    key={p._id}
                    disabled={p.stock < 1}
                    onClick={() => addToCart(p)}
                    className="rounded-xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-800 dark:hover:border-violet-500/50"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {p.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{p.sku}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-violet-600">
                        {money(p.sellingPrice)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {p.stock} in stock
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-24">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Cart</h2>
              <p className="text-xs text-slate-500">
                {cart.reduce((n, i) => n + i.quantity, 0)} items
              </p>
            </div>
            <ShoppingCart size={20} className="text-violet-600" />
          </div>
          <div className="mt-5 space-y-3">
            {cart.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
                <ShoppingCart className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  Your cart is empty
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {money(item.sellingPrice)}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setCart((c) => c.filter((i) => i._id !== item._id))
                      }
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => changeQty(item._id, -1)}
                        className="p-1.5 text-slate-500"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => changeQty(item._id, 1)}
                        className="p-1.5 text-slate-500"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {money(item.sellingPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold dark:text-white">
                {money(subtotal)}
              </span>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Discount
              </span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Payment
              </span>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    className={`rounded-xl border px-2 py-3 text-xs font-semibold transition ${paymentMethod === value ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300" : "border-slate-200 text-slate-500 dark:border-slate-700"}`}
                  >
                    <Icon size={16} className="mx-auto mb-1" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end justify-between rounded-xl bg-slate-950 p-4 text-white dark:bg-violet-600">
              <span className="text-sm text-white/70">Total</span>
              <strong className="text-2xl">{money(total)}</strong>
            </div>
            <button
              disabled={!customer || cart.length === 0 || mutation.isPending}
              onClick={() => mutation.mutate()}
              className="w-full rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-none"
            >
              {mutation.isPending ? "Completing sale..." : "Complete Sale"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
