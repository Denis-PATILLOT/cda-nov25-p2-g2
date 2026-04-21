import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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

    const today = new Date();

    return (
      all.find((planning) => {
        const d = new Date(planning.date);

        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      }) ?? null
    );
  }, [planningData]);

  const reportOfToday = useMemo(() => {
    const reports = reportData?.child?.reports ?? [];
    if (!reports.length) return null;

    const today = new Date();

    return (
      reports.find((report) => {
        const d = new Date(report.date);

        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      }) ?? null
    );
  }, [reportData]);

  const mainPhoto = reportOfToday?.picture ?? null;

  const isLoadingAny = planningLoading || reportLoading;
  const hasErrorAny = planningError || reportError;

  if (authLoading) return null;
  if (!user || !isParent) return null;

  if (!childId) {
    return (
      <Layout pageTitle="Report">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-28 pt-8">
          <div className="w-full rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900 shadow-sm transition-shadow duration-300 hover:shadow-md">
            ID enfant manquant dans l’URL.
          </div>
        </div>
      </Layout>
    );
  }

  if (!child) {
    return (
      <Layout pageTitle="Report">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-28 pt-8">
          <div className="w-full rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900 shadow-sm transition-shadow duration-300 hover:shadow-md">
            Enfant introuvable.
          </div>
        </div>
      </Layout>
    );
  }

  if (!groupId) {
    return (
      <Layout pageTitle="Report">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-28 pt-8">
          <div className="w-full rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900 shadow-sm transition-shadow duration-300 hover:shadow-md">
            Groupe introuvable pour cet enfant.
          </div>
        </div>
      </Layout>
    );
  }

  const safeChild = child;

  return (
    <Layout pageTitle="Report">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-28 pt-8">
        <div className="rounded-[42px] border-[4px] border-yellow-300 bg-[#fdfcfc]/88 px-4 py-6 shadow-[0_14px_28px_rgba(20,40,90,0.10)] space-y-4">
          <ChildCard child={safeChild} />

          {isLoadingAny && (
            <div className="w-full rounded-2xl border-4 border-yellow-200 bg-white/80 p-5 text-blue-900 shadow-sm">
              Chargement du report…
            </div>
          )}

          {hasErrorAny && (
            <div className="w-full rounded-2xl border-4 border-red-200 bg-white/80 p-5 text-red-600 shadow-sm">
              Erreur : impossible de charger les données.
            </div>
          )}

          {!isLoadingAny && !hasErrorAny && (
            <>
              {planningForChild ? (
                <PlanningCard apiPlanning={planningForChild} />
              ) : (
                <div className="w-full rounded-2xl border-4 border-yellow-200 bg-white/80 p-5 text-blue-900 shadow-sm">
                  Aucun planning pour aujourd’hui.
                </div>
              )}

              <PictureCard imageUrl={mainPhoto} onGalleryClick={() => setIsGalleryOpen(true)} />

              <StaffCommentCard
                text={reportOfToday?.staff_comment ?? "Aucun commentaire pour aujourd’hui."}
                mood={reportOfToday?.baby_mood ?? "na"}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
