import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Download, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type TransactionInput,
  type TransactionType,
  useAddTransaction,
  useGetAllFunds,
  useGetTransactions,
} from "../hooks/useQueries";
import { exportToCSV } from "../utils/exportCsv";
import {
  categoryLabel,
  formatDate,
  formatINR,
  formatUnits,
  transactionLabel,
} from "../utils/format";

const INDIAN_AMCS = [
  "Aditya Birla Sun Life MF",
  "Axis MF",
  "Bandhan MF",
  "Bank of India MF",
  "Canara Robeco MF",
  "DSP MF",
  "Edelweiss MF",
  "Franklin Templeton India",
  "HDFC MF",
  "HSBC MF",
  "ICICI Prudential MF",
  "ITI MF",
  "JM Financial MF",
  "Kotak MF",
  "LIC MF",
  "Mahindra Manulife MF",
  "Mirae Asset MF",
  "Motilal Oswal MF",
  "Navi MF",
  "Nippon India MF",
  "NJ MF",
  "PGIM India MF",
  "PPFAS MF (Parag Parikh)",
  "Quant MF",
  "Quantum MF",
  "SBI MF",
  "Shriram MF",
  "Sundaram MF",
  "Tata MF",
  "Taurus MF",
  "Trust MF",
  "UTI MF",
  "WhiteOak Capital MF",
  "Zerodha MF (Nifty)",
];

const txBadgeColors: Record<string, string> = {
  buy: "bg-blue-100 text-blue-700",
  sip: "bg-purple-100 text-purple-700",
  sell: "bg-orange-100 text-orange-700",
};

const emptyForm = {
  fundId: "",
  type: "buy",
  // Core - optional
  units: "",
  nav: "",
  amount: "",
  txnDate: "",
  // AMC & Folio
  amc: "",
  folioNumber: "",
  isin: "",
  // Agent
  agentCode: "",
  agentName: "",
  subAgentCode: "",
  subAgentName: "",
  // Payment
  bankAccount: "",
  paymentMode: "",
  remarks: "",
  // Internal
  customAmc: "",
  showAddAmc: false,
};

type FormState = typeof emptyForm;

function SectionHeading({ label }: { label: string }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-5 mb-2 pb-1 border-b border-border">
      {label}
    </p>
  );
}

