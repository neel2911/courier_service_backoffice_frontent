import { Injectable, EventEmitter, Output } from "@angular/core";
import {
  CanActivate,
  Router,
  UrlTree,
  CanActivateChild,
} from "@angular/router";
import { Observable } from "rxjs";
import { AppService } from "../../../services/app.service";
import { AuthService } from "../auth/auth.service";
import { CookieService } from "../auth/cookie.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _appService: AppService,
    private _cookieService: CookieService
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    return true;
    let clientDetails = this._authService.getUser();
    if (this._cookieService.verifyCloudFrontCookie()) {
      if (
        clientDetails &&
        clientDetails.isAdmin &&
        !this._authService.getUserFromLocalStorage()
      ) {
        this._appService.onCustomEvent.next({
          event: "cookiesExpired",
          data: "Your session has been expired. Please login again",
        });
        this._authService.removeUser();
        return this._router.parseUrl("/admin");
      } else {
        if (clientDetails) {
          return true;
        }
        return this._router.parseUrl("/account/login");
      }
    } else {
      this._appService.onCustomEvent.next({
        event: "cookiesExpired",
        data: "Your session has been expired. Please login again",
      });
      this._authService.removeUser();
      if (clientDetails && clientDetails.isAdmin) {
        return this._router.parseUrl("/admin");
      } else {
        return this._router.parseUrl("/account/login");
      }
    }
  }

  canActivateChild() {
    return this.canActivate();
  }
}
