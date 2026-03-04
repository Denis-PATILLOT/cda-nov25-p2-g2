import { useRouter } from "next/router";
import { useEffect } from "react";
import ChildCard from "@/components/ChildCard";
import Layout from "@/components/Layout";
import PlanningCard from "@/components/planningCard";
import { useAuth } from "@/hooks/CurrentProfile";

export default function DashboardParents() {
  const router = useRouter();
  const { user, loading, isParent } = useAuth();
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
    else if (!isParent) router.replace("/403");
  }, [loading, user, isParent, router]);

  if (loading) return null;
  if (!user || !isParent) return null;
  return (
    <Layout pageTitle="Accueil parent">
      <div className="w-full max-w-md rounded-[28px] border-4 border-sky-300 bg-white/70 p-5 shadow-[0_14px_35px_rgba(15,40,90,0.12)]">
        <div className="space-y-4">
          {user?.children?.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onClick={() => console.log("ouvrir profil enfant", child)}
            />
          ))}

          {user?.children?.length === 0 && (
            <p className="rounded-2xl bg-white/60 p-4 text-center text-blue-900/80">
              Aucun enfant renvoyé par l’API.
            </p>
          )}
        </div>
      </div>
      <div className="w-full max-w-md rounded-[28px] border-4 border-sky-300 bg-white/70 p-5 shadow-[0_14px_35px_rgba(15,40,90,0.12)]">
        <PlanningCard />
      </div>
    </Layout>
  );
}
