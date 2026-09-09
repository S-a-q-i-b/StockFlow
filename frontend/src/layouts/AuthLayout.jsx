import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold shadow-lg shadow-blue-500/20">
              <img src="/logo.svg" alt="" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">StockFlow</h1>
              <p className="text-sm text-slate-400">
                Smart Inventory Management
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <span className="mb-5 inline-flex rounded-full border border-slate-800 bg-slate-900/70 px-4 py-1.5 text-sm text-slate-300 backdrop-blur">
              Inventory made simple
            </span>

            <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Manage your inventory
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                with confidence.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 xl:text-lg">
              Keep products, customers, orders and stock organized from one
              powerful dashboard.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="mt-1 text-xs text-slate-500">Organized</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="mt-1 text-xs text-slate-500">Accessible</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                <div className="text-2xl font-bold text-white">Fast</div>
                <div className="mt-1 text-xs text-slate-500">Workflow</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} StockFlow. All rights reserved.
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
