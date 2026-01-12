import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 👇 Imports HTTP et Intercepteurs
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor'; // 👈 Vérifie ce chemin

// 👇 Imports Animations & Toastr
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideAnimations(),
    provideToastr(),

    // 👇 C'EST ICI QUE TOUT SE JOUE
    provideHttpClient(
      // On liste simplement les intercepteurs dans l'ordre d'exécution
      withInterceptors([
        loaderInterceptor, // D'abord le loader
        authInterceptor    // Ensuite l'auth (ajoute le token)
      ])
    )
  ]
};