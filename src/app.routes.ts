import { Routes } from '@angular/router';
import { LoginComponent } from '@/src/components/login/login';
import { SignupComponent } from '@/src/components/signup/signup.component';
import { ProfilComponent } from '@/src/components/profil/profil.component'; // 👈 Import
import { authGuard } from './guards/auth.guard';
import { CalendrierComponent } from "@/src/components/calendrier/calendrier.component";
import { SuiviPresencesComponent } from "@/src/components/suivi-presences/suivi-presences.component";
import { ListeJoueursComponent } from "@/src/components/liste-joueurs/liste-joueurs.component";
import { DetailJoueurComponent } from "@/src/components/detail-joueur/detail-joueur.component";
import { BilanPresencesComponent } from "@/src/components/bilan-presences/bilan-presences.component";
import { BilanCompetitionsComponent } from "@/src/components/bilan-competitions/bilan-competitions.component";
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { GenerateurConvocationComponent } from './components/generateur-convocation/generateur-convocation';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },

    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'calendrier', pathMatch: 'full' },
            { path: 'admin', component: AdminDashboardComponent },
            { path: 'calendrier', component: CalendrierComponent },
            { path: 'presences', component: SuiviPresencesComponent },
            { path: 'joueurs', component: ListeJoueursComponent },
            { path: 'joueurs/:id', component: DetailJoueurComponent },
            { path: 'bilan-presences', component: BilanPresencesComponent },
            { path: 'bilan-competitions', component: BilanCompetitionsComponent },
            { path: 'profil', component: ProfilComponent },
            { path: 'convocations', component: GenerateurConvocationComponent, canActivate: [authGuard] },]
    },

    { path: '**', redirectTo: 'login' }
];