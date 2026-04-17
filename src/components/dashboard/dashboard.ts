import { DashboardService } from '@/src/services/dashboard.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy{
private readonly dashboardService = inject(DashboardService);

  isLoading = signal<boolean>(true);
  compteARebours = signal<string>('Calcul...');
   dashboardData = signal<any | null>(null);

  private timerInterval: any;

  ngOnInit(): void {
    this.fetchRealData();
  }

  fetchRealData(){
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.isLoading.set(false);

        if (data && data.prochainEvenement) {
          this.initCountdown(data.prochainEvenement.date);
        }else {
          this.compteARebours.set('Aucun événement à venir');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du dashboad :', err);
        this.isLoading.set(false);
        this.compteARebours.set('Erreur de chargement');
      }
    })
  }

  initCountdown(dateEvenement: any) {
    let targetDate: number;

    // 1. Sécurité : On gère le format "Tableau" envoyé par Spring Boot (ex: [2024, 12, 25])
    if (Array.isArray(dateEvenement)) {
      // Attention: En JavaScript, les mois commencent à 0 (0 = Janvier, 11 = Décembre)
      targetDate = new Date(dateEvenement[0], dateEvenement[1] - 1, dateEvenement[2]).getTime();
    } 
    // 2. Format classique "String" (ex: "2024-12-25")
    else {
      targetDate = new Date(dateEvenement).getTime();
    }

    // Sécurité supplémentaire si la date est vraiment illisible
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
    if (this.timerInterval) clearInterval(this.timerInterval)
  }

}
