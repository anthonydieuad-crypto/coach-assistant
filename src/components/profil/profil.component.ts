import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { SaisonService } from '@/src/services/saison.service';

@Component({
    selector: 'app-profil',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './profil.component.html'
})
export class ProfilComponent {
    // On injecte le service d'authentification en public pour l'utiliser dans le HTML
    public authService = inject(AuthService);
    private saisonService = inject(SaisonService);
    private router = inject(Router);
    private toastr = inject(ToastrService);

    isArchiveModalOpen = signal(false);
    nomNouvelleSaison = signal('');
    isSubmitting = signal(false);

    seDeconnecter() {
        const user = this.authService.utilisateurConnecte();
                const prenom = user?.prenom || 'Coach';

        this.authService.logout();

        //Message de déconnexion
        this.toastr.success(`À bientôt ${prenom} !`, 'Déconnexion réussie', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-right'
          });

          this.router.navigate(['/login']);
        }

        //----METHODE D'ARCHIVAGE---
        ouvrirModalArchive() {
            const anneeProchaine = new Date().getFullYear() + 1;
            this.nomNouvelleSaison.set(`Saison ${new Date().getFullYear()}-${anneeProchaine}`);
            this.isArchiveModalOpen.set(true);
        }

        fermerModal() {
            this.isArchiveModalOpen.set(false);
            this.nomNouvelleSaison.set('');
        }

        confirmerArchivage() {
            if (!this.nomNouvelleSaison().trim()){
                this.toastr.warning('Veuillez entrer un nom pour la nouvelle saison.');
                return;
            }
            this.isArchiveModalOpen.set(true);
            this.saisonService.archiverSaisonActuelle(this.nomNouvelleSaison()).subscribe({
                next: (res) => {
                    this.toastr.success(res.message, 'Saison archivée');
                    this.isSubmitting.set(false);
                    this.fermerModal();
                    
                    //Redirection + rafraichissement pour vider les stats côté front
                    this.router.navigate(['/dashboard']).then(() => {
                        window.location.reload();
                    });
                },
                error: (err) => {
                    console.error(err);
                    this.toastr.error('Erreur lors de l\'archivage de la saison', 'Erreur');
                    this.isSubmitting.set(false);
                }
            })
        }
        
    }