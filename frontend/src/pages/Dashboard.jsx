import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CircleDollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AnimatedSelect from "../components/common/AnimatedSelect";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../services/dashboard.service";
const ranges = [
  ["7d", "Last 7 days"],
  ["30d", "Last 30 days"],
  ["6m", "Last 6 months"],
  ["12m", "Last 12 months"],
];
const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

function Dashboard() {
  const { user } = useAuth();
  const [range, setRange] = useState("7d");
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", range],
    queryFn: () => getDashboard({ range }),
    refetchInterval: 60000,
  });
  const d = data?.data;
  const stats = d?.stats || {};
  const chart = d?.chart || [];
  const cards = [
    ["Products", stats.totalProducts || 0, Package],
    ["Customers", stats.totalCustomers || 0, Users],
    ["Sales", stats.totalSales || 0, ShoppingCart],
    ["Revenue", money(stats.totalRevenue), CircleDollarSign],
    ["Profit", money(stats.totalProfit), TrendingUp],
    ["Low Stock", stats.lowStock || 0, AlertTriangle],
  ];
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {" "}
        <div>
          {" "}
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
            {" "}
            Overview{" "}
          </p>{" "}
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
            {" "}
            Good to see you, {user?.name || "there"} 👋{" "}
          </h1>{" "}
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {" "}
            Live business performance from your StockFlow database.{" "}
          </p>{" "}
        </div>{" "}
        <div className="w-full sm:w-48">
          {" "}
          <AnimatedSelect
            value={range}
            onChange={setRange}
            options={ranges.map(([value, label]) => ({ value, label }))}
          />{" "}
        </div>{" "}
      </div>{" "}
      {/* Error */}{" "}
      {error && (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          {" "}
          Unable to load dashboard data.{" "}
        </div>
      )}{" "}
      {/* Stats Cards */}{" "}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {" "}
        {cards.map(([label, value, Icon]) => (
          <div
            key={label}
            className="sf-hover-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <div>
                {" "}
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {" "}
                  {label}{" "}
                </p>{" "}
                <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                  {" "}
                  {isLoading ? "—" : value}{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                {" "}
                <Icon size={20} />{" "}
              </div>{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {/* Main Content */}{" "}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        {" "}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {" "}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {" "}
            <div>
              {" "}
              <h2 className="font-bold text-slate-900 dark:text-white">
                {" "}
                Sales, Revenue & Profit{" "}
              </h2>{" "}
              <p className="mt-1 text-xs text-slate-500">
                {" "}
                Completed sales for the selected range.{" "}
              </p>{" "}
              {/* Legend */}{" "}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />{" "}
                  <span className="text-slate-500">Revenue</span>{" "}
                </div>{" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{" "}
                  <span className="text-slate-500">Profit</span>{" "}
                </div>{" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />{" "}
                  <span className="text-slate-500">
                    {" "}
                    Orders shown on hover{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Summary */}{" "}
            <div className="grid grid-cols-3 gap-5">
              {" "}
              <div className="text-left sm:text-right">
                {" "}
                <p className="text-xs text-slate-500">Revenue</p>{" "}
                <p className="text-sm font-bold text-violet-600">
                  {" "}
                  {money(stats.totalRevenue)}{" "}
                </p>{" "}
              </div>{" "}
              <div className="text-left sm:text-right">
                {" "}
                <p className="text-xs text-slate-500">Profit</p>{" "}
                <p className="text-sm font-bold text-emerald-600">
                  {" "}
                  {money(stats.totalProfit)}{" "}
                </p>{" "}
              </div>{" "}
              <div className="text-left sm:text-right">
                {" "}
                <p className="text-xs text-slate-500">Orders</p>{" "}
                <p className="text-sm font-bold text-sky-600">
                  {" "}
                  {stats.totalSales || 0}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-6 h-80 w-full">
            {" "}
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                {" "}
                Loading chart...{" "}
              </div>
            ) : chart.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                {" "}
                No completed sales found for this range.{" "}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {" "}
                <AreaChart
                  data={chart}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  {" "}
                  <defs>
                    {" "}
                    {/* Revenue Gradient */}{" "}
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      {" "}
                      <stop
                        offset="0%"
                        stopColor="#7c3aed"
                        stopOpacity={0.25}
                      />{" "}
                      <stop
                        offset="100%"
                        stopColor="#7c3aed"
                        stopOpacity={0}
                      />{" "}
                    </linearGradient>{" "}
                    {/* Profit Gradient */}{" "}
                    <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                      {" "}
                      <stop
                        offset="0%"
                        stopColor="#10b981"
                        stopOpacity={0.2}
                      />{" "}
                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity={0}
                      />{" "}
                    </linearGradient>{" "}
                  </defs>{" "}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />{" "}
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />{" "}
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} />{" "}
                  <Tooltip
                    cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }}
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    labelStyle={{
                      fontWeight: 700,
                      marginBottom: "6px",
                      color: "#0f172a",
                    }}
                    formatter={(value, name) => {
                      if (name === "revenue") {
                        return [money(value), "Revenue"];
                      }
                      if (name === "profit") {
                        return [money(value), "Profit"];
                      }
                      if (name === "orders") {
                        return [value, "Orders"];
                      }
                      return [value, name];
                    }}
                  />{" "}
                  {/* Revenue */}{" "}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="#7c3aed"
                    fill="url(#revenueFill)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />{" "}
                  {/* Profit */}{" "}
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="profit"
                    stroke="#10b981"
                    fill="url(#profitFill)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />{" "}
                </AreaChart>{" "}
              </ResponsiveContainer>
            )}{" "}
          </div>{" "}
        </section>{" "}
        {/* Low Stock */}{" "}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <h2 className="font-bold text-slate-900 dark:text-white">
                {" "}
                Low Stock{" "}
              </h2>{" "}
              <p className="mt-1 text-xs text-slate-500">
                {" "}
                Items that need attention.{" "}
              </p>{" "}
            </div>{" "}
            <Link
              to="/inventory"
              className="text-xs font-semibold text-violet-600"
            >
              {" "}
              View all{" "}
            </Link>{" "}
          </div>{" "}
          <div className="mt-5 space-y-3">
            {" "}
            {(d?.lowStockProducts || []).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
              >
                {" "}
                <div>
                  {" "}
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {" "}
                    {product.name}{" "}
                  </p>{" "}
                  <p className="text-xs text-slate-500"> {product.sku} </p>{" "}
                </div>{" "}
                <span
                  className={`text-sm font-bold ${product.stock === 0 ? "text-rose-600" : "text-amber-600"}`}
                >
                  {" "}
                  {product.stock} left{" "}
                </span>{" "}
              </div>
            ))}{" "}
            {!isLoading && (d?.lowStockProducts || []).length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                {" "}
                Stock levels look healthy.{" "}
              </p>
            )}{" "}
          </div>{" "}
        </section>{" "}
      </div>{" "}
    </div>
  );
}
export default Dashboard;
