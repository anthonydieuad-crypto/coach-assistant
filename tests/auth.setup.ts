import { test as setup, expect } from "@playwright/test";
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Recréation de __dirname pour les modules ES (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charge les variables du fichier .env situé dans le MÊME dossier
dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = 'playwright/.auth/user.json';

setup('Authentification globale', async ({page}) => {
    const email = process.env['TEST_EMAIL'];
    const password = process.env['TEST_PASSWORD'];

    if (!email || !password) {
        throw new Error(
            "Variables d'environnement TEST_EMAIL ou TEST_PASSWORD manquantes. " +
            "Renseignez-les dans tests/.env en local ou dans les Secrets GitHub Actions."
        );
    }

    // 1. Bypass de la modale "Quoi de neuf ?" V2.0
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v2.0');
    });

    // 2. Navigation vers la page de login
    await page.goto('/login');

    // 3. Remplissage avec les variables d'environnement sécurisées
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // 4. Soumission
    await page.click('button[type="submit"]');

    // 5. On attend d'être bien arrivé sur le dashboard
    await page.waitForURL('/dashboard');

    // 6. Sauvegarde de la session (Token JWT) pour les autres tests
    await page.context().storageState({path: authFile});
});
