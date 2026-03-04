import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAllGroupsQuery, useCreateChildMutation } from "@/graphql/generated/schema";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  firstName: string;
  lastName: string;
  birthDate: string;
  healthRecord?: string;
};

const DEFAULT_PICTURE = "https://placehold.co/100x100/png"; // Pour l'instant on met une image par défaut, à remplacer par une vraie gestion d'upload plus tard

export default function AddChildModal({ open, onClose }: Props) {
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
    try {
      await createChild({
        variables: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            birthDate: new Date(values.birthDate),
            group: { id: selectedGroupId },
            healthRecord: values.healthRecord || null,
            picture: DEFAULT_PICTURE,
            parents: [],
          },
        },
        refetchQueries: ["AdminCounts", "AllChildren"], // Refetch pour mettre à jour les stats et la liste des enfants
      });
    } catch {
      setServerError("Une erreur est survenue. Vérifiez les informations.");
      return;
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={() => {
          reset();
          setServerError("");
          setSelectedGroupId(null);
          setGroupDropdownOpen(false);
          setGroupError(false);
          onClose();
        }}
        aria-label="Fermer la modal"
      />

      {/* Modal Card */}
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
          <p className="text-[13px] font-medium">Informations</p>

          {/* Prénom / Nom */}
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

          {/* Date de naissance */}
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

          {/* Groupe */}
          <div>
            <p className="text-[13px] font-medium mb-1">Groupe*</p>

            {/* Bouton */}
            <button
              type="button"
              onClick={() => setGroupDropdownOpen((prev) => !prev)}
              className={`w-full rounded-xl border-2 bg-white px-3 py-1.5 text-[12px] text-left outline-none flex justify-between items-center ${groupError ? "border-red-400" : "border-(--color-primary)"}`}
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

            {/* Accordéon */}
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

            {/* Tag groupe sélectionné */}
            {selectedGroupId && (
              <div className="mt-2">
                <span className="flex items-center gap-1 rounded-full bg-white border border-(--color-secondary) px-2 py-0.5 text-[11px] w-fit">
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

            {groupError && <p className="text-[11px] text-red-500">Champ requis</p>}
          </div>

          {/* Dossier de santé */}
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

          {/* Buttons */}
          <div className="mt-2 flex justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setServerError("");
                setSelectedGroupId(null);
                setGroupDropdownOpen(false);
                setGroupError(false);
                onClose();
              }}
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
      </div>
    </div>
  );
}
