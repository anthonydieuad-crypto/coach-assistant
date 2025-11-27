
import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { ScoreJongle } from '../../models/joueur.model';

@Component({
  selector: 'app-graphique-jongles',
  standalone: true,
  templateUrl: './graphique-jongles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphiqueJonglesComponent {
  @Input({ required: true }) historique: ScoreJongle[] = [];
  
  // Dimensions du graphique
  largeur = 500;
  hauteur = 250;
  marge = { top: 20, right: 20, bottom: 40, left: 40 };
  
  largeurInterne = this.largeur - this.marge.left - this.marge.right;
  hauteurInterne = this.hauteur - this.marge.top - this.marge.bottom;

  // Propriétés calculées pour le rendu SVG
  echelleX = computed(() => {
    if (this.historique.length < 1) return () => 0;
    const dates = this.historique.map(d => new Date(d.date).getTime());
    const dateMin = Math.min(...dates);
    const dateMax = Math.max(...dates);
    return (date: number) => {
      if (dateMax === dateMin) return this.largeurInterne / 2;
      return ((date - dateMin) / (dateMax - dateMin)) * this.largeurInterne;
    };
  });

  echelleY = computed(() => {
    const scores = this.historique.map(d => d.score);
    const scoreMax = Math.max(10, ...scores) * 1.1; // Min 10, +10% de marge
    return (score: number) => this.hauteurInterne - (score / scoreMax) * this.hauteurInterne;
  });

  cheminLigne = computed(() => {
    if (this.historique.length < 2) return '';
    const scaleX = this.echelleX();
    const scaleY = this.echelleY();
    let chemin = 'M';
    this.historique.forEach((d, i) => {
      const x = scaleX(new Date(d.date).getTime());
      const y = scaleY(d.score);
      chemin += ` ${x},${y}`;
      if (i === 0) chemin += ' L';
    });
    return chemin;
  });

  cercles = computed(() => {
    if (this.historique.length === 0) return [];
    const scaleX = this.echelleX();
    const scaleY = this.echelleY();
    return this.historique.map(d => ({
      cx: scaleX(new Date(d.date).getTime()),
      cy: scaleY(d.score),
      score: d.score,
    }));
  });

  graduationsAxeX = computed(() => {
    if (this.historique.length === 0) return [];
    const scaleX = this.echelleX();
    // Afficher la première et la dernière date
    const datesUniques = [...new Map(this.historique.map(item => [item.date, item])).values()];
    
    if (datesUniques.length <= 1) {
        return [{ x: scaleX(new Date(datesUniques[0].date).getTime()), label: this.formaterDate(datesUniques[0].date) }];
    }

    const graduations = [datesUniques[0], datesUniques[datesUniques.length - 1]];
    if (datesUniques.length > 2) {
      graduations.splice(1, 0, datesUniques[Math.floor(datesUniques.length / 2)]);
    }
    
    return [...new Map(graduations.map(item => [item.date, item])).values()].map(d => ({
        x: scaleX(new Date(d.date).getTime()),
        label: this.formaterDate(d.date)
    }));
  });

  graduationsAxeY = computed(() => {
    const scores = this.historique.map(d => d.score);
    const scoreMax = Math.max(10, ...scores) * 1.1;
    const graduations = [];
    const nombreGraduations = 5;
    for (let i = 0; i <= nombreGraduations; i++) {
        const valeur = Math.round((scoreMax / nombreGraduations) * i);
        graduations.push({
            y: this.echelleY()(valeur),
            label: valeur.toString()
        });
    }
    return graduations;
  });

  private formaterDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}