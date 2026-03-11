import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import ChildCard from "@/components/parent/ChildCard";
import PictureCard from "@/components/parent/PictureCard";
import PlanningCard from "@/components/parent/planningCard";
import StaffCommentCard from "@/components/parent/StaffCommentCard";
import { useGetAllPlanningsByGroupQuery, useReportByChildQuery } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";

export default function ReportPage() {
  const router = useRouter();
  const { user, loading: authLoading, isParent } = useAuth();

  const childId = useMemo(() => {
    const raw = router.query.childId;
    return raw ? String(raw) : null;
  }, [router.query.childId]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/");
    } else if (!isParent) {
      router.replace("/403");
    }
  }, [authLoading, user, isParent, router]);

  const child = useMemo(() => {
    if (!user?.children || !childId) return null;
    return user.children.find((c) => String(c.id) === childId) ?? null;
  }, [user, childId]);

  const groupId = useMemo(() => {
    if (!child?.group?.id) return null;
    const n = Number(child.group.id);
    return Number.isFinite(n) ? n : null;
  }, [child]);

  const numericChildId = useMemo(() => {
    if (!child?.id) return null;
    const n = Number(child.id);
    return Number.isFinite(n) ? n : null;
  }, [child]);

  const {
    data: planningData,
    loading: planningLoading,
    error: planningError,
  } = useGetAllPlanningsByGroupQuery({
    variables: { groupId: groupId ?? 0 },
    skip: !groupId,
  });

  const {
    data: reportData,
    loading: reportLoading,
    error: reportError,
  } = useReportByChildQuery({
    variables: { childId: numericChildId ?? 0 },
    skip: !numericChildId,
  });

  const planningForChild = useMemo(() => {
    const all = planningData?.getAllPlanningsByGroup ?? [];
    if (!all.length) return null;

    return (
      [...all].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null
    );
  }, [planningData]);

  const report = useMemo(() => {
    const reports = reportData?.child?.reports ?? [];
    if (!reports.length) return null;

    return (
      [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ??
      null
    );
  }, [reportData]);

  const isLoadingAny = planningLoading || reportLoading;
  const hasErrorAny = planningError || reportError;

  if (authLoading) return null;
  if (!user || !isParent) return null;

  if (!childId) {
    return (
      <Layout pageTitle="Report">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pt-8 pb-28">
          <div className="w-full rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900 shadow-sm">
            ID enfant manquant dans l’URL.
          </div>
        </div>
      </Layout>
    );
  }

  if (!child) {
    return (
      <Layout pageTitle="Report">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pt-8 pb-28">
          <div className="w-full rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900 shadow-sm">
            Enfant introuvable.
          </div>
        </div>
      </Layout>
    );
  }

  if (!groupId) {
    return (
      <Layout pageTitle="Report">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pt-8 pb-28">
          <div className="w-full rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900 shadow-sm">
            Groupe introuvable pour cet enfant.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Report">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pt-8 pb-28">
        <div className="space-y-4">
          <ChildCard child={child} />

          {isLoadingAny ? (
            <div className="w-full rounded-2xl border-4 border-yellow-200 bg-white/80 p-5 text-blue-900 shadow-sm">
              Chargement du report…
            </div>
          ) : null}

          {hasErrorAny ? (
            <div className="w-full rounded-2xl border-4 border-red-200 bg-white/80 p-5 text-red-600 shadow-sm">
              Erreur : impossible de charger les données.
            </div>
          ) : null}

          {!isLoadingAny && !hasErrorAny ? (
            <>
              {planningForChild ? (
                <PlanningCard apiPlanning={planningForChild} />
              ) : (
                <div className="w-full rounded-2xl border-4 border-yellow-200 bg-white/80 p-5 text-blue-900 shadow-sm">
                  Aucun planning trouvé pour ce groupe.
                </div>
              )}

              <PictureCard
                imageUrl={report?.picture ?? undefined}
                onGalleryClick={() => router.push(`/gallery/${child.id}`)}
              />

              <StaffCommentCard
                text={report?.staff_comment ?? "Aucun commentaire pour aujourd’hui."}
                mood={report?.baby_mood ?? "na"}
              />
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
