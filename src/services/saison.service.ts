import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaisonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/saisons`;

  getSaison(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  archiverSaisonActuelle(nomNouvelleSaison: string): Observable<{message: string}> {
    // Correction : ajout des accolades {} autour de la variable
    return this.http.put<{message: string}>(
      `${this.apiUrl}/archiver?nomNouvelleSaison=${encodeURIComponent(nomNouvelleSaison)}`, {}
    );
  }
}