import { inject, Injectable, signal, effect } from '@angular/core';
import { Joueur } from '../models/joueur.model';
import { environment } from "./../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class JoueurService {
    private http = inject(HttpClient);
    private authService = inject(AuthService); // 👇 On récupère l'info du coach
    private apiUrl = `${environment.apiUrl}/joueurs`;

    private etatJoueurs = signal<Joueur[]>([]);
    joueurs = this.etatJoueurs.asReadonly();

    constructor() {
        effect(() => {
            if (this.authService.utilisateurConnecte()) {
                this.chargerJoueurs();
            } else {
                this.etatJoueurs.set([]); // Si déconnecté, on vide la liste
            }
        });
    }
    getJoueurByIdHttp(id: number) {
        return this.http.get<Joueur>(`${this.apiUrl}/${id}`);
    }

    chargerJoueurs() {
        const user = this.authService.utilisateurConnecte();
        if (!user) return;

        // 👇 On ajoute ?coachId=123 à la requête
        this.http.get<Joueur[]>(`${this.apiUrl}?coachId=${user.id}`).subscribe({
            next: (data) => this.etatJoueurs.set(data),
            error: (err) => console.error('Erreur chargement joueurs', err)
        });
    }

   ajouterJoueur(donneesJoueur: Omit<Joueur, 'id' | 'historiqueJongles' | 'presences' | 'photoUrl'>) {
           const user = this.authService.utilisateurConnecte();
           if (!user) throw new Error("Non connecté");

           return this.http.post<Joueur>(`${this.apiUrl}?coachId=${user.id}`, donneesJoueur).pipe(
               tap((nouveauJoueur) => {
                   this.etatJoueurs.update(liste => [...liste, nouveauJoueur]);
               })
           );
       }

    // --- Le reste ne change pas (Update/Delete utilisent l'ID du joueur, c'est suffisant) ---

    getJoueurParId(id: number): Joueur | undefined {
        return this.joueurs().find((p) => p.id === id);
    }

    mettreAJourJoueur(joueur: Joueur) {
            return this.http.put<Joueur>(`${this.apiUrl}/${joueur.id}`, joueur).pipe(
                tap((joueurMaj) => {
                    this.etatJoueurs.update(liste =>
                        liste.map(p => p.id === joueurMaj.id ? joueurMaj : p)
                    );
                })
            );
        }

    supprimerJoueur(id: number) {
            return this.http.delete(`${this.apiUrl}/${id}`).pipe(
                tap(() => {
                    this.etatJoueurs.update(liste => liste.filter(p => p.id !== id));
                })
            );
        }

    ajouterScoreJongle(joueurId: number, date: string, score: number) {
            const body = { date, score };
            return this.http.post<Joueur>(`${this.apiUrl}/${joueurId}/jongles`, body).pipe(
                tap((joueurMaj) => {
                    this.etatJoueurs.update(liste =>
                        liste.map(p => p.id === joueurId ? joueurMaj : p)
                    );
                })
            );
        }

    enregistrerPresences(joueurIds: number[], date: string) {
        joueurIds.forEach(id => {
            this.http.post<Joueur>(`${this.apiUrl}/${id}/presence?date=${date}`, {}).subscribe(
                () => this.chargerJoueurs()
            );
        });
    }
}