import { motion } from "motion/react";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p
            className="text-sm mb-8"
            style={{ color: "oklch(0.55 0.018 240)" }}
          >
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="space-y-6" style={{ color: "oklch(0.35 0.018 240)" }}>
            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Introduction
            </h2>
            <p className="text-sm leading-relaxed">
              Jagdish Portfolio Management Software ("Jagdish PMS", "we", "us",
              or "our") respects your privacy. This Privacy Policy explains how
              we collect, use, and protect your information when you use our web
              application.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Information We Collect
            </h2>
            <p className="text-sm leading-relaxed">
              Jagdish PMS is built on the Internet Computer blockchain. The only
              data stored by the application is data you explicitly enter:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside ml-2">
              <li>Your user profile (name, as entered by you)</li>
              <li>Mutual fund details you add (fund name, category, NAV)</li>
              <li>Transaction records you create (dates, units, amounts)</li>
            </ul>
            <p className="text-sm leading-relaxed">
              We do not collect any personally identifiable information beyond
              what you voluntarily enter. We do not collect email addresses,
              phone numbers, Aadhaar numbers, PAN numbers, or any financial
              account credentials.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Internet Identity
            </h2>
            <p className="text-sm leading-relaxed">
              Authentication is handled by Internet Identity, a decentralized
              identity system on the Internet Computer. We do not have access to
              your Internet Identity credentials or private keys. Your identity
              on our application is represented by a pseudonymous principal ID.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              How We Use Your Information
            </h2>
            <p className="text-sm leading-relaxed">
              Information you enter is used solely to provide you with portfolio
              tracking, returns calculations, and capital gains reports within
              the application. Your data is associated with your Internet
              Identity principal and is accessible only to you.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Data Storage & Security
            </h2>
            <p className="text-sm leading-relaxed">
              Your data is stored on canisters deployed on the Internet Computer
              blockchain. The Internet Computer provides strong security
              guarantees through cryptography and decentralized consensus. We do
              not store your data on traditional centralized servers.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Third-Party Services
            </h2>
            <p className="text-sm leading-relaxed">
              This application does not integrate with any third-party
              analytics, advertising, or tracking services. The application is
              hosted on the Internet Computer and does not use cookies for
              tracking purposes.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Your Rights
            </h2>
            <p className="text-sm leading-relaxed">
              You have full control over the data you enter. You may update or
              delete your profile and transaction data at any time from within
              the application settings. As data is stored on the blockchain,
              some historical records may persist in canister state even after
              deletion depending on the application's data model.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Children's Privacy
            </h2>
            <p className="text-sm leading-relaxed">
              This application is intended for adults and is not designed for
              use by individuals under 18 years of age. We do not knowingly
              collect data from children.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Changes to This Policy
            </h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page with an updated "Last updated"
              date. Continued use of the application after changes constitutes
              acceptance of the revised policy.
            </p>

            <h2
              className="font-display font-semibold text-xl"
              style={{ color: "oklch(0.20 0.065 240)" }}
            >
              Contact
            </h2>
            <p className="text-sm leading-relaxed">
              For any questions regarding this Privacy Policy, please use the
              Contact Us page once it becomes available.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
