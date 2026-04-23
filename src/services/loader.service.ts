import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  // 1. On garde une trace du nombre exact de requêtes en cours
  private requetesEnCours = signal(0);

  // 2. Le spinner est visible si le compteur est strictement supérieur à 0
  isLoading = computed(() => this.requetesEnCours() > 0);

  show() {
    // On incrémente le compteur à chaque nouvelle requête
    this.requetesEnCours.update(count => count + 1);
  }

  hide() {
    // On décrémente quand une requête se termine (avec Math.max pour ne jamais descendre sous 0)
    this.requetesEnCours.update(count => Math.max(0, count - 1));
  }
}