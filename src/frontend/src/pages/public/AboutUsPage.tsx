import { useGetPageContent } from "@/hooks/useQueries";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

const DEFAULT_ABOUT_CONTENT = [
  "Jagdish PMS is a personal project built to simplify mutual fund portfolio tracking for Indian investors. We believe every investor deserves a professional-grade tool without the complexity of spreadsheets or the cost of financial advisors.",
  "Founded by Jagdish, this project was born out of frustration with existing solutions \u2014 maintaining Excel sheets, updating NAVs manually, calculating capital gains at tax time. There had to be a better way.",
  "Our mission is to empower every Indian mutual fund investor with clear, accurate, and real-time visibility into their portfolio \u2014 from a simple SIP to a complex multi-fund, multi-AMC portfolio.",
];

const FEATURES = [
  "Manual and automated NAV tracking for all mutual fund schemes",
  "Real-time portfolio summary with XIRR and returns calculation",
  "Capital gains report compliant with Indian income tax rules (FIFO)",
  "SIP tracking, fund comparison, and goal-based investing tools",
  "Privacy-first: your data stays with you, not shared with any third party",
];

export default function AboutUsPage() {
  const { data: page, isLoading } = useGetPageContent("page-about");

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "oklch(0.35 0.10 240)" }}
          />
        </div>
      </section>
    );
  }

  const paragraphs =
    page && page.content.length > 0 ? page.content : DEFAULT_ABOUT_CONTENT;
  const title = page?.title ?? "About Us";

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-display font-bold text-4xl mb-2"
            style={{ color: "oklch(0.18 0.065 240)" }}
          >
            {title}
          </h1>
          <p
            className="text-sm mb-8"
            style={{ color: "oklch(0.55 0.018 240)" }}
          >
            Learn about the person behind Jagdish PMS
          </p>

          {/* Main description */}
          <div className="space-y-5 mb-10">
            {paragraphs.map((para) => (
              <p
                key={para.slice(0, 40)}
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.35 0.018 240)" }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Only show default extras when no custom content */}
          {!page && (
            <>
              {/* Divider */}
              <div
                className="border-t my-8"
                style={{ borderColor: "oklch(0.88 0.01 220)" }}
              />

              {/* What we offer */}
              <div className="mb-10">
                <h2
                  className="font-display font-semibold text-xl mb-4"
                  style={{ color: "oklch(0.20 0.065 240)" }}
                >
                  What Jagdish PMS Offers
                </h2>
                <ul className="space-y-2">
                  {FEATURES.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: "oklch(0.35 0.018 240)" }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "oklch(0.35 0.10 240)" }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div
                className="border-t my-8"
                style={{ borderColor: "oklch(0.88 0.01 220)" }}
              />

              {/* Contact info */}
              <div
                className="rounded-xl border p-6"
                style={{
                  background: "oklch(0.97 0.008 220)",
                  borderColor: "oklch(0.88 0.01 220)",
                }}
              >
                <h2
                  className="font-display font-semibold text-lg mb-1"
                  style={{ color: "oklch(0.20 0.065 240)" }}
                >
                  Get in Touch
                </h2>
                <p
                  className="text-sm mb-3"
                  style={{ color: "oklch(0.45 0.018 240)" }}
                >
                  Have questions, suggestions, or just want to say hello?
                </p>
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.35 0.018 240)" }}
                >
                  <span className="font-medium">Jagdish</span>
                  {" \u2014 "}
                  <a
                    href="mailto:midja85@gmail.com"
                    className="underline underline-offset-2"
                    style={{ color: "oklch(0.35 0.10 240)" }}
                  >
                    midja85@gmail.com
                  </a>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
