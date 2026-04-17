import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient)
  private readonly API_URL = `${environment.apiUrl}/dashboard`;

  getStats(): Observable<any> {
    return this.http.get(`${this.API_URL}/stats`)
  }
  
}
