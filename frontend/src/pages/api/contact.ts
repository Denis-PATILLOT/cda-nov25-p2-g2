import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type File, IncomingForm } from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false, // Indispensable pour laisser formidable gérer le flux
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Configuration du client S3 avec fallback (sécurité si le .env rate)
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAVDFCVZVG76PUEXFB",
      secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY || "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",
    },
  });

  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
  });

  try {
    // 1. Lecture du formulaire
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const subject = Array.isArray(fields.subject) ? fields.subject[0] : fields.subject;
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;

    // Gestion des fichiers attachments
    const rawFiles = files.attachments;
    const uploadedFiles: File[] = rawFiles ? (Array.isArray(rawFiles) ? rawFiles : [rawFiles]) : [];

    const attachmentsForEmail = [];

    // 2. Boucle de traitement (S3 + Préparation Email)
    for (const file of uploadedFiles) {
      const fileContent = fs.readFileSync(file.filepath);
      const safeFileName = `${Date.now()}-${file.originalFilename?.replace(/\s/g, "_")}`;
      const contentId = `img-${safeFileName}`; // Identifiant unique pour l'affichage HTML

      // Envoi vers Amazon S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME || "babyboard",
          Key: `contact-directrice/${safeFileName}`,
          Body: fileContent,
          ContentType: file.mimetype || "application/octet-stream",
        }),
      );

      // Ajout à la liste des pièces jointes pour Nodemailer
      attachmentsForEmail.push({
        filename: file.originalFilename || "document",
        content: fileContent,
        cid: contentId, // Lie l'image au <img src="cid:...">
      });
    }

    // 3. Configuration Mailtrap
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "9994b3625835e2",
        pass: process.env.MAILTRAP_PASS || "b8f7dca40d81d1",
      },
    });

    // 4. Envoi de l'email avec les images en ligne (inline)
    await transporter.sendMail({
      from: '"Portail Crèche" <noreply@creche.com>',
      to: "direction@creche.com",
      subject: `[DIRECTRICE] ${subject}`,
      attachments: attachmentsForEmail,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d14;">Nouveau message reçu</h2>
          <p><strong>Objet :</strong> ${subject}</p>
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #d14; margin-bottom: 20px;">
            ${message?.replace(/\n/g, "<br>")}
          </div>
          
          <h3 style="color: #666;">Pièces jointes :</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${attachmentsForEmail
              .map(
                (att) => `
              <div style="border: 1px solid #ddd; padding: 5px; border-radius: 8px;">
                <p style="font-size: 10px; margin: 0;">${att.filename}</p>
                <img src="cid:${att.cid}" style="max-width: 250px; display: block; margin-top: 5px;" />
              </div>
            `,
              )
              .join("")}
          </div>
          
          <p style="margin-top: 20px; font-size: 0.8em; color: #999;">
            Note : Ces fichiers ont également été sauvegardés sur le bucket S3 "babyboard".
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Tout est OK !" });
  } catch (error: any) {
    console.error("ERREUR DÉTAILLÉE:", error);
    return res.status(500).json({
      error: "Erreur lors du traitement",
      details: error.message,
    });
  }
}
