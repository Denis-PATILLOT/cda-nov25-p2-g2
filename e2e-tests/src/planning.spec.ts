import { expect, test } from "@playwright/test";
import { connectDB, disconnectDB } from "./dbHelpers";
import { hash } from "argon2";
import { User, UserRole } from "../../backend/src/entities/User";
import { clearDB } from "../../backend/src/db";
import { Group } from "../../backend/src/entities/Group";
import { Planning } from "../../backend/src/entities/Planning";

test.beforeAll(connectDB);
test.beforeEach(clearDB);
test.afterAll(disconnectDB);

test('should be able to connect and create a planning', async ({ page }) => {
    const email = "den@den.com"
    const password = "Password123!"

    const group1 = await Group.create({
        name: "Petite section",
        capacity: 8
    }).save();

    await User.create({
        email,
        hashedPassword: await hash(password),
        first_name: "Den",
        last_name: "Pat",
        phone: "0660405030",
        role: UserRole.Staff,
        group: group1
    }).save();

    expect((await Planning.find()).length).toBe(0);  // on vérifie qu'il n'y a aucun planning existant

    await page.goto("/");

    await page.getByTitle('Email').fill(email);
    await page.getByTitle('Mot de passe').fill(password);

    await page.getByRole('button', { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/staff");
    await expect(page).toHaveTitle("BabyBoard - Staff");
    await page.getByTitle("plannings").click();
    await expect(page).toHaveURL("/staff/planning");
    await page.getByRole('button', { name: "Créer planning" }).click();

    await page.getByTitle("date du planning").fill("2026-04-01");
    await page.getByLabel("Activité matin").fill("cache cache");
    await page.getByLabel("Sieste matin").fill("9h30 - 10h00");
    await page.getByLabel("Repas midi").fill("Steack frites");
    await page.getByLabel("Activité après-midi").fill("comptines");
    await page.getByLabel("Sieste après-midi").fill("14h00 - 14h30");
    await page.getByLabel("Goûter").fill("pain et chocolat");
    await page.getByRole('button', { name: "Valider" }).click();

    await expect(page).toHaveURL("/staff/planning/1");
    await expect(page.getByTestId("planning-created")).toBeVisible();
    await expect(page.getByTestId("planning-created")).toContainText("Planning créé avec succès");

})