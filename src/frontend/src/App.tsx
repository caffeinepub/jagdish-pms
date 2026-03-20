import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import LoginPage from "./components/LoginPage";
import ProfileSetup from "./components/ProfileSetup";
import PublicLayout, { type PublicPage } from "./components/PublicLayout";
import Sidebar, { type Page } from "./components/Sidebar";
import {
  VERSIONS,
  VersionProvider,
  useVersion,
} from "./context/VersionContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  FundCategory,
  useAddFund,
  useGetAllFunds,
  useGetCallerUserProfile,
} from "./hooks/useQueries";
import AdvancedFeatures from "./pages/AdvancedFeatures";
import BlogAdmin from "./pages/BlogAdmin";
import CapitalGains from "./pages/CapitalGains";
import Dashboard from "./pages/Dashboard";
import DistributorEntry from "./pages/DistributorEntry";
import Holdings from "./pages/Holdings";
import NavUpdate from "./pages/NavUpdate";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions";
import ApplicationPage from "./pages/public/ApplicationPage";
import BlogPage from "./pages/public/BlogPage";
import ComingSoonPage from "./pages/public/ComingSoonPage";
import DisclaimerPage from "./pages/public/DisclaimerPage";
import HomePage from "./pages/public/HomePage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";

const queryClient = new QueryClient();

const SEED_FUNDS = [
  {
    id: "hdfc-equity",
    name: "HDFC Equity Fund",
    category: FundCategory.equity,
    initialNav: 62500n,
  },
  {
    id: "sbi-bluechip",
    name: "SBI Bluechip Fund",
    category: FundCategory.equity,
    initialNav: 48200n,
  },
  {
    id: "icici-debt",
    name: "ICICI Prudential Debt Fund",
    category: FundCategory.debt,
    initialNav: 24300n,
  },
  {
    id: "axis-elss",
    name: "Axis Long Term Equity (ELSS)",
    category: FundCategory.elss,
    initialNav: 35800n,
  },
];

function SeedFunds() {
  const { data: funds, isFetched } = useGetAllFunds();
  const addFund = useAddFund();
  const seeded = useRef(false);

  useEffect(() => {
    if (!isFetched || !funds || seeded.current) return;
    if (funds.length === 0) {
      seeded.current = true;
      const mutateAsync = addFund.mutateAsync;
      (async () => {
        for (const fund of SEED_FUNDS) {
          try {
            await mutateAsync(fund);
          } catch {
            // ignore
          }
        }
      })();
    }
  }, [isFetched, funds, addFund.mutateAsync]);

  return null;
}

