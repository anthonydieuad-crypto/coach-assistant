import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoeudService {
  private  http = inject(HttpClient);
  // CORRECTION : On pointe sur le contrôleur unifié
  private apiUrl = `${environment.apiUrl}/noeuds`; 

  getArborescence(): Observable<any[]> {
    // CORRECTION : Appel de la sous-route spécifique à l'arbre
    return this.http.get<any[]>(`${this.apiUrl}/arbre`); 
  }

  creerNoeud(nom: string, parentId: number | null): Observable<any> {
    return this.http.post(this.apiUrl, {nom, parentId});
  }

  deplacerNoeud(id:number, parentId: number | null):Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deplacer`, {parentId});
  }

  reorganiser(noeudsFlat: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/reorganiser`, noeudsFlat);
  }

  renommerNoeud(id:number, nom:string) {
    return this.http.put(`${this.apiUrl}/${id}/renommer`, {nom});
  }

  supprimerNoeud(id:number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}