export default function Transactions() {
  const { data: txs, isLoading } = useGetTransactions();
  const { data: funds } = useGetAllFunds();
  const addTransaction = useAddTransaction();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const set = (patch: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const sortedTxs = useMemo(
    () => (txs ? [...txs].sort((a, b) => Number(b.date - a.date)) : []),
    [txs],
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fundId) {
      toast.error("Please select a fund");
      return;
    }

    const resolvedAmc = form.amc === "__add_new__" ? form.customAmc : form.amc;

    const units = form.units
      ? BigInt(Math.round(Number.parseFloat(form.units) * 1000))
      : 0n;
    const navPerUnit = form.nav
      ? BigInt(Math.round(Number.parseFloat(form.nav) * 100))
      : 0n;
    const amount = form.amount
      ? BigInt(Math.round(Number.parseFloat(form.amount) * 100))
      : 0n;
    const txnDate = form.txnDate
      ? BigInt(new Date(form.txnDate).getTime()) * 1_000_000n
      : undefined;

    const input: TransactionInput = {
      fundId: form.fundId,
      transactionType: form.type as TransactionType,
      units,
      navPerUnit,
      amount,
      txnDate,
      amc: resolvedAmc || undefined,
      folioNumber: form.folioNumber || undefined,
      isin: form.isin || undefined,
      agentCode: form.agentCode || undefined,
      agentName: form.agentName || undefined,
      subAgentCode: form.subAgentCode || undefined,
      subAgentName: form.subAgentName || undefined,
      bankAccount: form.bankAccount || undefined,
      paymentMode: form.paymentMode || undefined,
      remarks: form.remarks || undefined,
    };

    try {
      await addTransaction.mutateAsync(input);
      toast.success("Transaction recorded");
      setOpen(false);
      setForm(emptyForm);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg.includes("Fund not found")
          ? "Selected fund not found. Please add the fund first from Holdings page."
          : `Failed to record transaction: ${msg}`,
      );
    }
  };

  const handleExport = () => {
    const headers = [
      "Date",
      "Txn Date",
      "Fund",
      "Category",
      "Type",
      "Units",
      "NAV (₹)",
      "Amount (₹)",
      "AMC",
      "Folio No.",
      "ISIN",
      "Agent Code",
      "Agent Name",
      "Sub Agent Code",
      "Sub Agent Name",
      "Payment Mode",
      "Bank Account",
      "Remarks",
    ];
    const rows = sortedTxs.map((tx) => {
      const fund = funds?.find((f) => f.id === tx.fundId);
      const txnDateStr = tx.txnDate
        ? new Date(Number(tx.txnDate) / 1_000_000).toLocaleDateString("en-IN")
        : "";
      return [
        formatDate(tx.date),
        txnDateStr,
        fund?.name ?? tx.fundId,
        categoryLabel(fund?.category ?? ""),
        transactionLabel(tx.transactionType),
        (Number(tx.units) / 1000).toFixed(3),
        (Number(tx.navPerUnit) / 100).toFixed(2),
        (Number(tx.amount) / 100).toFixed(2),
        tx.amc ?? "",
        tx.folioNumber ?? "",
        tx.isin ?? "",
        tx.agentCode ?? "",
        tx.agentName ?? "",
        tx.subAgentCode ?? "",
        tx.subAgentName ?? "",
        tx.paymentMode ?? "",
        tx.bankAccount ?? "",
        tx.remarks ?? "",
      ];
    });
    exportToCSV("transactions.csv", headers, rows);
  };

  const tableHeaders = [
    "Date",
    "Txn Date",
    "Fund",
    "Category",
    "Type",
    "Units",
    "NAV",
    "Amount",
    "AMC",
    "Folio",
    "Agent",
    "Payment",
  ];

  return (
    <div className="space-y-6">
      <div className="page-header-divider flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            All buy, sell, and SIP transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            data-ocid="transactions.export.button"
            onClick={handleExport}
            disabled={sortedTxs.length === 0}
          >
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                data-ocid="transactions.add.open_modal_button"
                style={{ background: "oklch(0.58 0.19 255)", color: "white" }}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent
              data-ocid="transactions.add.dialog"
              className="max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="pb-2">
                {/* ── Section 1: Basic Info ─────────────────── */}
                <SectionHeading label="Basic Info" />

                <div className="space-y-3">
                  <div>
                    <Label>
                      Fund <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.fundId}
                      onValueChange={(v) => set({ fundId: v })}
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
                    <Label>
                      Transaction Type{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => set({ type: v })}
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

                  <div>
                    <Label>Date of Transaction</Label>
                    <Input
                      data-ocid="transactions.txndate.input"
                      type="date"
                      value={form.txnDate}
                      onChange={(e) => set({ txnDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Units</Label>
                      <Input
                        data-ocid="transactions.units.input"
                        type="number"
                        step="0.001"
                        value={form.units}
                        onChange={(e) => set({ units: e.target.value })}
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
                        onChange={(e) => set({ nav: e.target.value })}
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
                      onChange={(e) => set({ amount: e.target.value })}
                      placeholder="e.g. 6562.50"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* ── Section 2: Fund Details ───────────────── */}
                <SectionHeading label="Fund Details" />

                <div className="space-y-3">
                  <div>
                    <Label>AMC</Label>
                    <Select
                      value={form.amc}
                      onValueChange={(v) =>
                        set({
                          amc: v,
                          showAddAmc: v === "__add_new__",
                          customAmc: v !== "__add_new__" ? "" : form.customAmc,
                        })
                      }
                    >
                      <SelectTrigger
                        data-ocid="transactions.amc.select"
                        className="mt-1"
                      >
                        <SelectValue placeholder="Select AMC" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_AMCS.map((amc) => (
                          <SelectItem key={amc} value={amc}>
                            {amc}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_new__">
                          + Add New AMC
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.showAddAmc && (
                      <Input
                        data-ocid="transactions.custom-amc.input"
                        value={form.customAmc}
                        onChange={(e) => set({ customAmc: e.target.value })}
                        placeholder="Type AMC name"
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Folio Number</Label>
                      <Input
                        data-ocid="transactions.folio.input"
                        value={form.folioNumber}
                        onChange={(e) => set({ folioNumber: e.target.value })}
                        placeholder="e.g. 1234567890"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>ISIN</Label>
                      <Input
                        data-ocid="transactions.isin.input"
                        value={form.isin}
                        onChange={(e) => set({ isin: e.target.value })}
                        placeholder="e.g. INF200K01RO2"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section 3: Agent Details ──────────────── */}
                <SectionHeading label="Agent Details" />

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Agent Code</Label>
                      <Input
                        data-ocid="transactions.agentcode.input"
                        value={form.agentCode}
                        onChange={(e) => set({ agentCode: e.target.value })}
                        placeholder="e.g. ARN-12345"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Agent Name</Label>
                      <Input
                        data-ocid="transactions.agentname.input"
                        value={form.agentName}
                        onChange={(e) => set({ agentName: e.target.value })}
                        placeholder="e.g. Ramesh Sharma"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Sub Agent Code</Label>
                      <Input
                        data-ocid="transactions.subagentcode.input"
                        value={form.subAgentCode}
                        onChange={(e) => set({ subAgentCode: e.target.value })}
                        placeholder="e.g. SUB-001"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Sub Agent Name</Label>
                      <Input
                        data-ocid="transactions.subagentname.input"
                        value={form.subAgentName}
                        onChange={(e) => set({ subAgentName: e.target.value })}
                        placeholder="e.g. Priya Singh"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section 4: Payment Details ────────────── */}
                <SectionHeading label="Payment Details" />

                <div className="space-y-3">
                  <div>
                    <Label>Payment Mode</Label>
                    <Select
                      value={form.paymentMode}
                      onValueChange={(v) => set({ paymentMode: v })}
                    >
                      <SelectTrigger
                        data-ocid="transactions.paymentmode.select"
                        className="mt-1"
                      >
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="NEFT">NEFT</SelectItem>
                        <SelectItem value="RTGS">RTGS</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="SIP Auto-debit">
                          SIP Auto-debit
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Bank Account</Label>
                    <Input
                      data-ocid="transactions.bankaccount.input"
                      value={form.bankAccount}
                      onChange={(e) => set({ bankAccount: e.target.value })}
                      placeholder="e.g. SBI - XXXX1234"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Remarks</Label>
                    <Textarea
                      data-ocid="transactions.remarks.textarea"
                      value={form.remarks}
                      onChange={(e) => set({ remarks: e.target.value })}
                      placeholder="Optional notes about this transaction"
                      className="mt-1 resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                {/* ── Actions ──────────────────────────────── */}
                <div className="flex gap-2 pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="transactions.add.cancel_button"
                    onClick={() => {
                      setOpen(false);
                      setForm(emptyForm);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    data-ocid="transactions.add.confirm_button"
                    disabled={addTransaction.isPending}
                    className="flex-1"
                    style={{
                      background: "oklch(0.58 0.19 255)",
                      color: "white",
                    }}
                  >
                    {addTransaction.isPending ? "Recording..." : "Record"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="page-card border-0 shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header-row">
                  {tableHeaders.map((h) => (
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
                      colSpan={tableHeaders.length}
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
                      colSpan={tableHeaders.length}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="transactions.empty_state"
                    >
                      No transactions yet.
                    </td>
                  </tr>
                )}
                {sortedTxs.map((tx, i) => {
                  const fund = funds?.find((f) => f.id === tx.fundId);
                  const txnDateStr = tx.txnDate
                    ? new Date(
                        Number(tx.txnDate) / 1_000_000,
                      ).toLocaleDateString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })
                    : "—";
                  const agentDisplay = [
                    tx.agentName,
                    tx.agentCode ? `(${tx.agentCode})` : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ");
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
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {txnDateStr}
                      </td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {fund?.name ?? tx.fundId}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabel(fund?.category ?? "")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            txBadgeColors[tx.transactionType] ?? ""
                          }`}
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
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {tx.amc ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {tx.folioNumber ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {agentDisplay || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {tx.paymentMode ?? "—"}
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
