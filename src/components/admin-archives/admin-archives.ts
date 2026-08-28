import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminJoueurDto } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-archives',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-archives.html'
})
export class AdminArchives implements OnInit {
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  joueurs = signal<AdminJoueurDto[]>([]);
  isLoading = signal(true);

  filtreClub = signal<string>('all');
  filtreSaison = signal<string>('all');
  searchTerm = signal<string>(''); // Recherche libre

  clubsExistants = computed(() => {
    const clubs = new Set<string>();
    this.joueurs().forEach(j => clubs.add(j.clubNom));
    return Array.from(clubs).sort();
  });

  saisonsExistantes = computed(() => {
    const saisons = new Set<string>();
    this.joueurs().forEach(j => {
      j.saisons.forEach(s => saisons.add(s));
    });
    return Array.from(saisons).sort();
  });

  joueursFiltres = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    
    return this.joueurs().filter(j => {
      const matchClub = this.filtreClub() === 'all' || j.clubNom === this.filtreClub();
      const matchSaison = this.filtreSaison() === 'all' || j.saisons.includes(this.filtreSaison());
      
      const matchSearch = !search || 
        j.prenom.toLowerCase().includes(search) || 
        j.nom.toLowerCase().includes(search) || 
        (j.numeroLicence && j.numeroLicence.toLowerCase().includes(search));

      return matchClub && matchSaison && matchSearch;
    });
  });

  ngOnInit() {
    this.adminService.getJoueursArchives().subscribe({
      next: (data) => {
        this.joueurs.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement des archives');
        this.isLoading.set(false);
      }
    });
  }
}