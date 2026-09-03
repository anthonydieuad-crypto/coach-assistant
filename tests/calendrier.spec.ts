import { test, expect } from '@playwright/test';

test.describe('Parcours 3 : Cycle de vie complet du Calendrier', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v2.0');
    });
    await page.goto('/calendrier');
  });

  test('Doit Créer, Modifier puis Supprimer un événement, et en recréer un pour les bilans', async ({ page }) => {
    const timestamp = Date.now();
    const titreEvent = `Match Initial ${timestamp}`;
    const titreModifie = `Match Modifié ${timestamp}`;
    const titreFinal = `Match Officiel ${timestamp}`;

    // ==========================================
    // 1. CREATE (Création)
    // ==========================================
    await page.getByRole('button', { name: /Ajouter/i }).click();
    await page.locator('#event-type').selectOption('match');
    await page.locator('#event-title').fill(titreEvent);
    await page.locator('#event-location').fill('Stade Domicile');
    
    // Convoquer notre joueur de test
    await page.locator('label', { hasText: 'Kylian Sauvegarde' }).locator('input').check();
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    // Vérification de l'apparition sur la grille
    const eventDansGrille = page.locator('div.font-semibold', { hasText: titreEvent }).first();
    await expect(eventDansGrille).toBeVisible();

    // ==========================================
    // 2. UPDATE (Modification)
    // ==========================================
    // Clic sur l'événement dans le calendrier pour l'éditer
    await eventDansGrille.click(); 
    await expect(page.locator('h3', { hasText: 'Modifier un événement' })).toBeVisible();
    
    // Modification du titre et du lieu
    await page.locator('#event-title').fill(titreModifie);
    await page.locator('#event-location').fill('Stade Extérieur');
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    // Vérification de la mise à jour visuelle
    const eventModifie = page.locator('div.font-semibold', { hasText: titreModifie }).first();
    await expect(eventModifie).toBeVisible();
    await expect(eventDansGrille).toBeHidden();

    // ==========================================
    // 3. DELETE (Suppression)
    // ==========================================
    await eventModifie.click();
    
    // Interception de la modale de confirmation native du navigateur
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    
    // Clic sur le bouton de suppression (qui n'existe que dans le mode édition)
    await page.getByRole('button', { name: /Supprimer/i }).click();

    // Vérification de la disparition de la grille
    await expect(eventModifie).toBeHidden();

    // ==========================================
    // 4. RE-CREATE (Garantir un socle de données)
    // ==========================================
    // On recrée un entraînement propre pour pouvoir tester la page de présences ensuite
    await page.getByRole('button', { name: /Ajouter/i }).click();
    await page.locator('#event-type').selectOption('training'); // Type entraînement requis pour le bilan de présence
    await page.locator('#event-title').fill('Entraînement de Test');
    await page.locator('#event-location').fill('Terrain Synthétique');
    await page.locator('label', { hasText: 'Kylian Sauvegarde' }).locator('input').check();
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    await expect(page.locator('div.font-semibold', { hasText: 'Entraînement de Test' }).first()).toBeVisible();
  });
});