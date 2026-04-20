import { hash } from "argon2";
import { User, UserRole } from "../../src/entities/User";

export async function createParent() {        // création d'un utilisateur "Parent"
  return User.create({
    first_name: "Pierre",
    last_name: "Rock",
    email: "parent@app.com",
    phone: "0690807060",
    hashedPassword: await hash("Password123!"),
    role: UserRole.Parent,
  }).save();
}