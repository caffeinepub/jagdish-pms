import { Slider } from "@/components/ui/slider";
import { AlertCircle, Calculator, IndianRupee, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function formatINRFull(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function SipCalculatorPage() {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [durationYears, setDurationYears] = useState(10);

  const result = useMemo(() => {
    const r = annualReturn / 12 / 100;
    const n = durationYears * 12;
    const P = monthlyAmount;
    let maturityValue: number;
    if (r === 0) {
      maturityValue = P * n;
    } else {
      maturityValue = P * ((((1 + r) ** n - 1) / r) * (1 + r));
    }
    const totalInvested = P * n;
    const estimatedReturns = maturityValue - totalInvested;
    return { totalInvested, estimatedReturns, maturityValue };
  }, [monthlyAmount, annualReturn, durationYears]);

  const investedPct = (result.totalInvested / result.maturityValue) * 100;
  const returnsPct = (result.estimatedReturns / result.maturityValue) * 100;

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
            <Calculator className="w-4 h-4" />
            Free Calculator
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "oklch(0.22 0.06 240)" }}
          >
            SIP Calculator
          </h1>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "oklch(0.45 0.03 240)" }}
          >
            Estimate the future value of your Systematic Investment Plan (SIP)
            with compounding. Plan smarter, invest better.
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

            {/* Monthly SIP Amount */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.35 0.04 240)" }}
                >
                  Monthly SIP Amount
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
                    data-ocid="sip.amount.input"
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) =>
                      setMonthlyAmount(Math.max(100, Number(e.target.value)))
                    }
                    className="w-24 bg-transparent outline-none text-right"
                    min={100}
                    max={1000000}
                  />
                </div>
              </div>
              <Slider
                data-ocid="sip.amount_slider.toggle"
                value={[monthlyAmount]}
                onValueChange={([v]) => setMonthlyAmount(v)}
                min={500}
                max={100000}
                step={500}
                className="mt-2"
              />
              <div
                className="flex justify-between mt-1 text-xs"
                style={{ color: "oklch(0.60 0.02 240)" }}
              >
                <span>₹500</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Expected Return */}
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
                    data-ocid="sip.return_rate.input"
                    type="number"
                    value={annualReturn}
                    onChange={(e) =>
                      setAnnualReturn(
                        Math.min(30, Math.max(1, Number(e.target.value))),
                      )
                    }
                    className="w-12 bg-transparent outline-none text-right"
                    min={1}
                    max={30}
                    step={0.5}
                  />
                  <span>%</span>
                </div>
              </div>
              <Slider
                data-ocid="sip.return_rate_slider.toggle"
                value={[annualReturn]}
                onValueChange={([v]) => setAnnualReturn(v)}
                min={1}
                max={30}
                step={0.5}
                className="mt-2"
              />
              <div
                className="flex justify-between mt-1 text-xs"
                style={{ color: "oklch(0.60 0.02 240)" }}
              >
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-2">
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
                    data-ocid="sip.duration.input"
                    type="number"
                    value={durationYears}
                    onChange={(e) =>
                      setDurationYears(
                        Math.min(40, Math.max(1, Number(e.target.value))),
                      )
                    }
                    className="w-10 bg-transparent outline-none text-right"
                    min={1}
                    max={40}
                  />
                  <span>Yr</span>
                </div>
              </div>
              <Slider
                data-ocid="sip.duration_slider.toggle"
                value={[durationYears]}
                onValueChange={([v]) => setDurationYears(v)}
                min={1}
                max={40}
                step={1}
                className="mt-2"
              />
              <div
                className="flex justify-between mt-1 text-xs"
                style={{ color: "oklch(0.60 0.02 240)" }}
              >
                <span>1 Year</span>
                <span>40 Years</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            {/* Stat cards */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "oklch(0.22 0.06 240)",
                boxShadow: "0 2px 16px oklch(0.22 0.06 240 / 0.25)",
              }}
              data-ocid="sip.result.card"
            >
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp
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
                      Total Amount Invested
                    </p>
                    <p
                      className="text-xl font-bold mt-0.5"
                      style={{ color: "oklch(0.90 0.01 220)" }}
                    >
                      {formatINR(result.totalInvested)}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.015 220)" }}
                    >
                      {formatINRFull(result.totalInvested)}
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
                      Estimated Returns
                    </p>
                    <p
                      className="text-xl font-bold mt-0.5"
                      style={{ color: "oklch(0.72 0.17 155)" }}
                    >
                      {formatINR(result.estimatedReturns)}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.015 220)" }}
                    >
                      {formatINRFull(result.estimatedReturns)}
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
                      Total Maturity Value
                    </p>
                    <p
                      className="text-2xl font-bold mt-0.5"
                      style={{ color: "oklch(0.52 0.13 185)" }}
                    >
                      {formatINR(result.maturityValue)}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.015 220)" }}
                    >
                      {formatINRFull(result.maturityValue)}
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

            {/* Stacked bar */}
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
                    width: `${investedPct}%`,
                    background: "oklch(0.52 0.13 185)",
                  }}
                />
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${returnsPct}%`,
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
                    Invested ({investedPct.toFixed(1)}%)
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
                    Returns ({returnsPct.toFixed(1)}%)
                  </span>
                </div>
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
            for educational purposes only. Actual returns may vary based on
            market performance. Mutual fund investments are subject to market
            risks. Please read all scheme-related documents carefully before
            investing.
          </p>
        </div>
      </div>
    </div>
  );
}
