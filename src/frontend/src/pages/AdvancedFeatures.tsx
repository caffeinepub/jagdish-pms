import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Calculator, GitCompare, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Calculator,
    title: "SIP Calculator",
    description:
      "Calculate SIP returns and plan your investments with detailed projections.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description:
      "Deep analytics, charts, and performance insights for your entire portfolio.",
  },
  {
    icon: GitCompare,
    title: "Fund Comparison",
    description:
      "Compare mutual funds side-by-side across returns, risk, and expense ratios.",
  },
  {
    icon: ShieldCheck,
    title: "Tax Optimizer",
    description:
      "Optimize your portfolio for tax efficiency with smart LTCG/STCG strategies.",
  },
];

export default function AdvancedFeatures() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-2xl font-bold"
            style={{ color: "oklch(0.2 0.04 240)" }}
          >
            Advanced Features
          </h1>
          <Badge
            className="text-xs px-2 py-0.5"
            style={{
              background: "oklch(0.52 0.13 185 / 0.15)",
              color: "oklch(0.35 0.10 185)",
              border: "none",
            }}
          >
            v2
          </Badge>
        </div>
        <p className="text-sm" style={{ color: "oklch(0.52 0.018 240)" }}>
          Available in Advanced version — powerful tools for the serious
          investor.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map(({ icon: Icon, title, description }, idx) => (
          <Card
            key={title}
            data-ocid={`advanced_features.item.${idx + 1}`}
            className="relative overflow-hidden"
            style={{
              border: "1px solid oklch(0.88 0.015 220)",
              background: "oklch(0.985 0.006 240)",
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.52 0.13 185 / 0.12)" }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.45 0.12 185)" }}
                  />
                </div>
                <Badge
                  className="text-xs px-2 py-0.5 mt-0.5"
                  style={{
                    background: "oklch(0.55 0.10 50 / 0.15)",
                    color: "oklch(0.45 0.10 50)",
                    border: "none",
                  }}
                >
                  Coming Soon
                </Badge>
              </div>
              <CardTitle
                className="text-sm font-semibold mt-2"
                style={{ color: "oklch(0.25 0.04 240)" }}
              >
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription
                className="text-xs"
                style={{ color: "oklch(0.52 0.018 240)" }}
              >
                {description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div
        className="rounded-xl px-5 py-4 text-sm"
        style={{
          background: "oklch(0.45 0.12 240 / 0.06)",
          border: "1px solid oklch(0.45 0.12 240 / 0.15)",
          color: "oklch(0.40 0.05 240)",
        }}
      >
        These features are planned for the next monthly release. Switch back to{" "}
        <strong>Classic</strong> to continue tracking your portfolio.
      </div>
    </div>
  );
}
