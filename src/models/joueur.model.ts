export interface ScoreJongle {
  date: string; // YYYY-MM-DD
  score: number;
}

export type GroupeJoueur = 'Equipe 1' | 'Equipe 2' | 'Equipe 3';
export const groupesJoueur: GroupeJoueur[] = ['Equipe 1', 'Equipe 2', 'Equipe 3'];


export interface Joueur {
  id: number;
  prenom: string;
  nom: string;
  photoUrl: string;
  nomParent: string;
  telParent: string;
  emailParent: string;
  historiqueJongles: ScoreJongle[];
  presences: string[]; // Dates en format YYYY-MM-DD
  groupe?: GroupeJoueur | null;
}
