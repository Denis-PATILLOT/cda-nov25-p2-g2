import "@fastify/cookie"; //à ajouter pour pouvoir faire les tests e2e qui ont besoin des méthodes de fastify pour les cookies
import jwt from "jsonwebtoken";
import type { AuthChecker } from "type-graphql";
import { User } from "./entities/User";
import env from "./env";
import { ForbiddenError, UnauthenticatedError } from "./errors";
import type { GraphQLContext } from "./types";
import fastifyCookie from "@fastify/cookie";

export interface JWTPayload {
  userId: number;
}

// fn creation token (prend en param un User)
export async function createJWT(user: User): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id, // on aura userId dans le payload
  };

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

// fn verif token qui renvoie le payload du token
export const verifyJWT = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (_error) {
    return null;
  }
};

// création du cookie authentification
export const cookieName = "authToken";
// fn startSession (prend en param le context défini et un User)
export async function startSession(context: GraphQLContext, user: User) {
  const token = await createJWT(user);

  context.res.cookie(cookieName, token, {
    // création du cookie dans le context (response) : on y met le token avec les options indiquées
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return token; // renvoie le token (string)
}

export async function endSession(context: GraphQLContext) {
  context.res.clearCookie(cookieName); // efface le cookie d'authentification
}

// fn getJWT : prend le payload depuis le cookie (dans le context)
export async function getJWT(
  context: GraphQLContext,
): Promise<JWTPayload | null> {
  const token = context.req.cookies?.[cookieName];

  if (!token) return null; // si token invalide ou non existant
  const payload = verifyJWT(token);

  if (!payload) return null; // si payload inexistant
  return payload; // si ok, renvoie le payload
}

// fn getCurrentUSer (en param le context) : va récupérer l'utilisateur courant via le token du cookie "authToken" dans la req
export async function getCurrentUser(context: GraphQLContext): Promise<User> {
  const jwt = await getJWT(context); // on récupère le payload
  if (jwt === null) throw new UnauthenticatedError(); // si pas de payload, on renvoie une erreur UnauthenticatedError qui sera catch dans le userResolver
  // si on a un payload, on l'utilise pour récupérer l'utilisateur concerné
  const currentUser = await User.findOne({
    where: { id: jwt.userId },
    relations: ["children", "children.group", "group", "group.children"],
  }); // ajout des données enfants et group pour la fn me() qui utilise le retour de getCurrentUser
  if (currentUser === null) throw new UnauthenticatedError(); // idem
  return currentUser; // on renvoie les infos de l'utilisateur si bien authentifié correctement
}

export const authChecker: AuthChecker<GraphQLContext> = async (
  { context },
  roles,
) => {
  const currentUser = await getCurrentUser(context);  // si pas connecté, on aura l'errerur UnauthenticatedError
  if (roles.length !== 0 && !roles.includes(currentUser.role.toString())) 
    throw new ForbiddenError();
  return true;
};
