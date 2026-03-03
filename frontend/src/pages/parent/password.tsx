/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
import { useRouter } from "next/router";
import type React from "react";
import { useState } from "react";
import Layout from "@/components/Layout";
import { useChangePasswordMutation } from "@/graphql/generated/schema";

const ChangePasswordPage = () => {
  const router = useRouter();

  // States pour la visibilité des mots de passe
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [changePassword, { loading }] = useChangePasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await changePassword({
        variables: {
          data: {
            currentPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          },
        },
      });

      if (result.data?.changePassword) {
        alert("Mot de passe modifié avec succès !");
        router.push("/profil/profil");
      } else {
        alert("Erreur : Informations incorrectes.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <Layout pageTitle="Modification mot de passe">
      <div className="bb-screen">
        <div className="bb-mobile-container">
          <main className="bb-main">
            <div className="bb-title-card">
              <h1>Modification mot de passe</h1>
            </div>

            <div className="bb-profile-card" style={{ paddingTop: "35px" }}>
              <form onSubmit={handleSubmit} className="bb-info-list">
                <div className="bb-input-group">
                  <label className="bb-label">Adresse mail*</label>
                  <div className="bb-info-field">
                    <input
                      type="email"
                      className="bb-edit-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="bb-input-group">
                  <label className="bb-label">Ancien mot de passe *</label>
                  <div className="bb-info-field bb-password-container">
                    <input
                      type={showOld ? "text" : "password"}
                      className="bb-edit-input"
                      value={formData.oldPassword}
                      onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="bb-eye-btn"
                      onClick={() => setShowOld(!showOld)}
                    >
                      <img src={showOld ? "/closeeye.png" : "/openeye.png"} alt="Toggle" />
                    </button>
                  </div>
                </div>

                <div className="bb-input-group">
                  <label className="bb-label">Nouveau mot de passe *</label>
                  <div className="bb-info-field bb-password-container">
                    <input
                      type={showNew ? "text" : "password"}
                      className="bb-edit-input"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="bb-eye-btn"
                      onClick={() => setShowNew(!showNew)}
                    >
                      <img src={showNew ? "/closeeye.png" : "/openeye.png"} alt="Toggle" />
                    </button>
                  </div>
                </div>

                <button type="submit" className="bb-btn-valider" disabled={loading}>
                  {loading ? "Chargement..." : "Valider"}
                </button>
              </form>

              <p className="bb-notice-text">
                Pour toute autre demande (changement d’adresse, de situation, etc.), un justificatif
                sera exigé. Merci de contacter la direction de la crèche.
              </p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePasswordPage;
