import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Import obligatoire pour ngClass
import { AdminService, UserAdmin } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html'
  // 👈 J'ai supprimé la ligne styleUrl car tu n'as pas de fichier CSS
})
export class AdminDashboardComponent implements OnInit { // 👈 Ajout du mot "Component"
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  users = signal<UserAdmin[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs() {
    this.isLoading.set(true); // 👈 CORRECTION : .set(true)
    this.adminService.getAllUsers().subscribe({
        next: (data) => {
            this.users.set(data);
            this.isLoading.set(false);
           },
        error: (err) => {
            console.error(err);
            this.toastr.error('Accès refusé. Êtes-vous Admin ?' , 'Erreur');
            this.isLoading.set(false);
        }
    });
  }

  supprimerUtilisateur(user: UserAdmin) {
    if (confirm(`Supprimer définitivement ${user.prenom} ${user.nom} ?\nCela effacera ses joueurs et événements.`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.toastr.success('Utilisateur supprimé', 'Succès');
          this.chargerUtilisateurs();
        },
        error: () => this.toastr.error('Erreur lors de la suppression', 'Oups')
      });
    }
  }

  changerRole(userId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const nouveauRole = select.value;

    this.adminService.updateUserRole(userId, nouveauRole).subscribe({
      next: () => {
        this.toastr.success('Le rôle a été mis à jour avec succès');
        
        // Mise à jour visuelle immédiate dans le signal users()
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
}