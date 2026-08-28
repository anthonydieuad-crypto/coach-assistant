import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AdminService, UserAdmin, ClubAdmin } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  tabActif = signal<'users' | 'clubs'>('users');
  users = signal<UserAdmin[]>([]);
  clubs = signal<ClubAdmin[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.chargerUtilisateurs();
    this.chargerClubs();
  }

  chargerUtilisateurs() {
    this.isLoading.set(true);
    this.adminService.getAllUsers().subscribe({
        next: (data) => {
            this.users.set(data);
            this.isLoading.set(false);
        },
        error: (err) => {
            console.error(err);
            this.toastr.error('Accès refusé' , 'Erreur');
            this.isLoading.set(false);
        }
    });
  }

  supprimerUtilisateur(user: UserAdmin) {
    if (confirm(`Supprimer définitivement ${user.prenom} ${user.nom} ?\nS'il s'agit d'un créateur de club, la requête sera rejetée.`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.toastr.success('Utilisateur supprimé', 'Succès');
          this.chargerUtilisateurs();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Erreur lors de la suppression', 'Oups')
      });
    }
  }

  changerRole(userId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const nouveauRole = select.value;
    
    this.adminService.updateUserRole(userId, nouveauRole).subscribe({
      next: () => {
        this.toastr.success('Le rôle a été mis à jour avec succès');
        this.users.update(utilisateurs => 
            utilisateurs.map(u => u.id === userId ? { ...u, role: nouveauRole } : u)
        );
      },
      error: () => {
        this.toastr.error('Erreur lors du changement de rôle');
        this.chargerUtilisateurs();
      }
    });
  }

  chargerClubs() {
    this.adminService.getClubs().subscribe({
        next: (data) => this.clubs.set(data),
        error: () => this.toastr.error('Erreur chargement des clubs')
    });
  }

  basculerArchiveClub(club: ClubAdmin) {
    const nouvelEtat = !club.archive;
    this.adminService.archiverClub(club.id, nouvelEtat).subscribe({
        next: () => {
            this.toastr.success(nouvelEtat ? 'Club archivé' : 'Club désarchivé');
            this.clubs.update(list => list.map(c => c.id === club.id ? { ...c, archive: nouvelEtat } : c));
        },
        error: () => this.toastr.error('Erreur de mise à jour')
    });
  }

  supprimerClub(club: ClubAdmin) {
    if (confirm(`ATTENTION DANGER ⚠️\n\nVoulez-vous vraiment supprimer le club "${club.nom}" ?\n\nCette action est IRRÉVERSIBLE et détruira toutes les données associées : joueurs, calendriers, statistiques et comptes du staff.`)) {
        this.adminService.supprimerClub(club.id).subscribe({
            next: () => {
                this.toastr.success('Club et données associés supprimés avec succès.');
                this.clubs.update(list => list.filter(c => c.id !== club.id));
                
                // CORRECTION : On rafraîchit immédiatement la liste des utilisateurs
                // pour faire disparaître les coachs qui ont été purgés avec leur club.
                this.chargerUtilisateurs(); 
            },
            error: (err) => {
                this.toastr.error(err.error?.message || 'Impossible de supprimer le club.');
            }
        });
    }
  }
}