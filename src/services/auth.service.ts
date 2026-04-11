import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface UtilisateurConnecte {
  id: number;
  email: string;
  role: string;
  nom: string;
  prenom: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // URL de l'API Auth
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signal de l'utilisateur connecté
  utilisateurConnecte = signal<UtilisateurConnecte | null>(this.recupererDepuisStorage());

  constructor() {}

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
    });
  }

  // ✅ LOGOUT
  logout() {
    this.utilisateurConnecte.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_session');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 👇 LA MÉTHODE MANQUANTE QUE TES COMPOSANTS APPELLENT
  // Elle sert à finaliser la connexion (stockage + redirection)
  // Utile pour le composant Signup ou Login
  gererConnexionReussie(response: any) {
    this.sauvegarderSession(response); // Stocke le token et l'user
    this.router.navigate(['/calendrier']); // Redirige vers l'accueil
  }

  //Envoie du mail pour le mot de passe oublié
  demanderReinitialisation(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, {email});
  }

  //Validation du nouveau mot de passe
  reinitialisationMotDePasse(token:string, password:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {token, password});
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