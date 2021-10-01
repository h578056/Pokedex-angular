import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Trainer } from '../../models/trainer.model';
import { SessionService } from '../../services/session.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly loginService: LoginService,
    private readonly sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private trainer: string = '';

  /**
   *
   * @param event input value on change
   */
  loginInputChange(event: any): void {
    this.trainer = event.target.value;
  }
  /**
   * checks if user allready has user on localstorage then redirect to catalog page
   */
  ngOnInit(): void {
    if (
      this.loginService.isLoggedIn() ||
      localStorage.getItem('trainer') !== null
    ) {
      this.routeToCatalog();
    }
  }
  /**
   * method to redirect to catalog
   */
  routeToCatalog() {
    this.router.navigate(['catalog']);
  }
  /**
   *
   * @param loginForm form data from login
   * gets username from loginform object
   * removes spaces from username
   * checks if username is blanck
   * the login, if user doesnt exist register user
   * route to catalog page
   */
  onSubmit(loginForm: NgForm): void {
    this.trainer = loginForm.value.username;
    this.trainer = this.trainer.split(' ').join('');
    if (this.trainer !== '') {
      this.loginService.authenticate(this.trainer, async () => {
        await this.sessionService.setTrainer(this.trainerFromService);
        this.routeToCatalog();
      });
    }
  }

  /**
   * gets trainer from trainer
   */
  get trainerFromService(): Trainer | undefined {
    return this.loginService.trainer();
  }
  get LoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  get attempting(): boolean {
    return this.loginService.attempting;
  }
}
