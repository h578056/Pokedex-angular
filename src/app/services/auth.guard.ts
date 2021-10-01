import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService
  ) {}
  /**
   * checks if there is a trainer on localstorage
   * @returns true if user is logged in, false if not
   *
   */
  canActivate() {
    if (localStorage.getItem('trainer') === null) {
      this.router.navigate(['login']);
      return false;
    } else {
      return true;
    }
  }
}
