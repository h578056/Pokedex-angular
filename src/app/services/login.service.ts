import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Trainer } from '../models/trainer.model';
import { Pokemon } from '../models/pokemon.model';

import { Observable, of } from 'rxjs';
import { finalize, retry, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _trainer: Trainer | undefined;
  private _error: string = '';
  private _isLoggedIn: boolean = false;
  public attempting: boolean = false;
  private API_URL: string = environment.API_URL;
  private API_KEY: string = environment.API_KEY;
  constructor(private readonly http: HttpClient) {}
  /**
   *
   * @param username username to fetch from trainer api
   * @returns trainer array of all maching usernames
   */
  private fetchTrainer(username: string): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${this.API_URL}?username=${username}`);
  }
  /**
   *
   * @param username username to register in trainer api
   * @returns trainer object of registerd user
   */
  private registerTrainer(username: string): Observable<Trainer> {
    const headers = {
      'X-API-Key': this.API_KEY,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      username: username,
      pokemon: [],
    });
    return this.http.post<Trainer>(`${this.API_URL}`, body, {
      headers: headers,
    });
  }
  /**
   *
   * @param trainer to update pokemons for
   * @param pokemonArr new array for trainer
   * @returns patch response
   */
  private UpdateTrainer(
    trainer: Trainer,
    pokemonArr: Pokemon[]
  ): Observable<Trainer> {
    //const pokemonArr: any = trainer.pokemon;
    //pokemonArr.push(pokemons);
    const headers = {
      'X-API-Key': this.API_KEY,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      pokemon: pokemonArr,
    });
    return this.http.patch<Trainer>(`${this.API_URL}/${trainer.id}`, body, {
      headers: headers,
    });
  }
  /**
   *
   * @returns local trainer object
   */
  public trainer(): Trainer | undefined {
    return this._trainer;
  }
  /**
   *
   * @returns returns bool if user logged in=true else false
   */
  public isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  /**
   *
   * @returns returns error messag
   */
  public error(): string {
    return this._error;
  }
  /**
   *
   * @param username username to check if user is registerd
   * if not register user
   * @param onSuccess method to do on success
   */
  public authenticate(username: string, onSuccess: () => void): void {
    this.attempting = true;

    // RxJS
    // switchMap, of, map, retry, finalize, catch- throwError, tap

    this.fetchTrainer(username)
      .pipe(
        retry(3),
        // map((users: User[]) => users.pop())
        switchMap((trainers: Trainer[]) => {
          if (trainers.length) {
            return of(trainers[0]);
          }
          return this.registerTrainer(username);
        }),
        tap((trainer: Trainer) => {
          // Cause side effects, without changing response.
        }),
        finalize(() => {
          this.attempting = false;
        })
      )
      .subscribe(
        (trainer: Trainer) => {
          // Success
          if (trainer.id) {
            this._trainer = trainer;
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
   * @param trainer trainer to update pokemons for
   * @param pokemonArr new array with pokemons for trainer
   * @param onSuccess executed onsuccess for patch
   * this simply updates the array, if delete array is shorter(har a pokemon object removed from it)
   * if add has a pokemon object added to it
   */
  public UpdateTrainerPokemon(
    trainer: Trainer,
    pokemonArr: Pokemon[],
    onSuccess: () => void
  ): void {
    this.attempting = true;

    // RxJS
    // switchMap, of, map, retry, finalize, catch- throwError, tap

    this.UpdateTrainer(trainer, pokemonArr)
      .pipe(
        finalize(() => {
          this.attempting = false;
        })
      )
      .subscribe(
        (trainer: Trainer) => {
          // Success
          if (trainer.id) {
            this._trainer = trainer;
            onSuccess();
          }
        },
        (error: HttpErrorResponse) => {
          // error
          this._error = error.message;
        }
      );
  }
}
