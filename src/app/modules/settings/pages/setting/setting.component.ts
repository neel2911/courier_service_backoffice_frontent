import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NavigationEnd, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { MatNotificationService } from "src/app/modules/material/services/mat-notification.service";
import { EmployeeStatus } from "src/app/modules/shared/enum/enum";
import { UserDialogBoxComponent } from "src/app/modules/user-management/components/user-dialog-box/user-dialog-box.component";
import { ViewUserDialogBoxComponent } from "src/app/modules/user-management/components/view-user-dialog-box/view-user-dialog-box.component";
import { RolesDialogBoxComponent } from "../../components/roles-dialog-box/roles-dialog-box.component";
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
    roles: "Manage Roles",
  };
  public filterText = "";
  public tableData = null;
  public selectedRowIndex = -1;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) pageinator: MatPaginator;

  constructor(
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
      .getRoleList()
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
        columns.push({ field: "actions" });
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
              titles: { ...res.mainTableConfigs.titles, actions: "Actions" },
              displayColumns: [
                ...Object.keys(res.mainTableConfigs.titles),
                "actions",
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
      });
  }

  public applyFilter(filterValue: string) {
    this.filterText = filterValue.trim();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public onAddRoleClick() {
    this.openRoleDialog();
  }

  onTableEmitter(e) {
    switch (this.currentSetting) {
      case "roles":
        this.onUpdateRoleClick(e.data);
        break;
    }
    console.log(e);
  }

  public onUpdateRoleClick(row) {
    this.openRoleDialog(true, row);
  }

  private openRoleDialog(
    isUpdate: boolean = false,
    data: any = null,
    errorMsg: string = ""
  ) {
    const dialogRef = this._dialog.open(RolesDialogBoxComponent, {
      data: {
        isUpdate,
        data,
      },
      panelClass: `${this.currentSetting.toLowerCase()}-dialog-container`,
      height: "80vh",
      width: "80vw",
      minWidth: "80vw",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result:`, result);
      if (result) {
        this._notification.success(result.message);
        this.highlightSelectedRecord(isUpdate ? data : result.data);
      }
      // this.getUsersList();
    });
  }

  public highlightSelectedRecord(row) {
    this.selectedRowIndex = row.accessCode;
    setTimeout(() => {
      this.selectedRowIndex = -1;
    }, 1000);
  }
}
