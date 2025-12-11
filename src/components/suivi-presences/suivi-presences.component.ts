
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';

@Component({
  selector: 'app-suivi-presences',
  standalone: true,
  imports: [NgClass, NgOptimizedImage],
  templateUrl: './suivi-presences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuiviPresencesComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);
  private router = inject(Router);

  joueurs = this.joueurService.joueurs;

  dateEntrainement = signal(new Date().toISOString().split('T')[0]);
  joueursSelectionnes = signal<Set<number>>(new Set());

  constructor() {
    effect(() => {
      const date = this.dateEntrainement();
      const joueursPresents = this.joueurs()
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
    const date = this.dateEntrainement();
    const idsJoueursPresents = Array.from(this.joueursSelectionnes());

    const entrainement = this.evenementService.evenements().find(e =>
        e.date === date && e.type === 'training'
    );

    if (!entrainement) {
      if (confirm(`Aucun entraînement n'existe le ${this.formaterDate(date)}. Voulez-vous le créer maintenant avec ces joueurs ?`)) {
        this.evenementService.brouillonEvenement.set({
          date: date,
          type: 'training',
          titre: 'Entraînement',
          participants: idsJoueursPresents
        });
        this.router.navigate(['/calendrier']);
      }
      return;
    }

    this.joueurService.enregistrerPresences(idsJoueursPresents, date);

    const entrainementMisAJour = { ...entrainement, participants: idsJoueursPresents };
    this.evenementService.mettreAJourEvenement(entrainementMisAJour);

    alert('Présences enregistrées !');
  }

  private formaterDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
}