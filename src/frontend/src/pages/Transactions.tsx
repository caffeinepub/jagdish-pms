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
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type TransactionType,
  useAddTransaction,
  useGetAllFunds,
  useGetTransactions,
} from "../hooks/useQueries";
import {
  categoryLabel,
  formatDate,
  formatINR,
  formatUnits,
  transactionLabel,
} from "../utils/format";

const txBadgeColors: Record<string, string> = {
  buy: "bg-blue-100 text-blue-700",
  sip: "bg-purple-100 text-purple-700",
  sell: "bg-orange-100 text-orange-700",
};

export default function Transactions() {
  const { data: txs, isLoading } = useGetTransactions();
  const { data: funds } = useGetAllFunds();
  const addTransaction = useAddTransaction();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fundId: "",
    type: "buy",
    units: "",
    nav: "",
    amount: "",
  });

  const sortedTxs = useMemo(
    () => (txs ? [...txs].sort((a, b) => Number(b.date - a.date)) : []),
    [txs],
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fundId || !form.units || !form.nav || !form.amount) return;
    try {
      const units = BigInt(Math.round(Number.parseFloat(form.units) * 1000));
      const nav = BigInt(Math.round(Number.parseFloat(form.nav) * 100));
      const amount = BigInt(Math.round(Number.parseFloat(form.amount) * 100));
      await addTransaction.mutateAsync({
        fundId: form.fundId,
        transactionType: form.type as TransactionType,
        units,
        navPerUnit: nav,
        amount,
      });
      toast.success("Transaction recorded");
      setOpen(false);
      setForm({ fundId: "", type: "buy", units: "", nav: "", amount: "" });
    } catch {
      toast.error("Failed to record transaction");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            All buy, sell, and SIP transactions
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="transactions.add.open_modal_button"
              style={{ background: "oklch(0.58 0.19 255)", color: "white" }}
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="transactions.add.dialog">
            <DialogHeader>
              <DialogTitle>Record Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div>
                <Label>Fund</Label>
                <Select
                  value={form.fundId}
                  onValueChange={(v) => setForm({ ...form, fundId: v })}
                >
                  <SelectTrigger
                    data-ocid="transactions.fund.select"
                    className="mt-1"
                  >
                    <SelectValue placeholder="Select fund" />
                  </SelectTrigger>
                  <SelectContent>
                    {(funds ?? []).map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transaction Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger
                    data-ocid="transactions.type.select"
                    className="mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sip">SIP</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Units</Label>
                  <Input
                    data-ocid="transactions.units.input"
                    type="number"
                    step="0.001"
                    value={form.units}
                    onChange={(e) =>
                      setForm({ ...form, units: e.target.value })
                    }
                    placeholder="e.g. 10.500"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>NAV per unit (₹)</Label>
                  <Input
                    data-ocid="transactions.nav.input"
                    type="number"
                    step="0.01"
                    value={form.nav}
                    onChange={(e) => setForm({ ...form, nav: e.target.value })}
                    placeholder="e.g. 625.00"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Amount (₹)</Label>
                <Input
                  data-ocid="transactions.amount.input"
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="e.g. 6562.50"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="transactions.add.cancel_button"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="transactions.add.confirm_button"
                  disabled={addTransaction.isPending}
                  className="flex-1"
                  style={{ background: "oklch(0.58 0.19 255)", color: "white" }}
                >
                  {addTransaction.isPending ? "Recording..." : "Record"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.91 0.008 240)" }}>
                  {[
                    "Date",
                    "Fund",
                    "Category",
                    "Type",
                    "Units",
                    "NAV",
                    "Amount",
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
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="transactions.loading_state"
                    >
                      Loading...
                    </td>
                  </tr>
                )}
                {!isLoading && sortedTxs.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="transactions.empty_state"
                    >
                      No transactions yet.
                    </td>
                  </tr>
                )}
                {sortedTxs.map((tx, i) => {
                  const fund = funds?.find((f) => f.id === tx.fundId);
                  return (
                    <motion.tr
                      key={`${tx.fundId}-${i}`}
                      data-ocid={`transactions.item.${i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      style={{
                        borderBottom: "1px solid oklch(0.95 0.006 240)",
                      }}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {fund?.name ?? tx.fundId}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabel(fund?.category ?? "")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${txBadgeColors[tx.transactionType] ?? ""}`}
                        >
                          {transactionLabel(tx.transactionType)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatUnits(tx.units)}</td>
                      <td className="px-4 py-3">
                        ₹{(Number(tx.navPerUnit) / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatINR(tx.amount)}
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
