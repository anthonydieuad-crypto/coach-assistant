import { ChangeDetectionStrategy, Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { EventService } from '../../services/event.service';
import { PlayerService } from '../../services/player.service';
import { CalendarEvent, EventType } from '../../models/event.model';
import { Player, PlayerGroup, playerGroups } from '../../models/player.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

type NewEventState = Omit<CalendarEvent, 'id'>;

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private eventService = inject(EventService);
  private playerService = inject(PlayerService);
  
  allEvents = this.eventService.events;
  allPlayers = this.playerService.players;
  playerGroups = playerGroups;
  
  viewDate = signal(new Date());
  
  isModalOpen = signal(false);
  editingEventId = signal<number | null>(null);

  newEvent: WritableSignal<NewEventState> = signal(this.getInitialEventState());
  
  daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  calendarGrid = computed<CalendarDay[]>(() => {
    const date = this.viewDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const grid: CalendarDay[] = [];
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    for (let i = 0; i < startDayOfWeek; i++) {
        const prevMonthDay = new Date(firstDayOfMonth);
        prevMonthDay.setDate(prevMonthDay.getDate() - (startDayOfWeek - i));
        grid.push({ date: prevMonthDay, isCurrentMonth: false, events: [] });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const currentDay = new Date(year, month, i);
        const dateStr = this.formatDate(currentDay);
        grid.push({ 
            date: currentDay, 
            isCurrentMonth: true, 
            events: this.allEvents().filter(e => e.date === dateStr)
        });
    }

    const gridEndIndex = grid.length;
    const remainingDays = (7 - (gridEndIndex % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDay = new Date(lastDayOfMonth);
        nextMonthDay.setDate(nextMonthDay.getDate() + i);
        grid.push({ date: nextMonthDay, isCurrentMonth: false, events: [] });
    }
    return grid;
  });
  
  currentMonthLabel = computed(() => {
    return this.viewDate().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  });

  changeMonth(offset: number) {
    this.viewDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(d.getMonth() + offset);
      return newDate;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  private generateTitle(type: EventType, date: string): string {
    const typeLabels: Record<EventType, string> = {
        training: 'Entraînement',
        plateau: 'Plateau',
        match: 'Match amical',
        cohesion: "Sortie cohésion d'équipe"
    };
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${typeLabels[type]} du ${formattedDate}`;
  }

  openModalForNew(date?: Date) {
    const targetDate = date ? this.formatDate(date) : this.formatDate(new Date());
    const initialType: EventType = 'training';
    this.newEvent.set({
      ...this.getInitialEventState(),
      date: targetDate,
      title: this.generateTitle(initialType, targetDate),
      type: initialType,
    });
    this.editingEventId.set(null);
    this.isModalOpen.set(true);
  }

  openModalForEdit(event: CalendarEvent) {
    this.editingEventId.set(event.id);
    this.newEvent.set({
      date: event.date,
      title: event.title,
      type: event.type,
      location: event.location,
      opponentTeams: event.opponentTeams || '',
      participants: [...event.participants],
      group: event.group
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  handleEventInput(field: keyof NewEventState, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.newEvent.update(current => {
        const updated = { ...current, [field]: value === 'null' ? undefined : value };
        if (field === 'date' || field === 'type') {
            updated.title = this.generateTitle(updated.type as EventType, updated.date);
        }
        if (field === 'type' && value !== 'match' && value !== 'plateau') {
            updated.opponentTeams = '';
            updated.participants = [];
            updated.group = undefined;
        }
        return updated;
    });
  }

  handleParticipantToggle(playerId: number) {
    this.newEvent.update(current => {
      const participants = new Set(current.participants);
      if (participants.has(playerId)) {
        participants.delete(playerId);
      } else {
        participants.add(playerId);
      }
      return { ...current, participants: Array.from(participants) };
    });
  }

  saveEvent() {
    const eventData = this.newEvent();
    if (eventData.title.trim() && eventData.date && eventData.location.trim()) {
      const eventToSave: Omit<CalendarEvent, 'id'> = {
          title: eventData.title.trim(),
          date: eventData.date,
          type: eventData.type,
          location: eventData.location.trim(),
          participants: eventData.participants,
          opponentTeams: eventData.opponentTeams?.trim() || undefined,
          group: eventData.group
      };
      
      const id = this.editingEventId();
      if (id) {
        this.eventService.updateEvent({ ...eventToSave, id });
      } else {
        this.eventService.addEvent(eventToSave);
      }
      this.closeModal();
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getInitialEventState(): NewEventState {
     return {
      date: this.formatDate(new Date()),
      title: '',
      type: 'training',
      location: '',
      opponentTeams: '',
      participants: [],
      group: undefined
    };
  }
}