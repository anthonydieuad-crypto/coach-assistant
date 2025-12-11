import { GroupeJoueur } from './joueur.model';

export type TypeEvenement = 'training' | 'plateau' | 'match' | 'cohesion' | 'tournoi';

export interface EvenementCalendrier {
  id: number;
  date: string; // YYYY-MM-DD
  titre: string;
  type: TypeEvenement;
  lieu: string;
  equipesAdverses?: string;
  participants: number[];
  groupe?: GroupeJoueur;
}
