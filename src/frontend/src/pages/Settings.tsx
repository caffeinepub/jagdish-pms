import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useIsCallerAdmin,
  useSaveUserProfile,
} from "../hooks/useQueries";

export default function Settings() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const [name, setName] = useState("");
  const [claiming, setClaiming] = useState(false);
  const { actor } = useActor();
  const qc = useQueryClient();

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleClaimAdmin = async () => {
    if (!actor) return;
    setClaiming(true);
    try {
      const success = await actor.bootstrapFirstAdmin();
      if (success) {
        await qc.invalidateQueries();
        await qc.refetchQueries({ queryKey: ["isCallerAdmin"] });
        toast.success(
          "Admin access granted! Blog Admin is now available in the sidebar.",
        );
      } else {
        toast.error(
          "Admin has already been claimed by another account. Contact the current admin.",
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const principal = identity?.getPrincipal().toString() ?? "";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your profile and account
        </p>
      </div>

      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="settings-name">Display Name</Label>
              <Input
                id="settings-name"
                data-ocid="settings.name.input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1.5"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              data-ocid="settings.save.submit_button"
              disabled={saveProfile.isPending || !name.trim()}
              style={{ background: "oklch(0.58 0.19 255)", color: "white" }}
            >
              {saveProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div data-ocid="settings.admin_status.panel">
            {adminLoading ? (
              <span className="text-sm text-muted-foreground">Checking...</span>
            ) : isAdmin ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                  Admin
                </Badge>
                <span className="text-sm text-muted-foreground">
                  You have admin access. Blog Admin is available in the sidebar.
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
                    Not Admin
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    You do not have admin access yet.
                  </span>
                </div>

                <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4 space-y-3">
                  <p className="text-sm font-medium text-blue-900">
                    Claim Admin Access
                  </p>
                  <p className="text-xs text-blue-700">
                    If no admin has been assigned yet, clicking the button below
                    will make you the admin. This can only be done once -- the
                    first person to click it becomes the permanent admin.
                  </p>
                  <Button
                    onClick={handleClaimAdmin}
                    disabled={claiming || !actor}
                    data-ocid="settings.claim_admin.button"
                    style={{
                      background: "oklch(0.58 0.19 255)",
                      color: "white",
                    }}
                  >
                    {claiming ? "Claiming..." : "Become Admin"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Principal ID
            </p>
            <p
              className="text-sm font-mono break-all"
              data-ocid="settings.principal.panel"
            >
              {principal || "Not logged in"}
            </p>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Your data is stored on the Internet Computer blockchain. No central
            server holds your financial data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
