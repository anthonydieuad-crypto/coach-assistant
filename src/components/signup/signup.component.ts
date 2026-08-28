import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common'; // <-- AJOUT ICI
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [FormsModule, RouterLink, NgClass], // <-- AJOUT ICI
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastr = inject(ToastrService);
    private route = inject(ActivatedRoute);

    nom = signal('');
    prenom = signal('');
    email = signal('');
    password = signal('');
    
    typeCompte = signal<'INDEPENDANT' | 'CLUB'>('INDEPENDANT');
    nomClub = signal(''); 
    
    erreur = signal('');
    isLoading = signal(false);
    invitationToken = signal<string | null>(null);

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['token']) {
                this.invitationToken.set(params['token']);
            }
        });
    }

    sInscrire() {
        if (!this.nom() || !this.prenom() || !this.email() || !this.password()) {
            this.erreur.set("Tous les champs sont obligatoires.");
            return;
        }

        if (!this.invitationToken() && this.typeCompte() === 'CLUB' && !this.nomClub().trim()) {
            this.erreur.set("Le nom du club est obligatoire pour créer une structure.");
            return;
        }

        if (this.password().length < 6) {
            this.erreur.set("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        this.isLoading.set(true);
        this.erreur.set('');

        this.authService.inscription(
            this.nom(), 
            this.prenom(), 
            this.email(), 
            this.password(), 
            this.typeCompte(), 
            this.nomClub(),
            this.invitationToken()
        )
        .pipe(
            finalize(() => this.isLoading.set(false))
        )
        .subscribe({
            next: () => {
                this.toastr.success('Bienvenue dans l\'équipe, Coach !', 'Inscription réussie');
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                console.error("Erreur Backend :", err);
                
                if (err.status === 409) {
                    this.erreur.set("Cet email est déjà utilisé. Veuillez cliquer sur 'Se connecter'.");
                } else if (err.status === 400) {
                    this.erreur.set(err.error?.message || "Les informations saisies sont invalides.");
                } else if (err.error && typeof err.error === 'string') {
                    this.erreur.set(err.error);
                } else {
                    this.erreur.set("Impossible de joindre le serveur. Vérifiez votre connexion.");
                }
            }
        });
    }
}