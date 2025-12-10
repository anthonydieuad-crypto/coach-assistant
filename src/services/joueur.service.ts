import {inject, Injectable, signal} from '@angular/core';
import {Joueur} from '../models/joueur.model';
import {HttpClient} from '@angular/common/http';
import {environnement} from "@/src/environnements/environnement";

@Injectable({
    providedIn: 'root',
})
export class JoueurService {
    private http = inject(HttpClient)
    private apiUrl = `${environnement.apiUrl}/joueurs`;

    private etatJoueurs = signal<Joueur[]>([]);

    joueurs = this.etatJoueurs.asReadonly();

    constructor() {
        this.chargerJoueurs();
    }

    // Récupérer tous les joueurs du back

    chargerJoueurs() {
        this.http.get<Joueur[]>(this.apiUrl).subscribe({
            next: (data) => this.etatJoueurs.set(data),
            error: (err) => console.error('Erreur chargement joueurs', err)
        });
    }

    getJoueurParId(id: number): Joueur | undefined {
        return this.joueurs().find((p) => p.id === id);
    }

    ajouterJoueur(donneesJoueur: Omit<Joueur, 'id' | 'historiqueJongles' | 'presences' | 'photoUrl'>) {// Le backend gère l'ID, la photo par défaut, etc.
        this.http.post<Joueur>(this.apiUrl, donneesJoueur).subscribe({            next: (nouveauJoueur) => {
                this.etatJoueurs.update(liste => [...liste, nouveauJoueur]);
            },
            error: (err) => console.error('Erreur ajout joueur:', err)
        });
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
        // On utilise l'endpoint spécifique du backend
        const body = {date, score};
        this.http.post<Joueur>(`${this.apiUrl}/${joueurId}/jongles`, body).subscribe({
            next: (joueurMaj) => {
                // Le backend renvoie le joueur complet avec son nouvel historique
                this.etatJoueurs.update(liste =>
                    liste.map(p => p.id === joueurId ? joueurMaj : p)
                );
            },
            error: (err) => console.error('Erreur score jongle:', err)
        });
    }

    enregistrerPresences(joueurIds: number[], date: string) {
        // Note: Ton backend a un endpoint "basculerPresence" (toggle).
        // Pour simplifier ici, on va recharger tous les joueurs après modification,
        // ou idéalement, il faudrait un endpoint backend "setPresences" pour faire ça en masse.

        // Solution temporaire : On appelle le toggle pour chaque joueur concerné
        // (C'est pas optimal niveau performance réseau mais ça marche avec ton back actuel)

        // Une meilleure approche serait de créer un endpoint "batch" côté Java.
        // Pour l'instant, disons qu'on rafraîchit tout :

        // Exemple simple : On boucle (attention c'est brutal pour le réseau)
        joueurIds.forEach(id => {
            this.http.post<Joueur>(`${this.apiUrl}/${id}/presence?date=${date}`, {}).subscribe(
                () => this.chargerJoueurs() // On recharge tout pour être sûr d'être synchro
            );
        });
    }
}



