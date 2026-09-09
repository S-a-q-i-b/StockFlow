import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getCustomer } from "../services/customer.service";

const money = (v) => `Rs. ${Number(v || 0).toLocaleString()}`;
export default function CustomerDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id),
    enabled: Boolean(id),
  });
  const c = data?.data;
  const orders = c?.orders || [];
  const spent = c?.spent || 0;
  if (isLoading)
    return (
      <div className="py-24 text-center text-sm text-slate-500">
        Loading customer...
      </div>
    );
  if (error || !c)
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-700">
        Customer not found.
      </div>
    );
  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-violet-600"
        >
          <ArrowLeft size={16} /> Back to Customers
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <UserRound size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
              {c.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Customer profile and complete purchase history.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={ShoppingBag} label="Orders" value={orders.length} />
        <Stat icon={Wallet} label="Total Spent" value={money(spent)} />
        <Stat
          icon={TrendingUp}
          label="Average Order"
          value={money(orders.length ? spent / orders.length : 0)}
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Order History
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Every order associated with this customer.
            </p>
          </div>
          {orders.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No order history yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td className="px-6 py-4">
                        <Link
                          to={`/orders/${o._id}`}
                          className="font-semibold text-violet-600"
                        >
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {o.items?.reduce((s, i) => s + i.quantity, 0) || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <CalendarDays size={13} />
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                        {money(o.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold text-slate-900 dark:text-white">
            Contact Details
          </h2>
          <div className="mt-5 space-y-5">
            <Info icon={Mail} text={c.email || "No email"} />
            <Info icon={Phone} text={c.phone || "No phone"} />
            <Info
              icon={MapPin}
              text={
                [c.city, c.address].filter(Boolean).join(", ") || "No address"
              }
            />
            <Info
              icon={Package}
              text={`Customer since ${new Date(c.createdAt).toLocaleDateString()}`}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
function Info({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={17} className="mt-0.5 text-slate-400" />
      <span className="text-sm text-slate-600 dark:text-slate-300">{text}</span>
    </div>
  );
}
