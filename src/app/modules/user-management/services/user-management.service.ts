import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpWrapperService } from "../../core/http/http-wrapper.service";
import { EmployeeStatus } from "../../shared/enum/enum";
import { Employee } from "../model/employee";

@Injectable()
export class UserManagementService {
  public currentDate = new Date();

  constructor(private _httpWrapperService: HttpWrapperService) {}

  parseUserObj(result, isResponse: boolean) {
    let status = result.status;
    let startDate = result.accessStartDate;
    let endDate = result.accessEndDate;
    if (isResponse) {
      status = result.status === "unblock" ? true : false;
      startDate = new Date(+result.accessStartDate);
      endDate = new Date(+result.accessEndDate);
    } else {
      status = result.status ? "unblock" : "block";
      let time = moment(result.accessStartDate).format("YYYY/MM/DD");
      startDate = moment(time).format("x");
      time = moment(result.accessEndDate).format("YYYY/MM/DD") + " 23:59:59";
      endDate = moment(time).format("x");
    }
    result.status = status;
    result.accessStartDate = startDate;
    result.accessEndDate = endDate;
    result.status =
      result.status === true &&
      this.currentDate >= result.accessStartDate &&
      this.currentDate <= result.accessEndDate
        ? EmployeeStatus.ACTIVE
        : result.status === false &&
          this.currentDate >= result.accessStartDate &&
          this.currentDate <= result.accessEndDate
        ? EmployeeStatus.ACTIVE_B
        : EmployeeStatus.INACTIVE;
    return result;
  }

  getUsersList(): Observable<Response> {
    if (environment.production) {
      // return this._httpWrapperService.get(environment.api_url + "/users");
    } else {
      return this._httpWrapperService.get(
        environment.local_url + "/usermanagement/userList.json"
      );
    }
  }

  updateUser(user): Observable<Response> {
    return this._httpWrapperService.put(environment.api_url + "/user", user);
  }

  addUser(user): Observable<Response> {
    return this._httpWrapperService.post(environment.api_url + "/user", user);
  }

  getUserHistory(userid): Observable<Response> {
    return this._httpWrapperService.get(
      environment.api_url + "/user/session-history/" + userid
    );
  }

  getLockedIpsList(userid): Observable<Response> {
    return this._httpWrapperService.get(
      environment.api_url + "/users/application-accessed?userId=" + userid
    );
  }

  toggleUserLockedStatus(data): Observable<Response> {
    return this._httpWrapperService.post(
      environment.api_url + "/users/application-accessed",
      data
    );
  }
}
