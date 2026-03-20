import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type FundCategory,
  useAddFund,
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

export default function Holdings() {
  const { data: holdings, isLoading } = useGetHoldings();
  const { data: funds } = useGetAllFunds();
  const { data: summary } = useGetPortfolioSummary();
  const addFund = useAddFund();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
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
    if (!form.id || !form.name || !form.initialNav) return;
    try {
      const navPaise = BigInt(
        Math.round(Number.parseFloat(form.initialNav) * 100),
      );
      await addFund.mutateAsync({
        id: form.id.toLowerCase().replace(/\s+/g, "-"),
        name: form.name,
        category: form.category as FundCategory,
        initialNav: navPaise,
      });
      toast.success("Fund added successfully");
      setOpen(false);
      setForm({ id: "", name: "", category: "equity", initialNav: "" });
    } catch {
      toast.error("Failed to add fund");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Holdings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Your mutual fund portfolio positions
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="holdings.add_fund.open_modal_button"
              style={{ background: "oklch(0.58 0.19 255)", color: "white" }}
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
                <Label>Fund ID (unique slug)</Label>
                <Input
                  data-ocid="holdings.fund_id.input"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  placeholder="e.g. hdfc-equity"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Fund Name</Label>
                <Input
                  data-ocid="holdings.fund_name.input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                <Label>Initial NAV (₹)</Label>
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
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="holdings.add_fund.confirm_button"
                  disabled={addFund.isPending}
                  className="flex-1"
                  style={{ background: "oklch(0.58 0.19 255)", color: "white" }}
                >
                  {addFund.isPending ? "Adding..." : "Add Fund"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card border-0">
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
                <tr style={{ borderBottom: "1px solid oklch(0.91 0.008 240)" }}>
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
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap"
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
                        borderBottom: "1px solid oklch(0.95 0.006 240)",
                      }}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        {h.fund?.name ?? h.fundId}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabel(h.fund?.category ?? "")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{formatUnits(h.units)}</td>
                      <td className="px-4 py-3">
                        ₹{(Number(h.avgCostNav) / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        ₹
                        {h.fund
                          ? (Number(h.fund.currentNav) / 100).toFixed(2)
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {h.summaryH
                          ? formatINR(h.summaryH.amountInvested)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {h.summaryH ? formatINR(h.summaryH.currentValue) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={gp >= 0 ? "gain-text" : "loss-text"}>
                          {h.summaryH ? formatINR(h.summaryH.gainLoss) : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${gp >= 0 ? "gain-text" : "loss-text"}`}
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
