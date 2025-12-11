import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

type Vue = 'liste' | 'detail' | 'presences' | 'bilan-presences' | 'bilan-competitions' | 'calendrier';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

}
