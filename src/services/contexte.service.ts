import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Saison {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin?: string;
  active: boolean;
}

export interface NoeudOrganigramme {
  id: number;
  nom: string;
  parentId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContexteService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  saisonActive = signal<Saison | null>(null);
  saisons = signal<Saison[]>([]);

  noeudActif = signal<NoeudOrganigramme | null>(null);
  noeuds = signal<NoeudOrganigramme[]>([]);

  constructor() {
    this.chargerContexte();
  }

  chargerContexte() {
    this.http.get<Saison[]>(`${this.apiUrl}/saisons`).subscribe(data => {
      this.saisons.set(data);
      const active = data.find(s => s.active);
      if (active) this.saisonActive.set(active);
    });

    this.http.get<NoeudOrganigramme[]>(`${this.apiUrl}/noeuds`).subscribe(data => {
      this.noeuds.set(data);
      
      // PROTECTION UX : Sélection automatique forcée
      // Le Coach est verrouillé par défaut sur sa première équipe autorisée
      if (data.length > 0) {
        const noeudActuel = this.noeudActif();
        // Si aucun noeud n'est sélectionné OU si le noeud précédent n'est plus autorisé (changement de compte)
        if (!noeudActuel || !data.find(n => n.id === noeudActuel.id)) {
          this.noeudActif.set(data[0]); 
        }
      } else {
          this.noeudActif.set(null);
      }
    });
  }

  // Méthodes attendues par le composant contexte-selector
  changerSaison(saison: Saison) {
    this.saisonActive.set(saison);
  }

  changerNoeud(noeud: NoeudOrganigramme) {
    this.noeudActif.set(noeud);
  }

  // Alias conservés au cas où d'autres composants utiliseraient ces noms
  setSaison(saison: Saison) {
    this.saisonActive.set(saison);
  }

  setNoeud(noeud: NoeudOrganigramme) {
    this.noeudActif.set(noeud);
  }
}