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
    const user = this.authService.utilisateurConnecte();
    if (!user) return;

    this.http.get<EvenementCalendrier[]>(`${this.apiUrl}?coachId=${user.id}`).subscribe({
      next: (data) => this.etatEvenements.set(data),
      error: (err) => console.error('Erreur chargement', err)
    });
  }

  // 👇 MODIFIÉ : On retourne l'Observable + pipe(tap)
  ajouterEvenement(evenement: Omit<EvenementCalendrier, 'id'>) {
    const user = this.authService.utilisateurConnecte();
    if (!user) throw new Error("Non connecté");

    return this.http.post<EvenementCalendrier>(`${this.apiUrl}?coachId=${user.id}`, evenement).pipe(
      tap((nouvelEvent) => {
        // Mise à jour immédiate de la liste locale
        this.etatEvenements.update(liste => [...liste, nouvelEvent]);
      })
    );
  }

  // 👇 MODIFIÉ
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