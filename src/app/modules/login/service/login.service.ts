import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http/http-wrapper.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpWrapperService) { }

  // login(requesterName, accessCode, role: string): Observable<Response> {
  login(requesterName, accessCode, role: string): Observable<Response> {
    const request = {
      requesterName: requesterName || '',
      accessCode,
      role,
      accessTime: (new Date()).getTime()
    };
    return this._http.post(environment.api_url + '/auth/login', request);
  }
}
