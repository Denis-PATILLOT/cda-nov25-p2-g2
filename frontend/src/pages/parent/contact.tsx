import { useRouter } from "next/router";
import type React from "react";
import { useRef, useState } from "react";
import Layout from "@/components/Layout";

const ContactDirectricePage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    subject: "Changement d'informations",
    message: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        alert("Succès ! Votre message a été envoyé.");
        // Redirection vers parent/index
        router.push("/parent/index");
      } else {
        throw new Error();
      }
    } catch (err) {
      alert("Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout pageTitle="Contact Directrice">
      <div className="bb-screen">
        <div className="bb-mobile-container">
          <main className="bb-main">
            <div className="bb-title-card">
              <h1>Contact Direction</h1>
            </div>

            <div className="bb-profile-card" style={{ paddingTop: "35px" }}>
              <form onSubmit={handleSubmit} className="bb-info-list">
                {/* OBJET */}
                <div className="bb-input-group">
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                  <label className="bb-label">Objet de la demande *</label>
                  <div className="bb-info-field">
                    <input
                      className="bb-edit-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="bb-input-group">
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                  <label className="bb-label">Votre message *</label>
                  <div className="bb-info-field">
                    <textarea
                      className="bb-edit-input"
                      style={{
                        minHeight: "120px",
                        padding: "10px",
                        border: "none",
                        width: "100%",
                        resize: "none",
                        outline: "none",
                      }}
                      placeholder="Décrivez ici votre demande..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* JUSTIFICATIFS */}
                <div className="bb-input-group">
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                  <label className="bb-label">Justificatifs (Images/PDF)</label>
                  {/* Mise à jour du style du champ d'information pour contenir les fichiers */}
                  <div
                    className="bb-info-field"
                    style={{
                      flexDirection: "column",
                      alignItems: "start",
                      padding: "5px 15px", // Padding interne pour ne pas coller au cadre
                      minHeight: "48px", // Hauteur minimale de base
                      height: "auto", // Permet au cadre de s'agrandir
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />

                    {/* Style du bouton mis à jour pour un meilleur alignement */}
                    <button
                      type="button"
                      // Classe 'bb-eye-btn' retirée car mal adaptée pour ce bouton
                      style={{
                        width: "auto", // Bouton pas trop large
                        border: "1px dashed #ccc",
                        borderRadius: "8px",
                        color: "#666",
                        padding: "8px 15px",
                        margin: "5px 0", // Petit espacement vertical
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      📎 Joindre des fichiers
                    </button>

                    {/* Liste des fichiers affichée proprement à l'intérieur du cadre */}
                    {files.length > 0 && (
                      <div
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          borderTop: "1px solid #eee",
                          paddingTop: "5px",
                        }}
                      >
                        {files.map((f, i) => (
                          <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={f.name + i} // Combinaison plus unique pour la clé
                            style={{
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                              background: "#f5f5f5",
                              padding: "5px 8px",
                              borderRadius: "4px",
                              marginBottom: "4px",
                              alignSelf: "stretch", // Occupe toute la largeur disponible
                            }}
                          >
                            <span
                              style={{
                                maxWidth: "80%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {f.name}
                            </span>
                            {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                            {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
                            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                            <span
                              onClick={() => removeFile(i)}
                              style={{
                                color: "red",
                                cursor: "pointer",
                                marginLeft: "10px",
                                fontWeight: "bold",
                              }}
                              title="Supprimer le fichier"
                            >
                              X
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="bb-btn-valider"
                  disabled={loading}
                  style={{ marginTop: "20px" }}
                >
                  {loading ? "Envoi en cours..." : "Envoyer à la direction"}
                </button>
              </form>

              <p className="bb-notice-text">
                Votre message sera envoyé directement à la boîte de la direction.
              </p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default ContactDirectricePage;
