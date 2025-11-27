
import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { Joueur } from '../../models/joueur.model';

@Component({
  selector: 'app-bilan-presences',
  standalone: true,
  templateUrl: './bilan-presences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilanPresencesComponent {
  @Input({ required: true }) joueurs: Joueur[] = [];
  
  datesEntrainement = computed(() => {
    const toutesLesDates = new Set<string>();
    this.joueurs.forEach(joueur => {
        joueur.presences.forEach(date => toutesLesDates.add(date));
    });
    return Array.from(toutesLesDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  });

  statsJoueur = computed(() => {
    const dates = this.datesEntrainement();
    return this.joueurs.map(joueur => {
      const presences = joueur.presences.length;
      const absences = dates.length - presences;
      return { ...joueur, presences, absences };
    });
  });

  statsDate = computed(() => {
    const dates = this.datesEntrainement();
    return dates.map(date => {
        const presents = this.joueurs.filter(p => p.presences.includes(date)).length;
        return { date, presents };
    });
  });

  estJoueurPresent(joueur: Joueur, date: string): boolean {
    return joueur.presences.includes(date);
  }

  formaterDate(dateString: string): string {
    const date = new Date(dateString);
    // Retourne le format JJ/MM
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }
}