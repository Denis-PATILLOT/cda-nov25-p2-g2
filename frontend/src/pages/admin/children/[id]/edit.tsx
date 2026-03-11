import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import {
  useAdminChildDetailQuery,
  useAllGroupsQuery,
  useUpdateChildMutation,
} from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { getAge } from "@/utils/getAge";
import PencilIcon from "@/components/admin/PencilIcon";

// Formate une date en format lisible français (ex: "3 mars 2022")
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Type des valeurs du formulaire géré par react-hook-form
type FormValues = {
  firstName: string;
  lastName: string;
  birthDate: string;
  healthRecord: string;
};

// Champ actuellement en cours d'édition (null = aucun)
type EditingField = "name" | "birthDate" | "group" | "healthRecord" | null;

export default function EditChildPage() {
  const router = useRouter();

  // Récupère l'id de l'enfant depuis l'URL (ex: /admin/children/42/edit → id = 42)
  const { id } = router.query;
  const childId = Number(id);

  // Vérifie que l'utilisateur est connecté et admin
  const { user, authLoading, isAdmin } = useAdminGuard();

  // Requête GraphQL : charge le détail de l'enfant (infos + parents + groupe)
  // skip : n'exécute pas la requête si l'id n'est pas encore disponible
  const { data, loading } = useAdminChildDetailQuery({
    variables: { id: childId },
    skip: !childId || Number.isNaN(childId),
    fetchPolicy: "network-only", // toujours récupérer les données fraîches
  });

  // Mutation GraphQL pour sauvegarder les modifications de l'enfant
  const [updateChild, { loading: saving }] = useUpdateChildMutation();

  // Requête GraphQL : charge la liste de tous les groupes (pour le dropdown)
  const { data: groupsData } = useAllGroupsQuery();

  // react-hook-form : gère les valeurs du formulaire, la validation et la soumission
  // register = lie un input au formulaire
  // handleSubmit = déclenche la validation avant onSubmit
  // reset = pré-remplit le formulaire avec les données chargées
  // watch = lit les valeurs en temps réel pour l'affichage
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();

  // États locaux
  const [activeTab, setActiveTab] = useState<"infos" | "sante">("infos");
  // onglet actif
  const [editingField, setEditingField] = useState<EditingField>(null);
  // champ en cours d'édition
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  // groupe sélectionné
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  // dropdown groupe ouvert ?
  const [success, setSuccess] = useState(false);
  // affiche le message de succès
  const [serverError, setServerError] = useState("");
  // message d'erreur serveur

  // Quand les données de l'enfant sont chargées, on pré-remplit le formulaire
  useEffect(() => {
    if (data?.child) {
      const c = data.child;
      reset({
        firstName: c.firstName,
        lastName: c.lastName,
        // Conversion en format "YYYY-MM-DD" requis par <input type="date">
        birthDate: new Date(c.birthDate).toISOString().split("T")[0],
        healthRecord: c.healthRecord ?? "",
      });
      setSelectedGroupId(Number(c.group?.id) || null);
    }
  }, [data, reset]);

  // Soumission du formulaire : envoie les modifications au serveur via la mutation GraphQL.
  // Après succès, redirige vers la liste des enfants
  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      await updateChild({
        variables: {
          id: childId,
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            birthDate: new Date(values.birthDate),
            healthRecord: values.healthRecord || null,
            // N'envoie le groupe que si un groupe est sélectionné
            ...(selectedGroupId ? { group: { id: selectedGroupId } } : {}),
          },
        },
        // Recharge les queries qui dépendent de ces données pour rester à jour
        refetchQueries: ["childById", "AdminChildren"],
      });
      setSuccess(true);
      setTimeout(() => router.push("/admin/childrenHistory"), 2000);
    } catch {
      setServerError("Erreur lors de la sauvegarde.");
    }
  };

  // Attente du chargement avant d'afficher la page
  if (authLoading || loading) return null;
  if (!user || !isAdmin) return null;

  const child = data?.child;

  // watch() lit les valeurs du formulaire en temps réel (pour affichage immédiat)
  const birthDateVal = watch("birthDate");
  const firstNameVal = watch("firstName");
  const lastNameVal = watch("lastName");
  const healthRecordVal = watch("healthRecord");

  // Nom du groupe sélectionné, pour l'affichage dans la ligne Groupe
  const selectedGroupName =
    groupsData?.getAllGroups.find((g) => Number(g.id) === selectedGroupId)?.name ?? "—";

  // Annuler : remet les valeurs originales du formulaire
  function handleCancel() {
    if (!child) return;
    reset({
      firstName: child.firstName,
      lastName: child.lastName,
      birthDate: new Date(child.birthDate).toISOString().split("T")[0],
      healthRecord: child.healthRecord ?? "",
    });
    setSelectedGroupId(Number(child.group?.id) || null);
    setEditingField(null);
    setGroupDropdownOpen(false);
  }

  return (
    <Layout pageTitle="Modifier fiche enfant - Admin">
      {/* Tout le contenu est dans un formulaire pour gérer la soumission globale */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-10">
          {/* Flèche retour */}
          <div className="mb-2">
            <button type="button" onClick={() => router.push("/admin/childrenHistory")} className="p-0">
              <div className="h-10 w-10 overflow-hidden flex items-center justify-center">
                <img src="/admin/flechegauche.png" alt="Retour" className="h-16 w-16" />
              </div>
            </button>
          </div>

          {/* Section avatar + nom + âge */}
          <div className="flex flex-col items-center mt-2">
            <div className="relative">
              <img
                src={child?.picture || "https://placehold.co/100x100/png"}
                alt="Avatar enfant"
                className="h-24 w-24 rounded-full object-cover border-4 border-(--color-primary) shadow-md"
              />
              {/* Bouton crayon sur la photo (modification photo — non implémenté) */}
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-(--color-primary) shadow"
              >
                <PencilIcon />
              </button>
            </div>
            <p className="mt-1 text-[11px] opacity-50">Modifier photo</p>

            {/* Nom */}
            <div className="mt-2 flex items-center gap-2">
              {editingField === "name" ? (
                <div
                  className="flex gap-1"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setEditingField(null);
                  }}
                >
                  <input
                    {...register("firstName", { required: true })}
                    onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                    className="w-24 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[14px] outline-none text-center"
                  />
                  <input
                    {...register("lastName", { required: true })}
                    onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                    className="w-24 rounded-lg border-2 border-(--color-primary) px-2 py-0.5 text-[14px] outline-none text-center"
                  />
                </div>
              ) : (
                <>
                  <span className="text-[16px] font-semibold">
                    {firstNameVal || child?.firstName} {lastNameVal || child?.lastName}
                  </span>
                  <button type="button" onClick={() => setEditingField("name")}>
                    <PencilIcon />
                  </button>
                </>
              )}
            </div>

            {/* Âge : calculé dynamiquement depuis birthDate */}
            <span className="text-[13px] opacity-60">
              {birthDateVal
                ? getAge(birthDateVal)
                : child?.birthDate
                  ? getAge(String(child.birthDate))
                  : "—"}
            </span>
          </div>

          {/* Carte parent(s) — affichée seulement si l'enfant a des parents enregistrés */}
          {child?.parents && child.parents.length > 0 && (
            <div className="mt-5 rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-4 py-3 shadow-md">
              {child.parents.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img
                    src={p.avatar || "https://placehold.co/50x50/png"}
                    alt="Parent"
                    className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[12px] font-medium">
                      Parents : {p.first_name} {p.last_name}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {/* Boutons d'action parent (non implémentés pour l'instant) */}
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/admin/parents/${p.id}/edit?childId=${childId}`)
                        }
                        className="flex items-center gap-1 rounded-xl border-2 border-(--color-tertiary) bg-white px-2 py-1 text-[11px] shadow-sm transition-all hover:shadow-md hover:scale-[1.03] active:scale-95"
                      >
                        <PencilIcon />
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-xl border-2 border-(--color-tertiary) bg-white px-2 py-1 text-[11px] shadow-sm transition-all hover:shadow-md hover:scale-[1.03] active:scale-95"
                      >
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <title>Message</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                          />
                        </svg>
                        Envoyer un message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section Infos de l'enfant */}
          <div className="mt-5">
            <h2 className="text-center text-[14px] font-semibold mb-3">Infos de l&apos;enfant</h2>

            {/* Conteneur principal du bloc */}
            <div
              className="rounded-2xl bg-white shadow-md overflow-hidden"
              style={{ border: "2px solid var(--color-secondary)" }}
            >
              {/* "Informations" / "Carnet de santé"
                  L'onglet actif a un fond bleu (--color-secondary), l'inactif est gris */}
              <div className="flex p-1 gap-1 bg-white">
                <button
                  type="button"
                  onClick={() => setActiveTab("infos")}
                  className={`flex-1 py-1.5 text-[12px] font-medium rounded-xl transition-all duration-200 ${activeTab === "infos" ? "shadow-sm text-gray-700" : "text-gray-400"}`}
                  style={activeTab === "infos" ? { backgroundColor: "var(--color-secondary)" } : {}}
                >
                  Informations
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sante")}
                  className={`flex-1 py-1.5 text-[12px] font-medium rounded-xl transition-all duration-200 ${activeTab === "sante" ? "shadow-sm text-gray-700" : "text-gray-400"}`}
                  style={activeTab === "sante" ? { backgroundColor: "var(--color-secondary)" } : {}}
                >
                  Carnet de santé
                </button>
              </div>

              {/* Contenu onglet "Informations" */}
              {activeTab === "infos" && (
                <div className="flex flex-col bg-white">
                  {/* Ligne Date de naissance — séparée par une bordure primary en bas */}
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: "1px solid var(--color-primary)" }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {/* Icône calendrier */}
                      <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0">
                        <img src="/admin/calendrier.png" alt="date" className="h-12 w-12" />
                      </div>
                      {/* Bascule affichage / édition */}
                      {editingField === "birthDate" ? (
                        <input
                          type="date"
                          {...register("birthDate")}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                          className="flex-1 rounded-lg border-2 px-2 py-0.5 text-[12px] outline-none"
                          style={{ borderColor: "var(--color-primary)" }}
                        />
                      ) : (
                        <span className="text-[13px]">
                          Date de naissance :{" "}
                          {birthDateVal
                            ? formatDate(birthDateVal)
                            : child?.birthDate
                              ? formatDate(String(child.birthDate))
                              : "—"}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingField(editingField === "birthDate" ? null : "birthDate")
                      }
                    >
                      <PencilIcon />
                    </button>
                  </div>

                  {/* Ligne Groupe — dropdown pour changer de groupe */}
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid var(--color-primary)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0">
                          <img src="/admin/groupe.png" alt="groupe" className="h-12 w-12" />
                        </div>
                        <span className="text-[13px]">{selectedGroupName}</span>
                      </div>
                      {/* Clic sur le crayon → ouvre/ferme le dropdown de sélection de groupe */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingField(editingField === "group" ? null : "group");
                          setGroupDropdownOpen((p) => !p);
                        }}
                      >
                        <PencilIcon />
                      </button>
                    </div>
                    {/* Dropdown de sélection de groupe */}
                    {groupDropdownOpen && (
                      <div
                        className="mt-2 rounded-xl overflow-hidden"
                        style={{ border: "2px solid var(--color-primary)" }}
                      >
                        {groupsData?.getAllGroups.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setSelectedGroupId(Number(g.id));
                              setGroupDropdownOpen(false);
                              setEditingField(null);
                            }}
                            className={`w-full text-left px-3 py-2 text-[12px] border-b border-gray-50 last:border-0 hover:bg-orange-50 ${selectedGroupId === Number(g.id) ? "font-semibold" : ""}`}
                          >
                            {g.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ligne Allergie / healthRecord */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0">
                        <img src="/admin/allergie.png" alt="allergie" className="h-12 w-12" />
                      </div>
                      {editingField === "healthRecord" ? (
                        <input
                          {...register("healthRecord")}
                          onBlur={() => setEditingField(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
                          className="flex-1 rounded-lg border-2 px-2 py-0.5 text-[12px] outline-none"
                          style={{ borderColor: "var(--color-primary)" }}
                          placeholder="Ex: allergie arachides..."
                        />
                      ) : (
                        <span className="text-[13px]">
                          Allergie : {healthRecordVal || child?.healthRecord || "RAS"}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingField(editingField === "healthRecord" ? null : "healthRecord")
                      }
                    >
                      <PencilIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Contenu onglet "Carnet de santé" — zone de texte libre */}
              {activeTab === "sante" && (
                <div className="px-4 py-4">
                  <textarea
                    {...register("healthRecord")}
                    rows={5}
                    className="w-full bg-transparent text-[13px] outline-none resize-none"
                    placeholder="Notes de santé, allergies, traitements..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Messages de retour après soumission */}
          {success && (
            <p className="mt-4 text-center text-[12px] text-green-600 font-medium">
              ✓ Modifications sauvegardées !
            </p>
          )}
          {serverError && (
            <p className="mt-4 text-center text-[12px] text-red-500 font-medium">{serverError}</p>
          )}

          {/* Boutons d'action */}
          <div className="mt-6 flex gap-3">
            {/* Annuler : remet les valeurs originales */}
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95"
            >
              Annuler
            </button>
            {/* Sauvegarder soumet le formulaire (handleSubmit, onSubmit) */}
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl border-2 border-(--color-tertiary) bg-white py-2 text-[13px] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] active:scale-95 disabled:opacity-50"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>

        </div>
      </form>
    </Layout>
  );
}
