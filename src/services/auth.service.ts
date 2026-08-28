import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { tap, throttleTime } from 'rxjs/operators';
import { fromEvent, merge, Observable } from 'rxjs';

export interface UtilisateurConnecte {
  id: number;
  email: string;
  role: string;
  nom: string;
  prenom: string;
  clubId?: string;
  niveauAcces?: string;
  isProprietaire?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  utilisateurConnecte = signal<UtilisateurConnecte | null>(this.recupererDepuisStorage());
  private readonly INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000;
  private timer: any;

  constructor() {
    if (this.utilisateurConnecte()) {
      this.initInactivityTimer();
    }

    effect(() => {
      if (this.utilisateurConnecte()){
       this.initInactivityTimer();
        }else{
        this.stopInactivityTimer();
      }
    });
  }

  private initInactivityTimer() {
    this.stopInactivityTimer()
    const activity$ = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'mousedown'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'scroll'),
      fromEvent(window, 'touchstart')
    ).pipe(throttleTime(5000));

    activity$.subscribe(() => this.resetTimer());
    this.resetTimer();
  }

  private resetTimer() {
    if(this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      console.warn('Déconnexion automatique pour inactivité.');
      this.logout();
    },this.INACTIVITY_TIMEOUT);
  }

  private stopInactivityTimer() {
    if (this.timer) clearTimeout(this.timer)
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.sauvegarderSession(response);
        }
      })
    );
  }

  // NOUVEAU : Paramètre nomEquipe ajouté
  inscription(nom: string, prenom: string, email: string, mdp: string, typeCompte: string, nomClub: string, token?: string | null, nomEquipe?: string): Observable<any> {
    const payload: any = {
      nom,
      prenom,
      email,
      password: mdp,
      typeCompte,
      nomClub,
      nomEquipe // Injection dans le backend
    };
    
    if(token){
      payload.token = token;
    }       
    
    return this.http.post<any>(`${this.apiUrl}/register`, payload).pipe(
      tap(response => {
        if (response.token) {
          this.sauvegarderSession(response);
        }
      })
    )
  }

  logout() {
    this.stopInactivityTimer();
    this.utilisateurConnecte.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_session');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  demanderReinitialisation(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, {email});
  }

  reinitialisationMotDePasse(token:string, password:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {token, password});
  }

  private sauvegarderSession(response: any) {
    if (response.token) {
        localStorage.setItem('token', response.token);
        
        const payloadBase64 = response.token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const decodedToken = JSON.parse(decodedJson);

        const user: UtilisateurConnecte = {
          id: response.id,
          email: response.email,
          role: response.role,
          nom: response.nom,
          prenom: response.prenom,
          clubId: decodedToken.clubId,
          niveauAcces: response.niveauAcces,
          isProprietaire: response.proprietaire !== undefined ? response.proprietaire : response.isProprietaire
        };

        localStorage.setItem('user_session', JSON.stringify(user));
        this.utilisateurConnecte.set(user);
    }
  }

  private recupererDepuisStorage(): UtilisateurConnecte | null {
    const stored = localStorage.getItem('user_session');
    return stored ? JSON.parse(stored) : null;
  }
}