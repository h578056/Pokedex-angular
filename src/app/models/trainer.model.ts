import { Pokemon } from "./pokemon.model";
export interface Trainer{
    username: string;
    id: number;
    pokemon: Pokemon;
}
