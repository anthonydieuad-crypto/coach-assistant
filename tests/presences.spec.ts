import { test, expect } from '@playwright/test';

test.describe('Parcours 5 : Saisie des présences et Bilans', () => {

  test.beforeEach(async ({ page }) => {
    // La session de test (Indépendant) est maintenue
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v2.0');
    });
  });

  test('Doit marquer un joueur présent et valider le calcul des statistiques', async ({ page }) => {
    // ==========================================
    // 1. SAISIE DES PRÉSENCES
    // ==========================================
    await page.goto('/presences');
    await expect(page.locator('h2')).toContainText('Suivi des Présences');

    const carteJoueur = page.locator('div.cursor-pointer', { hasText: 'Kylian Sauvegarde' }).first();
    await expect(carteJoueur).toBeVisible();

    await carteJoueur.click();

    await page.getByRole('button', { name: /Enregistrer les présences/i }).click();
    await expect(page.locator('text=Présences validées et calendrier mis à jour !')).toBeVisible();

    // ==========================================
    // 2. VÉRIFICATION DANS LE BILAN
    // ==========================================
    await page.goto('/bilan-presences');
    await expect(page.locator('h2')).toContainText('Bilan des Présences');

    // FIX : On cible strictement les lignes du tableau (tbody tr) pour éviter d'attraper le conteneur global
    const ligneBilan = page.locator('tbody tr').filter({ hasText: 'Kylian Sauvegarde' }).first();
    await expect(ligneBilan).toBeVisible();

    // On utilise la Regex /%/ sécurisée avec un .first() final
    const pourcentage = ligneBilan.getByText(/%/).first();
    await expect(pourcentage).toBeVisible();
  });
});