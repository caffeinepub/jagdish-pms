import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ArrowLeft, Bell, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import LoginPage from "./components/LoginPage";
import ProfileSetup from "./components/ProfileSetup";
import PublicLayout, { type PublicPage } from "./components/PublicLayout";
import Sidebar, { type Page } from "./components/Sidebar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  FundCategory,
  useAddFund,
  useGetAllFunds,
  useGetCallerUserProfile,
} from "./hooks/useQueries";
import BlogAdmin from "./pages/BlogAdmin";
import CapitalGains from "./pages/CapitalGains";
import Dashboard from "./pages/Dashboard";
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

interface MainLayoutProps {
  onBackToWebsite: () => void;
}

function MainLayout({ onBackToWebsite }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const pageComponents: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    holdings: <Holdings />,
    transactions: <Transactions />,
    "nav-update": <NavUpdate />,
    "capital-gains": <CapitalGains />,
    settings: <Settings />,
    "blog-admin": <BlogAdmin />,
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

  if (!isAuthenticated) return <LoginPage onBackToWebsite={onBackToWebsite} />;
  if (profileLoading && !isFetched) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.965 0.012 240)" }}
      >
        <div className="text-muted-foreground">Loading...</div>
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
    </QueryClientProvider>
  );
}
