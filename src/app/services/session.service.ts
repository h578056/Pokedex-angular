import { Injectable } from '@angular/core';
import { Trainer } from '../models/trainer.model';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private _trainer: Trainer | undefined;
  private _pokemons: Pokemon[] | undefined;
  /**
   * gets trainer and pokemon from localstorage
   * and sets them on local object
   */
  constructor() {
    const storedTrainer = localStorage.getItem('trainer');
    if (storedTrainer) {
      this._trainer = JSON.parse(storedTrainer) as Trainer;
    }

    const storedPokemons = localStorage.getItem('pokemon');
    if (storedPokemons) {
      this._pokemons = JSON.parse(storedPokemons) as Pokemon[];
    }
  }
  /**
   * returns local trainer object
   */
  get trainer(): Trainer | undefined {
    return this._trainer;
  }
  /**
   * returns local pokemon array
   */
  get pokemon(): Pokemon[] | undefined {
    return this._pokemons;
  }
  /**
   *
   * @param trainer sets trainer on localstorage
   */
  setTrainer(trainer: Trainer | undefined): void {
    this._trainer = trainer;
    localStorage.setItem('trainer', JSON.stringify(trainer));
  }
  /**
   *
   * @param pokemon sets pokemon on localstorage
   */
  setPokemon(pokemon: any | undefined): void {
    this._pokemons = pokemon;
    localStorage.setItem('pokemon', JSON.stringify(pokemon));
  }
  /**
   * clears trainer from localstorage
   * and sets local trainer to undefined
   */
  logout() {
    this._trainer = undefined;
    localStorage.removeItem('trainer');
  }
}
