import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AuthService} from "@/src/services/auth.service";
import { LoaderService } from './services/loader.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    authService = inject(AuthService);
    loaderService = inject(LoaderService);
    isMobileMenuOpen = signal(false);

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }

    closeMobileMenu() {
        this.isMobileMenuOpen.set(false);
    }
}
