import { motion } from "framer-motion";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: "#ORD-1024",
    customer: "Ali Khan",
    date: "Sep 06, 2026",
    amount: "$420.00",
    status: "Completed",
  },
  {
    id: "#ORD-1023",
    customer: "Hamza Ahmed",
    date: "Sep 06, 2026",
    amount: "$285.00",
    status: "Pending",
  },
  {
    id: "#ORD-1022",
    customer: "Usman Tariq",
    date: "Sep 05, 2026",
    amount: "$640.00",
    status: "Completed",
  },
  {
    id: "#ORD-1021",
    customer: "Bilal Shah",
    date: "Sep 05, 2026",
    amount: "$195.00",
    status: "Cancelled",
  },
  {
    id: "#ORD-1020",
    customer: "Ahmed Raza",
    date: "Sep 04, 2026",
    amount: "$875.00",
    status: "Completed",
  },
];

const statusStyles = {
  Completed:
    "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",

  Pending:
    "bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",

  Cancelled:
    "bg-rose-50 text-rose-600 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20",
};

const statusDots = {
  Completed: "bg-emerald-500",
  Pending: "bg-amber-500",
  Cancelled: "bg-rose-500",
};

const RecentOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="min-w-0 max-w-full overflow-hidden  rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20">
      {/* ================= HEADER ================= */}
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <ClipboardList size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold tracking-tight text-slate-900 dark:text-white">
              Recent Orders
            </h3>

            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              Latest customer orders
            </p>
          </div>
        </div>

        {/* View All */}
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View all
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="mt-6 min-w-0 max-w-full overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="w-[19%] pb-3 pl-2 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Order
              </th>

              <th className="w-[24%] pb-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Customer
              </th>

              <th className="w-[21%] pb-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Date
              </th>

              <th className="w-[17%] pb-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Amount
              </th>

              <th className="w-[19%] pb-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.07,
                  ease: "easeOut",
                }}
                className="group border-b border-slate-50 transition-colors duration-200 last:border-0 hover:bg-slate-50/70 dark:border-slate-800/70 dark:hover:bg-slate-800/40"
              >
                {/* Order */}
                <td className="max-w-0 py-4 pl-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/orders/${order.id.replace("#ORD-", "")}`)
                    }
                    className="block max-w-full truncate text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {order.id}
                  </button>
                </td>

                {/* Customer */}
                <td className="max-w-0 py-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
                      {order.customer.charAt(0)}
                    </div>

                    <span className="min-w-0 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                      {order.customer}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="max-w-0 py-4">
                  <span className="block truncate text-sm text-slate-500 dark:text-slate-400">
                    {order.date}
                  </span>
                </td>

                {/* Amount */}
                <td className="max-w-0 py-4">
                  <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                    {order.amount}
                  </span>
                </td>

                {/* Status */}
                <td className="max-w-0 py-4">
                  <span
                    className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${statusStyles[order.status]}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDots[order.status]}`}
                    />

                    <span className="truncate">{order.status}</span>
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
