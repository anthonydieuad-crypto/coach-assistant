
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal, computed } from '@angular/core';
import { Joueur, groupesJoueur } from '../../models/joueur.model';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';
import { GraphiqueJonglesComponent } from '../graphique-jongles/graphique-jongles.component';

@Component({
  selector: 'app-detail-joueur',
  standalone: true,
  imports: [GraphiqueJonglesComponent],
  templateUrl: './detail-joueur.component.html',
  styleUrls: ['./detail-joueur.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailJoueurComponent implements OnInit {
  @Input({ required: true }) joueur!: Joueur;
  @Output() retourListe = new EventEmitter<void>();
  @Output() supprimerJoueur = new EventEmitter<Joueur>();

  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);
  
  tousLesEvenements = this.evenementService.evenements;
  
  nouveauScore = signal<number | null>(null);
  estGraphiqueAgrandi = signal(false);
  estEnModeEdition = signal(false);
  joueurEditable = signal<Joueur | null>(null);
  
  groupesJoueur = groupesJoueur;

  ngOnInit() {
    this.joueurEditable.set({ ...this.joueur });
  }

  maxJongles = computed(() => {
    if (!this.joueur.historiqueJongles || this.joueur.historiqueJongles.length === 0) {
      return 0;
    }
    return Math.max(...this.joueur.historiqueJongles.map(h => h.score));
  });

  evenementsConvocation = computed(() => {
    return this.tousLesEvenements().filter(event => 
      (event.type === 'plateau' || event.type === 'match'|| event.type === 'tournoi') && event.participants.includes(this.joueur.id)
    );
  });

  ajouterScoreJongles() {
    const score = this.nouveauScore();
    if (score !== null && score >= 0) {
      const today = new Date().toISOString().split('T')[0];
      this.joueurService.ajouterScoreJongle(this.joueur.id, today, score);
      this.nouveauScore.set(null); // Réinitialiser l'input
    }
  }

  gererSaisieJongles(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.nouveauScore.set(value === '' ? null : Number(value));
  }
  
  basculerTailleGraphique() {
    this.estGraphiqueAgrandi.update(value => !value);
  }

  demarrerEdition() {
    this.joueurEditable.set({ ...this.joueur });
    this.estEnModeEdition.set(true);
  }

  annulerEdition() {
    this.joueurEditable.set({ ...this.joueur });
    this.estEnModeEdition.set(false);
  }

  enregistrerChangements() {
    if (this.joueurEditable()) {
      this.joueurService.mettreAJourJoueur(this.joueurEditable()!);
      this.estEnModeEdition.set(false);
    }
  }

  gererSaisieJoueur(field: keyof Joueur, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.joueurEditable.update(p => p ? { ...p, [field]: value === 'null' ? null : value } : null);
  }

  formaterDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}