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
    stcg: "20% (held < 1 year)",
    ltcg: "12.5% above \u20b91.25 lakh (held \u2265 1 year)",
    color: "oklch(0.58 0.19 255)",
  },
  {
    category: "elss",
    label: "ELSS",
    stcg: "20% (held < 1 year)",
    ltcg: "12.5% above \u20b91.25 lakh (held \u2265 1 year)",
    color: "oklch(0.60 0.18 310)",
  },
  {
    category: "debt",
    label: "Debt",
    stcg: "As per income tax slab (held < 3 years)",
    ltcg: "20% with indexation (held \u2265 3 years)",
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
    const headers = [
      "Fund",
      "Category",
      "STCG (\u20b9)",
      "LTCG (\u20b9)",
      "Total (\u20b9)",
    ];
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
      {/* Page header */}
      <div className="page-header-divider flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Capital Gains Report
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            STCG and LTCG summary as per Indian tax rules
          </p>
        </div>
        {report && report.details.length > 0 && (
          <Button
            variant="outline"
            size="sm"
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
          <div key={label} className="page-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="text-sm font-semibold text-slate-800">
                {label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1.5">
              <span className="font-semibold text-slate-600">STCG:</span> {stcg}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-slate-600">LTCG:</span> {ltcg}
            </p>
          </div>
        ))}
      </div>

      {/* Summary stat cards */}
      {report && (
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Total STCG
            </p>
            <p
              className="text-2xl font-extrabold tabular-nums"
              style={{ color: "oklch(0.50 0.22 25)" }}
            >
              {formatINR(report.totalStcg)}
            </p>
          </div>
          <div className="stat-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Total LTCG
            </p>
            <p
              className="text-2xl font-extrabold tabular-nums"
              style={{ color: "oklch(0.42 0.16 145)" }}
            >
              {formatINR(report.totalLtcg)}
            </p>
          </div>
        </div>
      )}

      {/* Details table */}
      <Card
        className="page-card border-0 shadow-none"
        data-ocid="capital_gains.table"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
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
                  <tr className="table-header-row">
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
                        className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground whitespace-nowrap"
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
                      ? (Number(detail.stcg) * 0.2) / 100
                      : 0;
                    const ltcgTax = isEquityLike
                      ? Math.max(0, Number(detail.ltcg) / 100 - 125000) * 0.125
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
                          borderBottom: "1px solid oklch(0.94 0.006 230)",
                        }}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-medium text-slate-800">
                          {fund?.name ?? detail.fundId}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge variant="secondary" className="text-xs">
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Badge>
                        </td>
                        <td
                          className="px-4 py-2.5 tabular-nums"
                          style={{ color: "oklch(0.50 0.22 25)" }}
                        >
                          {formatINR(detail.stcg)}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs tabular-nums">
                          {isEquityLike ? "20%" : "Slab"}
                          {stcgTax > 0 && (
                            <span className="ml-1">
                              (\u2248\u20b9{stcgTax.toFixed(0)})
                            </span>
                          )}
                        </td>
                        <td
                          className="px-4 py-2.5 tabular-nums"
                          style={{ color: "oklch(0.42 0.16 145)" }}
                        >
                          {formatINR(detail.ltcg)}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs tabular-nums">
                          {isEquityLike ? "12.5% > \u20b91.25L" : "20%+idx"}
                          {ltcgTax > 0 && (
                            <span className="ml-1">
                              (\u2248\u20b9{ltcgTax.toFixed(0)})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 font-semibold tabular-nums">
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
        \u26a0\ufe0f This report is for reference only. Please consult a
        Chartered Accountant for accurate tax filing.
      </p>
    </div>
  );
}
