import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconBg = "bg-blue-50 dark:bg-blue-500/10",
  iconColor = "text-blue-600 dark:text-blue-400",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className="
        min-w-0 max-w-full overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all duration-300
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:shadow-black/20
      "
    >
      <div className="flex min-w-0 items-start justify-between gap-4">

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h2>
        </div>

       
        <div
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-xl
            ${iconBg}
            ${iconColor}
          `}
        >
          <Icon size={21} strokeWidth={2} />
        </div>
      </div>


      <div className="mt-4 flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {change}
        </span>

        <span className="truncate text-xs text-slate-400 dark:text-slate-500">
          vs last month
        </span>
      </div>
    </motion.div>
  );
};

export default StatCard;