function VersionSwitcher() {
  const { selectedVersion, setSelectedVersion, currentVersion } = useVersion();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        data-ocid="topbar.version.toggle"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        style={{
          background: "oklch(0.45 0.12 240 / 0.10)",
          color: "oklch(0.32 0.06 240)",
          border: "1px solid oklch(0.45 0.12 240 / 0.20)",
        }}
      >
        <span
          className="px-1.5 py-0.5 rounded text-xs font-bold"
          style={{ background: "oklch(0.45 0.12 240)", color: "white" }}
        >
          {currentVersion.badge}
        </span>
        {currentVersion.label}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              role="button"
              tabIndex={-1}
              aria-label="Close version menu"
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute left-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden shadow-lg"
              style={{
                background: "oklch(0.985 0.006 240)",
                border: "1px solid oklch(0.88 0.015 220)",
                minWidth: "180px",
              }}
              data-ocid="topbar.version.dropdown_menu"
            >
              <div
                className="px-3 py-2 border-b"
                style={{
                  borderColor: "oklch(0.91 0.01 220)",
                  color: "oklch(0.55 0.018 240)",
                }}
              >
                <p className="text-xs font-medium">Select Version</p>
              </div>
              {VERSIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  data-ocid={`topbar.version.${v.id}.button`}
                  onClick={() => {
                    setSelectedVersion(v.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                  style={{
                    background:
                      selectedVersion === v.id
                        ? "oklch(0.45 0.12 240 / 0.08)"
                        : "transparent",
                  }}
                >
                  <span
                    className="px-1.5 py-0.5 rounded text-xs font-bold flex-shrink-0"
                    style={{
                      background:
                        selectedVersion === v.id
                          ? "oklch(0.45 0.12 240)"
                          : "oklch(0.88 0.015 220)",
                      color:
                        selectedVersion === v.id
                          ? "white"
                          : "oklch(0.50 0.02 240)",
                    }}
                  >
                    {v.badge}
                  </span>
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "oklch(0.25 0.04 240)" }}
                    >
                      {v.label}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.018 240)" }}
                    >
                      {v.description}
                    </p>
                  </div>
                  {selectedVersion === v.id && (
                    <span
                      className="ml-auto text-xs"
                      style={{ color: "oklch(0.45 0.12 240)" }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MainLayoutProps {
  onBackToWebsite: () => void;
}

function MainLayout({ onBackToWebsite }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { selectedVersion } = useVersion();

  // If switched away from version-exclusive pages, go to dashboard
  useEffect(() => {
    if (selectedVersion === "classic" && currentPage === "advanced-features") {
      setCurrentPage("dashboard");
    }
    if (selectedVersion !== "elite" && currentPage === "distributor-entry") {
      setCurrentPage("dashboard");
    }
  }, [selectedVersion, currentPage]);

  const pageComponents: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    holdings: <Holdings />,
    transactions: <Transactions />,
    "nav-update": <NavUpdate />,
    "capital-gains": <CapitalGains />,
    settings: <Settings />,
    "blog-admin": <BlogAdmin />,
    "advanced-features": <AdvancedFeatures />,
    "distributor-entry": <DistributorEntry />,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onBackToWebsite={onBackToWebsite}
      />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between gap-2 px-6 py-3"
          style={{
            background: "oklch(0.965 0.012 240)",
            borderBottom: "1px solid oklch(0.88 0.01 220)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="topbar.back_to_website.button"
              onClick={onBackToWebsite}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-foreground"
              style={{ color: "oklch(0.52 0.018 240)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Website
            </button>
            <VersionSwitcher />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
              title="Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {pageComponents[currentPage]}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex gap-4">
              <span className="cursor-default">Jagdish PMS</span>
            </div>
            <span>
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface AppContentProps {
  onBackToWebsite: () => void;
}

function AppContent({ onBackToWebsite }: AppContentProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  useEffect(() => {
    if (!profileLoading) {
      setLoadingTimedOut(false);
      return;
    }
    const timer = setTimeout(() => {
      setLoadingTimedOut(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, [profileLoading]);

  if (!isAuthenticated) return <LoginPage onBackToWebsite={onBackToWebsite} />;

  if (profileLoading && !isFetched) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.965 0.012 240)" }}
        data-ocid="app.loading_state"
      >
        <AnimatePresence mode="wait">
          {loadingTimedOut ? (
            <motion.div
              key="timeout"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 text-center px-6"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.93 0.02 240)" }}
              >
                <RefreshCw
                  className="w-5 h-5"
                  style={{ color: "oklch(0.45 0.12 240)" }}
                />
              </div>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: "oklch(0.3 0.02 240)" }}
                >
                  Taking longer than expected
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.55 0.015 240)" }}
                >
                  The server may be slow to respond. Please try refreshing.
                </p>
              </div>
              <button
                type="button"
                data-ocid="app.loading_state.button"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: "oklch(0.45 0.12 240)",
                  color: "white",
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Page
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                className="w-8 h-8 rounded-full border-2"
                style={{
                  borderColor: "oklch(0.45 0.12 240)",
                  borderTopColor: "transparent",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <p className="text-sm" style={{ color: "oklch(0.52 0.018 240)" }}>
                Loading your portfolio...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (isAuthenticated && isFetched && profile === null) return <ProfileSetup />;

  return (
    <>
      <SeedFunds />
      <MainLayout onBackToWebsite={onBackToWebsite} />
    </>
  );
}

function PublicWebsite({ onLaunchApp }: { onLaunchApp: () => void }) {
  const [currentPage, setCurrentPage] = useState<PublicPage>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onLaunchApp={onLaunchApp} />;
      case "application":
        return <ApplicationPage onLaunchApp={onLaunchApp} />;
      case "blog":
        return <BlogPage />;
      case "about":
        return (
          <ComingSoonPage
            title="About Us"
            description="Learn about the team behind Jagdish PMS and our mission to simplify mutual fund investing."
          />
        );
      case "contact":
        return (
          <ComingSoonPage
            title="Contact Us"
            description="Have questions or feedback? We'd love to hear from you. Contact details coming soon."
          />
        );
      case "disclaimer":
        return <DisclaimerPage />;
      case "privacy":
        return <PrivacyPolicyPage />;
    }
  };

  return (
    <PublicLayout
      currentPage={currentPage}
      onNavigate={(page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      onLaunchApp={onLaunchApp}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </PublicLayout>
  );
}

export default function App() {
  const [appMode, setAppMode] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <VersionProvider>
        <AnimatePresence mode="wait">
          {appMode ? (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AppContent onBackToWebsite={() => setAppMode(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="website"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PublicWebsite onLaunchApp={() => setAppMode(true)} />
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </VersionProvider>
    </QueryClientProvider>
  );
}
