import { PlayerGroup } from './player.model';

export type EventType = 'training' | 'plateau' | 'match' | 'cohesion';

export interface CalendarEvent {
  id: number;
  date: string; // YYYY-MM-DD
  title: string;
  type: EventType;
  location: string;
  opponentTeams?: string;
  participants: number[];
  group?: PlayerGroup;
}