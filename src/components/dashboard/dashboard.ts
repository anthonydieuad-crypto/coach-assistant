import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '@/src/services/dashboard.service';
import { OrganigrammeEditeur} from '@/src/components/organigramme-editeur/organigramme-editeur';
import { AuthService } from '@/src/services/auth.service';
import { ContexteService } from '@/src/services/contexte.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, OrganigrammeEditeur],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  public readonly authService = inject(AuthService); 
  private readonly contexteService = inject(ContexteService);

  isLoading = signal<boolean>(true);
  compteARebours = signal<string>('Calcul...');
  dashboardData = signal<any | null>(null);

  private timerInterval: any;

  constructor() {
    effect((onCleanup) => {
      const isConnected = this.authService.utilisateurConnecte();
      const saison = this.contexteService.saisonActive();
      const noeud = this.contexteService.noeudActif();

      // FIX ANTI-SPAM : On crée un délai artificiel pour éviter que l'API
      // soit appelée frénétiquement lors de l'initialisation des signaux
      if (isConnected && saison) {
        const timer = setTimeout(() => {
          this.fetchRealData(saison.id, noeud?.id);
        }, 100);
        
        onCleanup(() => clearTimeout(timer));
      }
    });
  }

  ngOnInit(): void {
    // Le premier fetch est maintenant géré dynamiquement par l'effect()
  }

  fetchRealData(saisonId?:number, noeudId?:number) {
    this.isLoading.set(true)
    this.dashboardService.getStats(saisonId, noeudId).subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.isLoading.set(false);

        if (data && data.prochainEvenement) {
          this.initCountdown(data.prochainEvenement.date);
        } else {
          this.compteARebours.set('Aucun événement à venir');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du dashboard :', err);
        this.isLoading.set(false);
        this.compteARebours.set('Erreur de chargement');
      }
    });
  }

  initCountdown(dateEvenement: any) {
    let targetDate: number;

    if (Array.isArray(dateEvenement)) {
      targetDate = new Date(dateEvenement[0], dateEvenement[1] - 1, dateEvenement[2]).getTime();
    } else {
      targetDate = new Date(dateEvenement).getTime();
    }

    if (isNaN(targetDate)) {
      this.compteARebours.set('Date non reconnue');
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.compteARebours.set('Événement en cours ou passé');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        this.compteARebours.set(`${days}j ${hours}h ${minutes}m`);
      } else {
        this.compteARebours.set(`${hours}h ${minutes}m`);
      }
    };

    updateCountdown();
    this.timerInterval = setInterval(updateCountdown, 60000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}