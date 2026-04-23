import { test, expect } from "@playwright/test";

test.describe('Page Calendrier (Connecté)' , () => {
    test('doit afficher la page du calendrier directement', async ({page}) => {
        await page.goto('/dashboard');

        await expect(page).toHaveURL('/dashboard');
    })
})