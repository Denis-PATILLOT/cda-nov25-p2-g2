import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AddChildModal from "@/components/admin/AddChildModal";
import AddParentModal from "@/components/admin/AddParentModal";
import EditableRow from "@/components/admin/EditableRow";
import PencilIcon from "@/components/admin/PencilIcon";
import TrashIcon from "@/components/admin/TrashIcon";
import Layout from "@/components/Layout";
import {
  useAdminUpdateUserMutation,
  useAllParentsQuery,
  useLinkParentToChildMutation,
} from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { getAge } from "@/utils/getAge";

type FormValues = { first_name: string; last_name: string; email: string; phone: string };
type EditingField = "name" | "email" | "phone" | null;

export default function EditParentPage() {
  const router = useRouter();
  const { id } = router.query;
  const parentIdNum = Number(id);

  const { user, authLoading, isAdmin } = useAdminGuard();

  const { data: allParentsData, refetch: refetchParents } = useAllParentsQuery({
    fetchPolicy: "network-only",
    skip: !parentIdNum || Number.isNaN(parentIdNum),
  });

  const [updateUser, { loading: saving }] = useAdminUpdateUserMutation();
  const [unlinkChild] = useLinkParentToChildMutation();

  const { register, handleSubmit, reset, watch } = useForm<FormValues>();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [success, setSuccess] = useState(false);
  const [unlinkSuccess, setUnlinkSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [confirmUnlink, setConfirmUnlink] = useState<{
    childId: number;
    name: string;
    parentIds: number[];
  } | null>(null);

  const parent = (allParentsData?.allParents ?? []).find((p) => p.id === parentIdNum);

  useEffect(() => {
    if (parent) {
      reset({
        first_name: parent.first_name,
        last_name: parent.last_name,
        email: parent.email ?? "",
        phone: parent.phone ?? "",
      });
    }
  }, [parent?.id, reset]);

  function toggleField(field: EditingField) {
    setEditingField((prev) => (prev === field ? null : field));
  }

  function handleCancel() {
    if (!parent) return;
    reset({
      first_name: parent.first_name,
      last_name: parent.last_name,
      email: parent.email ?? "",
      phone: parent.phone ?? "",
    });
    setEditingField(null);
  }

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      await updateUser({
        variables: {
          data: {
            id: parentIdNum,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email || null,
            phone: values.phone || null,
          },
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setServerError("Erreur lors de la sauvegarde.");
    }
  };

  async function handleUnlinkChild(childId: number, currentParentIds: number[]) {
    const newParents = currentParentIds.filter((pid) => pid !== parentIdNum);
    await unlinkChild({
      variables: { id: childId, data: { parents: newParents.map((pid) => ({ id: pid })) } },
      refetchQueries: ["AllParents"],
    });
  }

  if (authLoading) return null;
  if (!user || !isAdmin) return null;

  const linkedChildren = parent?.children ?? [];
  const firstNameVal = watch("first_name");
  const lastNameVal = watch("last_name");
  const emailVal = watch("email");
  const phoneVal = watch("phone");

  return (
    <Layout pageTitle="Modifier fiche parents - Admin">
      {/* Modal confirmation déliaison */}
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
              <TrashIcon />
            </div>
            {unlinkSuccess ? (
              <p className="text-[14px] font-semibold text-green-600">
                ✓ Enfant délié avec succès !
              </p>
            ) : (
              <div className="text-center">
                <p className="text-[15px] font-semibold">Délier l'enfant</p>
                <p className="text-[15px] font-semibold">{confirmUnlink.name} ?</p>
                <p className="mt-1 text-[12px] opacity-60">
                  L'enfant ne sera plus associé à ce parent.
                </p>
              </div>
            )}
            {!unlinkSuccess && (
              <div className="flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmUnlink(null)}
                  className="flex-1 cursor-pointer rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleUnlinkChild(confirmUnlink.childId, confirmUnlink.parentIds);
                    setUnlinkSuccess(true);
                    setTimeout(() => {
                      setUnlinkSuccess(false);
                      setConfirmUnlink(null);
                    }, 2000);
                  }}
                  className="flex-1 rounded-xl cursor-pointer border-2 border-red-200 bg-white py-2 text-[13px] text-red-500 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
                >
                  Délier
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AddParentModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          refetchParents();
        }}
      />
      <AddChildModal
        open={showAddChildModal}
        parentIds={[parentIdNum]}
        showLinkTab
        onClose={() => {
          setShowAddChildModal(false);
          refetchParents();
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-10 md:max-w-none md:px-16 lg:px-24">
          {/* Header */}
          <div className="flex items-center justify-between md:mt-20">
            <button
              type="button"
              onClick={() => router.push("/admin/parentsHistory")}
              className="p-0"
            >
              <div className="h-10 w-10 cursor-pointer overflow-hidden flex items-center justify-center md:h-20 md:w-20">
                <img
                  src="/admin/flechegauche.png"
                  alt="Retour"
                  className="h-16 w-16 md:h-28 md:w-28"
                />
              </div>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="rounded-2xl cursor-pointer bg-white/80 border-2 border-(--color-secondary) px-2 py-1 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 md:px-6 md:py-3 md:text-[17px] md:rounded-3xl"
            >
              + Ajouter un parent
            </button>
          </div>

          {/* Carte parent */}
          {parent && (
            <div className="mt-4 rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-md flex items-center gap-3 md:mt-6 md:px-6 md:py-5 md:rounded-3xl md:gap-6">
              <img
                src={parent.avatar ?? "/admin/parentavatar.png"}
                alt={`${parent.first_name} ${parent.last_name}`}
                className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0 md:h-24 md:w-24"
              />
              <div className="flex-1 min-w-0">
                {/* Nom */}
                <EditableRow onToggle={() => toggleField("name")} borderBottom>
                  {editingField === "name" ? (
                    <div className="flex gap-1 flex-1">
                      <input
                        {...register("first_name")}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                        className="w-24 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[13px] outline-none"
                      />
                      <input
                        {...register("last_name")}
                        onBlur={() => setEditingField(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                        className="w-24 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[13px] outline-none"
                      />
                    </div>
                  ) : (
                    <span className="text-[14px] font-semibold md:text-[20px]">
                      {firstNameVal || parent.first_name} {lastNameVal || parent.last_name}
                    </span>
                  )}
                </EditableRow>

                {/* Email */}
                <EditableRow onToggle={() => toggleField("email")} borderBottom>
                  {editingField === "email" ? (
                    <input
                      type="email"
                      {...register("email")}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="flex-1 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[12px] outline-none"
                    />
                  ) : (
                    <span className="text-[12px] opacity-70 md:text-[16px]">{emailVal || "—"}</span>
                  )}
                </EditableRow>

                {/* Téléphone */}
                <EditableRow onToggle={() => toggleField("phone")}>
                  {editingField === "phone" ? (
                    <input
                      type="tel"
                      {...register("phone")}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                      className="flex-1 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[12px] outline-none"
                    />
                  ) : (
                    <span className="text-[12px] opacity-70 md:text-[16px]">{phoneVal || "—"}</span>
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
          <div className="mt-4 flex gap-3 md:mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-xl cursor-pointer border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 md:text-[17px] md:py-3 md:rounded-2xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl cursor-pointer border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 disabled:opacity-50 md:text-[17px] md:py-3 md:rounded-2xl"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>

          {/* Enfants liés */}
          <div className="mt-7 md:mt-10">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold md:text-[20px]">Enfants liés</p>
              <button
                type="button"
                onClick={() => setShowAddChildModal(true)}
                className="rounded-2xl cursor-pointer bg-white/80 border-2 border-(--color-secondary) px-2 py-1 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 md:px-6 md:py-3 md:text-[17px] md:rounded-3xl"
              >
                + Ajouter un enfant
              </button>
            </div>

            {linkedChildren.length > 0 && (
              <div className="mt-3 flex flex-col gap-3">
                {linkedChildren.map((c) => (
                  <div
                    key={c.id}
                    className="relative flex items-center justify-between rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md md:px-6 md:py-5 md:rounded-3xl"
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
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] opacity-70 md:text-[15px]">
                            {getAge(String(c.birthDate))}
                          </span>
                          {c.group && (
                            <span
                              className="rounded-full border-2 border-white px-2 py-0.5 text-[11px] font-medium shadow-md whitespace-nowrap md:text-[14px] md:px-4 md:py-1"
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
                        className="cursor-pointer"
                        onClick={() => router.push(`/admin/children/${c.id}/edit`)}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmUnlink({
                            childId: c.id,
                            name: `${c.firstName} ${c.lastName}`,
                            parentIds: c.parents.map((p) => p.id),
                          })
                        }
                        className="opacity-40 hover:opacity-80 cursor-pointer transition-opacity"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
}
