import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface UserAdmin {
    id:number;
    nom:string;
    prenom:string;
    email:string;
    role:string
    }

@Injectable({
  providedIn: 'root',
})
export class AdminService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/admin`

    getAllUsers(): Observable<UserAdmin[]> {
        return this.http.get<UserAdmin[]>(`${this.apiUrl}/users`);
         }

     deleteUser(id: number): Observable<void> {
         return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
         }

         updateUserRole(userId: number, role: string): Observable<void> {
            return this.http.put<void>(`${this.apiUrl}/users/${userId}/role`, { role });
}
  
}
