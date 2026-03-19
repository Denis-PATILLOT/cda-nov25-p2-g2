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

  // --- LOGIQUE DES FICHIERS ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // On ajoute les nouveaux fichiers à la liste existante
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);

      // Reset de l'input pour pouvoir sélectionner le même fichier deux fois si besoin
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- ENVOI DU FORMULAIRE ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. On utilise FormData (obligatoire pour les fichiers)
      const data = new FormData();
      data.append("subject", formData.subject);
      data.append("message", formData.message);

      // 2. On ajoute chaque fichier dans la clé "attachments"
      // C'est ce nom que ton API (formidable) cherche
      for (const file of files) {
        data.append("attachments", file);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        // NOTE: On ne définit PAS de 'Content-Type' header.
        // Le navigateur le fera automatiquement en incluant le "boundary".
        body: data,
      });

      if (response.ok) {
        alert("Succès ! Votre message et vos fichiers ont été envoyés.");
        router.push("/parent/index");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.details || "Erreur lors de l'envoi");
      }
    } catch (err: any) {
      alert(`Erreur : ${err.message || "Impossible d'envoyer le message"}`);
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
                  <div
                    className="bb-info-field"
                    style={{
                      flexDirection: "column",
                      alignItems: "start",
                      padding: "10px 15px",
                      minHeight: "48px",
                      height: "auto",
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

                    <button
                      type="button"
                      style={{
                        width: "auto",
                        border: "1px dashed #ccc",
                        borderRadius: "8px",
                        color: "#666",
                        padding: "8px 15px",
                        cursor: "pointer",
                        fontSize: "14px",
                        marginBottom: files.length > 0 ? "10px" : "0",
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      📎 Joindre des fichiers
                    </button>

                    {/* Liste des fichiers sélectionnés */}
                    {files.length > 0 && (
                      <div
                        style={{ width: "100%", borderTop: "1px solid #eee", paddingTop: "10px" }}
                      >
                        {files.map((f, i) => (
                          <div
                            key={`${f.name}-${i}`}
                            style={{
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                              background: "#f5f5f5",
                              padding: "5px 8px",
                              borderRadius: "4px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "80%",
                              }}
                            >
                              {f.name}
                            </span>
                            {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
                            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                            <span
                              onClick={() => removeFile(i)}
                              style={{
                                color: "red",
                                cursor: "pointer",
                                fontWeight: "bold",
                                marginLeft: "10px",
                              }}
                            >
                              ✕
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
                  style={{
                    marginTop: "20px",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Envoi en cours..." : "Envoyer à la direction"}
                </button>
              </form>

              <p className="bb-notice-text">
                Votre message sera envoyé directement à la boîte mail de la direction.
              </p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default ContactDirectricePage;
