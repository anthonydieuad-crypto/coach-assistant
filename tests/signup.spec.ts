import { test, expect } from '@playwright/test';

test.describe('Parcours 1 : Inscription d\'un nouveau Coach', () => {

  // FIX 1 : On désactive la session globale pour ce test (Mode navigation privée)
  test.use({ storageState: { cookies: [], origins: [] } });

  const uniqueEmail = `nouveau.coach.${Date.now()}@playwright.dev`;

  test('Un coach indépendant peut créer son compte et accéder au dashboard', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('h1')).toContainText('Rejoindre le Staff');

    const btnIndependant = page.locator('div.cursor-pointer', { hasText: 'Indépendant' }).first();
    await btnIndependant.click();

    await page.locator('input[name="prenom"]').fill('Coach');
    await page.locator('input[name="nom"]').fill('Testeur');
    await page.locator('input[name="email"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill('Securite123!');

    await page.locator('button[type="submit"]').click();

    const toastrMessage = page.locator('text=Bienvenue dans l\'équipe, Coach !');
    await expect(toastrMessage).toBeVisible();

    await expect(page).toHaveURL(/\/dashboard/);

    const contexteSelector = page.locator('app-contexte-selector').first();
    await expect(contexteSelector).toBeVisible();
    
    const selectEquipe = contexteSelector.locator('select').nth(1);
    await expect(selectEquipe.locator('option')).not.toHaveCount(0);
    
    // FIX 2 : Le frontend modifie dynamiquement l'affichage de "Équipe Principale" en "Vue d'ensemble"
    await expect(selectEquipe.locator('option').first()).toContainText("Vue d'ensemble");
  });

});