import { SelectionModel } from "@angular/cdk/collections";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatRow, MatTableDataSource } from "@angular/material/table";
import { debounceTime, map } from "rxjs/operators";
import {
  CustomEventType,
  NotificationType,
} from "src/app/modules/shared/enum/enum";
import { AppService } from "src/app/services/app.service";
import { AcceptDialogComponent } from "../../components/accept-dialog/accept-dialog.component";
import { RejectDialogComponent } from "../../components/reject-dialog/reject-dialog.component";
import { ReviewDialogComponent } from "../../components/review-dialog/review-dialog.component";
import { AnomalyDetectDashboardService } from "../../services/anomaly-detect-dashboard.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
@Component({
  selector: "app-anomaly-detect-dashboard",
  templateUrl: "./anomaly-detect-dashboard.component.html",
  styleUrls: ["./anomaly-detect-dashboard.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class AnomalyDetectDashboardComponent implements OnInit, AfterViewInit {
  public restrictMove = true;
  public focusedRow = -1;
  public isDataLoaded = false;
  public isNoDataFound = true;
  public isShowData = false;
  public isDataAvailable = true;
  public sortDirection = "";
  public sortActiveOn = "";
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public loader = {
    isTileLoaded: false,
    isChartLoaded: false,
    isTableLoaded: false,
  };
  public domainColor = {
    missingData: "#68E4FF",
    outLier: "#EDA0C9",
    overLappingEvents: "#E7C61B",
    variance: "#719EF6",
    percChange: "#4F57A0",
    multiVariate: "#FF6363",
    crossDomainMissing: "#C2896A",
    crossDomainIncorrect: "#71F6DE",
  };
  public barChartDefaultData = {};
  public barChartdata = {};
  public lineGraphDefaultData = {};
  public lineGraphdata = {};
  public lineGraphTabledata = {};

  public chartData = { domainDetails: [1] };

  public tableTitle = {};

  public tableColumnFilter: any = {};
  public subTableColumns: any = [
    "select",
    "anomalyId",
    "reviewStatus",
    "confidenceScore",
    "anomalyType",
    "anomalyDetails",
    "action",
  ];
  public subTableTitles: any = {
    anomalyId: "Anomaly Id",
    anomalyType: "Anomaly Type",
    anomalyDetails: "Anomaly Details",
    confidenceScore: "Confidence Score",
    reviewStatus: "Review Status",
    action: "Actions",
  };

  public columns: any[] = [];
  public displayedColumns: string[] = [];
  public displayedColumnsSortingStatus: any = {};
  // public displayedColumnsTableSecond: string[] = [];
  public tableData: any;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public start: number = 0;
  public limit: number = 15;
  public end: number = this.limit + this.start;
  public selection = new SelectionModel<any>(true, []);
  public previousIndex: number;
  public previousIndexForSecondTable: number;
  public filters: any = [];
  public tileList = [];
  public Object = Object;
  public expandedAll = false;
  public returnFilter = [];

  // public leftTable: ElementRef;
  // public rightTable: ElementRef;

  @ViewChild("leftTable", { static: false }) leftTable: ElementRef;
  @ViewChild("rightTable", { static: false }) rightTable: ElementRef;
  @ViewChildren("matRow", { read: ElementRef }) matRow: QueryList<ElementRef>;

  constructor(
    private anomalyDetectDashboardService: AnomalyDetectDashboardService,
    private dialog: MatDialog,
    private _appService: AppService
  ) {}

  ngOnInit() {
    // this.setDisplayedColumns();
    // this.setDisplayedColumnsForSecondTable();
    // this.filterForm.controls[]
  }

  setData(formValues) {
    this.setTiles(
      formValues.domainList,
      formValues.studyList,
      formValues.domainList ? "domain" : "study"
    );
    this.setTable(
      formValues.domainList,
      formValues.studyList,
      formValues.domainList ? "domain" : "study"
    );
    this.setChart(
      formValues.domainList,
      formValues.studyList,
      formValues.domainList ? "domain" : "study"
    );
  }

  ngAfterViewInit() {
    // this.syncScroll();
  }

  setChart(domainValue, studyValue, type) {
    this.loader.isChartLoaded = false;
    this.anomalyDetectDashboardService
      .getChartData(type == "domain" ? domainValue : studyValue, type)
      .pipe(map((v) => v.data))
      .subscribe(
        (res) => {
          this.barChartDefaultData = {};
          this.barChartdata = {};
          this.lineGraphDefaultData = {};
          this.lineGraphdata = {};
          this.lineGraphTabledata = {};
          // const selectedDomain = res.domainDetails;
          const selectedDomain = res.domainDetails.filter(
            (domain) =>
              domain.domainName.toLowerCase() === domainValue.toLowerCase()
          );
          if (selectedDomain.length > 0) {
            if (type === "domain") {
              this.lineGraphDefaultData = { ...res };
              const tempData = {
                // yAxisLabel: "Anomaly Count",
                // xAxisLabel: "Domains",
                graphData: [],
              };
              const tempTableData = {
                // yAxisLabel: "Anomaly Count",
                // xAxisLabel: "Domains",
                graphData: [],
              };

              //   name: "Missing Data",
              // color: "#68E4FF",
              // accepted: 10,
              // rejected: 20,
              // reviewInProgress: 15,
              // noActionTaken: 25,
              res.domainDetails = [...selectedDomain];

              res.domainDetails.forEach((domain) => {
                const anomalysDetails = domain.anomalysDetails;
                anomalysDetails.forEach((v) => {
                  tempData.graphData.push({
                    keyName: res.anomalysLegends[v.name],
                    color: this.domainColor[v.name],
                    completed: {
                      value: v.statusCount.completed,
                      tooltip: `<div>
                      <div class="d-flex justify-content-between mb-1">
                        <strong>${res.statusLegends["completed"]}: </strong> <span>${v.statusCount.completed}</span>
                      </div>`,
                    },
                    inProgress: {
                      value: v.statusCount.inProgress,
                      tooltip: `<div>
                      <div class="d-flex justify-content-between mb-1">
                        <strong>${res.statusLegends["inProgress"]}: </strong> <span>${v.statusCount.inProgress}</span>
                      </div>`,
                    },
                    notStarted: {
                      value: v.statusCount.notStarted,
                      tooltip: `<div>
                      <div class="d-flex justify-content-between mb-1">
                        <strong>${res.statusLegends["notStarted"]}: </strong> <span>${v.statusCount.notStarted}</span>
                      </div>`,
                    },
                  });
                  tempTableData.graphData.push({
                    keyName: res.anomalysLegends[v.name],
                    color: this.domainColor[v.name],
                    completed: {
                      value: v.statusCount.completed,
                    },
                    inProgress: {
                      value: v.statusCount.inProgress,
                    },
                    notStarted: {
                      value: v.statusCount.notStarted,
                    },
                  });
                });
              });

              this.lineGraphdata = { ...tempData };
              this.lineGraphTabledata = { ...tempTableData };
            } else {
              this.barChartDefaultData = { ...res };
              console.log(res);
              const tempData = {
                yAxisLabel: "Anomaly Count",
                xAxisLabel: "Domains",
                legends: [],
                graphData: [],
              };

              res.domainDetails[0].anomalysDetails.forEach((v) => {
                tempData.legends.push({
                  name: res.anomalysLegends[v.name],
                  color: this.domainColor[v.name],
                });
              });

              res.domainDetails.forEach((domain) => {
                const anomalysDetails = domain.anomalysDetails;
                const chartValue = {};
                anomalysDetails.forEach((v) => {
                  chartValue[v.name] = {
                    value: v.totalCount,
                    completed: v.statusCount.completed,
                    inProgress: v.statusCount.inProgress,
                    notStarted: v.statusCount.notStarted,
                    tooltip: `<div>
                    <div class="d-flex justify-content-between mb-1">
                      <strong>${res.statusLegends["completed"]}: </strong> <span>${v.statusCount.completed}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <strong>${res.statusLegends["inProgress"]}: </strong> <span>${v.statusCount.inProgress}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <strong>${res.statusLegends["notStarted"]}: </strong> <span>${v.statusCount.notStarted}</span>
                    </div>
                  </div>`,
                  };
                });

                tempData.graphData.push({
                  keyName: domain.domainName,
                  ...chartValue,
                });
              });

              this.barChartdata = { ...tempData };
            }
          }
          this.loader.isChartLoaded = true;
        },
        (err) => {
          this.loader.isChartLoaded = true;
          this.barChartDefaultData = {};
          this.barChartdata = {};
          this.lineGraphDefaultData = {};
          this.lineGraphdata = {};
          this.lineGraphTabledata = {};
        }
      );
  }

  setTable(domainValue, studyValue, type) {
    this.loader.isTableLoaded = false;
    this.anomalyDetectDashboardService
      .getTableData(type == "domain" ? domainValue : studyValue, type)
      .pipe(map((v) => v.data))
      .subscribe(
        (res) => {
          console.log(res);
          this.tableTitle = {
            ...res.columnsConfig.titles,
            totalAnomalies: "Total Anomalies",
          };
          this.displayedColumns = ["select", "totalAnomalies"];
          this.columns = [
            { field: "select", width: 100 },
            { field: "totalAnomalies", width: 100 },
          ];
          this.tableColumnFilter["totalAnomalies"] = "";
          let hideColumns = ["studyid", "domain"];
          this.selection.clear();
          Object.keys(res.columnsConfig.titles).forEach((key) => {
            if (hideColumns.indexOf(key) == -1) {
              this.displayedColumns.push(key);
              this.columns.push({
                field: key,
                width: 100,
              });
              this.displayedColumnsSortingStatus[key] = true;
              this.tableColumnFilter[key] = "";
            }
          });
          this.displayedColumns.push("collapsible");
          this.columns.push({
            field: "collapsible",
            width: 100,
          });
          res.records.forEach((record) => {
            record.totalAnomalies = record.detectedAnomaly.length;
            record.detectedAnomaly = new MatTableDataSource(
              record.detectedAnomaly
            );
            record.detectedAnomalySelection = new SelectionModel<any>(true, []);

            Object.keys(res.columnsConfig.titles).forEach((key) => {
              if (!record[key]) {
                record[key] = "";
              }
            });
          });
          this.tableData = { ...res };
          this.dataSource = new MatTableDataSource(res.records);
          // this.dataSource = new MatTableDataSource([
          //   ...this.getTableLoadedData(this.start, this.end),
          // ]);

          this.dataSource.filterPredicate = (data, filter: string): boolean => {
            const parsedJson = JSON.parse(filter);
            const filterBoxValue = parsedJson.filterBox;

            return Object.keys(this.tableColumnFilter).every((v) =>
              data[v]
                .toString()
                .toLowerCase()
                .includes(filterBoxValue[v].toString())
            );
          };

          this.loader.isTableLoaded = true;
        },
        (err) => {
          this.loader.isTableLoaded = true;
          this.dataSource.data = [];
          // this.checkAllData();
        }
      );
  }

  setTiles(domainValue, studyValue, type) {
    this.loader.isTileLoaded = false;
    this.anomalyDetectDashboardService
      .getTiles(type === "domain" ? domainValue : studyValue, type)
      .pipe(map((v) => v.data))
      .subscribe(
        (res) => {
          this.loader.isTileLoaded = true;
          this.tileList = res;
          // this.checkAllData();
        },
        (err) => {
          this.loader.isTileLoaded = true;
          this.tileList = [];
          // this.checkAllData();
        }
      );
  }

  applyFilters(filters?) {
    console.log(filters);
    // this.isShowData = this.filterDepth >= 4;
    this.isDataLoaded = true;
    this.setData(filters);
  }

  onSortClick(key, direction, isAlphaBetic = false) {
    this.sortActiveOn = key;
    this.sortDirection = direction;

    this.tableData.records.sort((a, b) => {
      let x;
      const i = isAlphaBetic ? (a[key] || "").toLowerCase() : +a[key];
      const j = isAlphaBetic ? (b[key] || "").toLowerCase() : +b[key];
      x = i > j ? -1 : i < j ? 1 : 0;
      return x * (this.sortDirection === "desc" ? 1 : -1);
    });

    this.dataSource.data = [...this.tableData.records];
  }

  applyTableFilter(filterValue: string) {
    console.log(this.tableColumnFilter);
    this.dataSource.filter = JSON.stringify({
      filterBox: this.tableColumnFilter,
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.dataSource.data.forEach((row) => {
        row.detectedAnomaly.data.forEach((subRow) =>
          row.detectedAnomalySelection.deselect(subRow)
        );
      });
    } else {
      this.dataSource.data.forEach((row) => {
        this.selection.select(row);
        row.detectedAnomaly.data.forEach((subRow) =>
          row.detectedAnomalySelection.select(subRow)
        );
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSubSelected(row) {
    const numSelected = row.detectedAnomalySelection.selected.length;
    const numRows = row.detectedAnomaly.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterAllSubToggle(row) {
    this.isAllSubSelected(row)
      ? row.detectedAnomalySelection.clear()
      : row.detectedAnomaly.data.forEach((subRow) =>
          row.detectedAnomalySelection.select(subRow)
        );

    this.selection.toggle(row);
  }

  toggleSubRecord(element, row) {
    element.detectedAnomalySelection.toggle(row);

    if (
      element.detectedAnomalySelection.selected.length ===
      element.detectedAnomaly.data.length
    ) {
      this.selection.select(element);
    } else {
      // if (element.detectedAnomalySelection.selected.length === 0)
      this.selection.deselect(element);
    }
    // row.detectedAnomaly.data.forEach((subRow) =>
    //   row.detectedAnomalySelection.is(subRow)
    // );

    // this.selection.deselect()
  }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: any): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? "select" : "deselect"} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
  //     row.position + 1
  //   }`;
  // }

  onAcceptClick() {
    const dialogRef = this.dialog.open(AcceptDialogComponent, {
      panelClass: "accept-dialog-container",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this._appService.updateCustomEvent({
          event: CustomEventType.SHOW_TOAST_MESSAGE,
          data: {
            type: NotificationType.SUCCESS,
            message: val,
          },
        });
      }
    });
  }
  onRejectClick() {
    const dialogRef = this.dialog.open(RejectDialogComponent, {
      panelClass: "reject-dialog-container",
      disableClose: true,
    });
  }
  onReviewClick() {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      panelClass: "review-dialog-container",
      disableClose: true,
    });
  }

  // private _filter(value: string, key) {
  //   const filterValue = value.toLowerCase();
  //   return this.filterOptions[key].filter((filter) =>
  //     filter.name.toLowerCase().includes(filterValue)
  //   );
  // }

  // onTabelScroll(e, side, target) {
  //   let isSyncingLeftScroll = false;
  //   let isSyncingRightScroll = false;
  //   if (!!target && side === "left") {
  //     if (!isSyncingLeftScroll) {
  //       isSyncingRightScroll = true;
  //       target.scrollTop = e.target.scrollTop;
  //     }
  //     isSyncingLeftScroll = false;
  //   }

  //   if (!!target && side === "right") {
  //     if (!isSyncingRightScroll) {
  //       isSyncingLeftScroll = true;
  //       target.scrollTop = e.target.scrollTop;
  //     }
  //     isSyncingRightScroll = false;
  //   }
  //   this.onTableScrollLoadData(e);
  // }

  // syncScroll() {
  //   let isSyncingLeftScroll = false;
  //   let isSyncingRightScroll = false;

  //   fromEvent(this.leftTable.nativeElement, "scroll").subscribe((e: any) => {
  //     if (!isSyncingLeftScroll) {
  //       isSyncingRightScroll = true;
  //       this.rightTable.nativeElement.scrollTop = e.target.scrollTop;
  //     }
  //     isSyncingLeftScroll = false;
  //     if (this.dataSource.data.length > 0) {
  //       this.onTableScrollLoadData(e);
  //     }
  //   });

  //   fromEvent(this.rightTable.nativeElement, "scroll").subscribe((e: any) => {
  //     if (!isSyncingRightScroll) {
  //       isSyncingLeftScroll = true;
  //       this.leftTable.nativeElement.scrollTop = e.target.scrollTop;
  //     }
  //     isSyncingRightScroll = false;
  //     if (this.dataSource.data.length > 0) {
  //       this.onTableScrollLoadData(e);
  //     }
  //   });
  // }

  onTableScrollLoadData(e) {
    console.log(e);
    const tableViewHeight = e.target.offsetHeight; // viewport
    const tableScrollHeight = e.target.scrollHeight; // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
      this.updateIndex();
      const data = this.getTableLoadedData(this.start, this.end);
      this.dataSource.data = this.dataSource.data.concat(data);
      this.isAllSelected();
    }
  }

  getTableLoadedData(start, end) {
    return this.tableData.records.filter(
      (value, index) => index >= start && index < end
    );
  }

  updateIndex() {
    this.start = this.end;
    this.end = this.limit + this.start;
  }

  onHover(row) {
    console.log(row);

    this.focusedRow = row;
  }
  onCollapsibleHeaderClick() {
    this.expandedAll = !this.expandedAll;
    this.matRow.forEach((row) => {
      if (
        this.expandedAll &&
        !row.nativeElement.classList.contains("expanded")
      ) {
        row.nativeElement.click();
      } else if (!this.expandedAll) {
        row.nativeElement.click();
      }
    });
  }

  filterCallBack(data) {
    console.log(data);
    this.applyFilters(data.returnFilters);
    this.returnFilter = data.returnFilters;
  }
}

// line chart processing data
// this.lineGraphDefaultData = { ...res };
//               const tempData = {
//                 // yAxisLabel: "Anomaly Count",
//                 // xAxisLabel: "Domains",
//                 graphData: [],
//               };

//               //   name: "Missing Data",
//               // color: "#68E4FF",
//               // accepted: 10,
//               // rejected: 20,
//               // reviewInProgress: 15,
//               // noActionTaken: 25,
//               res.domainDetails = [...selectedDomain];

//               res.domainDetails.forEach((domain) => {
//                 const anomalysDetails = domain.anomalysDetails;
//                 anomalysDetails.forEach((v) => {
//                   tempData.graphData.push({
//                     name: res.anomalysLegends[v.name],
//                     color: this.domainColor[v.name],
//                     completed: v.statusCount.completed,
//                     inProgress: v.statusCount.inProgress,
//                     notStarted: v.statusCount.notStarted,
//                   });
//                 });
//               });

//               this.lineGraphdata = { ...tempData };
//               console.log(this.lineGraphdata);
