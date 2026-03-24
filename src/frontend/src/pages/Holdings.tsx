import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type FundCategory,
  useAddFund,
  useGetAllFunds,
  useGetHoldings,
  useGetPortfolioSummary,
  useIsCallerAdmin,
} from "../hooks/useQueries";
import { exportToCSV } from "../utils/exportCsv";
import {
  calcGainPercent,
  categoryLabel,
  formatINR,
  formatPercent,
  formatUnits,
} from "../utils/format";

export default function Holdings() {
  const { data: holdings, isLoading } = useGetHoldings();
  const { data: funds } = useGetAllFunds();
  const { data: summary } = useGetPortfolioSummary();
  const { data: isAdmin } = useIsCallerAdmin();
  const addFund = useAddFund();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "equity",
    initialNav: "",
  });

  const holdingsWithData = useMemo(() => {
    if (!holdings || !funds || !summary) return [];
    return holdings
      .map((h) => {
        const fund = funds.find((f) => f.id === h.fundId);
        const summaryH = summary.holdings.find((s) => s.fundId === h.fundId);
        return { ...h, fund, summaryH };
      })
      .filter((h) => {
        const nameMatch =
          h.fund?.name.toLowerCase().includes(search.toLowerCase()) ?? true;
        const catMatch = catFilter === "all" || h.fund?.category === catFilter;
        return nameMatch && catMatch;
      });
  }, [holdings, funds, summary, search, catFilter]);

  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Please enter a fund name");
      return;
    }
    if (!form.initialNav) {
      toast.error("Please enter the initial NAV");
      return;
    }
    try {
      const autoId = form.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const existing = funds?.find((f) => f.id === autoId);
      if (existing) {
        toast.error(
          `A fund named "${existing.name}" already exists with the same ID. Please use a more unique name.`,
        );
        return;
      }

      const navPaise = BigInt(
        Math.round(Number.parseFloat(form.initialNav) * 100),
      );
      await addFund.mutateAsync({
        id: autoId,
        name: form.name,
        category: form.category as FundCategory,
        initialNav: navPaise,
      });
      toast.success("Fund added successfully");
      setOpen(false);
      setForm({ name: "", category: "equity", initialNav: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg.includes("Fund already exists")
          ? "A fund with this name already exists. Please use a different name."
          : msg.includes("Unauthorized")
            ? "Only admins can add funds. Please make sure you are logged in as admin."
            : `Failed to add fund: ${msg}`,
      );
    }
  };

  const handleExport = () => {
    const headers = [
      "Fund Name",
      "Category",
      "Units",
      "Avg Cost NAV (\u20b9)",
      "Current NAV (\u20b9)",
      "Invested (\u20b9)",
      "Current Value (\u20b9)",
      "Gain/Loss (\u20b9)",
      "Return %",
    ];
    const rows = holdingsWithData.map((h) => {
      const gp = h.summaryH
        ? calcGainPercent(h.summaryH.amountInvested, h.summaryH.currentValue)
        : 0;
      return [
        h.fund?.name ?? h.fundId,
        categoryLabel(h.fund?.category ?? ""),
        (Number(h.units) / 1000).toFixed(3),
        (Number(h.avgCostNav) / 100).toFixed(2),
        h.fund ? (Number(h.fund.currentNav) / 100).toFixed(2) : "-",
        h.summaryH ? (Number(h.summaryH.amountInvested) / 100).toFixed(2) : "-",
        h.summaryH ? (Number(h.summaryH.currentValue) / 100).toFixed(2) : "-",
        h.summaryH ? (Number(h.summaryH.gainLoss) / 100).toFixed(2) : "-",
        `${gp.toFixed(2)}%`,
      ];
    });
    exportToCSV("holdings.csv", headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header-divider flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Holdings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Your mutual fund portfolio positions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            data-ocid="holdings.export.button"
            onClick={handleExport}
            disabled={holdingsWithData.length === 0}
          >
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  data-ocid="holdings.add_fund.open_modal_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Fund
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="holdings.add_fund.dialog">
                <DialogHeader>
                  <DialogTitle>Add New Fund</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFund} className="space-y-4 mt-2">
                  <div>
                    <Label>Fund Name</Label>
                    <Input
                      data-ocid="holdings.fund_name.input"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. HDFC Equity Fund"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => setForm({ ...form, category: v })}
                    >
                      <SelectTrigger
                        data-ocid="holdings.category.select"
                        className="mt-1"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="debt">Debt</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="elss">ELSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Initial NAV (\u20b9)</Label>
                    <Input
                      data-ocid="holdings.nav.input"
                      type="number"
                      step="0.01"
                      value={form.initialNav}
                      onChange={(e) =>
                        setForm({ ...form, initialNav: e.target.value })
                      }
                      placeholder="e.g. 625.00"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      data-ocid="holdings.add_fund.cancel_button"
                      onClick={() => {
                        setOpen(false);
                        setForm({
                          name: "",
                          category: "equity",
                          initialNav: "",
                        });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      data-ocid="holdings.add_fund.confirm_button"
                      disabled={addFund.isPending}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {addFund.isPending ? "Adding..." : "Add Fund"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="page-card border-0 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="holdings.search.input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search funds..."
                className="pl-9"
              />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger
                data-ocid="holdings.category_filter.select"
                className="w-36"
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="debt">Debt</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="elss">ELSS</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                    "Avg Cost NAV",
                    "Current NAV",
                    "Invested",
                    "Current Value",
                    "Gain/Loss",
                    "Return %",
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
                {isLoading && (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-12"
                      data-ocid="holdings.loading_state"
                    >
                      <div className="text-muted-foreground">
                        Loading holdings...
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && holdingsWithData.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="holdings.empty_state"
                    >
                      No holdings found. Add a fund and record transactions.
                    </td>
                  </tr>
                )}
                {holdingsWithData.map((h, i) => {
                  const gp = h.summaryH
                    ? calcGainPercent(
                        h.summaryH.amountInvested,
                        h.summaryH.currentValue,
                      )
                    : 0;
                  return (
                    <motion.tr
                      key={h.fundId}
                      data-ocid={`holdings.item.${i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
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
                      <td className="px-4 py-2.5 tabular-nums">
                        {h.summaryH
                          ? formatINR(h.summaryH.amountInvested)
                          : "-"}
                      </td>
                      <td className="px-4 py-2.5 font-semibold tabular-nums">
                        {h.summaryH ? formatINR(h.summaryH.currentValue) : "-"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`tabular-nums ${gp >= 0 ? "gain-text" : "loss-text"}`}
                        >
                          {h.summaryH ? formatINR(h.summaryH.gainLoss) : "-"}
                        </span>
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
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
