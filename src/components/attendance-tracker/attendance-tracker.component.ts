
import { ChangeDetectionStrategy, Component, computed, inject, Input, model, signal } from '@angular/core';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-attendance-tracker',
  standalone: true,
  imports: [],
  templateUrl: './attendance-tracker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTrackerComponent {
  @Input({ required: true }) players: Player[] = [];
  
  private playerService = inject(PlayerService);
  
  trainingDate = signal(new Date().toISOString().split('T')[0]);
  selectedPlayers = signal<Set<number>>(new Set());
  
  // When date changes, update selectedPlayers based on who attended on that date
  dateChangedEffect = computed(() => {
    const date = this.trainingDate();
    const presentPlayers = this.players
      .filter(p => p.attendance.includes(date))
      .map(p => p.id);
    this.selectedPlayers.set(new Set(presentPlayers));
  });

  togglePlayer(playerId: number) {
    this.selectedPlayers.update(currentSet => {
      const newSet = new Set(currentSet);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  }

  handleDateChange(event: Event) {
    const newDate = (event.target as HTMLInputElement).value;
    this.trainingDate.set(newDate);
  }

  saveAttendance() {
    this.playerService.recordAttendance(
      Array.from(this.selectedPlayers()),
      this.trainingDate()
    );
    alert('Présences enregistrées !');
  }
}
