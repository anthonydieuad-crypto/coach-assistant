import { inject, Injectable, signal, effect } from '@angular/core';
import { Joueur } from '../models/joueur.model';
import { environment } from "./../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { blob } from 'stream/consumers';

@Injectable({
    providedIn: 'root',
})
export class JoueurService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
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
        if (!this.authService.utilisateurConnecte()) return;
       
        this.http.get<Joueur[]>(this.apiUrl).subscribe({
            next: (data) => this.etatJoueurs.set(data),
            error: (err) => console.error('Erreur chargement joueur', err)
        });
    }

   ajouterJoueur(donneesJoueur: Omit<Joueur, 'id' | 'historiqueJongles' | 'presences' | 'photoUrl'>) {
           if (!this.authService.utilisateurConnecte()) throw new Error("Non connecté"); 

           return this.http.post<Joueur>(this.apiUrl, donneesJoueur).pipe(
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

    importerJoueursCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import-csv`, formData);
  }

  telechargerFeuilleDeMatchPdf(joueurIds: number[]) {
    this.http.post(`${this.apiUrl}/feuille-match/pdf`, joueurIds, {responseType: 'blob'}).subscribe({
        next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'feuille_de_match.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        },
        error: (err) => console.error('Erreur de téléchargement PDF', err)
    });
}
  
}