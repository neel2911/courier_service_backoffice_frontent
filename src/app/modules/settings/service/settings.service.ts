import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpWrapperService } from "../../core/http/http-wrapper.service";

@Injectable()
export class SettingsService {
  constructor(private _httpWrapperService: HttpWrapperService) {}

  public getFilters() {
    return this._httpWrapperService.get(
      `${environment.local_url}/settings/settingList.json`
    );
  }

  public getSettingData() {
    return this._httpWrapperService.get(
      `${environment.local_url}/settings/roleList.json`
    );
  }
}
