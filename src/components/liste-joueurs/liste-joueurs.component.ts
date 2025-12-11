import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';
import { GroupeJoueur, Joueur } from '../../models/joueur.model';
import {Router} from "@angular/router";

type FiltreGroupeJoueur = 'all' | 'Equipe 1' | 'Equipe 2' | 'Equipe 3' | 'none';

@Component({
  selector: 'app-liste-joueurs',
  standalone: true,
  imports: [NgOptimizedImage,NgClass],
  templateUrl: './liste-joueurs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeJoueursComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);
  private router = inject(Router);

  // 2. On récupère les données directement depuis les services
  joueurs = this.joueurService.joueurs;
  tousLesEvenements = this.evenementService.evenements;

  // 3. Logique de filtrage (inchangée)
  filtreActif = signal<FiltreGroupeJoueur>('all');

  joueursFiltres = computed(() => {
    const filtre = this.filtreActif();
    if (filtre === 'all') return this.joueurs();
    if (filtre === 'none') return this.joueurs().filter(j => !j.groupe);
    return this.joueurs().filter(j => j.groupe === filtre);
  });

  totalEntrainements = computed(() => {
    const datesEntrainement = new Set<string>();
    this.joueurs().forEach(joueur => {
      joueur.presences.forEach(date => datesEntrainement.add(date));
    });
    return datesEntrainement.size;
  });

  // 4. Logique d'AJOUT (récupérée de AppComponent)
  estModaleAjoutJoueurOuverte = signal(false);

  nouveauJoueur = signal({
    prenom: '',
    nom: '',
    nomParent: '',
    telParent: '',
    emailParent: '',
    groupe: null as GroupeJoueur | null,
  });

  // --- MÉTHODES ---
  voirDetailJoueur(joueur: Joueur) {
    // On navigue vers /joueurs/12 (par exemple)
    this.router.navigate(['/joueurs', joueur.id]);
  }

  definirFiltre(filtre: FiltreGroupeJoueur) {
    this.filtreActif.set(filtre);
  }

  // Ouverture modale
  gererDemandeAjoutJoueur() {
    this.nouveauJoueur.set({
      prenom: '', nom: '', nomParent: '', telParent: '', emailParent: '', groupe: null,
    });
    this.estModaleAjoutJoueurOuverte.set(true);
  }

  fermerModaleAjoutJoueur() {
    this.estModaleAjoutJoueurOuverte.set(false);
  }

  // Sauvegarde
  enregistrerNouveauJoueur() {
    const j = this.nouveauJoueur();
    // Validation simple
    if (j.prenom && j.nom) {
      this.joueurService.ajouterJoueur(j);
      this.fermerModaleAjoutJoueur();
    } else {
      alert("Le prénom et le nom sont obligatoires.");
    }
  }

  // Gestion des champs du formulaire
  gererSaisieNouveauJoueur(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // @ts-ignore
    this.nouveauJoueur.update(j => ({ ...j, [field]: value === 'null' ? null : value }));
  }

  // Suppression
  gererSupprimerJoueur(joueur: Joueur) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${joueur.prenom} ${joueur.nom} ?`)) {
      this.joueurService.supprimerJoueur(joueur.id);
    }
  }

  // Helpers Stats
  getMaxJongles(joueur: Joueur): number {
    if (!joueur.historiqueJongles?.length) return 0;
    return Math.max(...joueur.historiqueJongles.map(h => h.score));
  }

  getPourcentagePresence(joueur: Joueur): number {
    const total = this.totalEntrainements();
    if (total === 0) return 0;
    return Math.round((joueur.presences.length / total) * 100);
  }
}