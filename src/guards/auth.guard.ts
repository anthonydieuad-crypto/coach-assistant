import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isConnecte = authService.utilisateurConnecte() !== null;
  const hasClub = authService.hasClub();
  const urlCible = state.url;

  //Scénario 1: l'utilisateur n'est pas connecté
  if (!isConnecte) {
    router.navigate(['/login']);
    return false;
  }

  //Scénario 2: l'utilisateur est connecté mais n'a pas de club
  if (!hasClub) {
    if (!urlCible.includes('/creer-club')) {
      router.navigate(['creer-club']);
      return false;
    }
    return true;
  }

  //Scénario 23 l'utilisateur est connecté et possède un club
  if (hasClub) {
    if (urlCible.includes('/creer-club')) {
      router.navigate(['/dashboad']);
      return false;
    }
    return true;
  }
  return true;
};


  