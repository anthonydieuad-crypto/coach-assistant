import { test, expect } from '@playwright/test';

test.describe('Parcours 2 : Cycle de vie d\'un Joueur (CRUD)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Le setup d'authentification a déjà connecté le compte coach de test
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v2.0');
    });
    // Navigation directe vers l'effectif
    await page.goto('/joueurs');
  });

  test('Doit Créer, Modifier, Supprimer puis Recréer un joueur', async ({ page }) => {
    const prenom = 'Lionel';
    const nom = 'Testeur';
    const nomComplet = `${prenom} ${nom}`;

    // ==========================================
    // 1. CREATE (Création)
    // ==========================================
    await page.getByRole('button', { name: /ajouter un joueur/i }).click();
    await page.locator('#prenom').fill(prenom);
    await page.locator('#nom').fill(nom);
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    // Vérification de l'apparition de la carte joueur
    const carteJoueur = page.locator('div.group').filter({ hasText: nomComplet }).first();
    await expect(carteJoueur).toBeVisible();

    // ==========================================
    // 2. READ & UPDATE (Modification)
    // ==========================================
    // On clique sur la zone cliquable de la carte pour entrer dans le profil
    await carteJoueur.locator('div.cursor-pointer').first().click();
    await expect(page.locator('a', { hasText: /Retour à l'effectif/i })).toBeVisible();

    // Passage en mode édition
    await page.getByRole('button', { name: /modifier/i }).click();
    await page.locator('input[placeholder="Nom Parent"]').fill('Parent Test');
    await page.getByRole('button', { name: /sauvegarder/i }).click();

    // Retour à la liste
    await page.locator('a', { hasText: /Retour à l'effectif/i }).click();
    await expect(page.locator('h2:has-text("Liste des Joueurs")')).toBeVisible();

    // ==========================================
    // 3. DELETE (Suppression)
    // ==========================================
    // Interception automatique de la boîte de dialogue de confirmation du navigateur
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    const carteASupprimer = page.locator('div.group').filter({ hasText: nomComplet }).first();
    await expect(carteASupprimer).toBeVisible();
    
    // Forcer le clic sur le bouton de suppression qui apparaît normalement au survol
    await carteASupprimer.locator('button.bg-rose-600\\/80').click({ force: true });
    
    await expect(carteASupprimer).toBeHidden();

    // ==========================================
    // 4. RE-CREATE (Garantir un socle de données pour la suite)
    // ==========================================
    await page.getByRole('button', { name: /ajouter un joueur/i }).click();
    await page.locator('#prenom').fill('Kylian');
    await page.locator('#nom').fill('Sauvegarde');
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    const joueurSecours = page.locator('div.group').filter({ hasText: 'Kylian Sauvegarde' }).first();
    await expect(joueurSecours).toBeVisible();
  });
});