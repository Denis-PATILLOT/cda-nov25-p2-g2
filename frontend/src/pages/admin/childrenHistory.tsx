import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import AddChildModal from "@/components/admin/AddChildModal";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import PencilIcon from "@/components/admin/PencilIcon";
import TrashIcon from "@/components/admin/TrashIcon";
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

      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-6 md:max-w-none md:px-16 md:pt-0 lg:px-24">
        {/* Header : retour, titre, bouton ajouter */}
        <div className="relative flex items-center justify-between md:mt-20">
          <button type="button" onClick={() => router.push("/admin")} className="p-0">
            <div className="h-10 w-10 overflow-hidden flex items-center justify-center md:h-20 md:w-20 cursor-pointer">
              <img
                src="/admin/flechegauche.webp"
                alt="Retour"
                className="h-16 w-16 md:h-28 md:w-28"
              />
            </div>
          </button>

          <h1 className="text-[16px] font-semibold md:absolute md:left-1/2 md:-translate-x-1/2 md:text-[28px]">
            Enfants
          </h1>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-2 py-1 text-[12px] shadow-sm transition-all cursor-pointer duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 md:px-6 md:py-3 md:text-[17px] md:rounded-3xl"
          >
            + Ajouter un enfant
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mt-2 flex items-center h-9 rounded-lg bg-white/80 border-2 border-(--color-primary) px-3 shadow-sm md:mt-6 md:h-14 md:rounded-2xl md:px-5">
          <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0 mr-2">
            <img src="/admin/loupe.webp" alt="Recherche" className="h-14 w-14 opacity-60" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche un enfant..."
            className="w-full bg-transparent text-[13px] outline-none md:text-[18px]"
          />
        </div>

        {/* Filtre par groupe */}
        <div className="mt-2 relative w-fit md:mt-4">
          <button
            type="button"
            onClick={() => setGroupDropdownOpen((prev) => !prev)}
            className="flex items-center w-full h-9 rounded-xl border-2 cursor-pointer border-(--color-primary) bg-white/80 px-2 shadow-sm text-[12px] text-left outline-none gap-1 md:h-12 md:text-[16px] md:px-4 md:rounded-2xl"
          >
            <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0">
              <img src="/admin/groupe.webp" alt="Groupe" className="h-14 w-14 opacity-70" />
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
            <div className="absolute left-0 top-10 z-10 rounded-xl border-2 border-(--color-primary)  bg-white overflow-hidden shadow-lg w-full md:top-14 md:rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setGroupFilter("ALL");
                  setGroupDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[12px] border-b cursor-pointer border-gray-50 hover:bg-orange-50 md:text-[16px] md:px-5 md:py-3 ${groupFilter === "ALL" ? "font-semibold" : ""}`}
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
                  className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 cursor-pointer last:border-0 hover:bg-orange-50 md:text-[16px] md:px-5 md:py-3 ${groupFilter === g.id ? "font-semibold" : ""}`}
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

        {/* Liste des enfants filtrés */}
        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-3 md:gap-6 md:mt-8">
            {filteredChildren.length === 0 && (
              <div className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) p-4 text-[13px] text-center opacity-70 md:text-[18px]">
                Aucun enfant trouvé.
              </div>
            )}

            {filteredChildren.map((c) => (
              <div
                key={c.id}
                className="relative grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md md:grid-cols-[3fr_2fr_auto] md:px-6 md:py-5 md:rounded-3xl"
              >
                <div className="flex items-center gap-3 md:gap-5">
                  <img
                    src={c.picture}
                    alt={`${c.firstName} ${c.lastName}`}
                    className="h-12 w-12 rounded-full object-cover bg-gray-100 border-2 border-(--color-primary) md:h-20 md:w-20"
                  />
                  <div>
                    <div className="text-[14px] font-semibold md:text-[20px]">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="text-[12px] opacity-70 mt-1 md:text-[15px]">
                      {getAge(String(c.birthDate))}
                    </div>
                  </div>
                </div>

                <span
                  className="justify-self-start rounded-full border-2 border-white px-2 py-0.5 text-[11px] font-medium shadow-md md:text-[14px] md:px-4 md:py-1"
                  style={{ backgroundColor: getGroupBg(String(c.group?.id)) }}
                >
                  {c.group?.name ?? "—"}
                </span>

                {/* Menu contextuel ••• */}
                <div ref={openMenuId === c.id ? menuRef : null} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                    className="text-[20px] px-2 opacity-60 cursor-pointer hover:opacity-100 md:text-[28px]"
                  >
                    •••
                  </button>

                  {openMenuId === c.id && (
                    <div className="absolute right-0 top-full mt-1 z-20 flex flex-col rounded-2xl bg-white border-2 border-(--color-tertiary) shadow-md overflow-hidden text-[13px] min-w-[140px] md:text-[16px] md:min-w-[180px]">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          router.push(`/admin/children/${c.id}/edit`);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                      >
                        <PencilIcon />
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, `${c.firstName} ${c.lastName}`)}
                        className="flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer text-red-500 hover:bg-red-50"
                      >
                        <TrashIcon />
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
