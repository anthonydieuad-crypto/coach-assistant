import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { appConfig } from './app.config'; // 👈 Vérifie que cet import est là

bootstrapApplication(AppComponent, appConfig) // 👈 Vérifie que 'appConfig' est bien passé ici
    .catch((err) => console.error(err));