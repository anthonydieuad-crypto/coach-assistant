import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // 👈 Ajout Import

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink], // 👈 Ajout Import ici aussi
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);

  email = signal('');
  password = signal('');
  erreur = signal('');

  seConnecter() {
    this.authService.login(this.email(), this.password()).subscribe({
      next: (user) => this.authService.gererConnexionReussie(user),
      error: () => this.erreur.set("Email ou mot de passe incorrect ❌")
    });
  }
}