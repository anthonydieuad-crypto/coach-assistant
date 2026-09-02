import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';
import { Joueur } from '../../models/joueur.model';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-liste-joueurs',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './liste-joueurs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeJoueursComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  joueurs = this.joueurService.joueurs;
  tousLesEvenements = this.evenementService.evenements;
  isImporting = signal(false);
  
  filtreActif = signal<string>('all');
  recherche = signal<string>('');
  
  estModaleAjoutJoueurOuverte = signal(false);
  estModaleGestionGroupesOuverte = signal(false);

  groupesExistants = computed(() => {
    const groupesSet = new Set<string>();
    this.joueurs().forEach(j => {
        if (j.groupe && j.groupe.trim()) {
            groupesSet.add(j.groupe.trim());
        }
    });
    this.joueurService.groupesVirtuels().forEach(g => groupesSet.add(g));
    return Array.from(groupesSet).sort();
  });

  joueursFiltres = computed(() => {
    const filtre = this.filtreActif();
    const terme = this.recherche().toLowerCase().trim();

    return this.joueurs().filter(j => {
      let matchGroupe = false;
      if (filtre === 'all') matchGroupe = true;
      else if (filtre === 'none') matchGroupe = !j.groupe || !j.groupe.trim();
      else matchGroupe = j.groupe === filtre;

      let matchRecherche = true;
      if (terme) {
        matchRecherche = j.prenom.toLowerCase().includes(terme) || 
                         j.nom.toLowerCase().includes(terme) || 
                         (j.numeroLicence ? j.numeroLicence.toLowerCase().includes(terme) : false);
      }

      return matchGroupe && matchRecherche;
    });
  });

  // VERROU TEMPOREL RESTAURÉ
  totalEntrainements = computed(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return this.tousLesEvenements().filter(e => e.type === 'training' && e.date <= todayStr).length;
  });

  nouveauJoueur = signal({
    prenom: '',
    nom: '',
    numeroLicence: '',
    nomParent: '',
    telParent: '',
    emailParent: '',
    groupe: null as string | null,
    mutation: false,
    mutationHorsDelai: false
  });

  voirDetailJoueur(joueur: Joueur) {
    this.router.navigate(['/joueurs', joueur.id]);
  }

  definirFiltre(filtre: string) {
    this.filtreActif.set(filtre);
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File | undefined = target.files?.[0];
    
    if (file) {
      this.isImporting.set(true);
      this.joueurService.importerJoueursCSV(file)
        .pipe(
          finalize(() => {
            this.isImporting.set(false);
            target.value = '';
          })
        )
        .subscribe({
          next: (response: any) => {
            this.toastr.success(response.message || 'Joueurs importés avec succès !', 'Succès');
            this.joueurService.chargerJoueurs();
          },
          error: (err) => {
            this.toastr.error('Erreur lors de l\'importation du fichier.', 'Erreur');
            console.error("Erreur import CSV:", err);
          }
        });
    }
  }

  gererDemandeAjoutJoueur() {
    this.nouveauJoueur.set({
      prenom: '', nom: '',numeroLicence: '', nomParent: '', telParent: '', emailParent: '', groupe: null, mutation: false, mutationHorsDelai: false
    });
    this.estModaleAjoutJoueurOuverte.set(true);
  }

  fermerModaleAjoutJoueur() {
    this.estModaleAjoutJoueurOuverte.set(false);
  }

  enregistrerNouveauJoueur() {
     const j = this.nouveauJoueur();
     if (j.prenom.trim() && j.nom.trim()) {
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

  gererSaisieNouveauJoueur(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    // @ts-ignore
    this.nouveauJoueur.update(j => ({ ...j, [field]: value === 'null' ? null : value }));
  }

  gererSupprimerJoueur(joueur: Joueur) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${joueur.prenom} ${joueur.nom} ?`)) {
        this.joueurService.supprimerJoueur(joueur.id).subscribe({
            next: () => this.toastr.info(`${joueur.prenom} a été supprimé`, 'Suppression'),
            error: () => this.toastr.error('Impossible de supprimer', 'Erreur')
        });
      }
  }

  ouvrirModaleGestionGroupes() {
    this.estModaleGestionGroupesOuverte.set(true);
  }

  fermerModaleGestionGroupes() {
    this.estModaleGestionGroupesOuverte.set(false);
  }

  ajouterNouveauGroupeConfig() {
    const nom = prompt('Nom du nouveau groupe (ex: U13 A) :');
    if (nom && nom.trim()) {
        const nomClean = nom.trim();
        if (this.groupesExistants().includes(nomClean)) {
            this.toastr.warning('Ce groupe existe déjà.');
        } else {
            this.joueurService.ajouterGroupeVirtuel(nomClean);
            this.toastr.success(`Groupe "${nomClean}" ajouté avec succès.`);
        }
    }
  }

  renommerGroupeGlobal(ancienNom: string) {
    const nouveauNom = prompt(`Renommer le groupe "${ancienNom}" en :`, ancienNom);
    if (nouveauNom && nouveauNom.trim() && nouveauNom !== ancienNom) {
        this.joueurService.renommerGroupe(ancienNom, nouveauNom.trim()).subscribe({
            next: () => {
                this.toastr.success('Groupe renommé avec succès.');
                if (this.filtreActif() === ancienNom) this.filtreActif.set(nouveauNom.trim());
            },
            error: () => this.toastr.error('Erreur lors du renommage')
        });
    }
  }

  supprimerGroupeGlobal(nom: string) {
    if (confirm(`Voulez-vous vraiment supprimer le groupe "${nom}" ?\nTous les joueurs de ce groupe se retrouveront "Sans groupe".`)) {
        this.joueurService.supprimerGroupe(nom).subscribe({
            next: () => {
                this.toastr.info(`Le groupe "${nom}" a été supprimé.`);
                if (this.filtreActif() === nom) this.filtreActif.set('all');
            },
            error: () => this.toastr.error('Erreur lors de la suppression')
        });
    }
  }

  getMaxJongles(joueur: Joueur): number {
    if (!joueur.historiqueJongles?.length) return 0;
    return Math.max(...joueur.historiqueJongles.map(h => h.score));
  }

  // VERROU TEMPOREL RESTAURÉ
  getPourcentagePresence(joueur: Joueur): number {
    const total = this.totalEntrainements();
    if (total === 0) return 0;
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const nbPresences = this.tousLesEvenements().filter(e =>
        e.type === 'training' && e.participants.includes(joueur.id) && e.date <= todayStr
    ).length;
    
    return Math.round((nbPresences / total) * 100);
  }
}