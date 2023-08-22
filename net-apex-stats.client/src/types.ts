export interface Entry {
  id: string;
  season: string;
  games: number;
  wins: number;
  kills: number;
  kdr: number;
  avgDamage: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  token: string;
}