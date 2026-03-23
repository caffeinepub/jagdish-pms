import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveUserProfile } from "../hooks/useQueries";
import { useUserEmail } from "../hooks/useUserEmail";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { mutateAsync, isPending } = useSaveUserProfile();
  const { saveEmail } = useUserEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await mutateAsync({
        name: name.trim(),
        gmail: "",
        registeredAt: BigInt(0),
        lastSeen: BigInt(0),
      });
      if (email.trim()) {
        saveEmail(email.trim());
      }
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
            style={{ background: "oklch(0.28 0.085 240)" }}
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Jagdish PMS</span>
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
          <div>
            <Label htmlFor="profile-email">
              Your Gmail / Email{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="profile-email"
              data-ocid="profile.email.input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Helps you identify which Google account you used to log in.
            </p>
          </div>
          <Button
            type="submit"
            data-ocid="profile.submit_button"
            disabled={isPending || !name.trim()}
            className="w-full"
            style={{ background: "oklch(0.28 0.085 240)", color: "white" }}
          >
            {isPending ? "Saving..." : "Continue"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
