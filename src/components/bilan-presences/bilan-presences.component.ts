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

  seanceSelectionneeId = signal<string>('all');

  // VERROU TEMPOREL RESTAURÉ
  entrainementsTries = computed(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return this.evenements()
      .filter(e => e.type === 'training' && e.date <= todayStr)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  totalEntrainements = computed(() => {
    return this.entrainementsTries().length;
  });

  getNbPresences(joueurId: number): number {
    return this.entrainementsTries().filter(e => e.participants.includes(joueurId)).length;
  }

  getTauxPresence(joueurId: number): number {
    const total = this.totalEntrainements();
    if (total === 0) return 0;
    return this.getNbPresences(joueurId) / total;
  }

  estPresentALaSeance(joueurId: number): boolean {
    const seanceId = Number(this.seanceSelectionneeId());
    const seance = this.entrainementsTries().find(e => e.id === seanceId);
    return seance ? seance.participants.includes(joueurId) : false;
  }
}