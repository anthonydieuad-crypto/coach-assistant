import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EvenementCalendrier } from '../models/evenement.model';
import { environment } from '../environments/environment'; // Vérifie ton chemin ../ ou ../../
import { AuthService } from "./auth.service";
import { tap } from 'rxjs/operators'; // 👈 Import important

@Injectable({
  providedIn: 'root',
})
export class EvenementService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/evenements`;

  private etatEvenements = signal<EvenementCalendrier[]>([]);
  evenements = this.etatEvenements.asReadonly();

  // On garde ton brouillon pour la navigation entre pages
  brouillonEvenement = signal<Partial<EvenementCalendrier> | null>(null);

  constructor() {
    effect(() => {
      if (this.authService.utilisateurConnecte()) {
        this.chargerEvenements();
      } else {
        this.etatEvenements.set([]);
      }
    });
  }

  chargerEvenements() {
    if (!this.authService.utilisateurConnecte()) return;
     
    this.http.get<EvenementCalendrier[]>(this.apiUrl).subscribe({
       next: (data) => {
       const dataTrie = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
       this.etatEvenements.set(dataTrie);
       },
       error: (err) => console.error('Erreur chargement', err)
       });
  }

  ajouterEvenement(evenement: Omit<EvenementCalendrier, 'id'>) {
    if (!this.authService.utilisateurConnecte()) throw new Error("Non connécté");
    
    return this.http.post<EvenementCalendrier>(this.apiUrl, evenement).pipe(
      tap((nouvelEvent) => {
        this.etatEvenements.update(liste => [...liste, nouvelEvent]);
      })
    );
  }
  mettreAJourEvenement(evenement: EvenementCalendrier) {
    return this.http.put<EvenementCalendrier>(`${this.apiUrl}/${evenement.id}`, evenement).pipe(
      tap((eventMaj) => {
        this.etatEvenements.update(liste =>
            liste.map(e => e.id === eventMaj.id ? eventMaj : e)
        );
      })
    );
  }

  // 👇 MODIFIÉ
  supprimerEvenement(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.etatEvenements.update(liste => liste.filter(e => e.id !== id));
      })
    );
  }
}