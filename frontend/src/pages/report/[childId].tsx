import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import PictureCard from "@/components/parent/PictureCard";
import PlanningCard from "@/components/parent/planningCard";
import StaffCommentCard from "@/components/parent/StaffCommentCard";
import { GetAllPlanningsByGroupDocument, ReportByChildDocument } from "@/graphql/generated/schema";
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

  // PLANNING (par groupId)
  const {
    data: planningData,
    loading: planningLoading,
    error: planningError,
  } = useQuery(GetAllPlanningsByGroupDocument, {
    variables: groupId ? { groupId } : undefined,
    skip: !groupId,
  });

  // REPORTS (par childId)
  const {
    data: reportData,
    loading: reportLoading,
    error: reportError,
  } = useQuery(ReportByChildDocument, {
    variables: numericChildId ? { childId: numericChildId } : undefined,
    skip: !numericChildId,
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

  if (!groupId) {
    return (
      <Layout pageTitle="Report">
        <div className="w-full max-w-md rounded-2xl border-4 border-sky-300 bg-white/70 p-5 text-blue-900">
          Groupe introuvable pour cet enfant.
        </div>
      </Layout>
    );
  }

  const birth = child.birthDate ? new Date(child.birthDate).toLocaleDateString("fr-FR") : "";

  // planning du groupe (plus récent)
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const planningForChild = useMemo(() => {
    const all = planningData?.getAllPlanningsByGroup ?? [];
    if (!all.length) return null;
    return (
      [...all].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null
    );
  }, [planningData]);

  // report de l'enfant (plus récent)
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
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

  return (
    <Layout pageTitle="Report">
      <div className="w-full max-w-md space-y-4">
        {/* Header enfant */}
        <div className="flex items-center gap-4 rounded-3xl border-4 border-sky-200 bg-white/70 p-3">
          <div className="h-24 w-24 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-300 p-[6px] shadow-[0_14px_25px_rgba(255,200,60,0.25)]">
            {/** biome-ignore lint/performance/noImgElement: <explanation> */}
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

        {/* Loading global */}
        {isLoadingAny ? (
          <div className="rounded-2xl border-4 border-yellow-200 bg-white/80 p-5 text-blue-900">
            Chargement du report…
          </div>
        ) : null}

        {/* Errors */}
        {hasErrorAny ? (
          <div className="rounded-2xl border-4 border-red-200 bg-white/80 p-5 text-red-600">
            Erreur : impossible de charger les données.
          </div>
        ) : null}

        {/* Cards report */}
        {!isLoadingAny && !hasErrorAny ? (
          <>
            {planningForChild ? (
              <PlanningCard apiPlanning={planningForChild} />
            ) : (
              <div className="rounded-2xl border-4 border-yellow-200 bg-white/80 p-5 text-blue-900">
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
    </Layout>
  );
}
