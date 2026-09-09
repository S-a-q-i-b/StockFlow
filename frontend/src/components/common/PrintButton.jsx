import { Printer } from "lucide-react";

export default function PrintButton({ label = "Print" }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-500/40 dark:hover:text-violet-400"
    >
      <Printer size={16} /> {label}
    </button>
  );
}
