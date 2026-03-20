import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetAllFunds, useUpdateNav } from "../hooks/useQueries";
import { categoryLabel, formatDate } from "../utils/format";

export default function NavUpdate() {
  const { data: funds, isLoading } = useGetAllFunds();
  const updateNav = useUpdateNav();
  const [navInputs, setNavInputs] = useState<Record<string, string>>({});
  const [updated, setUpdated] = useState<Record<string, boolean>>({});

  const handleUpdate = async (fundId: string) => {
    const val = navInputs[fundId];
    if (!val) return;
    try {
      const navPaise = BigInt(Math.round(Number.parseFloat(val) * 100));
      await updateNav.mutateAsync({ fundId, newNav: navPaise });
      setUpdated((prev) => ({ ...prev, [fundId]: true }));
      setNavInputs((prev) => ({ ...prev, [fundId]: "" }));
      toast.success("NAV updated");
      setTimeout(
        () => setUpdated((prev) => ({ ...prev, [fundId]: false })),
        2000,
      );
    } catch {
      toast.error("Failed to update NAV");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">NAV Update</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manually update the Net Asset Value for your funds
        </p>
      </div>

      <div className="grid gap-4">
        {isLoading && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="nav_update.loading_state"
          >
            Loading funds...
          </div>
        )}
        {!isLoading && (funds ?? []).length === 0 && (
          <Card className="shadow-card border-0">
            <CardContent
              className="py-12 text-center text-muted-foreground"
              data-ocid="nav_update.empty_state"
            >
              No funds added yet.
            </CardContent>
          </Card>
        )}
        {(funds ?? []).map((fund, i) => (
          <motion.div
            key={fund.id}
            data-ocid={`nav_update.item.${i + 1}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="shadow-card border-0">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold truncate">{fund.name}</h3>
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0"
                      >
                        {categoryLabel(fund.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current NAV:{" "}
                      <span className="font-semibold text-foreground">
                        ₹{(Number(fund.currentNav) / 100).toFixed(2)}
                      </span>
                      {" · "}
                      Last updated: {formatDate(fund.lastNavUpdate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        data-ocid={`nav_update.nav.input.${i + 1}`}
                        type="number"
                        step="0.01"
                        value={navInputs[fund.id] ?? ""}
                        onChange={(e) =>
                          setNavInputs((prev) => ({
                            ...prev,
                            [fund.id]: e.target.value,
                          }))
                        }
                        placeholder={(Number(fund.currentNav) / 100).toFixed(2)}
                        className="pl-7 w-36"
                      />
                    </div>
                    <Button
                      data-ocid={`nav_update.update.button.${i + 1}`}
                      onClick={() => handleUpdate(fund.id)}
                      disabled={!navInputs[fund.id] || updateNav.isPending}
                      style={{
                        background: "oklch(0.58 0.19 255)",
                        color: "white",
                      }}
                    >
                      {updated[fund.id] ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1.5" /> Updated
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1.5" /> Update
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
