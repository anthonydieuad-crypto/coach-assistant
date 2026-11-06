import { Component, inject, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './login.component.html'
})
export class LoginComponent {
    private authService = inject(AuthService);
    private toastr = inject(ToastrService);
    private router = inject(Router);

    email = signal('');
    password = signal('');
    erreur = signal('');
    isLoading = signal(false);

    // Variables pour gérer l'installation PWA
    deferredPrompt: any = null;
    showInstallButton = signal(false);

    // Écoute de l'événement d'installation
    @HostListener('window:beforeinstallprompt', ['$event'])
    onBeforeInstallPrompt(e: Event) {
        // Empêche le mini-infobar de Chrome d'apparaître
        e.preventDefault();
        // Stocke l'événement pour pouvoir le déclencher plus tard
        this.deferredPrompt = e;
        // Affiche le bouton d'installation dans l'interface
        this.showInstallButton.set(true);
    }

    installerPWA() {
        // Cache le bouton d'installation
        this.showInstallButton.set(false);
        // Déclenche l'invite d'installation native
        this.deferredPrompt.prompt();
        // Attend que l'utilisateur réponde à l'invite
        this.deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('L\'utilisateur a accepté l\'installation');
            } else {
                console.log('L\'utilisateur a refusé l\'installation');
            }
            this.deferredPrompt = null;
        });
    }

    seConnecter() {
        this.isLoading.set(true);
        this.erreur.set('');

        this.authService.login(this.email(), this.password())
            .pipe(
                finalize(() => this.isLoading.set(false))
            )
            .subscribe({
                next: () => {
                    // On affiche le toast
                    this.toastr.success('Heureux de vous revoir, Coach !', 'Connexion réussie');
                    // PUIS on gère la suite
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    // On affiche le toast d'erreur
                    this.toastr.error('Email ou mot de passe incorrect', 'Oups !');
                    this.erreur.set('Email ou mot de passe incorrect');
                }
            });
    }
}