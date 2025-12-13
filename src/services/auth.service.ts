import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

// Le type d'utilisateur connecté
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
  private apiUrl = `${environment.apiUrl}/auth/login`;

  // Signal pour savoir si on est connecté (accessible partout)
  utilisateurConnecte = signal<UtilisateurConnecte | null>(this.recupererDepuisStorage());

  login(email: string, mdp: string) {
    return this.http.post<UtilisateurConnecte>(this.apiUrl, { email, password: mdp });
  }

  // Stocker la session quand la connexion réussit
  gererConnexionReussie(user: UtilisateurConnecte) {
    this.utilisateurConnecte.set(user);
    localStorage.setItem('user_session', JSON.stringify(user));
    this.router.navigate(['/calendrier']); // Redirection vers l'accueil
  }

  logout() {
    this.utilisateurConnecte.set(null);
    localStorage.removeItem('user_session');
    this.router.navigate(['/login']);
  }

  private recupererDepuisStorage(): UtilisateurConnecte | null {
    const stored = localStorage.getItem('user_session');
    return stored ? JSON.parse(stored) : null;
  }
}