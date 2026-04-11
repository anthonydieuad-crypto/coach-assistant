import { AuthService } from '@/src/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  email = signal('');
  isLoading = signal(false);
  isSent = signal(false);

  envoyerLien() {
    if(!this.email()) return;
    this.isLoading.set(true);
    this.authService.demanderReinitialisation(this.email())
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: (res) => {
        this.isSent.set(true);
        this.toastr.success(res.message || 'Lien envoyé avec succés', 'Vérifiez vos emails');
      
      },
      error: () => {
        this.toastr.info('Si ce compte existe, un email a été envoyé.', 'Information');
        this.isSent.set(true);
      }
    })
  }

}
