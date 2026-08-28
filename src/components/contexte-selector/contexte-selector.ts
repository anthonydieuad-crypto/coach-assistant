import { Component, inject, OnInit, signal } from '@angular/core';
import { Noeud, Saison } from '@/src/models/contexte.model';
import { ContexteService } from '@/src/services/contexte.service';
import { NoeudService } from '@/src/services/noeud.service';
import { SaisonService } from '@/src/services/saison.service';

@Component({
  selector: 'app-contexte-selector',
  imports: [],
  templateUrl: './contexte-selector.html',
  styleUrl: './contexte-selector.css',
})
export class ContexteSelector implements OnInit {

  contexteService = inject(ContexteService);
  private saisonService = inject(SaisonService);
  private noeudService = inject(NoeudService);

  saisons = signal<Saison[]>([]);
  noeuds = signal<any[]>([]);

  ngOnInit(): void {
    this.chargerSaisons();
    this.chargerNoeuds();
  }

  chargerSaisons() {
    this.saisonService.getSaison().subscribe({
      next: (data) => {
        this.saisons.set(data);
        const saisonActive = data.find(s => s.active);
        if (saisonActive) {
          this.contexteService.changerSaison(saisonActive);
        }
      },
      error: (err) => console.error('Erreur chargement saisons', err)
    });
  }

  chargerNoeuds() {
    this.noeudService.getArborescence().subscribe({
      next: (data) => {
        const noeudsAplatit = this.aplatirArbre(data, 0);
        this.noeuds.set(noeudsAplatit);
        
        if (noeudsAplatit.length > 0) {
          const currentId = this.contexteService.noeudActif()?.id;
          const selected = noeudsAplatit.find(n => n.id === currentId) || noeudsAplatit[0];
          this.contexteService.changerNoeud(selected);
        }
      },
      error: (err) => console.error('Erreur chargement organigramme', err)
    });
  }

  private aplatirArbre(noeuds: any[], niveau: number): any[] {
    let resultat: any[] = [];
    for (const noeud of noeuds) {
      const prefix = niveau > 0 ? '  '.repeat(niveau) : '';
      let nomPourAffichage = noeud.nom;
      
      // MODIFICATION : Ne remplace par "Vue d'ensemble" que si le nom est générique
      if (niveau === 0 && !noeud.parentId && (noeud.nom === 'Direction' || noeud.nom === 'Équipe Principale')) {
          nomPourAffichage = "Vue d'ensemble";
      }

      resultat.push({ ...noeud, nomAffiche: prefix + nomPourAffichage });
      
      if (noeud.enfants && noeud.enfants.length > 0) {
        resultat = resultat.concat(this.aplatirArbre(noeud.enfants, niveau + 1));
      }
    }
    return resultat;
  }

  onSaisonChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedSaison = this.saisons().find(s => s.id === Number(target.value));
    if (selectedSaison) {
        this.contexteService.changerSaison(selectedSaison);
    }
  }

  onNoeudChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedNoeud = this.noeuds().find(n => n.id === Number(target.value));
    if (selectedNoeud) {
        this.contexteService.changerNoeud(selectedNoeud);
    }
  }
}