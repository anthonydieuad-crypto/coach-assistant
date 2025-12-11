import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-bilan-competitions',
  standalone: true,
  imports: [],
  templateUrl: './bilan-competitions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilanCompetitionsComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);

  // 👇 On récupère les signaux
  joueurs = this.joueurService.joueurs;
  evenements = this.evenementService.evenements;

  // Filtre pour ne garder que les compétitions (Matchs, Plateaux, Tournois)
  evenementsCompetition = computed(() => {
    return this.evenements().filter(e =>
        e.type === 'match' || e.type === 'plateau' || e.type === 'tournoi'
    );
  });

  // Helper pour compter les convocations d'un joueur
  getNbConvocations(joueurId: number): number {
    return this.evenementsCompetition().filter(e => e.participants.includes(joueurId)).length;
  }
}