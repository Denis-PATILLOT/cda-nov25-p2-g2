import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddStaffModal from "@/components/admin/AddStaffModal";
import EditableRow from "@/components/admin/EditableRow";
import PencilIcon from "@/components/admin/PencilIcon";
import Layout from "@/components/Layout";
import {
  useAdminChildrenQuery,
  useAdminUpdateUserMutation,
  useAllGroupsQuery,
  useAllStaffQuery,
} from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { getAge } from "@/utils/getAge";
import { getGroupBg } from "@/utils/getGroupBg";

type StaffDraft = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  group_id: number | null;
};

type EditingField = "name" | "email" | "phone" | "group" | null;

export default function EditStaffPage() {
  const router = useRouter();
  const { id } = router.query;
  const staffIdNum = Number(id);

  const { user, authLoading, isAdmin } = useAdminGuard();

  const { data: allStaffData, refetch: refetchStaff } = useAllStaffQuery({
    fetchPolicy: "network-only",
    skip: !staffIdNum || Number.isNaN(staffIdNum),
  });

  const { data: childrenData } = useAdminChildrenQuery({
    fetchPolicy: "network-only",
    skip: !staffIdNum || Number.isNaN(staffIdNum),
  });

  const { data: groupsData } = useAllGroupsQuery();

  const [updateUser, { loading: saving }] = useAdminUpdateUserMutation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [draft, setDraft] = useState<StaffDraft | null>(null);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const staffMember = (allStaffData?.allStaff ?? []).find((s) => s.id === staffIdNum);

  useEffect(() => {
    if (staffMember) {
      setDraft({
        first_name: staffMember.first_name,
        last_name: staffMember.last_name,
        email: staffMember.email ?? "",
        phone: staffMember.phone ?? "",
        group_id: staffMember.group ? Number(staffMember.group.id) : null,
      });
    }
  }, [staffMember?.id]);

  function updateDraftField(field: keyof StaffDraft, value: string | number | null) {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function toggleField(field: EditingField) {
    setEditingField((prev) => (prev === field ? null : field));
    if (field !== "group") setGroupDropdownOpen(false);
  }

  function handleCancel() {
    if (!staffMember) return;
    setDraft({
      first_name: staffMember.first_name,
      last_name: staffMember.last_name,
      email: staffMember.email ?? "",
      phone: staffMember.phone ?? "",
      group_id: staffMember.group ? Number(staffMember.group.id) : null,
    });
    setEditingField(null);
    setGroupDropdownOpen(false);
  }

  async function handleSave() {
    if (!draft) return;
    setServerError("");
    try {
      await updateUser({
        variables: {
          data: {
            id: staffIdNum,
            first_name: draft.first_name,
            last_name: draft.last_name,
            email: draft.email || null,
            phone: draft.phone || null,
            group_id: draft.group_id,
          },
        },
        refetchQueries: ["AllStaff"],
      });
      setSuccess(true);
      setEditingField(null);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setServerError("Erreur lors de la sauvegarde.");
    }
  }

  if (authLoading) return null;
  if (!user || !isAdmin) return null;

  const groupChildren = (childrenData?.children ?? []).filter(
    (c) => draft?.group_id && String(c.group?.id) === String(draft.group_id),
  );

  const selectedGroupName =
    groupsData?.getAllGroups.find((g) => Number(g.id) === draft?.group_id)?.name ?? null;

  return (
    <Layout pageTitle="Modifier fiche membre - Admin">
      <AddStaffModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          refetchStaff();
        }}
      />

      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/admin/staffHistory")}
            className="p-0"
          >
            <div className="h-10 w-10 overflow-hidden flex items-center justify-center">
              <img src="/admin/flechegauche.png" alt="Retour" className="h-16 w-16" />
            </div>
          </button>
          <h1 className="text-[16px] font-semibold">Membre du staff</h1>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-2 py-1 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            + Ajouter un membre
          </button>
        </div>

        {/* Carte staff */}
        {staffMember && draft && (
          <div className="mt-4 rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-md flex items-center gap-3">
            <img
              src={staffMember.avatar ?? "/admin/parentavatar.png"}
              alt={`${staffMember.first_name} ${staffMember.last_name}`}
              className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0"
            />

            <div className="flex-1 min-w-0">
              {/* Nom */}
              <EditableRow onToggle={() => toggleField("name")} borderBottom>
                {editingField === "name" ? (
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
              </EditableRow>

              {/* Email */}
              <EditableRow onToggle={() => toggleField("email")} borderBottom>
                {editingField === "email" ? (
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
              </EditableRow>

              {/* Téléphone */}
              <EditableRow onToggle={() => toggleField("phone")} borderBottom>
                {editingField === "phone" ? (
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
              </EditableRow>

              {/* Groupe */}
              <EditableRow onToggle={() => toggleField("group")}>
                {editingField === "group" ? (
                  <div className="flex-1 relative">
                    <button
                      type="button"
                      onClick={() => setGroupDropdownOpen((prev) => !prev)}
                      className="w-full rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[12px] text-left outline-none flex justify-between items-center bg-white"
                    >
                      <span>{selectedGroupName ?? "Sélectionner un groupe"}</span>
                      <span className={`text-gray-400 transition-transform duration-200 ${groupDropdownOpen ? "rotate-180" : ""}`}>▾</span>
                    </button>
                    {groupDropdownOpen && (
                      <div className="absolute left-0 top-8 z-20 rounded-xl border-2 border-(--color-primary) bg-white overflow-hidden shadow-lg w-full">
                        {groupsData?.getAllGroups.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              updateDraftField("group_id", Number(g.id));
                              setGroupDropdownOpen(false);
                              setEditingField(null);
                            }}
                            className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 last:border-0 hover:bg-orange-50 ${draft.group_id === Number(g.id) ? "font-semibold" : ""}`}
                          >
                            {g.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  draft.group_id && selectedGroupName ? (
                    <span
                      className="rounded-full border-2 border-white px-2 py-0.5 text-[11px] font-medium shadow-md"
                      style={{ backgroundColor: getGroupBg(String(draft.group_id)) }}
                    >
                      {selectedGroupName}
                    </span>
                  ) : (
                    <span className="text-[12px] opacity-70">—</span>
                  )
                )}
              </EditableRow>
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

        {/* Enfants du groupe */}
        <div className="mt-7">
          <p className="text-[13px] font-semibold">Enfants du groupe</p>

          {groupChildren.length === 0 && (
            <div className="mt-3 rounded-2xl bg-white/80 border-2 border-(--color-secondary) p-4 text-[13px] text-center opacity-70">
              Aucun enfant dans ce groupe.
            </div>
          )}

          {groupChildren.length > 0 && (
            <div className="mt-3 flex flex-col gap-3">
              {groupChildren.map((c) => (
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
                            style={{ backgroundColor: getGroupBg(String(c.group.id)) }}
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
          )}

        </div>
      </div>
    </Layout>
  );
}
