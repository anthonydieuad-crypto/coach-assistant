import { Routes } from '@angular/router';
import { LoginComponent } from '@/src/components/login/login';
import { authGuard } from './guards/auth-guard';
import {CalendrierComponent} from "@/src/components/calendrier/calendrier.component";
import {SuiviPresencesComponent} from "@/src/components/suivi-presences/suivi-presences.component";
import {ListeJoueursComponent} from "@/src/components/liste-joueurs/liste-joueurs.component";
import {DetailJoueurComponent} from "@/src/components/detail-joueur/detail-joueur.component";
import {BilanPresencesComponent} from "@/src/components/bilan-presences/bilan-presences.component";
import {BilanCompetitionsComponent} from "@/src/components/bilan-competitions/bilan-competitions.component"; // 👈 Import du gardien

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // Accès libre
    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'calendrier', pathMatch: 'full' },
            { path: 'calendrier', component: CalendrierComponent },
            { path: 'presences', component: SuiviPresencesComponent },
            { path: 'joueurs', component: ListeJoueursComponent },
            { path: 'joueurs/:id', component: DetailJoueurComponent },
            { path: 'bilan-presences', component: BilanPresencesComponent },
            { path: 'bilan-competitions', component: BilanCompetitionsComponent },
        ]
    },

    { path: '**', redirectTo: 'login' }
];