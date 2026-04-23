import { test, expect } from '@playwright/test';

test.describe('Cycle de vie complet d\'un Joueur (CRUD)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/joueurs');
  });

  test('doit Créer, Lire, Modifier et Supprimer un joueur proprement', async ({ page }) => {
    const prenom = 'Robot';
    const nom = 'Playwright';
    const nomCompletInitial = `${prenom} ${nom}`;

    // ==========================================
    // 1. CREATE (Création)
    // ==========================================
    // On utilise ton bouton exact
    await page.locator('button', { hasText: 'Ajouter un joueur' }).click();

    // Grâce à ton code, on peut utiliser les ID exacts de tes inputs ! C'est ultra robuste.
    await page.locator('#prenom').fill(prenom);
    await page.locator('#nom').fill(nom);
    await page.locator('#groupe').selectOption('Equipe 1');
    await page.locator('#nomParent').fill('Papa Robot');
    await page.locator('#tel').fill('0600000000');
    await page.locator('#email').fill('robot@playwright.dev');

    await page.locator('button', { hasText: 'Enregistrer' }).click();

    // ==========================================
    // 2. READ & NAVIGATION (Vers le profil)
    // ==========================================
    // Ton conteneur principal de carte utilise la classe 'group'
    const carteDansListe = page.locator('div.group').filter({ hasText: nomCompletInitial }).first();
    await expect(carteDansListe).toBeVisible();

    // On précise "div" pour éviter le bouton de suppression qui a aussi cette classe
    await carteDansListe.locator('div.cursor-pointer').click();

    // On attend l'apparition du bouton de retour (code du composant détail)
    await expect(page.locator('a', { hasText: /Retour à l'effectif/i })).toBeVisible();

    // ==========================================
    // 3. UPDATE (Modification dans le profil)
    // ==========================================
    // On utilise les boutons exacts de ton mode édition (vus dans le composant précédent)
    await page.locator('button', { hasText: '✏️ Modifier' }).click();
    await page.locator('input[placeholder="Nom Parent"]').fill('Parent Modifié');
    await page.locator('button', { hasText: '💾 Sauvegarder' }).click();

    // On revient sur la liste pour la suite du test
    await page.locator('a', { hasText: /Retour à l'effectif/i }).click();

    // ==========================================
    // 4. DELETE (Suppression depuis la liste)
    // ==========================================
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    // On retrouve la carte dans la liste
    const carteASupprimer = page.locator('div.group').filter({ hasText: nomCompletInitial }).first();
    await expect(carteASupprimer).toBeVisible();

    // 💡 L'ASTUCE POUR TON BOUTON INVISIBLE : 
    // Ton bouton a la classe bg-rose-600/80 et apparait au hover.
    // On dit à Playwright d'ignorer le fait qu'il soit invisible (opacity-0) et de forcer le clic.
    await carteASupprimer.locator('button.bg-rose-600\\/80').click({ force: true });

    // On vérifie que la carte a disparu
    await expect(carteASupprimer).toBeHidden();
  });

});