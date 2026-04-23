import { test, expect } from "@playwright/test";

test.describe('Page Dashboard (Connecté)' , () => {
    test('doit afficher la page du dashboard directement', async ({page}) => {
        await page.goto('/dashboard');

        await expect(page).toHaveURL('/dashboard');
    })
})