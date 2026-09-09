import { motion } from "framer-motion";

const PageLoader = ({ fullScreen = true }) => (
  <div
    className={`${fullScreen ? "fixed inset-0 z-[99999]" : "absolute inset-0 z-50"} flex items-center justify-center bg-slate-50/95 backdrop-blur-xl dark:bg-slate-950/95`}
  >
    <div className="relative flex flex-col items-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-3xl border border-indigo-200 dark:border-indigo-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-2xl border border-violet-200 border-t-violet-500 dark:border-violet-500/20 dark:border-t-violet-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 shadow-2xl shadow-indigo-500/20 dark:bg-white">
          <img
            src="/logo.svg"
            alt="StockFlow"
            className="h-9 w-9 object-contain"
          />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 text-center"
      >
        <p className="text-sm font-bold tracking-wide text-slate-900 dark:text-white">
          StockFlow
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Loading your workspace...
        </p>
      </motion.div>
      <div className="mt-4 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  </div>
);

export default PageLoader;
