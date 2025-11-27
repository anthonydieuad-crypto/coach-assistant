import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { JuggleRecord } from '../../models/player.model';

@Component({
  selector: 'app-juggling-chart',
  standalone: true,
  templateUrl: './juggling-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JugglingChartComponent {
  @Input({ required: true }) history: JuggleRecord[] = [];
  
  // Chart dimensions
  width = 500;
  height = 250;
  margin = { top: 20, right: 20, bottom: 40, left: 40 };
  
  innerWidth = this.width - this.margin.left - this.margin.right;
  innerHeight = this.height - this.margin.top - this.margin.bottom;

  // Computed properties for SVG rendering
  xScale = computed(() => {
    if (this.history.length < 1) return () => 0;
    const dates = this.history.map(d => new Date(d.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    return (date: number) => {
      if (maxDate === minDate) return this.innerWidth / 2;
      return ((date - minDate) / (maxDate - minDate)) * this.innerWidth;
    };
  });

  yScale = computed(() => {
    const scores = this.history.map(d => d.score);
    const maxScore = Math.max(10, ...scores) * 1.1; // Min 10, add 10% padding
    return (score: number) => this.innerHeight - (score / maxScore) * this.innerHeight;
  });

  linePath = computed(() => {
    if (this.history.length < 2) return '';
    const scaleX = this.xScale();
    const scaleY = this.yScale();
    let path = 'M';
    this.history.forEach((d, i) => {
      const x = scaleX(new Date(d.date).getTime());
      const y = scaleY(d.score);
      path += ` ${x},${y}`;
      if (i === 0) path += ' L';
    });
    return path;
  });

  circles = computed(() => {
    if (this.history.length === 0) return [];
    const scaleX = this.xScale();
    const scaleY = this.yScale();
    return this.history.map(d => ({
      cx: scaleX(new Date(d.date).getTime()),
      cy: scaleY(d.score),
      score: d.score,
    }));
  });

  xAxisTicks = computed(() => {
    if (this.history.length === 0) return [];
    const scaleX = this.xScale();
    // Show first and last date
    const uniqueDates = [...new Map(this.history.map(item => [item.date, item])).values()];
    
    if (uniqueDates.length <= 1) {
        return [{ x: scaleX(new Date(uniqueDates[0].date).getTime()), label: this.formatDate(uniqueDates[0].date) }];
    }

    const ticks = [uniqueDates[0], uniqueDates[uniqueDates.length - 1]];
    if (uniqueDates.length > 2) {
      ticks.splice(1, 0, uniqueDates[Math.floor(uniqueDates.length / 2)]);
    }
    
    return [...new Map(ticks.map(item => [item.date, item])).values()].map(d => ({
        x: scaleX(new Date(d.date).getTime()),
        label: this.formatDate(d.date)
    }));
  });

  yAxisTicks = computed(() => {
    const scores = this.history.map(d => d.score);
    const maxScore = Math.max(10, ...scores) * 1.1;
    const ticks = [];
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
        const value = Math.round((maxScore / tickCount) * i);
        ticks.push({
            y: this.yScale()(value),
            label: value.toString()
        });
    }
    return ticks;
  });

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}
