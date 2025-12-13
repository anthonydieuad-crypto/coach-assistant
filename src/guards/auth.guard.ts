import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.utilisateurConnecte()) {
    return true; // ✅ C'est ouvert
  } else {
    router.navigate(['/login']); // ⛔ Dehors ! Retour au login
    return false;
  }
};