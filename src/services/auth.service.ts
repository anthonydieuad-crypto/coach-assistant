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
  clubId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // URL de l'API Auth
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signal de l'utilisateur connecté
  utilisateurConnecte = signal<UtilisateurConnecte | null>(this.recupererDepuisStorage());

  //Convertion 2 heures en millisecondes
  private readonly INACTIVITY_TIMEOUT = 2 * 60 * 1000;
  private timer: any;

  constructor() {
    if (this.utilisateurConnecte()) {
      this.initInactivityTimer();
    }
    //On réagit automatiquement quand l'état de connection change
    effect(() => {
      if (this.utilisateurConnecte()){ 
      this.initInactivityTimer();  
      }else{
        this.stopInactivityTimer();
      }
    });
  }

  //initialisations des écouteurs d'événements
  private initInactivityTimer() {
    this.stopInactivityTimer()//on nettoie l'ancien timer si il existe

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


  // ✅ LOGIN : On garde le tap pour la sécurité (stockage auto)
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          // On sauvegarde déjà ici pour être sûr
          this.sauvegarderSession(response);
        }
      })
    );
  }

  // ✅ REGISTER
  inscription(nom: string, prenom: string, email: string, mdp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      nom,
      prenom,
      email,
      password: mdp
    }).pipe(
      tap(response => {
        if (response.token) {
          this.sauvegarderSession(response);
        }
      })
      
    );
  }

  // ✅ LOGOUT
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


  //Envoie du mail pour le mot de passe oublié
  demanderReinitialisation(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, {email});
  }

  //Validation du nouveau mot de passe
  reinitialisationMotDePasse(token:string, password:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {token, password});
  }
  // ==========================================
  // ✅ NOUVELLES MÉTHODES POUR LE MODE SAAS
  // ==========================================

  //Création de l'espace de travail (Club)
  creerClub(nomClub: string): Observable<any> {
    //On pointe maintenant vers le controller /clubs
    return this.http.post<any>(`${environment.apiUrl}/clubs/creer`, { nom: nomClub }).pipe(
      tap(response => {
        if (response.newToken) {
          // 1. Remplacement silencieux du Token JWT
          localStorage.setItem('token', response.newToken);

          // 2. Mise à jour de l'utilisateur actuel (Signal + Storage)
          const currentUser = this.utilisateurConnecte();
          if (currentUser) {
            const updatedUser = { 
              ...currentUser, 
              clubId: response.clubId, 
              role: 'CLUB_ADMIN' // Il devient l'ADMIN de son club.
            };
            localStorage.setItem('user_session', JSON.stringify(updatedUser));
            this.utilisateurConnecte.set(updatedUser); // Le front se met à jour instantanément
          }
        }
      })
    );
  }

  // Vérifie si le coach a déjà un club en lisant le payload du token
  hasClub(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.clubId !== null && payload.clubId !== undefined;
    } catch (e) {
      return false;
    }
  }

  // --- PRIVÉ ---

  private sauvegarderSession(response: any) {
    // 1. Token
    if (response.token) {
        localStorage.setItem('token', response.token);
    }



    // 2. Infos User
    const user: UtilisateurConnecte = {
      id: response.id,
      email: response.email,
      role: response.role,
      nom: response.nom,
      prenom: response.prenom
    };

    localStorage.setItem('user_session', JSON.stringify(user));
    this.utilisateurConnecte.set(user);
  }

  private recupererDepuisStorage(): UtilisateurConnecte | null {
    const stored = localStorage.getItem('user_session');
    return stored ? JSON.parse(stored) : null;
  }
}