import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface PricingTier {
  id: string;
  badge: string;
  label: string;
  monthly: number | null;
  annual: number | null;
  tagline: string;
  features: string[];
  highlight?: string;
}

const TIERS: PricingTier[] = [
  {
    id: "classic",
    badge: "v1",
    label: "Classic",
    monthly: 0,
    annual: 0,
    tagline: "Simple manual fund tracking",
    features: [
      "Manual NAV entry",
      "Transaction history",
      "Basic portfolio summary",
      "Capital gains report (FIFO)",
      "Mobile-friendly interface",
    ],
  },
  {
    id: "lite",
    badge: "v8",
    label: "Lite",
    monthly: 49,
    annual: 499,
    tagline: "Mobile-first minimal tracker",
    features: [
      "Core fund tracking",
      "One-tap NAV updates",
      "Basic capital gains",
      "Minimal clean UI",
      "Offline-capable PWA",
    ],
    highlight: "Budget Pick",
  },
  {
    id: "advanced",
    badge: "v2",
    label: "Advanced",
    monthly: 99,
    annual: 999,
    tagline: "SIP tracking & fund analytics",
    features: [
      "Everything in Classic",
      "SIP tracker & calculator",
      "Fund comparison tool",
      "Portfolio charts & analytics",
      "Export to PDF/Excel",
    ],
  },
  {
    id: "pro",
    badge: "v3",
    label: "Pro",
    monthly: 199,
    annual: 1999,
    tagline: "Automated NAV & goal investing",
    features: [
      "Everything in Advanced",
      "Automated NAV updates",
      "Goal-based investing",
      "Tax optimizer",
      "Priority support",
    ],
    highlight: "Most Popular",
  },
  {
    id: "elite",
    badge: "v4",
    label: "Elite",
    monthly: 299,
    annual: 2999,
    tagline: "Broker integration & CAS import",
    features: [
      "Everything in Pro",
      "CAS import (CAMS/KFintech)",
      "Broker-wise filtering",
      "AMC-wise & distributor-wise view",
      "Real-time NAV from AMFI",
    ],
  },
  {
    id: "smart",
    badge: "v5",
    label: "Smart",
    monthly: 399,
    annual: 3999,
    tagline: "AI-powered insights & nudges",
    features: [
      "Everything in Elite",
      "AI-assisted portfolio nudges",
      "What-if scenario planner",
      "Rebalancing alerts",
      "Smart tax-loss harvesting",
    ],
  },
  {
    id: "wealth",
    badge: "v6",
    label: "Wealth",
    monthly: 499,
    annual: 4999,
    tagline: "Multi-asset: MF + equity + FD + gold",
    features: [
      "Everything in Smart",
      "Indian equity share tracking",
      "Fixed deposit tracker",
      "Gold & real estate tracking",
      "Unified net worth dashboard",
    ],
  },
  {
    id: "tax-expert",
    badge: "v7",
    label: "Tax Expert",
    monthly: 599,
    annual: 5999,
    tagline: "Deep tax tools & ITR-ready reports",
    features: [
      "Everything in Wealth",
      "ITR schedule-ready reports",
      "LTCG exemption optimizer",
      "Tax harvesting automation",
      "Advance tax estimator",
    ],
  },
  {
    id: "ultra",
    badge: "v9",
    label: "Ultra",
    monthly: 799,
    annual: 7999,
    tagline: "All features — power user edition",
    features: [
      "All features from every version",
      "Unlimited portfolios",
      "Family account (up to 4 members)",
      "API access",
      "Dedicated support",
    ],
  },
  {
    id: "enterprise",
    badge: "v10",
    label: "Enterprise",
    monthly: null,
    annual: null,
    tagline: "Multi-user advisor & family office",
    features: [
      "Everything in Ultra",
      "Unlimited family/client accounts",
      "Advisor dashboard",
      "White-label option",
      "SLA-backed support",
    ],
  },
];

const FAQS = [
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can explore all features and upgrade or cancel before the trial ends.",
  },
  {
    q: "How much do I save with an annual plan?",
    a: "Annual plans give you 2 months free — that's roughly 17% off compared to paying monthly. For example, the Pro plan costs ₹199/month but only ₹1,999/year (saving ₹389).",
  },
  {
    q: "Can I switch between plans?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at the end of your current billing period.",
  },
  {
    q: "Is my financial data safe?",
    a: "Yes. Jagdish PMS is built on the Internet Computer blockchain, meaning your data is stored in tamper-proof canisters and you control access via Internet Identity. We never sell or share your data.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We currently support UPI, net banking, credit/debit cards (Visa, Mastercard, RuPay), and major Indian wallets. All payments are processed securely.",
  },
];

