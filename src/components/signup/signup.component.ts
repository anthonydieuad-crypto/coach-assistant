import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

    sInscrire() {
        // Validation simple
        if (!this.nom() || !this.prenom() || !this.email() || !this.password()) {
            this.erreur.set("Tous les champs sont obligatoires.");
            return;
        }

        this.authService.inscription(this.nom(), this.prenom(), this.email(), this.password()).subscribe({
            next: (user) => {
                // On connecte directement l'utilisateur après l'inscription
                this.authService.gererConnexionReussie(user);
            },
            error: (err) => {
                console.error(err);
                this.erreur.set("Erreur lors de l'inscription. Cet email est peut-être déjà utilisé.");
            }
        });
    }
}