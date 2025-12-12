import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

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
    isMobileMenuOpen = signal(false);

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }

    closeMobilMenu() {
        this.isMobileMenuOpen.set(false);
    }
}
