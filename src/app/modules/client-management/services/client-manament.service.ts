import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpWrapperService } from "../../core/http/http-wrapper.service";

@Injectable()
export class ClientManagementService {
  constructor(private _httpWrapperService: HttpWrapperService) {}

  public getClients(filter = "", pageIndex = 0, pageSize = 3) {
    return this._httpWrapperService.get(
      environment.local_url + "/clientmanagement/clientList.json"
    );
  }
}
