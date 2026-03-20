import { Clock } from "lucide-react";
import { motion } from "motion/react";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export default function ComingSoonPage({
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "oklch(0.28 0.085 240 / 0.08)" }}
        >
          <Clock
            className="w-8 h-8"
            style={{ color: "oklch(0.28 0.085 240)" }}
          />
        </div>
        <h1
          className="font-display font-bold text-3xl sm:text-4xl mb-4"
          style={{ color: "oklch(0.18 0.065 240)" }}
        >
          {title}
        </h1>
        <div className="teal-badge inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
          Coming Soon
        </div>
        <p
          className="text-base max-w-md mx-auto leading-relaxed"
          style={{ color: "oklch(0.48 0.018 240)" }}
        >
          {description ??
            "We're working on this section. Please check back soon."}
        </p>
      </motion.div>
    </section>
  );
}
