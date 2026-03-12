import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import AddParentModal from "@/components/admin/AddParentModal";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import PencilIcon from "@/components/admin/PencilIcon";
import TrashIcon from "@/components/admin/TrashIcon";
import Layout from "@/components/Layout";
import { useAllParentsQuery, useDeleteUserMutation } from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { getGroupBg } from "@/utils/getGroupBg";

export default function AdminParentsPage() {
  const router = useRouter();
  const { user, authLoading, isAdmin, shouldSkip } = useAdminGuard();

  const { data, loading, error, refetch } = useAllParentsQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
  });

  const [deleteUser] = useDeleteUserMutation();

  const parents = data?.allParents ?? [];

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of parents) {
      for (const c of p.children ?? []) {
        if (c.group?.id && c.group?.name) {
          map.set(String(c.group.id), c.group.name);
        }
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [parents]);

  const filteredParents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parents.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q);
      const matchGroup =
        groupFilter === "ALL" ||
        (p.children ?? []).some((c) => String(c.group?.id) === groupFilter);
      return matchSearch && matchGroup;
    });
  }, [parents, search, groupFilter]);

  function handleDelete(id: number, name: string) {
    setOpenMenuId(null);
    setConfirmDelete({ id, name });
  }

  async function confirmDeleteParent() {
    if (!confirmDelete) return;
    try {
      await deleteUser({
        variables: { id: confirmDelete.id },
        refetchQueries: ["AllParents"],
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
    <Layout pageTitle="Historique Parents - Admin">
      <AddParentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      {confirmDelete && (
        <ConfirmDeleteModal
          name={confirmDelete.name}
          successMessage="✓ Parent supprimé avec succès !"
          success={deleteSuccess}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteParent}
        />
      )}

      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-6">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => router.push("/admin")} className="p-0">
            <div className="h-10 w-10 overflow-hidden flex items-center justify-center">
              <img src="/admin/flechegauche.png" alt="Retour" className="h-16 w-16" />
            </div>
          </button>

          <h1 className="text-[16px] font-semibold">Parents</h1>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-2 py-1 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            + Ajouter un parent
          </button>
        </div>

        <div className="mt-2 flex items-center h-9 rounded-lg bg-white/80 border-2 border-(--color-primary) px-3 shadow-sm">
          <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0 mr-2">
            <img src="/admin/loupe.png" alt="Recherche" className="h-14 w-14 opacity-60" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche un parent..."
            className="w-full bg-transparent text-[13px] outline-none"
          />
        </div>

        <div className="mt-2 relative w-fit">
          <button
            type="button"
            onClick={() => setGroupDropdownOpen((prev) => !prev)}
            className="flex items-center w-full h-9 rounded-xl border-2 border-(--color-primary) bg-white/80 px-2 shadow-sm text-[12px] text-left outline-none gap-1"
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
            <div className="absolute left-0 top-10 z-10 rounded-xl border-2 border-(--color-primary) bg-white overflow-hidden shadow-lg w-full">
              <button
                type="button"
                onClick={() => {
                  setGroupFilter("ALL");
                  setGroupDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 hover:bg-orange-50 ${groupFilter === "ALL" ? "font-semibold" : ""}`}
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
                  className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 last:border-0 hover:bg-orange-50 ${groupFilter === g.id ? "font-semibold" : ""}`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && <p className="mt-6 text-center text-[13px] opacity-70">Chargement...</p>}
        {error && (
          <p className="mt-6 text-center text-[13px] text-red-600">Erreur lors du chargement.</p>
        )}

        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-3">
            {filteredParents.length === 0 && (
              <div className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) p-4 text-[13px] text-center opacity-70">
                Aucun parent trouvé.
              </div>
            )}

            {filteredParents.map((parent) => {
              const menuKey = String(parent.id);
              const firstChild = parent.children?.[0];
              const parentChildren = parent.children ?? [];
              return (
                <div
                  key={parent.id}
                  className="relative rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md"
                >
                  {/* Ligne parent */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={parent.avatar ?? "/admin/parentavatar.png"}
                        alt={`${parent.first_name} ${parent.last_name}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0"
                      />
                      <span className="text-[14px] font-semibold">
                        {parent.first_name} {parent.last_name}
                      </span>
                    </div>

                    {/* ••• */}
                    <div ref={openMenuId === menuKey ? menuRef : null}>
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === menuKey ? null : menuKey)}
                        className="text-[20px] px-2 opacity-60 hover:opacity-100"
                      >
                        •••
                      </button>

                      {openMenuId === menuKey && (
                        <div className="absolute right-3 top-12 z-10 flex flex-col rounded-2xl bg-white border-2 border-(--color-tertiary) shadow-md overflow-hidden text-[13px] min-w-[140px]">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              router.push(
                                `/admin/parents/${parent.id}/edit?childId=${firstChild?.id ?? ""}`,
                              );
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 border-b border-gray-100"
                          >
                            <PencilIcon />
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(parent.id, `${parent.first_name} ${parent.last_name}`)
                            }
                            className="flex items-center gap-3 px-4 py-2.5 text-left text-red-500 hover:bg-red-50"
                          >
                            <TrashIcon />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enfants */}
                  {parentChildren.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 pl-[60px]">
                      {parentChildren.map((child) => (
                        <div key={child.id} className="flex items-center gap-2">
                          <img
                            src={child.picture}
                            alt={`${child.firstName} ${child.lastName}`}
                            className="h-6 w-6 rounded-full object-cover bg-gray-100 border border-(--color-primary) shrink-0"
                          />
                          <span className="text-[12px] opacity-70 truncate">
                            {child.firstName} {child.lastName}
                          </span>
                          {child.group && (
                            <span
                              className="rounded-full border-2 border-white px-2 py-0.5 text-[10px] font-medium shadow-sm whitespace-nowrap"
                              style={{ backgroundColor: getGroupBg(String(child.group.id)) }}
                            >
                              {child.group.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
