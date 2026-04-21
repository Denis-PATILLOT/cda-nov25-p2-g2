import { expect, test } from "@playwright/test";
import { connectDB, disconnectDB } from "./dbHelpers";
import { hash } from "argon2";
import { User, UserRole } from "../../backend/src/entities/User";
import { clearDB } from "../../backend/src/db";
import { Group } from "../../backend/src/entities/Group";

test.beforeAll(connectDB);
test.beforeEach(clearDB);
test.afterAll(disconnectDB);

test('should not be able to connect with bad credentials', async ({ page }) => {
    const email = "dave.lopper@app.com"
    const password = "SuperP@ssW0rd!"

    await User.create({
        email,
        hashedPassword: await hash(password),
        first_name: "Den",
        last_name: "Pat",
        phone: "0660405030",
        role: UserRole.Parent
    }).save();

    await page.goto("/");

    await page.getByTitle('Email').fill(email);
    await page.getByTitle('Mot de passe').fill("Password123!");

    await page.getByRole('button', { name: "Se connecter" }).click();
    await expect(page.getByTestId('test-error')).toBeVisible();
})

test('should be able to connect with good credentials (parent)', async ({ page }) => {
    const email = "dave.lopper@app.com"
    const password = "SuperP@ssW0rd!"

    await User.create({
        email,
        hashedPassword: await hash(password),
        first_name: "Den",
        last_name: "Pat",
        phone: "0660405030",
        role: UserRole.Parent
    }).save();

    await page.goto("/");

    await page.getByTitle('Email').fill(email);
    await page.getByTitle('Mot de passe').fill(password);

    await page.getByRole('button', { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/parent");
    await expect(page).toHaveTitle("BabyBoard - Accueil parent");
})

test('should be able to connect with good credentials (staff)', async ({ page }) => {
    const email = "dave.lopper@app.com"
    const password = "SuperP@ssW0rd!"
    const group = await Group.create({
        name: "Petite Section",
        capacity: 8
    }).save();

    await User.create({
        email,
        hashedPassword: await hash(password),
        first_name: "Den",
        last_name: "Pat",
        phone: "0660405030",
        role: UserRole.Staff,
        group: group
    }).save();

    await page.goto("/");

    await page.getByTitle('Email').fill(email);
    await page.getByTitle('Mot de passe').fill(password);

    await page.getByRole('button', { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/staff");
    await expect(page).toHaveTitle("BabyBoard - Staff");
})


test('should have an error with bad email format', async ({ page }) => {

    await page.goto("/");

    await page.getByTitle('Email').fill("den@");
    await page.getByTitle('Mot de passe').fill("Password123!");  

    await page.getByRole('button', { name: "Se connecter" }).click();
    await expect(page.getByTestId('error-email')).toBeVisible();
    await expect(page.getByTestId('error-email')).toHaveText("email non valide");
})

test('should have an error with bad password format', async ({ page }) => { // valeur de 8 min avec pattern à respecter (au moins 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial parmi @$!%*?&)

    await page.goto("/");

    await page.getByTitle('Email').fill("den@app.com");
    await page.getByTitle('Mot de passe').fill("BadPassword");

    await page.getByRole('button', { name: "Se connecter" }).click();
    await expect(page.getByTestId('error-password')).toBeVisible();
    await expect(page.getByTestId('error-password')).toHaveText("Le mot de passe doit contenir minuscule, majuscule, chiffre et caractère spécial");
})