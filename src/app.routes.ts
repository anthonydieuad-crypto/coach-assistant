import { Routes } from '@angular/router';
import { LoginComponent } from '@/src/components/login/login';
import { SignupComponent } from '@/src/components/signup/signup.component';
import { ProfilComponent } from '@/src/components/profil/profil.component';
import { authGuard } from './guards/auth.guard';
import { CalendrierComponent } from "@/src/components/calendrier/calendrier.component";
import { SuiviPresencesComponent } from "@/src/components/suivi-presences/suivi-presences.component";
import { ListeJoueursComponent } from "@/src/components/liste-joueurs/liste-joueurs.component";
import { DetailJoueurComponent } from "@/src/components/detail-joueur/detail-joueur.component";
import { BilanPresencesComponent } from "@/src/components/bilan-presences/bilan-presences.component";
import { BilanCompetitionsComponent } from "@/src/components/bilan-competitions/bilan-competitions.component";
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { GenerateurConvocationComponent } from './components/generateur-convocation/generateur-convocation';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { Dashboard } from './components/dashboard/dashboard';
import { FeuilleMatchComponent } from './components/feuille-match/feuille-match-component/feuille-match-component';

// N'oublie pas d'importer ton nouveau composant !
import { CreateClubComponent } from './components/create-club/create-club.component';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'reset-password', component: ResetPassword },
    
    // ✅ AJOUT : La route de création de club, protégée par le Guard
    { path: 'creer-club', component: CreateClubComponent, canActivate: [authGuard] },

    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard},
            { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
            { path: 'calendrier', component: CalendrierComponent },
            { path: 'presences', component: SuiviPresencesComponent },
            { path: 'joueurs', component: ListeJoueursComponent },
            { path: 'joueurs/:id', component: DetailJoueurComponent },
            { path: 'bilan-presences', component: BilanPresencesComponent },
            { path: 'bilan-competitions', component: BilanCompetitionsComponent },
            { path: 'profil', component: ProfilComponent },
            { path: 'feuille-match', component: FeuilleMatchComponent, canActivate: [authGuard] },
            { path: 'convocations', component: GenerateurConvocationComponent, canActivate: [authGuard] },]
    },

    { path: '**', redirectTo: 'login' }
];