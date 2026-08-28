import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  const user = authService.utilisateurConnecte();

  if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.niveauAcces === 'GESTION')) {
    return true; // Droit accordé
  } else {
    toastr.error('Accès réservé aux administrateurs ou gestionnaires', 'Accès Refusé');
    router.navigate(['/dashboard']);
    return false; // Droit refusé
  }
};