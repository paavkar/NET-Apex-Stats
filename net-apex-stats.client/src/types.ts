export interface Entry {
    id: string;
    season: string;
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    damage: number;
    highestDamage: number;
}

export interface User {
    id: string;
    username: string;
    password: string;
    token: string;
    refreshToken: string;
    tokenCreated: Date;
    tokenExpires: Date;
}