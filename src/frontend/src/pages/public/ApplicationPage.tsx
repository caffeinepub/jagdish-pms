import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  FileText,
  IndianRupee,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

interface ApplicationPageProps {
  onLaunchApp: () => void;
}

const APP_FEATURES = [
  {
    icon: TrendingUp,
    title: "Portfolio Dashboard",
    desc: "Get a bird's-eye view of your entire mutual fund portfolio — total invested, current value, absolute returns, and allocation breakdown.",
  },
  {
    icon: RefreshCw,
    title: "NAV Management",
    desc: "Update NAVs for each fund manually and watch your portfolio value recalculate in real time.",
  },
  {
    icon: ArrowRight,
    title: "Transaction Recording",
    desc: "Log all your SIP, lumpsum, and redemption transactions with date, units, and NAV information.",
  },
  {
    icon: FileText,
    title: "Capital Gains Report",
    desc: "Generate detailed STCG and LTCG reports with granular lot-level tax computation, ready for your CA or ITR filing.",
  },
  {
    icon: BarChart3,
    title: "XIRR & Returns",
    desc: "Automatically computes absolute returns and annualized XIRR for all your holdings.",
  },
  {
    icon: IndianRupee,
    title: "Indian Tax Rules",
    desc: "Equity (1-year LTCG threshold), Debt (2-year LTCG threshold with indexation), and ELSS (3-year lock-in) — all handled correctly.",
  },
];

export default function ApplicationPage({ onLaunchApp }: ApplicationPageProps) {
  return (
    <div>
      {/* Page header */}
      <section
        className="py-16"
        style={{ background: "oklch(0.95 0.008 220)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="teal-badge inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4">
              Portfolio Management Application
            </span>
            <h1
              className="font-display font-bold text-4xl sm:text-5xl mb-5"
              style={{ color: "oklch(0.18 0.065 240)" }}
            >
              The Application
            </h1>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: "oklch(0.42 0.018 240)" }}
            >
              Jagdish PMS is a full-featured portfolio management application
              for Indian mutual fund investors. It replaces complex spreadsheets
              with a clean, professional interface backed by a secure blockchain
              database.
            </p>
            <Button
              data-ocid="application.launch_app.primary_button"
              onClick={onLaunchApp}
              size="lg"
              className="font-semibold px-8 h-12 text-base"
              style={{ background: "oklch(0.28 0.085 240)", color: "white" }}
            >
              Launch App / Login
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="font-display font-bold text-2xl mb-10"
            style={{ color: "oklch(0.20 0.065 240)" }}
          >
            What's Inside the Application
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APP_FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-4 p-5 bg-card rounded-xl border shadow-card"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.52 0.13 185 / 0.1)" }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.35 0.10 185)" }}
                  />
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "oklch(0.18 0.055 240)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.45 0.018 240)" }}
                  >
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 text-center"
        style={{ background: "oklch(0.18 0.065 240)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="font-display font-bold text-3xl mb-4"
            style={{ color: "oklch(0.97 0.005 220)" }}
          >
            Start Managing Your Portfolio Today
          </h2>
          <p className="mb-8" style={{ color: "oklch(0.72 0.02 220)" }}>
            Login with Internet Identity — no email, no password, just your
            device.
          </p>
          <Button
            data-ocid="application.cta.primary_button"
            onClick={onLaunchApp}
            size="lg"
            className="font-semibold px-10 h-12 text-base"
            style={{ background: "oklch(0.52 0.13 185)", color: "white" }}
          >
            Launch App / Login
          </Button>
        </div>
      </section>
    </div>
  );
}
