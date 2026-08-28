export interface Saison {
  id: number;
  nom: string;
  active: boolean;
  dateDebut: string;
  dateFin?: string;
}

export interface Noeud {
  id: number;
  nom: string;
  parentId?: number;
  clubId: number;
}