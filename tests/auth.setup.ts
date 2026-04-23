import { test as setup, expect } from "@playwright/test";

const authFile = 'playwright/.auth/user.json';

setup('Authentification globale', async ({page}) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v1.5');
    });
    //Navigation vers la page de login
    await page.goto('/login');

    //Remplissage avec les identifiants valides
    await page.fill('input[name="email"]', 'test@test');
    await page.fill('input[name="password"]', 'test123');

    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');

    await page.context().storageState({path: authFile});

});