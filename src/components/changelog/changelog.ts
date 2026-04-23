import { Component, inject, effect, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // 👈 Vérifie le chemin

@Component({
  selector: 'app-changelog',
  standalone: true, // Assure-toi qu'il est standalone
  templateUrl: './changelog.html',
  styleUrl: './changelog.css',
})
export class Changelog {
  private authService = inject(AuthService); // 👈 On injecte l'auth
  
  isVisible = signal(false);
  private readonly CURRENT_VERSION = 'v1.5';

  constructor() {
    // 💡 On utilise un effect pour surveiller l'état de connexion
    effect(() => {
      const estConnecte = this.authService.utilisateurConnecte();
      const savedVersion = localStorage.getItem('changelog_version');

      // On n'affiche la modale QUE si l'utilisateur est connecté ET que la version diffère
      if (estConnecte && savedVersion !== this.CURRENT_VERSION) {
        this.isVisible.set(true);
      } else {
        this.isVisible.set(false);
      }
    });
  }

  fermer() {
    localStorage.setItem('changelog_version', this.CURRENT_VERSION);
    this.isVisible.set(false);
  }
}