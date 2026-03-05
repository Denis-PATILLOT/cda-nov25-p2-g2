import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import PlanningCard from "@/components/planningCard";
import { GetAllPlanningsByGroupQueryetAllPlanningsByGroup } from "@/graphql/generated/schema"; // adapte le chemin si besoin
import { useAuth } from "@/hooks/CurrentProfile";

export default function ReportPage() {
  const router = useRouter();
  const { user, loading: authLoading, isParent } = useAuth();

  // childId vient de l'URL /report/[childId]
  const childId = useMemo(() => {
    const raw = router.query.childId;
    return raw ? String(raw) : null;
  }, [router.query.childId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/");
    else if (!isParent) router.replace("/403");
  }, [authLoading, user, isParent, router]);

  const child = useMemo(() => {
    if (!user?.children || !childId) return null;
    return user.children.find((c) => String(c.id) === childId) ?? null;
  }, [user, childId]);

  // ✅ Query plannings (backend: getAllPlannings existe)
  const { data, loading, error } = useQuery(GetAllPlanningsByGroupDocument, {
    skip: !child,
  });

  if (authLoading) return null;
  if (!user || !isParent) return null;

  if (!childId) {
    return (
      <Layout pageTitle="Report">
        <div className="w-full max-w-md rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900">
          ID enfant manquant dans l’URL.
        </div>
      </Layout>
    );
  }

  if (!child) {
    return (
      <Layout pageTitle="Report">
        <div className="w-full max-w-md rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900">
          Enfant introuvable.
        </div>
      </Layout>
    );
  }

  const birth = child.birthDate ? new Date(child.birthDate).toLocaleDateString("fr-FR") : "";

  const planningForChild = useMemo(() => {
    const all = data?.getAllPlanningsByGroup ?? [];
    const childGroupId = child.group?.id;
    if (!childGroupId) return null;

    const matches = all.filter((p) => p.group?.id === childGroupId);
    matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return matches[0] ?? null;
  }, [data, child]);

  return (
    <Layout pageTitle="Report">
      <div className="w-full max-w-md space-y-4">
        {/* Header enfant */}
        <div className="flex items-center gap-4 rounded-3xl border-4 border-sky-200 bg-white/70 p-3">
          <div className="h-24 w-24 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-300 p-[6px] shadow-[0_14px_25px_rgba(255,200,60,0.25)]">
            <img
              src={child.picture}
              alt={`${child.firstName} ${child.lastName}`}
              className="h-full w-full rounded-full border-4 border-white/90 object-cover"
            />
          </div>

          <div className="flex-1 rounded-3xl bg-yellow-100/80 px-5 py-4 shadow-[0_10px_16px_rgba(20,40,90,0.06)]">
            <p className="text-lg font-extrabold text-blue-900">
              {child.firstName} {child.lastName}
            </p>

            {birth ? <p className="text-base font-medium text-blue-900/90">{birth}</p> : null}

            <p className="text-base font-medium text-blue-900/90">{child.group?.name ?? ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border-4 border-yellow-200 bg-white/80 p-5 text-blue-900">
            Chargement du planning…
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border-4 border-red-200 bg-white/80 p-5 text-red-600">
            Erreur : impossible de charger les plannings.
          </div>
        ) : null}

  
        {!loading && !error ? (
          planningForChild ? (
            <PlanningCard {planningForChild} />
          ) : (
            <div className="rounded-2xl border-4 border-yellow-200 bg-white/80 p-5 text-blue-900">
              Aucun planning trouvé pour le groupe de cet enfant.
            </div>
          )
        ) : null}
      </div>
    </Layout>
  );
}
