import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient)
  private readonly API_URL = `${environment.apiUrl}/dashboard`;

  getStats(saisonId?: number, noeudId?:number): Observable<any> {
    let params = new HttpParams();
    if(saisonId) params = params.set('saisonId', saisonId.toString());
    if(noeudId) params = params.set('noeudId', noeudId.toString());

    return this.http.get(`${this.API_URL}/stats`, {params});
  }
}