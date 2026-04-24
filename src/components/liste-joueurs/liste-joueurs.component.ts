import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';
import { GroupeJoueur, Joueur } from '../../models/joueur.model';
import {Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

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
  private toastr = inject(ToastrService);

  // 2. On récupère les données directement depuis les services
  joueurs = this.joueurService.joueurs;
  tousLesEvenements = this.evenementService.evenements;

  isImporting = signal(false);
  estModaleFeuilleMatchOuverte = signal(false);
  selectionFeuilleMatch = signal<number[]>([]);

  //méthode pour séléctionner un joueurs
  basculerSelectionJoueur(id:number) {
    this.selectionFeuilleMatch.update(selection => {
      if (selection.includes(id)) {
        return selection.filter(jId => jId !== id); //rétiré le joeurs si déja coché
      }else {
        if (selection.length >= 10) return selection; 
          return [...selection, id]
      }
    })
  }

  validerGenerationFeuille() {
    if (this.selectionFeuilleMatch().length > 0) {
      this.joueurService.telechargerFeuilleDeMatchPdf(this.selectionFeuilleMatch());
      this.estModaleAjoutJoueurOuverte.set(false);
      this.selectionFeuilleMatch.set([])
    }
  }

  // 3. Logique de filtrage (inchangée)
  filtreActif = signal<FiltreGroupeJoueur>('all');

  joueursFiltres = computed(() => {
    const filtre = this.filtreActif();
    if (filtre === 'all') return this.joueurs();
    if (filtre === 'none') return this.joueurs().filter(j => !j.groupe);
    return this.joueurs().filter(j => j.groupe === filtre);
  });

  totalEntrainements = computed(() => {
    return this.tousLesEvenements().filter(e => e.type === 'training').length;
  });

  // 4. Logique d'AJOUT (récupérée de AppComponent)
  estModaleAjoutJoueurOuverte = signal(false);

  nouveauJoueur = signal({
    prenom: '',
    nom: '',
    numeroLicence: '',
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

  // --- GESTION DE L'IMPORT CSV ---
 onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File | undefined = target.files?.[0];
    
    if (file) {
      // 1. On active le spinner sur le bouton
      this.isImporting.set(true); 

      this.joueurService.importerJoueursCSV(file)
        .pipe(
          // 2. finalize s'exécute TOUJOURS à la fin de la requête (succès ou échec)
          finalize(() => {
            this.isImporting.set(false); // On désactive le spinner
            target.value = ''; // On vide l'input file
          })
        )
        .subscribe({
          next: (response: any) => {
            this.toastr.success(response.message || 'Joueurs importés avec succès !', 'Succès');
            // On recharge la liste via le service
            this.joueurService.chargerJoueurs();
          },
          error: (err) => {
            this.toastr.error('Erreur lors de l\'importation du fichier.', 'Erreur');
            console.error("Erreur import CSV:", err);
          }
        });
    }
  }

  // Ouverture modale
  gererDemandeAjoutJoueur() {
    this.nouveauJoueur.set({
      prenom: '', nom: '',numeroLicence: '', nomParent: '', telParent: '', emailParent: '', groupe: null,
    });
    this.estModaleAjoutJoueurOuverte.set(true);
  }

  fermerModaleAjoutJoueur() {
    this.estModaleAjoutJoueurOuverte.set(false);
  }

  // Sauvegarde
 enregistrerNouveauJoueur() {
     const j = this.nouveauJoueur();
     if (j.prenom && j.nom) {
       this.joueurService.ajouterJoueur(j).subscribe({
           next: () => {
               this.toastr.success(`${j.prenom} a rejoint l'équipe !`, 'Bienvenue');
               this.fermerModaleAjoutJoueur();
           },
           error: () => this.toastr.error('Erreur lors de la création', 'Oups')
       });
     } else {
       this.toastr.warning("Le prénom et le nom sont obligatoires.", "Attention");
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
        this.joueurService.supprimerJoueur(joueur.id).subscribe({
            next: () => this.toastr.info(`${joueur.prenom} a été supprimé`, 'Suppression'),
            error: () => this.toastr.error('Impossible de supprimer', 'Erreur')
        });
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

    // On compte combien de fois le joueur apparaît dans les participants des entraînements
    const nbPresences = this.tousLesEvenements().filter(e =>
        e.type === 'training' && e.participants.includes(joueur.id)
    ).length;

    return Math.round((nbPresences / total) * 100);
  }
}