import { Injectable, signal } from '@angular/core';
import { CalendarEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsState = signal<CalendarEvent[]>([
    // Entraînements (exemple, non exhaustif)
    { id: 101, date: '2025-08-26', title: 'Entraînement', type: 'training', location: 'Stade Municipal', participants: [] },
    { id: 102, date: '2025-08-28', title: 'Entraînement', type: 'training', location: 'Stade Municipal', participants: [] },
    { id: 103, date: '2025-08-30', title: 'Entraînement', type: 'training', location: 'Stade Municipal', participants: [] },
    { id: 104, date: '2025-09-02', title: 'Entraînement', type: 'training', location: 'Stade Municipal', participants: [] },
    { id: 105, date: '2025-09-04', title: 'Entraînement', type: 'training', location: 'Stade Municipal', participants: [] },

    // Plateaux basés sur le document
    { id: 1, date: '2025-09-13', title: 'Tournoi à Rilleux', type: 'plateau', location: 'Rilleux', participants: [5, 7, 10, 16, 17, 18, 19, 20, 23, 24], group: 'Equipe 1' },
    { id: 2, date: '2025-09-14', title: 'Tournoi de Vaulx', type: 'plateau', location: 'Vaulx', participants: [1, 3, 4, 7, 8, 9, 14], group: 'Equipe 2' },
    { id: 3, date: '2025-09-20', title: 'Plateau à Soucieux en Jarrest', type: 'plateau', location: 'Soucieux en Jarrest', participants: [1, 2, 5, 6, 7, 14, 15, 16, 17, 18, 20, 23], group: 'Equipe 1' },
    { id: 4, date: '2025-09-20', title: 'Plateau à Aveize', type: 'plateau', location: 'Aveize', participants: [3, 4, 8, 9, 10, 11, 19, 21, 22, 24], group: 'Equipe 2' },
    { id: 5, date: '2025-09-27', title: 'Plateau à Montrottier', type: 'plateau', location: 'Montrottier', participants: [2, 4, 5, 6, 7, 10, 11, 16, 17, 19], group: 'Equipe 1' },
    { id: 6, date: '2025-09-27', title: 'Plateau à Domicile', type: 'plateau', location: 'Domicile', participants: [1, 3, 9, 14, 15, 18, 20, 21, 22, 23, 24], group: 'Equipe 2' },
    { id: 7, date: '2025-10-04', title: 'Plateau à Grezieux', type: 'plateau', location: 'Grezieux', participants: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11], group: 'Equipe 1' },
    { id: 8, date: '2025-10-04', title: 'Plateau à Messimy', type: 'plateau', location: 'Messimy', participants: [16, 17, 18, 19, 20, 21, 22, 23, 24], group: 'Equipe 2' },
    { id: 9, date: '2025-10-11', title: 'Plateau à Mornant', type: 'plateau', location: 'Mornant', participants: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11], group: 'Equipe 1' },
    { id: 10, date: '2025-10-11', title: 'Plateau à Domicile', type: 'plateau', location: 'Domicile', participants: [9, 16, 17, 18, 20, 21, 22, 23, 24], group: 'Equipe 2' },
    { id: 11, date: '2025-11-08', title: 'Plateau à Ste Foy les Lyon', type: 'plateau', location: 'Ste Foy les Lyon', participants: [2, 4, 7, 8, 10, 11, 14, 16, 17, 18, 20], group: 'Equipe 1' },
    { id: 12, date: '2025-11-15', title: 'Plateau à Brignais', type: 'plateau', location: 'Brignais', participants: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11], group: 'Equipe 2' },
    { id: 13, date: '2025-11-15', title: 'Plateau à Domicile', type: 'plateau', location: 'Domicile', participants: [16, 17, 18, 19, 20, 21, 22, 23, 24], group: 'Equipe 3' }
  ]);
  
  events = this.eventsState.asReadonly();

  addEvent(event: Omit<CalendarEvent, 'id'>) {
    this.eventsState.update((events) => [
      ...events,
      { ...event, id: Date.now() },
    ]);
  }

  updateEvent(updatedEvent: CalendarEvent) {
    this.eventsState.update(events => 
      events.map(e => e.id === updatedEvent.id ? updatedEvent : e)
    );
  }
}