import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-bilan-competitions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bilan-competitions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilanCompetitionsComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);

  joueurs = this.joueurService.joueurs;
  evenements = this.evenementService.evenements;

  // 1. On filtre les événements de type compétition
  evenementsCompetition = computed(() => {
    return this.evenements().filter(e =>
        e.type === 'match' || e.type === 'plateau' || e.type === 'tournoi'
    );
  });

  // 2. Calcul des statistiques avancées
  statsJoueurs = computed(() => {
    const listEvent = this.evenementsCompetition();
    const listJoueurs = this.joueurs();

    // Calcul du nombre de DATES UNIQUES où il y a eu de l'activité
    // (Ex: Si Samedi il y a Plateau Grp 1 ET Plateau Grp 2, ça compte pour 1 seule opportunité)
    const datesUniquesGlobales = new Set(listEvent.map(e => e.date));
    const totalDates = datesUniquesGlobales.size;

    return listJoueurs.map(joueur => {
      // Les événements où le joueur était présent
      const eventsJoues = listEvent.filter(e => e.participants.includes(joueur.id));

      // Ses dates de présence uniques
      const datesPresence = new Set(eventsJoues.map(e => e.date));
      const nbJoursPresents = datesPresence.size;

      // Le pourcentage est basé sur les dates, pas sur le nombre de matchs
      const pourcentage = totalDates > 0 ? (nbJoursPresents / totalDates) : 0;

      // Répartition par groupe
      let grp1 = 0, grp2 = 0, grp3 = 0;
      eventsJoues.forEach(e => {
        if (e.groupe === 'Equipe 1') grp1++;
        if (e.groupe === 'Equipe 2') grp2++;
        if (e.groupe === 'Equipe 3') grp3++;
      });

      return {
        joueur,
        nbJoursPresents,
        pourcentage,
        details: { grp1, grp2, grp3 }
      };
    }).sort((a, b) => b.pourcentage - a.pourcentage); // Tri automatique du meilleur taux au plus bas
  });
}