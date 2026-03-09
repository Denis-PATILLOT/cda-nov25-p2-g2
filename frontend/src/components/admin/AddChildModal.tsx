import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAllGroupsQuery,
  useCreateChildMutation,
  useAllChildrenQuery,
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

export default function AddChildModal({ open, onClose, parentIds = [], onSuccess, showLinkTab = false }: Props) {
  const [tab, setTab] = useState<"create" | "link">("create");

  // --- Onglet Créer ---
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

  // --- Onglet Lier ---
  const { data: allChildrenData } = useAllChildrenQuery({ fetchPolicy: "network-only", skip: !open });
  const [linkParent] = useLinkParentToChildMutation();
  const [linkSearch, setLinkSearch] = useState("");
  const [linkSuccess, setLinkSuccess] = useState<number | null>(null);
  const [linkError, setLinkError] = useState("");

  const currentParentId = parentIds[0];

  const availableChildren = (allChildrenData?.children ?? []).filter((c) => {
    const alreadyLinked = (c.parents ?? []).some((p) => p.id === currentParentId);
    if (alreadyLinked) return false;
    if (!linkSearch.trim()) return true;
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(linkSearch.trim().toLowerCase());
  });

  async function handleLinkChild(child: { id: number; parents: { id: number }[] }) {
    setLinkError("");
    try {
      const newParents = [...(child.parents ?? []).map((p) => ({ id: p.id })), { id: currentParentId }];
      await linkParent({
        variables: { id: child.id, data: { parents: newParents } },
        refetchQueries: ["AllParents", "AllChildren"],
      });
      setLinkSuccess(child.id);
      setTimeout(() => {
        setLinkSuccess(null);
        onClose();
      }, 1500);
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
    setLinkSearch("");
    setLinkSuccess(null);
    setLinkError("");
    setTab("create");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-label="Fermer la modal"
      />

      <div className="relative w-full max-w-[400px] rounded-3xl bg-[#FEF9F6] border-2 border-(--color-secondary) p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-10">
          <Image
            src="/boutons/plus.png"
            alt="Ajouter"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h2 className="text-[16px] font-semibold">Ajouter un enfant</h2>
        </div>

        {/* Onglets */}
        {showLinkTab && <div className="mt-3 flex rounded-xl border-2 border-(--color-primary) overflow-hidden">
          <button
            type="button"
            onClick={() => setTab("create")}
            className={`flex-1 py-1.5 text-[12px] font-medium transition-colors ${tab === "create" ? "bg-(--color-primary) text-white" : "bg-white text-gray-500 hover:bg-orange-50"}`}
          >
            Créer un enfant
          </button>
          <button
            type="button"
            onClick={() => setTab("link")}
            className={`flex-1 py-1.5 text-[12px] font-medium transition-colors ${tab === "link" ? "bg-(--color-primary) text-white" : "bg-white text-gray-500 hover:bg-orange-50"}`}
          >
            Enfant existant
          </button>
        </div>}

        {/* Onglet Créer */}
        {tab === "create" && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-4">
            <p className="text-[13px] font-medium">Informations</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-[12px] font-medium">
                  Prénom*
                </label>
                <input
                  id="firstName"
                  {...register("firstName", { required: "Champ requis" })}
                  className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none ${errors.firstName ? "border-red-400" : "border-(--color-primary)"}`}
                />
                {errors.firstName && (
                  <p className="text-[11px] text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="lastName" className="text-[12px] font-medium">
                  Nom*
                </label>
                <input
                  id="lastName"
                  {...register("lastName", { required: "Champ requis" })}
                  className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none ${errors.lastName ? "border-red-400" : "border-(--color-primary)"}`}
                />
                {errors.lastName && (
                  <p className="text-[11px] text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="birthDate" className="text-[12px] font-medium">
                Date de naissance*
              </label>
              <input
                id="birthDate"
                type="date"
                {...register("birthDate", { required: "Champ requis" })}
                className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none ${errors.birthDate ? "border-red-400" : "border-(--color-primary)"} ${!birthDateValue ? "text-gray-400" : "text-gray-900"}`}
              />
              {errors.birthDate && (
                <p className="text-[11px] text-red-500">{errors.birthDate.message}</p>
              )}
            </div>

            <div>
              <p className="text-[13px] font-medium mb-1">Groupe*</p>
              <button
                type="button"
                onClick={() => setGroupDropdownOpen((prev) => !prev)}
                className={`w-full rounded-xl border-2 bg-white px-3 py-1.5 text-[12px] text-left outline-none flex justify-between items-center ${groupError ? "border-red-400" : "border-(--color-primary)"}`}
              >
                <span className="text-gray-400">
                  {selectedGroupId ? "1 groupe sélectionné" : "Sélectionner un groupe"}
                </span>
                <span className={`transition-transform duration-200 text-gray-400 ${groupDropdownOpen ? "rotate-180" : ""}`}>
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
                      className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 last:border-0 hover:bg-orange-50 ${selectedGroupId === Number(g.id) ? "font-semibold" : ""}`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}

              {selectedGroupId && (
                <div className="mt-2">
                  <span className="flex items-center gap-1 rounded-full bg-white border border-(--color-secondary) px-2 py-0.5 text-[11px] w-fit">
                    {groupsData?.getAllGroups.find((g) => Number(g.id) === selectedGroupId)?.name}
                    <button type="button" onClick={() => setSelectedGroupId(null)} className="hover:opacity-60">
                      ×
                    </button>
                  </span>
                </div>
              )}

              {groupError && <p className="text-[11px] text-red-500">Champ requis</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="healthRecord" className="text-[12px] font-medium">
                Dossier de santé <span className="text-gray-400">(allergies, notes...)</span>
              </label>
              <textarea
                id="healthRecord"
                {...register("healthRecord")}
                rows={3}
                className="w-full rounded-xl border-2 border-(--color-primary) bg-white px-2 py-1 text-[13px] outline-none resize-none"
                placeholder="Ex: allergie aux arachides, asthme..."
              />
            </div>

            {success && (
              <p className="text-center text-[12px] text-green-600 font-medium py-1">
                ✓ Enfant créé avec succès !
              </p>
            )}
            {serverError && (
              <p className="text-center text-[12px] text-red-500 font-medium py-1">{serverError}</p>
            )}

            <div className="mt-2 flex justify-between gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-1 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-1 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isSubmitting ? "Création..." : "Créer enfant"}
              </button>
            </div>
          </form>
        )}

        {/* Onglet Lier existant */}
        {tab === "link" && (
          <div className="mt-3 flex flex-col gap-3">
            <input
              value={linkSearch}
              onChange={(e) => setLinkSearch(e.target.value)}
              placeholder="Rechercher un enfant..."
              className="w-full rounded-xl border-2 border-(--color-primary) bg-white px-3 py-1.5 text-[13px] outline-none"
            />

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {availableChildren.length === 0 && (
                <p className="text-center text-[12px] opacity-50 py-4">Aucun enfant disponible.</p>
              )}
              {availableChildren.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between rounded-xl border-2 border-(--color-secondary) bg-white px-3 py-2"
                >
                  <span className="text-[13px] font-medium">
                    {child.firstName} {child.lastName}
                  </span>
                  {linkSuccess === child.id ? (
                    <span className="text-[12px] text-green-600 font-medium">✓ Lié !</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleLinkChild(child)}
                      className="rounded-lg border-2 border-(--color-primary) bg-white px-2 py-0.5 text-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
                    >
                      Lier
                    </button>
                  )}
                </div>
              ))}
            </div>

            {linkError && (
              <p className="text-center text-[12px] text-red-500 font-medium">{linkError}</p>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="mt-1 w-full rounded-xl border-2 border-(--color-tertiary) bg-white py-1.5 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
