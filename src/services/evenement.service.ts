import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EvenementCalendrier } from '../models/evenement.model';
import {environment} from "@/src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class EvenementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/evenements`;
  private etatEvenements = signal<EvenementCalendrier[]>([]);
  evenements = this.etatEvenements.asReadonly();

  constructor() {
    this.chargerEvenements();
  }

  chargerEvenements() {
    this.http.get<EvenementCalendrier[]>(this.apiUrl).subscribe({
      next: (data) => this.etatEvenements.set(data),
      error: (err) => console.error('Erreur chargement événements:', err)
    });
  }

  ajouterEvenement(evenement: Omit<EvenementCalendrier, 'id'>) {
    this.http.post<EvenementCalendrier>(this.apiUrl, evenement).subscribe({
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