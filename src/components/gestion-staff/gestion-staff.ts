import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Invitation, InvitationService } from '@/src/services/invitation.service';
import { NoeudService } from '@/src/services/noeud.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-gestion-staff',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './gestion-staff.html',
  styleUrl: './gestion-staff.css',
})
export class GestionStaff implements OnInit {
  private invitationService = inject(InvitationService);
  private noeudService = inject(NoeudService);
  private toastr = inject(ToastrService);

  invitations = signal<Invitation[]>([]);
  arborescence = signal<any[]>([]);
  isLoadingTree = signal(true);

  emailDestinataire = signal('');
  niveauAcces = signal('LECTURE');
  noeudSelectionneId = signal<number | null>(null); 
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.chargerArborescence();
    this.chargerInvitations();
  }

  chargerArborescence() {
    this.isLoadingTree.set(true);
    this.noeudService.getArborescence()
    .pipe(finalize(() => this.isLoadingTree.set(false)))
    .subscribe({
      next: (data) => {
        this.arborescence.set(data);
        this.noeudSelectionneId.set(null); 
      },
      error: (err) => this.toastr.error('Erreur lors du chargement de l\'organigramme')
    });
  }

  chargerInvitations() {
    this.invitationService.getInvitationsEnAttente().subscribe({
      next: (data) => this.invitations.set(data),
      error: (err) => this.toastr.error('Erreur lors du chargement des invitations')
    });
  }

  selectionnerNoeud(id: number) {
    this.noeudSelectionneId.set(id);
  }

  envoyerInvitation() { 
    const email = this.emailDestinataire();
    const noeudId = this.noeudSelectionneId();
    const acces = this.niveauAcces();

    if (!email || !noeudId) {
      this.toastr.warning('Veuillez remplir l\'email et sélectionner une équipe.');
      return;
    }

    this.isSubmitting.set(true);
    this.invitationService.envoyerInvitation(email, noeudId, acces)
    .pipe(finalize(() => this.isSubmitting.set(false)))
    .subscribe({
      next: () => {
        this.toastr.success('L\'invitation a été envoyée avec succès !');
        this.emailDestinataire.set('');
        this.chargerInvitations();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors de l\'envoi de l\'invitation.');
      }
    });
  }

  supprimerInvitation(inv: Invitation) {
    if (confirm(`Voulez-vous vraiment annuler l'invitation pour ${inv.email} ?`)) {
      this.invitationService.supprimerInvitation(inv.id).subscribe({
        next: () => {
          this.toastr.info('L\'invitation a été annulée.', 'Suppression');
          this.invitations.update(list => list.filter(i => i.id !== inv.id));
        },
        error: () => this.toastr.error('Impossible de supprimer cette invitation.', 'Erreur')
      });
    }
  }

  estExpiree(dateExpiration: string): boolean {
    return new Date(dateExpiration) < new Date();
  }
}