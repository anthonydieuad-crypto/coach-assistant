import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service'; // 👈 Vérifie que le chemin vers services est bon

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // On ne déclenche le spinner que pour les requêtes API (pas pour charger des images ou des fichiers locaux)
  if (req.url.includes('/api/')) {
      loaderService.show();
  }

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};