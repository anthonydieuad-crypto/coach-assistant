import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.utilisateurConnecte();

  // Seul le SUPER_ADMIN (Toi) a le droit d'entrer ici
  if (user && user.role === 'SUPER_ADMIN') {
    return true;
  }

  // Si c'est un simple coach ou un CLUB_ADMIN, on le renvoie sur son dashboard
  router.navigate(['/dashboard']);
  return false;
};