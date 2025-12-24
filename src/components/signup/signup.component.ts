import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './signup.component.html'
})
export class SignupComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    nom = signal('');
    prenom = signal('');
    email = signal('');
    password = signal('');
    erreur = signal('');
    succes = signal('');

    isLoading = signal(false);

    sInscrire() {
        if (!this.nom() || !this.prenom() || !this.email() || !this.password()) {
            this.erreur.set("Tous les champs sont obligatoires.");
            return;
        }

        // 👇 2. On lance le chargement
        this.isLoading.set(true);
        this.erreur.set('');

        this.authService.inscription(this.nom(), this.prenom(), this.email(), this.password())
            .pipe(
                // 👇 3. On arrête le chargement à la fin
                finalize(() => this.isLoading.set(false))
            )
            .subscribe({
                next: (user) => {
                    this.authService.gererConnexionReussie(user);
                },
                error: (err) => {
                    console.error(err);
                    this.erreur.set("Erreur lors de l'inscription. Cet email est peut-être déjà utilisé.");
                }
            });
    }
}