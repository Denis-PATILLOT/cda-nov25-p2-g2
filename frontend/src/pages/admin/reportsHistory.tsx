import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useAllReportsQuery } from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { getAge } from "@/utils/getAge";
import { getGroupBg } from "@/utils/getGroupBg";

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, authLoading, isAdmin, shouldSkip } = useAdminGuard();

  const { data, loading, error } = useAllReportsQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
  });

  const reports = data?.reports ?? [];

  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const dates = useMemo(() => {
    const set = new Set(reports.map((r) => new Date(r.date).toISOString().split("T")[0]));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [reports]);

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      const reportDate = new Date(r.date).toISOString().split("T")[0];
      const matchDate = reportDate === selectedDate;
      const fullName = `${r.child.firstName} ${r.child.lastName}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q);
      return matchDate && matchSearch;
    });
  }, [reports, selectedDate, search]);

  if (authLoading) return null;
  if (!user || !isAdmin) return null;

  return (
    <Layout pageTitle="Rapport des enfants - Admin">
      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-6 md:max-w-none md:px-16 md:pt-0 lg:px-24">
        {/* Header */}
        <div className="relative flex items-center justify-between md:mt-20">
          <button type="button" onClick={() => router.push("/admin")} className="p-0">
            <div className="h-10 w-10 overflow-hidden flex items-center justify-center md:h-20 md:w-20">
              <img
                src="/admin/flechegauche.png"
                alt="Retour"
                className="h-16 w-16 md:h-28 md:w-28"
              />
            </div>
          </button>
          <h1 className="text-[16px] font-semibold md:absolute md:left-1/2 md:-translate-x-1/2 md:text-[28px]">
            Rapport des enfants
          </h1>
          <div className="w-10 md:w-20" />
        </div>

        {/* Barre de recherche */}
        <div className="mt-2 flex items-center h-9 rounded-lg bg-white/80 border-2 border-(--color-primary) px-3 shadow-sm transition-all duration-200 hover:shadow-md focus-within:shadow-md focus-within:scale-[1.01] md:mt-6 md:h-14 md:rounded-2xl md:px-5">
          <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0 mr-2">
            <img src="/admin/loupe.png" alt="Recherche" className="h-14 w-14 opacity-60" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche un enfant..."
            className="w-full bg-transparent text-[13px] outline-none md:text-[18px]"
          />
        </div>

        {/* Filtre par date */}
        <div className="mt-2 relative w-fit md:mt-4">
          <button
            type="button"
            onClick={() => setDateDropdownOpen((prev) => !prev)}
            className="flex items-center h-9 rounded-xl border-2 border-(--color-primary) bg-white/80 px-3 shadow-sm text-[12px] gap-2 md:h-12 md:text-[16px] md:px-4 md:rounded-2xl"
          >
            <span className="text-gray-600">
              {selectedDate === today
                ? "Aujourd'hui"
                : new Date(selectedDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
            </span>
            <span
              className={`text-gray-400 transition-transform duration-200 ${dateDropdownOpen ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>

          {dateDropdownOpen && (
            <div className="absolute left-0 top-10 z-10 rounded-xl border-2 border-(--color-primary) bg-white overflow-hidden shadow-lg min-w-[190px] md:top-14 md:rounded-2xl md:min-w-[240px]">
              {dates.length === 0 && (
                <div className="px-3 py-2 text-[12px] text-gray-400 md:text-[16px] md:px-5 md:py-3">
                  Aucune date disponible
                </div>
              )}
              {dates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d);
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 last:border-0 hover:bg-orange-50 md:text-[16px] md:px-5 md:py-3 ${selectedDate === d ? "font-semibold" : ""}`}
                >
                  {d === today
                    ? "Aujourd'hui"
                    : new Date(d).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* En-tête section date */}
        <div className="mt-4 flex items-center gap-2 md:mt-6">
          <img
            src="/boutons/calendrier.png"
            alt="calendrier"
            className="h-8 w-8 object-contain md:h-10 md:w-10"
          />
          <span className="text-[14px] font-semibold md:text-[18px]">
            {selectedDate === today
              ? "Date du jour"
              : (() => {
                  const s = new Date(selectedDate).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  });
                  return s.charAt(0).toUpperCase() + s.slice(1);
                })()}
          </span>
        </div>

        {loading && (
          <p className="mt-6 text-center text-[13px] opacity-70 md:text-[18px]">Chargement...</p>
        )}
        {error && (
          <p className="mt-6 text-center text-[13px] text-red-600 md:text-[18px]">
            Erreur lors du chargement.
          </p>
        )}

        {/* Cartes des rapports */}
        {!loading && !error && (
          <div className="mt-3 flex flex-col gap-3 md:gap-6 md:mt-8">
            {filteredReports.length === 0 && (
              <div className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) p-4 text-[13px] text-center opacity-70 md:text-[18px]">
                Aucun rapport pour cette date.
              </div>
            )}

            {filteredReports.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md md:px-6 md:py-5 md:rounded-3xl"
              >
                <div className="flex items-center gap-3 md:gap-5">
                  <img
                    src={r.child.picture ?? "/admin/bbavatar.png"}
                    alt={`${r.child.firstName} ${r.child.lastName}`}
                    className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0 md:h-20 md:w-20"
                  />
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold md:text-[20px]">
                      {r.child.firstName} {r.child.lastName}
                    </div>
                    <div className="mt-1 flex items-center gap-20">
                      <span className="text-[12px] opacity-70 w-[52px] md:text-[15px] md:w-auto">
                        {getAge(String(r.child.birthDate))}
                      </span>
                      <span
                        className="rounded-full border-2 border-white px-2 py-0.5 text-[11px] font-medium shadow-md md:text-[14px] md:px-4 md:py-1"
                        style={{ backgroundColor: getGroupBg(String(r.child.group?.id)) }}
                      >
                        {r.child.group?.name ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push(`/staff/child/${r.child.id}/reports/${r.id}`)}
                  className="mt-3 w-full border-t border-(--color-primary) pt-2 text-[13px] font-medium text-center hover:opacity-70 transition-opacity md:text-[16px] md:pt-3 md:mt-4"
                >
                  Voir rapport
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
