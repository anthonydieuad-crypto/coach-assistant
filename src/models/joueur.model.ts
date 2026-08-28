export interface ScoreJongle {
  date: string; // YYYY-MM-DD
  score: number;
}

export interface Joueur {
  id: number;
  prenom: string;
  nom: string;
  numeroLicence?: string;
  photoUrl: string;
  nomParent: string;
  telParent: string;
  emailParent: string;
  historiqueJongles: ScoreJongle[];
  presences: string[]; // Dates en format YYYY-MM-DD
  groupe?: string | null;
  mutation: boolean;
  mutationHorsDelai: boolean;
}