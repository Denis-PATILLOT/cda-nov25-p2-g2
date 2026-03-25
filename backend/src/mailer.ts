import nodemailer from "nodemailer";
import env from "./env";

const transporter = nodemailer.createTransport({
  host: env.MAILTRAP_HOST,
  port: env.MAILTRAP_PORT,
  auth: {
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASS,
  },
});

export async function sendWelcomeEmail(params: {
  to: string;
  firstName: string;
  password: string;
}) {
  await transporter.sendMail({
    from: `"BabyBoard" <noreply@babyboard.fr>`,
    to: params.to,
    subject: "Bienvenue sur BabyBoard — vos identifiants",
    html: `
      <div style="background-color: #fdf4f9; padding: 40px 0; font-family: 'Segoe UI', sans-serif;">
        <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(244,114,182,0.15);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f9a8d4, #f472b6); padding: 36px 40px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 1px;">🍼 BabyBoard</h1>
          </div>

          <!-- Body -->
          <div style="padding: 36px 40px;">
            <h2 style="color: #be185d; font-size: 20px; margin: 0 0 12px;">Bienvenue, ${params.firstName} ! 👋</h2>
            <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Votre compte a été créé sur BabyBoard. Voici vos identifiants pour vous connecter :
            </p>

            <!-- Credentials box -->
            <div style="background: #fdf2f8; border: 1px solid #f9a8d4; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <div style="margin-bottom: 14px;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Adresse email</p>
                <p style="margin: 0; font-size: 15px; color: #1f2937; font-weight: 600;">${params.to}</p>
              </div>
              <div>
                <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Mot de passe temporaire</p>
                <p style="margin: 0; font-size: 20px; color: #be185d; font-family: monospace; font-weight: 700; letter-spacing: 2px;">${params.password}</p>
              </div>
            </div>

            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">
              🔒 Pour votre sécurité, pensez à changer votre mot de passe dès votre première connexion.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #fdf4f9; padding: 20px 40px; text-align: center; border-top: 1px solid #fce7f3;">
            <p style="margin: 0; color: #d1d5db; font-size: 12px;">© 2025 BabyBoard — Tous droits réservés</p>
          </div>

        </div>
      </div>
    `,
  });
}
