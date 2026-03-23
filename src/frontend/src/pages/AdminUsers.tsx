import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import {
  type UserPortfolio,
  type UserSummary,
  useGetAdminUserList,
  useGetAdminUserPortfolio,
} from "../hooks/useQueries";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(value: bigint): string {
  const num = Number(value) / 100;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toFixed(2)}`;
}

function formatIST(ts: bigint): string {
  if (!ts || ts === 0n) return "—";
  // ts is nanoseconds from IC
  const ms = Number(ts / 1_000_000n);
  if (ms === 0) return "—";
  return new Date(ms).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateIST(ts: bigint): string {
  if (!ts || ts === 0n) return "—";
  const ms = Number(ts / 1_000_000n);
  if (ms === 0) return "—";
  return new Date(ms).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function truncatePrincipal(p: string): string {
  if (!p) return "—";
  if (p.length <= 12) return p;
  return `${p.slice(0, 5)}...${p.slice(-3)}`;
}

function isActive(lastSeen: bigint, withinMs: number): boolean {
  if (!lastSeen || lastSeen === 0n) return false;
  const ms = Number(lastSeen / 1_000_000n);
  return Date.now() - ms <= withinMs;
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{
        background: accent
          ? "oklch(0.45 0.12 240 / 0.08)"
          : "oklch(0.985 0.006 240)",
        border: `1px solid ${accent ? "oklch(0.45 0.12 240 / 0.25)" : "oklch(0.88 0.015 220)"}`,
      }}
    >
      <p
        className="text-xs font-medium"
        style={{ color: "oklch(0.55 0.018 240)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold tabular-nums"
        style={{
          color: accent ? "oklch(0.40 0.12 240)" : "oklch(0.22 0.04 240)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Portfolio Modal ──────────────────────────────────────────────────────────

function PortfolioModal({
  user,
  onClose,
}: {
  user: UserSummary;
  onClose: () => void;
}) {
  const { data: portfolio, isLoading } = useGetAdminUserPortfolio(
    user.principal,
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        style={{ background: "oklch(0.985 0.006 240)" }}
        data-ocid="admin.users.modal"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div>
              <p
                className="font-semibold"
                style={{ color: "oklch(0.22 0.04 240)" }}
              >
                {user.gmail || "No Gmail set"}
              </p>
              <p
                className="text-xs font-normal"
                style={{ color: "oklch(0.55 0.018 240)" }}
              >
                {user.principal}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Summary strip */}
        <div className="flex-shrink-0 grid grid-cols-3 gap-3 py-2">
          <div
            className="rounded-lg p-3 text-center"
            style={{
              background: "oklch(0.45 0.12 240 / 0.07)",
              border: "1px solid oklch(0.45 0.12 240 / 0.18)",
            }}
          >
            <p className="text-xs" style={{ color: "oklch(0.55 0.018 240)" }}>
              Total Invested
            </p>
            <p
              className="font-bold text-sm"
              style={{ color: "oklch(0.35 0.10 240)" }}
            >
              {formatINR(user.totalInvested)}
            </p>
          </div>
          <div
            className="rounded-lg p-3 text-center"
            style={{
              background: "oklch(0.45 0.12 240 / 0.07)",
              border: "1px solid oklch(0.45 0.12 240 / 0.18)",
            }}
          >
            <p className="text-xs" style={{ color: "oklch(0.55 0.018 240)" }}>
              Transactions
            </p>
            <p
              className="font-bold text-sm"
              style={{ color: "oklch(0.35 0.10 240)" }}
            >
              {Number(user.transactionCount)}
            </p>
          </div>
          <div
            className="rounded-lg p-3 text-center"
            style={{
              background: "oklch(0.45 0.12 240 / 0.07)",
              border: "1px solid oklch(0.45 0.12 240 / 0.18)",
            }}
          >
            <p className="text-xs" style={{ color: "oklch(0.55 0.018 240)" }}>
              Last Active
            </p>
            <p
              className="font-bold text-sm"
              style={{ color: "oklch(0.35 0.10 240)" }}
            >
              {formatIST(user.lastSeen)}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div
            className="flex flex-col gap-3 py-4"
            data-ocid="admin.users.modal.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : !portfolio ? (
          <div
            className="flex items-center justify-center py-12 text-sm"
            style={{ color: "oklch(0.55 0.018 240)" }}
            data-ocid="admin.users.modal.empty_state"
          >
            No portfolio data available for this user.
          </div>
        ) : (
          <PortfolioTabs portfolio={portfolio} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PortfolioTabs({ portfolio }: { portfolio: UserPortfolio }) {
  return (
    <Tabs
      defaultValue="transactions"
      className="flex-1 overflow-hidden flex flex-col"
    >
      <TabsList className="flex-shrink-0">
        <TabsTrigger
          value="transactions"
          data-ocid="admin.users.transactions.tab"
        >
          Transactions ({portfolio.transactions.length})
        </TabsTrigger>
        <TabsTrigger value="holdings" data-ocid="admin.users.holdings.tab">
          Holdings ({portfolio.holdings.length})
        </TabsTrigger>
        <TabsTrigger
          value="capital-gains"
          data-ocid="admin.users.capital_gains.tab"
        >
          Capital Gains
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-y-auto mt-3">
        <TabsContent value="transactions">
          {portfolio.transactions.length === 0 ? (
            <div
              className="text-center py-10 text-sm"
              style={{ color: "oklch(0.55 0.018 240)" }}
              data-ocid="admin.users.transactions.empty_state"
            >
              No transactions recorded.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>NAV</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>AMC</TableHead>
                  <TableHead>Folio</TableHead>
                  <TableHead>Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.transactions.map((txn, i) => (
                  <TableRow
                    key={`txn-${txn.fundId}-${i}`}
                    data-ocid={`admin.users.transactions.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-xs">
                      {txn.fundId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs capitalize"
                        style={{
                          color:
                            txn.transactionType === "sell"
                              ? "oklch(0.50 0.15 25)"
                              : "oklch(0.40 0.12 145)",
                          borderColor:
                            txn.transactionType === "sell"
                              ? "oklch(0.75 0.12 25)"
                              : "oklch(0.75 0.12 145)",
                        }}
                      >
                        {txn.transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs tabular-nums">
                      {(Number(txn.units) / 1000).toFixed(3)}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums">
                      ₹{(Number(txn.navPerUnit) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums font-medium">
                      {formatINR(txn.amount)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {txn.txnDate
                        ? formatDateIST(txn.txnDate)
                        : formatIST(txn.date)}
                    </TableCell>
                    <TableCell className="text-xs">{txn.amc || "—"}</TableCell>
                    <TableCell className="text-xs">
                      {txn.folioNumber || "—"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {txn.agentName || txn.agentCode || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="holdings">
          {portfolio.holdings.length === 0 ? (
            <div
              className="text-center py-10 text-sm"
              style={{ color: "oklch(0.55 0.018 240)" }}
              data-ocid="admin.users.holdings.empty_state"
            >
              No holdings found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Avg Cost NAV</TableHead>
                  <TableHead>Invested (Est.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.holdings.map((h, i) => (
                  <TableRow
                    key={`h-${h.fundId}-${i}`}
                    data-ocid={`admin.users.holdings.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-xs">
                      {h.fundId}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums">
                      {(Number(h.units) / 1000).toFixed(3)}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums">
                      ₹{(Number(h.avgCostNav) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums font-medium">
                      {formatINR(
                        BigInt(
                          Math.round(
                            (Number(h.units) * Number(h.avgCostNav)) / 1000,
                          ),
                        ),
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="capital-gains">
          <div className="mb-3 flex gap-3">
            <div
              className="rounded-lg px-4 py-2 text-sm"
              style={{
                background: "oklch(0.92 0.04 145 / 0.5)",
                border: "1px solid oklch(0.78 0.10 145)",
              }}
            >
              <span
                className="text-xs"
                style={{ color: "oklch(0.40 0.10 145)" }}
              >
                Total LTCG:{" "}
              </span>
              <span
                className="font-bold"
                style={{ color: "oklch(0.35 0.12 145)" }}
              >
                {formatINR(portfolio.capitalGains.totalLtcg)}
              </span>
            </div>
            <div
              className="rounded-lg px-4 py-2 text-sm"
              style={{
                background: "oklch(0.93 0.04 25 / 0.5)",
                border: "1px solid oklch(0.78 0.10 25)",
              }}
            >
              <span
                className="text-xs"
                style={{ color: "oklch(0.45 0.10 25)" }}
              >
                Total STCG:{" "}
              </span>
              <span
                className="font-bold"
                style={{ color: "oklch(0.40 0.12 25)" }}
              >
                {formatINR(portfolio.capitalGains.totalStcg)}
              </span>
            </div>
          </div>

          {portfolio.capitalGains.details.length === 0 ? (
            <div
              className="text-center py-10 text-sm"
              style={{ color: "oklch(0.55 0.018 240)" }}
              data-ocid="admin.users.capital_gains.empty_state"
            >
              No capital gains data.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund</TableHead>
                  <TableHead>LTCG</TableHead>
                  <TableHead>STCG</TableHead>
                  <TableHead>Total Gain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.capitalGains.details.map((g, i) => {
                  const total = g.ltcg + g.stcg;
                  const isGain = total >= 0n;
                  return (
                    <TableRow
                      key={`cg-${g.fundId}-${i}`}
                      data-ocid={`admin.users.capital_gains.item.${i + 1}`}
                    >
                      <TableCell className="font-medium text-xs">
                        {g.fundId}
                      </TableCell>
                      <TableCell
                        className="text-xs tabular-nums"
                        style={{ color: "oklch(0.40 0.12 145)" }}
                      >
                        {formatINR(g.ltcg)}
                      </TableCell>
                      <TableCell
                        className="text-xs tabular-nums"
                        style={{ color: "oklch(0.45 0.12 25)" }}
                      >
                        {formatINR(g.stcg)}
                      </TableCell>
                      <TableCell
                        className="text-xs tabular-nums font-semibold"
                        style={{
                          color: isGain
                            ? "oklch(0.40 0.12 145)"
                            : "oklch(0.45 0.12 25)",
                        }}
                      >
                        {isGain ? "+" : ""}
                        {formatINR(total)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const { data: users, isLoading } = useGetAdminUserList();
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);

  const now = Date.now();
  const DAY_MS = 86_400_000;
  const WEEK_MS = 7 * DAY_MS;

  const totalUsers = users?.length ?? 0;
  const activeToday =
    users?.filter((u) => isActive(u.lastSeen, DAY_MS)).length ?? 0;
  const activeLast7Days =
    users?.filter((u) => isActive(u.lastSeen, WEEK_MS)).length ?? 0;
  const newThisWeek =
    users?.filter((u) => {
      const ms = Number(u.registeredAt / 1_000_000n);
      return ms > 0 && now - ms <= WEEK_MS;
    }).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-xl font-bold"
          style={{ color: "oklch(0.22 0.04 240)" }}
        >
          Users
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{ color: "oklch(0.55 0.018 240)" }}
        >
          View all registered users, their activity, and full portfolio details.
        </p>
      </div>

      {/* Stat Cards */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        data-ocid="admin.users.section"
      >
        <StatCard label="Total Users" value={totalUsers} accent />
        <StatCard label="Active Today" value={activeToday} />
        <StatCard label="Active Last 7 Days" value={activeLast7Days} />
        <StatCard label="New This Week" value={newThisWeek} />
      </div>

      {/* User Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid oklch(0.88 0.015 220)" }}
        data-ocid="admin.users.table"
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: "oklch(0.97 0.008 240)",
            borderBottom: "1px solid oklch(0.88 0.015 220)",
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.30 0.05 240)" }}
          >
            Registered Users
          </p>
          {users && (
            <Badge variant="outline" style={{ fontSize: "11px" }}>
              {totalUsers} total
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3" data-ocid="admin.users.loading_state">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : !users || users.length === 0 ? (
          <div
            className="py-16 text-center"
            data-ocid="admin.users.empty_state"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "oklch(0.93 0.015 240)" }}
            >
              <span style={{ fontSize: "22px" }}>👥</span>
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: "oklch(0.35 0.04 240)" }}
            >
              No users registered yet
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "oklch(0.55 0.018 240)" }}
            >
              Users will appear here after they sign up.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User (Principal)</TableHead>
                <TableHead>Gmail</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Invested</TableHead>
                <TableHead>Txns</TableHead>
                <TableHead className="text-right">Portfolio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => {
                const activeNow = isActive(user.lastSeen, DAY_MS);
                const activeWeek = isActive(user.lastSeen, WEEK_MS);
                return (
                  <motion.tr
                    key={user.principal}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className="border-b last:border-0"
                    style={{ borderColor: "oklch(0.91 0.01 220)" }}
                    data-ocid={`admin.users.row.${i + 1}`}
                  >
                    <TableCell
                      className="font-mono text-xs"
                      title={user.principal}
                    >
                      {truncatePrincipal(user.principal)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {user.gmail ? (
                        user.gmail
                      ) : (
                        <em style={{ color: "oklch(0.60 0.010 240)" }}>
                          Not set
                        </em>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDateIST(user.registeredAt)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatIST(user.lastSeen)}
                    </TableCell>
                    <TableCell>
                      {activeNow ? (
                        <Badge
                          className="text-xs"
                          style={{
                            background: "oklch(0.88 0.10 145)",
                            color: "oklch(0.30 0.10 145)",
                            border: "none",
                          }}
                        >
                          Active Today
                        </Badge>
                      ) : activeWeek ? (
                        <Badge
                          className="text-xs"
                          style={{
                            background: "oklch(0.90 0.07 240)",
                            color: "oklch(0.35 0.10 240)",
                            border: "none",
                          }}
                        >
                          Active 7d
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ color: "oklch(0.60 0.010 240)" }}
                        >
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums font-medium">
                      {formatINR(user.totalInvested)}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums">
                      {Number(user.transactionCount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-3"
                        onClick={() => setSelectedUser(user)}
                        data-ocid={`admin.users.view_portfolio.button.${i + 1}`}
                        style={{
                          borderColor: "oklch(0.45 0.12 240 / 0.40)",
                          color: "oklch(0.40 0.10 240)",
                        }}
                      >
                        View Portfolio
                      </Button>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Portfolio Modal */}
      {selectedUser && (
        <PortfolioModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
