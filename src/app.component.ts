import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from "@/src/services/auth.service";
import { LoaderService } from './services/loader.service';
import { Changelog } from "./components/changelog/changelog";
import { ContexteSelector } from './components/contexte-selector/contexte-selector';
import { SwUpdate } from '@angular/service-worker';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        Changelog,
        ContexteSelector
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    authService = inject(AuthService);
    loaderService = inject(LoaderService);
    swUpdate = inject(SwUpdate);

    constructor() {
        // Surveille les nouvelles versions
        if (this.swUpdate.isEnabled) {
            this.swUpdate.versionUpdates.subscribe(event => {
                // Si une nouvelle version est prête (téléchargée en arrière-plan)
                if (event.type === 'VERSION_READY') {
                    // On recharge la page pour activer la nouvelle version
                    window.location.reload();
                }
            });
        }
    }

    isMobileMenuOpen = signal(false);
    isGenerateMenuOpen = signal(false);

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }

    // Fonctions pour le dropdown
    toggleGenerateMenu() {
        this.isGenerateMenuOpen.update(v => !v);
    }

    closeMenus() {
        this.isMobileMenuOpen.set(false);
        this.isGenerateMenuOpen.set(false);
    }
}
