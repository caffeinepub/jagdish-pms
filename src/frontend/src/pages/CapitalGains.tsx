import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, Info } from "lucide-react";
import { motion } from "motion/react";
import { useGetAllFunds, useGetCapitalGains } from "../hooks/useQueries";
import { exportToCSV } from "../utils/exportCsv";
import { formatINR } from "../utils/format";

const TAX_INFO = [
  {
    category: "equity",
    label: "Equity",
    stcg: "15% (held < 1 year)",
    ltcg: "10% above ₹1 lakh (held ≥ 1 year)",
    color: "oklch(0.58 0.19 255)",
  },
  {
    category: "elss",
    label: "ELSS",
    stcg: "15% (held < 1 year)",
    ltcg: "10% above ₹1 lakh (held ≥ 1 year)",
    color: "oklch(0.60 0.18 310)",
  },
  {
    category: "debt",
    label: "Debt",
    stcg: "As per income tax slab (held < 3 years)",
    ltcg: "20% with indexation (held ≥ 3 years)",
    color: "oklch(0.55 0.16 145)",
  },
  {
    category: "hybrid",
    label: "Hybrid",
    stcg: "As per equity/debt split",
    ltcg: "As per equity/debt split",
    color: "oklch(0.65 0.20 45)",
  },
];

export default function CapitalGains() {
  const { data: report, isLoading } = useGetCapitalGains();
  const { data: funds } = useGetAllFunds();

  const handleExport = () => {
    if (!report || report.details.length === 0) return;
    const headers = ["Fund", "Category", "STCG (₹)", "LTCG (₹)", "Total (₹)"];
    const rows = report.details.map((detail) => {
      const fund = funds?.find((f) => f.id === detail.fundId);
      const cat = fund?.category ?? "equity";
      const total = Number(detail.stcg + detail.ltcg);
      return [
        fund?.name ?? detail.fundId,
        cat.charAt(0).toUpperCase() + cat.slice(1),
        (Number(detail.stcg) / 100).toFixed(2),
        (Number(detail.ltcg) / 100).toFixed(2),
        (total / 100).toFixed(2),
      ];
    });
    exportToCSV("capital-gains.csv", headers, rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Capital Gains Report</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            STCG and LTCG summary as per Indian tax rules
          </p>
        </div>
        {report && report.details.length > 0 && (
          <Button
            variant="outline"
            data-ocid="capital_gains.export.button"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
        )}
      </div>

      {/* Tax info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {TAX_INFO.map(({ label, stcg, ltcg, color }) => (
          <Card key={label} className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-sm font-semibold">{label}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                <span className="font-medium text-foreground">STCG:</span>{" "}
                {stcg}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">LTCG:</span>{" "}
                {ltcg}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary cards */}
      {report && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card border-0">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Total STCG
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "oklch(0.50 0.22 25)" }}
              >
                {formatINR(report.totalStcg)}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Total LTCG
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "oklch(0.55 0.16 145)" }}
              >
                {formatINR(report.totalLtcg)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Details table */}
      <Card className="shadow-card border-0" data-ocid="capital_gains.table">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            Fund-wise Capital Gains
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent data-ocid="capital_gains.info.tooltip">
                  <p className="text-xs max-w-xs">
                    Capital gains are calculated based on your transaction
                    history. Consult a tax advisor for filing.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="capital_gains.loading_state"
            >
              Loading report...
            </div>
          )}
          {!isLoading && (!report || report.details.length === 0) && (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="capital_gains.empty_state"
            >
              No capital gains data. Record sell transactions to see gains.
            </div>
          )}
          {report && report.details.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid oklch(0.91 0.008 240)" }}
                  >
                    {[
                      "Fund",
                      "Category",
                      "STCG",
                      "STCG Tax",
                      "LTCG",
                      "LTCG Tax",
                      "Total",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.details.map((detail, i) => {
                    const fund = funds?.find((f) => f.id === detail.fundId);
                    const cat = fund?.category ?? "equity";
                    const isEquityLike = cat === "equity" || cat === "elss";
                    const stcgTax = isEquityLike
                      ? (Number(detail.stcg) * 0.15) / 100
                      : 0;
                    const ltcgTax = isEquityLike
                      ? Math.max(0, Number(detail.ltcg) / 100 - 100000) * 0.1
                      : (Number(detail.ltcg) * 0.2) / 100;
                    const total = Number(detail.stcg + detail.ltcg);
                    return (
                      <motion.tr
                        key={detail.fundId}
                        data-ocid={`capital_gains.item.${i + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          borderBottom: "1px solid oklch(0.95 0.006 240)",
                        }}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          {fund?.name ?? detail.fundId}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Badge>
                        </td>
                        <td
                          className="px-4 py-3"
                          style={{ color: "oklch(0.50 0.22 25)" }}
                        >
                          {formatINR(detail.stcg)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {isEquityLike ? "15%" : "Slab"}
                          {stcgTax > 0 && (
                            <span className="ml-1 text-xs">
                              (≈₹{stcgTax.toFixed(0)})
                            </span>
                          )}
                        </td>
                        <td
                          className="px-4 py-3"
                          style={{ color: "oklch(0.55 0.16 145)" }}
                        >
                          {formatINR(detail.ltcg)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {isEquityLike ? "10% > ₹1L" : "20%+idx"}
                          {ltcgTax > 0 && (
                            <span className="ml-1 text-xs">
                              (≈₹{ltcgTax.toFixed(0)})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {formatINR(BigInt(total))}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center pb-2">
        ⚠️ This report is for reference only. Please consult a Chartered
        Accountant for accurate tax filing.
      </p>
    </div>
  );
}
