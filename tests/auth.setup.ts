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
    // 1. Bypass de la modale "Quoi de neuf ?" V2.0
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v2.0');
    });

    // 2. Navigation vers la page de login
    await page.goto('/login');

    // 3. Remplissage avec les variables d'environnement sécurisées
    await page.fill('input[name="email"]', process.env['TEST_EMAIL']!);
    await page.fill('input[name="password"]', process.env['TEST_PASSWORD']!);

    // 4. Soumission
    await page.click('button[type="submit"]');

    // 5. On attend d'être bien arrivé sur le dashboard
    await page.waitForURL('/dashboard');

    // 6. Sauvegarde de la session (Token JWT) pour les autres tests
    await page.context().storageState({path: authFile});
});