import { JoueurService } from '@/src/services/joueur.service';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-feuille-match-component',
  imports: [],
  templateUrl: './feuille-match-component.html',
  styleUrl: './feuille-match-component.css',
})
export class FeuilleMatchComponent {
joueurService = inject(JoueurService);
    joueurs = this.joueurService.joueurs;

    selectionFeuilleMatch = signal<number[]>([]);

    basculerSelectionJoueur(id: number) {
        this.selectionFeuilleMatch.update(selection => {
            if (selection.includes(id)) {
                return selection.filter(jId => jId !== id);
            } else {
                if (selection.length >= 10) return selection;
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
