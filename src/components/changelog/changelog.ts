import { Component, inject, effect, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './changelog.html',
  styleUrl: './changelog.css',
})
export class Changelog {
  private authService = inject(AuthService);
  
  isVisible = signal(false);
  private readonly CURRENT_VERSION = 'v2.0';

  constructor() {
    effect(() => {
      const estConnecte = this.authService.utilisateurConnecte();
      const savedVersion = localStorage.getItem('changelog_version');
      
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