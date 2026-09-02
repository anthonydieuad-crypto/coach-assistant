import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';
import { Joueur } from '../../models/joueur.model';
import { GraphiqueJonglesComponent } from '../graphique-jongles/graphique-jongles.component';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

  joueur = signal<Joueur | undefined>(undefined);
  modeEdition = signal(false);
  editionForm = signal<Partial<Joueur>>({});
  
  filtreActif = signal<'all' | 'match' | 'plateau' | 'tournoi'>('all');
  limiteAffichage = signal(5);

  groupesExistants = computed(() => {
    const groupesSet = new Set<string>();
    this.joueurService.joueurs().forEach(j => {
      if (j.groupe && j.groupe.trim()) {
        groupesSet.add(j.groupe.trim());
      }
    });
    this.joueurService.groupesVirtuels().forEach(g => groupesSet.add(g));
    return Array.from(groupesSet).sort();
  });

  evenementsDuJoueur = computed(() => {
    const j = this.joueur();
    const tousEvents = this.evenementService.evenements();
    if (!j) return [];
    
    return tousEvents
        .filter(e => e.participants.includes(j.id))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  evenementsFiltres = computed(() => {
    const type = this.filtreActif();
    const events = this.evenementsDuJoueur();
    if (type === 'all') return events;
    return events.filter(e => e.type === type);
  });

  evenementsVisibles = computed(() => {
    return this.evenementsFiltres().slice(0, this.limiteAffichage());
  });

  resteDesEvenements = computed(() => {
    return this.evenementsFiltres().length > this.limiteAffichage();
  });

  ngOnInit() {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const joueurTrouve = this.joueurService.joueurs().find(j => j.id === id);
      
      if (joueurTrouve) {
          this.joueur.set(joueurTrouve);
      } else {
          this.joueurService.getJoueurByIdHttp(id).subscribe({
              next: (j) => this.joueur.set(j),
              error: () => this.router.navigate(['/joueurs'])
          });
      }
  }

  changerFiltre(type: 'all' | 'match' | 'plateau' | 'tournoi') {
    this.filtreActif.set(type);
    this.limiteAffichage.set(5);
  }

  voirPlus() {
    this.limiteAffichage.update(l => l + 5);
  }

  voirMoins() {
    this.limiteAffichage.set(5);
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
      this.joueurService.mettreAJourJoueur(joueurAjour).subscribe({
          next: () => {
              this.joueur.set(joueurAjour);
              this.modeEdition.set(false);
              this.toastr.success('Profil mis à jour avec succès', 'Modification');
          },
          error: () => this.toastr.error('Erreur lors de la mise à jour', 'Oups')
      });
    }
  }

  supprimerJoueur() {
    const j = this.joueur();
    if (j && confirm(`Voulez-vous vraiment supprimer ${j.prenom} ${j.nom} ?`)) {
      this.joueurService.supprimerJoueur(j.id).subscribe({
          next: () => {
              this.toastr.info('Joueur supprimé de l\'effectif', 'Suppression');
              this.router.navigate(['/joueurs']);
          },
          error: () => this.toastr.error('Impossible de supprimer le joueur', 'Erreur')
      });
    }
  }

  ajouterScore(valeur: string) {
    const score = parseInt(valeur);
    const j = this.joueur();
    
    if (j && !isNaN(score)) {
        const today = new Date().toISOString().split('T')[0];
        
        this.joueurService.ajouterScoreJongle(j.id, today, score).subscribe({
            next: (joueurMaj) => {
               this.joueur.set(joueurMaj);
               this.toastr.success(`Nouveau record : ${score} jongles !`, 'Bravo');
            },
            error: () => this.toastr.error('Erreur lors de l\'ajout du score', 'Erreur')
        });
    }
  }
}