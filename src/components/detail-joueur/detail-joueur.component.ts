import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';
import { Joueur } from '../../models/joueur.model';
import { GraphiqueJonglesComponent } from '../graphique-jongles/graphique-jongles.component';

@Component({
  selector: 'app-detail-joueur',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, GraphiqueJonglesComponent, RouterLink, FormsModule],
  templateUrl: './detail-joueur.component.html',
})
export class DetailJoueurComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);

  joueur = signal<Joueur | undefined>(undefined);

  // GESTION DU MODE ÉDITION
  modeEdition = signal(false);
  editionForm = signal<Partial<Joueur>>({});

  // --- GESTION DES ÉVÉNEMENTS (Filtres & Pagination) ---

  // 1. Filtre sélectionné par l'utilisateur
  filtreActif = signal<'all' | 'match' | 'plateau' | 'tournoi'>('all');

  // 2. Limite d'affichage (5 par défaut)
  limiteAffichage = signal(5);

  // 3. Calcul : Tous les événements où le joueur est PARTICIPANT, triés par date récente
  evenementsDuJoueur = computed(() => {
    const j = this.joueur();
    const tousEvents = this.evenementService.evenements();

    if (!j) return [];

    return tousEvents
        // On garde uniquement ceux où l'ID du joueur est dans la liste des participants
        .filter(e => e.participants.includes(j.id))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  // 4. Calcul : On applique le FILTRE de type (Match, Plateau...)
  evenementsFiltres = computed(() => {
    const type = this.filtreActif();
    const events = this.evenementsDuJoueur();

    if (type === 'all') return events;
    return events.filter(e => e.type === type);
  });

  // 5. Calcul : On applique la LIMITE pour l'affichage final
  evenementsVisibles = computed(() => {
    return this.evenementsFiltres().slice(0, this.limiteAffichage());
  });

  // 6. Helper : Savoir s'il en reste à afficher (pour montrer le bouton "Voir plus")
  resteDesEvenements = computed(() => {
    return this.evenementsFiltres().length > this.limiteAffichage();
  });

  // --- INIT ---

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const joueurTrouve = this.joueurService.joueurs().find(j => j.id === id);

    if (joueurTrouve) {
      this.joueur.set(joueurTrouve);
    } else {
      this.router.navigate(['/joueurs']);
    }
  }

  // --- ACTIONS ---

  changerFiltre(type: 'all' | 'match' | 'plateau' | 'tournoi') {
    this.filtreActif.set(type);
    this.limiteAffichage.set(5); // On remet la limite à 5 quand on change de filtre
  }

  voirPlus() {
    this.limiteAffichage.update(l => l + 5); // On ajoute 5 lignes
  }

  voirMoins() {
    this.limiteAffichage.set(5); // On revient au début
  }

  activerEdition() {
    const j = this.joueur();
    if (j) {
      this.editionForm.set({ ...j });
      this.modeEdition.set(true);
    }
  }

  annulerEdition() {
    this.modeEdition.set(false);
  }

  sauvegarderModification() {
    const modifs = this.editionForm();
    const original = this.joueur();

    if (modifs && original) {
      const joueurAjour: Joueur = { ...original, ...modifs } as Joueur;
      this.joueurService.mettreAJourJoueur(joueurAjour);
      this.joueur.set(joueurAjour);
      this.modeEdition.set(false);
    }
  }

  supprimerJoueur() {
    const j = this.joueur();
    if (j && confirm('Voulez-vous vraiment supprimer ce joueur ?')) {
      this.joueurService.supprimerJoueur(j.id);
      this.router.navigate(['/joueurs']);
    }
  }

  ajouterScore(valeur: string) {
    const score = parseInt(valeur);
    const j = this.joueur();
    if (j && !isNaN(score)) {
      const dateDuJour = new Date().toISOString().split('T')[0];
      this.joueurService.ajouterScoreJongle(j.id, dateDuJour, score);
    }
  }
}