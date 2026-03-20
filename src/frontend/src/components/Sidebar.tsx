import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftRight,
  Briefcase,
  FileBarChart,
  Globe,
  LayoutDashboard,
  LogOut,
  PenSquare,
  RefreshCw,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";

type Page =
  | "dashboard"
  | "holdings"
  | "transactions"
  | "nav-update"
  | "capital-gains"
  | "settings"
  | "blog-admin";

const navItems: {
  id: Page;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "holdings", label: "Holdings", icon: Briefcase },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "nav-update", label: "NAV Update", icon: RefreshCw },
  { id: "capital-gains", label: "Capital Gains", icon: FileBarChart },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "blog-admin", label: "Blog Admin", icon: PenSquare, adminOnly: true },
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
  const { clear, identity } = useInternetIdentity();
  const qc = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

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

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly) return !!isAdmin;
    return true;
  });

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-30 sidebar-gradient"
      style={{ borderRight: "1px solid oklch(0.25 0.06 240)" }}
    >
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
          <span className="text-xs" style={{ color: "oklch(0.60 0.02 240)" }}>
            Portfolio Manager
          </span>
        </div>
      </div>

      <div className="px-3 mb-2">
        <div style={{ height: "1px", background: "oklch(0.25 0.06 240)" }} />
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {visibleItems.map(({ id, label, icon: Icon, adminOnly }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              type="button"
              data-ocid={`nav.${id}.link`}
              onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: isActive ? "oklch(0.28 0.075 240)" : "transparent",
                color: isActive
                  ? "oklch(0.97 0.005 240)"
                  : adminOnly
                    ? "oklch(0.65 0.10 185)"
                    : "oklch(0.70 0.02 240)",
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {adminOnly && (
                <span
                  className="ml-auto text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: "oklch(0.52 0.13 185 / 0.18)",
                    color: "oklch(0.60 0.12 185)",
                  }}
                >
                  Admin
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <div
          style={{
            height: "1px",
            background: "oklch(0.25 0.06 240)",
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
              color: "oklch(0.55 0.10 185)",
              background: "oklch(0.52 0.13 185 / 0.08)",
            }}
          >
            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
            Back to Website
          </button>
        )}
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
            style={{ background: "oklch(0.52 0.13 185)" }}
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
            <p
              className="text-xs truncate"
              style={{ color: "oklch(0.60 0.02 240)" }}
            >
              {identity?.getPrincipal().toString().slice(0, 12)}...
            </p>
          </div>
          <button
            type="button"
            data-ocid="nav.logout.button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "oklch(0.60 0.02 240)" }}
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export type { Page };
