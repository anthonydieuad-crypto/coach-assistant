import { Routes } from '@angular/router';
import { CalendrierComponent } from './components/calendrier/calendrier.component';
import { SuiviPresencesComponent } from './components/suivi-presences/suivi-presences.component';
import {ListeJoueursComponent} from "@/src/components/liste-joueurs/liste-joueurs.component";
import { BilanPresencesComponent } from './components/bilan-presences/bilan-presences.component';
import { BilanCompetitionsComponent } from './components/bilan-competitions/bilan-competitions.component';
import {DetailJoueurComponent} from "@/src/components/detail-joueur/detail-joueur.component";

export const routes: Routes = [
    { path: '', redirectTo: 'calendrier', pathMatch: 'full' }, // Redirection par défaut
    { path: 'calendrier', component: CalendrierComponent },
    { path: 'presences', component: SuiviPresencesComponent },
    { path: 'joueurs', component: ListeJoueursComponent },
    { path: 'joueurs/:id', component: DetailJoueurComponent },
    { path: 'bilan-presences', component: BilanPresencesComponent },
    { path: 'bilan-competitions', component: BilanCompetitionsComponent },
];