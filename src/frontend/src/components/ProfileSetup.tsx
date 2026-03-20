import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveUserProfile } from "../hooks/useQueries";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await mutateAsync({ name: name.trim() });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.965 0.012 240)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-card-md p-8 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.58 0.19 255)" }}
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">WealthGrow</span>
        </div>
        <h2 className="text-2xl font-bold mb-1">Set up your profile</h2>
        <p className="text-muted-foreground mb-6">
          Tell us your name to personalize your experience.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              data-ocid="profile.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="mt-1.5"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            data-ocid="profile.submit_button"
            disabled={isPending || !name.trim()}
            className="w-full"
            style={{ background: "oklch(0.58 0.19 255)", color: "white" }}
          >
            {isPending ? "Saving..." : "Continue"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
