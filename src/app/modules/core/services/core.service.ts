import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpWrapperService } from "src/app/modules/core/http/http-wrapper.service";
import { environment } from "src/environments/environment";

@Injectable()
export class CoreService {
  constructor(private _httpWrapperService: HttpWrapperService) {}

  logout(userId): Observable<Response> {
    const request = {
      userId,
      logoutTime: new Date().getTime(),
    };
    return this._httpWrapperService.post(
      environment.api_url + "/auth/logout",
      request
    );
  }
}
