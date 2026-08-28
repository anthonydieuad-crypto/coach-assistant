import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface Invitation {
  id: number;
  email: string;
  token:string;
  niveauAcces: string;
  utilise: boolean;
  dateExpiration: string;
  noeud: {id: number; nom:string};
}

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/invitations`;

  envoyerInvitation(email:string, noeudId: number, niveauAcces:string): Observable<any> {
    return this.http.post(this.apiUrl, {email, noeudId, niveauAcces});
  }

  getInvitationsEnAttente(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(this.apiUrl);
  }

  supprimerInvitation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}