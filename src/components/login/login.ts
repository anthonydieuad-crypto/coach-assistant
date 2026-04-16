import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr'; // 👈 1. Import du service

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    // 👇 2. On injecte le ToastrService avec la méthode moderne inject()
    private authService = inject(AuthService);
    private toastr = inject(ToastrService);
    private router = inject(Router);

    email = signal('');
    password = signal('');
    erreur = signal('');
    isLoading = signal(false);

    seConnecter() {
        this.isLoading.set(true);
        this.erreur.set('');

        this.authService.login(this.email(), this.password())
            .pipe(
                finalize(() => this.isLoading.set(false))
            )
            .subscribe({
                // 👇 3. Correction de la syntaxe ici :
                next: () => {
                    // On affiche le toast
                    this.toastr.success('Heureux de vous revoir, Coach !', 'Connexion réussie');
                    // PUIS on gère la suite
                    this.router.navigate(['/calendrier']);
                },
                error: (err) => {
                    // On affiche le toast d'erreur
                    this.toastr.error('Email ou mot de passe incorrect', 'Oups !');
                    this.erreur.set('Email ou mot de passe incorrect');
                }
            });
    }
}