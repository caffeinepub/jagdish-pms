import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BarChart3,
  FileText,
  Shield,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginPageProps {
  onBackToWebsite?: () => void;
}

export default function LoginPage({ onBackToWebsite }: LoginPageProps) {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.965 0.012 240)" }}
    >
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 sidebar-gradient">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.52 0.13 185)" }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white block leading-tight">
                Jagdish PMS
              </span>
              <span
                className="text-xs"
                style={{ color: "oklch(0.60 0.02 240)" }}
              >
                Portfolio Management Software
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight font-display">
              Your Mutual Fund
              <br />
              Portfolio, Simplified
            </h1>
            <p className="text-lg" style={{ color: "oklch(0.78 0.03 240)" }}>
              Track, analyze, and optimize your mutual fund investments with
              India-specific tax reports and real-time performance insights.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: BarChart3,
              title: "Portfolio Analytics",
              desc: "Real-time performance tracking",
            },
            {
              icon: FileText,
              title: "Capital Gains Report",
              desc: "STCG & LTCG calculations",
            },
            {
              icon: TrendingUp,
              title: "XIRR Calculator",
              desc: "Annualized returns",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              desc: "Blockchain-powered security",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl p-4"
              style={{ background: "oklch(0.28 0.075 240 / 0.5)" }}
            >
              <Icon
                className="w-5 h-5 mb-2"
                style={{ color: "oklch(0.72 0.16 185)" }}
              />
              <div className="text-sm font-semibold text-white">{title}</div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.70 0.02 240)" }}
              >
                {desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl shadow-card-md p-8">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.52 0.13 185)" }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Jagdish PMS</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 font-display">
              Welcome back
            </h2>
            <p className="text-muted-foreground mb-8">
              Sign in to access your mutual fund portfolio dashboard.
            </p>
            <Button
              data-ocid="login.primary_button"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="w-full h-12 text-base font-semibold"
              style={{ background: "oklch(0.28 0.085 240)", color: "white" }}
            >
              {isLoggingIn ? "Connecting..." : "Sign In with Internet Identity"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Your data is secured on the Internet Computer blockchain.
            </p>
            {onBackToWebsite && (
              <button
                type="button"
                data-ocid="login.back_to_website.button"
                onClick={onBackToWebsite}
                className="w-full flex items-center justify-center gap-1.5 mt-4 text-xs font-medium transition-colors hover:text-foreground"
                style={{ color: "oklch(0.52 0.018 240)" }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Website
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
