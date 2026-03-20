import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EntryRow {
  id: string;
  name: string;
  amount: string;
}

function makeRow(name: string): EntryRow {
  return { id: crypto.randomUUID(), name, amount: "" };
}

const INITIAL_BROKERS: EntryRow[] = [
  makeRow("Zerodha"),
  makeRow("Groww"),
  makeRow("HDFC Securities"),
  makeRow("ICICI Direct"),
  makeRow("Angel One"),
];

const INITIAL_AMCS: EntryRow[] = [
  makeRow("SBI MF"),
  makeRow("HDFC MF"),
  makeRow("ICICI Prudential MF"),
  makeRow("Nippon India MF"),
  makeRow("Axis MF"),
];

const INITIAL_DISTRIBUTORS: EntryRow[] = [
  makeRow("NJ Wealth"),
  makeRow("Prudent Corporate"),
  makeRow("IIFL Wealth"),
  makeRow("Axis MF Direct"),
  makeRow("Bajaj Capital"),
];

function formatINR(val: number): string {
  if (val === 0) return "₹0";
  return `₹${val.toLocaleString("en-IN")}`;
}

function parseAmount(s: string): number {
  const n = Number.parseFloat(s.replace(/,/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

function sumRows(rows: EntryRow[]): number {
  return rows.reduce((acc, r) => acc + parseAmount(r.amount), 0);
}

interface EntryTableProps {
  rows: EntryRow[];
  onChange: (rows: EntryRow[]) => void;
  ocidPrefix: string;
}

function EntryTable({ rows, onChange, ocidPrefix }: EntryTableProps) {
  const total = sumRows(rows);

  const updateRow = (id: string, field: "name" | "amount", value: string) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const deleteRow = (id: string) => {
    onChange(rows.filter((r) => r.id !== id));
  };

  const addRow = () => {
    onChange([...rows, makeRow("")]);
  };

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid oklch(0.88 0.015 220)" }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-[1fr_160px_44px] gap-0"
          style={{
            background: "oklch(0.28 0.075 240)",
            padding: "10px 14px",
          }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "oklch(0.75 0.04 220)" }}
          >
            Name
          </span>
          <span
            className="text-xs font-semibold uppercase tracking-wider text-right pr-2"
            style={{ color: "oklch(0.75 0.04 220)" }}
          >
            Invested (INR)
          </span>
          <span />
        </div>

        {/* Rows */}
        {rows.map((row, idx) => (
          <div
            key={row.id}
            data-ocid={`${ocidPrefix}.item.${idx + 1}`}
            className="grid grid-cols-[1fr_160px_44px] gap-0 items-center"
            style={{
              borderTop: "1px solid oklch(0.91 0.01 220)",
              background:
                idx % 2 === 0
                  ? "oklch(0.985 0.006 240)"
                  : "oklch(0.975 0.008 230)",
              padding: "6px 14px",
            }}
          >
            <input
              type="text"
              value={row.name}
              onChange={(e) => updateRow(row.id, "name", e.target.value)}
              placeholder="Enter name..."
              data-ocid={`${ocidPrefix}.input.${idx + 1}`}
              className="text-sm bg-transparent outline-none w-full"
              style={{ color: "oklch(0.25 0.04 240)" }}
            />
            <div className="flex items-center gap-1 justify-end">
              <span
                className="text-sm"
                style={{ color: "oklch(0.52 0.10 185)" }}
              >
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={row.amount}
                onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                placeholder="0"
                data-ocid={`${ocidPrefix}.amount.${idx + 1}`}
                className="text-sm bg-transparent outline-none text-right w-28"
                style={{ color: "oklch(0.22 0.05 240)" }}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                data-ocid={`${ocidPrefix}.delete_button.${idx + 1}`}
                onClick={() => deleteRow(row.id)}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                style={{ color: "oklch(0.55 0.18 25)" }}
                title="Remove row"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div
            className="py-8 text-center text-sm"
            style={{
              color: "oklch(0.60 0.02 240)",
              borderTop: "1px solid oklch(0.91 0.01 220)",
            }}
            data-ocid={`${ocidPrefix}.empty_state`}
          >
            No entries yet. Click "Add Row" to begin.
          </div>
        )}

        {/* Subtotal */}
        <div
          className="grid grid-cols-[1fr_160px_44px] gap-0 items-center"
          style={{
            borderTop: "2px solid oklch(0.85 0.02 220)",
            background: "oklch(0.96 0.012 235)",
            padding: "10px 14px",
          }}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: "oklch(0.35 0.05 240)" }}
          >
            Subtotal
          </span>
          <span
            className="text-sm font-bold text-right pr-2"
            style={{ color: "oklch(0.28 0.075 240)" }}
          >
            {formatINR(total)}
          </span>
          <span />
        </div>
      </div>

      <button
        type="button"
        data-ocid={`${ocidPrefix}.button`}
        onClick={addRow}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{
          background: "oklch(0.52 0.13 185 / 0.12)",
          color: "oklch(0.38 0.10 185)",
          border: "1px dashed oklch(0.52 0.13 185 / 0.40)",
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Row
      </button>
    </div>
  );
}

const CHART_COLORS = [
  "oklch(0.52 0.13 185)",
  "oklch(0.45 0.12 240)",
  "oklch(0.58 0.15 145)",
];

export default function DistributorEntry() {
  const [brokers, setBrokers] = useState<EntryRow[]>(INITIAL_BROKERS);
  const [amcs, setAmcs] = useState<EntryRow[]>(INITIAL_AMCS);
  const [distributors, setDistributors] =
    useState<EntryRow[]>(INITIAL_DISTRIBUTORS);

  const brokerTotal = sumRows(brokers);
  const amcTotal = sumRows(amcs);
  const distributorTotal = sumRows(distributors);
  const grandTotal = brokerTotal + amcTotal + distributorTotal;

  const chartData = [
    { name: "Brokers", value: brokerTotal },
    { name: "AMC Direct", value: amcTotal },
    { name: "Nat. Distributors", value: distributorTotal },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.52 0.13 185 / 0.15)" }}
        >
          <Building2
            className="w-5 h-5"
            style={{ color: "oklch(0.45 0.12 185)" }}
          />
        </div>
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "oklch(0.22 0.05 240)" }}
          >
            Distributor Entry
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "oklch(0.52 0.018 240)" }}
          >
            Track investments by broker, AMC, and national distributor
          </p>
        </div>
        <div className="ml-auto">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: "oklch(0.45 0.12 240 / 0.12)",
              color: "oklch(0.38 0.10 240)",
            }}
          >
            Elite v3
          </span>
        </div>
      </div>

      <Tabs defaultValue="broker" data-ocid="distributor.tab">
        <TabsList
          className="mb-4"
          style={{
            background: "oklch(0.93 0.015 230)",
            border: "1px solid oklch(0.88 0.015 220)",
          }}
        >
          <TabsTrigger
            value="broker"
            data-ocid="distributor.broker.tab"
            className="data-[state=active]:bg-white"
          >
            Broker
          </TabsTrigger>
          <TabsTrigger
            value="amc"
            data-ocid="distributor.amc.tab"
            className="data-[state=active]:bg-white"
          >
            AMC
          </TabsTrigger>
          <TabsTrigger
            value="national-distributor"
            data-ocid="distributor.national_distributor.tab"
            className="data-[state=active]:bg-white"
          >
            National Distributor
          </TabsTrigger>
          <TabsTrigger
            value="sum"
            data-ocid="distributor.sum.tab"
            className="data-[state=active]:bg-white"
          >
            Sum
          </TabsTrigger>
        </TabsList>

        {/* Broker Tab */}
        <TabsContent value="broker" className="mt-0">
          <Card style={{ border: "1px solid oklch(0.88 0.015 220)" }}>
            <CardHeader className="pb-3">
              <CardTitle
                className="text-base"
                style={{ color: "oklch(0.28 0.075 240)" }}
              >
                Broker-wise Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EntryTable
                rows={brokers}
                onChange={setBrokers}
                ocidPrefix="distributor.broker"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AMC Tab */}
        <TabsContent value="amc" className="mt-0">
          <Card style={{ border: "1px solid oklch(0.88 0.015 220)" }}>
            <CardHeader className="pb-3">
              <CardTitle
                className="text-base"
                style={{ color: "oklch(0.28 0.075 240)" }}
              >
                AMC Direct Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EntryTable
                rows={amcs}
                onChange={setAmcs}
                ocidPrefix="distributor.amc"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* National Distributor Tab */}
        <TabsContent value="national-distributor" className="mt-0">
          <Card style={{ border: "1px solid oklch(0.88 0.015 220)" }}>
            <CardHeader className="pb-3">
              <CardTitle
                className="text-base"
                style={{ color: "oklch(0.28 0.075 240)" }}
              >
                National Distributor Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EntryTable
                rows={distributors}
                onChange={setDistributors}
                ocidPrefix="distributor.national"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sum Tab */}
        <TabsContent value="sum" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Summary table */}
            <Card style={{ border: "1px solid oklch(0.88 0.015 220)" }}>
              <CardHeader className="pb-3">
                <CardTitle
                  className="text-base"
                  style={{ color: "oklch(0.28 0.075 240)" }}
                >
                  Investment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <div
                  className="rounded-xl overflow-hidden mx-4"
                  style={{ border: "1px solid oklch(0.88 0.015 220)" }}
                  data-ocid="distributor.sum.table"
                >
                  {[
                    {
                      label: "Total via Brokers",
                      value: brokerTotal,
                      color: CHART_COLORS[0],
                    },
                    {
                      label: "Total via AMC Direct",
                      value: amcTotal,
                      color: CHART_COLORS[1],
                    },
                    {
                      label: "Total via National Distributors",
                      value: distributorTotal,
                      color: CHART_COLORS[2],
                    },
                  ].map((row, idx) => (
                    <div
                      key={row.label}
                      data-ocid={`distributor.sum.row.${idx + 1}`}
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        borderBottom: "1px solid oklch(0.91 0.01 220)",
                        background:
                          idx % 2 === 0
                            ? "oklch(0.985 0.006 240)"
                            : "oklch(0.975 0.008 230)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: row.color }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: "oklch(0.35 0.04 240)" }}
                        >
                          {row.label}
                        </span>
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "oklch(0.28 0.075 240)" }}
                      >
                        {formatINR(row.value)}
                      </span>
                    </div>
                  ))}
                  {/* Grand Total */}
                  <div
                    className="flex items-center justify-between px-4 py-3.5"
                    style={{
                      background: "oklch(0.28 0.075 240)",
                    }}
                    data-ocid="distributor.sum.grand_total.row"
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: "oklch(0.92 0.015 220)" }}
                    >
                      Grand Total
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "oklch(0.92 0.015 220)" }}
                    >
                      {formatINR(grandTotal)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="space-y-5">
              <Card style={{ border: "1px solid oklch(0.88 0.015 220)" }}>
                <CardHeader className="pb-2">
                  <CardTitle
                    className="text-base"
                    style={{ color: "oklch(0.28 0.075 240)" }}
                  >
                    Breakdown (Bar)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.88 0.015 220)"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "oklch(0.52 0.018 240)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "oklch(0.52 0.018 240)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                          v >= 100000
                            ? `₹${(v / 100000).toFixed(1)}L`
                            : v >= 1000
                              ? `₹${(v / 1000).toFixed(0)}K`
                              : `₹${v}`
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatINR(value),
                          "Invested",
                        ]}
                        contentStyle={{
                          background: "oklch(0.985 0.006 240)",
                          border: "1px solid oklch(0.88 0.015 220)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card style={{ border: "1px solid oklch(0.88 0.015 220)" }}>
                <CardHeader className="pb-2">
                  <CardTitle
                    className="text-base"
                    style={{ color: "oklch(0.28 0.075 240)" }}
                  >
                    Share (Pie)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          formatINR(value),
                          "Invested",
                        ]}
                        contentStyle={{
                          background: "oklch(0.985 0.006 240)",
                          border: "1px solid oklch(0.88 0.015 220)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "oklch(0.42 0.03 240)",
                            }}
                          >
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
