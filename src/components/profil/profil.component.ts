import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-profil',
    standalone: true,
    imports: [],
    templateUrl: './profil.component.html'
})
export class ProfilComponent {
    // On injecte le service d'authentification en public pour l'utiliser dans le HTML
    public authService = inject(AuthService);

    seDeconnecter() {
        if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
            this.authService.logout();
        }
    }
}