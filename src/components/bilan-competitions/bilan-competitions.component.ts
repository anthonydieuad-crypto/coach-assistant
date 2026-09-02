import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-bilan-competitions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bilan-competitions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilanCompetitionsComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);

  joueurs = this.joueurService.joueurs;
  evenements = this.evenementService.evenements;

  evenementSelectionneId = signal<string>('all');

  // VERROU TEMPOREL RESTAURÉ
  evenementsCompetition = computed(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return this.evenements().filter(e =>
        (e.type === 'match' || e.type === 'plateau' || e.type === 'tournoi') && e.date <= todayStr
    );
  });

  evenementsCompetitionTries = computed(() => {
    return [...this.evenementsCompetition()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

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

  estPresentA(joueurId: number): boolean {
    const evId = Number(this.evenementSelectionneId());
    const ev = this.evenementsCompetition().find(e => e.id === evId);
    return ev ? ev.participants.includes(joueurId) : false;
  }
}