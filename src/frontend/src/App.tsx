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
  useIsCallerAdmin,
} from "./hooks/useQueries";
import AdminUsers from "./pages/AdminUsers";
import AdvancedFeatures from "./pages/AdvancedFeatures";
import BlogAdmin from "./pages/BlogAdmin";
import CapitalGains from "./pages/CapitalGains";
import Dashboard from "./pages/Dashboard";
import DistributorEntry from "./pages/DistributorEntry";
import Holdings from "./pages/Holdings";
import NavUpdate from "./pages/NavUpdate";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions";
import AboutUsPage from "./pages/public/AboutUsPage";
import ApplicationPage from "./pages/public/ApplicationPage";
import BlogPage from "./pages/public/BlogPage";
import ContactUsPage from "./pages/public/ContactUsPage";
import DisclaimerPage from "./pages/public/DisclaimerPage";
import FdLumpsumCalculatorPage from "./pages/public/FdLumpsumCalculatorPage";
import HomePage from "./pages/public/HomePage";
import PricingPage from "./pages/public/PricingPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import SipCalculatorPage from "./pages/public/SipCalculatorPage";
import StepUpSipCalculatorPage from "./pages/public/StepUpSipCalculatorPage";

const queryClient = new QueryClient();

const SEED_FUNDS = [
  // HDFC MF
  {
    id: "hdfc-equity-fund",
    name: "HDFC Equity Fund",
    amc: "HDFC MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 85000n,
  },
  {
    id: "hdfc-flexi-cap-fund",
    name: "HDFC Flexi Cap Fund",
    amc: "HDFC MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 162000n,
  },
  {
    id: "hdfc-mid-cap-opportunities-fund",
    name: "HDFC Mid-Cap Opportunities Fund",
    amc: "HDFC MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 135000n,
  },
  {
    id: "hdfc-small-cap-fund",
    name: "HDFC Small Cap Fund",
    amc: "HDFC MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 11800n,
  },
  {
    id: "hdfc-balanced-advantage-fund",
    name: "HDFC Balanced Advantage Fund",
    amc: "HDFC MF",
    category: FundCategory.hybrid,
    fundType: "Growth",
    initialNav: 42500n,
  },
  {
    id: "hdfc-short-duration-debt-fund",
    name: "HDFC Short Duration Debt Fund",
    amc: "HDFC MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 2800n,
  },
  {
    id: "hdfc-liquid-fund",
    name: "HDFC Liquid Fund",
    amc: "HDFC MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 450000n,
  },
  {
    id: "hdfc-tax-saver-elss",
    name: "HDFC Tax Saver (ELSS)",
    amc: "HDFC MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 94000n,
  },

  // SBI MF
  {
    id: "sbi-bluechip-fund",
    name: "SBI Bluechip Fund",
    amc: "SBI MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 68000n,
  },
  {
    id: "sbi-magnum-midcap-fund",
    name: "SBI Magnum Midcap Fund",
    amc: "SBI MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 21000n,
  },
  {
    id: "sbi-small-cap-fund",
    name: "SBI Small Cap Fund",
    amc: "SBI MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 14500n,
  },
  {
    id: "sbi-contra-fund",
    name: "SBI Contra Fund",
    amc: "SBI MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 32000n,
  },
  {
    id: "sbi-equity-hybrid-fund",
    name: "SBI Equity Hybrid Fund",
    amc: "SBI MF",
    category: FundCategory.hybrid,
    fundType: "Growth",
    initialNav: 23500n,
  },
  {
    id: "sbi-debt-fund",
    name: "SBI Debt Fund",
    amc: "SBI MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 3100n,
  },
  {
    id: "sbi-liquid-fund",
    name: "SBI Liquid Fund",
    amc: "SBI MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 380000n,
  },
  {
    id: "sbi-long-term-equity-fund-elss",
    name: "SBI Long Term Equity Fund (ELSS)",
    amc: "SBI MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 38000n,
  },

  // ICICI Prudential MF
  {
    id: "icici-prudential-bluechip-fund",
    name: "ICICI Prudential Bluechip Fund",
    amc: "ICICI Prudential MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 102000n,
  },
  {
    id: "icici-prudential-midcap-fund",
    name: "ICICI Prudential Midcap Fund",
    amc: "ICICI Prudential MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 25000n,
  },
  {
    id: "icici-prudential-balanced-advantage-fund",
    name: "ICICI Prudential Balanced Advantage Fund",
    amc: "ICICI Prudential MF",
    category: FundCategory.hybrid,
    fundType: "Growth",
    initialNav: 69000n,
  },
  {
    id: "icici-prudential-short-term-fund",
    name: "ICICI Prudential Short Term Fund",
    amc: "ICICI Prudential MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 5400n,
  },
  {
    id: "icici-prudential-liquid-fund",
    name: "ICICI Prudential Liquid Fund",
    amc: "ICICI Prudential MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 420000n,
  },
  {
    id: "icici-prudential-long-term-equity-fund-elss",
    name: "ICICI Prudential Long Term Equity Fund (ELSS)",
    amc: "ICICI Prudential MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 82000n,
  },
  {
    id: "icici-prudential-value-discovery-fund",
    name: "ICICI Prudential Value Discovery Fund",
    amc: "ICICI Prudential MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 48000n,
  },

  // Nippon India MF
  {
    id: "nippon-india-large-cap-fund",
    name: "Nippon India Large Cap Fund",
    amc: "Nippon India MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 79000n,
  },
  {
    id: "nippon-india-growth-fund",
    name: "Nippon India Growth Fund",
    amc: "Nippon India MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 390000n,
  },
  {
    id: "nippon-india-small-cap-fund",
    name: "Nippon India Small Cap Fund",
    amc: "Nippon India MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 17200n,
  },
  {
    id: "nippon-india-liquid-fund",
    name: "Nippon India Liquid Fund",
    amc: "Nippon India MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 610000n,
  },
  {
    id: "nippon-india-tax-saver-elss",
    name: "Nippon India Tax Saver (ELSS)",
    amc: "Nippon India MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 12500n,
  },
  {
    id: "nippon-india-hybrid-equity-fund",
    name: "Nippon India Hybrid Equity Fund",
    amc: "Nippon India MF",
    category: FundCategory.hybrid,
    fundType: "Growth",
    initialNav: 8700n,
  },

  // Axis MF
  {
    id: "axis-bluechip-fund",
    name: "Axis Bluechip Fund",
    amc: "Axis MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 56000n,
  },
  {
    id: "axis-midcap-fund",
    name: "Axis Midcap Fund",
    amc: "Axis MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 11200n,
  },
  {
    id: "axis-small-cap-fund",
    name: "Axis Small Cap Fund",
    amc: "Axis MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 8900n,
  },
  {
    id: "axis-long-term-equity-fund-elss",
    name: "Axis Long Term Equity Fund (ELSS)",
    amc: "Axis MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 7800n,
  },
  {
    id: "axis-focused-25-fund",
    name: "Axis Focused 25 Fund",
    amc: "Axis MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 4600n,
  },
  {
    id: "axis-liquid-fund",
    name: "Axis Liquid Fund",
    amc: "Axis MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 230000n,
  },

  // Mirae Asset MF
  {
    id: "mirae-asset-large-cap-fund",
    name: "Mirae Asset Large Cap Fund",
    amc: "Mirae Asset MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 110000n,
  },
  {
    id: "mirae-asset-emerging-bluechip-fund",
    name: "Mirae Asset Emerging Bluechip Fund",
    amc: "Mirae Asset MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 14500n,
  },
  {
    id: "mirae-asset-midcap-fund",
    name: "Mirae Asset Midcap Fund",
    amc: "Mirae Asset MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 3200n,
  },
  {
    id: "mirae-asset-tax-saver-fund-elss",
    name: "Mirae Asset Tax Saver Fund (ELSS)",
    amc: "Mirae Asset MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 4100n,
  },
  {
    id: "mirae-asset-hybrid-equity-fund",
    name: "Mirae Asset Hybrid Equity Fund",
    amc: "Mirae Asset MF",
    category: FundCategory.hybrid,
    fundType: "Growth",
    initialNav: 2800n,
  },
  {
    id: "mirae-asset-liquid-fund",
    name: "Mirae Asset Liquid Fund",
    amc: "Mirae Asset MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 150000n,
  },

  // Kotak MF
  {
    id: "kotak-flexicap-fund",
    name: "Kotak Flexicap Fund",
    amc: "Kotak MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 78000n,
  },
  {
    id: "kotak-emerging-equity-fund",
    name: "Kotak Emerging Equity Fund",
    amc: "Kotak MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 10500n,
  },
  {
    id: "kotak-small-cap-fund",
    name: "Kotak Small Cap Fund",
    amc: "Kotak MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 28000n,
  },
  {
    id: "kotak-tax-saver-fund-elss",
    name: "Kotak Tax Saver Fund (ELSS)",
    amc: "Kotak MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 9800n,
  },
  {
    id: "kotak-liquid-fund",
    name: "Kotak Liquid Fund",
    amc: "Kotak MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 490000n,
  },
  {
    id: "kotak-balanced-advantage-fund",
    name: "Kotak Balanced Advantage Fund",
    amc: "Kotak MF",
    category: FundCategory.hybrid,
    fundType: "Growth",
    initialNav: 19000n,
  },

  // DSP MF
  {
    id: "dsp-flexi-cap-fund",
    name: "DSP Flexi Cap Fund",
    amc: "DSP MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 6500n,
  },
  {
    id: "dsp-midcap-fund",
    name: "DSP Midcap Fund",
    amc: "DSP MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 12500n,
  },
  {
    id: "dsp-small-cap-fund",
    name: "DSP Small Cap Fund",
    amc: "DSP MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 17800n,
  },
  {
    id: "dsp-tax-saver-fund-elss",
    name: "DSP Tax Saver Fund (ELSS)",
    amc: "DSP MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 11200n,
  },
  {
    id: "dsp-liquid-fund",
    name: "DSP Liquid Fund",
    amc: "DSP MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 340000n,
  },

  // PPFAS MF (Parag Parikh)
  {
    id: "parag-parikh-flexi-cap-fund",
    name: "Parag Parikh Flexi Cap Fund",
    amc: "PPFAS MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 8600n,
  },
  {
    id: "parag-parikh-conservative-hybrid-fund",
    name: "Parag Parikh Conservative Hybrid Fund",
    amc: "PPFAS MF",
    category: FundCategory.hybrid,
    fundType: "Growth",
    initialNav: 2100n,
  },
  {
    id: "parag-parikh-liquid-fund",
    name: "Parag Parikh Liquid Fund",
    amc: "PPFAS MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 120000n,
  },
  {
    id: "parag-parikh-tax-saver-fund-elss",
    name: "Parag Parikh Tax Saver Fund (ELSS)",
    amc: "PPFAS MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 2200n,
  },

  // UTI MF
  {
    id: "uti-flexi-cap-fund",
    name: "UTI Flexi Cap Fund",
    amc: "UTI MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 32500n,
  },
  {
    id: "uti-nifty-50-index-fund",
    name: "UTI Nifty 50 Index Fund",
    amc: "UTI MF",
    category: FundCategory.equity,
    fundType: "Direct Growth",
    initialNav: 14800n,
  },
  {
    id: "uti-midcap-fund",
    name: "UTI Midcap Fund",
    amc: "UTI MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 28000n,
  },
  {
    id: "uti-tax-saver-fund-elss",
    name: "UTI Tax Saver Fund (ELSS)",
    amc: "UTI MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 18500n,
  },
  {
    id: "uti-liquid-fund",
    name: "UTI Liquid Fund",
    amc: "UTI MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 410000n,
  },

  // Motilal Oswal MF
  {
    id: "motilal-oswal-flexi-cap-fund",
    name: "Motilal Oswal Flexi Cap Fund",
    amc: "Motilal Oswal MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 5200n,
  },
  {
    id: "motilal-oswal-midcap-fund",
    name: "Motilal Oswal Midcap Fund",
    amc: "Motilal Oswal MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 10800n,
  },
  {
    id: "motilal-oswal-nasdaq-100-fof",
    name: "Motilal Oswal Nasdaq 100 FOF",
    amc: "Motilal Oswal MF",
    category: FundCategory.equity,
    fundType: "Direct Growth",
    initialNav: 2700n,
  },
  {
    id: "motilal-oswal-sp500-index-fund",
    name: "Motilal Oswal S&P 500 Index Fund",
    amc: "Motilal Oswal MF",
    category: FundCategory.equity,
    fundType: "Direct Growth",
    initialNav: 2200n,
  },
  {
    id: "motilal-oswal-liquid-fund",
    name: "Motilal Oswal Liquid Fund",
    amc: "Motilal Oswal MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 100000n,
  },

  // Tata MF
  {
    id: "tata-large-cap-fund",
    name: "Tata Large Cap Fund",
    amc: "Tata MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 44000n,
  },
  {
    id: "tata-midcap-growth-fund",
    name: "Tata Midcap Growth Fund",
    amc: "Tata MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 38000n,
  },
  {
    id: "tata-small-cap-fund",
    name: "Tata Small Cap Fund",
    amc: "Tata MF",
    category: FundCategory.equity,
    fundType: "Growth",
    initialNav: 4800n,
  },
  {
    id: "tata-equity-tax-saver-fund-elss",
    name: "Tata Equity Tax Saver Fund (ELSS)",
    amc: "Tata MF",
    category: FundCategory.elss,
    fundType: "Growth",
    initialNav: 19000n,
  },
  {
    id: "tata-liquid-fund",
    name: "Tata Liquid Fund",
    amc: "Tata MF",
    category: FundCategory.debt,
    fundType: "Growth",
    initialNav: 520000n,
  },
];

