import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html'
})
export class Contact {
  private contactService = inject(ContactService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  sujet = signal('Amélioration / Idée');
  message = signal('');
  isSubmitting = signal(false);

  envoyer() {
    if (!this.message().trim()) {
      this.toastr.warning('Veuillez écrire un message avant d\'envoyer.');
      return;
    }

    this.isSubmitting.set(true);
    this.contactService.envoyerMessage(this.sujet(), this.message())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message, 'Envoyé !');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.toastr.error('Impossible d\'envoyer le message.', 'Erreur');
        }
      });
  }
}