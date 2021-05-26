import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuardService implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) { }

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (this._authService.getUser()) {
      return this._router.parseUrl('/dashboard');
    } else {
      return true;
    }
  }
}
