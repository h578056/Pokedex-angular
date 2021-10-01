import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Trainer } from '../../models/trainer.model';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { LoginService } from '../../services/login.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-catalog-page',
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.css'],
})
export class CatalogPageComponent implements OnInit {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly loginService: LoginService,
    private readonly sessionService: SessionService,
    private router: Router,
  ) {}

  public pokemons: Pokemon[] | undefined;
  public pageCount = 0;
  public caught: boolean[] | any;

  /**
   * gets pokomons from server, vit paramarer pagecout as offset
   */
  ngOnInit(): void {
    this.loadPokemonList(this.pageCount);
    this.pokemons = this.pokemonsFromService;
  }
  /**
   *
   * @param pokemonInp
   * @returns true if trainer has pokemon false if not
   * and redirect if user isnt logged in
   */
  caughtPokemon(pokemonInp: Pokemon) {
    if (this.sessionService.trainer) {
      const pArrT: any = this.sessionService.trainer.pokemon;
      for (const pokemon of pArrT) {
        if (pokemon.id === pokemonInp.id) {
          return true;
        }
      }
      return false;
    } else {
      this.router.navigate(['login']);
    }
    return;
  }
  /**
   *
   * @param pokemon adds pokemon to an array of trainers pokemon then patches the array with new pokemon
   */
  addToPokedex(pokemon: Pokemon) {
    let trainer = this.sessionService.trainer;
    if (trainer !== undefined) {
      let trainerUsername = trainer.username;
      if (trainerUsername) {
        const pokemonArr = this._addToArray(trainer, pokemon);
        this.loginService.UpdateTrainerPokemon(
          trainer,
          pokemonArr,
          async () => {
            await this.updateSessionItem(trainerUsername);
          }
        );
      }
    }
  }
  /**
   *
   * @param trainerUsername updates trainer on localstorage
   */
  updateSessionItem(trainerUsername: string) {
    this.loginService.authenticate(trainerUsername, async () => {
      await this.sessionService.setTrainer(this.trainerFromService);
    });
  }
  /**
   * loads previous 20 pokemon from api
   */
  onBackClick() {
    this.pageCount = this.pageCount - 20;
    this.loadPokemonList(this.pageCount);
  }
  /**
   * loads next 20 pokemon from api
   */
  onNextClick() {
    this.pageCount += 20;
    this.loadPokemonList(this.pageCount);
  }
  /**
   * redirects to trainer page
   */
  onTrainerPageClick() {
    this.router.navigate(['trainer']);
  }
  /**
   *
   * @param trainer logged in trainer
   * @param pokemon pokemon to add to trainer
   * @returns array with the new pokemon added
   */
  _addToArray(trainer: Trainer, pokemon: Pokemon) {
    const pokemonArr: any = trainer.pokemon;
    pokemonArr.push(pokemon);
    return pokemonArr;
  }
  /**
   *
   * @param amountLoad gets pokemon from api param is offset amount
   */
  loadPokemonList(amountLoad: number) {
    this.pokemonService.loadPokemon(amountLoad, async () => {
      await this.sessionService.setPokemon(this.pokemonsFromService);
    });
  }
  /**
   * gets pokemon from pokemon service
   */
  get pokemonsFromService(): Pokemon[] | undefined {
    return (this.pokemons = this.pokemonService.pokemon());
  }
  /**
   * gets trainer from trainer service
   */
  get trainerFromService(): Trainer | undefined {
    return this.loginService.trainer();
  }
}
