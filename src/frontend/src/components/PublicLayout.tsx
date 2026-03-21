import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, TrendingUp, Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type PublicPage =
  | "home"
  | "application"
  | "blog"
  | "pricing"
  | "about"
  | "contact"
  | "disclaimer"
  | "privacy"
  | "sip-calculator"
  | "stepup-sip-calculator"
  | "fd-lumpsum-calculator";

const TOOL_PAGES: PublicPage[] = [
  "sip-calculator",
  "stepup-sip-calculator",
  "fd-lumpsum-calculator",
];

const TOOL_LABELS: Record<string, string> = {
  "sip-calculator": "SIP Calculator",
  "stepup-sip-calculator": "Step Up SIP Calculator",
  "fd-lumpsum-calculator": "FD / Lumpsum Calculator",
};

const NAV_LINKS: { id: PublicPage; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "application", label: "Application" },
  { id: "blog", label: "Blog" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About Us" },
  { id: "contact", label: "Contact Us" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "privacy", label: "Privacy Policy" },
];

interface PublicLayoutProps {
  currentPage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onLaunchApp: () => void;
  children: React.ReactNode;
}

export default function PublicLayout({
  currentPage,
  onNavigate,
  onLaunchApp,
  children,
}: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const isToolsActive = TOOL_PAGES.includes(currentPage);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Navbar */}
      <header className="website-nav sticky top-0 z-50 shadow-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              type="button"
              data-ocid="nav.home.link"
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2.5 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "oklch(0.52 0.13 185)" }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-display font-bold text-lg leading-tight"
                style={{ color: "oklch(0.97 0.005 220)" }}
              >
                Jagdish PMS
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Home + Application */}
              {NAV_LINKS.slice(0, 2).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  data-ocid={`nav.${id}.link`}
                  onClick={() => onNavigate(id)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    color:
                      currentPage === id
                        ? "oklch(0.52 0.13 185)"
                        : "oklch(0.80 0.015 220)",
                    background:
                      currentPage === id
                        ? "oklch(0.52 0.13 185 / 0.12)"
                        : "transparent",
                  }}
                >
                  {label}
                </button>
              ))}

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  data-ocid="nav.tools.toggle"
                  onClick={() => setToolsOpen((o) => !o)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    color: isToolsActive
                      ? "oklch(0.52 0.13 185)"
                      : "oklch(0.80 0.015 220)",
                    background: isToolsActive
                      ? "oklch(0.52 0.13 185 / 0.12)"
                      : "transparent",
                  }}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Tools
                  <ChevronDown
                    className="w-3 h-3 transition-transform"
                    style={{
                      transform: toolsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {toolsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setToolsOpen(false)}
                        onKeyDown={(e) =>
                          e.key === "Escape" && setToolsOpen(false)
                        }
                        role="button"
                        tabIndex={-1}
                        aria-label="Close tools menu"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden shadow-lg"
                        style={{
                          background: "oklch(0.18 0.07 240)",
                          border: "1px solid oklch(0.28 0.06 240)",
                          minWidth: "210px",
                        }}
                        data-ocid="nav.tools.dropdown_menu"
                      >
                        <div
                          className="px-3 py-2 border-b flex items-center gap-1.5"
                          style={{
                            borderColor: "oklch(0.28 0.06 240)",
                            color: "oklch(0.52 0.13 185)",
                          }}
                        >
                          <Wrench className="w-3 h-3" />
                          <p className="text-xs font-semibold uppercase tracking-wider">
                            Tools
                          </p>
                        </div>
                        {TOOL_PAGES.map((page) => (
                          <button
                            key={page}
                            type="button"
                            data-ocid={`nav.tools.${page}.link`}
                            onClick={() => {
                              onNavigate(page);
                              setToolsOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors"
                            style={{
                              color:
                                currentPage === page
                                  ? "oklch(0.52 0.13 185)"
                                  : "oklch(0.80 0.015 220)",
                              background:
                                currentPage === page
                                  ? "oklch(0.52 0.13 185 / 0.12)"
                                  : "transparent",
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: "oklch(0.52 0.13 185)" }}
                            />
                            {TOOL_LABELS[page]}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Remaining nav links */}
              {NAV_LINKS.slice(2).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  data-ocid={`nav.${id}.link`}
                  onClick={() => onNavigate(id)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    color:
                      currentPage === id
                        ? "oklch(0.52 0.13 185)"
                        : "oklch(0.80 0.015 220)",
                    background:
                      currentPage === id
                        ? "oklch(0.52 0.13 185 / 0.12)"
                        : "transparent",
                  }}
                >
                  {label}
                </button>
              ))}
              <Button
                data-ocid="nav.launch_app.button"
                onClick={onLaunchApp}
                size="sm"
                className="ml-3 font-semibold"
                style={{ background: "oklch(0.52 0.13 185)", color: "white" }}
              >
                Launch App
              </Button>
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              data-ocid="nav.mobile_menu.toggle"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 rounded-md"
              style={{ color: "oklch(0.80 0.015 220)" }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
              style={{ background: "oklch(0.18 0.07 240)" }}
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.slice(0, 2).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    data-ocid={`nav.mobile.${id}.link`}
                    onClick={() => {
                      onNavigate(id);
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
                    style={{
                      color:
                        currentPage === id
                          ? "oklch(0.52 0.13 185)"
                          : "oklch(0.80 0.015 220)",
                      background:
                        currentPage === id
                          ? "oklch(0.52 0.13 185 / 0.15)"
                          : "transparent",
                    }}
                  >
                    {label}
                  </button>
                ))}

                {/* Mobile Tools Accordion */}
                <div>
                  <button
                    type="button"
                    data-ocid="nav.mobile.tools.toggle"
                    onClick={() => setMobileToolsOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
                    style={{
                      color: isToolsActive
                        ? "oklch(0.52 0.13 185)"
                        : "oklch(0.80 0.015 220)",
                      background: isToolsActive
                        ? "oklch(0.52 0.13 185 / 0.15)"
                        : "transparent",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5" />
                      Tools
                    </span>
                    <ChevronDown
                      className="w-3.5 h-3.5 transition-transform"
                      style={{
                        transform: mobileToolsOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileToolsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden pl-4"
                      >
                        {TOOL_PAGES.map((page) => (
                          <button
                            key={page}
                            type="button"
                            data-ocid={`nav.mobile.tools.${page}.link`}
                            onClick={() => {
                              onNavigate(page);
                              setMobileOpen(false);
                              setMobileToolsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm transition-colors"
                            style={{
                              color:
                                currentPage === page
                                  ? "oklch(0.52 0.13 185)"
                                  : "oklch(0.70 0.015 220)",
                              background:
                                currentPage === page
                                  ? "oklch(0.52 0.13 185 / 0.15)"
                                  : "transparent",
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: "oklch(0.52 0.13 185)" }}
                            />
                            {TOOL_LABELS[page]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {NAV_LINKS.slice(2).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    data-ocid={`nav.mobile.${id}.link`}
                    onClick={() => {
                      onNavigate(id);
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
                    style={{
                      color:
                        currentPage === id
                          ? "oklch(0.52 0.13 185)"
                          : "oklch(0.80 0.015 220)",
                      background:
                        currentPage === id
                          ? "oklch(0.52 0.13 185 / 0.15)"
                          : "transparent",
                    }}
                  >
                    {label}
                  </button>
                ))}
                <div className="pt-2 pb-1">
                  <Button
                    data-ocid="nav.mobile.launch_app.button"
                    onClick={() => {
                      onLaunchApp();
                      setMobileOpen(false);
                    }}
                    className="w-full font-semibold"
                    style={{
                      background: "oklch(0.52 0.13 185)",
                      color: "white",
                    }}
                  >
                    Launch App
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer style={{ background: "oklch(0.15 0.055 240)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.52 0.13 185)" }}
                >
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.97 0.005 220)" }}
                >
                  Jagdish PMS
                </span>
              </div>
              <p className="text-sm" style={{ color: "oklch(0.62 0.018 220)" }}>
                Jagdish Portfolio Management Software — a professional tool for
                tracking mutual fund investments in India.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4
                className="text-sm font-semibold mb-3 uppercase tracking-wider"
                style={{ color: "oklch(0.52 0.13 185)" }}
              >
                Quick Links
              </h4>
              <div className="space-y-2">
                {(
                  [
                    "home",
                    "application",
                    "blog",
                    "pricing",
                    "about",
                  ] as PublicPage[]
                ).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onNavigate(id)}
                    className="block text-sm capitalize transition-colors hover:text-white"
                    style={{ color: "oklch(0.62 0.018 220)" }}
                  >
                    {id === "about"
                      ? "About Us"
                      : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {/* Legal */}
            <div>
              <h4
                className="text-sm font-semibold mb-3 uppercase tracking-wider"
                style={{ color: "oklch(0.52 0.13 185)" }}
              >
                Legal
              </h4>
              <div className="space-y-2">
                {(["disclaimer", "privacy", "contact"] as PublicPage[]).map(
                  (id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onNavigate(id)}
                      className="block text-sm capitalize transition-colors hover:text-white"
                      style={{ color: "oklch(0.62 0.018 220)" }}
                    >
                      {id === "privacy"
                        ? "Privacy Policy"
                        : id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
          <div
            className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: "oklch(0.25 0.06 240)" }}
          >
            <p className="text-xs" style={{ color: "oklch(0.50 0.015 220)" }}>
              © {new Date().getFullYear()} Jagdish Portfolio Management Software
              (PMS). All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "oklch(0.50 0.015 220)" }}>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export type { PublicPage };
