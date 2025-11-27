import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Player } from '../../models/player.model';
import { CalendarEvent } from '../../models/event.model';
import { NgOptimizedImage } from '@angular/common';
import { EventService } from '../../services/event.service';

type PlayerGroupFilter = 'all' | 'Equipe 1' | 'Equipe 2' | 'Equipe 3' | 'none';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './player-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerListComponent {
  @Input({ required: true }) players: Player[] = [];
  @Input({ required: true }) events: CalendarEvent[] = [];
  @Output() viewPlayer = new EventEmitter<Player>();
  @Output() addPlayer = new EventEmitter<void>();
  @Output() deletePlayer = new EventEmitter<Player>();
  
  private eventService = inject(EventService);
  allEvents = this.eventService.events;
  
  activeFilter = signal<PlayerGroupFilter>('all');

  filteredPlayers = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') {
      return this.players;
    }
    if (filter === 'none') {
      return this.players.filter(p => !p.group);
    }
    return this.players.filter(p => p.group === filter);
  });
  
  totalTrainings = computed(() => {
    const trainingDates = new Set<string>();
    this.players.forEach(player => {
        player.attendance.forEach(date => trainingDates.add(date));
    });
    return trainingDates.size;
  });

  getMaxJuggles(player: Player): number {
    if (!player.juggleHistory || player.juggleHistory.length === 0) {
      return 0;
    }
    return Math.max(...player.juggleHistory.map(h => h.score));
  }

  getAttendancePercentage(player: Player): number {
    const total = this.totalTrainings();
    if (total === 0) {
      return 0;
    }
    const percentage = (player.attendance.length / total) * 100;
    return Math.round(percentage);
  }

  setFilter(filter: PlayerGroupFilter) {
    this.activeFilter.set(filter);
  }
}
