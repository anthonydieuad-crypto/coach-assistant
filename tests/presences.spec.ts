import { test, expect } from '@playwright/test';

test.describe('Page Suivi des présences', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/presences');
    });

    test('doit afficher la page et les controles de bases',async ({page}) => {
        await expect(page).toHaveURL(/\/presences/);

        //On vérifie la présence du titre principal
        await expect(page.locator('h2')).toHaveText('Suivi des Présences');

        //Vérification de l'input Date
        await expect(page.locator('input[type="date"]')).toBeVisible();

        //Vérification du bouton
        await expect(page.locator('button', {hasText: 'Enregistrer les présences'})).toBeVisible();
    });

    test('doit basculer l\'état de présence d\'un joueurs', async ({page}) => {
        const ligneJoueur = page.locator('div.cursor-pointer').first();
        await expect(ligneJoueur).toBeVisible();

        const checkbox = ligneJoueur.locator('div.h-6.w-6');
        const estDejaPresent = await checkbox.evaluate(el => el.classList.contains('bg-amber-500'));

        if (estDejaPresent) {
            await ligneJoueur.click();
            await expect(checkbox).toHaveClass(/bg-white/);//Il doit devenir blanc
        }
        //on clique sur la ligne
        await ligneJoueur.click();

        //On verifie le design exact
        await expect(checkbox).toHaveClass(/bg-amber-500/);

        //On verifie la présence du svg dans la case
        await expect(checkbox.locator('svg')).toBeVisible();
    });

    test('doit proposer de créer un évenement si la date et vide', async ({page}) => {
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Voulez-vous le créer maintenant avec ces joueurs ?');
            await dialog.accept();
        });
        //On force une date lointaine pour etre sur que aucun évenement exisste déja à cette date
        await page.locator('input[type="date"]').fill('2099-12-31');

        //On coche le premier joueur
        const ligneJoueur = page.locator('div.cursor-pointer').first();
        await ligneJoueur.click();

        //On enregistre
        await page.locator('button', {hasText: 'Enregistrer les présences'}).click();

        await expect(page).toHaveURL(/\/calendrier/);

    })
})