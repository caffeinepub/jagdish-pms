import { useCallback } from "react";
import { useInternetIdentity } from "./useInternetIdentity";

export function useUserEmail() {
  const { identity } = useInternetIdentity();
  const principalId = identity?.getPrincipal().toString() ?? "";
  const storageKey = principalId ? `pms_email_${principalId}` : null;

  const getEmail = useCallback(() => {
    if (!storageKey) return "";
    return localStorage.getItem(storageKey) ?? "";
  }, [storageKey]);

  const saveEmail = useCallback(
    (email: string) => {
      if (!storageKey) return;
      if (email.trim()) {
        localStorage.setItem(storageKey, email.trim());
      } else {
        localStorage.removeItem(storageKey);
      }
    },
    [storageKey],
  );

  return { email: getEmail(), saveEmail };
}
