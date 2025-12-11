import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router'; // 👈 Nouveaux imports
import { JoueurService } from '../../services/joueur.service';
import { EvenementService } from '../../services/evenement.service';
import { Joueur } from '../../models/joueur.model';
import { GraphiqueJonglesComponent } from '../graphique-jongles/graphique-jongles.component';

@Component({
  selector: 'app-detail-joueur',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, GraphiqueJonglesComponent, RouterLink], // Ajout RouterLink
  templateUrl: './detail-joueur.component.html',
})
export class DetailJoueurComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private joueurService = inject(JoueurService);
  private evenementService = inject(EvenementService);

  // Le joueur est maintenant un Signal qui peut être indéfini au début
  joueur = signal<Joueur | undefined>(undefined);

  tousLesEvenements = this.evenementService.evenements;

  ngOnInit() {
    // 1. On récupère l'ID depuis l'URL (ex: /joueurs/5)
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 2. On cherche le joueur dans le service
    const joueurTrouve = this.joueurService.joueurs().find(j => j.id === id);

    if (joueurTrouve) {
      this.joueur.set(joueurTrouve);
    } else {
      // Si pas trouvé (ex: id invalide), on retourne à la liste
      this.router.navigate(['/joueurs']);
    }
  }

  // --- Tes anciennes méthodes adaptées aux Signals ---

  supprimerJoueur() {
    const j = this.joueur();
    if (j && confirm('Voulez-vous vraiment supprimer ce joueur ?')) {
      this.joueurService.supprimerJoueur(j.id);
      this.router.navigate(['/joueurs']); // Retour liste après suppression
    }
  }

  ajouterScore(scoreInput: string) {
    const score = parseInt(scoreInput);
    const j = this.joueur();
    if (j && !isNaN(score)) {
      const date = new Date().toISOString().split('T')[0];
      this.joueurService.ajouterScoreJongle(j.id, date, score);
      // Petite astuce : on recharge le joueur pour voir le graph se mettre à jour
      // (Le service met à jour la liste globale, donc notre signal joueur() devrait suivre si on le relie bien,
      // mais ici on a fait une copie. Pour faire simple :)
      setTimeout(() => {
        const updated = this.joueurService.joueurs().find(p => p.id === j.id);
        this.joueur.set(updated);
      }, 100);
    }
  }

  // Calculs (identiques à avant, mais avec des checks de sécurité)
  evenementsConvocation = computed(() => {
    const j = this.joueur();
    if (!j) return [];
    return this.tousLesEvenements().filter(event =>
        (event.type === 'plateau' || event.type === 'match' || event.type === 'tournoi') &&
        event.participants.includes(j.id)
    );
  });
}