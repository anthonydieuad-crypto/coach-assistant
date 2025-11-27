import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Joueur, GroupeJoueur } from './models/joueur.model';
import { JoueurService } from './services/joueur.service';
import { EvenementService } from './services/evenement.service';
import { ListeJoueursComponent } from './components/liste-joueurs/liste-joueurs.component';
import { DetailJoueurComponent } from './components/detail-joueur/detail-joueur.component';
import { SuiviPresencesComponent } from './components/suivi-presences/suivi-presences.component';
import { BilanCompetitionsComponent } from './components/bilan-competitions/bilan-competitions.component';
import { BilanPresencesComponent } from './components/bilan-presences/bilan-presences.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';

type Vue = 'liste' | 'detail' | 'presences' | 'bilan-presences' | 'bilan-competitions' | 'calendrier';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ListeJoueursComponent,
    DetailJoueurComponent,
    SuiviPresencesComponent,
    BilanCompetitionsComponent,
    BilanPresencesComponent,
    CalendrierComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);
  
  vue = signal<Vue>('liste');
  joueurSelectionne = signal<Joueur | null>(null);

  joueurs = this.joueurService.joueurs;
  evenements = this.evenementService.evenements;

  estModaleAjoutJoueurOuverte = signal(false);
  nouveauJoueur = signal({
    prenom: '',
    nom: '',
    nomParent: '',
    telParent: '',
    emailParent: '',
    groupe: null as GroupeJoueur | null,
  });


  joueurPourDetail = computed(() => {
    if (this.vue() === 'detail' && this.joueurSelectionne()) {
      return this.joueurs().find(j => j.id === this.joueurSelectionne()!.id);
    }
    return null;
  });

  definirVue(nouvelleVue: Vue) {
    this.vue.set(nouvelleVue);
  }

  gererVoirJoueur(joueur: Joueur) {
    this.joueurSelectionne.set(joueur);
    this.vue.set('detail');
  }

  gererRetourListe() {
    this.joueurSelectionne.set(null);
    this.vue.set('liste');
  }
  
  gererDemandeAjoutJoueur() {
    this.nouveauJoueur.set({
      prenom: '',
      nom: '',
      nomParent: '',
      telParent: '',
      emailParent: '',
      groupe: null,
    });
    this.estModaleAjoutJoueurOuverte.set(true);
  }
  
  gererSupprimerJoueur(joueur: Joueur) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${joueur.prenom} ${joueur.nom} ?`)) {
      this.joueurService.supprimerJoueur(joueur.id);
      if (this.joueurSelectionne()?.id === joueur.id) {
        this.gererRetourListe();
      }
    }
  }

  fermerModaleAjoutJoueur() {
    this.estModaleAjoutJoueurOuverte.set(false);
  }

  enregistrerNouveauJoueur() {
    const donneesJoueur = this.nouveauJoueur();
    if (donneesJoueur.prenom && donneesJoueur.nom && donneesJoueur.nomParent && donneesJoueur.telParent && donneesJoueur.emailParent) {
      this.joueurService.ajouterJoueur(donneesJoueur);
      this.fermerModaleAjoutJoueur();
    }
  }

  gererSaisieNouveauJoueur(field: keyof typeof this.nouveauJoueur.prototype, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.nouveauJoueur.update(j => ({ ...j, [field]: value === 'null' ? null : value }));
  }
}
