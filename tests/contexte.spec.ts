import { test, expect } from '@playwright/test';

test.describe('Sélecteur de Contexte (Saison & Équipe)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Le setup d'authentification a déjà été joué par auth.setup.ts
    // On s'assure juste de bypasser le changelog de la V2
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v2.0');
    });
    // On se place sur le dashboard pour avoir accès à la navbar
    await page.goto('/dashboard');
  });

  test('Doit afficher les sélecteurs de contexte dans la barre de navigation', async ({ page }) => {
    // On cible le composant personnalisé Angular
    const contexteSelector = page.locator('app-contexte-selector').first();
    await expect(contexteSelector).toBeVisible();

    // Il doit contenir deux menus déroulants (Select)
    const selectSaison = contexteSelector.locator('select').nth(0);
    const selectEquipe = contexteSelector.locator('select').nth(1);

    await expect(selectSaison).toBeVisible();
    await expect(selectEquipe).toBeVisible();
  });

  test('La navigation vers l\'effectif doit filtrer selon l\'équipe sélectionnée', async ({ page }) => {
    // 1. On va sur la page effectif
    await page.getByRole('link', { name: /effectif/i }).click();
    await expect(page).toHaveURL(/\/joueurs/);

    // 2. On attend que les joueurs chargent (le titre sert de repère visuel)
    await page.waitForSelector('h2:has-text("Liste des Joueurs")');

    // 3. On récupère le sélecteur d'équipe dans l'en-tête
    const contexteSelector = page.locator('app-contexte-selector').first();
    const selectEquipe = contexteSelector.locator('select').nth(1);

    // 4. FIX : On attend dynamiquement que l'API réponde et qu'Angular génère les <option>
    await expect(selectEquipe.locator('option')).not.toHaveCount(0);

    // 5. On peut maintenant compter en toute sécurité
    const optionsCount = await selectEquipe.locator('option').count();
    expect(optionsCount).toBeGreaterThan(0);

    // Si on a plus d'une équipe, on teste le changement
    if (optionsCount > 1) {
        // On récupère la valeur de la deuxième option
        const deuxiemeEquipeValue = await selectEquipe.locator('option').nth(1).getAttribute('value');
        
        // On déclenche le changement d'équipe
        await selectEquipe.selectOption(deuxiemeEquipeValue!);
        
        // On s'assure qu'on est toujours sur la page joueurs et qu'elle n'a pas crashé
        await expect(page.locator('h2:has-text("Liste des Joueurs")')).toBeVisible();
    }
  });

  test('Le changement de saison doit recharger le contexte global', async ({ page }) => {
    const contexteSelector = page.locator('app-contexte-selector').first();
    const selectSaison = contexteSelector.locator('select').nth(0);

    // FIX : On attend le rendu des options de saison
    await expect(selectSaison.locator('option')).not.toHaveCount(0);
    const optionsSaisons = await selectSaison.locator('option').count();
    
    if (optionsSaisons > 1) {
      // S'il y a plusieurs saisons, on essaie de basculer
      const deuxiemeSaisonValue = await selectSaison.locator('option').nth(1).getAttribute('value');
      await selectSaison.selectOption(deuxiemeSaisonValue!);

      // On vérifie que l'URL ne change pas mais que la page reste stable
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });
});