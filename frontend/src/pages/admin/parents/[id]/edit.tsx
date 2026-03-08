import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddChildModal from "@/components/admin/AddChildModal";
import AddParentModal from "@/components/admin/AddParentModal";
import Layout from "@/components/Layout";
import {
  useAdminChildDetailQuery,
  useAllParentsQuery,
  useAdminUpdateUserMutation,
  useLinkParentToChildMutation,
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
  const { id, childId } = router.query;
  const parentIdNum = Number(id);
  const childIdNum = Number(childId);

  const { user, loading: authLoading, isAdmin } = useAuth();

  const { data, loading, refetch } = useAdminChildDetailQuery({
    variables: { id: childIdNum },
    skip: !childIdNum || Number.isNaN(childIdNum),
    fetchPolicy: "network-only",
  });

  const { data: allParentsData, refetch: refetchParents } = useAllParentsQuery({ fetchPolicy: "network-only", skip: !parentIdNum });

  const [updateUser, { loading: saving }] = useAdminUpdateUserMutation();
  const [unlinkParent] = useLinkParentToChildMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [draft, setDraft] = useState<ParentDraft | null>(null);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [confirmUnlink, setConfirmUnlink] = useState<{ childId: number; name: string; parentIds: number[] } | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.replace("/403");
  }, [authLoading, user, isAdmin, router]);

  useEffect(() => {
    const p =
      (allParentsData?.allParents ?? []).find((p) => p.id === parentIdNum) ??
      data?.child?.parents?.find((p) => p.id === parentIdNum);
    if (p && parentIdNum) {
      setDraft({
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email ?? "",
        phone: p.phone ?? "",
      });
    }
  }, [allParentsData, data, parentIdNum]);

  function updateDraftField(field: keyof ParentDraft, value: string) {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSave() {
    if (!draft) return;
    setServerError("");
    try {
      await updateUser({
        variables: {
          data: {
            id: parentIdNum,
            first_name: draft.first_name,
            last_name: draft.last_name,
            email: draft.email || null,
            phone: draft.phone || null,
          },
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setServerError("Erreur lors de la sauvegarde.");
    }
  }

  async function handleUnlinkChild(childId: number, currentParentIds: number[]) {
    const newParents = currentParentIds.filter((pid) => pid !== parentIdNum);
    await unlinkParent({
      variables: { id: childId, data: { parents: newParents.map((pid) => ({ id: pid })) } },
      refetchQueries: ["AllParents"],
    });
  }

  function handleCancel() {
    const p =
      (allParentsData?.allParents ?? []).find((p) => p.id === parentIdNum) ??
      data?.child?.parents?.find((p) => p.id === parentIdNum);
    if (p) {
      setDraft({
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email ?? "",
        phone: p.phone ?? "",
      });
      setEditingField(null);
    }
  }

  if (authLoading || loading) return null;
  if (!user || !isAdmin) return null;

  // Parent trouvé directement depuis allParents (inclut les parents sans enfants)
  const parentFromQuery = (allParentsData?.allParents ?? []).find((p) => p.id === parentIdNum);
  const parent = parentFromQuery ?? data?.child?.parents?.find((p) => p.id === parentIdNum);
  const linkedChildren = parentFromQuery?.children ?? [];

  return (
    <Layout pageTitle="Modifier fiche parents - Admin">
      {confirmUnlink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setConfirmUnlink(null)}
            aria-label="Fermer"
          />
          <div className="relative w-full max-w-[340px] rounded-3xl bg-[#FEF9F6] border-2 border-(--color-primary) p-6 shadow-xl flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 border-2 border-red-200">
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold">Délier l'enfant</p>
              <p className="text-[15px] font-semibold">{confirmUnlink.name} ?</p>
              <p className="mt-1 text-[12px] opacity-60">L'enfant ne sera plus associé à ce parent.</p>
            </div>
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => setConfirmUnlink(null)}
                className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleUnlinkChild(confirmUnlink.childId, confirmUnlink.parentIds);
                  setConfirmUnlink(null);
                }}
                className="flex-1 rounded-xl border-2 border-red-200 bg-white py-2 text-[13px] text-red-500 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
              >
                Délier
              </button>
            </div>
          </div>
        </div>
      )}

      <AddParentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          refetch();
        }}
      />
      <AddChildModal
        open={showAddChildModal}
        parentIds={[parentIdNum]}
        onClose={() => {
          setShowAddChildModal(false);
          refetchParents();
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

        {/* Carte parent */}
        {parent && draft && (
          <div className="mt-4 rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-md flex items-center gap-3">
            {/* Avatar gauche */}
            <img
              src={parent.avatar ?? "/admin/parentavatar.png"}
              alt={`${parent.first_name} ${parent.last_name}`}
              className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0"
            />

            {/* Infos droite */}
            <div className="flex-1 min-w-0">
              {/* Nom */}
              <div
                className="flex items-center justify-between pb-2"
                style={{ borderBottom: "1px solid var(--color-primary)" }}
              >
                {editingField?.parentId === parentIdNum && editingField.field === "name" ? (
                  <div className="flex gap-1 flex-1">
                    <input
                      value={draft.first_name}
                      onChange={(e) => updateDraftField("first_name", e.target.value)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="w-24 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[13px] outline-none"
                    />
                    <input
                      value={draft.last_name}
                      onChange={(e) => updateDraftField("last_name", e.target.value)}
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
                      editingField?.parentId === parentIdNum && editingField.field === "name"
                        ? null
                        : { parentId: parentIdNum, field: "name" },
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
                {editingField?.parentId === parentIdNum && editingField.field === "email" ? (
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) => updateDraftField("email", e.target.value)}
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
                      editingField?.parentId === parentIdNum && editingField.field === "email"
                        ? null
                        : { parentId: parentIdNum, field: "email" },
                    )
                  }
                >
                  <PencilIcon />
                </button>
              </div>

              {/* Téléphone */}
              <div className="flex items-center justify-between pt-2">
                {editingField?.parentId === parentIdNum && editingField.field === "phone" ? (
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(e) => updateDraftField("phone", e.target.value)}
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
                      editingField?.parentId === parentIdNum && editingField.field === "phone"
                        ? null
                        : { parentId: parentIdNum, field: "phone" },
                    )
                  }
                >
                  <PencilIcon />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        {success && (
          <p className="mt-3 text-center text-[12px] text-green-600 font-medium">
            ✓ Modifications sauvegardées !
          </p>
        )}
        {serverError && (
          <p className="mt-3 text-center text-[12px] text-red-500 font-medium">{serverError}</p>
        )}

        {/* Annuler / Sauvegarder */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>

        {/* Enfants liés */}
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

          {linkedChildren.length > 0 && (
            <div className="mt-3 flex flex-col gap-3">
              {linkedChildren.map((c) => (
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
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/children/${c.id}/edit`)}
                    >
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmUnlink({ childId: c.id, name: `${c.firstName} ${c.lastName}`, parentIds: c.parents.map((p) => p.id) })}
                      className="opacity-40 hover:opacity-80 transition-opacity"
                    >
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <title>Délier</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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
      </div>
    </Layout>
  );
}
