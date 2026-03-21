import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type UserCapitalGainsRecord,
  type UserHoldingRecord,
  type UserRecord,
  type UserTransactionRecord,
  useAdminGetAllCapitalGains,
  useAdminGetAllHoldings,
  useAdminGetAllTransactions,
  useAdminGetAllUsers,
} from "@/hooks/useQueries";
import { AlertCircle, Database, Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatPaise(val: bigint): string {
  return (Number(val) / 100).toFixed(2);
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN");
}

function formatUnits(val: bigint): string {
  return (Number(val) / 1000).toFixed(3);
}

function usersToRows(users: UserRecord[]): string[][] {
  return users.map((u) => [u.principal, u.name]);
}

function transactionsToRows(rows: UserTransactionRecord[]): string[][] {
  return rows.map((r) => [
    r.principal,
    r.userName,
    r.fundId,
    r.transactionType,
    formatUnits(r.units),
    formatPaise(r.navPerUnit),
    formatPaise(r.amount),
    formatDate(r.date),
  ]);
}

function holdingsToRows(rows: UserHoldingRecord[]): string[][] {
  return rows.map((r) => [
    r.principal,
    r.userName,
    r.fundId,
    formatUnits(r.units),
    formatPaise(r.avgCostNav),
  ]);
}

function capitalGainsToRows(rows: UserCapitalGainsRecord[]): string[][] {
  return rows.map((r) => [
    r.principal,
    r.userName,
    r.fundId,
    formatPaise(r.stcg),
    formatPaise(r.ltcg),
  ]);
}

export function DataExportTab() {
  const usersQuery = useAdminGetAllUsers();
  const txQuery = useAdminGetAllTransactions();
  const holdingsQuery = useAdminGetAllHoldings();
  const gainsQuery = useAdminGetAllCapitalGains();

  const [exportingAll, setExportingAll] = useState(false);

  const isError =
    usersQuery.isError ||
    txQuery.isError ||
    holdingsQuery.isError ||
    gainsQuery.isError;

  function handleExportUsers() {
    const data = usersQuery.data ?? [];
    downloadCsv(
      `jagdish-pms-users-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Principal", "Name"],
      usersToRows(data),
    );
    toast.success(`Exported ${data.length} users`);
  }

  function handleExportTransactions() {
    const data = txQuery.data ?? [];
    downloadCsv(
      `jagdish-pms-transactions-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        "Principal",
        "User Name",
        "Fund ID",
        "Type",
        "Units",
        "NAV Per Unit (₹)",
        "Amount (₹)",
        "Date",
      ],
      transactionsToRows(data),
    );
    toast.success(`Exported ${data.length} transactions`);
  }

  function handleExportHoldings() {
    const data = holdingsQuery.data ?? [];
    downloadCsv(
      `jagdish-pms-holdings-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Principal", "User Name", "Fund ID", "Units", "Avg Cost NAV (₹)"],
      holdingsToRows(data),
    );
    toast.success(`Exported ${data.length} holdings`);
  }

  function handleExportCapitalGains() {
    const data = gainsQuery.data ?? [];
    downloadCsv(
      `jagdish-pms-capital-gains-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Principal", "User Name", "Fund ID", "STCG (₹)", "LTCG (₹)"],
      capitalGainsToRows(data),
    );
    toast.success(`Exported ${data.length} capital gains records`);
  }

  async function handleExportAll() {
    setExportingAll(true);
    try {
      const users = usersQuery.data ?? [];
      const txns = txQuery.data ?? [];
      const holdings = holdingsQuery.data ?? [];
      const gains = gainsQuery.data ?? [];

      const sections: string[] = [];

      sections.push("=== USERS ===");
      sections.push(["Principal", "Name"].map((h) => `"${h}"`).join(","));
      sections.push(
        ...usersToRows(users).map((r) => r.map((c) => `"${c}"`).join(",")),
      );

      sections.push("");
      sections.push("=== TRANSACTIONS ===");
      sections.push(
        [
          "Principal",
          "User Name",
          "Fund ID",
          "Type",
          "Units",
          "NAV Per Unit (Rs)",
          "Amount (Rs)",
          "Date",
        ]
          .map((h) => `"${h}"`)
          .join(","),
      );
      sections.push(
        ...transactionsToRows(txns).map((r) =>
          r.map((c) => `"${c}"`).join(","),
        ),
      );

      sections.push("");
      sections.push("=== HOLDINGS ===");
      sections.push(
        ["Principal", "User Name", "Fund ID", "Units", "Avg Cost NAV (Rs)"]
          .map((h) => `"${h}"`)
          .join(","),
      );
      sections.push(
        ...holdingsToRows(holdings).map((r) =>
          r.map((c) => `"${c}"`).join(","),
        ),
      );

      sections.push("");
      sections.push("=== CAPITAL GAINS ===");
      sections.push(
        ["Principal", "User Name", "Fund ID", "STCG (Rs)", "LTCG (Rs)"]
          .map((h) => `"${h}"`)
          .join(","),
      );
      sections.push(
        ...capitalGainsToRows(gains).map((r) =>
          r.map((c) => `"${c}"`).join(","),
        ),
      );

      const csv = sections.join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jagdish-pms-full-backup-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(
        `Full backup exported — ${users.length} users, ${txns.length} transactions, ${holdings.length} holdings, ${gains.length} capital gains records`,
      );
    } finally {
      setExportingAll(false);
    }
  }

  const isLoading =
    usersQuery.isLoading ||
    txQuery.isLoading ||
    holdingsQuery.isLoading ||
    gainsQuery.isLoading;

  return (
    <div className="space-y-6" data-ocid="data_export.section">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <AlertCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Data Backup</span> —
          This data export is for your backup. Download and save to Google Drive
          or your computer. All monetary values are in Indian Rupees (₹).
        </p>
      </div>

      {isError && (
        <div
          className="flex items-center gap-2 text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/5 p-3"
          data-ocid="data_export.error_state"
        >
          <AlertCircle className="w-4 h-4" />
          <span>
            Some admin data functions may not be available yet. Please check
            that your backend has been updated with the admin export functions.
          </span>
        </div>
      )}

      {/* Individual Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Users */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Users List
                </CardTitle>
                <CardDescription className="text-xs">
                  {usersQuery.isLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  ) : (
                    `${(usersQuery.data ?? []).length} registered users`
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground mb-3">
              Principal ID and display name for every registered user.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2"
              onClick={handleExportUsers}
              disabled={usersQuery.isLoading || !!usersQuery.isError}
              data-ocid="data_export.users.button"
            >
              {usersQuery.isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Export Users CSV
            </Button>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  All Transactions
                </CardTitle>
                <CardDescription className="text-xs">
                  {txQuery.isLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  ) : (
                    `${(txQuery.data ?? []).length} transaction records`
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground mb-3">
              Buy/SIP/sell transactions across all users and funds.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2"
              onClick={handleExportTransactions}
              disabled={txQuery.isLoading || !!txQuery.isError}
              data-ocid="data_export.transactions.button"
            >
              {txQuery.isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Export Transactions CSV
            </Button>
          </CardContent>
        </Card>

        {/* Holdings */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  All Holdings
                </CardTitle>
                <CardDescription className="text-xs">
                  {holdingsQuery.isLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  ) : (
                    `${(holdingsQuery.data ?? []).length} holding records`
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground mb-3">
              Current units and average cost NAV for all users.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2"
              onClick={handleExportHoldings}
              disabled={holdingsQuery.isLoading || !!holdingsQuery.isError}
              data-ocid="data_export.holdings.button"
            >
              {holdingsQuery.isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Export Holdings CSV
            </Button>
          </CardContent>
        </Card>

        {/* Capital Gains */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Capital Gains
                </CardTitle>
                <CardDescription className="text-xs">
                  {gainsQuery.isLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </span>
                  ) : (
                    `${(gainsQuery.data ?? []).length} capital gains records`
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground mb-3">
              STCG and LTCG figures for all users across all funds.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2"
              onClick={handleExportCapitalGains}
              disabled={gainsQuery.isLoading || !!gainsQuery.isError}
              data-ocid="data_export.capital_gains.button"
            >
              {gainsQuery.isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Export Capital Gains CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export Everything */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            Export Everything — Full Backup
          </CardTitle>
          <CardDescription className="text-sm">
            Downloads one CSV file containing all sections: users, transactions,
            holdings, and capital gains. Save this file regularly to Google
            Drive or your computer as a complete data backup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded bg-background border border-border">
              {usersQuery.isLoading ? "..." : (usersQuery.data ?? []).length}{" "}
              users
            </span>
            <span className="px-2 py-1 rounded bg-background border border-border">
              {txQuery.isLoading ? "..." : (txQuery.data ?? []).length}{" "}
              transactions
            </span>
            <span className="px-2 py-1 rounded bg-background border border-border">
              {holdingsQuery.isLoading
                ? "..."
                : (holdingsQuery.data ?? []).length}{" "}
              holdings
            </span>
            <span className="px-2 py-1 rounded bg-background border border-border">
              {gainsQuery.isLoading ? "..." : (gainsQuery.data ?? []).length}{" "}
              capital gains
            </span>
          </div>
          <Button
            className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90"
            onClick={handleExportAll}
            disabled={isLoading || exportingAll || isError}
            data-ocid="data_export.primary_button"
          >
            {isLoading || exportingAll ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {exportingAll
              ? "Preparing Export..."
              : "Export Everything (Full Backup)"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
