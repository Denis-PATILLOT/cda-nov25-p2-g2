import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAllChildrenQuery,
  useCreateUserMutation,
  useLinkParentToChildMutation,
} from "@/graphql/generated/schema";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export default function AddParentModal({ open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const [createUser] = useCreateUserMutation();
  const [linkParentToChild] = useLinkParentToChildMutation();
  const { data: childrenData } = useAllChildrenQuery({ fetchPolicy: "network-only" });

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>([]);

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    // a faire : supprimer, quand le stysteme de mail sera en place
    const tempPassword = `${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}A1!`;
    //.replace(/-/g, "")="a3f8c2d19b4e4f7a8c2d1b3e5f7a9c2d"
    //.slice(0, 12)="a3f8c2d19b4e"(12 chars minuscules + chiffres)
    //+ "A1!"="a3f8c2d19b4eA1!" valide
    let newParentId: number | undefined;
    try {
      const result = await createUser({
        variables: {
          data: { ...values, password: tempPassword, role: "parent", group_id: null },
        },
        refetchQueries: ["AdminCounts"],
      });
      newParentId = result.data?.createUser.id;
    } catch {
      setServerError("Une erreur est survenue. Vérifiez les informations.");
      return;
    }

    if (!newParentId) {
      setServerError("Une erreur est survenue. Vérifiez les informations.");
      return;
    }
    try {
      for (const child of childrenData?.children ?? []) {
        if (selectedChildIds.includes(child.id)) {
          const existingParentIds = child.parents.map((p) => ({ id: p.id }));
          await linkParentToChild({
            variables: {
              id: child.id,
              data: { parents: [...existingParentIds, { id: newParentId }] },
            },
          });
        }
      }
    } catch {
      setServerError("Le parent a été créé mais un lien avec un enfant a échoué.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSearch("");
      setDropdownOpen(false);
      setSelectedChildIds([]);
      setServerError("");
      reset();
      onClose();
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto">
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={() => {
          reset();
          setServerError("");
          setSelectedChildIds([]);
          setSearch("");
          setDropdownOpen(false);
          onClose();
        }}
        aria-label="Fermer la modal"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[400px] rounded-3xl bg-[#FEF9F6] border-2 border-(--color-secondary) p-5 shadow-xl my-auto md:max-w-[560px] md:p-8">
        {/* Header */}
        <div className="flex items-center gap-10">
          <div className="relative shrink-0 w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden">
            <Image src="/boutons/plus.webp" alt="Ajouter" fill className="object-cover" />
          </div>
          <h2 className="text-[16px] font-semibold md:text-[22px]">Ajouter un parent</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
          <p className="text-[13px] font-medium md:text-[16px]">Informations</p>

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="first_name" className="text-[12px] font-medium md:text-[14px]">
                Prénom*
              </label>
              <input
                id="first_name"
                {...register("first_name", { required: "Champ requis" })}
                className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none md:text-[15px] md:py-2 md:px-3 ${errors.first_name ? "border-red-400" : "border-(--color-primary)"}`}
              />
              {errors.first_name && (
                <p className="text-[11px] text-red-500 md:text-[13px]">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="last_name" className="text-[12px] font-medium md:text-[14px]">
                Nom*
              </label>
              <input
                id="last_name"
                {...register("last_name", { required: "Champ requis" })}
                className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none md:text-[15px] md:py-2 md:px-3 ${errors.last_name ? "border-red-400" : "border-(--color-primary)"}`}
              />
              {errors.last_name && (
                <p className="text-[11px] text-red-500 md:text-[13px]">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Adresse mail */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-[12px] font-medium md:text-[14px]">
              Adresse mail*
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Champ requis" })}
              className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none md:text-[15px] md:py-2 md:px-3 ${errors.email ? "border-red-400" : "border-(--color-primary)"}`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 md:text-[13px]">{errors.email.message}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-[12px] font-medium md:text-[14px]">
              Téléphone*
            </label>
            <input
              id="phone"
              {...register("phone", { required: "Champ requis" })}
              className={`w-full rounded-xl border-2 bg-white px-2 py-1 text-[13px] outline-none md:text-[15px] md:py-2 md:px-3 ${errors.phone ? "border-red-400" : "border-(--color-primary)"}`}
            />
            {errors.phone && (
              <p className="text-[11px] text-red-500 md:text-[13px]">{errors.phone.message}</p>
            )}
          </div>
          {/* Enfants liés */}
          <div>
            <p className="text-[13px] font-medium mb-1 md:text-[16px]">Enfants liés</p>

            {/* Bouton */}
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full rounded-xl cursor-pointer border-2 border-(--color-primary) bg-white px-3 py-1.5 text-[12px] text-left outline-none flex justify-between items-center md:text-[15px] md:py-2"
            >
              <span className="text-gray-400">
                {selectedChildIds.length === 0
                  ? "Ajouter un enfant"
                  : `${selectedChildIds.length} enfant(s) sélectionné(s)`}
              </span>
              <span
                className={`transition-transform duration-200 text-gray-400 ${dropdownOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {/* Accordéon */}
            {dropdownOpen && (
              <div className="mt-1 rounded-xl border-2 border-(--color-primary) bg-white overflow-hidden">
                {/* Recherche */}
                <div className="p-2 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-2 py-1 text-[12px] outline-none md:text-[14px]"
                  />
                </div>
                {/* Liste scrollable */}
                <div className="max-h-24 overflow-y-auto md:max-h-36">
                  {childrenData?.children
                    .filter((child) =>
                      `${child.firstName} ${child.lastName}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((child) => (
                      <label
                        key={child.id}
                        className="flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 md:text-[15px] md:px-4 md:py-2.5"
                      >
                        <input
                          type="checkbox"
                          checked={selectedChildIds.includes(child.id)}
                          onChange={(e) =>
                            setSelectedChildIds((prev) =>
                              e.target.checked
                                ? [...prev, child.id]
                                : prev.filter((id) => id !== child.id),
                            )
                          }
                        />
                        {child.firstName} {child.lastName}
                      </label>
                    ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedChildIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-[60px] overflow-y-auto">
                {childrenData?.children
                  .filter((child) => selectedChildIds.includes(child.id))
                  .map((child) => (
                    <span
                      key={child.id}
                      className="flex items-center gap-1 rounded-full bg-white border border-(--color-secondary) px-2 py-0.5 text-[11px] md:text-[13px]"
                    >
                      {child.firstName} {child.lastName}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedChildIds((prev) => prev.filter((id) => id !== child.id))
                        }
                        className="hover:opacity-60"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>
          {success && (
            <p className="text-center text-[12px] text-green-600 font-medium py-1 md:text-[14px]">
              ✓ Parent créé avec succès !
            </p>
          )}
          {serverError && (
            <p className="text-center text-[12px] text-red-500 font-medium py-1 md:text-[14px]">
              {serverError}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setServerError("");
                setSelectedChildIds([]);
                setSearch("");
                setDropdownOpen(false);
                onClose();
              }}
              className="flex-1 rounded-xl cursor-pointer border-2 border-(--color-tertiary) bg-white py-1 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 md:text-[16px] md:py-2.5"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl cursor-pointer border-2 border-(--color-tertiary) bg-white py-1 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 md:text-[16px] md:py-2.5"
            >
              {isSubmitting ? "Création..." : "Créer parent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
