import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpWrapperService } from "../../core/http/http-wrapper.service";

@Injectable()
export class SettingsService {
  constructor(private httpWrapper: HttpWrapperService) {}

  public getFilters() {
    return this.httpWrapper.get(
      `${environment.local_url}/settings/settingList.json`
    );
  }
}
