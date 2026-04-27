import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AuthService} from "@/src/services/auth.service";
import { LoaderService } from './services/loader.service';
import { Changelog } from "./components/changelog/changelog";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Changelog
],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    authService = inject(AuthService);
    loaderService = inject(LoaderService);
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
