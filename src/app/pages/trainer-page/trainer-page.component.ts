import { Component, OnInit } from '@angular/core';
import { Trainer } from '../../models/trainer.model';
import { Pokemon } from '../../models/pokemon.model';
import { LoginService } from '../../services/login.service';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trainer-page',
  templateUrl: './trainer-page.component.html',
  styleUrls: ['./trainer-page.component.css'],
})
export class TrainerPageComponent implements OnInit {
  constructor(
    private readonly loginService: LoginService,
    private readonly sessionService: SessionService,
    private router: Router
  ) {}

  public pokemons: any | undefined;

  ngOnInit(): void {
    this._checkSessionItem();
  }
  /**
   * checks if trainer on localstorage
   */
  _checkSessionItem() {
    let trainer = this.sessionService.trainer;
    if (trainer) {
      this.pokemons = trainer.pokemon;
    }
  }
  /**
   *
   * @param pokemon pokemon to remove from trainer
   * @param index postistion in trainers pokemon array
   */
  deletePokemon(pokemon: Pokemon, index: any) {
    let trainer = this.sessionService.trainer;
    if (trainer !== undefined) {
      let trainerUsername = trainer.username;
      if (trainerUsername) {
        const pokemonArr = this.removeFromPokemonArray(trainer, pokemon, index);
        this.loginService.UpdateTrainerPokemon(
          trainer,
          pokemonArr,
          async () => {
            await this.updateSessionItem(trainerUsername);
            this._checkSessionItem();
          }
        );
      }
    }
  }
  /**
   * routes to catalog
   */
  onBackClick() {
    this.router.navigate(['catalog']);
  }
  /**
   * routes to login
   */
  onLogoutClick() {
    this.sessionService.logout();
    this.router.navigate(['login']);
  }
  /**
   *
   * @param trainerUsername checks if user is registerd and updates sessionstorage
   */
  updateSessionItem(trainerUsername: string) {
    this.loginService.authenticate(trainerUsername, async () => {
      await this.sessionService.setTrainer(this.trainerFromService);
    });
  }
  /**
   *
   * @param trainer trainer to get pokemon array from
   * @param pokemon pokemon to be roved
   * @param index postion to remove pokemon from
   * @returns new array with pokemon removed
   */
  removeFromPokemonArray(
    trainer: Trainer,
    pokemon: Pokemon,
    index: any
  ): Pokemon[] {
    let p: any = trainer.pokemon;
    for (let i = 0; i < p.length; i++) {
      if (pokemon.id === p[i].id && i === index) {
        p.splice(i, 1);
        break;
      }
    }
    return p;
  }

  /**
   * gets trainer from loginservice
   */
  get trainerFromService(): Trainer | undefined {
    return this.loginService.trainer();
  }
}
