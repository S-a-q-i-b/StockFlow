import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      <div
        className={`
          min-h-screen min-w-0 overflow-x-hidden
          transition-all duration-300
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        <Navbar />

        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed bottom-5 left-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl lg:hidden dark:bg-white dark:text-slate-900"
          aria-label="Open sidebar"
        >
          <span className="text-xl">☰</span>
        </button>

        <main className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
