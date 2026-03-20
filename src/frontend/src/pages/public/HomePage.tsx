import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CheckCircle2,
  FileText,
  IndianRupee,
  RefreshCw,
  Shield,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onLaunchApp: () => void;
}

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Portfolio Tracking",
    desc: "Monitor all your mutual fund holdings in one unified dashboard with real-time value calculations.",
  },
  {
    icon: FileText,
    title: "Capital Gains Reports",
    desc: "Generate STCG and LTCG reports compliant with Indian tax laws, ready for ITR filing.",
  },
  {
    icon: RefreshCw,
    title: "NAV Updates",
    desc: "Manually update NAVs for any fund and see your portfolio value recalculated instantly.",
  },
  {
    icon: BarChart3,
    title: "XIRR Calculations",
    desc: "Get accurate annualized return figures using XIRR methodology for all your investments.",
  },
  {
    icon: IndianRupee,
    title: "Indian Tax Compliant",
    desc: "Built for Indian investors — handles equity, debt, and ELSS fund tax rules correctly.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your financial data is stored securely on the Internet Computer blockchain — no third parties.",
  },
];

const BENEFITS = [
  "Replace your Google Sheets tracker",
  "Automated XIRR and returns calculations",
  "India-specific STCG / LTCG reporting",
  "Equity, Debt, ELSS fund categorization",
  "Complete transaction history",
  "Portfolio allocation at a glance",
];

export default function HomePage({ onLaunchApp }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.52 0.13 185) 0%, transparent 60%), radial-gradient(circle at 80% 20%, oklch(0.58 0.19 255) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="teal-badge inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5">
                India's Trusted Mutual Fund PMS
              </span>
              <h1
                className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
                style={{ color: "oklch(0.97 0.005 220)" }}
              >
                Jagdish Portfolio
                <br />
                <span style={{ color: "oklch(0.72 0.16 185)" }}>
                  Management Software
                </span>
              </h1>
              <p
                className="text-lg sm:text-xl mb-8 max-w-xl leading-relaxed"
                style={{ color: "oklch(0.78 0.02 220)" }}
              >
                The professional way to track, analyze and report your mutual
                fund investments in India — with capital gains reports, XIRR
                calculations, and Indian tax compliance built in.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  data-ocid="hero.launch_app.primary_button"
                  onClick={onLaunchApp}
                  size="lg"
                  className="text-base font-semibold px-8 h-12"
                  style={{ background: "oklch(0.52 0.13 185)", color: "white" }}
                >
                  Launch App
                </Button>
                <Button
                  data-ocid="hero.learn_more.secondary_button"
                  variant="outline"
                  size="lg"
                  className="text-base font-semibold px-8 h-12"
                  style={{
                    borderColor: "oklch(0.52 0.13 185 / 0.5)",
                    color: "oklch(0.80 0.015 220)",
                    background: "transparent",
                  }}
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section
        className="py-8 border-y"
        style={{
          background: "oklch(0.95 0.008 220)",
          borderColor: "oklch(0.88 0.01 220)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(0.52 0.13 185)" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.28 0.05 240)" }}
                >
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2
              className="font-display font-bold text-3xl sm:text-4xl mb-4"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Everything You Need to Manage Your Portfolio
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "oklch(0.48 0.018 240)" }}
            >
              Built specifically for Indian mutual fund investors who want to go
              beyond spreadsheets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl p-6 border shadow-card hover:shadow-card-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "oklch(0.28 0.085 240 / 0.08)" }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.28 0.085 240)" }}
                  />
                </div>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: "oklch(0.18 0.055 240)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.48 0.018 240)" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ background: "oklch(0.95 0.008 220)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-display font-bold text-3xl sm:text-4xl mb-4"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Ready to Take Control of Your Investments?
            </h2>
            <p
              className="text-lg mb-8 max-w-xl mx-auto"
              style={{ color: "oklch(0.45 0.018 240)" }}
            >
              Join investors who manage their mutual fund portfolios
              professionally with Jagdish PMS.
            </p>
            <Button
              data-ocid="cta.launch_app.primary_button"
              onClick={onLaunchApp}
              size="lg"
              className="text-base font-semibold px-10 h-12"
              style={{ background: "oklch(0.28 0.085 240)", color: "white" }}
            >
              Launch App — It's Free
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
