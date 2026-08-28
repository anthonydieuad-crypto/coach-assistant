import { Routes } from '@angular/router';
import { LoginComponent } from '@/src/components/login/login';
import { SignupComponent } from '@/src/components/signup/signup.component';
import { ProfilComponent } from '@/src/components/profil/profil.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { CalendrierComponent } from "@/src/components/calendrier/calendrier.component";
import { SuiviPresencesComponent } from "@/src/components/suivi-presences/suivi-presences.component";
import { ListeJoueursComponent } from "@/src/components/liste-joueurs/liste-joueurs.component";
import { DetailJoueurComponent } from "@/src/components/detail-joueur/detail-joueur.component";
import { BilanPresencesComponent } from "@/src/components/bilan-presences/bilan-presences.component";
import { BilanCompetitionsComponent } from "@/src/components/bilan-competitions/bilan-competitions.component";

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { AdminArchives } from './components/admin-archives/admin-archives';

import { GenerateurConvocationComponent } from './components/generateur-convocation/generateur-convocation';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { Dashboard } from '@/src/components/dashboard/dashboard';
import { FeuilleMatchComponent } from './components/feuille-match/feuille-match-component/feuille-match-component';
import { GestionStaff } from '@/src/components/gestion-staff/gestion-staff';
import { AdminJoueurDetail } from './components/admin-joueur-details/admin-joueur-details';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'reset-password', component: ResetPassword },
    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard},
            
            // Routes réservées au SUPER_ADMIN
            { path: 'admin', component: AdminDashboardComponent },
            { path: 'admin/archives', component: AdminArchives },
            { path: 'admin/archives/joueurs/:id', component: AdminJoueurDetail },
            
            { path: 'calendrier', component: CalendrierComponent },
            { path: 'presences', component: SuiviPresencesComponent },
            { path: 'joueurs', component: ListeJoueursComponent },
            { path: 'joueurs/:id', component: DetailJoueurComponent },
            { path: 'bilan-presences', component: BilanPresencesComponent },
            { path: 'bilan-competitions', component: BilanCompetitionsComponent },
            { path: 'profil', component: ProfilComponent },
            { path: 'staff', component: GestionStaff, canActivate: [adminGuard] },
            { path: 'feuille-match', component: FeuilleMatchComponent },
            { path: 'convocations', component: GenerateurConvocationComponent },
        ]
    },
    { path: '**', redirectTo: 'login' }
];