import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CookieService } from "./cookie.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _user: any = null;
  private onUserInfoUpateSub$: BehaviorSubject<any> = new BehaviorSubject(
    this.getUser()
  );
  public onUserInfoUpate$: Observable<any> = null;

  constructor(private _cookieService: CookieService) {
    let user: any = this.getUserFromLocalStorage();
    if (user) {
      user = JSON.parse(window.atob(user));
      if (user.isAdmin) {
        this.setUser(user);
      }
    }
    this.onUserInfoUpate$ = this.onUserInfoUpateSub$.asObservable();
  }

  public setUser(user) {
    this._user = {
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin || false,
      token: user.token,
    };
    if (user.isAdmin) {
      localStorage.setItem("user", window.btoa(JSON.stringify(this._user)));
    }

    // TODO: set cookieData
    // this._cookieService.setCloudFrontCookie();
    this.onUserInfoUpateSub$.next({ ...this._user });
  }

  public getUser() {
    if (this._user) {
      return { ...this._user };
    } else {
      return null;
    }
  }

  public getUserId() {
    if (this._user) {
      return this._user.id;
    } else {
      return null;
    }
  }

  public getToken() {
    if (this._user) {
      return this._user.token;
    } else {
      return "";
    }
  }

  public removeUser() {
    this._user = null;
    localStorage.removeItem("user");
    this._cookieService.clearCloudfrontCookies();
    this.onUserInfoUpateSub$.next(null);
  }

  public getUserFromLocalStorage() {
    return localStorage.getItem("user");
  }
}
