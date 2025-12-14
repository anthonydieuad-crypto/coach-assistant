import { inject, Injectable, signal, effect } from '@angular/core';
import { Joueur } from '../models/joueur.model';
import { environment } from "./../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";

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
        // 👇 Astuce : Dès que l'utilisateur change (connexion/déconnexion), on recharge la bonne liste
        effect(() => {
            if (this.authService.utilisateurConnecte()) {
                this.chargerJoueurs();
            } else {
                this.etatJoueurs.set([]); // Si déconnecté, on vide la liste
            }
        });
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
        if (!user) return;

        // 👇 On précise à quel coach appartient ce nouveau joueur
        this.http.post<Joueur>(`${this.apiUrl}?coachId=${user.id}`, donneesJoueur).subscribe({
            next: (nouveauJoueur) => {
                this.etatJoueurs.update(liste => [...liste, nouveauJoueur]);
            },
            error: (err) => console.error('Erreur ajout joueur:', err)
        });
    }

    // --- Le reste ne change pas (Update/Delete utilisent l'ID du joueur, c'est suffisant) ---

    getJoueurParId(id: number): Joueur | undefined {
        return this.joueurs().find((p) => p.id === id);
    }

    mettreAJourJoueur(joueur: Joueur) {
        this.http.put<Joueur>(`${this.apiUrl}/${joueur.id}`, joueur).subscribe({
            next: (joueurMaj) => {
                this.etatJoueurs.update(liste =>
                    liste.map(p => p.id === joueurMaj.id ? joueurMaj : p)
                );
            },
            error: (err) => console.error('Erreur mise à jour joueur:', err)
        });
    }

    supprimerJoueur(id: number) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
            next: () => {
                this.etatJoueurs.update(liste => liste.filter(p => p.id !== id));
            },
            error: (err) => console.error('Erreur suppression joueur:', err)
        });
    }

    ajouterScoreJongle(joueurId: number, date: string, score: number) {
        const body = {date, score};
        this.http.post<Joueur>(`${this.apiUrl}/${joueurId}/jongles`, body).subscribe({
            next: (joueurMaj) => {
                this.etatJoueurs.update(liste =>
                    liste.map(p => p.id === joueurId ? joueurMaj : p)
                );
            },
            error: (err) => console.error('Erreur score jongle:', err)
        });
    }

    enregistrerPresences(joueurIds: number[], date: string) {
        joueurIds.forEach(id => {
            this.http.post<Joueur>(`${this.apiUrl}/${id}/presence?date=${date}`, {}).subscribe(
                () => this.chargerJoueurs()
            );
        });
    }
}