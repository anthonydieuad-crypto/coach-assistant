
import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { EvenementService } from '../../services/evenement.service';
import { JoueurService } from '../../services/joueur.service';
import { EvenementCalendrier, TypeEvenement } from '../../models/evenement.model';
import { groupesJoueur } from '../../models/joueur.model';
import { ToastrService } from 'ngx-toastr';

interface JourCalendrier {
  date: Date;
  estMoisCourant: boolean;
  evenements: EvenementCalendrier[];
}

type EtatNouvelEvenement = Omit<EvenementCalendrier, 'id'>;

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [],
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendrierComponent implements OnInit{
  private evenementService = inject(EvenementService);
  private joueurService = inject(JoueurService);
  private toastr = inject(ToastrService);
  
  tousLesEvenements = this.evenementService.evenements;
  tousLesJoueurs = this.joueurService.joueurs;
  groupesJoueur = groupesJoueur;
  
  dateVue = signal(new Date());
  
  estModaleOuverte = signal(false);
  idEvenementEnEdition = signal<number | null>(null);

  nouvelEvenement: WritableSignal<EtatNouvelEvenement> = signal(this.getEtatInitialEvenement());
  
  joursSemaine = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    ngOnInit() {
        const brouillon = this.evenementService.brouillonEvenement();

        if (brouillon) {
            this.nouvelEvenement.set({
                titre: brouillon.titre || 'Entraînement',
                date: brouillon.date || this.formaterDatePourApi(new Date()),
                type: 'training', // On force le type entraînement
                lieu: brouillon.lieu || '',
                participants: brouillon.participants || [], // ✅ On récupère les joueurs
                equipesAdverses: '',
                groupe: undefined
            });

            this.estModaleOuverte.set(true);
            this.evenementService.brouillonEvenement.set(null);
        }
    }

  grilleCalendrier = computed<JourCalendrier[]>(() => {
    const date = this.dateVue();
    const annee = date.getFullYear();
    const mois = date.getMonth();
    const premierJourDuMois = new Date(annee, mois, 1);
    const dernierJourDuMois = new Date(annee, mois + 1, 0);
    const grille: JourCalendrier[] = [];
    const jourDebutSemaine = (premierJourDuMois.getDay() + 6) % 7;

    for (let i = 0; i < jourDebutSemaine; i++) {
        const jourMoisPrecedent = new Date(premierJourDuMois);
        jourMoisPrecedent.setDate(jourMoisPrecedent.getDate() - (jourDebutSemaine - i));
        grille.push({ date: jourMoisPrecedent, estMoisCourant: false, evenements: [] });
    }

    for (let i = 1; i <= dernierJourDuMois.getDate(); i++) {
        const jourCourant = new Date(annee, mois, i);
        const dateStr = this.formaterDatePourApi(jourCourant);
        grille.push({ 
            date: jourCourant, 
            estMoisCourant: true, 
            evenements: this.tousLesEvenements().filter(e => e.date === dateStr)
        });
    }

    const indexFinGrille = grille.length;
    const joursRestants = (7 - (indexFinGrille % 7)) % 7;
    for (let i = 1; i <= joursRestants; i++) {
        const jourMoisSuivant = new Date(dernierJourDuMois);
        jourMoisSuivant.setDate(jourMoisSuivant.getDate() + i);
        grille.push({ date: jourMoisSuivant, estMoisCourant: false, evenements: [] });
    }
    return grille;
  });
  
  libelleMoisCourant = computed(() => {
    return this.dateVue().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  });

  changerMois(decalage: number) {
    this.dateVue.update(d => {
      const nouvelleDate = new Date(d);
      nouvelleDate.setMonth(d.getMonth() + decalage);
      return nouvelleDate;
    });
  }

  estAujourdhui(date: Date): boolean {
    const aujourdhui = new Date();
    return date.getDate() === aujourdhui.getDate() &&
           date.getMonth() === aujourdhui.getMonth() &&
           date.getFullYear() === aujourdhui.getFullYear();
  }
  
  private genererTitre(type: TypeEvenement, date: string): string {
    const libellesType: Record<TypeEvenement, string> = {
        training: 'Entraînement',
        plateau: 'Plateau',
        match: 'Match amical',
        cohesion: "Sortie cohésion d'équipe",
        tournoi : "Tournoi"
    };
    const dateFormatee = new Date(date).toLocaleDateString('fr-FR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${libellesType[type]} du ${dateFormatee}`;
  }

  ouvrirModaleNouveau(date?: Date) {
    const dateCible = date ? this.formaterDatePourApi(date) : this.formaterDatePourApi(new Date());
    const typeInitial: TypeEvenement = 'training';
    this.nouvelEvenement.set({
      ...this.getEtatInitialEvenement(),
      date: dateCible,
      titre: this.genererTitre(typeInitial, dateCible),
      type: typeInitial,
    });
    this.idEvenementEnEdition.set(null);
    this.estModaleOuverte.set(true);
  }

  ouvrirModaleEdition(evenement: EvenementCalendrier) {
    this.idEvenementEnEdition.set(evenement.id);
    this.nouvelEvenement.set({
      date: evenement.date,
      titre: evenement.titre,
      type: evenement.type,
      lieu: evenement.lieu,
      equipesAdverses: evenement.equipesAdverses || '',
      participants: [...evenement.participants],
      groupe: evenement.groupe
    });
    this.estModaleOuverte.set(true);
  }

  fermerModale() {
    this.estModaleOuverte.set(false);
  }

  gererSaisieEvenement(field: keyof EtatNouvelEvenement, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.nouvelEvenement.update(current => {
        const misAJour = { ...current, [field]: value === 'null' ? undefined : value };
        if (field === 'date' || field === 'type') {
            misAJour.titre = this.genererTitre(misAJour.type as TypeEvenement, misAJour.date);
        }
        if (field === 'type' && value !== 'match' && value !== 'plateau'&& value !== 'tournoi') {
            misAJour.equipesAdverses = '';
            misAJour.participants = [];
            misAJour.groupe = undefined;
        }
        return misAJour;
    });
  }

  basculerParticipant(joueurId: number) {
    this.nouvelEvenement.update(current => {
      const participants = new Set(current.participants);
      if (participants.has(joueurId)) {
        participants.delete(joueurId);
      } else {
        participants.add(joueurId);
      }
      return { ...current, participants: Array.from(participants) };
    });
  }

  enregistrerEvenement() {
      const donnees = this.nouvelEvenement();

      // Petite validation basique
      if (!donnees.titre.trim() || !donnees.date || !donnees.lieu.trim()) {
         this.toastr.warning('Veuillez remplir les champs obligatoires (Titre, Date, Lieu)', 'Oups !');
         return;
      }

      const evenementAEnregistrer: any = {
            titre: donnees.titre.trim(),
            date: donnees.date,
            type: donnees.type,
            lieu: donnees.lieu.trim(),
            participants: donnees.participants,
            equipesAdverses: donnees.equipesAdverses?.trim() || undefined,
            groupe: donnees.groupe
      };

      const id = this.idEvenementEnEdition();

      if (id) {
          // --- CAS MODIFICATION ---
          this.evenementService.mettreAJourEvenement({ ...evenementAEnregistrer, id }).subscribe({
              next: () => {
                  this.toastr.success('L\'événement a été modifié', 'Succès');
                  this.fermerModale();
              },
              error: () => this.toastr.error('Erreur lors de la modification', 'Erreur')
          });
      } else {
          // --- CAS CRÉATION ---
          this.evenementService.ajouterEvenement(evenementAEnregistrer).subscribe({
              next: () => {
                  this.toastr.success('Nouvel événement ajouté au calendrier', 'C\'est noté !');
                  this.fermerModale();
              },
              error: () => this.toastr.error('Erreur lors de la création', 'Erreur')
          });
      }
  }


  private formaterDatePourApi(date: Date): string {
    const annee = date.getFullYear();
    const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    const jour = date.getDate().toString().padStart(2, '0');
    return `${annee}-${mois}-${jour}`;
  }

  private getEtatInitialEvenement(): EtatNouvelEvenement {
     return {
      date: this.formaterDatePourApi(new Date()),
      titre: '',
      type: 'training',
      lieu: '',
      equipesAdverses: '',
      participants: [],
      groupe: undefined
    };
  }
    supprimerEvenement() {
          const id = this.idEvenementEnEdition();
          if (id && confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
              this.evenementService.supprimerEvenement(id).subscribe({
                  next: () => {
                      this.toastr.info('L\'événement a été supprimé', 'Suppression');
                      this.fermerModale();
                  },
                  error: () => this.toastr.error('Impossible de supprimer', 'Erreur')
              });
          }
      }
}