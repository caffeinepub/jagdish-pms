import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Banknote,
  Calculator,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function formatINRFull(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

const COMPOUNDING_OPTIONS = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Half-Yearly" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
];

export default function FdLumpsumCalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [durationYears, setDurationYears] = useState(5);
  const [compFreq, setCompFreq] = useState("4");

  const n = Number(compFreq);

  const { maturityValue, totalGain, yearRows } = useMemo(() => {
    const r = annualReturn / 100;
    const t = durationYears;
    const finalValue = principal * (1 + r / n) ** (n * t);
    const gain = finalValue - principal;

    const rows = Array.from({ length: t }, (_, i) => {
      const yr = i + 1;
      const val = principal * (1 + r / n) ** (n * yr);
      return { year: yr, value: val, gain: val - principal };
    });

    return { maturityValue: finalValue, totalGain: gain, yearRows: rows };
  }, [principal, annualReturn, durationYears, n]);

  const principalPct = (principal / maturityValue) * 100;
  const gainPct = (totalGain / maturityValue) * 100;

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: "oklch(0.97 0.006 220)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: "oklch(0.52 0.13 185 / 0.12)",
              color: "oklch(0.38 0.10 185)",
            }}
          >
            <Banknote className="w-4 h-4" />
            Free Calculator
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "oklch(0.22 0.06 240)" }}
          >
            FD / Lumpsum Calculator
          </h1>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "oklch(0.45 0.03 240)" }}
          >
            Calculate the maturity value of your Fixed Deposit or one-time
            lumpsum investment with different compounding frequencies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "white",
              border: "1px solid oklch(0.88 0.01 220)",
              boxShadow: "0 1px 8px oklch(0.22 0.06 240 / 0.06)",
            }}
          >
            <h2
              className="text-lg font-semibold mb-6"
              style={{ color: "oklch(0.22 0.06 240)" }}
            >
              Investment Details
            </h2>

            {/* Principal */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.35 0.04 240)" }}
                >
                  Principal Amount
                </span>
                <div
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    background: "oklch(0.52 0.13 185 / 0.10)",
                    color: "oklch(0.32 0.10 185)",
                  }}
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <input
                    data-ocid="fd.principal.input"
                    type="number"
                    value={principal}
                    onChange={(e) =>
                      setPrincipal(Math.max(1000, Number(e.target.value)))
                    }
                    className="w-28 bg-transparent outline-none text-right"
                    min={1000}
                    max={100000000}
                  />
                </div>
              </div>
              <Slider
                data-ocid="fd.principal_slider.toggle"
                value={[principal]}
                onValueChange={([v]) => setPrincipal(v)}
                min={10000}
                max={10000000}
                step={10000}
              />
              <div
                className="flex justify-between mt-1 text-xs"
                style={{ color: "oklch(0.60 0.02 240)" }}
              >
                <span>₹10,000</span>
                <span>₹1 Cr</span>
              </div>
            </div>

            {/* Annual Return */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.35 0.04 240)" }}
                >
                  Expected Annual Return
                </span>
                <div
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    background: "oklch(0.52 0.13 185 / 0.10)",
                    color: "oklch(0.32 0.10 185)",
                  }}
                >
                  <input
                    data-ocid="fd.return_rate.input"
                    type="number"
                    value={annualReturn}
                    onChange={(e) =>
                      setAnnualReturn(
                        Math.min(20, Math.max(1, Number(e.target.value))),
                      )
                    }
                    className="w-12 bg-transparent outline-none text-right"
                    min={1}
                    max={20}
                    step={0.25}
                  />
                  <span>%</span>
                </div>
              </div>
              <Slider
                data-ocid="fd.return_rate_slider.toggle"
                value={[annualReturn]}
                onValueChange={([v]) => setAnnualReturn(v)}
                min={1}
                max={20}
                step={0.25}
              />
              <div
                className="flex justify-between mt-1 text-xs"
                style={{ color: "oklch(0.60 0.02 240)" }}
              >
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.35 0.04 240)" }}
                >
                  Investment Duration
                </span>
                <div
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    background: "oklch(0.52 0.13 185 / 0.10)",
                    color: "oklch(0.32 0.10 185)",
                  }}
                >
                  <input
                    data-ocid="fd.duration.input"
                    type="number"
                    value={durationYears}
                    onChange={(e) =>
                      setDurationYears(
                        Math.min(30, Math.max(1, Number(e.target.value))),
                      )
                    }
                    className="w-10 bg-transparent outline-none text-right"
                    min={1}
                    max={30}
                  />
                  <span>Yr</span>
                </div>
              </div>
              <Slider
                data-ocid="fd.duration_slider.toggle"
                value={[durationYears]}
                onValueChange={([v]) => setDurationYears(v)}
                min={1}
                max={30}
                step={1}
              />
              <div
                className="flex justify-between mt-1 text-xs"
                style={{ color: "oklch(0.60 0.02 240)" }}
              >
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Compounding Frequency */}
            <div>
              <span
                className="block text-sm font-medium mb-2"
                style={{ color: "oklch(0.35 0.04 240)" }}
              >
                Compounding Frequency
              </span>
              <Select value={compFreq} onValueChange={setCompFreq}>
                <SelectTrigger
                  data-ocid="fd.compounding.select"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPOUNDING_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "oklch(0.22 0.06 240)",
                boxShadow: "0 2px 16px oklch(0.22 0.06 240 / 0.25)",
              }}
              data-ocid="fd.result.card"
            >
              <div className="flex items-center gap-2 mb-5">
                <Banknote
                  className="w-5 h-5"
                  style={{ color: "oklch(0.52 0.13 185)" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.75 0.02 220)" }}
                >
                  Estimated Results
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.60 0.02 220)" }}
                    >
                      Principal Invested
                    </p>
                    <p
                      className="text-xl font-bold mt-0.5"
                      style={{ color: "oklch(0.90 0.01 220)" }}
                    >
                      {formatINR(principal)}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.015 220)" }}
                    >
                      {formatINRFull(principal)}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.52 0.13 185 / 0.18)" }}
                  >
                    <IndianRupee
                      className="w-5 h-5"
                      style={{ color: "oklch(0.60 0.13 185)" }}
                    />
                  </div>
                </div>
                <div
                  className="h-px"
                  style={{ background: "oklch(0.30 0.05 240)" }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.60 0.02 220)" }}
                    >
                      Total Gain
                    </p>
                    <p
                      className="text-xl font-bold mt-0.5"
                      style={{ color: "oklch(0.72 0.17 155)" }}
                    >
                      {formatINR(totalGain)}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.015 220)" }}
                    >
                      {formatINRFull(totalGain)}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.72 0.17 155 / 0.18)" }}
                  >
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: "oklch(0.72 0.17 155)" }}
                    />
                  </div>
                </div>
                <div
                  className="h-px"
                  style={{ background: "oklch(0.30 0.05 240)" }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.60 0.02 220)" }}
                    >
                      Maturity Value
                    </p>
                    <p
                      className="text-2xl font-bold mt-0.5"
                      style={{ color: "oklch(0.52 0.13 185)" }}
                    >
                      {formatINR(maturityValue)}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.015 220)" }}
                    >
                      {formatINRFull(maturityValue)}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.52 0.13 185 / 0.18)" }}
                  >
                    <Calculator
                      className="w-5 h-5"
                      style={{ color: "oklch(0.52 0.13 185)" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bar */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "white",
                border: "1px solid oklch(0.88 0.01 220)",
              }}
            >
              <p
                className="text-xs font-semibold mb-3"
                style={{ color: "oklch(0.40 0.04 240)" }}
              >
                Portfolio Composition
              </p>
              <div className="h-5 rounded-full overflow-hidden flex">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${principalPct}%`,
                    background: "oklch(0.52 0.13 185)",
                  }}
                />
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${gainPct}%`,
                    background: "oklch(0.72 0.17 155)",
                  }}
                />
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "oklch(0.52 0.13 185)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.45 0.03 240)" }}
                  >
                    Principal ({principalPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "oklch(0.72 0.17 155)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.45 0.03 240)" }}
                  >
                    Gain ({gainPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Year-by-year table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid oklch(0.88 0.01 220)",
                background: "white",
              }}
            >
              <div
                className="px-5 py-3 border-b"
                style={{ borderColor: "oklch(0.88 0.01 220)" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.22 0.06 240)" }}
                >
                  Year-by-Year Growth
                </span>
              </div>
              <div className="overflow-y-auto max-h-52">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Gain</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearRows.map((row) => (
                      <TableRow
                        key={row.year}
                        data-ocid={`fd.table.item.${row.year}`}
                      >
                        <TableCell className="font-medium">
                          {row.year}
                        </TableCell>
                        <TableCell
                          className="font-semibold"
                          style={{ color: "oklch(0.38 0.10 185)" }}
                        >
                          {formatINR(row.value)}
                        </TableCell>
                        <TableCell style={{ color: "oklch(0.45 0.13 155)" }}>
                          +{formatINR(row.gain)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-6 rounded-xl p-4 flex gap-3"
          style={{
            background: "oklch(0.97 0.008 60)",
            border: "1px solid oklch(0.88 0.05 60)",
          }}
        >
          <AlertCircle
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "oklch(0.60 0.12 60)" }}
          />
          <p className="text-xs" style={{ color: "oklch(0.45 0.06 60)" }}>
            <strong>Disclaimer:</strong> This calculator provides an estimate
            for educational purposes only. FD rates and returns may vary by bank
            and scheme. Please check with your bank for the latest applicable
            rates before making any investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
