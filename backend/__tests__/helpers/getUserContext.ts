import { cookieName, createJWT } from "../../src/auth";
import type { User } from "../../src/entities/User";

export async function getUserContext(u: User) {        // récupération contexte pour créer un cookie d'aunthentification
  const jwt = await createJWT(u);
  return { req: { cookies: { [cookieName]: jwt } } };
}
