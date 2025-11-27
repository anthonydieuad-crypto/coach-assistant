
import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { Joueur } from '../../models/joueur.model';
import { EvenementService } from '../../services/evenement.service';
import { EvenementCalendrier } from '../../models/evenement.model';

@Component({
  selector: 'app-bilan-competitions',
  standalone: true,
  templateUrl: './bilan-competitions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilanCompetitionsComponent {
  @Input({ required: true }) joueurs: Joueur[] = [];

  private evenementService = inject(EvenementService);
  tousLesEvenements = this.evenementService.evenements;

  evenementsCompetition = computed(() => {
    return this.tousLesEvenements()
      .filter(e => e.type === 'match' || e.type === 'plateau')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  statsJoueur = computed(() => {
    const evenements = this.evenementsCompetition();
    return this.joueurs.map(joueur => {
      const nombreConvocations = evenements.filter(e => e.participants.includes(joueur.id)).length;
      return { ...joueur, nombreConvocations };
    });
  });

  estJoueurParticipant(joueur: Joueur, evenement: EvenementCalendrier): boolean {
    return evenement.participants.includes(joueur.id);
  }

  formaterDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }
}