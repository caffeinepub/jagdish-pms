import { useGetPageContent } from "@/hooks/useQueries";
import { Loader2, Mail } from "lucide-react";
import { motion } from "motion/react";

const DEFAULT_CONTACT_CONTENT = [
  "We'd love to hear from you. Whether you have a question about the app, found a bug, or have a feature request \u2014 reach out and we'll do our best to help.",
  "We typically respond within 1\u20132 business days.",
];

const SUPPORT_TOPICS = [
  "Portfolio tracking questions",
  "Bug reports and technical issues",
  "Feature requests and suggestions",
  "General feedback and ideas",
  "Data privacy and security concerns",
];

export default function ContactUsPage() {
  const { data: page, isLoading } = useGetPageContent("page-contact");

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
    page && page.content.length > 0 ? page.content : DEFAULT_CONTACT_CONTENT;
  const title = page?.title ?? "Contact Us";

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
            We&#39;re here to help
          </p>

          {/* Intro paragraphs */}
          <div className="space-y-4 mb-8">
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
              {/* Email card */}
              <div
                className="rounded-xl border p-6 flex items-start gap-4 mb-8"
                style={{
                  background: "oklch(0.97 0.008 220)",
                  borderColor: "oklch(0.88 0.01 220)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.35 0.10 240 / 0.10)" }}
                >
                  <Mail
                    className="w-5 h-5"
                    style={{ color: "oklch(0.35 0.10 240)" }}
                  />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm mb-0.5"
                    style={{ color: "oklch(0.20 0.065 240)" }}
                  >
                    Email Us
                  </p>
                  <a
                    href="mailto:midja85@gmail.com"
                    className="text-sm underline underline-offset-2"
                    style={{ color: "oklch(0.35 0.10 240)" }}
                  >
                    midja85@gmail.com
                  </a>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.50 0.018 240)" }}
                  >
                    Response time: 1\u20132 business days
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div
                className="border-t my-8"
                style={{ borderColor: "oklch(0.88 0.01 220)" }}
              />

              {/* Support topics */}
              <div>
                <h2
                  className="font-display font-semibold text-lg mb-4"
                  style={{ color: "oklch(0.20 0.065 240)" }}
                >
                  What We Can Help With
                </h2>
                <ul className="space-y-2">
                  {SUPPORT_TOPICS.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ color: "oklch(0.35 0.018 240)" }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "oklch(0.35 0.10 240)" }}
                      />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
