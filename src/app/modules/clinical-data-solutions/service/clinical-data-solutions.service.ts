import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpWrapperService } from "../../core/http/http-wrapper.service";

@Injectable()
export class ClinicalDataSolutionsService {
  constructor(private httpWrapper: HttpWrapperService) {}

  public getFilters() {
    if (environment.production) {
      return this.httpWrapper.get(
        `${environment.api_url}/clinical-data-solutions/solutionList.json`
      );
    } else {
      return this.httpWrapper.get(
        `${environment.local_url}/clinical-data-solutions/solutionList.json`
      );
    }
  }
}
