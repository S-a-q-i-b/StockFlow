import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { day: "Mon", sales: 4200 },
  { day: "Tue", sales: 5800 },
  { day: "Wed", sales: 4900 },
  { day: "Thu", sales: 7200 },
  { day: "Fri", sales: 6400 },
  { day: "Sat", sales: 8500 },
  { day: "Sun", sales: 7900 },
];

const SalesChart = () => {
  return (
    <div className="mt-6">
      {/* ================= CHART ================= */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              {/* Area Gradient */}
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />

                <stop offset="50%" stopColor="#6366f1" stopOpacity={0.12} />

                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>

              {/* Line Gradient */}
              <linearGradient
                id="salesLineGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>

            {/* ================= GRID ================= */}
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="5 5"
            />

            {/* ================= X AXIS ================= */}
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
                fontWeight: 500,
              }}
            />

            {/* ================= Y AXIS ================= */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              width={55}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
                fontWeight: 500,
              }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            {/* ================= TOOLTIP ================= */}
            <Tooltip
              cursor={{
                stroke: "#c7d2fe",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Sales",
              ]}
              labelStyle={{
                color: "#0f172a",
                fontWeight: 600,
                marginBottom: "4px",
              }}
              itemStyle={{
                color: "#4f46e5",
                fontWeight: 600,
              }}
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                background: "rgba(255, 255, 255, 0.96)",
                boxShadow: "0 12px 35px rgba(15, 23, 42, 0.12)",
                padding: "10px 14px",
              }}
            />

            {/* ================= SALES AREA ================= */}
            <Area
              type="monotone"
              dataKey="sales"
              stroke="url(#salesLineGradient)"
              strokeWidth={3}
              fill="url(#salesGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "#4f46e5",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
