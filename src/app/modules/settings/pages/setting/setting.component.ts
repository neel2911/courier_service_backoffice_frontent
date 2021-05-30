import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NavigationEnd, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { MatNotificationService } from "src/app/modules/material/services/mat-notification.service";
import { EmployeeStatus } from "src/app/modules/shared/enum/enum";
import { HistoryDialogBoxComponent } from "src/app/modules/user-management/components/history-dialog-box/history-dialog-box.component";
import { UserDialogBoxComponent } from "src/app/modules/user-management/components/user-dialog-box/user-dialog-box.component";
import { ViewUserDialogBoxComponent } from "src/app/modules/user-management/components/view-user-dialog-box/view-user-dialog-box.component";
import { Employee } from "src/app/modules/user-management/model/employee";
import { UserManagementService } from "src/app/modules/user-management/services/user-management.service";
import { SettingsService } from "../../service/settings.service";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  get EmployeeStatus() {
    return EmployeeStatus;
  }

  public currentSetting = null;
  public settingTitle = {
    role: "Manage Roles",
  };
  public filterText = "";
  public tableData = null;
  public selectedRowIndex = -1;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) pageinator: MatPaginator;

  constructor(
    private _userManagementService: UserManagementService,
    private _settingsService: SettingsService,
    private _dialog: MatDialog,
    private _notification: MatNotificationService,
    private _router: Router
  ) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        const routeList = event.url.split("/");
        this.currentSetting = routeList[routeList.length - 1];
      }
    });
  }

  ngOnInit() {
    this._settingsService
      .getSettingData()
      .pipe(
        map((val: any) => {
          return val.hasOwnProperty("data") ? val : { data: val };
        }),
        map((v) => v.data)
      )
      .subscribe((res) => {
        const columns = [];
        Object.keys(res.mainTableConfigs.titles).forEach((c) => {
          columns.push({
            field: c,
          });
        });
        columns.push({ field: "collapsible" });
        const subTablecolumns = [];
        Object.keys(res.subTableConfigs.titles).forEach((c) => {
          subTablecolumns.push({
            field: c,
          });
        });
        this.tableData = {
          ...{
            mainTableConfigs: {
              titles: res.mainTableConfigs.titles,
              displayColumns: [
                ...Object.keys(res.mainTableConfigs.titles),
                "collapsible",
              ],
              columns,
              sortableColumns: res.mainTableConfigs.sortableColumns,
              filerableColumns: res.mainTableConfigs.filerableColumns,
              booleanColumns: res.mainTableConfigs.booleanColumns,
              dateColumns: res.mainTableConfigs.dateColumns,
              hasPaginator: true,
              pageSizeOption: [5, 10, 15, 20],
              pageSize: 10,
              subTableDataAccessKey: "permission",
            },
            defaultRecords: [...res.records],
            subTableConfigs: {
              titles: res.subTableConfigs.titles,
              displayColumns: [...Object.keys(res.subTableConfigs.titles)],
              columns: [...subTablecolumns],
              sortableColumns: res.subTableConfigs.sortableColumns,
              filerableColumns: res.subTableConfigs.filerableColumns,
              booleanColumns: res.subTableConfigs.booleanColumns,
              dateColumns: res.subTableConfigs.dateColumns,
              hasPaginator: false,
            },
          },
        };
        console.log(res);
        // this.setTableData(res);
        // this.applyFilter(this.filterText);
      });
  }

  // private setTableData(currentSettingData: any) {
  //   this.displayedColumns = [];
  //   this.columns == [];
  //   this.dataSource = new MatTableDataSource<any>(currentSettingData);
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.pageinator;

  //   this.dataSource.sortData = (item, sort) => {
  //     return item.sort((a, b) => {
  //       const x =
  //         a[sort.active] > b[sort.active]
  //           ? 1
  //           : a[sort.active] < b[sort.active]
  //           ? -1
  //           : 0;
  //       return (
  //         x *
  //         (sort.direction === "asc" ? 1 : sort.direction === "desc" ? -1 : 0)
  //       );
  //     });
  //   };

  //   this.dataSource.filterPredicate = (data, filter: string): boolean => {
  //     filter = filter.toLowerCase();
  //     return (
  //       data.employeeId.toLowerCase().includes(filter) ||
  //       data.name.toLowerCase().includes(filter) ||
  //       data.userName.toLowerCase().includes(filter) ||
  //       data.passCode.toLowerCase().includes(filter) ||
  //       data.role.toLowerCase().includes(filter) ||
  //       data.status.toLowerCase().includes(filter)
  //     );
  //   };
  // }

  public applyFilter(filterValue: string) {
    this.filterText = filterValue.trim();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public onUserGenerate() {
    this.openDialog();
  }

  public onUserEditClick(user) {
    this.openDialog(true, user);
  }

  private openDialog(
    isUpdate: boolean = false,
    user: any = null,
    errorMsg: string = ""
  ) {
    const dialogRef = this._dialog.open(UserDialogBoxComponent, {
      data: {
        isUpdate,
        user,
      },
      panelClass: "user-dialog-container",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result:`, result);
      if (result) {
        this._notification.success(result.message);
        this.highlightSelectedRecord(isUpdate ? user : result.data);
      }
      // this.getUsersList();
    });
  }

  public onUserViewClick(user) {
    const dialogRef = this._dialog.open(ViewUserDialogBoxComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.highlightSelectedRecord(user);
    });
  }

  public highlightSelectedRecord(user) {
    this.selectedRowIndex = user.accessCode;
    setTimeout(() => {
      this.selectedRowIndex = -1;
    }, 1000);
  }
}
