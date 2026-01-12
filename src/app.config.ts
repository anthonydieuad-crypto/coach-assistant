import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // 1. Obligatoire pour Toastr
import { provideToastr } from 'ngx-toastr'; // 2. La config manquante

import { loaderInterceptor } from './interceptors/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loaderInterceptor])
    ),
    provideAnimations(), // Active les animations
    provideToastr()      // Active les notifications
  ]
};