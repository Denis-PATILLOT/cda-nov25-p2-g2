import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import AddParentModal from "@/components/admin/AddParentModal";
import Layout from "@/components/Layout";
import { useAdminChildrenQuery, useDeleteUserMutation } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";

function getGroupBg(groupId: string) {
  return `var(--color-group${groupId})`;
}

export default function AdminParentsPage() {
  const router = useRouter();

  const { user, loading: authLoading, isAdmin } = useAuth();
  const shouldSkip = authLoading || !user || !isAdmin;

  const { data, loading, error, refetch } = useAdminChildrenQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
  });

  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/");
    else if (!isAdmin) router.replace("/403");
  }, [authLoading, user, isAdmin, router]);

  const children = data?.children ?? [];

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Aplatit : une entrée par (parent, enfant)
  const parentRows = useMemo(() => {
    return children.flatMap((c) =>
      c.parents.map((p) => ({
        key: `${p.id}-${c.id}`,
        parent: p,
        child: c,
      })),
    );
  }, [children]);

  const groups = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of children) {
      if (c.group?.id && c.group?.name) {
        map.set(String(c.group.id), c.group.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [children]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parentRows.filter(({ parent, child }) => {
      const fullName = `${parent.first_name} ${parent.last_name}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q);
      const matchGroup = groupFilter === "ALL" || String(child.group?.id) === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [parentRows, search, groupFilter]);

  function handleDelete(id: number, name: string) {
    setOpenMenuId(null);
    setConfirmDelete({ id, name });
  }

  async function confirmDeleteParent() {
    if (!confirmDelete) return;
    try {
      await deleteUser({
        variables: { id: confirmDelete.id },
        refetchQueries: ["AdminChildren"],
      });
    } catch {
      // silently ignore
    } finally {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setConfirmDelete(null)}
            aria-label="Fermer"
          />
          <div className="relative w-full max-w-[340px] rounded-3xl bg-[#FEF9F6] border-2 border-(--color-primary) p-6 shadow-xl flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border-2 border-red-200">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold">Êtes-vous sûr de vouloir supprimer</p>
              <p className="text-[15px] font-semibold">{confirmDelete.name} ?</p>
              <p className="mt-1 text-[12px] opacity-60">Cette action est irréversible.</p>
            </div>
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDeleteParent}
                className="flex-1 rounded-xl border-2 border-red-200 bg-white py-2 text-[13px] text-red-500 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
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
            {filteredRows.length === 0 && (
              <div className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) p-4 text-[13px] text-center opacity-70">
                Aucun parent trouvé.
              </div>
            )}

            {filteredRows.map(({ key, parent, child }) => (
              <div
                key={key}
                className="relative flex items-center justify-between rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={child.picture}
                      alt={`${child.firstName} ${child.lastName}`}
                      className="h-12 w-12 rounded-full object-cover bg-gray-100 border-2 border-(--color-primary)"
                    />
                    <img
                      src={parent.avatar ?? "/admin/parentavatar.png"}
                      alt={`${parent.first_name} ${parent.last_name}`}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full object-cover border-2 border-(--color-primary) bg-gray-100"
                    />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold">
                      {parent.first_name} {parent.last_name}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] opacity-70 w-[100px] truncate">
                        {child.firstName} {child.lastName}
                      </span>
                      <span
                        className="rounded-full border-2 border-white px-2 py-0.5 text-[11px] font-medium shadow-md whitespace-nowrap"
                        style={{ backgroundColor: getGroupBg(String(child.group?.id)) }}
                      >
                        {child.group?.name ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Droite : ••• */}
                <div ref={openMenuId === key ? menuRef : null}>
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === key ? null : key)}
                    className="text-[20px] px-2 opacity-60 hover:opacity-100"
                  >
                    •••
                  </button>

                  {openMenuId === key && (
                    <div className="absolute right-3 top-12 z-10 flex flex-col rounded-2xl bg-white border-2 border-(--color-tertiary) shadow-md overflow-hidden text-[13px] min-w-[140px]">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          router.push(`/admin/children/${child.id}/edit`);
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
                        onClick={() =>
                          handleDelete(parent.id, `${parent.first_name} ${parent.last_name}`)
                        }
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
