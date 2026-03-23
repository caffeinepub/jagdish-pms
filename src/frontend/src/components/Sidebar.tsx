import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftRight,
  Briefcase,
  Building2,
  FileBarChart,
  Globe,
  LayoutDashboard,
  LogOut,
  PenSquare,
  RefreshCw,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useVersion } from "../context/VersionContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";
import { useUserEmail } from "../hooks/useUserEmail";

type Page =
  | "dashboard"
  | "holdings"
  | "transactions"
  | "nav-update"
  | "capital-gains"
  | "settings"
  | "blog-admin"
  | "admin-users"
  | "advanced-features"
  | "distributor-entry";

const baseNavItems: {
  id: Page;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  advancedOnly?: boolean;
  eliteOnly?: boolean;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "holdings", label: "Holdings", icon: Briefcase },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "nav-update", label: "NAV Update", icon: RefreshCw },
  { id: "capital-gains", label: "Capital Gains", icon: FileBarChart },
  {
    id: "advanced-features",
    label: "Advanced Features",
    icon: Sparkles,
    advancedOnly: true,
  },
  {
    id: "distributor-entry",
    label: "Distributor Entry",
    icon: Building2,
    eliteOnly: true,
  },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "blog-admin", label: "Blog Admin", icon: PenSquare, adminOnly: true },
  { id: "admin-users", label: "Users", icon: Users, adminOnly: true },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onBackToWebsite?: () => void;
}

export default function Sidebar({
  currentPage,
  onNavigate,
  onBackToWebsite,
}: SidebarProps) {
  const { clear } = useInternetIdentity();
  const qc = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { selectedVersion, currentVersion } = useVersion();
  const { email } = useUserEmail();

  const handleLogout = async () => {
    await clear();
    qc.clear();
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const visibleItems = baseNavItems.filter((item) => {
    if (item.adminOnly) return !!isAdmin;
    if (item.advancedOnly) return selectedVersion === "advanced";
    if (item.eliteOnly) return selectedVersion === "elite";
    return true;
  });

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-30 sidebar-gradient"
      style={{ borderRight: "1px solid oklch(0.24 0.055 240)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.52 0.13 185)" }}
        >
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div>
          <span
            className="text-sm font-bold block leading-tight"
            style={{ color: "oklch(0.97 0.005 240)" }}
          >
            Jagdish PMS
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs" style={{ color: "oklch(0.58 0.02 240)" }}>
              Portfolio Manager
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium"
              style={{
                background: "oklch(0.52 0.13 185 / 0.22)",
                color: "oklch(0.72 0.12 185)",
              }}
            >
              {currentVersion.label}
            </span>
          </div>
        </div>
      </div>

      <div className="px-3 mb-1">
        <div style={{ height: "1px", background: "oklch(0.24 0.055 240)" }} />
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map(
          ({ id, label, icon: Icon, adminOnly, advancedOnly, eliteOnly }) => {
            const isActive = currentPage === id;
            return (
              <button
                key={id}
                type="button"
                data-ocid={`nav.${id}.link`}
                onClick={() => onNavigate(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: isActive
                    ? "oklch(0.52 0.13 185 / 0.22)"
                    : "transparent",
                  color: isActive
                    ? "oklch(0.88 0.06 185)"
                    : eliteOnly
                      ? "oklch(0.62 0.13 160)"
                      : advancedOnly
                        ? "oklch(0.68 0.12 185)"
                        : adminOnly
                          ? "oklch(0.65 0.10 185)"
                          : "oklch(0.72 0.025 240)",
                  boxShadow: isActive
                    ? "inset 3px 0 0 oklch(0.52 0.13 185)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(0.25 0.055 240)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }
                }}
              >
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{
                    color: isActive ? "oklch(0.72 0.14 185)" : undefined,
                  }}
                />
                {label}
                {advancedOnly && (
                  <span
                    className="ml-auto text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: "oklch(0.52 0.13 185 / 0.18)",
                      color: "oklch(0.65 0.12 185)",
                    }}
                  >
                    v2
                  </span>
                )}
                {eliteOnly && (
                  <span
                    className="ml-auto text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: "oklch(0.52 0.13 160 / 0.18)",
                      color: "oklch(0.55 0.12 160)",
                    }}
                  >
                    v3
                  </span>
                )}
                {adminOnly && (
                  <span
                    className="ml-auto text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: "oklch(0.52 0.13 185 / 0.18)",
                      color: "oklch(0.65 0.12 185)",
                    }}
                  >
                    Admin
                  </span>
                )}
              </button>
            );
          },
        )}
      </nav>

      <div className="px-3 pb-5">
        <div
          style={{
            height: "1px",
            background: "oklch(0.24 0.055 240)",
            marginBottom: "12px",
          }}
        />
        {onBackToWebsite && (
          <button
            type="button"
            data-ocid="nav.back_to_website.link"
            onClick={onBackToWebsite}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors mb-2"
            style={{
              color: "oklch(0.58 0.10 185)",
              background: "oklch(0.52 0.13 185 / 0.08)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.52 0.13 185 / 0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.52 0.13 185 / 0.08)";
            }}
          >
            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
            Back to Website
          </button>
        )}
        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white ring-2"
            style={{
              background: "oklch(0.52 0.13 185)",
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "oklch(0.95 0.005 240)" }}
            >
              {profile?.name ?? "User"}
            </p>
            {email ? (
              <p
                className="text-xs truncate"
                style={{ color: "oklch(0.55 0.02 240)" }}
              >
                {email}
              </p>
            ) : (
              <button
                type="button"
                data-ocid="nav.add_email.button"
                onClick={() => onNavigate("settings")}
                className="text-xs truncate text-left w-full"
                style={{ color: "oklch(0.52 0.13 185)", fontStyle: "italic" }}
              >
                Add email in Settings
              </button>
            )}
          </div>
          <button
            type="button"
            data-ocid="nav.logout.button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "oklch(0.55 0.02 240)" }}
            title="Logout"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.80 0.03 240)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.55 0.02 240)";
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export type { Page };
