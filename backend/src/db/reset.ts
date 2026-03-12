import { hash } from "argon2";
import { Child } from "../entities/Child";
import { Group } from "../entities/Group";
import { Planning } from "../entities/Planning";
import { baby_moodFormat, Report } from "../entities/Report";
import { User, UserRole } from "../entities/User";
import db from "./index";

export async function clearDB() {
  const runner = db.createQueryRunner();
  const tableDroppings = db.entityMetadatas.map((entity) =>
    runner.query(`DROP TABLE IF EXISTS "${entity.tableName}" CASCADE`),
  );
  await Promise.all(tableDroppings);
  await db.synchronize();
}

async function main() {
  await db.initialize();
  await clearDB();

  // Group
  const group1 = await Group.create({
    name: "Petite section",
    capacity: 20,
  }).save();

  const group2 = await Group.create({
    name: "Moyenne section",
    capacity: 25,
  }).save();

  const group3 = await Group.create({
    name: "grande section",
    capacity: 18,
  }).save();

  // User
  const user1 = await User.create({
    email: "dave.lopper@app.com",
    first_name: "Dave",
    last_name: "Lopper",
    hashedPassword: await hash("Password123!"),
    phone: "04-73-62-27-58",
    avatar:
      "https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-173524.jpg?semt=ais_hybrid&w=740&q=80",
    role: UserRole.Parent,
  }).save();

  const user2 = await User.create({
    email: "jane.doe@app.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Jane",
    last_name: "Doe",
    phone: "04-79-14-58-39",
    avatar:
      "https://img.freepik.com/vecteurs-libre/femme-aux-cheveux-longs-sombres_1308-176524.jpg?semt=ais_hybrid&w=740&q=80",
    role: UserRole.Parent,
  }).save();

  const _user3 = await User.create({
    email: "veronique@app.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Véronique",
    last_name: "Supernanny",
    phone: "04-17-81-26-35",
    avatar:
      "https://img.freepik.com/vecteurs-libre/femme-elegante-veste-rouge_1308-176631.jpg?semt=ais_hybrid&w=740&q=80",
    role: UserRole.Staff,
    group: { id: group1.id },
  }).save();

  const user4 = await User.create({
    email: "jacques.constantin@app.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Jacques",
    last_name: "Constantin",
    phone: "04-47-38-14-98",
    avatar:
      "https://st2.depositphotos.com/1007566/11226/v/450/depositphotos_112265066-stock-illustration-parent-avatar-design.jpg",
    role: UserRole.Parent,
    group: null, // on peut aussi le mettre explicitement
  }).save();

  const user5 = await User.create({
    email: "annie.croche@app.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Annie",
    last_name: "Croche",
    phone: "04-70-49-81-73",
    avatar:
      "https://img.freepik.com/vecteurs-premium/avatar-femme-souriante_937492-6135.jpg?semt=ais_user_personalization&w=740&q=80",
    role: UserRole.Parent,
    group: null,
  }).save();

  const _user6 = await User.create({
    email: "capucine@app.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Capucine",
    last_name: "City",
    phone: "04-47-14-89-42",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDqUmyqtPycn1ezYbacsstiCxlPyqL8x2kQQ&s",
    role: UserRole.Staff,
    group: { id: group2.id },
  }).save();

  const _user7 = await User.create({
    email: "lucie.magret@app.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Lucie",
    last_name: "Magret",
    phone: "04-80-14-89-42",
    avatar:
      "https://storage.uk.cloud.ovh.net/v1/AUTH_fa9d327c33094392a5355e4877298168/topassmat-prod/uploads/avatars/2026/1/5061063/thumb_e78f70fb5e.webp",
    role: UserRole.Staff,
    group: { id: group3.id },
  }).save();

  const _userAdmin = await User.create({
    email: "admin@app.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Admin",
    last_name: "Super",
    phone: "04-17-81-26-35",
    avatar:
      "https://img.freepik.com/vecteurs-libre/femme-aux-cheveux-longs-sombres_1308-176524.jpg?semt=ais_hybrid&w=740&q=80",
    role: UserRole.Admin,
  }).save();

  // Child
  const child1 = await Child.create({
    firstName: "Ichem",
    lastName: "Battour",
    birthDate: "02/10/2025", //MM-JJ-AAAA
    picture:
      "https://img.freepik.com/photos-gratuite/bebe-sourit-joyeusement_1150-24911.jpg?semt=ais_hybrid&w=740&q=80",
    parents: [{ id: user1.id }, { id: user2.id }], // [user1, user2]
    group: { id: group2.id }, // group: group2,
    healthRecord: null, // possible via le paramétrage du champ depuis Child
  }).save();

  const child2 = await Child.create({
    firstName: "Martin",
    lastName: "Dupond",
    birthDate: "09/07/2025",
    picture:
      "https://storage.uk.cloud.ovh.net/v1/AUTH_fa9d327c33094392a5355e4877298168/topassmat-prod/uploads/avatars/2024/8/3595136/thumb_6350e3e030.webp",
    parents: [{ id: user1.id }, { id: user2.id }],
    group: { id: group1.id }, // group: group1
  }).save();

  const child3 = await Child.create({
    firstName: "Sidonie",
    lastName: "Kelcrome",
    birthDate: "01/10/2025",
    picture:
      "https://frederic-gras.fr/wp-content/uploads/2020/11/photo-de-creche-1.jpg",
    parents: [user4, user5],
    group: group3,
  }).save();

  // Planning
  await Planning.create({
    meal: "Lentilles - gratin dauphinois - Yaourt - Compote",
    snack: "Pain - Chocolat",
    morning_nap: "10h00 - 10h45",
    afternoon_nap: "14h00 - 15h00",
    morning_activities: "Dessins + Peinture",
    afternoon_activities: "Chansons + comptines",
    date: "02/10/2026",
    group: { id: group1.id },
  }).save();

  await Planning.create({
    meal: "Lentilles - gratin dauphinois - Yaourt - Compote",
    snack: "Pain - Chocolat",
    morning_nap: "9h45 - 10h45",
    afternoon_nap: "14h20 - 15h10",
    morning_activities: "Peinture",
    afternoon_activities: "Jeux extérieurs",
    date: "02/10/2026",
    group: { id: group2.id },
  }).save();

  await Planning.create({
    meal: "Lentilles - gratin dauphinois - Yaourt - Compote",
    snack: "Pain - Chocolat",
    morning_nap: "10h00 - 10h30",
    afternoon_nap: "14h45 - 15h30",
    morning_activities: "Paintball",
    afternoon_activities: "Parcours Ninja",
    date: "02/10/2026",
    group: { id: group3.id },
  }).save();

  await Planning.create({
    meal: "Salade de tomates - Haricots verts - Fromage blanc - Compote",
    snack: "Pain - Chocolat",
    morning_nap: "10h00 - 10h30",
    afternoon_nap: "14h30 - 15h15",
    morning_activities: "Diamond painting",
    afternoon_activities: "Comptines + parcours sportif",
    date: "02/11/2026",
    group: { id: group2.id }
  }).save();

  // Report
  await Report.create({
    isPresent: true,
    date: "02/10/2026",
    staff_comment:
      "Super journée pour Ichem ! Il a bien mangé et bien dormi. Il s'est bien amusé sur les chansons",
    baby_mood: baby_moodFormat.Good,
    picture:
      "https://img.freepik.com/photos-gratuite/adorable-bebe-posant-canape_23-2149355591.jpg?semt=ais_hybrid&w=740&q=80",
    child: child1,
  }).save();

  await Report.create({
    isPresent: true,
    date: "02/10/2026",
    staff_comment:
      "Bonne journée dans l'ensemble mais n'a pas dormi : un peu ronchon !",
    baby_mood: baby_moodFormat.Neutral,
    picture:
      "https://img.freepik.com/photos-gratuite/adorable-bebe-posant-canape_23-2149355591.jpg?semt=ais_hybrid&w=740&q=80",
    child: child2,
  }).save();

  await Report.create({
    isPresent: false,
    date: "02/10/2026",
    staff_comment: null,
    baby_mood: baby_moodFormat.NA,
    picture: null,
    child: child3,
  }).save();

  await Report.create({
    isPresent: true,
    date: "02/11/2026",
    staff_comment: "un petit caprice pour faire la sieste mais bonne journée en globale",
    baby_mood: baby_moodFormat.Neutral,
    picture: "https://picsum.photos/200?random=10",
    child: child1,
  }).save();

  await db.destroy();
  console.log("resetDB done successfully!");
}

main();
