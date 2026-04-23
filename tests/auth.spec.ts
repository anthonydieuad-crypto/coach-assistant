import {test, expect} from '@playwright/test'

test.describe('Page de Connexion', () => {
    test.beforeEach(async({page}) => {
        await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v1.4')
        });
        await page.goto('/login');
    });

    test('doit afficher le titre et le bouton de connexion', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('COACH ASSIST');
        //Vériefie que le bouton contient le texte spécifique dans le HTML
        await expect(page.locator('button[type="submit"]')).toContainText('Entrer dans le vestiaire ⚽');
    });

    test('doit afficher une erreur avec des identifiants invalides', async ({page}) => {
        //On remplit les inputs basés sur tes attributs name ="email" et name="password" 
        await page.fill('input[name="email"]', 'test@mauvais.com');
        await page.fill('input[name="password"]', 'mauvaispass');

        await page.click('button[type="submit"]');

        //On vérifie le paragraphe d'erreur @if(erreur()) apparaît
        const errorMsg = page.locator('p.text-rose-500');
        await expect(errorMsg).toBeVisible();
    })

    test('Doit naviguer vers la page d\'inscription', async ({page}) => {
        //Test du lien "Crée un compte"
        await page.click('text=Créer un compte');
        await expect(page).toHaveURL(/\/signup/);
    });
});