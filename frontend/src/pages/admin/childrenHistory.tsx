import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import AddChildModal from "@/components/admin/AddChildModal";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import Layout from "@/components/Layout";
import { useAdminChildrenQuery, useDeleteChildMutation } from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { getAge } from "@/utils/getAge";
import { getGroupBg } from "@/utils/getGroupBg";

export default function AdminChildrenPage() {
  const router = useRouter();

  // Vérifie que l'utilisateur est connecté et admin, redirige sinon
  const { user, authLoading, isAdmin, shouldSkip } = useAdminGuard();

  // Charge la liste de tous les enfants (avec leurs groupes) pour l'affichage et les filtres
  const { data, loading, error, refetch } = useAdminChildrenQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
  });

  const [deleteChild] = useDeleteChildMutation();

  const children = data?.children ?? [];

  // États locaux : recherche, filtre groupe, menu contextuel, modales
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Construit la liste unique des groupes à partir des enfants chargés
  const groups = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of children) {
      if (c.group?.id && c.group?.name) {
        map.set(String(c.group.id), c.group.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [children]);

  // Filtre les enfants selon la recherche texte et le filtre groupe
  const filteredChildren = useMemo(() => {
    const q = search.trim().toLowerCase();
    return children.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q);
      const matchGroup = groupFilter === "ALL" || String(c.group?.id) === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [children, search, groupFilter]);

  // Ferme le menu ••• et ouvre la modale de confirmation
  function handleDelete(id: number, name: string) {
    setOpenMenuId(null);
    setConfirmDelete({ id, name });
  }

  // Exécute la suppression puis affiche le message de succès 2 secondes
  async function confirmDeleteChild() {
    if (!confirmDelete) return;
    try {
      await deleteChild({
        variables: { id: confirmDelete.id },
        refetchQueries: ["AdminChildren"],
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
    <Layout pageTitle="Historique Enfants - Admin">
      <AddChildModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      {/* Modale de confirmation suppression */}
      {confirmDelete && (
        <ConfirmDeleteModal
          name={confirmDelete.name}
          successMessage="✓ Enfant supprimé avec succès !"
          success={deleteSuccess}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteChild}
        />
      )}

      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-6">
        {/* Header : retour, titre, bouton ajouter */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => router.push("/admin")} className="p-0">
            <div className="h-10 w-10 overflow-hidden flex items-center justify-center">
              <img src="/admin/flechegauche.png" alt="Retour" className="h-16 w-16" />
            </div>
          </button>

          <h1 className="text-[16px] font-semibold">Enfants</h1>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-2 py-1 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            + Ajouter un enfant
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mt-2 flex items-center h-9 rounded-lg bg-white/80 border-2 border-(--color-primary) px-3 shadow-sm">
          <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0 mr-2">
            <img src="/admin/loupe.png" alt="Recherche" className="h-14 w-14 opacity-60" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche un enfant..."
            className="w-full bg-transparent text-[13px] outline-none"
          />
        </div>

        {/* Filtre par groupe */}
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

        {/* Liste des enfants filtrés */}
        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-3">
            {filteredChildren.length === 0 && (
              <div className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) p-4 text-[13px] text-center opacity-70">
                Aucun enfant trouvé.
              </div>
            )}

            {filteredChildren.map((c) => (
              <div
                key={c.id}
                className="relative flex items-center justify-between rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.picture}
                    alt={`${c.firstName} ${c.lastName}`}
                    className="h-12 w-12 rounded-full object-cover bg-gray-100 border-2 border-(--color-primary)"
                  />
                  <div>
                    <div className="text-[14px] font-semibold">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="mt-1 flex items-center gap-10">
                      <span className="text-[12px] opacity-70 w-[52px]">
                        {getAge(String(c.birthDate))}
                      </span>
                      <span
                        className="rounded-full border-2 border-white px-2 py-0.5 text-[11px] font-medium shadow-md"
                        style={{ backgroundColor: getGroupBg(String(c.group?.id)) }}
                      >
                        {c.group?.name ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu contextuel ••• */}
                <div ref={openMenuId === c.id ? menuRef : null}>
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                    className="text-[20px] px-2 opacity-60 hover:opacity-100"
                  >
                    •••
                  </button>

                  {openMenuId === c.id && (
                    <div className="absolute right-3 top-12 z-10 flex flex-col rounded-2xl bg-white border-2 border-(--color-tertiary) shadow-md overflow-hidden text-[13px] min-w-[140px]">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          router.push(`/admin/children/${c.id}/edit`);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 border-b border-gray-100"
                      >
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <title>Modifier</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
                          />
                        </svg>
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, `${c.firstName} ${c.lastName}`)}
                        className="flex items-center gap-3 px-4 py-2.5 text-left text-red-500 hover:bg-red-50"
                      >
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <title>Supprimer</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
