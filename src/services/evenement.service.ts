import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EvenementCalendrier } from '../models/evenement.model';
import { environment } from '../environments/environment';
import { AuthService } from "./auth.service";
import { tap, switchMap, catchError, debounceTime } from 'rxjs/operators';
import { ContexteService } from './contexte.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private contexteService = inject(ContexteService);
  private apiUrl = `${environment.apiUrl}/evenements`;

  private etatEvenements = signal<EvenementCalendrier[]>([]);
  evenements = this.etatEvenements.asReadonly();
  brouillonEvenement = signal<Partial<EvenementCalendrier> | null>(null);

  private triggerReload = signal(0);

  constructor() {
    const user$ = toObservable(this.authService.utilisateurConnecte);
    const saison$ = toObservable(this.contexteService.saisonActive);
    const noeud$ = toObservable(this.contexteService.noeudActif);
    const reload$ = toObservable(this.triggerReload);

    combineLatest([user$, saison$, noeud$, reload$]).pipe(
      // FIX ANTI-SPAM : On attend 100ms que les filtres se stabilisent
      debounceTime(100),
      switchMap(([user, saison, noeud, _]) => {
        if (!user) {
          return of([]); 
        }
        
        let params = new HttpParams();
        if (saison) params = params.set('saisonId', saison.id.toString());
        if (noeud) params = params.set('noeudId', noeud.id.toString());
        
        return this.http.get<EvenementCalendrier[]>(this.apiUrl, { params }).pipe(
          catchError(err => {
            console.error('Erreur chargement événements', err);
            return of([]); 
          })
        );
      })
    ).subscribe(data => {
      const dataTrie = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.etatEvenements.set(dataTrie);
    });
  }

  chargerEvenements() {
    this.triggerReload.update(v => v + 1);
  }

  ajouterEvenement(evenement: Omit<EvenementCalendrier, 'id'>) {
    if (!this.authService.utilisateurConnecte()) throw new Error("Non connecté");
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

  supprimerEvenement(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.etatEvenements.update(liste => liste.filter(e => e.id !== id));
      })
    );
  }
}