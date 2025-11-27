import { Injectable, signal } from '@angular/core';
import { EvenementCalendrier } from '../models/evenement.model';

@Injectable({
  providedIn: 'root',
})
export class EvenementService {
  private etatEvenements = signal<EvenementCalendrier[]>([
    // Entraînements (exemple, non exhaustif)
    { id: 101, date: '2025-08-26', titre: 'Entraînement', type: 'training', lieu: 'Stade Municipal', participants: [] },
    { id: 102, date: '2025-08-28', titre: 'Entraînement', type: 'training', lieu: 'Stade Municipal', participants: [] },
    { id: 103, date: '2025-08-30', titre: 'Entraînement', type: 'training', lieu: 'Stade Municipal', participants: [] },
    { id: 104, date: '2025-09-02', titre: 'Entraînement', type: 'training', lieu: 'Stade Municipal', participants: [] },
    { id: 105, date: '2025-09-04', titre: 'Entraînement', type: 'training', lieu: 'Stade Municipal', participants: [] },

    // Plateaux basés sur le document
    { id: 1, date: '2025-09-13', titre: 'Tournoi à Rilleux', type: 'plateau', lieu: 'Rilleux', participants: [5, 7, 10, 16, 17, 18, 19, 20, 23, 24], groupe: 'Equipe 1' },
    { id: 2, date: '2025-09-14', titre: 'Tournoi de Vaulx', type: 'plateau', lieu: 'Vaulx', participants: [1, 3, 4, 7, 8, 9, 14], groupe: 'Equipe 2' },
    { id: 3, date: '2025-09-20', titre: 'Plateau à Soucieux en Jarrest', type: 'plateau', lieu: 'Soucieux en Jarrest', participants: [1, 2, 5, 6, 7, 14, 15, 16, 17, 18, 20, 23], groupe: 'Equipe 1' },
    { id: 4, date: '2025-09-20', titre: 'Plateau à Aveize', type: 'plateau', lieu: 'Aveize', participants: [3, 4, 8, 9, 10, 11, 19, 21, 22, 24], groupe: 'Equipe 2' },
    { id: 5, date: '2025-09-27', titre: 'Plateau à Montrottier', type: 'plateau', lieu: 'Montrottier', participants: [2, 4, 5, 6, 7, 10, 11, 16, 17, 19], groupe: 'Equipe 1' },
    { id: 6, date: '2025-09-27', titre: 'Plateau à Domicile', type: 'plateau', lieu: 'Domicile', participants: [1, 3, 9, 14, 15, 18, 20, 21, 22, 23, 24], groupe: 'Equipe 2' },
    { id: 7, date: '2025-10-04', titre: 'Plateau à Grezieux', type: 'plateau', lieu: 'Grezieux', participants: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11], groupe: 'Equipe 1' },
    { id: 8, date: '2025-10-04', titre: 'Plateau à Messimy', type: 'plateau', lieu: 'Messimy', participants: [16, 17, 18, 19, 20, 21, 22, 23, 24], groupe: 'Equipe 2' },
    { id: 9, date: '2025-10-11', titre: 'Plateau à Mornant', type: 'plateau', lieu: 'Mornant', participants: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11], groupe: 'Equipe 1' },
    { id: 10, date: '2025-10-11', titre: 'Plateau à Domicile', type: 'plateau', lieu: 'Domicile', participants: [9, 16, 17, 18, 20, 21, 22, 23, 24], groupe: 'Equipe 2' },
    { id: 11, date: '2025-11-08', titre: 'Plateau à Ste Foy les Lyon', type: 'plateau', lieu: 'Ste Foy les Lyon', participants: [2, 4, 7, 8, 10, 11, 14, 16, 17, 18, 20], groupe: 'Equipe 1' },
    { id: 12, date: '2025-11-15', titre: 'Plateau à Brignais', type: 'plateau', lieu: 'Brignais', participants: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11], groupe: 'Equipe 2' },
    { id: 13, date: '2025-11-15', titre: 'Plateau à Domicile', type: 'plateau', lieu: 'Domicile', participants: [16, 17, 18, 19, 20, 21, 22, 23, 24], groupe: 'Equipe 3' }
  ]);
  
  evenements = this.etatEvenements.asReadonly();

  ajouterEvenement(evenement: Omit<EvenementCalendrier, 'id'>) {
    this.etatEvenements.update((evenements) => [
      ...evenements,
      { ...evenement, id: Date.now() },
    ]);
  }

  mettreAJourEvenement(evenementMisAJour: EvenementCalendrier) {
    this.etatEvenements.update(evenements => 
      evenements.map(e => e.id === evenementMisAJour.id ? evenementMisAJour : e)
    );
  }
}
