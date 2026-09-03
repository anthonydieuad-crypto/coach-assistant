import { test, expect } from '@playwright/test';

test.describe('Parcours 4 : Feuille de Match (Règles FFF)', () => {

  test.beforeEach(async ({ page }) => {
    // La session est conservée par auth.setup.ts
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v2.0');
    });
  });

  test('Doit bloquer la sélection au-delà de 11 joueurs', async ({ page }) => {
    // 1. INTERCEPTION : On crée 12 faux joueurs à la volée
    await page.route('**/api/joueurs**', async route => {
      const mockJoueurs = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        prenom: `Test ${i + 1}`,
        nom: `Joueur`,
        numeroLicence: `12345678${i}`,
        mutation: false,
        mutationHorsDelai: false
      }));
      await route.fulfill({ json: mockJoueurs });
    });

    await page.goto('/feuille-match');

    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(12);

    // 4. On coche les 11 premiers joueurs via un clic humain sur la carte (label)
    for (let i = 0; i < 11; i++) {
      await page.locator('label').nth(i).click();
    }

    // Le compteur doit indiquer que la limite est atteinte
    await expect(page.locator('text=/11 \\/ 11/')).toBeVisible();
    await expect(checkboxes.nth(11)).toBeDisabled();
    
    // Le message de limite atteinte est affiché
    const texteAvertissement = page.locator('text=Limite de 11 joueurs atteinte.');
    await expect(texteAvertissement).toBeVisible();
  });

  test('Doit respecter la limite des joueurs mutés (FFF : Max 4 dont 1 Hors Délai)', async ({ page }) => {
    // 1. MOCK : Profils inversés (nom, prénom) pour matcher l'affichage {{ joueur.nom }} {{ joueur.prenom }}
    await page.route('**/api/joueurs**', async route => {
      const mockJoueurs = [
        { id: 1, prenom: 'Normal 1', nom: 'Muté', mutation: true, mutationHorsDelai: false },
        { id: 2, prenom: 'Normal 2', nom: 'Muté', mutation: true, mutationHorsDelai: false },
        { id: 3, prenom: 'Normal 3', nom: 'Muté', mutation: true, mutationHorsDelai: false },
        { id: 4, prenom: 'Normal 4', nom: 'Muté', mutation: true, mutationHorsDelai: false },
        { id: 5, prenom: 'Normal 5', nom: 'Muté', mutation: true, mutationHorsDelai: false },
        { id: 6, prenom: 'HD 1', nom: 'Muté', mutation: false, mutationHorsDelai: true },
        { id: 7, prenom: 'HD 2', nom: 'Muté', mutation: false, mutationHorsDelai: true },
      ];
      await route.fulfill({ json: mockJoueurs });
    });

    await page.goto('/feuille-match');

    // ==========================================
    // RÈGLE 1 : MAX 1 JOUEUR HORS DÉLAI
    // ==========================================
    const labelHD1 = page.locator('label', { hasText: 'Muté HD 1' });
    const labelHD2 = page.locator('label', { hasText: 'Muté HD 2' });

    // Clic natif pour déclencher le (click) Angular sans forcer l'état via Playwright
    await labelHD1.click();
    await expect(labelHD1.locator('input')).toBeChecked();

    // Tentative de sélectionner le 2ème HD (bloqué par preventDefault)
    await labelHD2.click();
    
    await expect(page.locator('text=Règlement FFF : 1 seul joueur en Mutation Hors Délai autorisé.')).toBeVisible();
    await expect(labelHD2.locator('input')).not.toBeChecked();

    // ==========================================
    // RÈGLE 2 : MAX 4 JOUEURS MUTÉS AU TOTAL
    // ==========================================
    // On sélectionne 3 mutés "normaux" supplémentaires (pour un total de 4 mutés)
    for (let i = 1; i <= 3; i++) {
      await page.locator('label', { hasText: `Muté Normal ${i}` }).click();
    }

    // Tentative de sélectionner le 5ème muté global
    const labelMute4 = page.locator('label', { hasText: 'Muté Normal 4' });
    await labelMute4.click();

    await expect(page.locator('text=Règlement FFF : 4 joueurs mutés maximum.')).toBeVisible();
    await expect(labelMute4.locator('input')).not.toBeChecked();
  });
});