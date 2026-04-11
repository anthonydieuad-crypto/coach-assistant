import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-changelog',
  imports: [],
  templateUrl: './changelog.html',
  styleUrl: './changelog.css',
})
export class Changelog implements OnInit{

  //Signal pour contrôler l'affichage de la modal
  isVisible = signal(false);
  
  private readonly CURRENT_VERSION = 'v1.3';

  ngOnInit(): void {
    //On vérifie dans la mémoire du navigateur quelle version l'utilisateur a vu en dernier
    const savedVersion = localStorage.getItem('changelog_version');

    //S'il n'a pas encore vu la version actuelle, on affiche la pop-up
      if (savedVersion !== this.CURRENT_VERSION) {
        this.isVisible.set(true);
      }
  }

  fermer(){
    //Quand on clique sur fermer, on enregistre qu'il a vu cette version
    localStorage.setItem('changelog_version', this.CURRENT_VERSION);
    this.isVisible.set(false);
  }
}
