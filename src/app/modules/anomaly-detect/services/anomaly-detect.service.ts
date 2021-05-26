import { Injectable } from "@angular/core";
import { HttpWrapperService } from "../../core/http/http-wrapper.service";

@Injectable()
export class AnomalyDetectService {
  constructor(private httpWrapper: HttpWrapperService) {}

  public getFilters() {
    return this.httpWrapper.get("jsons/Menu/filter.json");
  }
}
