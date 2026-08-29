import { inject, Injectable, signal } from '@angular/core';
import { Joueur } from '../models/joueur.model';
import { environment } from "./../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { tap, switchMap, catchError, debounceTime } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { ContexteService } from './contexte.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class JoueurService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private contexteService = inject(ContexteService);
    private apiUrl = `${environment.apiUrl}/joueurs`;

    private etatJoueurs = signal<Joueur[]>([]);
    joueurs = this.etatJoueurs.asReadonly();
    groupesVirtuels = signal<string[]>([]);
    
    private triggerReload = signal(0);

    constructor() {
        const user$ = toObservable(this.authService.utilisateurConnecte);
        const saison$ = toObservable(this.contexteService.saisonActive);
        const noeud$ = toObservable(this.contexteService.noeudActif);
        const reload$ = toObservable(this.triggerReload);

        combineLatest([user$, saison$, noeud$, reload$]).pipe(
            // FIX ANTI-SPAM : Évite de saturer la base de données au rafraîchissement
            debounceTime(100),
            switchMap(([user, saison, noeud, _]) => {
                if (!user) {
                    this.groupesVirtuels.set([]);
                    return of([]);
                }
                
                let params = new HttpParams();
                if (saison) params = params.set('saisonId', saison.id.toString());
                if (noeud) params = params.set('noeudId', noeud.id.toString());

                return this.http.get<Joueur[]>(this.apiUrl, {params}).pipe(
                    catchError(err => {
                        console.error('Erreur chargement joueurs', err);
                        return of([]);
                    })
                );
            })
        ).subscribe(data => {
            this.etatJoueurs.set(data);
        });
    }

    getJoueurByIdHttp(id: number) {
        return this.http.get<Joueur>(`${this.apiUrl}/${id}`);
    }

    chargerJoueurs() {
        this.triggerReload.update(v => v + 1);
    }

    ajouterJoueur(donneesJoueur: Omit<Joueur, 'id' | 'historiqueJongles' | 'presences' | 'photoUrl'>) {
       if (!this.authService.utilisateurConnecte()) throw new Error("Non connecté");

       let params = new HttpParams();
       const saison = this.contexteService.saisonActive();
       const noeud = this.contexteService.noeudActif();
       
       if (saison) params = params.set('saisonId', saison.id.toString());
       if (noeud) params = params.set('noeudId', noeud.id.toString());

       return this.http.post<Joueur>(this.apiUrl, donneesJoueur, {params}).pipe(
           tap((nouveauJoueur) => {
               this.etatJoueurs.update(liste => [...liste, nouveauJoueur]);
           })
       );
    }

    getJoueurParId(id: number): Joueur | undefined {
        return this.joueurs().find((p) => p.id === id);
    }

    mettreAJourJoueur(joueur: Joueur) {
        let params = new HttpParams();
        const saison = this.contexteService.saisonActive();
        const noeud = this.contexteService.noeudActif();
        
        if(saison) params = params.set('saisonId', saison.id.toString());
        if(noeud) params = params.set('noeudId', noeud.id.toString());

        return this.http.put<Joueur>(`${this.apiUrl}/${joueur.id}`, joueur, {params}).pipe(
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

    ajouterGroupeVirtuel(nom: string) {
        if (!this.groupesVirtuels().includes(nom)) {
            this.groupesVirtuels.update(v => [...v, nom]);
        }
    }

    renommerGroupe(ancienNom: string, nouveauNom: string) {
        let params = new HttpParams().set('ancienNom', ancienNom).set('nouveauNom', nouveauNom);
        return this.http.put(`${this.apiUrl}/groupes/renommer`, {}, {params}).pipe(
            tap(() => {
                this.groupesVirtuels.update(v => v.map(g => g === ancienNom ? nouveauNom : g));
                this.chargerJoueurs(); 
            })
        );
    }

    supprimerGroupe(nom: string) {
        let params = new HttpParams().set('nom', nom);
        return this.http.delete(`${this.apiUrl}/groupes/supprimer`, {params}).pipe(
            tap(() => {
                this.groupesVirtuels.update(v => v.filter(g => g !== nom));
                this.chargerJoueurs();
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

    importerJoueursCSV(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        
        let params = new HttpParams();
        const saison = this.contexteService.saisonActive();
        const noeud = this.contexteService.noeudActif();
        
        if(saison) params = params.set('saisonId', saison.id.toString());
        if(noeud) params = params.set('noeudId', noeud.id.toString());

        return this.http.post(`${this.apiUrl}/import-csv`, formData, {params});
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