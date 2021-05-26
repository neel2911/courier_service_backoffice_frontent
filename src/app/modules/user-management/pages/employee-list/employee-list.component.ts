import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { map } from "rxjs/operators";
import { MatNotificationService } from "src/app/modules/material/services/mat-notification.service";
import { EmployeeStatus } from "src/app/modules/shared/enum/enum";
import { HistoryDialogBoxComponent } from "../../components/history-dialog-box/history-dialog-box.component";
import { UserDialogBoxComponent } from "../../components/user-dialog-box/user-dialog-box.component";
import { ViewUserDialogBoxComponent } from "../../components/view-user-dialog-box/view-user-dialog-box.component";
import { Employee } from "../../model/employee";
import { UserManagementService } from "../../services/user-management.service";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeListComponent implements OnInit {
  get EmployeeStatus() {
    return EmployeeStatus;
  }
  public pageSizeOption = [5, 10, 15, 20];
  public pageSize = 10;
  public displayedColumns = [
    "employeeId",
    "name",
    "userName",
    "passCode",
    "contactNumber",
    "role",
    "accessStartDate",
    "lastLoggedIn",
    "status",
    "more",
  ];
  public dataSource: MatTableDataSource<Employee>;
  public filterText = "";
  public selectedRowIndex = -1;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) pageinator: MatPaginator;

  constructor(
    private _userManagementService: UserManagementService,
    private _dialog: MatDialog,
    private _notification: MatNotificationService
  ) {}

  ngOnInit() {
    this._userManagementService
      .getUsersList()
      .pipe(
        map((val: any) => {
          return val.hasOwnProperty("data") ? val : { data: val };
        }),
        map((val: any) =>
          val.data.map((v) => this._userManagementService.parseUserObj(v, true))
        )
      )
      .subscribe((list) => {
        this.getUsersList(list);
        this.applyFilter(this.filterText);
      });
  }

  private getUsersList(employeeList: Employee[]) {
    this.dataSource = new MatTableDataSource<Employee>(employeeList);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.pageinator;

    this.dataSource.sortData = (item, sort) => {
      if (sort.active === "accessStartDate") {
        return item.sort((a, b) => {
          let x = 0;
          if (a.accessStartDate > b.accessStartDate) {
            x = 1;
          } else if (
            // a.sessionStartDate.getTime() === b.sessionStartDate.getTime()
            a.accessStartDate === b.accessStartDate
          ) {
            x =
              a.accessEndDate > b.accessEndDate
                ? 1
                : a.accessEndDate < b.accessEndDate
                ? -1
                : x;
          } else {
            x = -1;
          }
          return (
            x *
            (sort.direction === "asc" ? 1 : sort.direction === "desc" ? -1 : 0)
          );
        });
      }

      return item.sort((a, b) => {
        const x =
          a[sort.active] > b[sort.active]
            ? 1
            : a[sort.active] < b[sort.active]
            ? -1
            : 0;
        return (
          x *
          (sort.direction === "asc" ? 1 : sort.direction === "desc" ? -1 : 0)
        );
      });
    };

    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      filter = filter.toLowerCase();
      return (
        data.employeeId.toLowerCase().includes(filter) ||
        data.name.toLowerCase().includes(filter) ||
        data.userName.toLowerCase().includes(filter) ||
        data.passCode.toLowerCase().includes(filter) ||
        data.role.toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter)
      );
    };
  }

  public applyFilter(filterValue: string) {
    this.filterText = filterValue.trim();
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  public openHistoryDialog(user) {
    this._userManagementService
      .getUserHistory(user.userId)
      .pipe(map((val: any) => val.data))
      .subscribe((list: any) => {
        const dialogRef = this._dialog.open(HistoryDialogBoxComponent, {
          width: "500px",
          height: "500px",
          data: list,
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.highlightSelectedRecord(user);
        });
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
