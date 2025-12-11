import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgClass, PercentPipe } from '@angular/common';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-bilan-presences',
  standalone: true,
  imports: [NgClass, PercentPipe],
  templateUrl: './bilan-presences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilanPresencesComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);

  joueurs = this.joueurService.joueurs;
  evenements = this.evenementService.evenements;

  // 1. Total des entraînements = Nombre d'événements de type 'training' dans le calendrier
  totalEntrainements = computed(() => {
    return this.evenements().filter(e => e.type === 'training').length;
  });

  // 2. Nouvelle méthode : On compte les présences en regardant le Calendrier
  getNbPresences(joueurId: number): number {
    return this.evenements().filter(e =>
        e.type === 'training' && e.participants.includes(joueurId)
    ).length;
  }

  // 3. Le taux est basé sur ce nouveau calcul
  getTauxPresence(joueurId: number): number {
    const total = this.totalEntrainements();
    if (total === 0) return 0;
    return this.getNbPresences(joueurId) / total;
  }
}