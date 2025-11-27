
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Joueur } from '../../models/joueur.model';
import { EvenementCalendrier } from '../../models/evenement.model';
import { NgOptimizedImage } from '@angular/common';
import { EvenementService } from '../../services/evenement.service';

type FiltreGroupeJoueur = 'all' | 'Equipe 1' | 'Equipe 2' | 'Equipe 3' | 'none';

@Component({
  selector: 'app-liste-joueurs',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './liste-joueurs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeJoueursComponent {
  @Input({ required: true }) joueurs: Joueur[] = [];
  @Input({ required: true }) evenements: EvenementCalendrier[] = [];
  @Output() voirJoueur = new EventEmitter<Joueur>();
  @Output() ajouterJoueur = new EventEmitter<void>();
  @Output() supprimerJoueur = new EventEmitter<Joueur>();
  
  private evenementService = inject(EvenementService);
  tousLesEvenements = this.evenementService.evenements;
  
  filtreActif = signal<FiltreGroupeJoueur>('all');

  joueursFiltres = computed(() => {
    const filtre = this.filtreActif();
    if (filtre === 'all') {
      return this.joueurs;
    }
    if (filtre === 'none') {
      return this.joueurs.filter(j => !j.groupe);
    }
    return this.joueurs.filter(j => j.groupe === filtre);
  });
  
  totalEntrainements = computed(() => {
    const datesEntrainement = new Set<string>();
    this.joueurs.forEach(joueur => {
        joueur.presences.forEach(date => datesEntrainement.add(date));
    });
    return datesEntrainement.size;
  });

  getMaxJongles(joueur: Joueur): number {
    if (!joueur.historiqueJongles || joueur.historiqueJongles.length === 0) {
      return 0;
    }
    return Math.max(...joueur.historiqueJongles.map(h => h.score));
  }

  getPourcentagePresence(joueur: Joueur): number {
    const total = this.totalEntrainements();
    if (total === 0) {
      return 0;
    }
    const pourcentage = (joueur.presences.length / total) * 100;
    return Math.round(pourcentage);
  }

  definirFiltre(filtre: FiltreGroupeJoueur) {
    this.filtreActif.set(filtre);
  }
}