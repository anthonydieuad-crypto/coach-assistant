import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core';
import { Player } from '../../models/player.model';
import { EventService } from '../../services/event.service';
import { CalendarEvent } from '../../models/event.model';

@Component({
  selector: 'app-convocation-tracker',
  standalone: true,
  templateUrl: './convocation-tracker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocationTrackerComponent {
  @Input({ required: true }) players: Player[] = [];

  private eventService = inject(EventService);
  allEvents = this.eventService.events;

  competitionEvents = computed(() => {
    return this.allEvents()
      .filter(e => e.type === 'match' || e.type === 'plateau')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  playerStats = computed(() => {
    const events = this.competitionEvents();
    return this.players.map(player => {
      const convocationCount = events.filter(e => e.participants.includes(player.id)).length;
      return { ...player, convocationCount };
    });
  });

  isPlayerParticipant(player: Player, event: CalendarEvent): boolean {
    return event.participants.includes(player.id);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }
}
