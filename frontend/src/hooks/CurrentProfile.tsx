import { useProfileQuery } from "@/graphql/generated/schema";

type Role = "admin" | "staff" | "parent";

// hook useAuth pour gérer les données de l'utilisateur courant facilement
export function useAuth() {
  const { data, loading, refetch } = useProfileQuery();
  const user = data?.me ?? null;
  const role = (user?.role ?? "") as Role;
  const group = user?.group ?? null;
  const isAuthenticated = !!user; // true si user existant
  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isParent = role === "parent";

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isStaff,
    isParent,
    refetch,
    group,
  };
}
