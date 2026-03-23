import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/CurrentProfile";

export function useAdminGuard() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/");
    else if (!isAdmin) router.replace("/403");
  }, [authLoading, user, isAdmin, router]);

  return { user, authLoading, isAdmin, shouldSkip: authLoading || !user || !isAdmin };
}