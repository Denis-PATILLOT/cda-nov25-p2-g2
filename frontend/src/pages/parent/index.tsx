import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import ChildCard from "@/components/parent/ChildCard";
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
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-28 pt-8">
        {/* BLOC BIENVENUE */}
        <section className="mb-8">
          <div className="rounded-[26px] border-[4px] border-sky-200 bg-[#fffdfd]/95 px-6 py-5 text-center shadow-[0_8px_18px_rgba(20,40,90,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(20,40,90,0.18)]">
            <h1 className="text-[28px] font-extrabold text-blue-900 md:text-[32px]">
              Bienvenue {user.first_name}
            </h1>
          </div>
        </section>

        {/* CARTE PRINCIPALE */}
        <section className="rounded-[38px] border-[4px] border-sky-200 bg-[#fcf8f8]/90 px-4 py-7 shadow-[0_12px_26px_rgba(20,40,90,0.12)] transition-all duration-300 hover:shadow-[0_16px_30px_rgba(20,40,90,0.16)]">
          <div className="space-y-8">
            {user.children?.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onClick={() => router.push(`/parent/report/${child.id}`)}
              />
            ))}

            {user.children?.length === 0 && (
              <p className="rounded-2xl bg-white/70 p-4 text-center text-blue-900/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                Aucun enfant renvoyé par l’API.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
