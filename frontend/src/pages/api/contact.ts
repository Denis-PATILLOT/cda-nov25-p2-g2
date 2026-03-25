import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type File, IncomingForm } from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  // CONFIGURATION S3
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const form = new IncomingForm({ multiples: true, keepExtensions: true });

  try {
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const subject = Array.isArray(fields.subject) ? fields.subject[0] : fields.subject;
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
    const rawFiles = files.attachments;
    const uploadedFiles: File[] = rawFiles ? (Array.isArray(rawFiles) ? rawFiles : [rawFiles]) : [];

    const attachmentsForEmail = [];
    let imagesHtml = ""; // On prépare le bloc HTML pour l'affichage des images

    for (const file of uploadedFiles) {
      const fileContent = fs.readFileSync(file.filepath);
      const safeFileName = `${Date.now()}-${file.originalFilename?.replace(/\s/g, "_")}`;
      const contentId = `img-${safeFileName}`; // Identifiant unique pour le lien HTML

      // 1. Upload S3 (Optionnel, mais tu le gardes pour ton stockage)
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `contact-directrice/${safeFileName}`,
          Body: fileContent,
          ContentType: file.mimetype || "application/octet-stream",
        }),
      );

      attachmentsForEmail.push({
        filename: file.originalFilename || "document",
        content: fileContent,
        cid: contentId, // Crucial pour l'affichage "inline"
      });

      // 3. Construction du HTML si c'est une image
      if (file.mimetype?.startsWith("image/")) {
        imagesHtml += `
          <div style="margin: 10px; border: 1px solid #ddd; border-radius: 8px; padding: 10px; display: inline-block; background: #fff; width: 200px;">
            <p style="font-size: 11px; color: #666; margin-bottom: 5px; word-break: break-all;">${file.originalFilename}</p>
            <img src="cid:${contentId}" style="width: 100%; height: auto; border-radius: 4px;" />
          </div>
        `;
      }
    }

    // CONFIGURATION MAILTRAP
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // ENVOI DE L'EMAIL AVEC LE DESIGN
    await transporter.sendMail({
      from: '"Portail Crèche" <noreply@creche.com>',
      to: "direction@creche.com",
      subject: `[DIRECTRICE] ${subject}`,
      attachments: attachmentsForEmail,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #d14;">Nouveau message reçu</h2>
          <p><strong>Objet :</strong> ${subject}</p>
          
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #d14; margin-bottom: 20px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          ${attachmentsForEmail.length > 0 ? "<h3>Pièces jointes :</h3>" : ""}
          <div style="background: #fdfdfd; padding: 10px; border-radius: 10px;">
            ${imagesHtml}
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Erreur API:", error);
    return res.status(500).json({ error: error.message });
  }
}
