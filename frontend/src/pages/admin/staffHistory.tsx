import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import AddStaffModal from "@/components/admin/AddStaffModal";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import PencilIcon from "@/components/admin/PencilIcon";
import TrashIcon from "@/components/admin/TrashIcon";
import Layout from "@/components/Layout";
import { useAllStaffQuery, useDeleteUserMutation } from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { getGroupBg } from "@/utils/getGroupBg";

export default function AdminStaffPage() {
  const router = useRouter();
  const { user, authLoading, isAdmin, shouldSkip } = useAdminGuard();

  const { data, loading, error, refetch } = useAllStaffQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
  });

  const [deleteUser] = useDeleteUserMutation();

  const staff = data?.allStaff ?? [];

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const groups = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of staff) {
      if (s.group?.id && s.group?.name) {
        map.set(String(s.group.id), s.group.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [staff]);

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter((s) => {
      const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q);
      const matchGroup = groupFilter === "ALL" || String(s.group?.id) === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [staff, search, groupFilter]);

  function handleDelete(id: number, name: string) {
    setOpenMenuId(null);
    setConfirmDelete({ id, name });
  }

  async function confirmDeleteStaff() {
    if (!confirmDelete) return;
    try {
      await deleteUser({
        variables: { id: confirmDelete.id },
        refetchQueries: ["AllStaff", "AdminCounts"],
      });
      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteSuccess(false);
        setConfirmDelete(null);
      }, 2000);
    } catch {
      setConfirmDelete(null);
    }
  }

  if (authLoading) return null;
  if (!user || !isAdmin) return null;

  return (
    <Layout pageTitle="Historique Staff - Admin">
      <AddStaffModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      {confirmDelete && (
        <ConfirmDeleteModal
          name={confirmDelete.name}
          successMessage="✓ Membre supprimé avec succès !"
          success={deleteSuccess}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteStaff}
        />
      )}

      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-6 md:max-w-none md:px-16 md:pt-0 lg:px-24">
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
            Membre du staff
          </h1>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-2 py-1 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 md:px-6 md:py-3 md:text-[17px] md:rounded-3xl"
          >
            + Ajouter un membre
          </button>
        </div>

        <div className="mt-2 flex items-center h-9 rounded-lg bg-white/80 border-2 border-(--color-primary) px-3 shadow-sm md:mt-6 md:h-14 md:rounded-2xl md:px-5">
          <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0 mr-2">
            <img src="/admin/loupe.png" alt="Recherche" className="h-14 w-14 opacity-60" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche un membre..."
            className="w-full bg-transparent text-[13px] outline-none md:text-[18px]"
          />
        </div>

        <div className="mt-2 relative w-fit md:mt-4">
          <button
            type="button"
            onClick={() => setGroupDropdownOpen((prev) => !prev)}
            className="flex items-center w-full h-9 rounded-xl border-2 border-(--color-primary) bg-white/80 px-2 shadow-sm text-[12px] text-left outline-none gap-1 md:h-12 md:text-[16px] md:px-4 md:rounded-2xl"
          >
            <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0">
              <img src="/admin/groupe.png" alt="Groupe" className="h-14 w-14 opacity-70" />
            </div>
            <span className="text-gray-500">
              {groupFilter === "ALL"
                ? "Tous les groupes"
                : (groups.find((g) => g.id === groupFilter)?.name ?? "Tous les groupes")}
            </span>
            <span
              className={`ml-1 text-gray-400 transition-transform duration-200 ${groupDropdownOpen ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>

          {groupDropdownOpen && (
            <div className="absolute left-0 top-10 z-10 rounded-xl border-2 border-(--color-primary) bg-white overflow-hidden shadow-lg w-full md:top-14 md:rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setGroupFilter("ALL");
                  setGroupDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 hover:bg-orange-50 md:text-[16px] md:px-5 md:py-3 ${groupFilter === "ALL" ? "font-semibold" : ""}`}
              >
                Tous les groupes
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGroupFilter(g.id);
                    setGroupDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 last:border-0 hover:bg-orange-50 md:text-[16px] md:px-5 md:py-3 ${groupFilter === g.id ? "font-semibold" : ""}`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <p className="mt-6 text-center text-[13px] opacity-70 md:text-[18px]">Chargement...</p>
        )}
        {error && (
          <p className="mt-6 text-center text-[13px] text-red-600 md:text-[18px]">
            Erreur lors du chargement.
          </p>
        )}

        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-3 md:gap-6 md:mt-8">
            {filteredStaff.length === 0 && (
              <div className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) p-4 text-[13px] text-center opacity-70 md:text-[18px]">
                Aucun membre trouvé.
              </div>
            )}

            {filteredStaff.map((s) => {
              const menuKey = String(s.id);
              return (
                <div
                  key={s.id}
                  className="relative flex items-center justify-between rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md md:grid md:grid-cols-[3fr_2fr_auto] md:items-center md:gap-3 md:px-6 md:py-5 md:rounded-3xl"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <img
                      src={s.avatar ?? "/admin/staffavatar.png"}
                      alt={`${s.first_name} ${s.last_name}`}
                      className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0 md:h-20 md:w-20"
                    />
                    <div>
                      <div className="text-[14px] font-semibold md:text-[20px]">
                        {s.first_name} {s.last_name}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[12px] opacity-70 whitespace-nowrap md:text-[15px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 shrink-0 md:h-4 md:w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                            />
                          </svg>
                          {s.phone ?? "—"}
                        </span>
                        <span
                          className="md:hidden rounded-full border-2 border-white px-2 py-0.5 text-[11px] font-medium shadow-md whitespace-nowrap"
                          style={{ backgroundColor: getGroupBg(String(s.group?.id)) }}
                        >
                          {s.group?.name ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className="hidden md:inline-flex justify-self-start rounded-full border-2 border-white px-4 py-1 text-[14px] font-medium shadow-md whitespace-nowrap"
                    style={{ backgroundColor: getGroupBg(String(s.group?.id)) }}
                  >
                    {s.group?.name ?? "—"}
                  </span>

                  <div ref={openMenuId === menuKey ? menuRef : null} className="md:relative">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === menuKey ? null : menuKey)}
                      className="text-[20px] px-2 opacity-60 hover:opacity-100 md:text-[28px]"
                    >
                      •••
                    </button>

                    {openMenuId === menuKey && (
                      <div className="absolute right-3 top-12 z-20 flex flex-col rounded-2xl bg-white border-2 border-(--color-tertiary) shadow-md overflow-hidden text-[13px] min-w-[140px] md:right-0 md:top-full md:mt-1 md:text-[16px] md:min-w-[180px]">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            router.push(`/admin/staff/${s.id}/edit`);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 border-b border-gray-100"
                        >
                          <PencilIcon />
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id, `${s.first_name} ${s.last_name}`)}
                          className="flex items-center gap-3 px-4 py-2.5 text-left text-red-500 hover:bg-red-50"
                        >
                          <TrashIcon />
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
