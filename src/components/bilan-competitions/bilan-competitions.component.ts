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

  evenementsCompetition = computed(() => {
    return this.evenements().filter(e =>
        e.type === 'match' || e.type === 'plateau' || e.type === 'tournoi'
    );
  });

  // Liste dynamique de tous les groupes existants dans les événements de compétition
  groupesDynamiques = computed(() => {
    const grpSet = new Set<string>();
    this.evenementsCompetition().forEach(e => {
      if (e.groupe && e.groupe.trim()) {
        grpSet.add(e.groupe.trim());
      }
    });
    this.joueurs().forEach(j => {
      if (j.groupe && j.groupe.trim()) {
        grpSet.add(j.groupe.trim());
      }
    });
    return Array.from(grpSet).sort();
  });

  statsJoueurs = computed(() => {
    const listEvent = this.evenementsCompetition();
    const listJoueurs = this.joueurs();
    const groupes = this.groupesDynamiques();

    const datesUniquesGlobales = new Set(listEvent.map(e => e.date));
    const totalDates = datesUniquesGlobales.size;

    return listJoueurs.map(joueur => {
      const eventsJoues = listEvent.filter(e => e.participants.includes(joueur.id));
      const datesPresence = new Set(eventsJoues.map(e => e.date));
      const nbJoursPresents = datesPresence.size;
      const pourcentage = totalDates > 0 ? (nbJoursPresents / totalDates) : 0;

      // Décompte dynamique par groupe
      const repartitionParGroupe: Record<string, number> = {};
      groupes.forEach(grp => repartitionParGroupe[grp] = 0);

      eventsJoues.forEach(e => {
        if (e.groupe && repartitionParGroupe[e.groupe] !== undefined) {
          repartitionParGroupe[e.groupe]++;
        }
      });

      return {
        joueur,
        nbJoursPresents,
        pourcentage,
        repartitionParGroupe
      };
    }).sort((a, b) => b.pourcentage - a.pourcentage);
  });
}