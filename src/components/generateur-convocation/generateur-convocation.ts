import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur.service'; // Ajout du service

@Component({
  selector: 'app-generateur-convocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generateur-convocation.html'
})
export class GenerateurConvocationComponent implements OnInit {
  // On injecte le service pour récupérer les joueurs
  private joueurService = inject(JoueurService);
  
  // On lit le "signal" des joueurs (la liste qui vient de la BDD)
  joueurs = this.joueurService.joueurs; 

  typeEvenement: string = 'plateau';
  lieuEvenement: string = '';
  lieuRdv: string = '';
  heureRdv: string = '';
  consignes: string = 'en tenue du club (Jogging+veste), protège-tibias et une bouteille d\'eau';
  
  joueursConvoques: Set<string> = new Set();
  messageGenere: string = '';

  ngOnInit() {
    this.genererMessage();
  }

  toggleJoueur(nomComplet: string) {
    if (this.joueursConvoques.has(nomComplet)) {
      this.joueursConvoques.delete(nomComplet);
    } else {
      this.joueursConvoques.add(nomComplet);
    }
    this.genererMessage();
  }

  genererMessage() {
    let message = `Bonjour, les convoqués pour un ${this.typeEvenement} à ${this.lieuEvenement || '[Lieu]'} devront se présenter OBLIGATOIREMENT au ${this.lieuRdv || '[Lieu de RDV]'} au plus tard à ${this.heureRdv || '[Heure]'} ${this.consignes}.\n\nMerci de confirmer la présence de votre enfant par un 👍🏻 ou l'absence par un 👎🏻 :\n\n`;
    
    let index = 1;
    this.joueursConvoques.forEach(joueur => {
      message += `${index}- ${joueur}\n`;
      index++;
    });

    this.messageGenere = message;
  }

  copierMessage() {
    navigator.clipboard.writeText(this.messageGenere).then(() => {
      alert('Message copié dans le presse-papier ! Prêt pour WhatsApp 📱');
    });
  }
}