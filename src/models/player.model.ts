export interface JuggleRecord {
  date: string; // YYYY-MM-DD
  score: number;
}

export type PlayerGroup = 'Equipe 1' | 'Equipe 2' | 'Equipe 3';
export const playerGroups: PlayerGroup[] = ['Equipe 1', 'Equipe 2', 'Equipe 3'];


export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  juggleHistory: JuggleRecord[];
  attendance: string[]; // Dates in YYYY-MM-DD format
  group?: PlayerGroup | null;
}