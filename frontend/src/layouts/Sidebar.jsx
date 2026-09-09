import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingCart,
  Tags,
  UserCircle,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: Tags,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    name: "Create Sale",
    path: "/sales",
    icon: ShoppingCart,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ClipboardList,
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: Warehouse,
  },
  {
    name: "Users",
    path: "/users",
    icon: UserCog,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) => {
  const { user, profileImage } = useProfile();
  const { isAdmin, logout } = useAuth();

  const displayName = user?.name || "Admin";

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleToggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50
        flex h-screen flex-col
        border-r border-slate-200
        bg-white shadow-sm
        transition-[width,transform]
        duration-300 ease-in-out

        dark:border-slate-800
        dark:bg-slate-950

        ${sidebarOpen ? "w-[260px]" : "w-[100px]"}

        ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className={`
          relative flex h-20 shrink-0 items-center
          border-b border-slate-200
          dark:border-slate-800

          ${sidebarOpen ? "px-4" : "justify-center px-2"}
        `}
      >
        {/* Brand */}
        <div
          className={`
            flex min-w-0
            transition-all duration-300

            ${sidebarOpen ? "w-full justify-start pr-10" : "w-full "}
          `}
        >
          <BrandLogo compact={!sidebarOpen} link />
        </div>

        {/* Desktop Toggle */}
        <button
          type="button"
          onClick={handleToggleSidebar}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={`
  absolute
  top-1/2
  left-14
  hidden
  h-9
  w-9
  -translate-y-1/2
  items-center
  justify-center
  rounded-lg
  border
  bg-white
  text-slate-500
  shadow-sm

  transition-[left,right,background-color,color,box-shadow,transform]
  duration-500
  ease-in-out

  hover:bg-slate-100
  hover:text-slate-900
  hover:shadow

  dark:bg-slate-900
  dark:text-slate-400
  dark:hover:bg-slate-800
  dark:hover:text-white

  lg:flex

  ${
    sidebarOpen
      ? "left-50 border-slate-200 dark:border-slate-700"
      : "right-[-18px] border-slate-300 dark:border-slate-700"
  }
`}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeftOpen size={18} />
          )}
        </button>

        {/* Mobile Close */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar"
          title="Close sidebar"
          className="
            absolute right-3 top-1/2
            flex h-9 w-9
            -translate-y-1/2
            items-center justify-center
            rounded-lg
            text-slate-500
            transition

            hover:bg-slate-100
            hover:text-slate-900

            dark:text-slate-400
            dark:hover:bg-slate-800
            dark:hover:text-white

            lg:hidden
          "
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className={`
          flex-1
          overflow-y-auto
          overflow-x-hidden
          py-4
          transition-all duration-300

          ${sidebarOpen ? "px-3" : "px-2"}
        `}
      >
        <div className="space-y-1.5">
          {menuItems
            .filter((item) => item.path !== "/users" || isAdmin)
            .map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={!sidebarOpen ? item.name : undefined}
                  className={({ isActive }) =>
                    `
                      group
                      flex
                      h-11
                      items-center
                      rounded-xl
                      text-sm
                      font-medium
                      transition-all
                      duration-200

                      ${
                        sidebarOpen
                          ? "w-full gap-3 px-3"
                          : "mx-auto w-12 justify-center px-0"
                      }

                      ${
                        isActive
                          ? `
                            bg-slate-900
                            text-white
                            shadow-sm

                            dark:bg-white
                            dark:text-slate-900
                          `
                          : `
                            text-slate-500

                            hover:bg-slate-100
                            hover:text-slate-900

                            dark:text-slate-400
                            dark:hover:bg-slate-900
                            dark:hover:text-white
                          `
                      }
                    `
                  }
                >
                  <Icon
                    size={19}
                    strokeWidth={1.9}
                    className="
                      shrink-0
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                  />

                  {sidebarOpen && (
                    <span className="truncate whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              );
            })}
        </div>
      </nav>

      {/* =====================================================
          BOTTOM USER SECTION
      ====================================================== */}

      <div
        className="
          shrink-0
          border-t
          border-slate-200
          p-3

          dark:border-slate-800
        "
      >
        <div
          className={`
            relative
            flex
            items-center
            rounded-xl
            bg-slate-50

            dark:bg-slate-900

            ${
              sidebarOpen
                ? "gap-3 p-3"
                : "mx-auto h-12 w-12 justify-center p-1.5"
            }
          `}
        >
          {/* Avatar */}
          <div
            className={`
              flex
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-lg
              bg-slate-900
              text-xs
              font-bold
              text-white

              dark:bg-white
              dark:text-slate-900

              ${sidebarOpen ? "h-9 w-9" : "h-9 w-9"}
            `}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* User Info */}
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-slate-800
                  dark:text-white
                "
              >
                {displayName}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.role || "Administrator"}
              </p>
            </div>
          )}

          {/* Logout */}
          {sidebarOpen && (
            <button
              type="button"
              title="Logout"
              aria-label="Logout"
              onClick={logout}
              className="
                shrink-0
                rounded-lg
                p-1.5
                text-slate-400
                transition

                hover:bg-red-50
                hover:text-red-500

                dark:hover:bg-red-500/10
              "
            >
              <LogOut size={17} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
