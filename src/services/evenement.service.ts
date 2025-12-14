import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EvenementCalendrier } from '../models/evenement.model';
import { environment } from "@/src/environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class EvenementService {
  private http = inject(HttpClient);
  private authService = inject(AuthService); // 👇 Injection Auth
  private apiUrl = `${environment.apiUrl}/evenements`;

  private etatEvenements = signal<EvenementCalendrier[]>([]);
  evenements = this.etatEvenements.asReadonly();
  brouillonEvenement = signal<Partial<EvenementCalendrier> | null>(null);

  constructor() {
    // Recharge auto quand on change de compte
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

    // 👇 On filtre par coach
    this.http.get<EvenementCalendrier[]>(`${this.apiUrl}?coachId=${user.id}`).subscribe({
      next: (data) => this.etatEvenements.set(data),
      error: (err) => console.error('Erreur chargement événements:', err)
    });
  }

  ajouterEvenement(evenement: Omit<EvenementCalendrier, 'id'>) {
    const user = this.authService.utilisateurConnecte();
    if (!user) return;

    // 👇 On lie l'événement au coach
    this.http.post<EvenementCalendrier>(`${this.apiUrl}?coachId=${user.id}`, evenement).subscribe({
      next: (nouvelEvent) => {
        this.etatEvenements.update(liste => [...liste, nouvelEvent]);
      },
      error: (err) => console.error('Erreur ajout événement:', err)
    });
  }

  mettreAJourEvenement(evenement: EvenementCalendrier) {
    this.http.put<EvenementCalendrier>(`${this.apiUrl}/${evenement.id}`, evenement).subscribe({
      next: (eventMaj) => {
        this.etatEvenements.update(liste =>
            liste.map(e => e.id === eventMaj.id ? eventMaj : e)
        );
      },
      error: (err) => console.error('Erreur maj événement:', err)
    });
  }

  supprimerEvenement(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.etatEvenements.update(liste => liste.filter(e => e.id !== id));
      },
      error: (err) => console.error('Erreur suppression événement:', err)
    });
  }
}