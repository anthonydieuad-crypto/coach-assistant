
import { ChangeDetectionStrategy, Component, computed, inject, Input, signal, effect } from '@angular/core';
import { Joueur } from '../../models/joueur.model';
import { JoueurService } from '../../services/joueur.service';

@Component({
  selector: 'app-suivi-presences',
  standalone: true,
  imports: [],
  templateUrl: './suivi-presences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuiviPresencesComponent {
  @Input({ required: true }) joueurs: Joueur[] = [];
  
  private joueurService = inject(JoueurService);
  
  dateEntrainement = signal(new Date().toISOString().split('T')[0]);
  joueursSelectionnes = signal<Set<number>>(new Set());
  
  constructor() {
    effect(() => {
      const date = this.dateEntrainement();
      const joueursPresents = this.joueurs
        .filter(p => p.presences.includes(date))
        .map(p => p.id);
      this.joueursSelectionnes.set(new Set(joueursPresents));
    });
  }

  basculerJoueur(joueurId: number) {
    this.joueursSelectionnes.update(ensembleActuel => {
      const nouvelEnsemble = new Set(ensembleActuel);
      if (nouvelEnsemble.has(joueurId)) {
        nouvelEnsemble.delete(joueurId);
      } else {
        nouvelEnsemble.add(joueurId);
      }
      return nouvelEnsemble;
    });
  }

  gererChangementDate(event: Event) {
    const nouvelleDate = (event.target as HTMLInputElement).value;
    this.dateEntrainement.set(nouvelleDate);
  }

  enregistrerPresences() {
    this.joueurService.enregistrerPresences(
      Array.from(this.joueursSelectionnes()),
      this.dateEntrainement()
    );
    alert('Présences enregistrées !');
  }
}