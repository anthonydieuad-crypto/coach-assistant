import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface UserAdmin {
  id:number;
  nom:string;
  prenom:string;
  email:string;
  role:string;
}

export interface ClubAdmin {
  id: number;
  nom: string;
  archive: boolean;
  proprietairePrenom: string;
  proprietaireNom: string;
}

export interface AdminJoueurDto {
  id: number;
  prenom: string;
  nom: string;
  clubNom: string;
  numeroLicence: string;
  archive: boolean;
  saisons: string[];
}

export interface AdminEvenementDto {
  id: number;
  titre: string;
  date: string;
  type: string;
  lieu: string;
}

export interface AdminSaisonStatsDto {
  saisonId: number;
  saisonNom: string;
  historiqueJongles: any[]; // ScoreJongle (date, score)
  presences: string[];
  evenements: AdminEvenementDto[];
}

export interface AdminJoueurDetailDto {
  id: number;
  prenom: string;
  nom: string;
  photoUrl: string;
  numeroLicence: string;
  nomParent: string;
  telParent: string;
  emailParent: string;
  clubNom: string;
  archive: boolean;
  saisonsStats: AdminSaisonStatsDto[];
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

  getClubs(): Observable<ClubAdmin[]> {
      return this.http.get<ClubAdmin[]>(`${this.apiUrl}/clubs`);
  }

  archiverClub(id: number, etat: boolean): Observable<any> {
      return this.http.put(`${this.apiUrl}/clubs/${id}/archiver?etat=${etat}`, {});
  }

  supprimerClub(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/clubs/${id}`);
  }

  getJoueursArchives(): Observable<AdminJoueurDto[]> {
      return this.http.get<AdminJoueurDto[]>(`${this.apiUrl}/archives/joueurs`);
  }

  getJoueurArchiveDetail(id: number): Observable<AdminJoueurDetailDto> {
      return this.http.get<AdminJoueurDetailDto>(`${this.apiUrl}/archives/joueurs/${id}`);
  }
}