import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private authService = inject(AuthService);

    email = signal('');
    password = signal('');
    erreur = signal('');

    isLoading = signal(false);

    seConnecter() {
        // 👇 2. On active le spinner au début
        this.isLoading.set(true);
        this.erreur.set(''); // On vide les erreurs précédentes

        this.authService.login(this.email(), this.password())
            .pipe(
                // 👇 3. finalize s'exécute TOUJOURS à la fin (succès ou erreur)
                finalize(() => this.isLoading.set(false))
            )
            .subscribe({
                next: (user) => this.authService.gererConnexionReussie(user),
                error: () => this.erreur.set("Email ou mot de passe incorrect ❌")
            });
    }

}