function SeedFunds() {
  const { data: funds, isFetched } = useGetAllFunds();
  const { data: isAdmin } = useIsCallerAdmin();
  const addFund = useAddFund();
  const seeded = useRef(false);

  useEffect(() => {
    if (!isFetched || !funds || seeded.current) return;
    if (isAdmin !== true) return;

    const existingIds = new Set(funds.map((f) => f.id));
    const missing = SEED_FUNDS.filter((f) => !existingIds.has(f.id));
    if (missing.length === 0) return;

    seeded.current = true;
    const mutateAsync = addFund.mutateAsync;
    (async () => {
      for (const fund of missing) {
        try {
          await mutateAsync(fund);
        } catch {
          // ignore
        }
      }
    })();
  }, [isFetched, funds, isAdmin, addFund.mutateAsync]);

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
    "admin-users": <AdminUsers />,
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
      case "pricing":
        return <PricingPage />;
      case "about":
        return <AboutUsPage />;
      case "contact":
        return <ContactUsPage />;
      case "disclaimer":
        return <DisclaimerPage />;
      case "privacy":
        return <PrivacyPolicyPage />;
      case "sip-calculator":
        return <SipCalculatorPage />;
      case "stepup-sip-calculator":
        return <StepUpSipCalculatorPage />;
      case "fd-lumpsum-calculator":
        return <FdLumpsumCalculatorPage />;
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
