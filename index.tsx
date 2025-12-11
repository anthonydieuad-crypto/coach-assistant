import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './src/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));