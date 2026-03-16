import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { subject, message, attachments } = req.body;

  // Configuration Mailtrap
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9994b3625835e2",
      pass: "b8f7dca40d81d1",
    },
  });

  try {
    await transporter.sendMail({
      from: '"Application Parents" <noreply@creche.com>',
      to: "direction@creche.com",
      subject: `[PORTAIL PARENT] ${subject}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Nouveau message pour la direction</h2>
          <p><strong>Objet :</strong> ${subject}</p>
          <p><strong>Message :</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">
            Cet email a été envoyé depuis le formulaire de contact du portail parent.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
}
