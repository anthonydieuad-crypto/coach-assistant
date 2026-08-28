import { NoeudService } from '@/src/services/noeud.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

interface NoeudPlat {
  id: number;
  nom: string;
  niveau: number;
  parentId: number | null;
}

@Component({
  selector: 'app-organigramme-editeur',
  imports: [CommonModule, DragDropModule],
  templateUrl: './organigramme-editeur.html',
  styleUrl: './organigramme-editeur.css',
})
export class OrganigrammeEditeur implements OnInit {
  private noeudService = inject(NoeudService);
  private toastr = inject(ToastrService);

  noeudsFlat = signal<NoeudPlat[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.chargerOrganigramme();
  }

  chargerOrganigramme() {
    this.isLoading.set(true);
    this.noeudService.getArborescence().subscribe({
      next: (arbre) => {
        this.noeudsFlat.set(this.aplatirArbre(arbre, 0));
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error("Erreur lors du chargement de l'organigramme");
        this.isLoading.set(false);
      }
    });
  }

  private aplatirArbre(noeuds: any[], niveau: number): NoeudPlat[] {
    let resultat: NoeudPlat[] = [];
    for (const noeud of noeuds) {
      resultat.push({
        id: noeud.id,
        nom: noeud.nom,
        niveau: noeud.niveau,
        parentId: noeud.parentId || null
      });
      if (noeud.enfants && noeud.enfants.length > 0) {
        resultat = resultat.concat(this.aplatirArbre(noeud.enfants, niveau + 1));
      }
    }
    return resultat;
  }

  onDrop(event: CdkDragDrop<NoeudPlat[]>) {
    if (event.previousIndex === event.currentIndex) return;

    const listeActuelle = [...this.noeudsFlat()];
    moveItemInArray(listeActuelle, event.previousIndex, event.currentIndex);

    const noeudDeplace = listeActuelle[event.currentIndex];
    let nouveauParentId: number | null = null;
    let nouveauNiveau = 0;

    if (event.currentIndex > 0) {
      const noeudAuDessus = listeActuelle[event.currentIndex - 1];
      nouveauParentId = noeudAuDessus.parentId;
      nouveauNiveau = noeudAuDessus.niveau;
    }

    noeudDeplace.parentId = nouveauParentId;
    noeudDeplace.niveau = nouveauNiveau;

    this.noeudsFlat.set(listeActuelle);

    this.noeudService.reorganiser(listeActuelle).subscribe({
      next: () => this.toastr.success('Ordre et structure sauvegardés !', 'Succès'),
      error: (err) => {
        console.error(err);
        this.toastr.error('Mouvement non autorisé dans votre juridiction.', 'Annulation');
        this.chargerOrganigramme(); // Rollback visuel
      }
    });
  }

  ajouterEquipe() {
    const nom = prompt("Nom de la nouvelle équipe(ex:U15, Pôle formation...) ?");
    if (!nom || nom.trim() === '') return;

    this.noeudService.creerNoeud(nom, null).subscribe({
      next: () => {
        this.toastr.success(`L'équipe ${nom} a été créée !`, 'Succès');
        // CORRECTION : On recharge l'arborescence complète depuis la base de données 
        // pour récupérer le parent auto-assigné par le serveur et avoir le bon niveau (marge)
        this.chargerOrganigramme();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors de la création de l\'équipe', 'Erreur');
      }
    });
  }

  renommerEquipe(noeud: NoeudPlat) {
    const nouveauNom = prompt("Nouveau nom pour cette équipe ?", noeud.nom);
    if (!nouveauNom || nouveauNom.trim() === '' || nouveauNom === noeud.nom) return;

    this.noeudService.renommerNoeud(noeud.id, nouveauNom).subscribe({
      next: () => {
        this.toastr.success('Equipe renommée !', 'Succès');
        this.noeudsFlat.update(noeuds =>
          noeuds.map(n => n.id === noeud.id ? { ...n, nom: nouveauNom } : n)
        );
      },
      error: () => this.toastr.error('Erreur lors du renommage', 'Erreur')
    });
  }

  supprimerEquipe(noeud: NoeudPlat) {
    if (!confirm(`⚠️ Attention ! Voulez-vous vraiment supprimer l'équipe "${noeud.nom}" ?`)) return;

    this.noeudService.supprimerNoeud(noeud.id).subscribe({
      next: () => {
        this.toastr.success('Equipe supprimée !', 'Succès');
        this.noeudsFlat.update(noeuds => noeuds.filter(n => n.id != noeud.id));
      },
      error: () => this.toastr.error('Action refusée ou équipe non vide.', 'Erreur')
    });
  }
}