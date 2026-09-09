import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Warehouse,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import mobileImage from "../assets/668537032299073381fc6c60_Iphone Screen Dark Blue2.png";
import laptopImage from "../assets/Gemini_Generated_Image_9gd7c49gd7c49gd7.jpg";

const LAPTOP_IMAGE = laptopImage;
const MOBILE_IMAGE = mobileImage;

const SECOND_FEATURE_IMAGE =
  "https://cdn.prod.website-files.com/6634dcf5ae26e4b0977d0ac1/6634dcf5ae26e4b0977d0b41_Second%20Feature%20Image.png";

const BUSINESS_OWNER_IMAGE =
  "https://cdn.prod.website-files.com/6634dcf5ae26e4b0977d0ac1/6655af83d18936badf259a3b_business-owner.jpg";

const stats = [
  {
    value: "10K+",
    label: "Products Managed",
  },
  {
    value: "98%",
    label: "Inventory Accuracy",
  },
  {
    value: "24/7",
    label: "Business Visibility",
  },
  {
    value: "50+",
    label: "Business Tools",
  },
];

const features = [
  {
    icon: Package,
    title: "Smart Inventory",
    description:
      "Track your products, stock levels and inventory movements from one powerful dashboard.",
  },
  {
    icon: ShoppingCart,
    title: "Easy Sales",
    description:
      "Create sales, manage customers and keep your entire sales process organized.",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description:
      "Understand your business with clear reports, charts and real-time performance insights.",
  },
  {
    icon: Users,
    title: "Customer Management",
    description:
      "Keep customer information, purchase history and activity organized in one place.",
  },
  {
    icon: Warehouse,
    title: "Stock Control",
    description:
      "Know exactly what is available, what is running low and what needs attention.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "Keep your business data protected with secure authentication and role-based access.",
  },
];

const benefits = [
  "Real-time inventory visibility",
  "Low-stock alerts",
  "Simple product management",
  "Customer purchase history",
  "Sales and revenue analytics",
  "Order management",
];

const steps = [
  {
    number: "01",
    title: "Add your products",
    description:
      "Create your products with prices, stock quantities, categories and important details.",
  },
  {
    number: "02",
    title: "Manage your sales",
    description:
      "Create sales, select customers and products, and keep every transaction organized.",
  },
  {
    number: "03",
    title: "Grow your business",
    description:
      "Use analytics and inventory insights to make smarter decisions for your business.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? "/dashboard" : "/login");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
          <nav className="flex h-16 items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.svg"
                alt="StockFlow"
                className="h-10 w-10 object-contain"
              />

              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Stock<span className="text-indigo-600">Flow</span>
                </h1>
              </div>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              <a
                href="#features"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                How it works
              </a>

              <a
                href="#benefits"
                className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Benefits
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Login
              </Link>

              <button
                onClick={handleGetStarted}
                className="group flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-600 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                Get Started
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden pt-36">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
                <Sparkles size={14} />
                Modern inventory management
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Manage your business
                <span className="block text-indigo-600">
                  without the chaos.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                StockFlow gives you everything you need to manage products,
                inventory, customers, sales and orders — all from one simple
                platform.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleGetStarted}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Start managing inventory
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>

                <a
                  href="#features"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Explore features
                  <ChevronRight size={16} />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {["Easy to use", "Fast setup", "Business focused"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                    >
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-2xl">
                <div className="absolute -inset-10 rounded-full bg-indigo-500/15 blur-3xl" />

                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2 shadow-2xl shadow-slate-900/15 dark:border-slate-800 dark:bg-slate-900">
                  <div className="relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                    <div className="absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950">
                      <div className="text-center">
                        <Package
                          size={45}
                          className="mx-auto text-indigo-400"
                        />

                        <p className="mt-3 text-sm font-semibold text-white">
                          StockFlow Dashboard
                        </p>
                      </div>
                    </div>

                    <img
                      src={LAPTOP_IMAGE}
                      alt="StockFlow dashboard"
                      className="relative z-10 block aspect-[16/10] h-full w-full object-cover object-top"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>

                <motion.img
                  src={MOBILE_IMAGE}
                  alt="StockFlow mobile dashboard"
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: [0, -12, 0],
                  }}
                  transition={{
                    opacity: {
                      duration: 0.7,
                      delay: 0.4,
                    },
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute -bottom-16 -right-2 z-20 w-[145px] object-contain drop-shadow-2xl sm:-right-5 sm:w-[170px] lg:-right-10 lg:w-[190px]"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.8,
                  }}
                  className="absolute -bottom-10 left-3 z-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
                      <TrendingUp size={17} className="text-emerald-500" />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Revenue
                      </p>

                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        +24.8%
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-10 sm:grid-cols-4 lg:px-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="border-slate-200 px-5 py-4 text-center sm:border-r last:border-r-0 dark:border-slate-800"
            >
              <p className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-28 px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              Everything you need
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              One platform.
              <span className="block text-slate-400 dark:text-slate-600">
                Complete control.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
              StockFlow brings your most important business operations into one
              clean and easy-to-use workspace.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-60px",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Warehouse size={20} />
            </div>

            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Know your inventory.
              <span className="block text-slate-400 dark:text-slate-600">
                At a glance.
              </span>
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-slate-600 dark:text-slate-400">
              Stop guessing how much stock you have. StockFlow gives you a clear
              picture of your inventory so you can make better decisions before
              problems happen.
            </p>

            <div className="mt-8 space-y-4">
              {benefits.slice(0, 3).map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-indigo-600"
                  />

                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-3xl bg-indigo-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <img
                src={SECOND_FEATURE_IMAGE}
                alt="StockFlow inventory management"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="benefits"
        className="scroll-mt-28 bg-slate-950 px-5 py-24 text-white lg:px-8 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-400">
              Built for growing businesses
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Less time managing stock.
              <span className="block text-slate-500">More time growing.</span>
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-slate-400">
              Whether you run a small shop or a growing business, StockFlow
              keeps your operations organized and gives you the information you
              need to move faster.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-indigo-400"
                  />

                  <span className="text-sm font-medium text-slate-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <img
                src={BUSINESS_OWNER_IMAGE}
                alt="Business owner using StockFlow"
                className="h-[430px] w-full object-cover opacity-50"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                    <TrendingUp size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Smarter business decisions
                    </p>

                    <p className="text-xs text-slate-400">
                      Powered by your business data
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-28 px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Simple from day one.
            </h2>

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              Get your inventory under control in just a few simple steps.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="relative rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-5xl font-bold tracking-tight text-slate-100 dark:text-slate-800">
                  {step.number}
                </span>

                <h3 className="mt-7 text-xl font-bold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-indigo-600 px-7 py-16 text-center text-white sm:px-12 lg:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-950/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <Sparkles size={25} className="mx-auto text-indigo-200" />

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to take control?
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-indigo-100">
              Start organizing your products, sales and inventory with StockFlow
              today.
            </p>

            <button
              onClick={handleGetStarted}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Get started with StockFlow
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-10 dark:border-slate-800 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="StockFlow"
              className="h-9 w-9 object-contain"
            />

            <div>
              <p className="font-bold">
                Stock<span className="text-indigo-600">Flow</span>
              </p>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Inventory Management
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <a href="#features" className="transition hover:text-indigo-600">
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-indigo-600"
            >
              How it works
            </a>

            <Link to="/login" className="transition hover:text-indigo-600">
              Login
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} StockFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
