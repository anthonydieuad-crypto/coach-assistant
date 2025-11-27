
import { Injectable, signal } from '@angular/core';
import { Player, PlayerGroup } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersState = signal<Player[]>([
    { id: 1, firstName: 'Kelian', lastName: 'Akelewa', photoUrl: 'https://picsum.photos/seed/Kelian/200', parentName: 'Parent de Kelian', parentPhone: '0600000001', parentEmail: 'parent.kelian@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 1' },
    { id: 2, firstName: 'Amine', lastName: 'Amour', photoUrl: 'https://picsum.photos/seed/Amine/200', parentName: 'Parent de Amine', parentPhone: '0600000002', parentEmail: 'parent.amine@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 1' },
    { id: 3, firstName: 'Jessim', lastName: 'Belaid', photoUrl: 'https://picsum.photos/seed/Jessim/200', parentName: 'Parent de Jessim', parentPhone: '0600000003', parentEmail: 'parent.jessim@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 2' },
    { id: 4, firstName: 'Camyl', lastName: 'Boualleg', photoUrl: 'https://picsum.photos/seed/Camyl/200', parentName: 'Parent de Camyl', parentPhone: '0600000004', parentEmail: 'parent.camyl@email.com', juggleHistory: [], attendance: ['2025-08-28', '2025-08-30', '2025-09-04', '2025-09-06', '2025-09-11', '2025-09-13', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-27', '2025-10-02', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-16', '2025-10-18', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 2' },
    { id: 5, firstName: 'Quentin', lastName: 'Charles Charley', photoUrl: 'https://picsum.photos/seed/Quentin/200', parentName: 'Parent de Quentin', parentPhone: '0600000005', parentEmail: 'parent.quentin@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 3' },
    { id: 6, firstName: 'Abdallah', lastName: 'Chouou', photoUrl: 'https://picsum.photos/seed/Abdallah/200', parentName: 'Parent de Abdallah', parentPhone: '0600000006', parentEmail: 'parent.abdallah@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 3' },
    { id: 7, firstName: 'Idriss', lastName: 'Cise', photoUrl: 'https://picsum.photos/seed/Idriss/200', parentName: 'Parent de Idriss', parentPhone: '0600000007', parentEmail: 'parent.idriss@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 1' },
    { id: 8, firstName: 'Andrea', lastName: 'De Miranda Moncayo', photoUrl: 'https://picsum.photos/seed/Andrea/200', parentName: 'Parent de Andrea', parentPhone: '0600000008', parentEmail: 'parent.andrea@email.com', juggleHistory: [], attendance: ['2025-09-04', '2025-09-06', '2025-09-11', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-30', '2025-10-05', '2025-10-09', '2025-10-11', '2025-10-16', '2025-11-15', '2025-11-17'], group: 'Equipe 1' },
    { id: 9, firstName: 'Valentin', lastName: 'Delorme', photoUrl: 'https://picsum.photos/seed/Valentin/200', parentName: 'Parent de Valentin', parentPhone: '0600000009', parentEmail: 'parent.valentin@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 2' },
    { id: 10, firstName: 'Ulysse', lastName: 'Desmarquet Taillebot', photoUrl: 'https://picsum.photos/seed/Ulysse/200', parentName: 'Parent de Ulysse', parentPhone: '0600000010', parentEmail: 'parent.ulysse@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 2' },
    { id: 11, firstName: 'Nathan', lastName: 'Dieu', photoUrl: 'https://picsum.photos/seed/Nathan/200', parentName: 'Parent de Nathan', parentPhone: '0600000011', parentEmail: 'parent.nathan@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 3' },
    { id: 12, firstName: 'Nicolas', lastName: 'Diogo', photoUrl: 'https://picsum.photos/seed/Nicolas/200', parentName: 'Parent de Nicolas', parentPhone: '0600000012', parentEmail: 'parent.nicolas@email.com', juggleHistory: [], attendance: ['2025-08-28', '2025-09-02', '2025-09-04', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 3' },
    { id: 13, firstName: 'Zayn', lastName: 'Hafdi Kurt', photoUrl: 'https://picsum.photos/seed/Zayn/200', parentName: 'Parent de Zayn', parentPhone: '0600000013', parentEmail: 'parent.zayn@email.com', juggleHistory: [], attendance: ['2025-08-28', '2025-08-30', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-13', '2025-09-16', '2025-09-20', '2025-09-23', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-07', '2025-10-09', '2025-10-13', '2025-10-16', '2025-11-11', '2025-11-15', '2025-11-17'], group: null },
    { id: 14, firstName: 'Wassim', lastName: 'Iboucen', photoUrl: 'https://picsum.photos/seed/Wassim/200', parentName: 'Parent de Wassim', parentPhone: '0600000014', parentEmail: 'parent.wassim@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: null },
    { id: 15, firstName: 'Namandjan', lastName: 'Koundouno', photoUrl: 'https://picsum.photos/seed/Namandjan/200', parentName: 'Parent de Namandjan', parentPhone: '0600000015', parentEmail: 'parent.namandjan@email.com', juggleHistory: [], attendance: ['2025-08-30', '2025-09-02', '2025-09-06', '2025-09-09', '2025-09-13', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-27', '2025-10-02', '2025-10-05', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-18', '2025-11-13', '2025-11-17'], group: null },
    { id: 16, firstName: 'Valentin', lastName: 'M Baye Pambou', photoUrl: 'https://picsum.photos/seed/ValentinM/200', parentName: 'Parent de Valentin', parentPhone: '0600000016', parentEmail: 'parent.valentinm@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 1' },
    { id: 17, firstName: 'Adil', lastName: 'Mahnouti', photoUrl: 'https://picsum.photos/seed/Adil/200', parentName: 'Parent de Adil', parentPhone: '0600000017', parentEmail: 'parent.adil@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 1' },
    { id: 18, firstName: 'Kais', lastName: 'Martineau', photoUrl: 'https://picsum.photos/seed/Kais/200', parentName: 'Parent de Kais', parentPhone: '0600000018', parentEmail: 'parent.kais@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 2' },
    { id: 19, firstName: 'Kassim', lastName: 'Saadaoui', photoUrl: 'https://picsum.photos/seed/Kassim/200', parentName: 'Parent de Kassim', parentPhone: '0600000019', parentEmail: 'parent.kassim@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 2' },
    { id: 20, firstName: 'Amir', lastName: 'Sai', photoUrl: 'https://picsum.photos/seed/Amir/200', parentName: 'Parent de Amir', parentPhone: '0600000020', parentEmail: 'parent.amir@email.com', juggleHistory: [], attendance: ['2025-08-28', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: 'Equipe 3' },
    { id: 21, firstName: 'Rayane', lastName: 'Saidhar', photoUrl: 'https://picsum.photos/seed/Rayane/200', parentName: 'Parent de Rayane', parentPhone: '0600000021', parentEmail: 'parent.rayane@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-06', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-11', '2025-10-13', '2025-10-18', '2025-11-11', '2025-11-15', '2025-11-17'], group: 'Equipe 3' },
    { id: 22, firstName: 'Zakaria', lastName: 'Boutaleb', photoUrl: 'https://picsum.photos/seed/Zakaria/200', parentName: 'Parent de Zakaria', parentPhone: '0600000022', parentEmail: 'parent.zakaria@email.com', juggleHistory: [], attendance: ['2025-08-28', '2025-08-30', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-23', '2025-09-25', '2025-09-27', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: null },
    { id: 23, firstName: 'Dany', lastName: 'Djafer', photoUrl: 'https://picsum.photos/seed/Dany/200', parentName: 'Parent de Dany', parentPhone: '0600000023', parentEmail: 'parent.dany@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-28', '2025-09-02', '2025-09-04', '2025-09-09', '2025-09-11', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: null },
    { id: 24, firstName: 'Charles', lastName: 'Dumont', photoUrl: 'https://picsum.photos/seed/Charles/200', parentName: 'Parent de Charles', parentPhone: '0600000024', parentEmail: 'parent.charles@email.com', juggleHistory: [], attendance: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], group: null },
    { id: 25, firstName: 'Nickel', lastName: 'Amboka', photoUrl: 'https://picsum.photos/seed/Nickel/200', parentName: 'Parent de Nickel', parentPhone: '0600000025', parentEmail: 'parent.nickel@email.com', juggleHistory: [], attendance: ['2025-08-28', '2025-08-30', '2025-09-04', '2025-09-06', '2025-09-11', '2025-09-13', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-27', '2025-10-02', '2025-10-05', '2025-10-09', '2025-10-11', '2025-10-16', '2025-10-18', '2025-11-13', '2025-11-15'], group: null }
  ]);

  players = this.playersState.asReadonly();

  getPlayerById(id: number): Player | undefined {
    return this.players().find((p) => p.id === id);
  }

  // FIX: Exclude 'photoUrl' from the input type as it's generated internally.
  addPlayer(playerData: Omit<Player, 'id' | 'juggleHistory' | 'attendance' | 'photoUrl'>) {
    this.playersState.update(players => {
      const newPlayer: Player = {
        ...playerData,
        id: Date.now(),
        juggleHistory: [],
        attendance: [],
        photoUrl: `https://picsum.photos/seed/${playerData.firstName}/200`
      };
      return [...players, newPlayer];
    });
  }

  updatePlayer(updatedPlayer: Player) {
    this.playersState.update(players => 
      players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
    );
  }

  deletePlayer(playerId: number) {
    this.playersState.update(players => 
      players.filter(p => p.id !== playerId)
    );
  }

  addJuggleRecord(playerId: number, date: string, score: number) {
    this.playersState.update((players) =>
      players.map((p) => {
        if (p.id === playerId) {
          const newHistory = [...p.juggleHistory];
          const recordIndex = newHistory.findIndex((r) => r.date === date);
          if (recordIndex > -1) {
            newHistory[recordIndex] = { date, score };
          } else {
            newHistory.push({ date, score });
          }
          // Sort history by date
          newHistory.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          return { ...p, juggleHistory: newHistory };
        }
        return p;
      })
    );
  }

  recordAttendance(playerIds: number[], date: string) {
    this.playersState.update((players) =>
      players.map((p) => {
        if (playerIds.includes(p.id) && !p.attendance.includes(date)) {
          return { ...p, attendance: [...p.attendance, date] };
        }
        if (!playerIds.includes(p.id) && p.attendance.includes(date)) {
          return { ...p, attendance: p.attendance.filter((d) => d !== date) };
        }
        return p;
      })
    );
  }
}
