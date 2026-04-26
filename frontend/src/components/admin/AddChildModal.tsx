import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAllChildrenQuery,
  useAllGroupsQuery,
  useCreateChildMutation,
  useLinkParentToChildMutation,
} from "@/graphql/generated/schema";

type CreatedChild = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  picture: string;
  group: { id: string; name: string };
};

type Props = {
  open: boolean;
  onClose: () => void;
  parentIds?: number[];
  onSuccess?: (child: CreatedChild) => void;
  showLinkTab?: boolean;
};

type FormValues = {
  firstName: string;
  lastName: string;
  birthDate: string;
  healthRecord?: string;
};

const DEFAULT_PICTURE = "https://placehold.co/100x100/png";

export default function AddChildModal({
  open,
  onClose,
  parentIds = [],
  onSuccess,
  showLinkTab = false,
}: Props) {
  const [tab, setTab] = useState<"create" | "link">("create");

  // onglet créer
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const birthDateValue = watch("birthDate");

  const [createChild] = useCreateChildMutation();
  const { data: groupsData } = useAllGroupsQuery();

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groupError, setGroupError] = useState(false);

  const onSubmit = async (values: FormValues) => {
    if (!selectedGroupId) {
      setGroupError(true);
      return;
    }
    setGroupError(false);
    setServerError("");
    let result;
    try {
      result = await createChild({
        variables: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            birthDate: new Date(values.birthDate),
            group: { id: selectedGroupId },
            healthRecord: values.healthRecord || null,
            picture: DEFAULT_PICTURE,
            parents: parentIds.map((id) => ({ id })),
          },
        },
        refetchQueries: ["AdminCounts", "AllChildren", "AdminChildren", "AllParents"],
      });
    } catch {
      setServerError("Une erreur est survenue. Vérifiez les informations.");
      return;
    }

    if (result.data?.createChild) {
      onSuccess?.(result.data.createChild as CreatedChild);
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedGroupId(null);
      setGroupDropdownOpen(false);
      setGroupError(false);
      setServerError("");
      reset();
      onClose();
    }, 2000);
  };

  // onglet lier existant
  const { data: allChildrenData } = useAllChildrenQuery({
    fetchPolicy: "network-only",
    skip: !open,
  });
  const [linkParent] = useLinkParentToChildMutation();
  const [linkSuccess, setLinkSuccess] = useState<number | null>(null);
  const [linkError, setLinkError] = useState("");

  const currentParentId = parentIds[0];

  const availableChildren = (allChildrenData?.children ?? []).filter((c) => {
    return !(c.parents ?? []).some((p) => p.id === currentParentId);
  });

  async function handleLinkChild(child: { id: number; parents: { id: number }[] }) {
    setLinkError("");
    if (!currentParentId || Number.isNaN(currentParentId)) {
      setLinkError("Erreur : parent non identifié.");
      return;
    }
    try {
      const newParents = [
        ...(child.parents ?? []).map((p) => ({ id: p.id })),
        { id: currentParentId },
      ];
      await linkParent({
        variables: { id: child.id, data: { parents: newParents } },
      });
      setLinkSuccess(child.id);
      setTimeout(() => {
        setLinkSuccess(null);
        onClose();
      }, 2000);
    } catch {
      setLinkError("Erreur lors de la liaison.");
    }
  }

  function handleClose() {
    reset();
    setServerError("");
    setSelectedGroupId(null);
    setGroupDropdownOpen(false);
    setGroupError(false);
    setLinkSuccess(null);
    setLinkError("");
    setTab("create");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto">
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-label="Fermer la modal"
      />

      <div className="relative w-full max-w-[400px] rounded-3xl bg-[#FEF9F6] border-2 border-(--color-secondary) p-5 shadow-xl my-auto md:max-w-[560px] md:p-8">
        {/* Header */}
        <div className="flex items-center gap-10">
          <div className="relative shrink-0 w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden">
            <Image src="/boutons/plus.webp" alt="Ajouter" fill className="object-cover" />
          </div>
          <h2 className="text-[16px] font-semibold md:text-[22px]">Ajouter un enfant</h2>
        </div>

        {/* Onglets */}
        {showLinkTab && (
          <div className="mt-3 flex rounded-xl border-2 border-(--color-primary) overflow-hidden">
            <button
              type="button"
              onClick={() => setTab("create")}
              className={`flex-1 py-1.5 text-[12px] font-medium transition-colors md:text-[15px] md:py-2.5 ${tab === "create" ? "bg-(--color-primary) text-white" : "bg-white text-gray-500 hover:bg-orange-50"}`}
            >
              Créer un enfant
            </button>
            <button
              type="button"
              onClick={() => setTab("link")}
              className={`flex-1 py-1.5 text-[12px] font-medium transition-colors md:text-[15px] md:py-2.5 ${tab === "link" ? "bg-(--color-primary) text-white" : "bg-white text-gray-500 hover:bg-orange-50"}`}
            >
              Enfant existant
            </button>
          </div>
        )}

        {/* Onglet Créer */}
        {tab === "create" && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
            <p className="text-[13px] font-medium md:text-[16px]">Informations</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-[12px] font-medium md:text-[14px]">
                  Prénom*
                </label>
                <input
                  id="firstName"
                  {...register("firstName", { required: "Champ requis" })}
                  className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none md:text-[15px] md:py-2 md:px-3 ${errors.firstName ? "border-red-400" : "border-(--color-primary)"}`}
                />
                {errors.firstName && (
                  <p className="text-[11px] text-red-500 md:text-[13px]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="lastName" className="text-[12px] font-medium md:text-[14px]">
                  Nom*
                </label>
                <input
                  id="lastName"
                  {...register("lastName", { required: "Champ requis" })}
                  className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none md:text-[15px] md:py-2 md:px-3 ${errors.lastName ? "border-red-400" : "border-(--color-primary)"}`}
                />
                {errors.lastName && (
                  <p className="text-[11px] text-red-500 md:text-[13px]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="birthDate" className="text-[12px] font-medium md:text-[14px]">
                Date de naissance*
              </label>
              <input
                id="birthDate"
                type="date"
                {...register("birthDate", { required: "Champ requis" })}
                className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none md:text-[15px] md:py-2 md:px-3 ${errors.birthDate ? "border-red-400" : "border-(--color-primary)"} ${!birthDateValue ? "text-gray-400" : "text-gray-900"}`}
              />
              {errors.birthDate && (
                <p className="text-[11px] text-red-500 md:text-[13px]">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div>
              <p className="text-[13px] font-medium mb-1 md:text-[16px]">Groupe*</p>
              <button
                type="button"
                onClick={() => setGroupDropdownOpen((prev) => !prev)}
                className={`w-full rounded-xl border-2 bg-white px-3 py-1.5 text-[12px] text-left outline-none flex cursor-pointer justify-between items-center md:text-[15px] md:py-2 ${groupError ? "border-red-400" : "border-(--color-primary)"}`}
              >
                <span className="text-gray-400">
                  {selectedGroupId ? "1 groupe sélectionné" : "Sélectionner un groupe"}
                </span>
                <span
                  className={`transition-transform duration-200 text-gray-400 ${groupDropdownOpen ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>

              {groupDropdownOpen && (
                <div className="mt-1 rounded-xl border-2 border-(--color-primary) bg-white overflow-hidden">
                  {groupsData?.getAllGroups.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedGroupId(Number(g.id));
                        setGroupDropdownOpen(false);
                        setGroupError(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 last:border-0 hover:bg-orange-50 md:text-[15px] md:px-4 md:py-2.5 cursor-pointer ${selectedGroupId === Number(g.id) ? "font-semibold" : ""}`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}

              {selectedGroupId && (
                <div className="mt-2">
                  <span className="flex items-center gap-1 rounded-full bg-white border border-(--color-secondary) px-2 py-0.5 text-[11px] w-fit md:text-[13px] ">
                    {groupsData?.getAllGroups.find((g) => Number(g.id) === selectedGroupId)?.name}
                    <button
                      type="button"
                      onClick={() => setSelectedGroupId(null)}
                      className="hover:opacity-60"
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}

              {groupError && (
                <p className="text-[11px] text-red-500 md:text-[13px]">Champ requis</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="healthRecord" className="text-[12px] font-medium md:text-[14px]">
                Dossier de santé <span className="text-gray-400">(allergies, notes...)</span>
              </label>
              <textarea
                id="healthRecord"
                {...register("healthRecord")}
                rows={3}
                className="w-full rounded-xl border-2 border-(--color-primary) bg-white px-2 py-1 text-[13px] outline-none resize-none md:text-[15px] md:py-2 md:px-3"
                placeholder="Ex: allergie aux arachides, asthme..."
              />
            </div>

            {success && (
              <p className="text-center text-[12px] text-green-600 font-medium py-1 md:text-[14px]">
                ✓ Enfant créé avec succès !
              </p>
            )}
            {serverError && (
              <p className="text-center text-[12px] text-red-500 font-medium py-1 md:text-[14px]">
                {serverError}
              </p>
            )}

            <div className="mt-2 flex justify-between gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-1 text-[13px] shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.03] active:scale-95 md:text-[16px] md:py-2.5"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-1 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 md:text-[16px] md:py-2.5"
              >
                {isSubmitting ? "Création..." : "Créer enfant"}
              </button>
            </div>
          </form>
        )}

        {/* Onglet Lier existant */}
        {tab === "link" && (
          <div className="mt-3 flex flex-col gap-3">
            {linkSuccess !== null && (
              <p className="text-center text-[12px] text-green-600 font-medium py-1 md:text-[14px]">
                ✓ Enfant lié avec succès !
              </p>
            )}

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {availableChildren.length === 0 && linkSuccess === null && (
                <p className="text-center text-[12px] opacity-50 py-4 md:text-[15px]">
                  Aucun enfant disponible.
                </p>
              )}
              {availableChildren.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between rounded-xl border-2 border-(--color-primary) bg-white px-3 py-2"
                >
                  <span className="text-[13px] font-medium md:text-[16px]">
                    {child.firstName} {child.lastName}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLinkChild(child)}
                    className="rounded-lg border-2 border-(--color-secondary) bg-white px-2 py-0.5 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 md:text-[14px] md:px-3 md:py-1"
                  >
                    Lier
                  </button>
                </div>
              ))}
            </div>

            {linkError && (
              <p className="text-center text-[12px] text-red-500 font-medium md:text-[14px]">
                {linkError}
              </p>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="mt-1 w-full rounded-xl border-2 border-(--color-tertiary) bg-white py-1.5 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 md:text-[16px] md:py-2.5"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
