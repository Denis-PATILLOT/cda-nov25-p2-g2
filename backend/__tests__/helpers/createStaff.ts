import { hash } from "argon2";
import { User, UserRole } from "../../src/entities/User";

export async function createStaff() {        // création d'un utilisateur "staff"
  return User.create({
    first_name: "Amandine",
    last_name: "Dupond",
    email: "staff@app.com",
    phone: "0650403020",
    hashedPassword: await hash("Password123!"),
    role: UserRole.Staff,
  }).save();
}
