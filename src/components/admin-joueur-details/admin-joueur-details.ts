import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminJoueurDetailDto } from '../../services/admin.service';
import { GraphiqueJonglesComponent } from '../graphique-jongles/graphique-jongles.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-joueur-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, GraphiqueJonglesComponent, RouterLink, FormsModule],
  templateUrl: './admin-joueur-details.html',
})
export class AdminJoueurDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  joueur = signal<AdminJoueurDetailDto | null>(null);
  
  // Saison sélectionnée pour la lecture des statistiques
  saisonActiveId = signal<number | null>(null);

  saisonActiveStats = computed(() => {
      const j = this.joueur();
      if (!j) return null;
      return j.saisonsStats.find(s => s.saisonId === this.saisonActiveId()) || null;
  });

  evenementsChronologiques = computed(() => {
      const stats = this.saisonActiveStats();
      if (!stats) return [];
      return [...stats.evenements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  ngOnInit() {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.adminService.getJoueurArchiveDetail(id).subscribe({
          next: (j) => {
              this.joueur.set(j);
              // On sélectionne la première saison par défaut si elle existe
              if (j.saisonsStats && j.saisonsStats.length > 0) {
                  this.saisonActiveId.set(j.saisonsStats[0].saisonId);
              }
          },
          error: () => {
              this.toastr.error('Fiche joueur introuvable');
              this.router.navigate(['/admin/archives']);
          }
      });
  }

  surChangementSaison(event: Event) {
      const val = Number((event.target as HTMLSelectElement).value);
      this.saisonActiveId.set(val);
  }
}