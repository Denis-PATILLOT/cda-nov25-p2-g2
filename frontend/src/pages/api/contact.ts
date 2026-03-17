import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type File, IncomingForm } from "formidable";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

// Important pour autoriser l'envoi de fichiers
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configuration S3 (à remplir dans ton fichier .env)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAVDFCVZVG76PUEXFB",
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || "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",
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
  });

  // On enveloppe le parsing dans une Promise pour mieux gérer l'async/await
  try {
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Nettoyage des données (formidable peut renvoyer des tableaux pour chaque champ)
    const subject = Array.isArray(fields.subject) ? fields.subject[0] : fields.subject;
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;

    // On récupère les fichiers (si "attachments" existe dans le FormData du front)
    const rawFiles = files.attachments;
    const uploadedFiles: File[] = rawFiles ? (Array.isArray(rawFiles) ? rawFiles : [rawFiles]) : [];

    const attachmentsForEmail = [];

    // Boucle de traitement des fichiers
    for (const file of uploadedFiles) {
      const fileContent = fs.readFileSync(file.filepath);
      const safeFileName = `${Date.now()}-${file.originalFilename?.replace(/\s/g, "_")}`;

      // 1. Envoi vers S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: "babyboard",
          Key: `contact-directrice/${safeFileName}`,
          Body: fileContent,
          ContentType: file.mimetype || "application/octet-stream",
        }),
      );

      // 2. Préparation pour l'email
      attachmentsForEmail.push({
        filename: file.originalFilename || "document",
        content: fileContent,
      });
    }

    // Configuration Nodemailer (Mailtrap pour le test)
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "9994b3625835e2",
        pass: process.env.MAILTRAP_PASS || "b8f7dca40d81d1",
      },
    });

    await transporter.sendMail({
      from: '"Portail Crèche" <noreply@creche.com>',
      to: "direction@creche.com",
      subject: `[DIRECTRICE] ${subject}`,
      attachments: attachmentsForEmail,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d14;">Nouveau message reçu</h2>
          <p><strong>Objet :</strong> ${subject}</p>
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #d14;">
            ${message?.replace(/\n/g, "<br>")}
          </div>
          <p style="margin-top: 20px; font-size: 0.8em; color: #999;">
            Les pièces jointes ont été sauvegardées sur S3.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Email envoyé avec succès" });
  } catch (error: any) {
    console.error("Erreur API Contact:", error);
    return res.status(500).json({
      error: "Erreur lors du traitement",
      details: error.message,
    });
  }
}
