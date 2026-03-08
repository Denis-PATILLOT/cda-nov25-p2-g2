import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddChildModal from "@/components/admin/AddChildModal";
import AddParentModal from "@/components/admin/AddParentModal";
import Layout from "@/components/Layout";
import {
  useAdminChildDetailQuery,
  useAdminChildrenQuery,
  useAdminUpdateUserMutation,
} from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";
import { getAge } from "@/utils/getAge";

const PencilIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 opacity-50"
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
);

type ParentDraft = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

type EditingField = { parentId: number; field: "name" | "email" | "phone" } | null;


export default function EditParentPage() {
  const router = useRouter();
  const { childId } = router.query;
  const childIdNum = Number(childId);

  const { user, loading: authLoading, isAdmin } = useAuth();

  const { data, loading, refetch } = useAdminChildDetailQuery({
    variables: { id: childIdNum },
    skip: !childIdNum || Number.isNaN(childIdNum),
    fetchPolicy: "network-only",
  });

  const { data: allChildrenData } = useAdminChildrenQuery({ fetchPolicy: "network-only" });

  const [updateUser, { loading: saving }] = useAdminUpdateUserMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, ParentDraft>>({});
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.replace("/403");
  }, [authLoading, user, isAdmin, router]);

  useEffect(() => {
    if (data?.child?.parents) {
      const initial: Record<number, ParentDraft> = {};
      for (const p of data.child.parents) {
        initial[p.id] = {
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email ?? "",
          phone: p.phone ?? "",
        };
      }
      setDrafts(initial);
    }
  }, [data]);

  function updateDraft(parentId: number, field: keyof ParentDraft, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [parentId]: { ...prev[parentId], [field]: value },
    }));
  }

  async function handleSaveParents() {
    setServerError("");
    try {
      for (const p of data?.child?.parents ?? []) {
        const d = drafts[p.id];
        if (!d) continue;
        await updateUser({
          variables: {
            data: {
              id: p.id,
              first_name: d.first_name,
              last_name: d.last_name,
              email: d.email || null,
              phone: d.phone || null,
            },
          },
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setServerError("Erreur lors de la sauvegarde.");
    }
  }

  function handleCancelParents() {
    if (data?.child?.parents) {
      const reset: Record<number, ParentDraft> = {};
      for (const p of data.child.parents) {
        reset[p.id] = {
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email ?? "",
          phone: p.phone ?? "",
        };
      }
      setDrafts(reset);
      setEditingField(null);
    }
  }

  if (authLoading || loading) return null;
  if (!user || !isAdmin) return null;

  const child = data?.child;
  const parents = child?.parents ?? [];
  const parentIds = new Set(parents.map((p) => p.id));
  const linkedChildren = (allChildrenData?.children ?? []).filter((c) =>
    c.parents.some((p) => parentIds.has(p.id)),
  );

  return (
    <Layout pageTitle="Modifier fiche parents - Admin">
      <AddParentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          refetch();
        }}
      />
      <AddChildModal
        open={showAddChildModal}
        parentIds={parents.map((p) => p.id)}
        onClose={() => {
          setShowAddChildModal(false);
          refetch();
        }}
      />
      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => router.push("/admin/parentsHistory")} className="p-0">
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

        {/* Cartes parents */}
        <div className="mt-4 flex flex-col gap-3">
          {parents.map((p) => {
            const draft = drafts[p.id] ?? {
              first_name: p.first_name,
              last_name: p.last_name,
              email: p.email ?? "",
              phone: p.phone ?? "",
            };
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-md flex items-center gap-3"
              >
                {/* Avatar gauche */}
                <img
                  src={p.avatar ?? "/admin/parentavatar.png"}
                  alt={`${p.first_name} ${p.last_name}`}
                  className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0"
                />

                {/* Infos droite */}
                <div className="flex-1 min-w-0">
                  {/* Nom */}
                  <div
                    className="flex items-center justify-between pb-2"
                    style={{ borderBottom: "1px solid var(--color-primary)" }}
                  >
                    {editingField?.parentId === p.id && editingField.field === "name" ? (
                      <div className="flex gap-1 flex-1">
                        <input
                          value={draft.first_name}
                          onChange={(e) => updateDraft(p.id, "first_name", e.target.value)}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                          className="w-24 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[13px] outline-none"
                        />
                        <input
                          value={draft.last_name}
                          onChange={(e) => updateDraft(p.id, "last_name", e.target.value)}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                          className="w-24 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[13px] outline-none"
                        />
                      </div>
                    ) : (
                      <span className="text-[14px] font-semibold">
                        {draft.first_name} {draft.last_name}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setEditingField(
                          editingField?.parentId === p.id && editingField.field === "name"
                            ? null
                            : { parentId: p.id, field: "name" },
                        )
                      }
                    >
                      <PencilIcon />
                    </button>
                  </div>

                  {/* Email */}
                  <div
                    className="flex items-center justify-between py-2"
                    style={{ borderBottom: "1px solid var(--color-primary)" }}
                  >
                    {editingField?.parentId === p.id && editingField.field === "email" ? (
                      <input
                        type="email"
                        value={draft.email}
                        onChange={(e) => updateDraft(p.id, "email", e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                        className="flex-1 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[12px] outline-none"
                      />
                    ) : (
                      <span className="text-[12px] opacity-70">{draft.email || "—"}</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setEditingField(
                          editingField?.parentId === p.id && editingField.field === "email"
                            ? null
                            : { parentId: p.id, field: "email" },
                        )
                      }
                    >
                      <PencilIcon />
                    </button>
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-center justify-between pt-2">
                    {editingField?.parentId === p.id && editingField.field === "phone" ? (
                      <input
                        type="tel"
                        value={draft.phone}
                        onChange={(e) => updateDraft(p.id, "phone", e.target.value)}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                        className="flex-1 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[12px] outline-none"
                      />
                    ) : (
                      <span className="text-[12px] opacity-70">{draft.phone || "—"}</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setEditingField(
                          editingField?.parentId === p.id && editingField.field === "phone"
                            ? null
                            : { parentId: p.id, field: "phone" },
                        )
                      }
                    >
                      <PencilIcon />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        {success && (
          <p className="mt-3 text-center text-[12px] text-green-600 font-medium">
            ✓ Modifications sauvegardées !
          </p>
        )}
        {serverError && (
          <p className="mt-3 text-center text-[12px] text-red-500 font-medium">{serverError}</p>
        )}

        {/* Annuler / Sauvegarder parents */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleCancelParents}
            className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSaveParents}
            disabled={saving}
            className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>

        {/* Enfants liés */}
        {linkedChildren.length > 0 && (
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold">Enfants liés</p>
              <button
                type="button"
                onClick={() => setShowAddChildModal(true)}
                className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-2 py-1 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
              >
                + Ajouter un enfant
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {[...(child ? [child] : []), ...extraChildren].map((c) => (
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
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] opacity-70">
                          {getAge(String(c.birthDate))}
                        </span>
                        {c.group && (
                          <span
                            className="rounded-full border-2 border-white px-2 py-0.5 text-[11px] font-medium shadow-md whitespace-nowrap"
                            style={{ backgroundColor: `var(--color-group${c.group.id})` }}
                          >
                            {c.group.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/children/${c.id}/edit`)}
                  >
                    <PencilIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Annuler / Sauvegarder enfants */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/parentsHistory")}
                className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
              >
                Annuler
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
              >
                Sauvegarder
              </button>
            </div>

            {/* Archiver */}
            <button
              type="button"
              className="mt-3 w-full rounded-xl border-2 border-(--color-primary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
            >
              Archiver
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
