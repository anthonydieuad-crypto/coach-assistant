import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal, computed } from '@angular/core';
import { Player, PlayerGroup, playerGroups } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { EventService } from '../../services/event.service';
import { JugglingChartComponent } from '../juggling-chart/juggling-chart.component';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [JugglingChartComponent],
  templateUrl: './player-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailComponent implements OnInit {
  @Input({ required: true }) player!: Player;
  @Output() backToList = new EventEmitter<void>();
  @Output() deletePlayer = new EventEmitter<Player>();

  private playerService = inject(PlayerService);
  private eventService = inject(EventService);
  
  allEvents = this.eventService.events;
  
  newScore = signal<number | null>(null);
  isChartExpanded = signal(false);
  isEditMode = signal(false);
  editablePlayer = signal<Player | null>(null);
  
  playerGroups = playerGroups;

  ngOnInit() {
    this.editablePlayer.set({ ...this.player });
  }

  maxJuggles = computed(() => {
    if (!this.player.juggleHistory || this.player.juggleHistory.length === 0) {
      return 0;
    }
    return Math.max(...this.player.juggleHistory.map(h => h.score));
  });

  convocationEvents = computed(() => {
    return this.allEvents().filter(event => 
      (event.type === 'plateau' || event.type === 'match') && event.participants.includes(this.player.id)
    );
  });

  addJugglesRecord() {
    const score = this.newScore();
    if (score !== null && score >= 0) {
      const today = new Date().toISOString().split('T')[0];
      this.playerService.addJuggleRecord(this.player.id, today, score);
      this.newScore.set(null); // Reset input
    }
  }

  handleJuggleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.newScore.set(value === '' ? null : Number(value));
  }
  
  toggleChartSize() {
    this.isChartExpanded.update(value => !value);
  }

  startEdit() {
    this.editablePlayer.set({ ...this.player });
    this.isEditMode.set(true);
  }

  cancelEdit() {
    this.editablePlayer.set({ ...this.player });
    this.isEditMode.set(false);
  }

  saveChanges() {
    if (this.editablePlayer()) {
      this.playerService.updatePlayer(this.editablePlayer()!);
      this.isEditMode.set(false);
    }
  }

  handlePlayerInput(field: keyof Player, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.editablePlayer.update(p => p ? { ...p, [field]: value === 'null' ? null : value } : null);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
