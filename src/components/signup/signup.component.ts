import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './signup.component.html'
})
export class SignupComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastr = inject(ToastrService);

    nom = signal('');
    prenom = signal('');
    email = signal('');
    password = signal('');
    erreur = signal('');
    succes = signal('');

    isLoading = signal(false);

    sInscrire() {
        // 1. Vérification des champs vides
        if (!this.nom() || !this.prenom() || !this.email() || !this.password()) {
            this.erreur.set("Tous les champs sont obligatoires.");
            return;
        }

        // 2. Sécurité : Vérification de la taille du mot de passe
        if (this.password().length < 6) {
            this.erreur.set("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        this.isLoading.set(true);
        this.erreur.set('');

        this.authService.inscription(this.nom(), this.prenom(), this.email(), this.password())
            .pipe(
                finalize(() => this.isLoading.set(false))
            )
            .subscribe({
                next: () => {
                    this.toastr.success('Bienvenue dans l\'équipe, Coach !', 'Inscription réussie');
                },
                error: (err) => {
                    console.error("Erreur Backend :", err);
                    
                    // 3. Gestion ciblée des erreurs du serveur
                    if (err.status === 409) {
                        this.erreur.set("Cet email est déjà utilisé. Veuillez cliquer sur 'Se connecter'.");
                    } else if (err.status === 400) {
                        this.erreur.set("Les informations saisies sont invalides.");
                    } else if (err.error && typeof err.error === 'string') {
                        // Si le backend renvoie un message texte précis
                        this.erreur.set(err.error);
                    } else {
                        // Problème réseau ou serveur crashé
                        this.erreur.set("Impossible de joindre le serveur. Vérifiez votre connexion.");
                    }
                }
            });
    }
}