import { Injectable, signal } from '@angular/core';
import { Joueur } from '../models/joueur.model';

@Injectable({
  providedIn: 'root',
})
export class JoueurService {
  private etatJoueurs = signal<Joueur[]>([
    { id: 1, prenom: 'Kelian', nom: 'Akelewa', photoUrl: 'https://picsum.photos/seed/Kelian/200', nomParent: 'Parent de Kelian', telParent: '0600000001', emailParent: 'parent.kelian@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 1' },
    { id: 2, prenom: 'Amine', nom: 'Amour', photoUrl: 'https://picsum.photos/seed/Amine/200', nomParent: 'Parent de Amine', telParent: '0600000002', emailParent: 'parent.amine@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 1' },
    { id: 3, prenom: 'Jessim', nom: 'Belaid', photoUrl: 'https://picsum.photos/seed/Jessim/200', nomParent: 'Parent de Jessim', telParent: '0600000003', emailParent: 'parent.jessim@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 2' },
    { id: 4, prenom: 'Camyl', nom: 'Boualleg', photoUrl: 'https://picsum.photos/seed/Camyl/200', nomParent: 'Parent de Camyl', telParent: '0600000004', emailParent: 'parent.camyl@email.com', historiqueJongles: [], presences: ['2025-08-28', '2025-08-30', '2025-09-04', '2025-09-06', '2025-09-11', '2025-09-13', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-27', '2025-10-02', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-16', '2025-10-18', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 2' },
    { id: 5, prenom: 'Quentin', nom: 'Charles Charley', photoUrl: 'https://picsum.photos/seed/Quentin/200', nomParent: 'Parent de Quentin', telParent: '0600000005', emailParent: 'parent.quentin@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 3' },
    { id: 6, prenom: 'Abdallah', nom: 'Chouou', photoUrl: 'https://picsum.photos/seed/Abdallah/200', nomParent: 'Parent de Abdallah', telParent: '0600000006', emailParent: 'parent.abdallah@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 3' },
    { id: 7, prenom: 'Idriss', nom: 'Cise', photoUrl: 'https://picsum.photos/seed/Idriss/200', nomParent: 'Parent de Idriss', telParent: '0600000007', emailParent: 'parent.idriss@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 1' },
    { id: 8, prenom: 'Andrea', nom: 'De Miranda Moncayo', photoUrl: 'https://picsum.photos/seed/Andrea/200', nomParent: 'Parent de Andrea', telParent: '0600000008', emailParent: 'parent.andrea@email.com', historiqueJongles: [], presences: ['2025-09-04', '2025-09-06', '2025-09-11', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-30', '2025-10-05', '2025-10-09', '2025-10-11', '2025-10-16', '2025-11-15', '2025-11-17'], groupe: 'Equipe 1' },
    { id: 9, prenom: 'Valentin', nom: 'Delorme', photoUrl: 'https://picsum.photos/seed/Valentin/200', nomParent: 'Parent de Valentin', telParent: '0600000009', emailParent: 'parent.valentin@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 2' },
    { id: 10, prenom: 'Ulysse', nom: 'Desmarquet Taillebot', photoUrl: 'https://picsum.photos/seed/Ulysse/200', nomParent: 'Parent de Ulysse', telParent: '0600000010', emailParent: 'parent.ulysse@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 2' },
    { id: 11, prenom: 'Nathan', nom: 'Dieu', photoUrl: 'https://picsum.photos/seed/Nathan/200', nomParent: 'Parent de Nathan', telParent: '0600000011', emailParent: 'parent.nathan@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 3' },
    { id: 12, prenom: 'Nicolas', nom: 'Diogo', photoUrl: 'https://picsum.photos/seed/Nicolas/200', nomParent: 'Parent de Nicolas', telParent: '0600000012', emailParent: 'parent.nicolas@email.com', historiqueJongles: [], presences: ['2025-08-28', '2025-09-02', '2025-09-04', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 3' },
    { id: 13, prenom: 'Zayn', nom: 'Hafdi Kurt', photoUrl: 'https://picsum.photos/seed/Zayn/200', nomParent: 'Parent de Zayn', telParent: '0600000013', emailParent: 'parent.zayn@email.com', historiqueJongles: [], presences: ['2025-08-28', '2025-08-30', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-13', '2025-09-16', '2025-09-20', '2025-09-23', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-07', '2025-10-09', '2025-10-13', '2025-10-16', '2025-11-11', '2025-11-15', '2025-11-17'], groupe: null },
    { id: 14, prenom: 'Wassim', nom: 'Iboucen', photoUrl: 'https://picsum.photos/seed/Wassim/200', nomParent: 'Parent de Wassim', telParent: '0600000014', emailParent: 'parent.wassim@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: null },
    { id: 15, prenom: 'Namandjan', nom: 'Koundouno', photoUrl: 'https://picsum.photos/seed/Namandjan/200', nomParent: 'Parent de Namandjan', telParent: '0600000015', emailParent: 'parent.namandjan@email.com', historiqueJongles: [], presences: ['2025-08-30', '2025-09-02', '2025-09-06', '2025-09-09', '2025-09-13', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-27', '2025-10-02', '2025-10-05', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-18', '2025-11-13', '2025-11-17'], groupe: null },
    { id: 16, prenom: 'Valentin', nom: 'M Baye Pambou', photoUrl: 'https://picsum.photos/seed/ValentinM/200', nomParent: 'Parent de Valentin', telParent: '0600000016', emailParent: 'parent.valentinm@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 1' },
    { id: 17, prenom: 'Adil', nom: 'Mahnouti', photoUrl: 'https://picsum.photos/seed/Adil/200', nomParent: 'Parent de Adil', telParent: '0600000017', emailParent: 'parent.adil@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 1' },
    { id: 18, prenom: 'Kais', nom: 'Martineau', photoUrl: 'https://picsum.photos/seed/Kais/200', nomParent: 'Parent de Kais', telParent: '0600000018', emailParent: 'parent.kais@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 2' },
    { id: 19, prenom: 'Kassim', nom: 'Saadaoui', photoUrl: 'https://picsum.photos/seed/Kassim/200', nomParent: 'Parent de Kassim', telParent: '0600000019', emailParent: 'parent.kassim@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 2' },
    { id: 20, prenom: 'Amir', nom: 'Sai', photoUrl: 'https://picsum.photos/seed/Amir/200', nomParent: 'Parent de Amir', telParent: '0600000020', emailParent: 'parent.amir@email.com', historiqueJongles: [], presences: ['2025-08-28', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: 'Equipe 3' },
    { id: 21, prenom: 'Rayane', nom: 'Saidhar', photoUrl: 'https://picsum.photos/seed/Rayane/200', nomParent: 'Parent de Rayane', telParent: '0600000021', emailParent: 'parent.rayane@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-06', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-11', '2025-10-13', '2025-10-18', '2025-11-11', '2025-11-15', '2025-11-17'], groupe: 'Equipe 3' },
    { id: 22, prenom: 'Zakaria', nom: 'Boutaleb', photoUrl: 'https://picsum.photos/seed/Zakaria/200', nomParent: 'Parent de Zakaria', telParent: '0600000022', emailParent: 'parent.zakaria@email.com', historiqueJongles: [], presences: ['2025-08-28', '2025-08-30', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-23', '2025-09-25', '2025-09-27', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: null },
    { id: 23, prenom: 'Dany', nom: 'Djafer', photoUrl: 'https://picsum.photos/seed/Dany/200', nomParent: 'Parent de Dany', telParent: '0600000023', emailParent: 'parent.dany@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-28', '2025-09-02', '2025-09-04', '2025-09-09', '2025-09-11', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: null },
    { id: 24, prenom: 'Charles', nom: 'Dumont', photoUrl: 'https://picsum.photos/seed/Charles/200', nomParent: 'Parent de Charles', telParent: '0600000024', emailParent: 'parent.charles@email.com', historiqueJongles: [], presences: ['2025-08-26', '2025-08-30', '2025-09-02', '2025-09-04', '2025-09-06', '2025-09-09', '2025-09-11', '2025-09-13', '2025-09-16', '2025-09-18', '2025-09-20', '2025-09-23', '2025-09-25', '2025-09-27', '2025-09-30', '2025-10-02', '2025-10-05', '2025-10-07', '2025-10-09', '2025-10-11', '2025-10-13', '2025-10-16', '2025-10-18', '2025-11-11', '2025-11-13', '2025-11-15', '2025-11-17'], groupe: null },
    { id: 25, prenom: 'Nickel', nom: 'Amboka', photoUrl: 'https://picsum.photos/seed/Nickel/200', nomParent: 'Parent de Nickel', telParent: '0600000025', emailParent: 'parent.nickel@email.com', historiqueJongles: [], presences: ['2025-08-28', '2025-08-30', '2025-09-04', '2025-09-06', '2025-09-11', '2025-09-13', '2025-09-18', '2025-09-20', '2025-09-25', '2025-09-27', '2025-10-02', '2025-10-05', '2025-10-09', '2025-10-11', '2025-10-16', '2025-10-18', '2025-11-13', '2025-11-15'], groupe: null }
  ]);

  joueurs = this.etatJoueurs.asReadonly();

  getJoueurParId(id: number): Joueur | undefined {
    return this.joueurs().find((p) => p.id === id);
  }

  ajouterJoueur(donneesJoueur: Omit<Joueur, 'id' | 'historiqueJongles' | 'presences' | 'photoUrl'>) {
    this.etatJoueurs.update(joueurs => {
      const nouveauJoueur: Joueur = {
        ...donneesJoueur,
        id: Date.now(),
        historiqueJongles: [],
        presences: [],
        photoUrl: `https://picsum.photos/seed/${donneesJoueur.prenom}/200`
      };
      return [...joueurs, nouveauJoueur];
    });
  }

  mettreAJourJoueur(joueurMisAJour: Joueur) {
    this.etatJoueurs.update(joueurs => 
      joueurs.map(p => p.id === joueurMisAJour.id ? joueurMisAJour : p)
    );
  }

  supprimerJoueur(joueurId: number) {
    this.etatJoueurs.update(joueurs => 
      joueurs.filter(p => p.id !== joueurId)
    );
  }

  ajouterScoreJongle(joueurId: number, date: string, score: number) {
    this.etatJoueurs.update((joueurs) =>
      joueurs.map((p) => {
        if (p.id === joueurId) {
          const nouvelHistorique = [...p.historiqueJongles];
          const indexRecord = nouvelHistorique.findIndex((r) => r.date === date);
          if (indexRecord > -1) {
            nouvelHistorique[indexRecord] = { date, score };
          } else {
            nouvelHistorique.push({ date, score });
          }
          // Trier l'historique par date
          nouvelHistorique.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          return { ...p, historiqueJongles: nouvelHistorique };
        }
        return p;
      })
    );
  }

  enregistrerPresences(joueurIds: number[], date: string) {
    this.etatJoueurs.update((joueurs) =>
      joueurs.map((p) => {
        if (joueurIds.includes(p.id) && !p.presences.includes(date)) {
          return { ...p, presences: [...p.presences, date] };
        }
        if (!joueurIds.includes(p.id) && p.presences.includes(date)) {
          return { ...p, presences: p.presences.filter((d) => d !== date) };
        }
        return p;
      })
    );
  }
}
