import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AnomalyDetectDashboardService } from "../../services/anomaly-detect-dashboard.service";

@Component({
  selector: "app-page-level-filter",
  templateUrl: "./page-level-filter.component.html",
  styleUrls: ["./page-level-filter.component.scss"],
})
export class PageLevelFilterComponent implements OnInit {
  @Input() filters: any = [];
  @Output() evtEmitter: EventEmitter<any> = new EventEmitter<any>();

  public filterForm: FormGroup;
  public isDataLoaded = false;
  public isNoDataFound = true;
  public isShowData = false;
  public isDataAvailable = true;
  public filterDepth = 0;
  public filterTitleObj: any = {
    therapeuticAreaList: "Therapeutic Area",
    indicationList: "Indication",
    studyPhaseList: "Study Phase",
    studyList: "Study",
    domainList: "Domain",
  };
  public displayFilterOptions: any = {};
  public filterOptions: any = {};
  public backupFilterOptions: any = {};

  constructor(
    public formBuilder: FormBuilder,
    private anomalyDetectDashboardService: AnomalyDetectDashboardService
  ) {
    this.filterForm = formBuilder.group({
      therapeuticAreaList: [
        { disabled: false, value: "" },
        Validators.required,
      ],
      indicationList: [{ disabled: true, value: "" }, Validators.required],
      studyPhaseList: [{ disabled: true, value: "" }, Validators.required],
      studyList: [{ disabled: true, value: "" }, Validators.required],
      domainList: [{ disabled: true, value: "" }, Validators.required],
      domains: [{ disabled: false, value: [] }],
    });
  }

  ngOnInit(): void {
    console.log(this.filters);
    this.setFilters();
  }

  setFilters() {
    this.anomalyDetectDashboardService.getFilters().subscribe((res: any) => {
      console.log(res);
      this.filters = Object.keys(res.data).map((filterKey) => {
        return { title: this.filterTitleObj[filterKey], key: filterKey };
      });
      this.filterOptions = res.data;
      this.displayFilterOptions = { ...this.filterOptions };
      this.backupFilterOptions = { ...this.filterOptions };
    });
  }

  commonEmmiter(emitObj) {
    console.log(emitObj);
    this.evtEmitter.emit(emitObj);
  }

  applyFilters() {
    console.log(this.filterForm.value);
    this.commonEmmiter({ returnFilters: this.filterForm.value });
    // this.isShowData = this.filterDepth >= 4;
    // this.isDataLoaded = true;
    // this.setData(this.filterForm.value);
  }

  resetFilters(depth = 0, reset = false) {
    this.filterDepth = depth;
    for (let i = depth; i < this.filters.length; i++) {
      if (i === depth && reset) {
        this.filterForm.value[this.filters[i].key] = "";
        this.filterForm.controls[this.filters[i].key].patchValue("");
      } else if (i > depth && reset) {
        this.filterForm.value[this.filters[i].key] = "";
        this.filterForm.controls[this.filters[i].key].patchValue("");
        this.filterForm.controls[this.filters[i].key].disable();
        if (this.filters[i].key === "domainList") {
          this.filterForm.controls.domains.setValue([]);
        }
      }
    }
  }

  updateFilter(filter, depth, el?) {
    const selectedOption = this.backupFilterOptions[filter.key].find(
      (x) => x.name === this.filterForm.value[filter.key]
    );

    if (!!selectedOption) {
      this.resetFilters(depth, true);
      switch (filter.key) {
        case "therapeuticAreaList":
          this.filterOptions["indicationList"] = this.getDependantFilters(
            "therapeuticAreaId",
            selectedOption.id,
            "indicationList"
          );
          this.displayFilterOptions["indicationList"] = [
            ...this.filterOptions["indicationList"],
          ];
          this.filterForm.controls.indicationList.enable();
          break;
        case "indicationList":
          this.filterOptions["studyPhaseList"] = this.getDependantFilters(
            "indicationId",
            selectedOption.id,
            "studyPhaseList"
          );
          this.displayFilterOptions["studyPhaseList"] = [
            ...this.filterOptions["studyPhaseList"],
          ];
          this.filterForm.controls.studyPhaseList.enable();
          break;
        case "studyPhaseList":
          this.filterOptions["studyList"] = this.getDependantFilters(
            "studyPhaseId",
            selectedOption.id,
            "studyList"
          );
          this.displayFilterOptions["studyList"] = [
            ...this.filterOptions["studyList"],
          ];
          this.filterForm.controls.studyList.enable();
          break;
        case "studyList":
          this.filterOptions["domainList"] = this.getDependantFilters(
            "studyId",
            selectedOption.id,
            "domainList"
          );
          this.displayFilterOptions["domainList"] = [
            ...this.filterOptions["domainList"],
          ];
          this.filterForm.controls.domainList.enable();
          break;
        case "domainList":
          // this.filterForm.value.domains.push(event.option.viewValue);
          // el.value = "";
          // this.filterForm.controls.domainList.setValue("");
          break;
      }
    }
  }

  getDependantFilters(srcKey, srcVal, targetKey) {
    return this.backupFilterOptions[targetKey].filter((item) => {
      return item.hasOwnProperty(srcKey) && item[srcKey] === srcVal;
    });
  }
}
