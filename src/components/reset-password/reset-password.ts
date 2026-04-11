import { AuthService } from '@/src/services/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit{
private authService = inject(AuthService);
private route = inject(ActivatedRoute);
private router = inject(Router);
private toastr = inject(ToastrService);

token = signal<string | null>(null);
password = signal('');
confirmPassword = signal('');
isLoading = signal(false);

ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    if (params['token']) {
      this.token.set(params['token'])
    }
      
    });
  }

  changerMotDePasse() {
    if (!this.token()) return;
    
    if (this.password() !== this.confirmPassword()) {
      this.toastr.error('Les mots de passe ne correspondent pas.');
      return
    }
    if (this.password().length < 6) {
      this.toastr.warning('Le mot de passe doit faire eu moins 6 caractères.');
      return
    }
    this.isLoading.set(true);
    this.authService.reinitialisationMotDePasse(this.token()!, this.password())
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: (res) => {
        this.toastr.success('Votre mot de pass a été mis à jour!', 'Succès');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Le lien a expiré ou est invalide.', 'Erreur');
      }

      
    });
      
  }
}

