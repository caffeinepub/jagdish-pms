import { createContext, useContext, useState } from "react";

export interface AppVersion {
  id: string;
  label: string;
  badge: string;
  description: string;
}

export const VERSIONS: AppVersion[] = [
  {
    id: "classic",
    label: "Classic",
    badge: "v1",
    description: "Core portfolio tracking",
  },
  {
    id: "advanced",
    label: "Advanced",
    badge: "v2",
    description: "Enhanced analytics & tools",
  },
  {
    id: "elite",
    label: "Elite",
    badge: "v3",
    description: "Broker & distributor tracking",
  },
];

interface VersionContextValue {
  selectedVersion: string;
  setSelectedVersion: (v: string) => void;
  versions: AppVersion[];
  currentVersion: AppVersion;
}

const VersionContext = createContext<VersionContextValue | null>(null);

function getInitialVersion(): string {
  try {
    const stored = localStorage.getItem("pms_version");
    if (stored && VERSIONS.find((v) => v.id === stored)) return stored;
  } catch {
    // ignore
  }
  return "classic";
}

export function VersionProvider({ children }: { children: React.ReactNode }) {
  const [selectedVersion, setSelectedVersionState] =
    useState<string>(getInitialVersion);

  const setSelectedVersion = (v: string) => {
    setSelectedVersionState(v);
    try {
      localStorage.setItem("pms_version", v);
    } catch {
      // ignore
    }
  };

  const currentVersion =
    VERSIONS.find((v) => v.id === selectedVersion) ?? VERSIONS[0];

  return (
    <VersionContext.Provider
      value={{
        selectedVersion,
        setSelectedVersion,
        versions: VERSIONS,
        currentVersion,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error("useVersion must be used within VersionProvider");
  return ctx;
}
