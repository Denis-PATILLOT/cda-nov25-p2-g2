/** biome-ignore-all lint/a11y/noAutofocus: <explanation> */
import type React from "react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useProfileQuery, useUpdateProfileMutation } from "@/graphql/generated/schema";

const ProfilPage = () => {
  const { data, loading: queryLoading, error } = useProfileQuery();
  const [updateUser, { loading: mutationLoading }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (data?.me) {
      setFormData({
        first_name: data.me.first_name || "",
        last_name: data.me.last_name || "",
        email: data.me.email || "",
        phone: data.me.phone || "",
        avatar: data.me.avatar || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        variables: {
          data: {
            id: data?.me?.id as number,
            ...formData,
          },
        },
        refetchQueries: ["Profile"],
      });
      setIsEditing(false);
      setShowAvatarInput(false);
    } catch (err) {
      console.error("Erreur mutation:", err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  if (queryLoading) return <div className="bb-screen">Chargement...</div>;
  if (error) return <div className="bb-screen">Erreur de connexion au serveur.</div>;

  const user = data?.me;

  return (
    <Layout pageTitle="Mon Profil">
      <div className="bb-screen">
        <div className="bb-mobile-container">
          <main className="bb-main">
            <div className="bb-title-card">
              <h1>Mon profil</h1>
            </div>

            <div className="bb-profile-card">
              {/* SECTION AVATAR */}
              <div className="bb-avatar-center-container">
                <div className="bb-avatar-outline">
                  <img
                    src={formData.avatar || "/avatarfille.png"}
                    alt="User"
                    className="bb-avatar-img"
                  />
                  {/* Le stylo active l'édition de la photo uniquement */}
                  <button
                    type="button"
                    className="bb-edit-circle"
                    onClick={() => {
                      setIsEditing(true);
                      setShowAvatarInput(true);
                    }}
                    style={{ border: "none", cursor: "pointer" }}
                  >
                    <img src="/modifier.png" alt="Edit Avatar" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="bb-info-list">
                {/* Champ Avatar (affiché seulement si on a cliqué sur le stylo) */}
                {showAvatarInput && (
                  <div
                    className="bb-info-field"
                    style={{ borderBottom: "2px solid #e0e0e0", paddingBottom: "10px" }}
                  >
                    {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                    <label className="bb-label">Lien de la nouvelle photo</label>
                    <input
                      className="bb-edit-input"
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="Collez l'URL de l'image ici"
                      autoFocus
                    />
                  </div>
                )}

                <div className="bb-info-field">
                  <strong>Nom :</strong>
                  {isEditing ? (
                    <input
                      className="bb-edit-input"
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  ) : (
                    <span> {user?.last_name}</span>
                  )}
                </div>

                <div className="bb-info-field">
                  <strong>Prénom :</strong>
                  {isEditing ? (
                    <input
                      className="bb-edit-input"
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  ) : (
                    <span> {user?.first_name}</span>
                  )}
                </div>

                <div className="bb-info-field">
                  <strong>Email :</strong>
                  {isEditing ? (
                    <input
                      className="bb-edit-input"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <span> {user?.email}</span>
                  )}
                </div>

                <div className="bb-info-field">
                  <strong>Tel :</strong>
                  {isEditing ? (
                    <input
                      className="bb-edit-input"
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <span> {user?.phone}</span>
                  )}
                </div>

                <div className="bb-info-field">
                  <strong>Rôle :</strong> <span> {user?.role}</span>
                </div>

                {/* ACTIONS */}
                {isEditing ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <button type="submit" className="bb-btn-valider" disabled={mutationLoading}>
                      {mutationLoading ? "Enregistrement..." : "Valider les changements"}
                    </button>
                    <button
                      type="button"
                      className="bb-btn-change-password"
                      onClick={() => {
                        setIsEditing(false);
                        setShowAvatarInput(false);
                      }}
                      style={{ backgroundColor: "#999" }}
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="bb-btn-change-password"
                    style={{ marginTop: "20px" }}
                    onClick={() => setIsEditing(true)}
                  >
                    Modifier mes infos
                  </button>
                )}
              </form>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilPage;
