import { JoueurService } from '@/src/services/joueur.service';
import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feuille-match-component',
  imports: [],
  templateUrl: './feuille-match-component.html',
  styleUrl: './feuille-match-component.css',
})
export class FeuilleMatchComponent {
    joueurService = inject(JoueurService);
    toastr = inject(ToastrService);
    
    joueurs = this.joueurService.joueurs;
    selectionFeuilleMatch = signal<number[]>([]);

    basculerSelectionJoueur(id: number) {
        this.selectionFeuilleMatch.update(selection => {
            if (selection.includes(id)) {
                return selection.filter(jId => jId !== id);
            } else {
                if (selection.length >= 11) {
                    this.toastr.warning('Limite atteinte : 11 joueurs maximum sur la feuille.');
                    return selection;
                }

                const joueurCible = this.joueurs().find(j => j.id === id);
                if (!joueurCible) return selection;

                const joueursActuels = this.joueurs().filter(j => selection.includes(j.id));
                const nbMutations = joueursActuels.filter(j => j.mutation || j.mutationHorsDelai).length;
                const nbMutationsHorsDelai = joueursActuels.filter(j => j.mutationHorsDelai).length;

                if (joueurCible.mutationHorsDelai) {
                    if (nbMutationsHorsDelai >= 1) {
                        this.toastr.warning('Règlement FFF : 1 seul joueur en Mutation Hors Délai autorisé.');
                        return selection;
                    }
                    if (nbMutations >= 4) {
                        this.toastr.warning('Règlement FFF : 4 joueurs mutés maximum.');
                        return selection;
                    }
                } else if (joueurCible.mutation) {
                    if (nbMutations >= 4) {
                        this.toastr.warning('Règlement FFF : 4 joueurs mutés maximum.');
                        return selection;
                    }
                }

                return [...selection, id];
            }
        });
    }

    validerGenerationFeuille() {
        if (this.selectionFeuilleMatch().length > 0) {
            this.joueurService.telechargerFeuilleDeMatchPdf(this.selectionFeuilleMatch());
        }
    }
}