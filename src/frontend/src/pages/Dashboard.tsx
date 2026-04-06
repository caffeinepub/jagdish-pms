import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  Percent,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useGetAllFunds,
  useGetHoldings,
  useGetPortfolioSummary,
} from "../hooks/useQueries";
import {
  calcGainPercent,
  categoryLabel,
  formatINR,
  formatPercent,
  formatUnits,
} from "../utils/format";

const CHART_COLORS = [
  "oklch(0.58 0.19 255)",
  "oklch(0.55 0.16 145)",
  "oklch(0.65 0.20 45)",
  "oklch(0.60 0.18 310)",
];

const CATEGORY_COLORS: Record<string, string> = {
  equity: "oklch(0.58 0.19 255)",
  debt: "oklch(0.55 0.16 145)",
  hybrid: "oklch(0.65 0.20 45)",
  elss: "oklch(0.60 0.18 310)",
};

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetPortfolioSummary();
  const { data: funds } = useGetAllFunds();
  const { data: holdings } = useGetHoldings();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const gainPercent = summary
    ? calcGainPercent(summary.investedAmount, summary.currentValue)
    : 0;

  const kpiCards = [
    {
      label: "Total Investment",
      value: summary ? formatINR(summary.investedAmount) : "\u20b90.00",
      icon: DollarSign,
      color: "oklch(0.40 0.12 240)",
    },
    {
      label: "Current Value",
      value: summary ? formatINR(summary.currentValue) : "\u20b90.00",
      icon: TrendingUp,
      color: "oklch(0.42 0.14 185)",
    },
    {
      label: "Total Gain / Loss",
      value: summary ? formatINR(summary.gainLoss) : "\u20b90.00",
      icon: summary && summary.gainLoss >= 0n ? TrendingUp : TrendingDown,
      color:
        summary && summary.gainLoss >= 0n
          ? "oklch(0.42 0.16 145)"
          : "oklch(0.50 0.22 25)",
    },
    {
      label: "Portfolio Returns",
      value: summary ? formatPercent(gainPercent) : "0.00%",
      icon: Percent,
      color: gainPercent >= 0 ? "oklch(0.42 0.16 145)" : "oklch(0.50 0.22 25)",
    },
  ];

  const allocationData = useMemo(() => {
    if (!summary || !funds) return [];
    const catMap: Record<string, number> = {};
    for (const h of summary.holdings) {
      const fund = funds.find((f) => f.id === h.fundId);
      const cat = fund?.category ?? "equity";
      catMap[cat] = (catMap[cat] ?? 0) + Number(h.currentValue) / 100;
    }
    return Object.entries(catMap).map(([cat, value]) => ({
      name: categoryLabel(cat),
      value: Math.round(value),
      cat,
    }));
  }, [summary, funds]);

  const trendData = useMemo(() => {
    if (!summary) return [];
    const invested = Number(summary.investedAmount) / 100;
    const current = Number(summary.currentValue) / 100;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => ({
      day,
      value: Math.round(
        invested + (current - invested) * (i / (days.length - 1)),
      ),
    }));
  }, [summary]);

  const holdingsWithFunds = useMemo(() => {
    if (!holdings || !funds || !summary) return [];
    return holdings.map((h) => {
      const fund = funds.find((f) => f.id === h.fundId);
      const summaryH = summary.holdings.find((s) => s.fundId === h.fundId);
      return { ...h, fund, summaryH };
    });
  }, [holdings, funds, summary]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header-divider">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{dateStr}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
          >
            <div
              className="stat-card p-5"
              data-ocid={`dashboard.kpi.card.${idx + 1}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {label}
                  </p>
                  {summaryLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <p
                      className="text-2xl font-extrabold leading-tight tracking-tight"
                      style={{ color }}
                    >
                      {value}
                    </p>
                  )}
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
                  style={{
                    background: `color-mix(in oklch, ${color} 12%, transparent)`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Holdings table card */}
        <Card
          className="page-card border-0 shadow-none xl:col-span-2"
          data-ocid="dashboard.holdings.table"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Mutual Fund Holdings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header-row">
                    {[
                      "Fund Name",
                      "Category",
                      "Units",
                      "Avg NAV",
                      "Current NAV",
                      "Current Value",
                      "Gain/Loss",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdingsWithFunds.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-12 text-muted-foreground"
                        data-ocid="dashboard.holdings.empty_state"
                      >
                        No holdings yet. Add transactions to get started.
                      </td>
                    </tr>
                  )}
                  {holdingsWithFunds.map((h, i) => {
                    const gp = h.summaryH
                      ? calcGainPercent(
                          h.summaryH.amountInvested,
                          h.summaryH.currentValue,
                        )
                      : 0;
                    return (
                      <tr
                        key={h.fundId}
                        data-ocid={`dashboard.holdings.item.${i + 1}`}
                        style={{
                          borderBottom: "1px solid oklch(0.94 0.006 230)",
                        }}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-medium text-slate-800">
                          {h.fund?.name ?? h.fundId}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge variant="secondary" className="text-xs">
                            {categoryLabel(h.fund?.category ?? "")}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 tabular-nums">
                          {formatUnits(h.units)}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums">
                          \u20b9{(Number(h.avgCostNav) / 100).toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums">
                          \u20b9
                          {h.fund
                            ? (Number(h.fund.currentNav) / 100).toFixed(2)
                            : "-"}
                        </td>
                        <td className="px-4 py-2.5 font-semibold tabular-nums">
                          {h.summaryH
                            ? formatINR(h.summaryH.currentValue)
                            : "-"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`font-semibold tabular-nums ${
                              gp >= 0 ? "gain-text" : "loss-text"
                            }`}
                          >
                            {formatPercent(gp)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Side charts */}
        <div className="space-y-4">
          <Card
            className="page-card border-0 shadow-none"
            data-ocid="dashboard.allocation.card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <PieChart className="w-4 h-4" /> Portfolio Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allocationData.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                  No data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <RechartsPie>
                    <Pie
                      data={allocationData}
                      innerRadius={50}
                      outerRadius={75}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {allocationData.map((entry) => (
                        <Cell
                          key={entry.cat}
                          fill={CATEGORY_COLORS[entry.cat] ?? CHART_COLORS[0]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => [
                        `\u20b9${v.toLocaleString("en-IN")}`,
                        "Value",
                      ]}
                    />
                    <Legend iconSize={8} iconType="circle" />
                  </RechartsPie>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card
            className="page-card border-0 shadow-none"
            data-ocid="dashboard.trend.card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <TrendingUp className="w-4 h-4" /> Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trendData.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                  No data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={trendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.91 0.008 240)"
                    />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `\u20b9${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(v: number) => [
                        `\u20b9${v.toLocaleString("en-IN")}`,
                        "Value",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="oklch(0.52 0.13 185)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
