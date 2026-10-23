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

setup('Authentification globale', async ({ page }) => {
    // Affiche les logs et erreurs JavaScript de la console du navigateur dans le terminal
    page.on('console', msg => console.log(`[CONSOLE ${msg.type()}]: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[CONSOLE ERROR]: ${err.message}`));

    const rawEmail = process.env['TEST_EMAIL'];
    const rawPassword = process.env['TEST_PASSWORD'];

    if (!rawEmail || !rawPassword) {
        throw new Error(
            "Variables d'environnement TEST_EMAIL ou TEST_PASSWORD manquantes. " +
            "Renseignez-les dans tests/.env en local ou dans les Secrets GitHub Actions."
        );
    }

    // Nettoie d'éventuels espaces ou retours à la ligne copiés par inadvertance dans GitHub Secrets
    const email = rawEmail.trim();
    const password = rawPassword.trim();

    // 1. Bypass de la modale "Quoi de neuf ?" V2.1
    await page.addInitScript(() => {
        window.localStorage.setItem('changelog_version', 'v2.1');
    });

    // 2. Navigation vers la page de login
    await page.goto('/login');

    // 3. Remplissage avec les variables d'environnement sécurisées
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // 4. Soumission et écoute de la réponse API
    const [loginResponse] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/auth/login'), { timeout: 15000 }),
        page.click('button[type="submit"]')
    ]);

    const status = loginResponse.status();
    const body = await loginResponse.text().catch(() => '');
    console.log(`[LOGIN API RESULT]: HTTP ${status} - ${body}`);

    if (!loginResponse.ok()) {
        throw new Error(`Le backend a refusé la connexion (HTTP ${status}): ${body}`);
    }

    // 5. On attend d'être bien arrivé sur le dashboard
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // 6. Sauvegarde de la session (Token JWT) pour les autres tests
    await page.context().storageState({ path: authFile });
});
