import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgClass, PercentPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-bilan-presences',
  standalone: true,
  imports: [NgClass, PercentPipe, DatePipe, FormsModule],
  templateUrl: './bilan-presences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilanPresencesComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);

  joueurs = this.joueurService.joueurs;
  evenements = this.evenementService.evenements;

  // Signal pour suivre l'option sélectionnée dans le menu déroulant
  seanceSelectionneeId = signal<string>('all');

  // Filtre et tri les entraînements (du plus récent au plus ancien) pour la liste déroulante
  entrainementsTries = computed(() => {
    return this.evenements()
      .filter(e => e.type === 'training')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  // 1. Total des entraînements
  totalEntrainements = computed(() => {
    return this.entrainementsTries().length;
  });

  // 2. Nombre de présences globales
  getNbPresences(joueurId: number): number {
    return this.entrainementsTries().filter(e => e.participants.includes(joueurId)).length;
  }

  // 3. Taux global
  getTauxPresence(joueurId: number): number {
    const total = this.totalEntrainements();
    if (total === 0) return 0;
    return this.getNbPresences(joueurId) / total;
  }

  // 4. NOUVEAU : Vérifie si le joueur était présent à la séance spécifiquement sélectionnée
  estPresentALaSeance(joueurId: number): boolean {
    const seanceId = Number(this.seanceSelectionneeId());
    const seance = this.entrainementsTries().find(e => e.id === seanceId);
    return seance ? seance.participants.includes(joueurId) : false;
  }
}