function PricingCard({
  tier,
  annual,
  index,
}: {
  tier: PricingTier;
  annual: boolean;
  index: number;
}) {
  const price = annual ? tier.annual : tier.monthly;
  const isFree = price === 0;
  const isEnterprise = price === null;
  const isPopular = tier.highlight === "Most Popular";
  const isBudget = tier.highlight === "Budget Pick";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: isPopular
          ? "oklch(0.18 0.07 240)"
          : "oklch(0.97 0.008 230)",
        border: isPopular
          ? "2px solid oklch(0.52 0.13 185)"
          : "1px solid oklch(0.88 0.015 220)",
        boxShadow: isPopular
          ? "0 8px 32px oklch(0.52 0.13 185 / 0.18)"
          : "0 2px 8px oklch(0.18 0.07 240 / 0.06)",
      }}
    >
      {/* Badge */}
      {tier.highlight && (
        <div
          className="absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl text-xs font-bold flex items-center gap-1.5"
          style={{
            background: isPopular
              ? "oklch(0.52 0.13 185)"
              : "oklch(0.68 0.12 85)",
            color: "white",
          }}
        >
          {isPopular ? (
            <Star className="w-3 h-3" />
          ) : (
            <Zap className="w-3 h-3" />
          )}
          {tier.highlight}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{
                background: isPopular
                  ? "oklch(0.52 0.13 185 / 0.25)"
                  : "oklch(0.88 0.015 220)",
                color: isPopular
                  ? "oklch(0.72 0.12 185)"
                  : "oklch(0.42 0.06 240)",
              }}
            >
              {tier.badge}
            </span>
            <span
              className="font-bold text-lg"
              style={{
                color: isPopular
                  ? "oklch(0.96 0.008 220)"
                  : "oklch(0.2 0.05 240)",
              }}
            >
              {tier.label}
            </span>
          </div>
          <p
            className="text-sm"
            style={{
              color: isPopular
                ? "oklch(0.72 0.018 220)"
                : "oklch(0.55 0.018 240)",
            }}
          >
            {tier.tagline}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          {isFree ? (
            <div>
              <span
                className="text-4xl font-extrabold tracking-tight"
                style={{
                  color: isPopular
                    ? "oklch(0.72 0.13 185)"
                    : "oklch(0.52 0.13 185)",
                }}
              >
                Free
              </span>
              <span
                className="ml-2 text-sm font-medium"
                style={{
                  color: isPopular
                    ? "oklch(0.65 0.015 220)"
                    : "oklch(0.55 0.018 240)",
                }}
              >
                Forever
              </span>
            </div>
          ) : isEnterprise ? (
            <div>
              <span
                className="text-3xl font-extrabold tracking-tight"
                style={{
                  color: isPopular
                    ? "oklch(0.72 0.13 185)"
                    : "oklch(0.52 0.13 185)",
                }}
              >
                Custom
              </span>
              <p
                className="text-xs mt-1"
                style={{
                  color: isPopular
                    ? "oklch(0.65 0.015 220)"
                    : "oklch(0.55 0.018 240)",
                }}
              >
                Contact us for pricing
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: isPopular
                      ? "oklch(0.75 0.015 220)"
                      : "oklch(0.45 0.03 240)",
                  }}
                >
                  ₹
                </span>
                <span
                  className="text-4xl font-extrabold tracking-tight"
                  style={{
                    color: isPopular
                      ? "oklch(0.96 0.008 220)"
                      : "oklch(0.2 0.05 240)",
                  }}
                >
                  {annual ? Math.round((price ?? 0) / 12) : price}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: isPopular
                      ? "oklch(0.65 0.015 220)"
                      : "oklch(0.55 0.018 240)",
                  }}
                >
                  /month
                </span>
              </div>
              {annual && (
                <p
                  className="text-xs mt-1"
                  style={{
                    color: isPopular
                      ? "oklch(0.65 0.12 185)"
                      : "oklch(0.52 0.13 185)",
                  }}
                >
                  Billed ₹{price}/year · 2 months free
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{
                  color: isPopular
                    ? "oklch(0.65 0.12 185)"
                    : "oklch(0.52 0.13 185)",
                }}
              />
              <span
                style={{
                  color: isPopular
                    ? "oklch(0.82 0.012 220)"
                    : "oklch(0.35 0.04 240)",
                }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          data-ocid={`pricing.${tier.id}.button`}
          className="w-full font-semibold"
          style={{
            background: isPopular
              ? "oklch(0.52 0.13 185)"
              : isBudget
                ? "oklch(0.68 0.12 85)"
                : "oklch(0.28 0.085 240)",
            color: "white",
          }}
        >
          {isEnterprise ? "Contact Us" : isFree ? "Start Free" : "Get Started"}
        </Button>

        {!isFree && !isEnterprise && (
          <p
            className="text-center text-xs mt-2"
            style={{
              color: isPopular
                ? "oklch(0.58 0.015 220)"
                : "oklch(0.60 0.015 240)",
            }}
          >
            14-day free trial · No credit card
          </p>
        )}
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid oklch(0.88 0.015 220)" }}
    >
      <button
        type="button"
        data-ocid={`pricing.faq.item.${index + 1}`}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 transition-colors"
        style={{
          background: open ? "oklch(0.95 0.012 230)" : "oklch(0.98 0.006 230)",
        }}
      >
        <span
          className="font-medium text-sm"
          style={{ color: "oklch(0.22 0.05 240)" }}
        >
          {q}
        </span>
        {open ? (
          <ChevronUp
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "oklch(0.52 0.13 185)" }}
          />
        ) : (
          <ChevronDown
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "oklch(0.55 0.018 240)" }}
          />
        )}
      </button>
      {open && (
        <div
          className="px-5 py-4 text-sm leading-relaxed"
          style={{
            background: "oklch(0.975 0.008 230)",
            color: "oklch(0.42 0.03 240)",
            borderTop: "1px solid oklch(0.88 0.015 220)",
          }}
        >
          {a}
        </div>
      )}
    </motion.div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.965 0.012 240)" }}
      data-ocid="pricing.page"
    >
      {/* Hero */}
      <section
        className="py-16 px-4"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.18 0.07 240) 0%, oklch(0.22 0.08 220) 50%, oklch(0.28 0.085 240) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "oklch(0.52 0.13 185 / 0.15)",
              color: "oklch(0.72 0.12 185)",
              border: "1px solid oklch(0.52 0.13 185 / 0.25)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simple, transparent pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: "oklch(0.97 0.005 220)" }}
          >
            Choose your plan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-lg mb-8"
            style={{ color: "oklch(0.72 0.018 220)" }}
          >
            From free manual tracking to enterprise-grade portfolio management.
            Start free, upgrade as you grow.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl"
            style={{
              background: "oklch(0.14 0.06 240 / 0.6)",
              border: "1px solid oklch(0.35 0.07 240)",
            }}
          >
            <span
              className="text-sm font-medium"
              style={{
                color: annual
                  ? "oklch(0.60 0.015 220)"
                  : "oklch(0.97 0.005 220)",
              }}
            >
              Monthly
            </span>
            <Switch
              data-ocid="pricing.billing.toggle"
              checked={annual}
              onCheckedChange={setAnnual}
            />
            <span
              className="text-sm font-medium flex items-center gap-2"
              style={{
                color: annual
                  ? "oklch(0.97 0.005 220)"
                  : "oklch(0.60 0.015 220)",
              }}
            >
              Annual
              {annual && (
                <Badge
                  className="text-xs px-2 py-0.5 font-semibold"
                  style={{ background: "oklch(0.52 0.13 185)", color: "white" }}
                >
                  Save ~17%
                </Badge>
              )}
            </span>
          </motion.div>

          {annual && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-xs"
              style={{ color: "oklch(0.62 0.12 185)" }}
            >
              Save 2 months — equivalent to ~17% off the monthly price
            </motion.p>
          )}
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {TIERS.map((tier, i) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                annual={annual}
                index={i}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm mt-8"
            style={{ color: "oklch(0.55 0.018 240)" }}
          >
            All prices in INR. GST applicable as per government regulations.
            Early adopter discount of up to 40% available during launch period.
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "oklch(0.2 0.05 240)" }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.018 240)" }}>
              Everything you need to know about pricing and plans.
            </p>
          </motion.div>

          <div className="space-y-3" data-ocid="pricing.faq.list">
            {FAQS.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="py-14 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.07 240) 0%, oklch(0.24 0.09 210) 100%)",
        }}
      >
        <div className="max-w-xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-3"
            style={{ color: "oklch(0.97 0.005 220)" }}
          >
            Not sure where to start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm mb-6"
            style={{ color: "oklch(0.72 0.018 220)" }}
          >
            Start with the free Classic plan. No credit card required. Upgrade
            anytime when you're ready for more.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              data-ocid="pricing.cta.primary_button"
              size="lg"
              className="font-semibold px-8"
              style={{ background: "oklch(0.52 0.13 185)", color: "white" }}
            >
              Start for Free
            </Button>
            <Button
              data-ocid="pricing.cta.secondary_button"
              size="lg"
              variant="outline"
              className="font-semibold px-8"
              style={{
                borderColor: "oklch(0.52 0.13 185 / 0.5)",
                color: "oklch(0.72 0.12 185)",
                background: "transparent",
              }}
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
