import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpEventType } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, pipe } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { AppService } from "src/app/services/app.service";
import { finalize } from "rxjs/operators";
import { CustomEventType, NotificationType } from "../../shared/enum/enum";

@Injectable({
  providedIn: "root",
})
export class HttpWrapperService {
  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
    private _router: Router,
    private _appService: AppService
  ) {}

  get(
    url: string,
    isShowPrimaryLoader: boolean = true,
    options?: any
  ): Observable<any> {
    return this._request("GET", url, options, isShowPrimaryLoader);
  }

  post(
    url: string,
    data: any,
    isShowPrimaryLoader: boolean = true,
    options: any = {}
  ): Observable<any> {
    options = { ...options, body: data };
    return this._request("POST", url, options, isShowPrimaryLoader);
  }

  put(
    url: string,
    data: any,
    isShowPrimaryLoader: boolean = true,
    options?: any
  ): Observable<any> {
    let reqBody = { body: data };
    if (options) {
      reqBody = { ...options, body: data };
    }
    return this._request("PUT", url, reqBody, isShowPrimaryLoader);
  }

  delete(
    url: string,
    data?: any,
    isShowPrimaryLoader: boolean = true,
    options?: any
  ): Observable<any> {
    let reqBody;
    if (data || options) {
      reqBody = { ...options, body: data };
    }
    return this._request("DELETE", url, reqBody, isShowPrimaryLoader);
  }

  private _request(
    method: string,
    url: string,
    options: any = {},
    isShowPrimaryLoader
  ) {
    // console.log(url, method, options)
    const _token = this._authService.getToken();
    let _headers = new HttpHeaders().set("Authorization", _token);

    if (options.headers) {
      _headers = new HttpHeaders({ ...options.headers });
    }

    options = { ...options, headers: _headers };

    // Set spinner at application level start
    if (isShowPrimaryLoader) {
      this._appService.togglePrimaryLoader(true);
    } else {
      this._appService.widgetLoader$.next(true);
    }
    // Set spinner at application level end

    return new Observable((observer: any) => {
      this._http.request(method, url, options).subscribe(
        (response: any) => {
          if (options.observe === "events") {
            observer.next({ id: options.id, ...response });
            if (response.type === HttpEventType.Response) {
              observer.complete();
            }
          } else {
            if (isShowPrimaryLoader) {
              this._appService.togglePrimaryLoader(false);
            } else {
              this._appService.widgetLoader$.next(false);
            }
            observer.next(response);
            observer.complete();
          }
        },
        (error) => {
          if (isShowPrimaryLoader) {
            this._appService.togglePrimaryLoader(false);
          } else {
            this._appService.widgetLoader$.next(false);
          }
          switch (error.status) {
            case 400:
              observer.error(error);
              observer.complete();
              break;
            case 401:
              observer.error(error);
              observer.complete();
              break;
            case 403:
              const clientDetails = this._authService.getUser();
              // let baseRedirectURL = "/login";
              // if (clientDetails.isAdmin) {
              //   baseRedirectURL = "/admin";
              // }
              this._authService.removeUser();
              if (error.error && error.error.customMessage) {
                this._appService.onCustomEvent.next({
                  event: CustomEventType.SHOW_TOAST_MESSAGE,
                  data: {
                    type: NotificationType.ERROR,
                    message: error.error.customMessage,
                  },
                });
              }
              observer.complete();
              // this._router.navigate([baseRedirectURL]);
              break;
            case 500:
              // this.displayMessage(error.message);
              observer.error(error);
              observer.complete();
              break;
            default:
              // this.displayMessage(error.message);
              observer.error(error);
              observer.complete();
              break;
          }
        },
        () => {
          if (isShowPrimaryLoader) {
            this._appService.togglePrimaryLoader(false);
          } else {
            this._appService.widgetLoader$.next(false);
          }
        }
      );
    });
  }
}
