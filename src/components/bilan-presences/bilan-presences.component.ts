import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgClass, PercentPipe } from '@angular/common';
import { JoueurService } from '../../services/joueur.service';

@Component({
  selector: 'app-bilan-presences',
  standalone: true,
  imports: [NgClass, PercentPipe],
  templateUrl: './bilan-presences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilanPresencesComponent {
  // 👇 1. On se connecte au service
  private joueurService = inject(JoueurService);

  // 👇 2. On récupère le signal des joueurs
  joueurs = this.joueurService.joueurs;

  // Calcul du nombre total d'entraînements (basé sur l'ensemble des dates enregistrées)
  totalEntrainements = computed(() => {
    const datesUniques = new Set<string>();
    this.joueurs().forEach(j => {
      j.presences.forEach(date => datesUniques.add(date));
    });
    return datesUniques.size;
  });

  getTauxPresence(joueur: any): number {
    const total = this.totalEntrainements();
    if (total === 0) return 0;
    return joueur.presences.length / total;
  }
}