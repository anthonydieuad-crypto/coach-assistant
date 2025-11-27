import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-attendance-summary',
  standalone: true,
  templateUrl: './attendance-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceSummaryComponent {
  @Input({ required: true }) players: Player[] = [];
  
  trainingDates = computed(() => {
    const allDates = new Set<string>();
    this.players.forEach(player => {
        player.attendance.forEach(date => allDates.add(date));
    });
    return Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  });

  playerStats = computed(() => {
    const dates = this.trainingDates();
    return this.players.map(player => {
      const presences = player.attendance.length;
      const absences = dates.length - presences;
      return { ...player, presences, absences };
    });
  });

  dateStats = computed(() => {
    const dates = this.trainingDates();
    return dates.map(date => {
        const presentCount = this.players.filter(p => p.attendance.includes(date)).length;
        return { date, presentCount };
    });
  });

  isPlayerPresent(player: Player, date: string): boolean {
    return player.attendance.includes(date);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Returns format DD/MM
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }
}
