import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, PackageSearch, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useProfile } from "../context/ProfileContext";
import { getProducts } from "../services/product.service";

const readSeen = () => {
  try {
    return JSON.parse(
      localStorage.getItem("stockflow-seen-notifications") || "[]",
    );
  } catch {
    return [];
  }
};

const Navbar = () => {
  const { user, profileImage } = useProfile();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(readSeen);

  const displayName = user?.name || "Admin";
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const { data } = useQuery({
    queryKey: ["navbar-stock-alerts"],
    queryFn: () => getProducts({ stockStatus: "all", page: 1, limit: 50 }),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const notifications = useMemo(() => {
    const products = data?.data || [];
    return products
      .filter((p) => p.status !== "In Stock")
      .map((p) => ({
        id: `stock-${p._id}-${p.status}-${p.stock}`,
        title: p.stock === 0 ? "Product is out of stock" : "Low stock alert",
        message: `${p.name} · ${p.stock} left (minimum ${p.minimumStock})`,
        type: p.stock === 0 ? "critical" : "warning",
      }))
      .slice(0, 8);
  }, [data]);

  const unread = notifications.filter((item) => !seen.includes(item.id)).length;

  useEffect(() => {
    localStorage.setItem(
      "stockflow-seen-notifications",
      JSON.stringify(seen.slice(-50)),
    );
  }, [seen]);

  const markAllRead = () =>
    setSeen((current) =>
      Array.from(
        new Set([...current, ...notifications.map((item) => item.id)]),
      ),
    );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="relative hidden w-full max-w-md sm:block">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search anything..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:bg-slate-900"
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 sm:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Search size={19} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setOpen((current) => !current)}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/20 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
            >
              <Bell
                size={19}
                className={
                  unread ? "animate-[wiggle_1.8s_ease-in-out_infinite]" : ""
                }
              />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 7, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 z-50 mt-2 w-[340px] max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Notifications
                      </p>
                      <p className="text-xs text-slate-500">
                        {unread
                          ? `${unread} unread stock alerts`
                          : "You're all caught up"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {unread > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          title="Mark all as read"
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                        >
                          <CheckCheck size={17} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <div className="px-6 py-10 text-center">
                        <PackageSearch
                          className="mx-auto text-slate-300"
                          size={30}
                        />
                        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          No alerts right now
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Your stock levels look healthy.
                        </p>
                      </div>
                    ) : (
                      notifications.map((item) => {
                        const isNew = !seen.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`flex gap-3 rounded-xl p-3 transition ${isNew ? "bg-blue-50/70 dark:bg-blue-500/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/70"}`}
                          >
                            <span
                              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.type === "critical" ? "bg-rose-500" : "bg-amber-500"}`}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {item.title}
                              </p>
                              <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {item.message}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-slate-800">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {displayName}
              </p>
              <p className="text-xs text-slate-400">
                {user?.role || "Administrator"}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm dark:bg-white dark:text-slate-900">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src="https://imgs.search.brave.com/BusPQb9nLSop7o-H0Z430q7-vz-dic3L5qMvP_dZtb4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzc0L2Ez/L2I2Lzc0YTNiNmE4/ODU2YjAwNGRmZmY4/MjRhZTk2NjhmZTli/LmpwZw"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
