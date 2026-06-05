import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-create-club',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-club.component.html'
})
export class CreateClubComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastr = inject(ToastrService);

    nomClub = signal('');
    erreur = signal('');
    isLoading = signal(false);

    creerMonClub() {
        // Vérification de base
        if (!this.nomClub() || this.nomClub().trim().length < 3) {
            this.erreur.set("Le nom du club doit contenir au moins 3 caractères.");
            return;
        }

        this.isLoading.set(true);
        this.erreur.set('');

        this.authService.creerClub(this.nomClub())
            .pipe(
                finalize(() => this.isLoading.set(false))
            )
            .subscribe({
                next: () => {
                    this.toastr.success('Votre espace de travail est prêt !', 'Club créé');
                    // Une fois le club créé, on l'envoie sur le dashboard
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    console.error("Erreur Backend :", err);
                    
                    if (err.error && typeof err.error === 'string') {
                        this.erreur.set(err.error);
                    } else if (err.error && err.error.erreur) {
                        this.erreur.set(err.error.erreur);
                    } else {
                        this.erreur.set("Impossible de créer le club. Vérifiez votre connexion.");
                    }
                }
            });
    }
}