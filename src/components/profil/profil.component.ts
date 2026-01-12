import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-profil',
    standalone: true,
    imports: [],
    templateUrl: './profil.component.html'
})
export class ProfilComponent {
    // On injecte le service d'authentification en public pour l'utiliser dans le HTML
    public authService = inject(AuthService);
    private router = inject(Router);
    private toastr = inject(ToastrService);

    seDeconnecter() {
        const user = this.authService.utilisateurConnecte();
                const prenom = user?.prenom || 'Coach';

        this.authService.logout();

        //Message de déconnexion
        this.toastr.success(`À bientôt ${prenom} !`, 'Déconnexion réussie', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-right'
          });

          this.router.navigate(['/login']);
        }
    }