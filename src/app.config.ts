import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 👇 Imports HTTP et Intercepteurs
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor'; // 👈 Vérifie ce chemin

// 👇 Imports Animations & Toastr
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideAnimations(),
    provideToastr(),

    provideHttpClient(withXhr(), 
      withInterceptors([
        loaderInterceptor,
        authInterceptor 
      ])
    ), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
};