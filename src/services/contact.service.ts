import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contact`;

  envoyerMessage(sujet: string, message: string) {
    return this.http.post<{message: string}>(this.apiUrl, { sujet, message });
  }
}