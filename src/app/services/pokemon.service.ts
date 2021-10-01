import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private _pokemons: Pokemon[] | undefined;
  private _error: string = '';
  private API_URL: string = environment.API_URL_POKEMON;
  public attempting: boolean = false;

  constructor(private readonly http: HttpClient) {}
  /**
   *
   * @param offset on the url to determine which pokemon to get
   * @returns pokemon array if length 20
   */
  private fetchPokemon(offset: number): Observable<Pokemon[]> {
    if (offset < 0) {
      return this.http.get<Pokemon[]>(`${this.API_URL}?limit=20`);
    } else {
      return this.http.get<Pokemon[]>(
        `${this.API_URL}?limit=20&offset=${offset}`
      );
    }
  }
  /**
   *
   * @param offset on the url to determine which pokemon to get
   * @param onSuccess method to be executed on success
   */
  public loadPokemon(offset: number, onSuccess: () => void): void {
    this.attempting = true;

    // RxJS
    // switchMap, of, map, retry, finalize, catch- throwError, tap

    this.fetchPokemon(offset)
      .pipe(
        finalize(() => {
          this.attempting = false;
        })
      )
      .subscribe(
        (pokemon: any) => {
          // Success
          if (pokemon) {
            this._pokemons = pokemon.results;
            this._pokemons = this.pokemonConverter();
            onSuccess();
          }
        },
        (error: HttpErrorResponse) => {
          // error
          this._error = error.message;
        }
      );
  }

  /**
   *
   * @returns local pokemons
   */
  public pokemon(): Pokemon[] | undefined {
    return this._pokemons;
  }
  /**
   *
   *
   * @returns array of pokemon Object
   */
  public pokemonConverter(): Pokemon[] | undefined {
    const arrP: Pokemon[] = [];
    let pokemon: Pokemon;
    let id = '';
    if (this._pokemons) {
      for (let i = 0; i < this._pokemons.length; i++) {
        const url = this._pokemons[i].url.split('/');
        const id = url[url.length - 2];
        arrP[i] = {
          name: this._pokemons[i].name,
          id: Number(id),
          url: this._pokemons[i].url,
          avatar:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' +
            id +
            '.png',
        };
      }
    }
    return arrP;
  }
}
