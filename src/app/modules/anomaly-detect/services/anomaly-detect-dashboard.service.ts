import { Injectable } from "@angular/core";
import { debounceTime, delay, throttleTime, timeout } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { HttpWrapperService } from "../../core/http/http-wrapper.service";

@Injectable()
export class AnomalyDetectDashboardService {
  constructor(private httpWrapper: HttpWrapperService) {}

  public getFilters() {
    return this.httpWrapper.get(
      `${environment.local_url}/anomaly-detection-dasbhoard/filter.json`
    );
  }

  public getTiles(value, type: string) {
    if (type == "domain") {
      return this.httpWrapper
        .get(
          `${
            environment.local_url
          }/anomaly-detection-dasbhoard/${value.toLowerCase()}_tileData.json`,
          false
        )
        .pipe(delay(1000));
    }
    return this.httpWrapper
      .get(
        `${
          environment.local_url
        }/anomaly-detection-dasbhoard/${value.toLowerCase()}_tileData.json`,
        false
      )
      .pipe(delay(1000));
  }

  public getChartData(value, type: string) {
    if (type == "domain") {
      return this.httpWrapper
        .get(
          `${environment.local_url}/anomaly-detection-dasbhoard/chart_data_study.json`,
          false
        )
        .pipe(delay(1000));
    }
    return this.httpWrapper
      .get(
        `${
          environment.local_url
        }/anomaly-detection-dasbhoard/${value.toLowerCase()}_chart_data_study.json`,
        false
      )
      .pipe(delay(1000));
  }

  public getTableData(value, type: string) {
    if (type == "domain") {
      return this.httpWrapper
        .get(
          `${
            environment.local_url
          }/anomaly-detection-dasbhoard/${value.toLowerCase()}_table_study.json`,
          false
        )
        .pipe(delay(1000));
    }
    return this.httpWrapper
      .get(
        `${
          environment.local_url
        }/anomaly-detection-dasbhoard/${value.toLowerCase()}_table_study.json`,
        false
      )
      .pipe(delay(1000));
  }
}
